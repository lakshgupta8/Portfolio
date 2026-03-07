import { google } from "googleapis";
import { oauth2Client } from "./auth";
import type { EmailInput } from "./types";

function createRawEmail(input: EmailInput): string {
    const email = [
        `From: "${input.name}" <${input.senderEmail}>`,
        `To: ${input.receiverEmail}`,
        `Subject: Message from ${input.name}`,
        "",
        input.senderEmail,
        input.message
    ].join("\n");

    return Buffer.from(email)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function sendEmail(input: EmailInput) {
    const gmail = google.gmail({
        version: "v1",
        auth: oauth2Client
    });

    const raw = createRawEmail(input);

    try {
        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw
            }
        });
    } catch (error: any) {
        if (error.message.includes('invalid_grant')) {
            throw new Error('Authentication expired. Please re-authorize at /auth');
        }
        throw error;
    }
}
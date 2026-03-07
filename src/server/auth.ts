import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

export const SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
];

const TOKEN_PATH = "tokens.json";

// Load tokens: prefer GMAIL_TOKENS env var (for Render), fall back to tokens.json (local dev)
function loadTokens() {
    if (process.env.GMAIL_TOKENS) {
        try {
            const tokens = JSON.parse(process.env.GMAIL_TOKENS);
            oauth2Client.setCredentials(tokens);
            console.log("Loaded tokens from GMAIL_TOKENS env var");
            return;
        } catch (error) {
            console.error("Error parsing GMAIL_TOKENS env var:", error);
        }
    }

    try {
        if (fs.existsSync(TOKEN_PATH)) {
            const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
            oauth2Client.setCredentials(tokens);
            console.log("Loaded saved tokens from tokens.json");
        }
    } catch (error) {
        console.error("Error loading tokens from file:", error);
    }
}

loadTokens();

export function getAuthUrl() {
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
    });
}

export async function setCredentials(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save to file for local dev
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log("Tokens saved to tokens.json");

    // Log tokens so they can be copied to GMAIL_TOKENS env var on Render
    console.log("\n=== Copy the following value to your GMAIL_TOKENS env var on Render ===");
    console.log(JSON.stringify(tokens));
    console.log("=== End of tokens ===\n");
}

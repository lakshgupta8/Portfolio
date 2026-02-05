import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:3000/oauth2callback"
);

export const SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
];

const TOKEN_PATH = "tokens.json";

try {
    if (fs.existsSync(TOKEN_PATH)) {
        const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
        oauth2Client.setCredentials(tokens);
        console.log("Loaded saved tokens from tokens.json");
    }
} catch (error) {
    console.error("Error loading tokens:", error);
}

export function getAuthUrl() {
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
    });
}

export async function setCredentials(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log("Tokens saved to tokens.json");
}

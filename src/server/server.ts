import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { getAuthUrl, setCredentials } from "./auth";
import { sendEmail } from "./gmail";
import type { EmailInput } from "./types";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173"
}));

app.use(express.json());

// --- API Routes ---

app.get("/auth", (_req, res) => {
    res.redirect(getAuthUrl());
});

app.get("/oauth2callback", async (req, res) => {
    const code = req.query.code as string;
    await setCredentials(code);
    res.send("Authentication successful");
});

app.post("/send", async (req, res) => {
    const input = req.body as EmailInput;

    try {
        await sendEmail(input);
        res.json({ success: true });
    } catch (error: unknown) {
        console.error("Error in /send:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        res.status(500).json({ 
            error: 'Failed to send message',
            details: errorMessage
        });
    }
});

// --- Serve static frontend (production) ---

const distPath = path.resolve(process.cwd(), "dist");

if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    app.get("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}

// --- Start server ---

const PORT = process.env.PORT || 10000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export { app };
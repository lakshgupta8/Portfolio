import express from "express";
import cors from "cors";
import { getAuthUrl, setCredentials } from "./auth.ts";
import { sendEmail } from "./gmail.ts";
import type { EmailInput } from "./types";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

    await sendEmail(input);

    res.json({ success: true });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

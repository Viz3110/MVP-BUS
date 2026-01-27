import prisma from "../utils/prisma.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name } = ticket.getPayload();

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, name: name || "", phone: "" }
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    return res.json({ success: true, user, token });

  } catch (err) {
    console.error("Google login error:", err);
    return res
      .status(400)
      .json({ success: false, message: "Google authentication failed" });
  }
};

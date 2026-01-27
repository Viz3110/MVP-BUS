import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin)
      return res.status(404).json({ success: false, message: "Admin not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid)
      return res.status(401).json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error("adminLogin error:", err);
    res.status(500).json({ success: false });
  }
};

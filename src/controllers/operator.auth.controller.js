import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const operatorRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await prisma.operator.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const operator = await prisma.operator.create({
      data: { name, email, password: hashed }
    });

    return res.json({ success: true, operator });
  } catch (err) {
    console.error("operatorRegister error:", err);
    res.status(500).json({ success: false });
  }
};

export const operatorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const operator = await prisma.operator.findUnique({ where: { email } });
    if (!operator) return res.status(404).json({ success: false, message: "Not found" });

    const match = await bcrypt.compare(password, operator.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: operator.id, role: "operator" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ success: true, token, operator });

  } catch (err) {
    console.error("operatorLogin error:", err);
    res.status(500).json({ success: false });
  }
};

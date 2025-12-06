import jwt from "jsonwebtoken";

export default function operatorAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "operator")
      return res.status(403).json({ success: false, message: "Forbidden" });

    req.operator = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

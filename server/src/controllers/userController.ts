import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import UserModel from "../models/User";

export async function getMyProfileController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = await UserModel.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
  });
}

export async function updateMyProfileController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const updates: Record<string, string> = {};
  if (req.body.name) updates.name = String(req.body.name);
  if (req.body.email) updates.email = String(req.body.email).toLowerCase();
  if (req.body.phone) updates.phone = String(req.body.phone);
  if (req.body.username) updates.username = String(req.body.username).toLowerCase();

  if (updates.email) {
    const existing = await UserModel.findOne({ email: updates.email, _id: { $ne: req.user.userId } });
    if (existing) return res.status(409).json({ message: "Email already exists" });
  }

  if (updates.username) {
    const existing = await UserModel.findOne({ username: updates.username, _id: { $ne: req.user.userId } });
    if (existing) return res.status(409).json({ message: "Username already exists" });
  }

  const user = await UserModel.findByIdAndUpdate(req.user.userId, updates, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
  });
}

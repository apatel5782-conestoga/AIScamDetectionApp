import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { env } from "../config/env";
import UserModel from "../models/User";

function signToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });
}

async function generateUniqueUsername(base: string) {
  const normalized = base.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const seed = normalized.length > 0 ? normalized : "user";
  let candidate = seed;
  let counter = 0;

  while (await UserModel.exists({ username: candidate })) {
    counter += 1;
    candidate = `${seed}_${counter}`;
  }

  return candidate;
}

async function ensureDemoUser(role: "user" | "admin") {
  const email = role === "admin" ? "demo.admin@fraudtriage.local" : "demo.user@fraudtriage.local";
  const name = role === "admin" ? "Demo Admin Reviewer" : "Demo Triage User";
  const username = role === "admin" ? "demo_admin" : "demo_user";

  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel.create({
      name,
      username,
      email,
      phone: "(555) 010-0000",
      passwordHash: await bcrypt.hash(`demo-${role}-password`, 12),
      role,
    });
  }

  return user;
}

export async function registerController(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, phone } = req.body;
  const existing = await UserModel.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already exists" });

  const username = await generateUniqueUsername(String(email).split("@")[0] || name);
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.create({ name, email, phone, username, passwordHash, role: "user" });

  const token = signToken(String(user._id), user.role);
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, username: user.username, email: user.email, phone: user.phone, role: user.role },
  });
}

export async function loginController(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { identifier, password } = req.body;
  const user = await UserModel.findOne({
    $or: [{ email: String(identifier).toLowerCase() }, { username: String(identifier).toLowerCase() }],
  });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(String(user._id), user.role);
  res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, phone: user.phone, role: user.role } });
}

export async function forgotPasswordController(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email } = req.body;
  const user = await UserModel.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    return res.status(200).json({ message: "If the email exists, reset instructions will be sent." });
  }

  return res.status(200).json({ message: "If the email exists, reset instructions will be sent." });
}

export async function demoLoginController(req: Request, res: Response) {
  const role = req.body.role === "admin" ? "admin" : "user";
  const user = await ensureDemoUser(role);
  const token = signToken(String(user._id), user.role);

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
}

// controllers/auth.js
import { pool } from "../utils/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../utils/error.js";
dotenv.config();

// -----------------------------
// Register
// -----------------------------
export const register = async (req, res, next) => {
  try {
    const { username, email, password, role_id } = req.body; // 1=admin, 2=client, 3=user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let table;
    switch (role_id) {
      case 1:
        table = "admins";
        break;
      case 2:
        table = "clients";
        break;
      case 3:
      default:
        table = "users";
        break;
    }

    await pool.query(
      `INSERT INTO ${table} (username, email, password) VALUES ($1, $2, $3)`,
      [username, email, hash]
    );

    res.status(200).json(`${table.slice(0, -1)} has been created.`); // e.g., admin, client, user
  } catch (err) {
    if (err.code === "23505") {
      return next(createError(400, "Username or email already exists"));
    }
    next(err);
  }
};

// -----------------------------
// Login
// -----------------------------
export const login = async (req, res, next) => {
  try {
    const { username, password, role_id } = req.body;

    let table;
    switch (role_id) {
      case 1:
        table = "admins";
        break;
      case 2:
        table = "clients";
        break;
      case 3:
      default:
        table = "users";
        break;
    }

    const result = await pool.query(
      `SELECT * FROM ${table} WHERE username = $1`,
      [username]
    );

    if (result.rows.length === 0)
      return next(createError(404, `User not found in ${table}!`));

    const user = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    // JWT contains id and role_id
    const token = jwt.sign(
      { id: user.id, role_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pwd, ...otherDetails } = user;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ ...otherDetails, role_id });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  res.json({ message: "Logged out successfully" });
};

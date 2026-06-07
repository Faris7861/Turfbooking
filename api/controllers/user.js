import { pool } from "../utils/db.js";


export const updateUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET username = $1, email = $2
       WHERE id = $3
       RETURNING *`,
      [username, email, req.params.id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await pool.query(
      "DELETE FROM users WHERE id = $1",
      [req.params.id]
    );

    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [req.params.id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

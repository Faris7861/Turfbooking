import { pool } from "../utils/db.js";


export const updateClient = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const result = await pool.query(
      `UPDATE clients
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

export const deleteClient = async (req, res, next) => {
  try {
    await pool.query(
      "DELETE FROM clients WHERE id = $1",
      [req.params.id]
    );

    res.status(200).json("Client has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getClient = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clients WHERE id = $1",
      [req.params.id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getClients = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM clients");
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

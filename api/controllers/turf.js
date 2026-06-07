import { pool } from "../utils/db.js";
import generateSlots from "../utils/slots.js";

export const getAvailability = async (req, res) => {
  const turfId = req.params.id;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  try {
    const turfRes = await pool.query(
      "SELECT open_time, close_time FROM turfs WHERE id = $1",
      [turfId],
    );

    if (turfRes.rows.length === 0) {
      return res.status(404).json({ message: "Turf not found" });
    }

    const { open_time, close_time } = turfRes.rows[0];

    const bookingRes = await pool.query(
      `SELECT start_time::time(0) AS start_time, end_time::time(0) AS end_time
       FROM bookings

       WHERE turf_id = $1
         AND booking_date = $2::date
         AND status = 'confirmed'`,
      [turfId, date],
    );

    const slots = generateSlots(open_time, close_time);

    const availability = slots.map((slot) => {
      const isBooked = bookingRes.rows.some(
        (b) =>
          !(b.end_time <= slot.start_time || b.start_time >= slot.end_time),
      );

      return {
        ...slot,
        available: !isBooked,
      };
    });

    return res.json(availability);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch availability" });
  }
};

export const createBooking = async (req, res) => {
  const { turf_id, user_id, booking_date, start_time, end_time } = req.body;

   // get username from DB
    const userResult = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [user_id]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const username = userResult.rows[0].username;

  if (!turf_id || !user_id || !username || !booking_date || !start_time || !end_time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // normalize date to YYYY-MM-DD
    const normalizedDate = booking_date.split("T")[0] || booking_date;

    // conflict check
    const conflict = await pool.query(
      `SELECT 1 FROM bookings
       WHERE turf_id = $1
       AND booking_date = $2::date
       AND NOT (end_time <= $3::time OR start_time >= $4::time)`,
      [turf_id, normalizedDate, start_time, end_time],
    );

    if (conflict.rows.length > 0) {
      return res.status(409).json({ message: "Slot already booked" });
    }

    // insert booking
    const result = await pool.query(
      `INSERT INTO bookings (turf_id, user_id, username, booking_date, start_time, end_time, status)
       VALUES ($1, $2, $3, $4::date, $5::time, $6::time, 'confirmed')
       RETURNING *`,
      [turf_id, user_id, username, normalizedDate, start_time, end_time],
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Booking failed" });
  }
};

export const createOfflineBooking = async (req, res, next) => {
  const { turf_id, user_id, booking_date, start_time, end_time } = req.body;

  // get username from DB
    const userResult = await pool.query(
      "SELECT username FROM clients WHERE id = $1",
      [user_id]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const username = userResult.rows[0].username;


  if (!turf_id || !user_id || !username || !booking_date || !start_time || !end_time) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    // normalize date to YYYY-MM-DD
    const normalizedDate = booking_date.split("T")[0] || booking_date;

    // conflict check
    const conflict = await pool.query(
      `SELECT 1 FROM bookings
       WHERE turf_id = $1
       AND booking_date = $2::date
       AND NOT (end_time <= $3::time OR start_time >= $4::time)`,
      [turf_id, normalizedDate, start_time, end_time],
    );

    if (conflict.rows.length > 0) {
      return res.status(409).json({ message: "Slot already booked" });
    }

    // insert booking
    const result = await pool.query(
      `INSERT INTO bookings (turf_id, user_id, username, booking_date, start_time, end_time, status)
       VALUES ($1, $2, $3, $4::date, $5::time, $6::time, 'confirmed')
       RETURNING *`,
      [turf_id, user_id, username, normalizedDate, start_time, end_time],
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Booking failed" });
  }
}

export const createTurf = async (req, res, next) => {
  try {
    const clientId = req.user.id; // <- the logged-in client's id

    const keys = Object.keys(req.body);
    const values = Object.values(req.body);

    // Add client_id to the query
    keys.push("client_id");
    values.push(clientId);

    const columns = keys.join(", ");
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO turfs (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateTurf = async (req, res, next) => {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

    const query = `
      UPDATE turfs
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, req.params.id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteTurf = async (req, res, next) => {
  try {
    await pool.query("DELETE FROM turfs WHERE id = $1", [req.params.id]);

    res.status(200).json("Turf has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getTurf = async (req, res, next) => {
  const { search } = req.query;

  let query = "SELECT * FROM turfs";
  let values = [];

  if (search) {
    query += `
      WHERE name ILIKE $1
         OR city ILIKE $1
    `;
    values.push(`%${search}%`);
  }

  const result = await pool.query(query, values);
  res.status(200).json(result.rows);
};

export const getTurfs = async (req, res, next) => {
  const { search } = req.query;

  let query = "SELECT * FROM turfs";
  let values = [];

  if (search) {
    query += `
      WHERE name ILIKE $1
         OR city ILIKE $1
    `;
    values.push(`%${search}%`);
  }

  const result = await pool.query(query, values);
  res.status(200).json(result.rows);
};


export const getTurfsByClient = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const result = await pool.query(
      "SELECT id FROM turfs WHERE client_id = $1",
      [clientId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const { turfId } = req.params;
    const { date } = req.query;

    const result = await pool.query(
      `SELECT * FROM bookings
       WHERE turf_id = $1
       AND ($2::date IS NULL OR booking_date = $2::date)`,
      [turfId, date]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};


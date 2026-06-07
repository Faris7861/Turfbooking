import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import { pool } from "./db.js";

// -----------------------------
// Base token verification
// -----------------------------
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user; // { id, role_id }
    next();
  });
};

// -----------------------------
// Verify a user can access their own resources (or admins)
// -----------------------------
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    // role_id 1 = admin
    if (req.user.id === parseInt(req.params.id) || req.user.role_id === 1) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// -----------------------------
// Verify only admins
// -----------------------------
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role_id === 1) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// -----------------------------
// Verify only clients
// -----------------------------
export const verifyClient = (req, res, next) => {
  verifyToken(req, res, () => {
    // Only allow:
    // - the client themselves (req.user.id === params.id)
    // - OR admin (role 1)
    if (req.user.role_id === 2 && req.user.id === parseInt(req.params.id)) {
      next();
    } else if (req.user.role_id === 1) {
      next(); // admin override
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyIfClient = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role_id === 2) {
      next();
    } else {
      return next(createError(403, "Only clients can perform this action"));
    }
  });
};


// -----------------------------
// Verify only regular users
// -----------------------------
export const verifyRegularUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role_id === 3) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};



export const verifyTurfOwner = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const turfId = req.params.id;

      const result = await pool.query(
        "SELECT * FROM turfs WHERE id = $1",
        [turfId]
      );

      if (result.rowCount === 0) {
        return next(createError(404, "Turf not found"));
      }

      const turf = result.rows[0];

      // Allow if:
      // 1. Admin (role_id = 1)
      // 2. Client owns the turf
      if (req.user.role_id === 1 || (req.user.role_id === 2 && turf.client_id === req.user.id)) {
        next();
      } else {
        return next(createError(403, "You are not authorized to modify this turf"));
      }
    } catch (err) {
      next(err);
    }
  });
};

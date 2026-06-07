import express from "express";
import { verifyAdmin, verifyClient, verifyIfClient, verifyTurfOwner, verifyUser } from "../utils/verifyToken.js";
import { createBooking, createOfflineBooking, createTurf, deleteTurf, getAvailability, getBookings, getTurf, getTurfs, getTurfsByClient, updateTurf } from "../controllers/turf.js";

const router = express.Router();

router.post("/", verifyIfClient, createTurf);
router.put("/:id", verifyTurfOwner, updateTurf);
router.delete("/:id", verifyTurfOwner, deleteTurf);
router.get("/:id", getTurf);
router.get("/",getTurfs);

router.get("/:id/availability", getAvailability);
router.post("/bookings",  createBooking);
router.post("/bookings/offline",  createOfflineBooking);
router.get("/bookings/:turfId", getBookings)
router.get("/client/:clientId",  getTurfsByClient);

export default router;
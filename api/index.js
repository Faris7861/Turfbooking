import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { connect } from "./utils/db.js";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import clientRoute from "./routes/clients.js";
import turfRoute from "./routes/turfs.js";

dotenv.config();
const app = express();


app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/clients", clientRoute);
app.use("/api/turfs", turfRoute);

app.listen(8800, () => {
  connect();
  console.log("Server running on http://localhost:8800");
});

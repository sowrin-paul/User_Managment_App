import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/usrRoutes.js";
import authMiddleware from "./middlewares/authMiddleware.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

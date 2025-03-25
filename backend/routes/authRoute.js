import { Router } from "express";
import { hash, compare } from "bcryptjs";
import pkg from "jsonwebtoken";
import User, { findOne, findById, getUsers, updateUserStatus, deleteUser } from "../models/user.js";
// import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();
const { sign, verify } = pkg;

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey2002";


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = verify(token, JWT_SECRET);
        req.user = decoded;

        const user = await findById(req.user.userId);
        if (!user || user.status === "blocked") {
            return res.status(403).json({ message: "Access denied. User is blocked." });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token" });
    }
};

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hash(password, 10);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = sign({ userId: user._id, status: user.status }, JWT_SECRET, { expiresIn: "1h" });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                status: user.status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/users", authMiddleware, async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/users/:action", authMiddleware, async (req, res) => {
    const { action } = req.params;
    const { userIds } = req.body;

    if (!["block", "unblock"].includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
    }

    try {
        const status = action === "block" ? "blocked" : "active";
        await updateUserStatus(userIds, status);
        res.json({ message: `${action.charAt(0).toUpperCase() + action.slice(1)}ed successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/users", authMiddleware, async (req, res) => {
    const { userIds } = req.body;

    try {
        await deleteUser(userIds);
        res.json({ message: "Users deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "./database.mts";
import cors from "cors";
import jwt from "jsonwebtoken";

const router = Router();

const allowedOrigins = [
  "http://localhost:5173",
  "https://precede-ptda.netlify.app",
];

router.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Create a new researcher account
router.post("/create", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    // Check if the username already exists
    const existingUser = await pool.query(
      "SELECT username FROM researcher WHERE username = $1",
      [username]
    );

    if ((existingUser.rowCount ?? 0) > 0) {
      res.status(409).json({ message: "Username is already taken" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the researcher's account
    pool.query(
      "INSERT INTO researcher (username, password) VALUES ($1, $2)",
      [username, hashedPassword],
      (error) => {
        if (error) {
          throw error;
        }

        res
          .status(201)
          .json({ message: `Researcher account created successfully` });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Login a researcher
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    // Query the database for the researcher by username
    const result = await pool.query(
      "SELECT * FROM researcher WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    const researcher = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, researcher.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Ensure JWT secret exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Create JWT token
    const token = jwt.sign(
      { id: researcher.researcherid, username: researcher.username },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      researcher: {
        id: researcher.researcherid,
        username: researcher.username,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/me", async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export { router };

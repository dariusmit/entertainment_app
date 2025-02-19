import express, { Request, Response, NextFunction } from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "",
  database: process.env.DB_NAME,
});

type User = {
  id: number;
  email: string;
};

function generateAccessToken(user: User): string {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
}

function generateRefreshToken(user: User): string {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string);
}

app.post("/register", async (req: Request, res: Response) => {
  const sqlSelect = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
  const sqlInsert = `INSERT INTO users (email, password) VALUES (?, ?)`;
  const { email, password } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    db.query(sqlSelect, [email], (err, results: any) => {
      if (err) return res.json({ error: err.message });

      if (results[0].count === 1) {
        return res.json({ error: "User already exists" });
      }

      db.query(sqlInsert, [email, encryptedPassword], (err) => {
        if (err) return res.json({ error: err.message });
        return res.json({
          message: "User registered successfully. Sign in now.",
        });
      });
    });
  } catch (err) {
    return res.json({ error: (err as Error).message });
  }
});

app.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;

  db.query(sql, [email], async (err, results: any) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (results.length === 0)
      return res.status(400).json({ error: "User does not exist" });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({ error: "Incorrect password" });

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", accessToken });
  });
});

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Not authenticated request" });

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, user: any) => {
      if (err) return res.status(403).json({ error: "Token no longer valid" });
      req.user = { id: user.id, email: user.email };
      next();
    }
  );
}

app.listen(8081, () => {
  console.log("Listening on port 8081");
});

export default app;

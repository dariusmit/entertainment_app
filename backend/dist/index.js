import express from "express";
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
const allowedOrigins = process.env.MODE === "dev"
    ? ["http://localhost:5173"]
    : [
        "https://entertainment-app-frontend-gamma.vercel.app",
        "https://entertainment-app-frontend-git-master-darius-molotokas-projects.vercel.app",
        "https://entertainment-app-frontend-darius-molotokas-projects.vercel.app",
    ];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.MODE === "dev" ? "" : process.env.DB_PASS,
    database: process.env.DB_NAME,
});
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
}
function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}
app.post("/register", (req, res) => {
    const sqlSelect = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
    const sqlInsert = `INSERT INTO users (email, password) VALUES (?, ?)`;
    const { email, password } = req.body;
    bcrypt.hash(password, 10, (hashErr, encryptedPassword) => {
        if (hashErr)
            return res.json({ error: hashErr.message });
        db.query(sqlSelect, [email], (err, results) => {
            if (err)
                return res.json({ error: err.message });
            if (results[0].count === 1) {
                return res.json({ error: "User already exists" });
            }
            db.query(sqlInsert, [email, encryptedPassword], (err) => {
                if (err)
                    return res.json({ error: err.message });
                return res.json({
                    message: "User registered successfully. Sign in now.",
                });
            });
        });
    });
});
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err)
            return res.status(500).json({ error: "Internal server error" });
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
            secure: process.env.MODE === "dev" ? false : true,
            sameSite: process.env.MODE === "dev" ? "lax" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ message: "Login successful", accessToken });
    });
});
app.post("/refreshtoken", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshSecret) {
        res.status(500).json({ error: "Missing REFRESH_TOKEN_SECRET" });
        return;
    }
    jwt.verify(refreshToken, refreshSecret, (err, decodedUser) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        const NewAccessToken = generateAccessToken({
            id: decodedUser.id,
            email: decodedUser.email,
        });
        res.json({ accessToken: NewAccessToken });
        return;
    });
});
app.post("/logout", authenticateToken, (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
});
function alreadyBookmarked(id, content_id, content_type) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS count FROM ${content_type === `movie` ? `b_user_movies` : `b_user_series`} WHERE user_id = ? AND id = ?`;
        db.query(sql, [id, content_id], (err, results) => {
            if (err) {
                console.error("Database error:", err.message);
                return reject(err);
            }
            if (!results || results.length === 0) {
                console.warn("No results returned from database");
                return resolve(false);
            }
            const count = results[0].count;
            resolve(count === 1);
        });
    });
}
app.post("/is_bookmarked", authenticateToken, async (req, res) => {
    const userID = req.user.id;
    const { id: content_id, media_type: content_type } = req.body;
    try {
        const recordExists = await alreadyBookmarked(userID, content_id, content_type);
        res.json({ isBookmarked: recordExists });
        return;
    }
    catch (error) {
        console.error("Error in /is_bookmarked route:", error.message);
        res.status(500).json({ error: "Database error" });
        return;
    }
});
app.post("/bookmark_item", authenticateToken, async (req, res) => {
    const userID = req.user.id;
    const { id: movie_id, movies: movies_list, media_type: media_type, } = req.body;
    const specific_movie = movies_list.find((movie) => movie.id === movie_id);
    try {
        const sql = `INSERT INTO ${media_type === `movie` ? `b_user_movies` : `b_user_series`} (user_id, id, ${media_type === `movie` ? `title` : `name`}, poster_path, backdrop_path, ${media_type === `movie` ? `release_date` : `first_air_date`}, vote_average) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const isBookmarked = await alreadyBookmarked(userID, movie_id, media_type);
        if (!isBookmarked) {
            db.query(sql, [
                userID,
                movie_id,
                media_type === "movie" ? specific_movie.title : specific_movie.name,
                specific_movie.poster_path,
                specific_movie.backdrop_path,
                media_type === "movie"
                    ? specific_movie.release_date
                    : specific_movie.first_air_date,
                specific_movie.vote_average,
            ], (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({
                    message: `Content with id ${movie_id} was bookmarked`,
                });
                return;
            });
        }
        else {
            res.json({ message: "Already bookmarked" });
            return;
        }
    }
    catch (error) {
        console.error("Error in /bookmark_item:", error);
        res.status(500).json({ error: "Database error" });
        return;
    }
});
app.post("/remove_bookmarked_item", authenticateToken, async (req, res) => {
    const userID = req.user.id;
    const { id: movie_id, media_type: media_type } = req.body;
    try {
        const isBookmarked = await alreadyBookmarked(userID, movie_id, media_type);
        if (!isBookmarked) {
            res.json({
                message: "Aleary not bookmarked, nothing to delete",
            });
            return;
        }
        const sql_delete = `DELETE FROM ${media_type === `movie` ? `b_user_movies` : `b_user_series`} WHERE user_id = ? AND id = ?`;
        db.query(sql_delete, [userID, movie_id], (err) => {
            if (err) {
                res.json({ error: err.message });
                return;
            }
            res.json({
                message: `Content with id ${movie_id} was removed from bookmarks`,
            });
            return;
        });
    }
    catch (error) {
        console.error("Error in /remove_bookmarked_item:", error);
        res.status(500).json({ error: "Database error" });
        return;
    }
});
app.post("/retreive_bookmarked_movies", authenticateToken, (req, res) => {
    const userID = req.user.id;
    const sql = `SELECT * FROM b_user_movies WHERE user_id = ?`;
    db.query(sql, [userID], (err, results) => {
        if (err)
            return res.json(err.message);
        return res.json(results);
    });
});
app.post("/retreive_bookmarked_series", authenticateToken, (req, res) => {
    const userID = req.user.id;
    const sql = `SELECT * FROM b_user_series WHERE user_id = ?`;
    db.query(sql, [userID], (err, results) => {
        if (err)
            return res.json(err.message);
        return res.json(results);
    });
});
app.post("/get_bookmarked_items", authenticateToken, async (req, res) => {
    const userID = req.user.id;
    if (!userID) {
        res.json({ error: "User ID not found" });
        return;
    }
    try {
        const sql_movies = `
      SELECT id, title, poster_path, backdrop_path, release_date, vote_average 
      FROM b_user_movies 
      WHERE user_id = ?`;
        const sql_series = `
      SELECT id, name AS title, poster_path, backdrop_path, first_air_date AS release_date, vote_average 
      FROM b_user_series 
      WHERE user_id = ?`;
        const movies = await new Promise((resolve, reject) => {
            db.query(sql_movies, [userID], (err, results) => {
                if (err)
                    return reject(err);
                resolve(results);
            });
        });
        const series = await new Promise((resolve, reject) => {
            db.query(sql_series, [userID], (err, results) => {
                if (err)
                    return reject(err);
                resolve(results);
            });
        });
        res.json({ movies, series });
        return;
    }
    catch (error) {
        console.error("Error in /get_bookmarked_items:", error);
        res.status(500).json({ error: "Database error" });
        return;
    }
});
app.post("/search_bookmarks", authenticateToken, (req, res) => {
    const userID = req.user.id;
    const query = `%${req.query.search}%`; //Wildcard required for LIKE operator to work
    if (!query) {
        res.status(400).json({ error: "Missing search query" });
        return;
    }
    const sql = `SELECT id, title, NULL AS name, poster_path, backdrop_path, release_date, NULL AS first_air_date, vote_average
  FROM b_user_movies 
  WHERE user_id = ? AND title LIKE ? 
  UNION ALL 
  SELECT id, NULL AS title, name, poster_path, backdrop_path, NULL AS release_date, first_air_date, vote_average
  FROM b_user_series 
  WHERE user_id = ? AND name LIKE ?`;
    db.query(sql, [userID, query, userID, query], (err, results) => {
        if (err)
            return res.status(500).json({ Error: err.message });
        //Remove null values
        const cleanResults = results.map((item) => {
            return Object.fromEntries(Object.entries(item).filter(([key, value]) => value !== null));
        });
        return res.json(cleanResults);
    });
});
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Not authenticated request" });
        return;
    }
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        res.status(500).json({ error: "Missing ACCESS_TOKEN_SECRET" });
        return;
    }
    jwt.verify(token, secret, (err, user) => {
        if (err)
            return res.status(403).json({ error: "Token no longer valid" });
        req.user = { id: user.id, email: user.email };
        next();
    });
}
app.listen(8081, () => {
    console.log("Listening on port 8081");
});
export default app;

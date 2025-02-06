"use strict";

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();

env.config();

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

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

app.post("/register", async (req, res) => {
  const sql_select = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
  const sql_insert = `INSERT INTO users (email, password) VALUES (?, ?)`;
  const email = req.body.email;
  const password = req.body.password;
  let userExists;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    db.query(sql_select, [email], (err, results) => {
      if (err) return res.json(err.message);

      const count = results[0].count;

      userExists = count === 1;

      if (!userExists) {
        db.query(sql_insert, [email, encryptedPassword], (err) => {
          if (err) return res.json(err.message);
          return res.json({
            message: "User registered successfully. Sign in now.",
          });
        });
      } else {
        return res.json({ error: "User already exists" });
      }
    });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;

  try {
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "User does not exist" });
      }

      const user = results[0];

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
      });
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

      res.json({
        message: "Login successful",
        accessToken: accessToken,
      });
    });
  } catch (err) {
    console.error("Error in /login:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/refreshtoken", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decodedUser) => {
      if (err) return res.sendStatus(403);
      const NewAccessToken = generateAccessToken({
        id: decodedUser.id,
        email: decodedUser.email,
      });
      return res.json({ accessToken: NewAccessToken });
    }
  );
});

app.post("/logout", authenticateToken, (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

function alreadyBookmarked(id, content_id, content_type) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(*) AS count FROM ${
      content_type === `movie` ? `b_user_movies` : `b_user_series`
    } WHERE user_id = ? AND content_id = ?`;

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

function alreadyInDatabaseList(content_id, content_type) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(*) AS count FROM ${
      content_type === `movie` ? `b_movies` : `b_series`
    } WHERE id = ?`;

    db.query(sql, [content_id], (err, results) => {
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
    const recordExists = await alreadyBookmarked(
      userID,
      content_id,
      content_type
    );

    return res.json({ isBookmarked: recordExists });
  } catch (error) {
    console.error("Error in /is_bookmarked route:", error.message);
    return res.status(500).json({ error: "Database error" });
  }
});

app.post("/bookmark_item", authenticateToken, async (req, res) => {
  const userID = req.user.id;
  const {
    id: movie_id,
    movies: movies_list,
    media_type: media_type,
  } = req.body;

  try {
    const sql_insert_movie_record = `INSERT INTO ${
      media_type === "movie" ? "b_movies" : "b_series"
    } (id, ${media_type === "movie" ? "title" : "name"}, poster_path, ${
      media_type === "movie" ? "release_date" : "first_air_date"
    }, vote_average) VALUES (?, ?, ?, ?, ?)`;

    const sql_insert_bookmark_record = `INSERT INTO ${
      media_type === "movie" ? "b_user_movies" : "b_user_series"
    } (user_id, content_id) VALUES (?, ?)`;

    const alreadyInDBList = await alreadyInDatabaseList(movie_id, media_type);
    if (!alreadyInDBList) {
      const specific_movie = movies_list.find((movie) => movie.id === movie_id);

      await new Promise((resolve, reject) => {
        db.query(
          sql_insert_movie_record,
          [
            specific_movie.id,
            media_type === "movie" ? specific_movie.title : specific_movie.name,
            specific_movie.poster_path,
            media_type === "movie"
              ? specific_movie.release_date
              : specific_movie.first_air_date,
            specific_movie.vote_average,
          ],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    }

    const isBookmarked = await alreadyBookmarked(userID, movie_id, media_type);
    if (!isBookmarked) {
      db.query(sql_insert_bookmark_record, [userID, movie_id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.json({
          message: `Content with id ${movie_id} was bookmarked`,
        });
      });
    } else {
      return res.json({ message: "Already bookmarked" });
    }
  } catch (error) {
    console.error("Error in /bookmark_item:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

app.post("/remove_bookmarked_item", authenticateToken, async (req, res) => {
  const userID = req.user.id;
  const { id: movie_id, media_type: media_type } = req.body;
  try {
    const isBookmarked = await alreadyBookmarked(userID, movie_id, media_type);
    if (!isBookmarked) {
      return res.json({
        message: "Aleary not bookmarked, nothing to delete",
      });
    }

    const sql_delete = `DELETE FROM ${
      media_type === `movie` ? `b_user_movies` : `b_user_series`
    } WHERE user_id = ? AND content_id = ?`;

    db.query(sql_delete, [userID, movie_id], (err) => {
      if (err) return res.json({ error: err.message });

      return res.json({
        message: `Content with id ${movie_id} was removed from bookmarks`,
      });
    });
  } catch (error) {
    console.error("Error in /remove_bookmarked_item:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

app.post("/retreive_bookmarked_movies", authenticateToken, (req, res) => {
  const userID = req.user.id;
  const sql = `SELECT * FROM b_user_movies WHERE user_id = ?`;
  const sql1 = `SELECT * FROM b_movies`;

  db.query(sql, [userID], (err, results) => {
    if (err) return res.json(err.message);

    const users_bookmarks_list = results;

    db.query(sql1, (err, results) => {
      if (err) return res.json(err.message);

      let return_array = [];
      const content_array = results;

      for (let i = 0; i < content_array.length; i++) {
        for (let j = 0; j < users_bookmarks_list.length; j++) {
          if (content_array[i].id === users_bookmarks_list[j].content_id) {
            return_array.push(content_array[i]);
          }
        }
      }
      return res.json(return_array);
    });
  });
});

app.post("/retreive_bookmarked_series", authenticateToken, (req, res) => {
  const userID = req.user.id;
  const sql = `SELECT * FROM b_user_series WHERE user_id = ?`;
  const sql1 = `SELECT * FROM b_series`;

  db.query(sql, [userID], (err, results) => {
    if (err) return res.json(err.message);

    const users_bookmarks_list = results;

    db.query(sql1, (err, results) => {
      if (err) return res.json(err.message);

      let return_array = [];
      const content_array = results;

      for (let i = 0; i < content_array.length; i++) {
        for (let j = 0; j < users_bookmarks_list.length; j++) {
          if (content_array[i].id === users_bookmarks_list[j].content_id) {
            return_array.push(content_array[i]);
          }
        }
      }
      return res.json(return_array);
    });
  });
});

app.post("/get_bookmarked_items", authenticateToken, async (req, res) => {
  const userID = req.user.id;
  if (!userID) return res.json({ error: "user id not found" });

  try {
    const sql_movies = `
          SELECT b_movies.id, b_movies.title, b_movies.poster_path, b_movies.release_date, b_movies.vote_average 
          FROM b_user_movies 
          JOIN b_movies ON b_user_movies.content_id = b_movies.id 
          WHERE b_user_movies.user_id = ?`;

    const sql_series = `
          SELECT b_series.id, b_series.name, b_series.poster_path, b_series.first_air_date, b_series.vote_average 
          FROM b_user_series 
          JOIN b_series ON b_user_series.content_id = b_series.id 
          WHERE b_user_series.user_id = ?`;

    const movies = await new Promise((resolve, reject) => {
      db.query(sql_movies, [userID], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    const series = await new Promise((resolve, reject) => {
      db.query(sql_series, [userID], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    return res.json({ movies, series });
  } catch (error) {
    console.error("Error in /get_bookmarked_items:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ error: "Not authenticated request" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token no longer valid" });
    req.user = { id: user.id, email: user.email };
    next();
  });
}

app.listen(8081, () => {
  console.log("Listening on port 8081");
});

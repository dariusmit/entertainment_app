"use strict";

//config
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const env = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

env.config();

app.use(express.json());
app.use(cors());

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

async function storeRefreshToken(UserID, token) {
  const sql = `INSERT INTO refresh_tokens (user_id, value) 
  VALUES (?, ?) 
  ON DUPLICATE KEY UPDATE value = VALUES(value)`;

  return new Promise((resolve, reject) => {
    db.query(sql, [UserID, token], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function getRefreshTokenFromDB(UserID) {
  const sql_select = `SELECT * FROM refresh_tokens WHERE user_id = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql_select, [UserID], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null); // Handle case where no token is found
      resolve(result[0].value);
    });
  });
}

async function deleteRefreshToken(token) {
  const sql_delete = `DELETE FROM refresh_tokens
  WHERE value = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql_delete, [token], (err, result) => {
      if (err) return reject(err);

      resolve(result);
    });
  });
}

app.post("/register", async (req, res) => {
  const sql_select = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
  const sql_insert = `INSERT INTO users (email, password) VALUES (?, ?)`;
  const email = req.body.email;
  const password = req.body.password;
  let userExists;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    db.query(sql_select, [email, password], (err, results) => {
      if (err) return res.json(err.message);

      const count = results[0].count;

      userExists = count === 1;

      if (!userExists) {
        db.query(sql_insert, [email, encryptedPassword], (err) => {
          if (err) return res.json(err.message);
        });
      }
      res.json({
        message: "User registered successfully. Sign in now.",
      });
    });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let user = {};

  const sql = `SELECT * FROM users WHERE email = ?`;

  try {
    db.query(sql, [email], async (err, results) => {
      if (err) return res.json(err.message);

      user = JSON.parse(JSON.stringify(results[0]));

      if (!user) return res.json({ error: "User does not exist" });

      if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await storeRefreshToken(results[0].user_id, refreshToken);
        res.json({
          message: "Login successful",
          accessToken: accessToken,
          user: results,
        });
      } else {
        res.json({
          error: "Incorrect password",
        });
      }
    });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

app.post("/refreshtoken", async (req, res) => {
  const userID = req.body.userID;
  const refreshTokenFromDB = await getRefreshTokenFromDB(userID);

  if (!refreshTokenFromDB) return res.sendStatus(401);

  jwt.verify(
    refreshTokenFromDB,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) return res.sendStatus(403);
      const NewAccessToken = generateAccessToken({ email: user.email });
      return res.json({
        accessToken: NewAccessToken,
        isLoggedIn: true,
      });
    }
  );
});

app.post("/logout", async (req, res) => {
  await deleteRefreshToken(req.body.token);
  return res.json({
    message: "User logged out",
    isLoggedIn: false,
  });
});

app.listen(8091, () => {
  console.log("Listening on port 8091");
});

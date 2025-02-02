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

let refreshTokens = [];

//functions
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
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        res.json({
          message: "Login successful",
          accessToken: accessToken,
          refreshToken: refreshToken,
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

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

app.post("/newtoken", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken && !refreshTokens.includes(refreshToken)) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ email: user.email });
    return res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((item) => item !== req.body.token);
  console.log(refreshTokens);
  return res.json({
    message: "User logged out",
    isLoggedIn: false,
  });
});

app.listen(8091, () => {
  console.log("Listening on port 8091");
});

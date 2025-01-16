const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const env = require("dotenv");

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

app.post("/login", (req, res) => {
  const sql = `SELECT * FROM users_list WHERE email = ? AND password = ?`;

  db.query(sql, [req.body.email, req.body.password], (err, results) => {
    if (err) return res.json(err.message);
    if (results.length > 0) {
      res.json({
        message: "Login successful",
        isLoggedIn: true,
        user: results,
      });
    } else {
      res.json({
        message: "Incorrect email or password",
        isLoggedIn: false,
      });
    }
  });
});

app.post("/register", (req, res) => {
  const sql_select = `SELECT COUNT(*) AS count FROM users_list WHERE email = ?`;
  const sql_insert = `INSERT INTO users_list (email, password) VALUES (?, ?)`;
  let emailExists;

  db.query(sql_select, [req.body.email, req.body.password], (err, results) => {
    if (err) return res.json(err.message);
    const count = results[0].count;
    emailExists = count === 1;
    if (!emailExists) {
      db.query(sql_insert, [req.body.email, req.body.password], (err) => {
        if (err) return res.json(err.message);
      });
    }
    res.json({
      emailExists: emailExists,
    });
  });
});

app.post("/bookmark", (req, res) => {
  const movie_title = req.body.movie.title;
  const sql_insert = `INSERT INTO moovie_titles (movie_title) VALUES (?)`;

  /** 
  db.query(sql_insert, [movie_title], (err) => {
    if (err) return res.json(err.message);
  });
  */

  return res.json({
    mesage: "bookmarked movie title inserted into database",
    bookmarked_movie_title: movie_title,
  });
});

app.post("/remove_bookmark", (req, res) => {
  const movie_title = req.body.movie.title;
  const sql_insert = `INSERT INTO moovie_titles (movie_title) VALUES (?)`;

  /** 
  db.query(sql_insert, [movie_title], (err) => {
    if (err) return res.json(err.message);
  });
  */

  return res.json({
    mesage: "bookmarked movie title inserted into database",
    bookmarked_movie_title: movie_title,
  });
});

app.post("/retreive_bookmarked_movies", (req, res) => {
  const user_id = req.body.userID;
  const sql_insert = `INSERT INTO moovie_titles (movie_title) VALUES (?)`;

  /** 
  db.query(sql_insert, [movie_title], (err) => {
    if (err) return res.json(err.message);
  });
  */

  return res.json({
    user_id,
  });
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});

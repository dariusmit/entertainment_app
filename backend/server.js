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

app.post("/check_record", (req, res) => {
  id = req.body.id;
  let recordExists;
  const sql = `SELECT COUNT(*) AS count FROM b_movies WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.json(err.message);
    const count = results[0].count;
    recordExists = count === 1;
  });
  if (recordExists) {
    return res.json({
      message: "exists",
    });
  } else {
    return res.json({
      message: "dont exist",
    });
  }
});

app.post("/bookmark_movie", (req, res) => {
  const user_id = req.body.userID;
  const movie_id = req.body.id;
  const movies_list = req.body.movies;
  let specific_movie;
  const sql_insert_movie_record = `INSERT INTO b_movies (id, title, poster_path, release_date, vote_average) VALUES (?, ?, ?, ?, ?)`;
  const sql_insert_bookmark_record = `INSERT INTO b_user_movies (user_id, content_id) VALUES (?, ?)`;

  for (let i = 0; i < movies_list.length; i++) {
    if (movies_list[i].id === movie_id) {
      specific_movie = movies_list[i];
    }
  }

  /**
  db.query(
    sql_insert_movie_record,
    [
      specific_movie.id,
      specific_movie.title,
      specific_movie.poster_path,
      specific_movie.release_date,
      specific_movie.vote_average,
    ],
    (err) => {
      if (err) return res.json(err.message);
    }
  );
  db.query(sql_insert_bookmark_record, [user_id, movie_id], (err) => {
    if (err) return res.json(err.message);
  });
   */

  return res.json({
    message: `Movie with id ${movie_id} was bookmarked`,
  });
});

app.post("/bookmark_series", (req, res) => {
  const user_id = req.body.userID;
  const series_id = req.body.id;
  const series_list = req.body.movies;
  let specific_series;
  const sql_insert_series_record = `INSERT INTO b_series (id, name, first_air_date, vote_average) VALUES (?, ?, ?, ?)`;
  const sql_insert_bookmark_record = `INSERT INTO b_user_series (user_id, content_id) VALUES (?, ?)`;

  for (let i = 0; i < series_list.length; i++) {
    if (series_list[i].id === series_id) {
      specific_series = series_list[i];
    }
  }

  console.log(specific_series);
  console.log("User id:" + user_id);
  console.log("Movie id:" + series_id);

  db.query(
    sql_insert_series_record,
    [
      specific_series.id,
      specific_series.name,
      specific_series.first_air_date,
      specific_series.vote_average,
    ],
    (err) => {
      if (err) return res.json(err.message);
    }
  );
  db.query(sql_insert_bookmark_record, [user_id, series_id], (err) => {
    if (err) return res.json(err.message);
  });

  return res.json({
    message: `Series with id ${series_id} was bookmarked`,
  });
});

app.post("/remove_bookmarked_movie", (req, res) => {
  const user_id = req.body.userID;
  const movie_id = req.body.id;
  const sql_delete = `DELETE FROM b_user_movies WHERE user_id = ? and content_id = ?`;
  db.query(sql_delete, [user_id, movie_id], (err) => {
    if (err) return res.json(err.message);
    return res.json({
      message: `Movie with id ${movie_id} was removed from bookmarks`,
    });
  });
});

app.post("/remove_bookmarked_series", (req, res) => {
  const user_id = req.body.userID;
  const series_id = req.body.id;
  const sql_delete = `DELETE FROM b_user_series WHERE user_id = ? and content_id = ?`;
  db.query(sql_delete, [user_id, series_id], (err) => {
    if (err) return res.json(err.message);
  });
});

app.post("/retreive_bookmarked_movies", (req, res) => {
  const user_id = req.body.userID;
  const sql_select = `SELECT movie_title FROM bookmarked_movies WHERE user_id = ?`;
  db.query(sql_select, [user_id], (err, results) => {
    if (err) return res.json(err.message);
    return res.json({
      user_id,
      results,
    });
  });
});

app.post("/retreive_bookmarked_series", (req, res) => {
  const user_id = req.body.userID;
  const sql_select = `SELECT movie_title FROM bookmarked_movies WHERE user_id = ?`;
  db.query(sql_select, [user_id], (err, results) => {
    if (err) return res.json(err.message);
    return res.json({
      user_id,
      results,
    });
  });
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});

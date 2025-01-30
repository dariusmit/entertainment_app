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
  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
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
  const sql_insert = `INSERT INTO users (email, password) VALUES (?, ?)`;
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
  const id = req.body.id;
  const content_type = req.body.media_type;
  let recordExists;
  const sql = `SELECT COUNT(*) AS count FROM ${
    content_type === `movie` ? `b_movies` : `b_series`
  } WHERE id = ?`;
  db.query(sql, [id, content_type], (err, results) => {
    if (err) return res.json(err.message);
    const count = results[0].count;
    recordExists = count === 1;
    return res.json(recordExists);
  });
});

app.post("/is_bookmarked", (req, res) => {
  const user_id = req.body.userID;
  const content_id = req.body.id;
  const content_type = req.body.media_type;
  let recordExists;
  const sql = `SELECT COUNT(*) AS count FROM ${
    content_type === `movie` ? `b_user_movies` : `b_user_series`
  } WHERE user_id = ? and content_id = ?`;
  db.query(sql, [user_id, content_id], (err, results) => {
    if (err) return res.json(err.message);
    const count = results[0].count;
    recordExists = count === 1;
    return res.json(recordExists);
  });
});

app.post("/bookmark_item", (req, res) => {
  const user_id = req.body.userID;
  const movie_id = req.body.id;
  const movies_list = req.body.movies;
  const media_type = req.body.media_type;
  let specific_movie;

  const sql_insert_movie_record = `INSERT INTO ${
    media_type === `movie` ? `b_movies` : `b_series`
  } (id, ${media_type === `movie` ? `title` : `name`}, poster_path, ${
    media_type === `movie` ? `release_date` : `first_air_date`
  }, vote_average) VALUES (?, ?, ?, ?, ?)`;

  const sql_insert_bookmark_record = `INSERT INTO ${
    media_type === `movie` ? `b_user_movies` : `b_user_series`
  } (user_id, content_id) VALUES (?, ?)`;

  for (let i = 0; i < movies_list.length; i++) {
    if (movies_list[i].id === movie_id) {
      specific_movie = movies_list[i];
    }
  }
  db.query(
    sql_insert_movie_record,
    [
      specific_movie.id,
      media_type === `movie` ? specific_movie.title : specific_movie.name,
      specific_movie.poster_path,
      media_type === `movie`
        ? specific_movie.release_date
        : specific_movie.first_air_date,
      specific_movie.vote_average,
    ],
    (err) => {
      if (err) return res.json(err.message);
    }
  );
  db.query(sql_insert_bookmark_record, [user_id, movie_id], (err) => {
    if (err) return res.json(err.message);
  });
  return res.json({
    message: `Content with id ${movie_id} was bookmarked`,
  });
});

app.post("/remove_bookmarked_item", (req, res) => {
  const user_id = req.body.userID;
  const movie_id = req.body.id;
  const media_type = req.body.media_type;
  const sql_delete = `DELETE FROM ${
    media_type === `movie` ? `b_user_movies ` : `b_user_series`
  } WHERE user_id = ? and content_id = ?`;
  db.query(sql_delete, [user_id, movie_id], (err) => {
    if (err) return res.json(err.message);
    return res.json({
      message: `Content with id ${movie_id} was removed from bookmarks`,
    });
  });
});

app.post("/retreive_bookmarked_movies", (req, res) => {
  const userID = req.body.user_id;
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

app.post("/retreive_bookmarked_series", (req, res) => {
  const userID = req.body.user_id;
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

app.listen(8081, () => {
  console.log("Listening on port 8081");
});

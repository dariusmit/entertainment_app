"use strict";

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

function alreadyBookmarked(user_id, content_id, content_type) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(*) AS count FROM ${
      content_type === `movie` ? `b_user_movies` : `b_user_series`
    } WHERE user_id = ? AND content_id = ?`;

    db.query(sql, [user_id, content_id], (err, results) => {
      if (err) {
        console.error("Database error:", err.message);
        return reject(err); // Reject the Promise if there's an error
      }

      if (!results || results.length === 0) {
        console.warn("No results returned from database");
        return resolve(false); // Return false if no data is found
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
        return reject(err); // Reject the Promise if there's an error
      }

      if (!results || results.length === 0) {
        console.warn("No results returned from database");
        return resolve(false); // Return false if no data is found
      }

      const count = results[0].count;

      resolve(count === 1);
    });
  });
}

app.post("/is_bookmarked", async (req, res) => {
  const {
    userID: user_id,
    id: content_id,
    media_type: content_type,
  } = req.body;

  try {
    const recordExists = await alreadyBookmarked(
      user_id,
      content_id,
      content_type
    );

    return res.json({ isBookmarked: recordExists });
  } catch (error) {
    console.error("Error in /is_bookmarked route:", error.message);
    return res.status(500).json({ error: "Database error" });
  }
});

app.post("/bookmark_item", async (req, res) => {
  const {
    userID: user_id,
    id: movie_id,
    movies: movies_list,
    media_type: media_type,
  } = req.body;

  try {
    const sql_insert_movie_record = `INSERT INTO ${
      media_type === `movie` ? `b_movies` : `b_series`
    } (id, ${media_type === `movie` ? `title` : `name`}, poster_path, ${
      media_type === `movie` ? `release_date` : `first_air_date`
    }, vote_average) VALUES (?, ?, ?, ?, ?)`;

    const sql_insert_bookmark_record = `INSERT INTO ${
      media_type === `movie` ? `b_user_movies` : `b_user_series`
    } (user_id, content_id) VALUES (?, ?)`;

    const alreadyInDBList = await alreadyInDatabaseList(movie_id, media_type);
    if (!alreadyInDBList) {
      const specific_movie = movies_list.find((movie) => movie.id === movie_id);
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
          if (err) return res.json({ error: err.message });

          db.query(sql_insert_bookmark_record, [user_id, movie_id], (err) => {
            if (err) return res.json({ error: err.message });

            return res.json({
              message: `Content with id ${movie_id} was bookmarked`,
            });
          });
        }
      );
    }

    const isBookmarked = await alreadyBookmarked(user_id, movie_id, media_type);
    if (!isBookmarked) {
      db.query(sql_insert_bookmark_record, [user_id, movie_id], (err) => {
        if (err) return res.json({ error: err.message });

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

app.post("/remove_bookmarked_item", async (req, res) => {
  const { userID: user_id, id: movie_id, media_type: media_type } = req.body;
  try {
    const isBookmarked = await alreadyBookmarked(user_id, movie_id, media_type);
    if (!isBookmarked) {
      return res.json({ message: "Aleary not bookmarked, nothing to delete" });
    }

    const sql_delete = `DELETE FROM ${
      media_type === `movie` ? `b_user_movies` : `b_user_series`
    } WHERE user_id = ? AND content_id = ?`;

    db.query(sql_delete, [user_id, movie_id], (err) => {
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

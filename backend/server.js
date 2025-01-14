const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login",
});

app.post("/login", (req, res) => {
  const sql = `SELECT * FROM users_list WHERE email = ? AND password = ?`;

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) return res.json(err.message);
    if (data.length > 0) {
      res.json({ message: "Login successful", isLoggedIn: true });
    } else {
      res.json({
        message: "Incorrect email or password",
        isLoggedIn: false,
      });
    }
  });
});

app.post("/register", (req, res) => {
  const sql_select = `SELECT * FROM users_list WHERE email = ?`;
  const sql_insert = `INSERT INTO users_list (email, password) VALUES (?, ?)`;
  let isEmailUnique;

  db.query(sql_select, [req.body.email], (err, data) => {
    if (err) return res.json(err.message);
    isEmailUnique = false;
    res.json({ message: "Email already in use!", isEmailUnique: false });
  });

  if (isEmailUnique) {
    db.query(sql_insert, [req.body.email, req.body.password], (err, data) => {
      if (err) return res.json(err.message);
      res.json("User created");
    });
  }
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});

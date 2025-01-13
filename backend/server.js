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
  const sql = `SELECT * FROM login WHERE email = ? AND password = ?`;

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) return res.json(err.message);
    if (data.length > 0) {
      return res.json({ message: "Login successful", isLoggedIn: true });
    } else {
      return res.json({
        message: "Incorrect email or password",
        isLoggedIn: false,
      });
    }
  });
});

app.post("/register", (req, res) => {
  const sql = `INSERT INTO login (email, password) VALUES (?, ?)`;

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) return res.json(err.message);
    return res.json("User created");
  });
});

app.listen(8081, () => {
  console.log("Listening... on port 8081");
});

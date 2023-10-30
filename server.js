const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "movie_db"
}, console.log("Connected to movie_db"));





app.listen(PORT, () => {
    console.log("listening on port", PORT);
});

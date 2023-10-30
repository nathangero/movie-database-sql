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


app.get("/api/movies", (req, res) => {
    db.query("SELECT * FROM movies", (err, results) => {
        if (err) {
            console.error(err);
        }

        res.send(results);
    });
});

app.get("/api/movie-reviews", (req, res) => {
    const statement = `
    SELECT movies.id, movies.movie_name, reviews.review
    FROM reviews
    JOIN movies ON reviews.movie_id = movies.id
    `
    db.query(statement, (err, results) => {
        if (err) {
            console.error(err);
        }
        
        res.send(results);
    });
});


app.post("/api/add-movie", (req, res) => {

    const statement = `
    INSERT INTO movies(movie_name)
    VALUES ("Captain America");
    `
    db.query(statement, (err, results) => {
        if (err) {
            console.error(err);
        }
        
        db.query("SELECT * FROM movies", (err, movies) => {
            if (err) {
                console.error(err);
            }
    
            res.send(movies);
        });
    });
})

app.put("/api/review/:id", (req, res) => {
    const movieId = req.params.id;
    console.log("movie id:", movieId);

    const statement = `
    INSERT INTO reviews(review, movie_id)
    VALUES ("This is a great movie.", ?);
    `
    db.query(statement, movieId, (err, results) => {
        if (err) {
            console.error(err);
            res.send(500);
        }
        
        const statement = `
        SELECT movies.movie_name, reviews.review
        FROM reviews
        JOIN movies ON reviews.movie_id = movies.id
        `
        db.query(statement, (err, movies) => {
            if (err) {
                console.error(err);
                res.send(500);
            }
            
            res.send(movies);
        });
    });
});


app.delete("/api/movie/:id", (req, res) => {
    const movieId = req.params.id;
    console.log("movie id:", movieId);

    const statement = `
    DELETE FROM movies
    WHERE id = ?
    `
    db.query(statement, movieId, (err, results) => {
        if (err) {
            console.error(err);
            res.send(500);
        }        
        
        // Show the current list of movies after deletion
        db.query("SELECT * FROM movies", (err, movies) => {
            if (err) {
                console.error(err);
                res.send(500);
            }

            res.send(movies);
        });
    });
});


app.listen(PORT, () => {
    console.log("listening on port", PORT);
});

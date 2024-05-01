const pug = require("pug");
const express = require("express");
const Database = require("./contactDB");
const session = require("express-session");

const db = new Database();
db.initialize();

const app = express();
app.set("view engine", "pug");


app.use(express.static("public"));

app.use((req, res, next) => {
  req.db = db;
  next(); // ensures the route handlers will be called.
});


app.use("/contacts", require("./routes/contact")); // Route for logging in
app.use("/", (req, res) => {
    res.render("home", { title: "Home" });
})
app.listen(8080, () => { 
    console.log("Server running on http://localhost:8080");
})
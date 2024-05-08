const pug = require("pug");
const express = require("express");
const Database = require("./contactDB");
const session = require("express-session");
const bodyParser = require("body-parser");
const db = new Database();
db.initialize();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "pug");


app.use(express.static("public"));

app.use((req, res, next) => {
  req.db = db;
  next(); // ensures the route handlers will be called.
});

app.use(
  session({
    secret: "cmps369",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = {
      id: req.session.user.id,
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      userName: req.session.user.userName,
    };
  }
  next();
});

app.use("/users", require("./routes/user")); // Route for logging in
app.use("/contacts", require("./routes/contact")); // Route for contacts
app.use("/", (req, res) => {
    res.render("home", { title: "Home" });
})
app.listen(8080, () => { 
    console.log("Server running on http://localhost:8080");
})
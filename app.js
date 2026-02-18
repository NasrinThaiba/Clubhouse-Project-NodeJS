require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const passport = require("./passport");
const session = require("express-session");
const flash = require("connect-flash");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth")

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

mongoose.connect(DB_URL)
.then(()=> console.log("DB is connected Successfully!"))
.catch((err) => console.log("DB Error", err))

const app = express();

app.set("view engine", "ejs")

app.use(express.static("public"))

app.use(express.urlencoded({extended : false}))

app.use(session({
  secret : SECRET_KEY,
  resave : false,
  saveUninitialized : false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Make currentUser available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})

app.use("/", indexRouter);
app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Server is connected to the Port : ${PORT}`)
})
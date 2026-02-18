const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const {body, validationResult} = require("express-validator");
const User = require("../models/User");

const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("signup")
})

router.post("/signup", [
    body("username").isEmail().withMessage("Enter valid Email"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters"),
    body("confirmPassword").custom((value, {req}) => value === req.body.password)
                           .withMessage("Passwords must match")
                           
], async(req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(err => {
            req.flash("error", err.msg);
        });
        return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = new User({
        firstName : req.body.firstName,
        secondName : req.body.secondName,
        username : req.body.username,
        password : hashedPassword
    })

    await user.save();
    req.flash("success", "Account created successfully! Please login.");
    res.redirect("/login")
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.post("/login", 
    passport.authenticate("local", {
        successRedirect : "/",
        failureRedirect : "/login",
        failureFlash: true
    })
)

router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/")
    })
})

module.exports = router;


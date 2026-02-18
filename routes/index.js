const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

function ensureAuth(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

router.get("/", async(req, res) => {
    const messages = await Message.find().populate("author").sort({createdAt: -1});
    res.render("index", {messages})
})

router.get("/new-message", ensureAuth, (req, res) => {
    res.render("new-message")
})

router.post("/new-message", ensureAuth, async (req, res) => {
    await Message.create({
        title : req.body.title,
        text : req.body.text,
        author : req.user._id
    })
    res.redirect("/")
})

router.post("/join-club", ensureAuth, async (req, res) => {
    if(req.body.passcode !== process.env.MEMBER_PASSCODE) {
        req.flash("error", "Invalid Club Passcode");
        return res.redirect("/");
    }
    await User.findByIdAndUpdate(req.user._id, { isMember: true });
      req.flash("success", "Welcome to the Club 🎉");
      res.redirect("/");
})


router.post("/make-admin", ensureAuth, async (req, res) => {
    if (req.body.secret !== process.env.ADMIN_PASSCODE) {
        req.flash("error", "Invalid Admin Secret")
        return res.redirect("/")
    }
    await User.findByIdAndUpdate(req.user._id, {isAdmin : true})
    req.flash("success", "You are now an Admin")
    res.redirect("/");
});

router.post("/delete/:id", ensureAuth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.redirect("/");
    }
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/");
});


module.exports = router;
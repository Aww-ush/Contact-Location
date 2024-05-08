const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signin", async (req, res) => {
  const user = await req.db.findUserByUserName(req.body.userName);
  if (user) {
    const message = "Username already exists!";
    return res.status(200).send({ success: false, message: message });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    password: hash,
  };
  const id = await req.db.createUser(newUser);
  req.session.user = await req.db.findUserById(id);
  return res.status(200).send({ success: true, id: id });
});

router.post("/login", async (req, res) => {
  console.log("login backend");
  const user = await req.db.findUserByUserName(req.body.userName);
  if (!user) {
    const message = "Username not found!";
    return res.status(200).send({ success: false, message: message });
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    const message = "Password incorrect!";
    return res.status(200).send({success: false, message: message });
  }
  req.session.user = user;
  return res.status(200).send({ success: true, user: user });
});
router.get("/session", async (req, res) => {
    console.log("Getting session")
    if (req.session.user) {
        // Return session user data
        console.log("this is the session user", req.session.user);
        
      res.status(200).json(req.session.user);
    } else {
      // If session doesn't exist, return an empty object
      res.status(200).json(null);
    }
});
router.get("/logout", async (req, res) => {
    console.log("Logging out");
    req.session.destroy();
    res.status(200).send({ success: true });
});
module.exports = router;

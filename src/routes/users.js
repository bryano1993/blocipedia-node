const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation");
const User = require("../../src/db/models").User;

router.get("/users/sign_up", userController.signUp);
router.post("/users/sign_ups", validation.validateUsers, userController.create);

module.exports = router;

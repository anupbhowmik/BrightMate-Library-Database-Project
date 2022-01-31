const express = require("express");
const userController = require('../controllers/userController');
const booksController = require('../controllers/booksController');
const bodyParser = require("body-parser").json();

var router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// router.get("/api/getUsers", bodyParser, userController.getUsers);

router.post("/api/signUp", bodyParser, userController.signUp);
router.get("/api/signIn", bodyParser, userController.signIn);

router.post("/api/addAuthor", bodyParser, booksController.addAuthor);

module.exports = router;
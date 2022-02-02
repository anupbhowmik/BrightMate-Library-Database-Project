const express = require("express");
const userController = require('../controllers/userController');
const booksController = require('../controllers/booksController');
const magazineController = require('../controllers/magazineController');
const bodyParser = require("body-parser").json();

var router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/api/signUp", bodyParser, userController.signUp);
router.get("/api/signIn", bodyParser, userController.signIn);

router.post("/api/addAuthor", bodyParser, booksController.addAuthor);
router.post("/api/addPublisher", bodyParser, booksController.addPublisher);

router.post("/api/addBook", bodyParser, booksController.addBook);
router.get("/api/getBooks", bodyParser, booksController.getBooks);

router.post("/api/addMagazine", bodyParser, magazineController.addMagazine);
router.get("/api/getMagazines", bodyParser, magazineController.getMagazines);

module.exports = router;
const express = require("express");
const userController = require('../controllers/userController');
const generalController = require('../controllers/generalController');
const booksController = require('../controllers/booksController');
const magazineController = require('../controllers/magazineController');
const rentController = require('../controllers/rentController');
const bodyParser = require("body-parser").json();

var router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/api/signUp", bodyParser, userController.signUp);
router.get("/api/signIn", bodyParser, userController.signIn);
router.post("/api/addEmployee", bodyParser, userController.addEmployee);
router.get("/api/getJobs", bodyParser, userController.getJobs);

router.post("/api/addAuthor", bodyParser, generalController.addAuthor);
router.post("/api/editAuthor", bodyParser, generalController.editAuthor);
router.post("/api/addPublisher", bodyParser, generalController.addPublisher);
router.post("/api/editPublisher", bodyParser, generalController.editPublisher);
router.get("/api/getGenre", bodyParser, generalController.getGenre);
router.get("/api/getAuthors", bodyParser, generalController.getAuthors);
router.get("/api/search", bodyParser, generalController.search);

router.post("/api/addBook", bodyParser, booksController.addBook);
router.post("/api/addBookCopies", bodyParser, booksController.addBookCopies);
router.get("/api/getBooks", bodyParser, booksController.getBooks);
router.get("/api/getBookInfo", bodyParser, booksController.getBookInfo);
router.post("/api/editBook", bodyParser, booksController.editBook);
router.post("/api/deleteBook", bodyParser, booksController.deleteBook);

router.post("/api/addMagazine", bodyParser, magazineController.addMagazine);
router.get("/api/getMagazines", bodyParser, magazineController.getMagazines);

router.post("/api/rentBook", bodyParser, rentController.rentBook);
router.post("/api/returnBook", bodyParser, rentController.returnBook);

module.exports = router;
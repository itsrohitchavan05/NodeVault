const express = require("express");
const { body } = require("express-validator");
const {
  getAllData,
  createData,
  deleteData,
} = require("../controllers/dataController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllData);

router.post(
  "/",
  [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content cannot be empty.")
      .isLength({ max: 1000 }),
  ],
  createData,
);

router.delete("/:id", deleteData);

module.exports = router;

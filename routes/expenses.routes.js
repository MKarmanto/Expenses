const express = require("express");

const {
  getExpenses,
  addExpense,
  deleteById,
  getByID,
} = require("../controllers/expenses.controllers");

const router = express.Router();

router.get("/", getExpenses);
router.get("/:id", getByID);
router.post("/", addExpense);
// router.put("/", updateById);
router.delete("/:id", deleteById);

module.exports = router;

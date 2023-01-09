const express = require("express");

const {
  getExpenses,
  addExpense,
  deleteById,
  getByID,
  updateById,
} = require("../controllers/expenses.controllers");

const router = express.Router();

router.get("/", getExpenses);
router.post("/", addExpense);
router.delete("/:id", deleteById);
router.get("/:id", getByID);
router.put("/", updateById);

module.exports = router;

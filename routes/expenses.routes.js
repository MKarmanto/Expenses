const express = require("express");

const {
  getExpenses,
  addExpense,
  deleteById,
  getByID,
  updateById,
  getByMonth,
  getBySearch,
} = require("../controllers/expenses.controllers");

const router = express.Router();

router.get("/", getExpenses);
router.post("/", addExpense);
router.delete("/:id", deleteById);
router.get("/:id", getByID);
router.put("/", updateById);
router.get("/month/:month", getByMonth);
router.get("/", getBySearch);

module.exports = router;

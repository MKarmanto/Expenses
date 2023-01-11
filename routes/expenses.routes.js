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

/**
 * @description This is the expenses routes.
 * Each route calls the appropriate controller function found in
 * expenses.controllers.js.
 */
router.get("/search", getBySearch);
router.get("/", getExpenses);
router.post("/", addExpense);
router.delete("/:id", deleteById);
router.get("/:id", getByID);
router.put("/", updateById);
router.get("/month/:month", getByMonth);

module.exports = router;

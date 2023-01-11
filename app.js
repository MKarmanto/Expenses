const express = require("express");
const expensesRouter = require("./routes/expenses.routes");

/**
 * @description This is the main app.
 * Import express and create an express app.
 * import the express.json() middleware and mount it on the app.
 * Import the expenses router and mount it on the /api/expenses path.
 * This will allow us to access the routes defined in the expenses router
 * at /api/expenses.
 * For example, the route defined in expenses.routes.js for getting all expenses
 * is GET /api/expenses.
 */
const app = express();
app.use(express.json());
app.use("/api/expenses", expensesRouter);

module.exports = app;

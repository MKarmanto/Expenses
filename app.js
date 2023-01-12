const express = require("express");
const cors = require("cors");
const expensesRouter = require("./routes/expenses.routes");

/**
 * @description This is the main app.
 * Import express and create an express app.
 * import the express.json() and cors middleware and mount it on the app.
 * Import the expenses router and mount it on the /api/expenses path.
 * This will allow us to access the routes defined in the expenses router
 * at /api/expenses.
 * For example, the route defined in expenses.routes.js for getting all expenses
 * is GET /api/expenses.
 */
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:3000",
      "https://expenses-app-api.onrender.com",
    ],
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("OK");
});
app.use(express.static("frontend/build"));
app.use("/api/expenses", expensesRouter);

module.exports = app;

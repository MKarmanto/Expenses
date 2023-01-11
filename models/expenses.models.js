const e = require("express");
//connection to database
const connection = require("../database/db");

/**
 * @description This is the expenses model.
 * All params from expenses.controllers.js.
 * @param expenses holds all the functions.
 * All functions @returns {object} promise with SQL query results.
 *
 */

const expenses = {
  /**
   * @description Get all expenses.
   * Query the database and get every row from the expenses table.
   * If there is an error, reject the promise.
   * If there is no error, resolve the promise.
   */
  getAll: () =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM expenses", (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    }),

  /**
   * @description Get expense by id.
   * Query the database and get the row from the expenses table based on ID.
   * ? is a placeholder for the id
   * If there is an error, reject the promise.
   * If there is no error, resolve the promise.
   */
  getById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM expenses WHERE id = ?",
        id,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),
  /**
   * @description Get expenses by month.
   * Query the database and get the rows from the expenses table based on month.
   * ? is a placeholder for the month as a number.
   * If there is an error, reject the promise.
   * If there is no error, resolve the promise with the result.
   */
  getByMonth: (month) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM expenses WHERE MONTH(date) = ?",
        month,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),

  /**
   * @description Get expenses by search.
   * Query the database and get the rows from the expenses table based on search.
   * ?? is a placeholder for the column name.
   * ? is a placeholder for the search term.
   * % is a wildcard to match any number of characters.
   * @example "test" returns "test", "testUpdated", "1test", "1test1"
   * if there is an error, reject the promise.
   * if there is no error, resolve the promise with the result.
   */
  getBySearch: (search) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM expenses WHERE ?? LIKE ?",
        [search.column, "%" + search.searchTerm + "%"],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),

  /**
   * @description Add an expense.
   * Query the database and add a row to the expenses table.
   * ? is a placeholder for the values.
   * each ? is replaced by the value in the array.
   * the order of the values in the array must match
   * the order of the ? in the query.
   * If there is an error, reject the promise.
   * If there is no error, resolve the promise with the result.
   */
  addExpense: (expense) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO `expenses` (`date`, `amount`, `shop`, `category`,`description`) VALUES (?,?,?,?,?);",
        [
          expense.date,
          expense.amount,
          expense.shop,
          expense.category,
          expense.description,
        ],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),

  /**
   * @description Update an expense by ID.
   * Query the database and update a row in the expenses table.
   * ? is a placeholder for the values.
   * each ? is replaced by the value in the array.
   * If there is an error, reject the promise.
   * If there is no error, resolve the promise.
   */
  updateById: (expense) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE expenses SET date = ?, amount = ?, description = ? WHERE id = ?;",
        [expense.date, expense.amount, expense.description, expense.id],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),

  /**
   * @description Delete an expense by ID.
   * Query the database and delete a row from the expenses table.
   * ? is a placeholder for the id.
   * If there is an error, reject the promise.
   * If there is no error, resolve the promise.
   */
  deleteById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM expenses WHERE id = ?;",
        id,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),
};

module.exports = expenses;

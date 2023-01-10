const e = require("express");
//connection to database
const connection = require("../database/db");
/**
 * @description This is the expenses model
 * @param from expenses.controllers.js
 * @returns {object} promise with SQL query results
 *
 */
const expenses = {
  // get all expenses
  getAll: () =>
    // return a promise
    new Promise((resolve, reject) => {
      // query the database and select all
      connection.query("SELECT * FROM expenses", (err, result) => {
        // if there is an error, reject the promise
        if (err) {
          reject(err);
        }
        // if there is no error, resolve the promise
        resolve(result);
      });
    }),
  // get expense by id
  getById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        // ? is a placeholder for the id
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
  // get expenses by month
  getByMonth: (month) =>
    new Promise((resolve, reject) => {
      connection.query(
        // ? is a placeholder for the month as a number
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
  // get expenses by search
  getBySearch: (search) =>
    new Promise((resolve, reject) => {
      connection.query(
        // search.column is the column name, search.search is the search term
        // ?? is a placeholder for the column name
        // ? is a placeholder for the search term
        // % is a wildcard to match any number of characters
        // @example "test" returns "test", "testUpdated", "1test", "1test1"
        "SELECT * FROM expenses WHERE ?? LIKE ?",
        [search.column, "%" + search.search + "%"],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),
  // add an expense
  addExpense: (expense) =>
    new Promise((resolve, reject) => {
      connection.query(
        // ? is a placeholder for the values
        // each ? is replaced by the value in the array
        // the order of the values in the array must match the order of the ? in the query
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
  // update an expense by ID
  updateById: (expense) =>
    new Promise((resolve, reject) => {
      connection.query(
        // ? is a placeholder for the values
        // each ? is replaced by the value in the array
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
  // delete an expense by ID
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

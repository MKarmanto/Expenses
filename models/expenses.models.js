const connection = require("../database/db");

const expenses = {
  getAll: () =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM expenses", (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    }),

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

  getBySearch: (search) =>
    new Promise((resolve, reject) => {
      connection.query(
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

  addExpense: (expense) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO `expenses` (`date`, `amount`, `description`) VALUES (?,?,?)",
        [expense.date, expense.amount, expense.description],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),

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

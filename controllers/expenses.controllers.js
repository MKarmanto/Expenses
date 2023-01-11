const expenses = require("../models/expenses.models");
const Joi = require("joi");

/**
 * @description This is the expenses controllers
 * @param req from the router
 * @param res from the router
 * @returns {object} Promise with SQL query results from the model
 *
 */

/**
 * @description Get all expenses
 * Call the getAll function from the model.
 * If there is a response, sum the amounts.
 * and send the response and total amount back to the client
 * if there is an error, send a 500 status
 */
const getExpenses = async (req, res) => {
  try {
    const response = await expenses.getAll();
    if (response) {
      const total = response.reduce((acc, cur) => acc + cur.amount, 0);
      res.send({ response, total });
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

/**
 * @description Get expense by id
 * Call the getById function from the model.
 * If there is a response, sum the amounts.
 * If there is no response, send a 404 status.
 * If there is an error, send a 500 status
 */
const getByID = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const response = await expenses.getById(id);
    if (response.length === 1) {
      const total = response.reduce((acc, cur) => acc + cur.amount, 0);
      res.send({ response, total });
    } else {
      res.status(404).send("No ID Found");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

/**
 * @description Get expenses by month
 * Call the getByMonth function from the model.
 * If there is a response, sum the amounts.
 * If there is response, but the object is empty, send a 404 status.
 * If there is an error, send a 500 status
 */
const getByMonth = async (req, res) => {
  const month = req.params.month;
  try {
    const response = await expenses.getByMonth(month);
    if (response.length > 0) {
      const total = response.reduce((acc, cur) => acc + cur.amount, 0);
      res.send({ response, total });
    } else {
      res.status(404).send("No Results Found");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

/**
 * @description Get expenses by search.
 * @param firstKey is the column name from the query object.
 * @param firstValue is the search term from the query object.
 * Validate the search object.
 * If not valid, send a 400 status with error details.
 * Call the getBySearch function from the model.
 * If there is a response, sum the amounts.
 * If there is response, but the object is empty, send a 404 status.
 * If there is an error, send a 500 status
 * */
const getBySearch = async (req, res) => {
  const firstKey = Object.keys(req.query)[0];
  const firstValue = req.query[firstKey];
  const search = {
    column: firstKey,
    searchTerm: firstValue,
  };
  // validate the search object
  const schema = Joi.object({
    // the column name must be one of these
    column: Joi.any().valid(
      "date",
      "amount",
      "shop",
      "category",
      "description"
    ),
    // the search term must be a string and at least 1 character long
    searchTerm: Joi.string().min(1),
  });
  const { error } = schema.validate(search);
  if (error) {
    console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    const response = await expenses.getBySearch(search);
    if (response.length > 0) {
      const total = response.reduce((acc, cur) => acc + cur.amount, 0);
      res.send({ response, total });
    } else {
      res.status(404).send("No Results Found");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

/**
 * @description Add an expense.
 * Validate the request body.
 * If not valid send a 400 status with error details.
 * Call the addExpense function from the model.
 * If there is a response, send the added expense back to the client.
 * If there is an error, send a 500 status
 */
const addExpense = async (req, res) => {
  const schema = Joi.object({
    // the date must be a string, at least 1 character long and a valid date
    date: Joi.string().isoDate().min(1).required(),
    amount: Joi.number().min(1).required(),
    shop: Joi.string().min(1).required(),
    category: Joi.string().min(1).required(),
    description: Joi.string().min(1),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }
  const expense = {
    date: req.body.date,
    amount: req.body.amount,
    shop: req.body.shop,
    category: req.body.category,
    description: req.body.description,
  };

  try {
    const response = await expenses.addExpense(expense);
    if (response) {
      expense.id = response.insertId;
      res.status(201).send(expense);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

/**
 * @description Update an expense.
 * Validate the request body.
 * If not valid send a 400 status with error details.
 * Call the updateById function from the model to update the expense in database.
 * If there is a response, send the updated expense back to the client.
 * If there is an error, send a 500 status
 */
const updateById = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
    date: Joi.string().isoDate().required(),
    amount: Joi.number().min(1).required(),
    shop: Joi.string().min(1).required(),
    category: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const expense = {
    id: req.body.id,
    date: req.body.date,
    amount: req.body.amount,
    shop: req.body.shop,
    category: req.body.category,
    description: req.body.description,
  };

  try {
    const response = await expenses.updateById(expense);
    if (response) {
      res.send(expense);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

/**
 * @description Delete expense by ID.
 * Get the id from the url.
 * Call the getById function from the model to check that the expense exists.
 * If there is no response, send a 404 status.
 * Call the deleteById function from the model to delete the expense.
 * If there is a response, send a 200 status with a message.
 * If there is an error, send a 500 status
 *
 */
const deleteById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await expenses.getById(id);
    if (result.length === 0) {
      res.status(404).send("Not Found");
      return;
    }
    const response = await expenses.deleteById(id);
    if (response.affectedRows === 1) {
      res.status(200).send("Expense deleted");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

module.exports = {
  getExpenses,
  addExpense,
  deleteById,
  getByID,
  updateById,
  getByMonth,
  getBySearch,
};

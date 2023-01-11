const expenses = require("../models/expenses.models");
const Joi = require("joi");

/**
 * description This is the expenses controllers
 * @param {*} req from the router
 * @param {*} res from the router
 * @returns {object} response from the model
 *
 */

// get all expenses
const getExpenses = async (req, res) => {
  try {
    // call the model function
    const response = await expenses.getAll();
    if (response) {
      // if there is a response, sum the amounts
      // and send the response and total amount back to the client
      const total = response.reduce((acc, cur) => acc + cur.amount, 0);
      res.send({ response, total });
    }
  } catch (e) {
    // if there is an error, send a 500 status
    res.sendStatus(500);
  }
};

// get expense by id
const getByID = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const response = await expenses.getById(id);
    if (response.length === 1) {
      const total = response.reduce((acc, cur) => acc + cur.amount, 0);
      res.send({ response, total });
    } else {
      // if there is no response, send a 404 status
      res.status(404).send("No ID Found");
    }
  } catch (e) {
    // if there is an error, send a 500 status
    res.sendStatus(500);
  }
};

const getByMonth = async (req, res) => {
  const month = req.params.month;
  try {
    const response = await expenses.getByMonth(month);
    if (response.length > 0) {
      const total = response.reduce((acc, cur) => acc + cur.amount, 0);
      res.send({ response, total });
    } else {
      // if there is response and it is empty, send a 404 status
      res.status(404).send("No Results Found");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};
// get expenses by search
const getBySearch = async (req, res) => {
  //the first key in the query object is the column name
  const firstKey = Object.keys(req.query)[0];
  //the first value in the query object is the search term
  const firstValue = req.query[firstKey];
  // create an object with the column name and search term
  const search = {
    column: firstKey,
    search: firstValue,
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
    // the search term must be at least one character
    search: Joi.string().min(1),
  });
  const { error } = schema.validate(search);
  if (error) {
    console.log(error);
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    // call the model function
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
// add an expense
const addExpense = async (req, res) => {
  const schema = Joi.object({
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

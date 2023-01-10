const expenses = require("../models/expenses.models");
const Joi = require("joi");

// get all expenses
const getExpenses = async (req, res) => {
  try {
    // call the model function
    const response = await expenses.getAll();
    if (response) {
      // if there is a response, sum the amounts
      // and send the response and total amount
      const total = response.reduce((acc, cur) => acc + cur.amount, 0);
      res.send({ response, total });
    }
  } catch (e) {
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
      res.status(404).send("No ID Found");
    }
  } catch (e) {
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
      res.status(404).send("No Results Found");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const getBySearch = async (req, res) => {
  const firstKey = Object.keys(req.query)[0];
  const firstValue = req.query[firstKey];
  const search = {
    column: firstKey,
    search: firstValue,
  };
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

const addExpense = async (req, res) => {
  const schema = Joi.object({
    date: Joi.string().min(1).required(),
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
    date: Joi.string().required(),
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

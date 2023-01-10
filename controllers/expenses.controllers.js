const expenses = require("../models/expenses.models");
const Joi = require("joi");

const getExpenses = async (req, res) => {
  try {
    const response = await expenses.getAll();
    if (response) {
      res.send(response);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const getByID = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const response = await expenses.getById(id);
    if (response.length === 1) {
      res.send(response[0]);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const getByMonth = async (req, res) => {
  const month = req.params.month;
  try {
    const response = await expenses.getByMonth(month);
    if (response) {
      res.send(response);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

//TODO fix this
//Parse querystring.parse
//use objectkeys 0 and 1
const getBySearch = async (req, res) => {
  const search = { column: req.query.shop, search: req.query.search };
  try {
    const response = await expenses.getBySearch(search);
    if (response) {
      res.send(response);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const addExpense = async (req, res) => {
  const schema = Joi.object({
    date: Joi.string().min(1).required(),
    amount: Joi.number().min(1).required(),
    description: Joi.string().min(1).required(),
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

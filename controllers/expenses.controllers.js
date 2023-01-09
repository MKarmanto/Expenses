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

// const getByID = async (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   try {
//     const response = await getById(id);
//     if (response.length === 1) {
//       res.send(response[0]);
//     } else {
//       res.status(404).send("Not Found");
//     }
//   } catch (e) {
//     res.sendStatus(500);
//   }
// };

// const getByMonth = async (req, res) => {
//   const month = req.params.month;
//   try {
//     const response = await getByMonth(month);
//     if (response) {
//       res.send(response);
//     } else {
//       res.status(404).send("Not Found");
//     }
//   } catch (e) {
//     res.sendStatus(500);
//   }
// };

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

// const updateById = async (req, res) => {
//   const schema = object({
//     id: number().integer().required(),
//     month: string().min(2).required(),
//     usage: number().integer().required(),
//     cost: number().integer().required(),
//   });
//   const { error } = schema.validate(req.body);
//   if (error) {
//     res.status(400).send(error.details[0].message);
//     return;
//   }

//   const expense = {
//     id: req.body.id,
//     month: req.body.month,
//     usage: req.body.usage,
//     cost: req.body.cost,
//   };

//   try {
//     const response = await _updateById(expense);
//     if (response) {
//       res.send(expense);
//     }
//   } catch (e) {
//     res.sendStatus(500);
//   }
// };

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
      res.status(200).send("expense deleted");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

module.exports = { getExpenses, addExpense, deleteById };
// getByID,
// updateById,

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef } from "react";
import "./CSS/App.css";

function App() {
  //Ref to store input values
  const expenseDate = useRef(null);
  const expenseAmount = useRef(null);
  const expenseShop = useRef(null);
  const expenseCategory = useRef(null);
  const expenseDescription = useRef(null);

  /**
   * State to store fetched expenses
   * State to store the total amount of expenses
   * State to check if data is loading and display a message
   * State to store error message
   */
  const [expenses, setExpenses] = useState(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * @description Fetch expenses from the server
   * If there is an error, set the error state
   * If there is no error, set the expenses and total amount of expenses
   * The expenses are stored in an object,
   * so we need to use Object.values to get the array of expenses.
   * The total amount is stored in the second element of the object.
   */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/api/expenses`)
      .then((res) => {
        if (!res.ok) {
          throw Error("Could not fetch data for that resource");
        }
        return res.json();
      })
      .then((data) => {
        setExpenses(Object.values(data)[0]);
        setTotal(Object.values(data)[1]);
        setIsLoading(false);
        setError(null);
      })
      .catch((err) => {
        if (err.name === "Failed to fetch") {
          console.log("Fetch aborted");
        } else {
          setIsLoading(false);
          setError(err.message);
        }
      });
  }, []);

  /**
   * @description Delete expense from the server and update the state
   * @param {string} deletedExpenseID string of the deleted expense ID
   * delete the expense from the server
   * if the response is 200, delete the expense from the state
   * Substract the deleted expense amount from the total
   *
   */
  const handleDeleteClick = async (deletedExpenseID) => {
    try {
      console.log("DELETING " + deletedExpenseID);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/expenses/${deletedExpenseID}`,
        { method: "delete" }
      );
      if (response.status === 200) {
        console.log("DELETED");
        setExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense.id !== deletedExpenseID)
        );
        setTotal(
          (prevTotal) =>
            prevTotal -
            expenses.find((expense) => expense.id === deletedExpenseID).amount
        );
      }
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  /**
   * @description Add expense to the server and update the state
   * Submit the form to the server with POST method.
   * If the response is 201, add the expense to the state
   * Add the expense amount to the total
   * Clear the input fields
   * If the response is 400, alert the user to check the input data formatting
   */
  const handleAddClick = async (event) => {
    event.preventDefault();
    const postData = {
      date: expenseDate.current.value,
      amount: expenseAmount.current.value,
      shop: expenseShop.current.value,
      category: expenseCategory.current.value,
      description: expenseDescription.current.value,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/expenses`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": "token-value",
          },
          body: JSON.stringify(postData),
        }
      );
      if (response.status === 201) {
        console.log("CREATED");
        const data = await response.json();
        setExpenses([...expenses, data]);
        expenseDate.current.value = "";
        expenseAmount.current.value = "";
        expenseShop.current.value = "";
        expenseCategory.current.value = "";
        expenseDescription.current.value = "";
        setTotal(total + parseInt(data.amount));
      }
      if (response.status === 400) {
        alert(
          "Check your input data formatting:\ndate: 2023-01-01, amount: 100.00, shop: test, category: test, description: test"
        );
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <React.Fragment>
      <div className="container">
        <h1 className="text-center my-5">Expenses List</h1>
        <div className="row">
          {/*Table for all the data from database*/}
          <table className="table table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Shop</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/*Map through the expenses array add index 
              and display the data in the table*/}
              {/*If there is no data, display a message*/}
              {expenses &&
                expenses.length > 0 &&
                expenses.map((expense, index) => (
                  <tr key={expense.id}>
                    <td>{index + 1}</td>
                    <td>{expense.id}</td>
                    <td>{expense.date}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.shop}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteClick(expense.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p>Total expenses: {total}€</p>
          {error && <div className="status">{error}</div>}
          {isLoading && <div className="status">Loading data...</div>}
        </div>
        {/*Form for adding new expenses*/}
        <div className="row my-5">
          <div className="col-md-8 mx-auto">
            <form>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="inputDate">Date</label>
                  <input
                    type="text"
                    className="form-control"
                    ref={expenseDate}
                    id="inputDate"
                    placeholder="2023-01-01"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputAmount">Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    ref={expenseAmount}
                    id="inputAmount"
                    placeholder="100.00"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="inputShop">Shop</label>
                  <input
                    type="text"
                    className="form-control"
                    ref={expenseShop}
                    id="inputShop"
                    placeholder="Shop name"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputCategory">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    ref={expenseCategory}
                    id="inputCategory"
                    placeholder="Category name"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputDescription">Description</label>
                <input
                  type="text"
                  className="form-control"
                  ref={expenseDescription}
                  id="inputDescription"
                  placeholder="Expense description"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary submit-button"
                onClick={handleAddClick}
              >
                Add
              </button>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 mx-auto"></div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;

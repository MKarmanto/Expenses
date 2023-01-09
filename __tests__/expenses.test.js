const {
  describe,
  expect,
  test,
  afterAll,
  beforeAll,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app.js");
const connection = require("../database/db.js");

describe("expenses routes", () => {
  describe("GET /expenses", () => {
    test("should return 200 and valid JSON", async () => {
      const response = await request(app).get("/api/expenses");
      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
    });
    test("should return expenses from specific month", async () => {
      const response = await request(app).get("/api/expenses/month/1");
      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
    });
    // test("should return expenses sorted by date"),
    //   async () => {
    //     const response = await request(app).get("/expenses?sort=date");
    //     expect(response.status).toBe(200);
    //     expect(response.type).toBe("application/json");
    //   };
  });

  describe("POST /expenses", () => {
    let postId;
    test("should create a new expense", async () => {
      const expense = {
        date: "2023-01-01",
        amount: 100,
        description: "test",
      };
      const response = await request(app)
        .post("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      // postId = response.body.id;

      expect(response.status).toEqual(201);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.id).toBeTruthy();
      expect(response.body.amount).toEqual(expense.amount);
      expect(response.body.date).toEqual(expense.date);
    });
    afterAll(async () => {
      await request(app)
        .delete(`/api/expenses/${postId}`)
        .set("Accept", "application/json");
    });
  });

  describe("DELETE /expenses/:id", () => {
    test("should check that expense with id exists", async () => {
      const response = await request(app)
        .delete("/api/expenses/11111")
        .set("Accept", "application/json");

      expect(response.status).toEqual(404);
      expect(response.text).toEqual("Not Found");
    });
    test("should delete the expense by id", async () => {
      const expense = {
        date: "2022-01-15",
        amount: 500.0,
        description: "test3",
      };
      const postResponse = await request(app)
        .post("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      const postId = postResponse.body.id;

      const response = await request(app)
        .delete(`/api/expenses/${postId}`)
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
      expect(response.text).toEqual("Expense deleted");
    });
  });

  describe("PUT /expenses/", () => {
    let postId;
    beforeAll(async () => {
      const expense = {
        date: "2023-01-01",
        amount: 100,
        description: "test3",
      };
      const postResponse = await request(app)
        .post("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      postId = postResponse.body.id;
    });

    test("should update the expense with the id", async () => {
      const expense = {
        id: postId,
        date: "2022-01-15",
        amount: 200,
        description: "testUpdated",
      };

      const response = await request(app)
        .put("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(postId);
      expect(response.body.date).toEqual("2022-01-15");
      expect(response.body.amount).toEqual(200);
      expect(response.body.description).toEqual("testUpdated");
    });

    afterAll(async () => {
      await request(app)
        .delete(`/expenses/${postId}`)
        .set("Accept", "application/json");
      connection.end();
    });
  });
});

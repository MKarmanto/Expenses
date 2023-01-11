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
    test("should return expenses from specific search", async () => {
      const response = await request(app).get(
        "/api/expenses/search?description=bi-weekly&groceries"
      );
      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body.response[0].description).toBe("bi-weekly groceries");
    });
    test("should return expenses with specific id", async () => {
      const response = await request(app).get("/api/expenses/1");
      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body.response[0].id).toBe(1);
    });
    test("should return error due to invalid column in search", async () => {
      const response = await request(app).get(
        "/api/expenses/search?invalid=test"
      );
      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        '"column" must be one of [date, amount, shop, category, description]'
      );
    });
  });

  describe("POST /expenses", () => {
    let postId;
    afterEach(async () => {
      await request(app)
        .delete(`/api/expenses/${postId}`)
        .set("Accept", "application/json");
    });
    test("should create a new expense", async () => {
      const expense = {
        date: "2023-01-01",
        amount: 100,
        shop: "test-shop",
        category: "test-category",
        description: "test-description",
      };
      const response = await request(app)
        .post("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      postId = response.body.id;

      expect(response.status).toEqual(201);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.id).toBeTruthy();
      expect(response.body.amount).toEqual(expense.amount);
      expect(response.body.shop).toEqual(expense.shop);
      expect(response.body.category).toEqual(expense.category);
      expect(response.body.date).toEqual(expense.date);
    });
    test("should return 400 if amount is not a number", async () => {
      const expense = {
        date: "2023-01-01",
        amount: "test",
        shop: "test-shop",
        category: "test-category",
        description: "test-description",
      };
      const response = await request(app)
        .post("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      postId = response.body.id;

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"amount" must be a number');
    });
    test("should return 400 if date is not a valid date", async () => {
      const expense = {
        date: "test",
        amount: 100,
        shop: "test-shop",
        category: "test-category",
        description: "test-description",
      };
      const response = await request(app)
        .post("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      postId = response.body.id;

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"date" must be in iso format');
    });
    test("should return 400 if shop is not a string", async () => {
      const expense = {
        date: "2023-01-01",
        amount: 100,
        shop: 123,
        category: "test-category",
        description: "test-description",
      };
      const response = await request(app)
        .post("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      postId = response.body.id;

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"shop" must be a string');
    });
    test("should return 400 if category is not a string", async () => {
      const expense = {
        date: "2023-01-01",
        amount: 100,
        shop: "test-shop",
        category: 123,
        description: "test-description",
      };
      const response = await request(app)
        .post("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      postId = response.body.id;

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"category" must be a string');
    });
    test("should return 400 if description is not a string", async () => {
      const expense = {
        date: "2023-01-01",
        amount: 100,
        shop: "test-shop",
        category: "test-category",
        description: 123,
      };
      const response = await request(app)
        .post("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      postId = response.body.id;

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"description" must be a string');
    });
  });

  describe("DELETE /expenses/:id", () => {
    test('should return 404 "Not Found"', async () => {
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
        shop: "test-shop",
        category: "test-category",
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
    test("should return 404 if expense with id does not exist", async () => {
      const response = await request(app)
        .delete("/api/expenses/11111")
        .set("Accept", "application/json");
      expect(response.status).toEqual(404);
      expect(response.text).toEqual("Not Found");
    });
  });

  describe("PUT /expenses/", () => {
    let postId;
    beforeAll(async () => {
      const expense = {
        date: "2023-01-01",
        amount: 100,
        shop: "test-shop",
        category: "test-category",
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
        shop: "test-shop2",
        category: "test-category2",
        description: "testUpdated",
      };

      const response = await request(app)
        .put("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(postId);
      expect(response.body.date).toEqual("2022-01-15");
      expect(response.body.shop).toEqual("test-shop2");
      expect(response.body.category).toEqual("test-category2");
      expect(response.body.amount).toEqual(200);
      expect(response.body.description).toEqual("testUpdated");
    });
    test("should return 400 if id is not a number", async () => {
      const expense = {
        id: "test",
        date: "2022-01-15",
        amount: 200,
        shop: "test-shop2",
        category: "test-category2",
        description: "testUpdated",
      };
      const response = await request(app)
        .put("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"id" must be a number');
    });
    test("should return 400 if date is not in iso format", async () => {
      const expense = {
        id: postId,
        date: "test",
        amount: 200,
        shop: "test-shop2",
        category: "test-category2",
        description: "testUpdated",
      };
      const response = await request(app)
        .put("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"date" must be in iso format');
    });
    test("should return 400 if amount is not a number", async () => {
      const expense = {
        id: postId,
        date: "2022-01-15",
        amount: "test",
        shop: "test-shop2",
        category: "test-category2",
        description: "testUpdated",
      };
      const response = await request(app)
        .put("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"amount" must be a number');
    });
    test("should return 400 if shop is not a string", async () => {
      const expense = {
        id: postId,
        date: "2022-01-15",
        amount: 200,
        shop: 123,
        category: "test-category2",
        description: "testUpdated",
      };
      const response = await request(app)
        .put("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"shop" must be a string');
    });
    test("should return 400 if category is not a string", async () => {
      const expense = {
        id: postId,
        date: "2022-01-15",
        amount: 200,
        shop: "test-shop2",
        category: 123,
        description: "testUpdated",
      };
      const response = await request(app)
        .put("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"category" must be a string');
    });
    test("should return 400 if description is not a string", async () => {
      const expense = {
        id: postId,
        date: "2022-01-15",
        amount: 200,
        shop: "test-shop2",
        category: "test-category2",
        description: 123,
      };
      const response = await request(app)
        .put("/api/expenses")
        .set("Accept", "application/json")
        .send(expense);
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('"description" must be a string');
    });
    afterAll(async () => {
      await request(app)
        .delete(`/api/expenses/${postId}`)
        .set("Accept", "application/json");
      connection.end();
    });
  });
});

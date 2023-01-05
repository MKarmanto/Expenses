const {
  describe,
  expect,
  test,
  afterAll,
  beforeAll,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app.js");
//const connection = require("../db/connection.js");

describe("expenses routes", () => {
  describe("GET /expenses", () => {
    test("should return 200 and valid JSON", async () => {
      const response = await request(app).get("/api/expenses");
      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
    });
    // test("should return expenses from specific month"),
    //   async () => {
    //     const response = await request(app).get("/expenses?month=2021-08");
    //     expect(response.status).toBe(200);
    //     expect(response.type).toBe("application/json");
    //   };
    // test("should return expenses sorted by date"),
    //   async () => {
    //     const response = await request(app).get("/expenses?sort=date");
    //     expect(response.status).toBe(200);
    //     expect(response.type).toBe("application/json");
    //   };
  });
  //TODO: delete rows affected rows after each test
  describe("POST /expenses", () => {
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

      expect(response.status).toEqual(201);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.id).toBeTruthy();
      expect(response.body.date).toEqual(expense.date);
      expect(response.body.amount).toEqual(expense.amount);
    });
  });

  //   describe("DELETE /expenses/:id", () => {
  //     test("should return 200 and valid JSON", async () => {
  //       const response = await request(app).delete("/expenses/1");
  //       expect(response.status).toBe(200);
  //       expect(response.type).toBe("application/json");
  //     });
  //   });

  //   describe("PUT /expenses/:id", () => {
  //     let postId;
  //     beforeAll(async () => {
  //       const expense = {
  //         date: "2023-01-01",
  //         amount: 100,
  //         description: "test",
  //       };
  //       const postResponse = await request(app).post("/expenses").send(expense);
  //       postId = postResponse.body.insertId;
  //     });

  //     test("should update the expense with the id", async () => {
  //       const expense = {
  //         id: postId,
  //         date: "2023-01-01",
  //         amount: 200,
  //         description: "testUpdated",
  //       };
  //       const response = await (await request(app).put(`/expenses/${postId}`))
  //         .set("Accept", "application/json")
  //         .send(expense);
  //       expect(response.status).toBe(200);
  //       expect(response.type).toEqual(postId);
  //       expect(response.body.date).toEqual("2023-01-01");
  //       expect(response.body.amount).toEqual(200);
  //       expect(response.body.description).toEqual("testUpdated");
  //     });

  //     afterAll(async () => {
  //       await request(app)
  //         .delete(`/expenses/${postId}`)
  //         .set("Accept", "application/json");
  //       connection.end();
  //     });
  //   });
});

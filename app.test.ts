import request from "supertest";
import { app } from "."; // Adjust the import path as needed

describe("POST /transactions", () => {
   it("creates a transaction successfully", async () => {
      const transaction = {
         type: "income",
         category: 1,
         amount: 1000,
         description: "Test income",
      };

      const response = await request(app)
         .post("/transactions")
         .send(transaction);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
         "message",
         "Transaction created successfully"
      );
      expect(response.body.transaction).toHaveProperty("id");
      expect(response.body.transaction).toMatchObject(transaction);
   });

   it("fails to create a transaction with missing required fields", async () => {
      const transaction = {
         type: "income",
         amount: 1000,
      };

      const response = await request(app)
         .post("/transactions")
         .send(transaction);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", '"category" is required');
   });

   it("fails to create a transaction with invalid type", async () => {
      const transaction = {
         type: "invalid",
         category: 1,
         amount: 1000,
         description: "Test invalid type",
      };

      const response = await request(app)
         .post("/transactions")
         .send(transaction);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
         "error",
         '"type" must be one of [income, expense]'
      );
   });
});

describe("GET /transactions", () => {
   it("retrieves transactions successfully with default limit and offset", async () => {
      const response = await request(app).get("/transactions");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("transactions");
      expect(Array.isArray(response.body.transactions)).toBe(true);
   });

   it("retrieves transactions successfully with custom limit and offset", async () => {
      const response = await request(app)
         .get("/transactions")
         .query({ limit: 5, offset: 2 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("transactions");
      expect(Array.isArray(response.body.transactions)).toBe(true);
   });
});

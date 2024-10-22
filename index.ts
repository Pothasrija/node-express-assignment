// import libs

import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import bodyParser from "body-parser";
import Joi from "joi";

// create express app
export const app = express();
const port = 8080;

// parse application/json
app.use(bodyParser.json());

// connect to database
const db = new sqlite3.Database("data.db", (err: Error | null) => {
   if (err) {
      console.error(err.message);
   } else {
      console.log("Connected to the SQLite database.");
   }
});

//@ts-ignore
app.post("/transactions", (req, res) => {
   const schema = Joi.object({
      type: Joi.string().valid("income", "expense").required(),
      category: Joi.number().integer().required(),
      amount: Joi.number().required(),
      description: Joi.string().optional(),
   });
   const { error, value } = schema.validate(req.body);

   if (error) {
      return res.status(400).send({ error: error.details[0].message });
   }
   const { type, category, amount, description } = value;

   const transaction = {
      id: uuidv4(),
      type,
      category,
      amount,
      date: new Date().toISOString(),
      description: description || null,
   };

   const insert = `INSERT INTO transactions (id, type, category, amount, date, description) VALUES (?, ?, ?, ?, ?, ?)`;

   db.run(
      insert,
      [
         transaction.id,
         transaction.type,
         transaction.category,
         transaction.amount,
         transaction.date,
         transaction.description,
      ],
      function (err) {
         if (err) {
            console.error(err.message);
            res.status(500).send({ error: "Failed to add transaction" });
         } else {
            res.status(201).send({
               message: "Transaction created successfully",
               transaction: transaction,
            });
         }
      }
   );
});

//@ts-ignore
app.get("/transactions", (req, res) => {
   const schema = Joi.object({
      offset: Joi.number().integer().min(0).default(0),
      limit: Joi.number().integer().min(1).default(10),
   });

   const { error, value } = schema.validate(req.query);
   if (error) {
      return res.status(400).send({ error: error.details[0].message });
   }

   const { offset, limit } = value;

   const query = `
        SELECT 
            transactions.id,
            transactions.type,
            transactions.category,
            transactions.amount,
            transactions.date,
            transactions.description,
            categories.name as category_name,
            categories.type as category_type
        FROM transactions
        LEFT JOIN categories ON transactions.category = categories.id
        LIMIT ? OFFSET ?
    `;

   db.all(query, [Number(limit), Number(offset)], (err, rows) => {
      if (err) {
         console.error(err.message);
         res.status(500).send({ error: "Failed to retrieve transactions" });
      } else {
         res.status(200).send({ transactions: rows });
      }
   });
});

//@ts-ignore
app.get("/transactions/:id", (req, res) => {
   const { id } = req.params;

   if (!id) {
      return res.status(400).send({ error: "ID is required" });
   }
   const query = `
        SELECT 
            transactions.id,
            transactions.type,
            transactions.category,
            transactions.amount,
            transactions.date,
            transactions.description,
            categories.name as category_name,
            categories.type as category_type
        FROM transactions
        LEFT JOIN categories ON transactions.category = categories.id
        WHERE transactions.id = ?
    `;

   db.get(query, [id], (err, row) => {
      if (err) {
         console.error(err.message);
         res.status(500).send({ error: "Failed to retrieve transaction" });
      } else if (!row) {
         res.status(404).send({ error: "Transaction not found" });
      } else {
         res.status(200).send({ transaction: row });
      }
   });
});

//@ts-ignore
app.put("/transactions/:id", (req, res) => {
   const { id } = req.params;
   const { type, category, amount, description } = req.body;

   if (!id) {
      return res.status(400).send({ error: "ID is required" });
   }

   const updateFields = [];
   const params = [];

   if (type || ["income", "expense"].includes(type)) {
      updateFields.push("type = ?");
      params.push(type);
   }
   if (category) {
      updateFields.push("category = ?");
      params.push(category);
   }
   if (amount) {
      updateFields.push("amount = ?");
      params.push(amount);
   }
   if (description) {
      updateFields.push("description = ?");
      params.push(description);
   }

   if (updateFields.length === 0) {
      return res
         .status(400)
         .send({ error: "No valid fields provided to update" });
   }

   params.push(id); // Add id at the end of params array for the WHERE clause

   const query = `UPDATE transactions SET ${updateFields.join(
      ", "
   )} WHERE id = ?`;

   db.run(query, params, function (err) {
      if (err) {
         console.error(err.message);
         res.status(500).send({ error: "Failed to update transaction" });
      } else if (this.changes === 0) {
         res.status(404).send({ error: "Transaction not found" });
      } else {
         res.status(200).send({ message: "Transaction updated successfully" });
      }
   });
});

//@ts-ignore
app.delete("/transactions/:id", (req, res) => {
   const { id } = req.params;
   if (!id) {
      return res.status(400).send({ error: "ID is required" });
   }

   const query = `DELETE FROM transactions WHERE id = ?`;

   db.run(query, [id], function (err) {
      if (err) {
         console.error(err.message);
         res.status(500).send({ error: "Failed to delete transaction" });
      } else if (this.changes === 0) {
         res.status(404).send({ error: "Transaction not found" });
      } else {
         res.status(200).send({ message: "Transaction deleted successfully" });
      }
   });
});

//@ts-ignore
app.get("/summary", (req, res) => {
   const schema = Joi.object({
      startDate: Joi.string()
         .pattern(/^\d{4}-\d{2}-\d{2}$/)
         .optional(),
      endDate: Joi.string()
         .pattern(/^\d{4}-\d{2}-\d{2}$/)
         .optional(),
      category: Joi.string().optional(),
   });

   const { error, value } = schema.validate(req.query);
   if (error) {
      return res.status(400).send({ error: error.details[0].message });
   }

   const { startDate, endDate, category } = value;
   let query = `
        SELECT 
            SUM(CASE WHEN transactions.type = 'income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN transactions.type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
            (SUM(CASE WHEN transactions.type = 'income' THEN amount ELSE 0 END) - 
            SUM(CASE WHEN transactions.type = 'expense' THEN amount ELSE 0 END)) AS balance
        FROM transactions
        LEFT JOIN categories ON transactions.category = categories.id
        WHERE true
    `;

   const params: any[] = [];

   if (startDate) {
      query += ` AND date >= ?`;
      params.push(startDate);
   }

   if (endDate) {
      query += ` AND date <= ?`;
      params.push(endDate);
   }

   if (category) {
      query += ` AND categories.name = ?`;
      params.push(category);
   }

   db.get(query, params, (err, row) => {
      if (err) {
         console.error(err.message);
         res.status(500).send({ error: "Failed to retrieve summary" });
      } else {
         res.status(200).send({ summary: row });
      }
   });
});

app.listen(port, () => {
   console.log(`Listening on port ${port}... http://localhost:${port}/`);
});

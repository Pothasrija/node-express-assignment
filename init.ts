import sqlite3 from "sqlite3";

const db = new sqlite3.Database("data.db", (err: Error | null) => {
   if (err) {
      console.error(err.message);
   } else {
      console.log("Connected to the SQLite database.");

      db.run(
         `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT CHECK( type IN ('income','expense') ) NOT NULL
        )`,
         (err: Error | null) => {
            if (err) {
               console.error(err.message);
            } else {
               console.log("Categories table created successfully.");

               // Insert dummy data
               const insertCategories = `
                    INSERT INTO categories (name, type)
                    VALUES 
                        ('Salary', 'income'),
                        ('Freelance', 'income'),
                        ('Groceries', 'expense'),
                        ('Utilities', 'expense'),
                        ('Entertainment', 'expense')
                `;
               db.run(insertCategories, (err) => {
                  if (err) {
                     console.error(err.message);
                  } else {
                     console.log("Dummy data inserted into categories table.");
                  }
               });
            }
         }
      );

      db.run(
         `CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            type TEXT CHECK( type IN ('income','expense') ) NOT NULL,
            category INTEGER,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            description TEXT,
            FOREIGN KEY (category) REFERENCES categories(id)
        )`,
         (err: Error | null) => {
            if (err) {
               console.error(err.message);
            } else {
               console.log("Transactions table created successfully.");
            }
         }
      );
   }
});

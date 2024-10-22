# Floww.ai Node JS - Backend Assignment

Technology used : Node js, Express js, sqlite(database), bun(runtime)

**Note: Make sure to install bun before running code.**

## Installation

First, clone the repo:

```bash
git clone https://github.com/Pothasrija/node-express-assignment
```

Then, navigate into the repository:

```bash
cd node-express-assignment
```

Now, run the following to create the database with all tables and required data:

```bash
bun run init
```

Finally, start the main server containing all the code:

```bash
bun run start
```

[Follow API Documentation](/API.md)

## Features

-  Pagination: Efficient pagination in the GET /transactions endpoint, ensuring you can handle large datasets smoothly.
-  API Testing: Comprehensive tests for your API using Supertest. Simply run bun test to validate functionality.
-  Data Schema Validation: Robust data schema validation with Joi, keeping your data clean and consistent.

## Table Design

### Categories Table

-  id: INTEGER PRIMARY KEY AUTOINCREMENT
-  name: TEXT NOT NULL
-  type: TEXT CHECK( type IN ('income','expense') ) NOT NULL

### Transactions Table

-  id: TEXT PRIMARY KEY
-  type: TEXT CHECK( type IN ('income','expense') ) NOT NULL
-  category: INTEGER
-  amount: REAL NOT NULL
-  date: TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
-  description: TEXT
-  FOREIGN KEY (category): REFERENCES categories(id)

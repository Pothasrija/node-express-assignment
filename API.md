# API Documentation

## Endpoint: `/transactions`

-  **Method**: `POST`
-  **Description**: This endpoint creates a new transaction in the system. It supports two types of transactions: `income` and `expense`. Each transaction must include the `type`, `category`, and `amount` fields.

### Request

-  **Headers**:

   -  `Content-Type`: `application/json`

-  **Body** (JSON):
   ```json
   {
     "type": "income" | "expense",   // Required. Type of transaction.
     "category": "number",            // Required. Category of the transaction (e.g., "salary", "food").
     "amount": "number",              // Required. Amount for the transaction.
     "description": "string"          // Optional. A brief description of the transaction.
   }
   ```

### Success Response

-  **Status**: `201 Created`
-  **Body** (JSON):
   ```json
   {
     "message": "Transaction created successfully",
     "transaction": {
       "id": "string",                // Unique ID for the transaction.
       "type": "income" | "expense", // The type of the transaction.
       "category": "string",          // The category of the transaction.
       "amount": "number",            // The amount involved in the transaction.
       "date": "string",              // ISO date string when the transaction was created.
       "description": "string"        // Optional description of the transaction.
     }
   }
   ```

### Error Responses

-  **Status**: `400 Bad Request`
-  **Body** (JSON):

   ```json
   {
      "error": "string"
   }
   ```

-  **Status**: `500 Internal Server Error`
-  **Body** (JSON):
   ```json
   {
      "error": "Failed to add transaction"
   }
   ```

### Example

![Transaction Post Request](/images/transactions-post.png)

## Endpoint: `/transactions`

-  **Method**: `GET`
-  **Description**: This endpoint retrieves a list of transactions, with optional pagination using `offset` and `limit` query parameters. Transactions are joined with their respective categories.

### Request

-  **Query Parameters**:

   -  `offset` (optional): The starting point for records (default is `0`).
   -  `limit` (optional): The maximum number of records to return (default is `10`).

-  **Example Request**:
   ```
   GET /transactions?offset=0&limit=10
   ```

### Success Response

-  **Status**: `200 OK`
-  **Body** (JSON):
   ```json
   {
     "transactions": [
       {
         "id": "string",               // Unique transaction ID.
         "type": "income" | "expense",// Type of the transaction.
         "category": "string",         // ID of the transaction's category.
         "amount": "number",           // Amount for the transaction.
         "date": "string",             // ISO date string when the transaction was created.
         "description": "string",      // Optional description of the transaction.
         "category_name": "string",    // Name of the category.
         "category_type": "string"     // Type of the category (e.g., "income" or "expense").
       }
     ]
   }
   ```

### Error Responses

-  **Status**: `500 Internal Server Error`
-  **Body** (JSON):
   ```json
   {
      "error": "Failed to retrieve transactions"
   }
   ```

### Example

![Transaction Get Request](/images/transactions-get.png)

## Endpoint: `/transactions/:id`

-  **Method**: `GET`
-  **Description**: This endpoint retrieves the details of a single transaction by its unique ID.

### Request

-  **URL Parameters**:

   -  `id` (required): The unique ID of the transaction to be retrieved.

-  **Example Request**:
   ```
   GET /transactions/1234abcd
   ```

### Success Response

-  **Status**: `200 OK`
-  **Body** (JSON):
   ```json
   {
     "transaction": {
       "id": "string",               // Unique transaction ID.
       "type": "income" | "expense",// Type of the transaction.
       "category": "string",         // ID of the transaction's category.
       "amount": "number",           // Amount for the transaction.
       "date": "string",             // ISO date string when the transaction was created.
       "description": "string",      // Optional description of the transaction.
       "category_name": "string",    // Name of the category.
       "category_type": "string"     // Type of the category (e.g., "income" or "expense").
     }
   }
   ```

### Error Responses

-  **Status**: `400 Bad Request`
-  **Body** (JSON):

   ```json
   {
      "error": "ID is required"
   }
   ```

-  **Status**: `404 Not Found`
-  **Body** (JSON):

   ```json
   {
      "error": "Transaction not found"
   }
   ```

-  **Status**: `500 Internal Server Error`
-  **Body** (JSON):
   ```json
   {
      "error": "Failed to retrieve transaction"
   }
   ```

### Example

![Transaction Get Request](/images/transactions-id-get.png)

## Endpoint: `/transactions/:id`

-  **Method**: `PUT`
-  **Description**: This endpoint updates an existing transaction by its unique ID. Only the provided fields will be updated.

### Request

-  **URL Parameters**:

   -  `id` (required): The unique ID of the transaction to be updated.

-  **Headers**:

   -  `Content-Type`: `application/json`

-  **Body** (JSON):

   ```json
   {
     "type": "income" | "expense",   // Optional. Type of the transaction.
     "category": "string",            // Optional. Category of the transaction.
     "amount": "number",              // Optional. Amount for the transaction.
     "description": "string"          // Optional. A brief description of the transaction.
   }
   ```

-  **Example Request**:

   ```
   PUT /transactions/1234abcd
   ```

   ```json
   {
      "type": "expense",
      "amount": 250.5,
      "description": "Updated description"
   }
   ```

### Success Response

-  **Status**: `200 OK`
-  **Body** (JSON):
   ```json
   {
      "message": "Transaction updated successfully"
   }
   ```

### Error Responses

-  **Status**: `400 Bad Request`
-  **Body** (JSON):

   ```json
   {
      "error": "ID is required"
   }
   ```

   ```json
   {
      "error": "No valid fields provided to update"
   }
   ```

-  **Status**: `404 Not Found`
-  **Body** (JSON):

   ```json
   {
      "error": "Transaction not found"
   }
   ```

-  **Status**: `500 Internal Server Error`
-  **Body** (JSON):
   ```json
   {
      "error": "Failed to update transaction"
   }
   ```

### Example

![Transaction Put Request](/images/transactions-id-put.png)

## Endpoint: `/transactions/:id`

-  **Method**: `DELETE`
-  **Description**: This endpoint deletes a transaction by its unique ID.

### Request

-  **URL Parameters**:

   -  `id` (required): The unique ID of the transaction to be deleted.

-  **Example Request**:
   ```
   DELETE /transactions/1234abcd
   ```

### Success Response

-  **Status**: `200 OK`
-  **Body** (JSON):
   ```json
   {
      "message": "Transaction deleted successfully"
   }
   ```

### Error Responses

-  **Status**: `400 Bad Request`
-  **Body** (JSON):

   ```json
   {
      "error": "ID is required"
   }
   ```

-  **Status**: `404 Not Found`
-  **Body** (JSON):

   ```json
   {
      "error": "Transaction not found"
   }
   ```

-  **Status**: `500 Internal Server Error`
-  **Body** (JSON):
   ```json
   {
      "error": "Failed to delete transaction"
   }
   ```

### Example

![Transaction Delete Request](/images/transactions-id-delete.png)

## Endpoint: `/summary`

-  **Method**: `GET`
-  **Description**: This endpoint retrieves a summary of total income, total expense, and balance. Optionally, you can filter by `startDate`, `endDate`, and `category`.

### Request

-  **Query Parameters**:

   -  `startDate` (optional): Start date for filtering transactions in `YYYY-MM-DD` format.
   -  `endDate` (optional): End date for filtering transactions in `YYYY-MM-DD` format.
   -  `category` (optional): Category name to filter transactions.

-  **Example Request**:
   ```
   GET /summary?startDate=2024-01-01&endDate=2024-01-31&category=groceries
   ```

### Success Response

-  **Status**: `200 OK`
-  **Body** (JSON):
   ```json
   {
      "summary": {
         "total_income": "number", // Total income within the filtered period.
         "total_expense": "number", // Total expense within the filtered period.
         "balance": "number" // Net balance (income - expense) within the filtered period.
      }
   }
   ```

### Error Responses

-  **Status**: `400 Bad Request`
-  **Body** (JSON):

   ```json
   {
      "error": "Invalid startDate format. Use YYYY-MM-DD."
   }
   ```

   ```json
   {
      "error": "Invalid endDate format. Use YYYY-MM-DD."
   }
   ```

-  **Status**: `500 Internal Server Error`
-  **Body** (JSON):
   ```json
   {
      "error": "Failed to retrieve summary"
   }
   ```

### Example

![Summary Request](/images/summary.png)

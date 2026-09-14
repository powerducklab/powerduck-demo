/**
 * Sample OpenAPI specifications for the codegen demo.
 * Each sample is a valid OpenAPI 3.0 document with multiple operations.
 */

export interface OpenApiSample {
  id: string;
  label: string;
  description: string;
  spec: unknown;
}

const PETSTORE = {
  openapi: "3.0.3",
  info: { title: "Petstore API", version: "1.0.0" },
  servers: [{ url: "https://api.petstore.example.com/v1" }],
  paths: {
    "/pets": {
      get: {
        operationId: "listPets",
        summary: "List all pets",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "status", in: "query", schema: { type: "string", enum: ["available", "pending", "sold"] } },
        ],
        responses: { "200": { description: "A list of pets" } },
      },
      post: {
        operationId: "createPet",
        summary: "Create a new pet",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/NewPet" } } },
        },
        responses: { "201": { description: "Pet created" } },
      },
    },
    "/pets/{petId}": {
      get: {
        operationId: "getPetById",
        summary: "Get a pet by ID",
        parameters: [{ name: "petId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "A single pet" }, "404": { description: "Not found" } },
      },
      delete: {
        operationId: "deletePet",
        summary: "Delete a pet",
        parameters: [{ name: "petId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Deleted" } },
      },
    },
  },
  components: {
    schemas: {
      Pet: { type: "object", required: ["id", "name"], properties: { id: { type: "string" }, name: { type: "string" } } },
      NewPet: { type: "object", required: ["name"], properties: { name: { type: "string" }, tag: { type: "string" } } },
    },
  },
};

const STRIPE_PAYMENTS = {
  openapi: "3.0.3",
  info: { title: "Payments API", version: "2024-01-01" },
  servers: [{ url: "https://api.payments.example.com/v1" }],
  paths: {
    "/charges": {
      get: {
        operationId: "listCharges",
        summary: "List all charges",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 10, maximum: 100 } },
          { name: "customer", in: "query", schema: { type: "string" } },
        ],
        responses: { "200": { description: "A list of charges" } },
      },
      post: {
        operationId: "createCharge",
        summary: "Create a charge",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ChargeCreate" } } },
        },
        responses: { "201": { description: "Charge created" } },
      },
    },
    "/charges/{chargeId}": {
      get: {
        operationId: "getCharge",
        summary: "Retrieve a charge",
        parameters: [{ name: "chargeId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "A charge object" } },
      },
      post: {
        operationId: "updateCharge",
        summary: "Update a charge",
        parameters: [{ name: "chargeId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", properties: { description: { type: "string" } } } } },
        },
        responses: { "200": { description: "Charge updated" } },
      },
    },
    "/customers": {
      get: {
        operationId: "listCustomers",
        summary: "List customers",
        parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 10 } }],
        responses: { "200": { description: "A list of customers" } },
      },
      post: {
        operationId: "createCustomer",
        summary: "Create a customer",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CustomerCreate" } } },
        },
        responses: { "201": { description: "Customer created" } },
      },
    },
    "/refunds": {
      post: {
        operationId: "createRefund",
        summary: "Create a refund",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["charge"], properties: { charge: { type: "string" }, amount: { type: "integer" } } } } },
        },
        responses: { "201": { description: "Refund created" } },
      },
    },
  },
  components: {
    schemas: {
      ChargeCreate: {
        type: "object",
        required: ["amount", "currency"],
        properties: { amount: { type: "integer" }, currency: { type: "string" }, source: { type: "string" }, description: { type: "string" } },
      },
      CustomerCreate: {
        type: "object",
        properties: { name: { type: "string" }, email: { type: "string" }, description: { type: "string" } },
      },
    },
  },
};

const GITHUB_USERS = {
  openapi: "3.0.3",
  info: { title: "Users API", version: "1.0.0" },
  servers: [{ url: "https://api.github.example.com" }],
  paths: {
    "/users": {
      get: {
        operationId: "listUsers",
        summary: "List users",
        parameters: [
          { name: "since", in: "query", schema: { type: "integer" } },
          { name: "per_page", in: "query", schema: { type: "integer", default: 30 } },
        ],
        responses: { "200": { description: "A list of users" } },
      },
    },
    "/users/{username}": {
      get: {
        operationId: "getUserByUsername",
        summary: "Get a user",
        parameters: [{ name: "username", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "A user object" }, "404": { description: "User not found" } },
      },
    },
    "/user": {
      get: {
        operationId: "getAuthenticatedUser",
        summary: "Get the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "The authenticated user" } },
      },
      patch: {
        operationId: "updateAuthenticatedUser",
        summary: "Update the authenticated user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, bio: { type: "string" } } } } },
        },
        responses: { "200": { description: "User updated" } },
      },
    },
    "/users/{username}/repos": {
      get: {
        operationId: "listUserRepos",
        summary: "List repositories for a user",
        parameters: [
          { name: "username", in: "path", required: true, schema: { type: "string" } },
          { name: "type", in: "query", schema: { type: "string", enum: ["all", "owner", "member"] } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["created", "updated", "pushed", "full_name"] } },
          { name: "per_page", in: "query", schema: { type: "integer", default: 30 } },
        ],
        responses: { "200": { description: "A list of repositories" } },
      },
    },
    "/repos/{owner}/{repo}": {
      get: {
        operationId: "getRepository",
        summary: "Get a repository",
        parameters: [
          { name: "owner", in: "path", required: true, schema: { type: "string" } },
          { name: "repo", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "A repository object" }, "404": { description: "Not found" } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
};

const TODO_API = {
  openapi: "3.0.3",
  info: { title: "Todo API", version: "1.0.0" },
  servers: [{ url: "https://api.todo.example.com/v1" }],
  paths: {
    "/todos": {
      get: {
        operationId: "listTodos",
        summary: "List all todos",
        parameters: [
          { name: "completed", in: "query", schema: { type: "boolean" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
        ],
        responses: { "200": { description: "A list of todos" } },
      },
      post: {
        operationId: "createTodo",
        summary: "Create a todo",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/TodoCreate" } } },
        },
        responses: { "201": { description: "Todo created" } },
      },
    },
    "/todos/{todoId}": {
      get: {
        operationId: "getTodo",
        summary: "Get a todo",
        parameters: [{ name: "todoId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "A todo object" }, "404": { description: "Not found" } },
      },
      put: {
        operationId: "updateTodo",
        summary: "Update a todo",
        parameters: [{ name: "todoId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/TodoUpdate" } } },
        },
        responses: { "200": { description: "Todo updated" } },
      },
      delete: {
        operationId: "deleteTodo",
        summary: "Delete a todo",
        parameters: [{ name: "todoId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "204": { description: "Deleted" } },
      },
    },
    "/todos/{todoId}/complete": {
      post: {
        operationId: "completeTodo",
        summary: "Mark a todo as complete",
        parameters: [{ name: "todoId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Todo completed" } },
      },
    },
  },
  components: {
    schemas: {
      TodoCreate: {
        type: "object",
        required: ["title"],
        properties: { title: { type: "string", maxLength: 200 }, description: { type: "string" }, dueDate: { type: "string", format: "date-time" } },
      },
      TodoUpdate: {
        type: "object",
        properties: { title: { type: "string" }, description: { type: "string" }, completed: { type: "boolean" }, dueDate: { type: "string", format: "date-time" } },
      },
    },
  },
};

export const OPENAPI_SAMPLES: OpenApiSample[] = [
  { id: "petstore", label: "Petstore", description: "Classic pet store API with CRUD operations", spec: PETSTORE },
  { id: "payments", label: "Payments", description: "Stripe-style charges, customers, and refunds", spec: STRIPE_PAYMENTS },
  { id: "users", label: "Users & Repos", description: "GitHub-style user and repository endpoints", spec: GITHUB_USERS },
  { id: "todo", label: "Todo API", description: "Simple task management with complete/incomplete", spec: TODO_API },
];

export const SAMPLE_OPENAPI = PETSTORE;

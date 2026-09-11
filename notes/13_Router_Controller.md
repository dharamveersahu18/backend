

# Router & Controller
 **organizing your Express backend properly**.

Think of it like this:

```text
Frontend
   │
   │ HTTP Request
   ↓
Router
   │
   ↓
Controller
   │
   ↓
Database
   │
   ↓
Controller
   │
   │ HTTP Response
   ↓
Frontend
```

---

## 1. What is a Router?

A **Router** decides:

> “When this URL and HTTP method are received, which function should run?”

Example:

```js
router.post("/register", registerUser);
```

This means:

```text
POST /register
      ↓
registerUser()
```

So:

> **Router = Traffic controller 🚦**

It directs the request to the correct controller.

---

# 2. What is a Controller?

A **Controller** contains the actual business logic.

Example:

```js
const registerUser = async (req, res) => {
    // get user data
    // validate data
    // create user
    // save to database
    // send response
};
```

So:

> **Controller = Worker 👨‍💻**

The router says **where to go**, and the controller decides **what to do**.

---

# 3. Why Separate Router and Controller?

You could technically write everything inside the route:

```js
router.post("/register", async (req, res) => {

    // 50 lines of registration logic

});
```

But imagine having:

```text
/register
/login
/logout
/change-password
/update-profile
/delete-account
```

Your route file would become huge.

Instead:

```text
Router
  ↓
Controller
  ↓
Logic
```

This keeps the project clean.

---

# 4. Typical Backend Structure

A Node + Express project might look like:

```text
src/
│
├── controllers/
│   └── user.controller.js
│
├── routes/
│   └── user.routes.js
│
├── models/
│   └── user.model.js
│
├── middlewares/
│   └── auth.middleware.js
│
├── db/
│
├── utils/
│
└── app.js
```

Each folder has a different responsibility.

```text
routes       → Where request goes
controllers  → What request does
models       → Database structure
middlewares  → Checks before controller
utils        → Helper functions
app.js       → Main Express application
```

---

# 5. Router Example

Suppose we have:

```text
POST /api/users/register
```

Our route file:

```js
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);

export default router;
```

The important line is:

```js
router.post("/register", registerUser);
```

Meaning:

```text
POST /register
      ↓
registerUser()
```

---

# 6. Controller Example

Now create:

```text
controllers/user.controller.js
```

```js
const registerUser = async (req, res) => {

    const { username, email, password } = req.body;

    console.log(username);
    console.log(email);
    console.log(password);

    res.status(200).json({
        message: "User registered successfully"
    });
};

export { registerUser };
```

The controller receives the request:

```text
req
```

and sends the response:

```text
res
```

---

# 7. `req` and `res`

This is extremely important in Express.

```js
const registerUser = async (req, res) => {
    
};
```

### `req`

`req` = **request**

It contains information sent by the client.

For example:

```js
req.body
req.params
req.query
req.headers
```

### `res`

`res` = **response**

It is used to send something back.

```js
res.json()
res.status()
res.send()
```

---

# 8. Request Body

Suppose frontend sends:

```json
{
    "username": "Dharam",
    "email": "dharam@gmail.com",
    "password": "123456"
}
```

You can access it using:

```js
req.body
```

Or:

```js
const { username, email, password } = req.body;
```

So:

```text
Frontend
   │
   │ JSON
   ↓
req.body
```

---

# 9. Route Parameters

Suppose you have:

```text
GET /users/123
```

Route:

```js
router.get("/users/:id", getUser);
```

Then:

```js
req.params.id
```

will give:

```text
123
```

Think:

```text
/users/:id
        ↑
      params
```

---

# 10. Query Parameters

Example:

```text
GET /users?page=2&limit=10
```

You can access:

```js
req.query.page
```

and:

```js
req.query.limit
```

So:

```text
req.params → /users/:id

req.query  → /users?page=2

req.body   → JSON/form data
```

---

# 11. Sending Response

Controller:

```js
const getUser = async (req, res) => {

    res.status(200).json({
        username: "Dharam",
        email: "dharam@gmail.com"
    });

};
```

Response:

```json
{
    "username": "Dharam",
    "email": "dharam@gmail.com"
}
```

---

# 12. Connecting Router to App

Creating a router isn't enough.

You need to connect it to your Express app.

In `app.js`:

```js
import userRouter from "./routes/user.routes.js";

app.use("/api/users", userRouter);
```

Now this:

```js
router.post("/register", registerUser);
```

becomes:

```text
POST /api/users/register
```

Because:

```text
/api/users
     +
 /register
     ↓
/api/users/register
```

This is a very important concept.

---

# 13. Complete Flow

Suppose Postman sends:

```text
POST /api/users/register
```

with:

```json
{
    "username": "Dharam",
    "email": "dharam@gmail.com",
    "password": "123456"
}
```

Flow:

```text
Postman / React
       │
       │ POST /api/users/register
       ↓
     app.js
       │
       ↓
/api/users → userRouter
       │
       ↓
/register
       │
       ↓
registerUser()
       │
       ↓
   req.body
       │
       ↓
    Database
       │
       ↓
      res
       │
       ↓
     Postman
```

---

# 14. Router vs Controller ⭐

Remember this table:

| Router           | Controller        |
| ---------------- | ----------------- |
| Defines endpoint | Contains logic    |
| Directs request  | Processes request |
| Small            | Can be larger     |
| `router.get()`   | `getUsers()`      |
| `router.post()`  | `createUser()`    |

Easy memory:

```text
Router      → WHERE?
Controller  → WHAT?
```

Example:

```js
router.post("/register", registerUser);
```

```text
Router:
"Send /register requests to registerUser."

Controller:
"Okay, I'll handle the registration."
```

---

# 15. Where Middleware Comes In

Later you'll have:

```text
Request
   ↓
Router
   ↓
Middleware
   ↓
Controller
   ↓
Database
   ↓
Response
```

Example:

```js
router.get(
    "/profile",
    verifyJWT,
    getProfile
);
```

Here:

```text
verifyJWT → checks authentication
getProfile → actual controller
```

So middleware is like a **security guard** 🛡️.

---

# 16. Debugging

Debugging means:

> Finding exactly where your request is failing.

Suppose:

```text
POST /api/users/register
```

returns:

```text
404 Not Found
```

Don't randomly change code.

Check the flow:

```text
1. Is server running?
        ↓
2. Is app.js loading the router?
        ↓
3. Is the URL correct?
        ↓
4. Is HTTP method correct?
        ↓
5. Does route exist?
        ↓
6. Is controller imported?
        ↓
7. Is controller executing?
```

---

# 17. Using `console.log()` for Debugging

Very useful for beginners.

In router:

```js
router.post("/register", (req, res, next) => {

    console.log("Register route reached");

    next();

}, registerUser);
```

In controller:

```js
const registerUser = async (req, res) => {

    console.log("Controller reached");

    console.log(req.body);

};
```

Now you can see:

```text
Register route reached
Controller reached
{
   username: "Dharam",
   email: "..."
}
```

If you see:

```text
Register route reached
```

but don't see:

```text
Controller reached
```

then you know the problem is somewhere between the router and controller.

---

# 18. Common Errors

### `404 Not Found`

Usually:

```text
Wrong URL
Wrong route
Wrong HTTP method
Router not connected
```

---

### `500 Internal Server Error`

Usually:

```text
Controller crashed
Database problem
Undefined variable
Programming error
```

---

### `req.body` is undefined

Check whether Express has:

```js
app.use(express.json());
```

And make sure you're sending JSON correctly.

---

### Controller import error

Example:

```text
registerUser is not exported
```

Check:

```js
export { registerUser };
```

and:

```js
import { registerUser } from "../controllers/user.controller.js";
```

---

# 19. The Big Picture

Eventually your backend will look like:

```text
                  HTTP REQUEST
                       │
                       ↓
                    app.js
                       │
                       ↓
                    Router
                       │
                       ↓
                  Middleware
                       │
                       ↓
                  Controller
                       │
                       ↓
                    Model
                       │
                       ↓
                   MongoDB
                       │
                       ↓
                    Model
                       │
                       ↓
                  Controller
                       │
                       ↓
                 HTTP RESPONSE
                       │
                       ↓
                 React / Client
```

### 🧠 Remember these 5 lines

```text
HTTP       → Communication
Router     → Where should request go?
Middleware → Should request be allowed?
Controller → What should happen?
Model      → How do we interact with database?
```

This is the **core structure** you'll keep seeing throughout your Node + Express backend learning.

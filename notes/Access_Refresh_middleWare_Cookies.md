 This topic is about **Access Token + Refresh Token + Middleware + Cookies**. This is a very important part of authentication.

A good notes filename:

`access-refresh-token-middleware-cookies.md`

# 🔐 Access Token + Refresh Token + Middleware + Cookies

## 1. Big Picture

After registration/login, we don't want the user to send their username/password with every request.

Instead:

```text
Login
  ↓
Username + Password
  ↓
Backend verifies
  ↓
Access Token + Refresh Token
  ↓
Cookies
  ↓
Future requests
  ↓
Authentication Middleware
  ↓
Verify Access Token
  ↓
Allow / Reject
```

---

# 2. What is Access Token?

An **Access Token** proves:

> "This request is coming from an authenticated user."

Example:

```text
Access Token
    ↓
GET /api/v1/users/profile
    ↓
Middleware verifies token
    ↓
User allowed
```

Usually the access token has a **short expiry**.

For example:

```text
Access Token
→ 15 minutes
→ 1 hour
```

The exact expiry depends on your application.

---

# 3. What is Refresh Token?

The access token eventually expires.

Instead of asking the user to log in again, we use a **Refresh Token**.

```text
Access Token expires
        ↓
Refresh Token
        ↓
Generate new Access Token
        ↓
User continues using application
```

So:

```text
Access Token  → Access APIs
Refresh Token → Get new Access Token
```

---

# 4. Why Two Tokens?

Imagine:

```text
Access Token = temporary ID card
Refresh Token = way to get a new ID card
```

If the access token expires:

```text
❌ Access Token expired
       ↓
✅ Refresh Token still valid
       ↓
New Access Token
```

This gives us a better authentication flow.

---

# 🍪 5. What are Cookies?

A **cookie** is small data stored by the browser and automatically sent with requests to the relevant server.

For authentication, we can store tokens in cookies.

Example:

```text
Browser
│
├── accessToken
└── refreshToken
```

Then the browser sends them with requests.

---

# 6. Why Use Cookies?

Instead of manually doing:

```js
Authorization: Bearer <token>
```

for every browser request, cookies can automatically be sent with requests.

For authentication cookies, you commonly see:

```js
httpOnly: true
secure: true
```

---

# 🔒 7. `httpOnly`

Example:

```js
res.cookie("accessToken", accessToken, {
    httpOnly: true
});
```

`httpOnly` means JavaScript running in the browser cannot directly read that cookie.

Conceptually:

```text
JavaScript
   ❌
   ↓
httpOnly Cookie
   ↑
Browser automatically sends it
```

This helps reduce certain cookie-theft risks from client-side scripts.

---

# 🔐 8. `secure`

```js
secure: true
```

means the cookie should only be sent over HTTPS.

During local development, you may commonly use:

```js
secure: false
```

and in production:

```js
secure: true
```

depending on your deployment setup.

---

# 9. Login Flow

After the user logs in:

```text
Email + Password
       ↓
Find User
       ↓
Compare Password
       ↓
Generate Access Token
       ↓
Generate Refresh Token
       ↓
Save Refresh Token
       ↓
Send Tokens in Cookies
```

---

# 10. Generate Access Token

In your User model you might have:

```js
userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};
```

---

# 11. Generate Refresh Token

Similarly:

```js
userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};
```

Notice:

```text
Access Token
→ ACCESS_TOKEN_SECRET

Refresh Token
→ REFRESH_TOKEN_SECRET
```

Don't use the same secret casually for both.

---

# 12. Save Refresh Token

After generating the refresh token:

```js
const refreshToken = user.generateRefreshToken();

user.refreshToken = refreshToken;

await user.save({ validateBeforeSave: false });
```

Now the database contains the refresh token for that user.

---

# 13. Send Tokens in Cookies

Example:

```js
res
    .status(200)
    .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true
    })
    .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true
    })
    .json({
        message: "User logged in successfully"
    });
```

So:

```text
Backend
   ↓
Set-Cookie
   ↓
Browser
   ↓
Cookies stored
```

---

# 🧩 14. What is Authentication Middleware?

Middleware sits between the request and controller.

```text
Request
   ↓
Middleware
   ↓
Controller
   ↓
Response
```

For example:

```text
GET /profile
      ↓
auth.middleware
      ↓
profile controller
```

The middleware asks:

> "Is this user authenticated?"

---

# 15. Get Access Token From Cookie

Because we use cookies:

```js
const token = req.cookies?.accessToken;
```

If no token:

```js
if (!token) {
    throw new ApiError(401, "Unauthorized request");
}
```

---

# 16. Verify JWT

Now use:

```js
jwt.verify()
```

Example:

```js
const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET
);
```

If the token is valid:

```text
JWT
 ↓
jwt.verify()
 ↓
Valid
 ↓
Continue
```

If invalid:

```text
JWT
 ↓
jwt.verify()
 ↓
Invalid / expired
 ↓
401 Unauthorized
```

---

# 17. Find User

The decoded token contains the user's ID.

```js
const user = await User.findById(
    decodedToken?._id
).select("-password -refreshToken");
```

If user doesn't exist:

```js
if (!user) {
    throw new ApiError(401, "Invalid access token");
}
```

---

# 18. Put User Inside `req`

This is a very important concept:

```js
req.user = user;
```

Now the next controller can access:

```js
req.user
```

For example:

```js
const getProfile = asyncHandler(async (req, res) => {

    console.log(req.user);

});
```

### Flow

```text
Cookie
  ↓
Access Token
  ↓
JWT verify
  ↓
Find User
  ↓
req.user = user
  ↓
Controller
```

---

# 19. Complete Auth Middleware

Simplified:

```js
const verifyJWT = asyncHandler(async (req, res, next) => {

    try {

        const token = req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(
                401,
                "Unauthorized request"
            );
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(
            decodedToken?._id
        ).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(
                401,
                "Invalid access token"
            );
        }

        req.user = user;

        next();

    } catch (error) {

        throw new ApiError(
            401,
            error?.message || "Invalid access token"
        );
    }
});
```

---

# 20. Why `next()`?

Middleware doesn't usually finish the request itself.

It says:

> "Everything is okay. Continue to the next function."

```js
next();
```

Flow:

```text
Request
   ↓
verifyJWT
   ↓
Valid?
 ↙    ↘
NO     YES
↓       ↓
Error  next()
         ↓
    Controller
```

---

# 21. Protected Route

Now we can protect a route:

```js
router.get(
    "/profile",
    verifyJWT,
    getProfile
);
```

Notice:

```text
verifyJWT
```

comes before:

```text
getProfile
```

So:

```text
GET /profile
      ↓
verifyJWT
      ↓
Is user authenticated?
      ↓
getProfile
```

---

# 22. Refresh Token Flow

Suppose:

```text
Access Token → expired
Refresh Token → still valid
```

Client calls:

```text
POST /refresh-token
```

Backend:

```text
Refresh Token
      ↓
Verify Refresh Token
      ↓
Find User
      ↓
Compare stored refresh token
      ↓
Generate new Access Token
      ↓
Send new Access Token
```

---

# 23. Why Store Refresh Token in Database?

Your User document can have:

```js
refreshToken: {
    type: String
}
```

Then:

```text
MongoDB
│
└── User
     └── refreshToken
```

During refresh:

```text
Cookie Refresh Token
       ↓
Verify JWT
       ↓
Find User
       ↓
Compare with stored token
       ↓
Valid?
```

This gives the server more control over active refresh tokens.

---

# 🧠 24. Complete Authentication Picture

```text
                    LOGIN
                      │
                      ↓
              Email + Password
                      │
                      ↓
               Verify Password
                      │
                      ↓
          ┌───────────┴───────────┐
          ↓                       ↓
    Access Token            Refresh Token
          │                       │
          └───────────┬───────────┘
                      ↓
                   Cookies
                      │
                      ↓
                 Browser
                      │
                      ↓
              Protected Request
                      │
                      ↓
                verifyJWT
                      │
                      ↓
              Get Access Token
                      │
                      ↓
                 jwt.verify()
                      │
                      ↓
                 Find User
                      │
                      ↓
                req.user = user
                      │
                      ↓
                 Controller
```

---

# ⭐ What You Should Remember for Notes

```text
ACCESS TOKEN
→ Used to access protected APIs
→ Usually short-lived
→ Verified by middleware

REFRESH TOKEN
→ Used to generate a new access token
→ Usually longer-lived
→ Can be stored in DB

COOKIE
→ Stores/sends authentication tokens
→ httpOnly helps prevent JavaScript access
→ secure sends cookie only over HTTPS

MIDDLEWARE
→ Runs before controller
→ Verifies authentication
→ Adds user to req.user

JWT
→ Signed authentication token
→ jwt.sign() → create token
→ jwt.verify() → verify token

next()
→ Continue to next middleware/controller
```

### 🔥 One-line flow to memorize

**Login → Generate tokens → Cookies → Request → Middleware → Verify Access Token → `req.user` → Controller**

And when access token expires:

**Refresh Token → Verify → New Access Token → Continue session.**

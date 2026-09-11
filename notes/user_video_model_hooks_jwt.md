

`user-video-model-hooks-jwt.md`

# 👤 User & Video Model + Hooks + JWT

## 1. User Model

A **User model** defines what information we store about a user in MongoDB.

Example:

```js
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    fullname: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        required: true
    },

    coverImage: {
        type: String
    },

    password: {
        type: String,
        required: true
    },

    refreshToken: {
        type: String
    }
});
```

### Easy understanding

```text
User
│
├── username
├── email
├── fullname
├── avatar
├── coverImage
├── password
└── refreshToken
```

---

# 🔐 2. Why password should be hashed?

Never store:

```text
password: "123456"
```

directly in MongoDB.

Instead:

```text
User enters password
        ↓
bcrypt
        ↓
hashed password
        ↓
MongoDB
```

Example:

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

So MongoDB stores something like:

```text
$2b$10$8F............
```

instead of:

```text
123456
```

---

# 🪝 3. What is a Mongoose Hook?

A **hook** allows us to run some code automatically before or after a database operation.

For example:

```js
schema.pre("save", function(next) {
    // code
    next();
});
```

`pre` means:

> Run this code **before** the operation.

`post` means:

> Run this code **after** the operation.

---

# 🔑 4. Password Hashing Hook

Instead of hashing the password manually every time, we can use a hook.

```js
userSchema.pre("save", async function(next) {

    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

    next();
});
```

### What happens?

```text
User creates account
        ↓
save()
        ↓
pre("save")
        ↓
Password hashed
        ↓
MongoDB
```

---

# 🧠 5. Why `isModified("password")`?

Suppose the user changes their username.

We don't want to hash the password again.

So:

```js
this.isModified("password")
```

checks:

> Has the password actually changed?

If no:

```js
return next();
```

If yes:

```js
this.password = await bcrypt.hash(...)
```

---

# 🔍 6. Password Compare Method

We can create a custom method:

```js
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};
```

Now:

```js
user.isPasswordCorrect("123456");
```

returns:

```text
true
```

or:

```text
false
```

### Flow

```text
Entered Password
       ↓
bcrypt.compare()
       ↓
Stored Hash
       ↓
true / false
```

---

# 🎫 7. What is JWT?

JWT = **JSON Web Token**

It is commonly used for authentication.

Think of JWT like an **identity pass**.

After login:

```text
Email + Password
       ↓
Backend verifies
       ↓
JWT generated
       ↓
Client receives JWT
```

Then the client sends the token with future requests.

```text
Client
  ↓
JWT
  ↓
Backend
  ↓
Verify JWT
  ↓
Allow / Reject request
```

---

# 🔑 8. Access Token vs Refresh Token

Usually we use two tokens.

### Access Token

Short-lived.

Used for accessing protected APIs.

```text
Access Token
↓
Short lifetime
↓
API requests
```

### Refresh Token

Longer-lived.

Used to generate a new access token.

```text
Refresh Token
↓
New Access Token
```

Easy way to remember:

```text
Access Token  → Access API
Refresh Token → Get new Access Token
```

---

# 🧩 9. Generate JWT

We can create a method:

```js
userSchema.methods.generateAccessToken = function() {

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

JWT contains information called **payload**.

Example:

```js
{
    _id: user._id,
    email: user.email,
    username: user.username
}
```

---

# 🔄 10. User Authentication Flow

```text
REGISTER
   ↓
User enters details
   ↓
Password hashed using bcrypt
   ↓
User saved in MongoDB
```

Then login:

```text
LOGIN
  ↓
Email + Password
  ↓
Find User
  ↓
Compare Password
  ↓
Generate JWT
  ↓
Access Token + Refresh Token
```

Then protected API:

```text
Request
   ↓
Authorization Header
   ↓
JWT
   ↓
Verify Token
   ↓
Find User
   ↓
Allow Request
```

---

# 🎥 11. Video Model

Now we create a model for videos.

A video might contain:

```text
Video
│
├── videoFile
├── thumbnail
├── title
├── description
├── duration
├── views
├── isPublished
├── owner
└── timestamps
```

Example:

```js
const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String,
            required: true
        },

        thumbnail: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        views: {
            type: Number,
            default: 0
        },

        isPublished: {
            type: Boolean,
            default: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },

    {
        timestamps: true
    }
);
```

---

# 🔗 12. What is `ref: "User"`?

This is important.

```js
owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}
```

means:

> This video belongs to a particular User.

For example:

```text
User
_id = 123
```

Video:

```text
title: "JavaScript Tutorial"
owner: 123
```

So MongoDB knows:

```text
Video ─────────→ User
```

This is called a **reference**.

---

# 🔍 13. `populate()`

Later, we can use:

```js
Video.find().populate("owner");
```

Instead of getting only:

```js
owner: "123"
```

we can get the related user information.

Conceptually:

```text
Video
  ↓
owner ID
  ↓
User collection
  ↓
User information
```

---

# ⭐ 14. Important Concepts From This Topic

| Concept       | Meaning                                           |
| ------------- | ------------------------------------------------- |
| Schema        | Structure of MongoDB document                     |
| Model         | Interface used to interact with collection        |
| Hook          | Automatically runs code before/after operation    |
| `pre()`       | Before operation                                  |
| `post()`      | After operation                                   |
| `bcrypt`      | Password hashing/comparison                       |
| JWT           | Authentication token                              |
| Access Token  | Used for API access                               |
| Refresh Token | Used to obtain new access token                   |
| `ObjectId`    | MongoDB document identifier                       |
| `ref`         | Creates relationship/reference                    |
| `populate()`  | Gets referenced document                          |
| `timestamps`  | Automatically creates `createdAt` and `updatedAt` |

## 🧠 Final picture

```text
                 USER
                  │
        ┌─────────┴─────────┐
        ↓                   ↓
   Password              JWT
     bcrypt                │
        ↓                  ↓
    MongoDB          Authentication
        │
        │
        ↓
      VIDEO
        │
        ├── title
        ├── description
        ├── videoFile
        ├── thumbnail
        ├── views
        └── owner ───────→ USER
```

**The main idea:**
**User model = user data + password security + JWT methods**
**Video model = video data + relationship with User**
**Hooks = automatic logic around database operations**.

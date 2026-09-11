Here is a notes format similar to your HTTP notes.

# 📁 Backend Notes — Multer / File Upload

## 1. What is file upload?

Normally, when a frontend sends data to backend, it may send JSON:

```json
{
  "username": "Dharam",
  "email": "test@gmail.com"
}
```

But files like:

- 🖼️ Images
- 📄 PDFs
- 🎥 Videos
- 🎵 Audio

cannot be handled using normal JSON data.

For files, we commonly use:

```text
Frontend
   ↓
FormData
   ↓
HTTP Request
   ↓
Express
   ↓
Multer
   ↓
File
   ↓
Server / Cloudinary / S3
```

---

# 2. What is Multer?

**Multer is an Express middleware used to handle `multipart/form-data`, mainly for uploading files.**

Simple meaning:

> **Multer takes the uploaded file from the request and makes it available to your backend.**

Example:

```text
User selects:
profile.jpg

        ↓

Frontend sends file

        ↓

Multer receives file

        ↓

Backend gets:
req.file
or
req.files
```

---

# 3. Why can't we use JSON?

JSON is mainly for text/data:

```json
{
  "name": "Dharam",
  "age": 20
}
```

A file is binary data, so for uploading files we generally use:

```text
multipart/form-data
```

This is why you see this in Postman:

```text
Body
 └── form-data
      ├── username → Dharam
      └── avatar   → profile.jpg
```

---

# 4. Install Multer

In your backend project:

```bash
npm install multer
```

Then import it:

```js
import multer from "multer";
```

---

# 5. Basic Multer Setup

Multer needs to know **where to temporarily store the uploaded file**.

Example:

```js
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
```

Think of it like:

```text
Multer
  │
  ├── Where?
  │     ↓
  │   ./public/temp
  │
  └── What name?
        ↓
      original filename
```

---

# 6. `diskStorage()`

```js
multer.diskStorage();
```

means:

> Store the uploaded file on the **disk/server**.

It has mainly two important functions:

### `destination`

```js
destination: function (req, file, cb) {
    cb(null, "./public/temp");
}
```

This tells Multer:

> Put the uploaded file inside `public/temp`.

Example:

```text
project/
│
├── public/
│   └── temp/
│       └── avatar.jpg
│
├── src/
├── package.json
└── ...
```

---

# 7. `filename`

```js
filename: function (req, file, cb) {
    cb(null, file.originalname);
}
```

This determines the filename.

If user uploads:

```text
profile.jpg
```

Multer stores:

```text
profile.jpg
```

---

# 8. What is `req.file`?

When uploading **one file**, Multer gives you:

```js
req.file;
```

Example:

```js
router.post("/upload", upload.single("avatar"), (req, res) => {
  console.log(req.file);

  res.json({
    message: "File uploaded",
  });
});
```

Flow:

```text
upload.single("avatar")
          ↓
       Multer
          ↓
      req.file
```

---

# 9. `single()`

```js
upload.single("avatar");
```

means:

> I am expecting **one file**, and its field name is `avatar`.

Postman:

```text
Body → form-data

KEY          TYPE       VALUE
--------------------------------
avatar       File       photo.jpg
```

Backend:

```js
upload.single("avatar");
```

Then:

```js
req.file;
```

contains information about that file.

---

# 10. `array()`

If you want multiple files with the **same field name**:

```js
upload.array("images", 5);
```

Means:

> Accept up to 5 files under the `images` field.

Then:

```js
req.files;
```

Example:

```text
images
 ├── image1.jpg
 ├── image2.jpg
 └── image3.jpg
```

---

# 11. `fields()`

This is especially important in the **Chai aur Code backend project**.

Suppose registration requires:

```text
avatar
coverImage
```

You can write:

```js
upload.fields([
  {
    name: "avatar",
    maxCount: 1,
  },
  {
    name: "coverImage",
    maxCount: 1,
  },
]);
```

Now Multer accepts:

```text
avatar      → 1 file
coverImage  → 1 file
```

And backend receives:

```js
req.files;
```

with something conceptually like:

```js
{
    avatar: [file],
    coverImage: [file]
}
```

That's why in your backend project you had:

```js
upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
```

---

# 12. `req.file` vs `req.files`

Very important:

### One file

```js
upload.single("avatar");
```

Use:

```js
req.file;
```

### Multiple files of same type

```js
upload.array("images", 5);
```

Use:

```js
req.files;
```

### Multiple different file fields

```js
upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
```

Use:

```js
req.files;
```

---

# 13. Multer does NOT mean permanent storage

This is an important concept.

Multer can temporarily put the file on your server:

```text
User
 ↓
Multer
 ↓
./public/temp
```

But production applications often send the file to cloud storage:

```text
User
 ↓
Multer
 ↓
Temporary file
 ↓
Cloudinary / AWS S3
 ↓
Permanent URL
```

For your Chai aur Code project, this is where **Cloudinary** comes in.

---

# 14. Multer + Cloudinary

Typical backend flow:

```text
          USER
            │
            ↓
        Upload Image
            │
            ↓
        Express Route
            │
            ↓
          Multer
            │
            ↓
     ./public/temp
            │
            ↓
       Cloudinary
            │
            ↓
    Cloudinary URL
            │
            ↓
       MongoDB
```

MongoDB doesn't usually store the actual image.

Instead, you store something like:

```js
avatar: "https://cloudinary.com/....";
```

So:

```text
Image → Cloudinary
URL   → MongoDB
```

---

# 15. Complete simple example

### Multer middleware

```js
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
```

### Route

```js
router.post("/upload", upload.single("avatar"), uploadFile);
```

### Controller

```js
const uploadFile = async (req, res) => {
  console.log(req.file);

  res.status(200).json({
    message: "File uploaded successfully",
  });
};
```

Flow:

```text
POST /upload
      ↓
upload.single("avatar")
      ↓
Multer
      ↓
req.file
      ↓
Controller
```

---

# 16. Postman testing

In Postman:

```text
POST
http://localhost:8000/api/v1/users/upload
```

Go to:

```text
Body
 ↓
form-data
```

Then:

| KEY    | TYPE | VALUE     |
| ------ | ---- | --------- |
| avatar | File | photo.jpg |

⚠️ The key must match:

```js
upload.single("avatar");
```

If Postman says:

```text
avatar
```

but backend says:

```js
upload.single("profile");
```

they don't match.

---

# 17. Easy way to remember Multer

Remember these 4 things:

```text
Multer
  ↓
1. Receives file
  ↓
2. Stores file temporarily
  ↓
3. Gives file to backend through req.file / req.files
  ↓
4. Backend can send it to Cloudinary/S3
```

### Most important syntax

```js
upload.single("avatar");
```

➡️ One file

```js
upload.array("images", 5);
```

➡️ Multiple same-type files

```js
upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
```

➡️ Multiple different file fields

// here it may be error later

// ApiError is a special version of JavaScript's normal Error
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Internal Server Error",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;
    this.message = message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };



// Validation
//     ↓
// Problem detected
//     ↓
// ApiError
//     ↓
// Error middleware

// Using ApiError
// Suppose user doesn't exist.

// Skeleton
// if (!user) {
//     throw new ApiError(
//         /* status code */,
//         /* message */
//     );
// }

// // Understanding super()

// This is important JavaScript knowledge.

// class ApiError extends Error {


//     constructor(message) {
//         super(message);
//     }


// }

// super(message) calls the constructor of the parent class:

// Error
//  ↑
//  │ extends
//  │
// ApiError

// So:

// super(message)

// initializes the built-in Error.

// That's why your custom error gets things like:

// error.message
// error.stack
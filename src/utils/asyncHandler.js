// We haven't sent the response yet.
// We've only created an error.
// That's where middleware comes in.

// This looks complicated, but its purpose is simple:

// If an async controller fails, automatically send the error to next(error).

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// const asyncHandler =  () => {}
// const asyncHandler =  (func) => () => {}
// const asyncHandler = (fn) => async() => {}

//   const asyncHandler = (fn) => (req, res, next) => {
// try{
// await fn(req, res, next)
//   } catch (error) {
//    res.status(err.code || 500).json({
//     sucess: false,
//     message: err.message || "Internal Server Error"
//    })
//   }
//   };


// without async handler
/*const getUser = async (req, res, next) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        res.status(200).json(
            new ApiResponse(200, user)
        );

    } catch (error) {
        next(error);
    }
};
////////


// with async handler
const getUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User fetched successfully"
        )
    );
});
*/
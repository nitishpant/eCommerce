const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//register a user
exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: {
      public_id: "sample public id",
      url: "sample url",
    },
  });

  sendToken(user, 201, res);
});

// user login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("please enter both email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid email or password", 401));

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch)
    return next(new ErrorHandler("Invalid email or password", 401));

  sendToken(user, 200, res);
});

//user logout
exports.logoutUser = catchAsyncErrors( async(req, res, next)=>{
  res.cookie("token",null,{   
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  
  
  res.status(200).json({
    success:true,
    message:"Logged out"
  })
})

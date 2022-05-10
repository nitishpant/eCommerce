const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");


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

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//fogot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //get resetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({
    validateBeforeSave: false,
  });
  const resetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`; //http://localhost/api/v1/reset/${resetToken}

  const message = `Your password reset URL is : \n \n ${resetPasswordURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email to : ${user.email} sent successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({
      validateBeforeSave: false,
    });
    return next(new ErrorHandler(error.message, 500));
  }
});


//resetPassword 
exports.resetPassword = catchAsyncErrors( async(req, res, next)=>{
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
})

//logout User

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


//get user details
exports.getUserDetails = catchAsyncErrors( async(req, res, next)=>{
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success:true,
    user
  })
})

//update user Password
exports.updatePassword = catchAsyncErrors( async(req, res, next)=>{
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

  if(!isPasswordMatch){
    return next(new ErrorHandler("Password doesn't match",401));
  }
  if(req.body.newPassword!== req.body.confirmPassword){
         return next(new ErrorHandler("Password doesn't match",401));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user,200,res);
})

//get all users Admin only
exports.getAllUsers = catchAsyncErrors( async(req, res, next)=>{
  const users = await User.find();

  res.status(200).json({
    success:true,
    users
  })
})

// get user details Admin only
exports.getSingleUserDetails = catchAsyncErrors( async(req, res, next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
     return next( new ErrorHandler("user does not exist",400));
  }

  res.status(200).json({
    success:true,
    user
  })
})



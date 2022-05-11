const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

//get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//get logged in user's Order
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//get all order for admin
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

//update order status
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.find(req.params.id);
  
    if(order.status==="Delivered"){
        return next(new ErrorHandler("order already Delivered",404))
    }
    order.orderItems.forEach((order)=>{
        await updateStock(order.Product, order.Quantity);
    })
    order.orderStatus = req.body.status;
    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave:false});
    res.status(200).json({
      success: true,
      orders,
      totalAmount,
    });
  });

  async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.stock-=quantity;

    await product.save({validateBeforeSave:false});
  }

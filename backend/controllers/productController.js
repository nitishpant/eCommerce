const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//create product -only admins
exports.createProduct = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
});

//updateProduct -only admins
exports.updateProduct = catchAsyncErrors(async (req, res, next)=>{
    try{
        let product = await Product.findById(req.params.id)
        if(!product){
            return next(new ErrorHandler("Product not found",404));
        }
        else{        
            product = await Product.findByIdAndUpdate(req.params.id, req.body, {
                runValidators:true,
                useFindAndModify:false
            });
            res.status(200).json({
                success:true,
                product
            })
        }        
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:err
        })
    }
});

//delete product - only admin
exports.deleteProduct = catchAsyncErrors(async (req, res)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    else{
        await product.remove();
        res.status(200).json({
            success:true,
            message:"product deleted successfully"
        })
    }
});

//get all products
exports.getAllProducts = catchAsyncErrors(async (req, res)=>{ 
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products
    });
});

//get single product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
       return next(new ErrorHandler("Product not found",404));
    }
    else{
        res.status(200).json({
            success:true,
            product
        })
    }
});
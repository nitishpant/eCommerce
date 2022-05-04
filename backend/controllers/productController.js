const Product = require("../models/productModel")


//create product -only admins
exports.createProduct = async (req, res, next)=>{
    try{
        const product = await Product.create(req.body);
        res.status(201).json({
            success:true,
            product
        })
    }
    catch(err){
        res.status(400).json({
            error:err
        })
    }
}

//updateProduct -only admins
exports.updateProduct = async (req, res, next)=>{
    try{
        let product = await Product.findById(req.params.id)
        if(!product){
            res.status(404).json({
                success:false,
                message:"Product id invalid"
            })
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
}

//delete product - only admin
exports.deleteProduct = async (req, res)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    else{
        await product.remove();
        res.status(200).json({
            success:true,
            message:"product deleted successfully"
        })
    }
}

//get all products
exports.getAllProducts = async (req, res)=>{ 
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products
    });
}

//get single product details
exports.getProductDetails = async (req, res, next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    else{
        res.status(200).json({
            success:true,
            product
        })
    }
}
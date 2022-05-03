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

//get all products
exports.getAllProducts = async (req, res)=>{ 
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products
    });

}
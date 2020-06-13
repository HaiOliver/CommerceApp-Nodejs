// import express
const express = require("express");

// use router() from express
const router = express.Router();

// connect to tamplate load => products
const productsIndexTemplate = require("../views/products/index");

// connect ProductRepo to use => functions
const productsRepo = require("../repositories/products");

router.get("/",async (req,res)=>{

const products = await productsRepo.getAll();


    res.send(productsIndexTemplate({products}))
})



module.exports = router;
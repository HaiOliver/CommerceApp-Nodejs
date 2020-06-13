const express = require("express");

const router = express.Router();

//inport Cart repositories
const cartRepo = require("../repositories/carts")

//import product repo
const productsRepo = require("../repositories/products");

//import show.js => list all products in cart
const cartShowTemplate = require('../views/carts/show')

//post request => add item
router.post("/cart/products",async (req,res)=>{
    //figure it out
    let cart
    if(!req.session.cartId){
        // we dont have cart => create new one
        //store cratId inside
        cart = await cartRepo.create({items:[]});
        // assign ID back
        req.session.cartId = cart.id;

    }else{
        cart = await cartRepo.getOne(req.session.cartId)
    }

    console.log(cart)

    const existingItem = cart.items.find(item => 
         item.id === req.body.productId)

    if(existingItem){
          // increment quantity bc item exist
        existingItem.quantity++;
    }else{
        cart.items.push({id:req.body.productId, quantity:1})
    }

    await cartRepo.update(cart.id, {
        items: cart.items
    })
  
    //or add new product
    res.redirect("/cart");
})

// get request => load items in cart
router.get("/cart",async (req,res)=>{
    // check card id exist
    if(!req.session.cartId){
        return res.redirect("/");
    }

    const cart = await cartRepo.getOne(req.session.cartId);

    for(let item of cart.items){
        const product = await productsRepo.getOne(item.id);
        item.product = product;
    }

    res.send(cartShowTemplate({items: cart.items}))
})


//delete

router.post("/cart/products/delete",async(req,res)=>{
    console.log(req.body.itemId)

    // grab all items in cart
    const cart = await cartRepo.getOne(req.session.cartId);
    
    const items = cart.items.filter(item => item.id !== req.body.itemId)
   
    await cartRepo.update(req.session.cartId,{items: items})
    res.redirect("/cart");
})


module.exports = router;
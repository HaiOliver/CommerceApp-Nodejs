//install express library & import it
const express = require("express");

//install express body-parser & import it
const bodyParse = require("body-parser");

//install express cookkie & import it
const cookieSession = require("cookie-session");



//==========================++++++++++ START CODING++++++++++++++================================================================
const app = express();

//connect to public folder..THIS SHOULD LOAD FIRST..show all css,html
app.use(express.static("public"));



// ========================= connect index.js to sub router -> auth, product, cart ===========================
// ============================================================================================================
//connect routers in auth.js
const authRouter = require("./routes/admin/auth");

//hookup auth.js into main index.js. connect auth folder and authRouter
app.use(authRouter);


//connect routers in products.js => admin
const adminProductsRouter = require("./routes/admin/products");

//hook up product.js to load whole products
app.use(adminProductsRouter);

//connect router in product.js => load whole products
const productsRouter = require("./routes/products")




//connect router in carts.js => create cart repositories
const cartsRouter = require("./routes/carts")
//hook up cart.js to => carts repositories
app.use(cartsRouter);


//hookup to product router
app.use(productsRouter);


//===========================================================================



// create Middle ware body parser library
app.use(bodyParse.urlencoded({ extended: true }));
//create Cookie library
app.use(
	cookieSession({
		keys: ["sdsdsdsdsdsds"],
	})
);


// CHECK IN SERVER CONNECTION
app.listen(3000, () => {
	console.log("server is listening at port 3000");
});

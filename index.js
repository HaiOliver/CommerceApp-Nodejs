//install express library & import it
const express = require("express");

//install express body-parser & import it
const bodyParse = require("body-parser");

//install express cookkie & import it
const cookieSession = require("cookie-session");

//================================ START CODING================================================================
const app = express();

//connect to public folder..THIS SHOULD LOAD FIRST..show all css,html
app.use(express.static("public"));

//connect routers in auth.js
const authRouter = require("./routes/admin/auth");

//connect routers in products.js => admin
const adminProductsRouter = require("./routes/admin/products");

//connect router in product.js => load whole products
const productsRouter = require("./routes/products")

//connect router in carts.js => create cart repositories
const cartsRouter = require("./routes/carts")

// create Middle ware body parser library
app.use(bodyParse.urlencoded({ extended: true }));
//create Cookie library
app.use(
	cookieSession({
		keys: ["sdsdsdsdsdsds"],
	})
);

//hookup auth.js into main index.js. connect auth folder and authRouter
app.use(authRouter);

//hook up product.js to load whole products
app.use(adminProductsRouter);

//hook up cart.js to => carts repositories
app.use(cartsRouter);
//hookup to product router
app.use(productsRouter);

// CHECK IN SERVER CONNECTION
app.listen(3000, () => {
	console.log("server is istening at port 3000");
});

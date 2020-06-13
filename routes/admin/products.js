//import express
const express = require("express");
// import multer to handle for image upload
var multer = require("multer");

// link to midlleware.js in route/admin/middlewares.js
const { handleErrors, requireAuth } = require("./middlewares");

//link to productRepository
const ProductRepo = require("../../repositories/products");

//link to template create new product
const productsNewTemplate = require("../../views/admin/products/new");
//link to Edit template to load for line 66
const productsEditTemplate = require("../../views/admin/products/edit");
//connect index.js to render all products
const productsIndexTemplate = require("../../views/admin/products/index");

// link to vaidate
const { requireTitle, requirePrice } = require("./validator");

// express.router()
const router = express.Router();

// create destination for image
const upload = multer({ storage: multer.memoryStorage() });

// ============================== START ROUTE HERE============================

//create homepage
router.get("/admin/products", requireAuth, async (req, res) => {
	const products = await ProductRepo.getAll();

	// call index.js to render list products
	res.send(productsIndexTemplate({ products }));
});

//create new product route
router.get("/admin/products/new", requireAuth, (req, res) => {
	res.send(productsNewTemplate({}));
});

//Post route for post
router.post(
	"/admin/products/new",
	upload.single("image"),
	[requireTitle, requirePrice],
	// handle error from require Tittle and Price
	handleErrors(productsNewTemplate),
	requireAuth,
	async (req, res) => {
		const image = req.file.buffer.toString("base64");

		const { title, price } = req.body;

		await ProductRepo.create({ title, price, image });
		res.redirect("/admin/products");
	}
);

//load for edit button for product
router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
	const product = await ProductRepo.getOne(req.params.id);
	if (!product) {
		res.send("product is not found, product.js line65 trigger");
	}
	res.send(productsEditTemplate({ product }));
});

// post for edit.js when user change form
router.post(
	"/admin/products/:id/edit",
	requireAuth,
	upload.single("image"),
	[requireTitle, requirePrice],
	handleErrors(productsEditTemplate, async (req) => {
		// grab 1 product from DB
		const product = await ProductRepo.getOne(req.params.id);
		return { product };
	}),
	async (req, res) => {
		const changes = req.body;
		//change img picture
		if (req.image) {
			changes.image = req.file.buffer.toString("base64");
		}
		// use update in product repositpries
		try {
			await ProductRepo.update(req.params.id, changes);
		} catch (e) {
			return res.send(
				"Product is not found by id, products.js line 88"
			);
		}

		res.redirect("/admin/products");
	}


);


router.post("/admin/products/:id/delete",requireAuth,async (req,res)=>{

	await ProductRepo.delete(req.params.id);

	res.redirect("/admin/products")

})


module.exports = router;

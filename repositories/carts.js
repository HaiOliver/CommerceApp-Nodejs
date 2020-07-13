// import repositories -> parent -> child
const Repositories = require("./repository");


class CartsRepositories extends Repositories{

}

module.exports = new CartsRepositories('carts.json');
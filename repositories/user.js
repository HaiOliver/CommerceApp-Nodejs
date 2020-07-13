const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
// import parent 
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepositories extends Repository {
	async create(attribute) {
		//add random id
		attribute.id = this.randomId();

		//create salt for password
		const salt = crypto.randomBytes(8).toString("hex");

		//create hash base on salt
		const buf = await scrypt(attribute.password, salt, 64);

		// call all records
		const records = await this.getAll();

		//push hashed to user
		const record = {
			//why ....?
			...attribute,
			password: `${buf.toString("hex")}.${salt}`,
		};
		records.push(record);
		await this.writeAll(records);

		return record;
	}

	//compare Password
	async comparePassword(saved, supplied) {
		//saved -> db : 'pass.salt'
		//supplied: password given
		const [hashed, salt] = saved.split(".");

		const hashedSupplied = await scrypt(supplied, salt, 64);

		return hashed === hashedSupplied.toString("hex");
	}
}

// TEST CODE
module.exports = new UsersRepositories("users.json");
// const test = async () => {
// 	const repo = new UsersRepositories("users.json");
// 	await repo.getOneBy({ email: "test@test.com" });
// };

// test();

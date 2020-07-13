// create file in node
const fs = require("fs");
// 
const crypto = require("crypto");

module.exports = class Repository {
	constructor(filename) {
		if (!filename) {
			throw new Error(
				"Constructor of UsersRepositories dont have file name"
			);
		}
		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, "[]");
		}
	}
	// =============================== get all member ====================================
	async getAll() {
		// open file
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: "utf8",
			})
		);
	}

	// =============================== delete all -> create new one ====================================
	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 3)
		);
	}

	// =============================== add new record ====================================
	async create(attrs) {
		attrs.id = this.randomId();
		const records = await this.getAll();
		records.push(attrs);
		await this.writeAll(records);

		return attrs;
	}

	// =============================== create random id ====================================
	randomId() {
		return crypto.randomBytes(4).toString("hex");
	}

	// =============================== retrieve id ====================================
	async getOne(id) {
		const records = await this.getAll();

		return records.find((record) => record.id === id);
	}

	// =============================== delete id ====================================
	async delete(id) {
		const records = await this.getAll();
		const filterRecord = records.filter((record) => record.id !== id);
		await this.writeAll(filterRecord);
	}

	// =============================== update one ====================================
	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);
		if (!record) {
			throw new Error(`Record with id: ${id} doesnot exist`);
		}
		//update record
		Object.assign(record, attrs);

		//re update all records
		await this.writeAll(records);
	}

	// =============================== retrieve one by ====================================
	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true;
			// record = {email:"dsfbkdsf", password:"sdsfsdfsdf"};
			// filter = {password:"sakhsksd"};
			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}
			//found = false
			if (found === true) {
				return record;
			}
		}
	}
};

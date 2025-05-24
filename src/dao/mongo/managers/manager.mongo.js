import User from "../models/users.model.js";
import Product from "../models/products.model.js";


class Manager {
  constructor(model) {
    this.model = model;
  }
  createOne = async (data) => await this.model.create(data);
  readAll = async (filter) => await this.model.find(filter).lean();
  readBy = async (filter) => await this.model.findOne(filter).lean();
  readById = async (id) => await this.model.findById(id).lean();
  updateById = async (id, data) => await this.model.findByIdAndUpdate(id, data, { new: true });
  destroyById = async (id) => await this.model.findByIdAndDelete(id);
}

export default Manager;

const usersManager = new Manager(User);
const productsManager = new Manager(Product);

export { usersManager, productsManager};
import productsManager from "../dao/index.factory.js";

class ProductsService {
    createOne = async (data) => await productsManager.createOne(data);

    readAll = async (filter) => await productsManager.readAll(filter);

    readById = async (id) => await productsManager.readById(id);

    updateById = async (id, data) => await productsManager.updateById(id, data);

    destroyById = async (id) => await productsManager.destroyById(id);
}

const productsService = new ProductsService();
export default productsService;

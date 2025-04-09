import {productsManager} from '../data/mongo/managers/manager.mongo.js';

const setupProductsManager = (req, res, next) => {
  req.productsManager = productsManager;
  next();
};

export default setupProductsManager;

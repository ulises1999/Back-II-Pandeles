import { cartsManager } from "../dao/index.factory.js";


const addProductToCartService = async (product_id, user_id, quantity) => await cartsManager.addProductToCart(product_id,user_id,quantity);
const readProductsFromUserService = async (user_id) => await cartsManager.readProductsFromUser(user_id);
const updateQuantityService = async (id, quantity) => await cartsManager.updateQuantity(id, quantity);
const updateStateService = async (id, state) => await cartsManager.updateState(id, state);
const removeProductFromCartService = async (id) => await cartsManager.removeProductFromCart(id);

export { addProductToCartService, readProductsFromUserService, updateQuantityService, updateStateService, removeProductFromCartService };
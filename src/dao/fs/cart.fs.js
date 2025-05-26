import FileManager from "./manager.fs.js";
import { productsManager } from "./manager.fs.js";
import crypto from "crypto";

class CartsManager extends FileManager {
  constructor() {
    super("./src/dao/fs/data/carts.json");
  }

  addProductToCart = async (product_id, user_id, quantity = 1) => {
    const carts = await this._readFile();
    if (!Array.isArray(carts)) {
        console.error("Error: 'carts' no es un array. Valor actual:", carts);
        throw new Error("Error interno del servidor: Los datos del carrito no son un array.");
    }

    let userCart = carts.find(
      (cart) => cart.user_id === user_id && cart.state === "reserved"
    );

    if (userCart) {
      const productIndex = userCart.products.findIndex(
        (item) => item.product_id === product_id
      );

      if (productIndex !== -1) {
        userCart.products[productIndex].quantity += quantity;
        if (userCart.products[productIndex].quantity < 1) {
          userCart.products[productIndex].quantity = 1;
        }
      } else {
        userCart.products.push({
          product_id: product_id,
          quantity: quantity,
        });
      }
      
      const cartIndex = carts.findIndex(cart => cart.user_id === user_id && cart.state === "reserved");
      carts[cartIndex] = userCart;

    } else {
      userCart = {
        _id: crypto.randomBytes(12).toString("hex"),
        user_id: user_id,
        products: [{
          product_id: product_id,
          quantity: quantity,
        }],
        state: "reserved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      carts.push(userCart);
    }

    await this._writeFile(carts);
    return userCart;
  };

  readProductsFromUser = async (user_id) => {
    const carts = await this._readFile();
    const userCart = carts.find(
      (cart) => cart.user_id === user_id && cart.state === "reserved"
    );

    if (!userCart || !userCart.products || userCart.products.length === 0) {
      return [];
    }

    const populatedProducts = await Promise.all(
      userCart.products.map(async (item) => {
        const productDetails = await productsManager.readById(item.product_id);
        if (productDetails) {
          return {
            ...item,
            product_id: productDetails,
          };
        } else {
          return null;
        }
      })
    );
    
    return populatedProducts.filter(item => item !== null);
  };

  updateQuantity = async (user_id, product_id, newQuantity) => {
    const carts = await this._readFile();
    const userCartIndex = carts.findIndex(cart => cart.user_id === user_id && cart.state === "reserved");

    if (userCartIndex === -1) return null;

    const userCart = carts[userCartIndex];
    const productIndex = userCart.products.findIndex(item => item.product_id === product_id);

    if (productIndex === -1) return null;

    userCart.products[productIndex].quantity = newQuantity;
    if (userCart.products[productIndex].quantity < 1) {
      userCart.products[productIndex].quantity = 1;
    }
    userCart.updatedAt = new Date().toISOString();

    carts[userCartIndex] = userCart;
    await this._writeFile(carts);
    return userCart.products[productIndex];
  };
  
  updateState = async (user_id, newState) => {
    const carts = await this._readFile();
    const userCartIndex = carts.findIndex(cart => cart.user_id === user_id);

    if (userCartIndex === -1) return null;

    carts[userCartIndex].state = newState;
    carts[userCartIndex].updatedAt = new Date().toISOString();

    await this._writeFile(carts);
    return carts[userCartIndex];
  };
  
  removeProductFromCart = async (user_id, product_id_to_remove) => {
    const carts = await this._readFile();
    const userCartIndex = carts.findIndex(cart => cart.user_id === user_id && cart.state === "reserved");

    if (userCartIndex === -1) return null;

    const userCart = carts[userCartIndex];
    const initialProductCount = userCart.products.length;
    
    userCart.products = userCart.products.filter(item => item.product_id !== product_id_to_remove);
    userCart.updatedAt = new Date().toISOString();

    if (userCart.products.length === initialProductCount) {
      return null;
    }

    if (userCart.products.length === 0) {
        const updatedCarts = carts.filter(cart => cart.user_id !== user_id);
        await this._writeFile(updatedCarts);
        return { message: "Cart removed as it became empty." };
    } else {
        carts[userCartIndex] = userCart;
        await this._writeFile(carts);
        return { message: "Product removed from cart." };
    }
  };
}

const cartsManager = new CartsManager();
export { cartsManager }
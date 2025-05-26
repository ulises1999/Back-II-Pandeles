import Manager from "./manager.mongo.js";
import Cart from "../models/carts.model.js";

class CartsManager extends Manager {
  constructor() {
    super(Cart);
  }


  addProductToCart = async (product_id, user_id, quantity = 1) => {
    try {

      const productIdObj = new Cart.base.Types.ObjectId(product_id);
      const userIdObj = new Cart.base.Types.ObjectId(user_id);


      let userCart = await this.model.findOne({
        user_id: userIdObj,
        state: "reserved",
      });

      if (userCart) {

        const productIndex = userCart.products.findIndex(
          (item) => item.product_id.equals(productIdObj)
        );

        if (productIndex !== -1) {

          userCart.products[productIndex].quantity += quantity;

          if (userCart.products[productIndex].quantity < 1) {
            userCart.products[productIndex].quantity = 1;
          }
        } else {

          userCart.products.push({
            product_id: productIdObj,
            quantity: quantity,
          });
        }
        await userCart.save();
        return userCart;
      } else {

        const newCart = await this.createOne({
          user_id: userIdObj,
          products: [{
            product_id: productIdObj,
            quantity: quantity,
          }],
          state: "reserved",
        });
        return newCart;
      }
    } catch (error) {
      console.error("Error al agregar/actualizar producto en el carrito:", error);
      throw error;
    }
  };


  readProductsFromUser = async (user_id) => {
    try {

      const userIdObj = new Cart.base.Types.ObjectId(user_id);
      const userCart = await this.model.findOne({ user_id: userIdObj, state: "reserved" }).lean();
      
      return userCart ? userCart.products : []; 
    } catch (error) {
      throw error;
    }
  };

  updateQuantity = async (cart_id, quantity) => {

    console.warn("updateQuantity necesita ser reescrito para el nuevo esquema de carrito.");
    return await this.updateById(cart_id, { quantity });
  };
  
  updateState = async (cart_id, state) => {
 
    console.warn("updateState necesita ser reescrito para el nuevo esquema de carrito.");
    return await this.updateById(cart_id, { state });
  };
  
  removeProductFromCart = async (cart_id) => {

    console.warn("removeProductFromCart necesita ser reescrito para el nuevo esquema de carrito.");
    return await this.destroyById(cart_id); a
  };
}

const cartsManager = new CartsManager();
export { cartsManager };

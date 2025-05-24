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

      
      let cartItem = await this.model.findOne({
        user_id: userIdObj,
        product_id: productIdObj,
        state: "reserved",
      });

      if (cartItem) {
        
        cartItem.quantity += quantity;
        
        if (cartItem.quantity < 1) {
          cartItem.quantity = 1;
        }
        await cartItem.save(); 
        return cartItem; 
      } else {
        
        const newCartItem = await this.createOne({
          product_id: productIdObj, 
          user_id: userIdObj,       
          quantity,
        });
        return newCartItem; 
      }
    } catch (error) {
      console.error("Error al agregar/actualizar producto en el carrito:", error);
      throw error; r
    }
  };

  
  readProductsFromUser = async (user_id) => {
    try {
        
        const userIdObj = new Cart.base.Types.ObjectId(user_id); 
        const carts = await this.model.find({ user_id: userIdObj, state: "reserved" })
                                     .populate('product_id')
                                     .lean();
        return carts;
    } catch (error) {
        throw error;
    }
  }
  updateQuantity = async (cart_id, quantity) => await this.updateById(cart_id, { quantity });
  updateState = async (cart_id, state) => await this.updateById(cart_id, { state });
  removeProductFromCart = async (cart_id) => await this.destroyById(cart_id);
}

const cartsManager = new CartsManager();
export { cartsManager };
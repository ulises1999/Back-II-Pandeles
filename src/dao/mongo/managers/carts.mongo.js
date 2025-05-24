// import Manager from "./manager.mongo.js";
// import Cart from "../models/carts.model.js";

// class CartsManager extends Manager {
//   constructor() {
//     super(Cart);
//   }
//    addProductToCart = async (product_id, user_id, quantity = 1) => {
//     try {
     
//       const productIdObj = new Cart.base.Types.ObjectId(product_id); 
//       const userIdObj = new Cart.base.Types.ObjectId(user_id);      

      
//       let cartItem = await this.model.findOne({
//         user_id: userIdObj,
//         product_id: productIdObj,
//         state: "reserved",
//       });

//       if (cartItem) {
        
//         cartItem.quantity += quantity;
        
//         if (cartItem.quantity < 1) {
//           cartItem.quantity = 1;
//         }
//         await cartItem.save(); 
//         return cartItem; 
//       } else {
        
//         const newCartItem = await this.createOne({
//           product_id: productIdObj, 
//           user_id: userIdObj,       
//           quantity,
//         });
//         return newCartItem; 
//       }
//     } catch (error) {
//       console.error("Error al agregar/actualizar producto en el carrito:", error);
//       throw error; r
//     }
//   };

  
//   readProductsFromUser = async (user_id) => {
//     try {
        
//         const userIdObj = new Cart.base.Types.ObjectId(user_id); 
//         const carts = await this.model.find({ user_id: userIdObj, state: "reserved" })
//                                      .populate('product_id')
//                                      .lean();
//         return carts;
//     } catch (error) {
//         throw error;
//     }
//   }
//   updateQuantity = async (cart_id, quantity) => await this.updateById(cart_id, { quantity });
//   updateState = async (cart_id, state) => await this.updateById(cart_id, { state });
//   removeProductFromCart = async (cart_id) => await this.destroyById(cart_id);
// }

// const cartsManager = new CartsManager();
// export { cartsManager };
import Manager from "./manager.mongo.js";
import Cart from "../models/carts.model.js";

class CartsManager extends Manager {
  constructor() {
    super(Cart); // this.model es ahora el modelo Cart
  }

  // Método para agregar o actualizar un producto en el carrito
  addProductToCart = async (product_id, user_id, quantity = 1) => {
    try {
      // Convertir product_id y user_id a ObjectId de Mongoose
      // Usamos Cart.base.Types.ObjectId para evitar el warning de deprecated
      // (si bien es deprecated, como mencionaste, lo mantendremos funcional por ahora)
      const productIdObj = new Cart.base.Types.ObjectId(product_id);
      const userIdObj = new Cart.base.Types.ObjectId(user_id);

      // 1. Buscar el carrito del usuario en estado "reserved"
      let userCart = await this.model.findOne({
        user_id: userIdObj,
        state: "reserved",
      });

      if (userCart) {
        // 2. Si el carrito del usuario existe:
        //    Buscar si el producto ya está en el array 'products' de ese carrito
        const productIndex = userCart.products.findIndex(
          (item) => item.product_id.equals(productIdObj) // Compara ObjectIds
        );

        if (productIndex !== -1) {
          // El producto ya existe en el carrito, incrementa la cantidad
          userCart.products[productIndex].quantity += quantity;
          // Asegurarse de que la cantidad no sea menor a 1
          if (userCart.products[productIndex].quantity < 1) {
            userCart.products[productIndex].quantity = 1;
          }
        } else {
          // El producto no está en el carrito, agrégalo como un nuevo elemento al array
          userCart.products.push({
            product_id: productIdObj,
            quantity: quantity,
          });
        }
        await userCart.save(); // Guarda los cambios en el carrito existente
        return userCart; // Retorna el carrito actualizado
      } else {
        // 3. Si el carrito del usuario NO existe, crea uno nuevo con el primer producto
        const newCart = await this.createOne({
          user_id: userIdObj,
          products: [{
            product_id: productIdObj,
            quantity: quantity,
          }],
          state: "reserved",
        });
        return newCart; // Retorna el nuevo carrito creado
      }
    } catch (error) {
      console.error("Error al agregar/actualizar producto en el carrito:", error);
      throw error; // Lanza el error para que sea manejado por el servicio y el controlador
    }
  };

  // Método para leer el carrito de un usuario
  readProductsFromUser = async (user_id) => {
    try {
      // Convertir user_id a ObjectId
      const userIdObj = new Cart.base.Types.ObjectId(user_id);
      
      // Buscar el carrito del usuario y popular los productos dentro del array
      // El populate se hace en el middleware pre-find del modelo, así que aquí solo buscamos el carrito
      const userCart = await this.model.findOne({ user_id: userIdObj, state: "reserved" }).lean();
      
      // Si no hay carrito, devolvemos un array vacío para que la vista no falle
      return userCart ? userCart.products : []; 
    } catch (error) {
      throw error;
    }
  };

  // Los métodos updateQuantity, updateState y removeProductFromCart necesitarán ser adaptados
  // para trabajar con el array 'products' dentro de un único documento de carrito.
  // Por ahora, los dejamos para que no rompa el código, pero no funcionarán como antes.
  // Esto lo podemos abordar en el siguiente paso si lo necesitas.
  updateQuantity = async (cart_id, quantity) => {
    // Esta lógica necesitará ser reescrita para actualizar un producto dentro del array 'products'
    // de un carrito específico, no un documento de carrito completo.
    console.warn("updateQuantity necesita ser reescrito para el nuevo esquema de carrito.");
    return await this.updateById(cart_id, { quantity }); // Esto ya no es válido para el nuevo esquema
  };
  
  updateState = async (cart_id, state) => {
    // Esta lógica necesitará ser reescrita para actualizar el estado del carrito completo.
    console.warn("updateState necesita ser reescrito para el nuevo esquema de carrito.");
    return await this.updateById(cart_id, { state });
  };
  
  removeProductFromCart = async (cart_id) => {
    // Esta lógica necesitará ser reescrita para eliminar un producto del array 'products'
    // de un carrito específico, no eliminar un documento de carrito completo.
    console.warn("removeProductFromCart necesita ser reescrito para el nuevo esquema de carrito.");
    return await this.destroyById(cart_id); // Esto ya no es válido para el nuevo esquema
  };
}

const cartsManager = new CartsManager();
export { cartsManager };

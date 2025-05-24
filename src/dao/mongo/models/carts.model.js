// import { Schema, model, Types } from "mongoose";

// const collection = "carts";
// const schema = new Schema(
//     {
//         product_id: { type: Types.ObjectId, ref: "product", required: true },
//         user_id: { type: Types.ObjectId, ref: "users", required: true, index: true },
//         quantity: { type: Number, required: true, default: 1, min: [1, "La cantidad mínima debe ser 1"] },
//         state: { type: String, default: "reserved", enum: ["reserved", "paid", "delivered"], index: true, },
//     },
//     { timestamps: true }
// );

// schema.pre(/^find/, function () {
//     this.populate("user_id", "email photo")
//         .populate("product_id", "title price stock photo");
// });

// const Cart = model(collection, schema);
// export default Cart;
import { Schema, model, Types } from "mongoose";

const collection = "carts"; // Nombre de la colección en la base de datos

const schema = new Schema(
    {
        // user_id ahora es único para asegurar un carrito por usuario
        user_id: { type: Types.ObjectId, ref: "users", required: true, unique: true, index: true },
        
        // El carrito contendrá un array de productos
        products: [
            {
                // product_id referencia al modelo 'product' (en singular, como lo tienes definido)
                product_id: { type: Types.ObjectId, ref: "product", required: true },
                quantity: { type: Number, required: true, default: 1, min: [1, "La cantidad mínima debe ser 1"] },
            }
        ],
        
        // El estado del carrito (reserved, paid, delivered)
        state: { type: String, default: "reserved", enum: ["reserved", "paid", "delivered"], index: true },
    },
    { timestamps: true } // Añade createdAt y updatedAt automáticamente
);

// Middleware pre-find para popular las referencias
// Ahora populamos el array 'products.product_id' y el 'user_id'
schema.pre(/^find/, function () {
    this.populate("user_id", "email photo") // Popula la información del usuario
        .populate("products.product_id", "title price stock photo"); // Popula los detalles de cada producto en el array
});

const Cart = model(collection, schema);
export default Cart;

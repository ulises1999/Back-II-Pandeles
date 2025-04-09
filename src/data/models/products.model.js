import { Schema, model } from "mongoose";

const collection = "product";
const schema = new Schema(
    {
        title: { type: String, required: true },
        photo: { type: String, default: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png" },
        category: { type: String, default: "general" },
        price: { type: Number, default: 1 },
        stock: { type: Number, default: 1 }
    },
    { timestamps: true }
);

const Product = model(collection, schema);
export default Product;

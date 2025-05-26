import dbConnect from "../helpers/dbConnect.helper.js";
import User from "./mongo/models/users.model.js"; 
import Product from "./mongo/models/products.model.js";
import Cart from "./mongo/models/carts.model.js"
// Se que no uso estos ultimos 3 imports, pero misteriosamente si los pongo funciona
const { PERSISTENCE, LINK_MONGO } = process.env;

let dao = {};

switch (PERSISTENCE) {
    case "memory":
        break;
    case "fs":
        {
            console.log("fs database connected");
            const { productsManager, usersManager } = await import(
                "./fs/manager.fs.js"
            );
            const { cartsManager } = await import("./fs/carts.fs.js");
            dao = { productsManager, usersManager, cartsManager };
        }
        break;
    default:
        {
            await dbConnect(LINK_MONGO);
            const { usersManager, productsManager} = await import("./mongo/managers/manager.mongo.js");
            const {cartsManager}= await import("./mongo/managers/carts.mongo.js")
            dao = { productsManager, usersManager, cartsManager };
        }
        break;
}

const { productsManager, usersManager, cartsManager } = dao;
export { productsManager, usersManager, cartsManager };
export default dao;
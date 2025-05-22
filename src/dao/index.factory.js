import dbConnect from "../helpers/dbConnect.helper.js";

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
            const { usersManager, productsManager, cartsManager } = await import("./mongo/managers/manager.mongo.js");
            dao = { productsManager, usersManager, cartsManager };
        }
        break;
}

const { productsManager, usersManager, cartsManager } = dao;
export { productsManager, usersManager, cartsManager };
export default dao;
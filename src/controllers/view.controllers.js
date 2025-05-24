// import { homeViewService, profileViewService, detailsViewService, cartsViewService } from "../services/views.service.js";

// const homeView = async (req, res) => {
//     const product = await homeViewService();
//     if (!product || product.length === 0) {
//         return res.status(404).render("error", {
//             title: "Error",
//             message: "No hay productos para mostrar",
//         });
//     }
//     res.status(200).render("index", { product, title: "HOME" });
// };

// const profileView = async (req, res) => {
//     const { users_id } = req.params;
//     const profile = await profileViewService(users_id);
//     if (!profile) {
//         return res.status(404).render("error", {
//             title: "Usuario no encontrado",
//             message: ` No se encontró el perfil con ID: ${users_id} `,
//         });
//     }
//     res.status(200).render("profile", { title: "PROFILE", profile });
// };

// const detailsView = async (req, res) => {
//     const { product_id } = req.params;
//     const product = await detailsViewService(product_id);
//     if (!product) {
//         return res.status(404).render("error", {
//             title: "Producto no encontrado",
//             message:  `No se encontró el producto con ID: ${product_id} `,
//         });
//     }
//     res.status(200).render("product", {
//         title: product.title.toUpperCase(),
//         product,
//     });
// };

// const cartsView = async (req, res) => {
//     const { user_id } = req.params;
//     const carts = await cartsViewService(user_id);

//     const total = carts.reduce((acc, item) => {
//         return acc + item.quantity * item.product_id.price;
//     }, 0);

//     res.status(200).render("cart", { title: "CART", carts, total });
// };



// const registerView = (req, res) => {
//     res.status(200).render("register", { title: "REGISTER FORM" });
// };

// const loginView = (req, res) => {
//     res.status(200).render("login", { title: "LOGIN FORM" });
// };

// export { homeView, profileView, detailsView, cartsView, registerView, loginView };
import { homeViewService, profileViewService, detailsViewService, cartsViewService } from "../services/views.service.js";

const homeView = async (req, res) => {
    const product = await homeViewService();
    if (!product || product.length === 0) {
        return res.status(404).render("error", {
            title: "Error",
            message: "No hay productos para mostrar",
        });
    }
    res.status(200).render("index", { product, title: "HOME" });
};

const profileView = async (req, res) => {
    const { users_id } = req.params;
    const profile = await profileViewService(users_id);
    if (!profile) {
        return res.status(404).render("error", {
            title: "Usuario no encontrado",
            message: ` No se encontró el perfil con ID: ${users_id} `,
        });
    }
    res.status(200).render("profile", { title: "PROFILE", profile });
};

const detailsView = async (req, res) => {
    const { product_id } = req.params;
    const product = await detailsViewService(product_id);
    if (!product) {
        return res.status(404).render("error", {
            title: "Producto no encontrado",
            message: `No se encontró el producto con ID: ${product_id} `,
        });
    }
    res.status(200).render("product", {
        title: product.title.toUpperCase(),
        product,
    });
};

// *** FUNCIÓN cartsView MODIFICADA ***
const cartsView = async (req, res, next) => {
    try {
        const { user_id } = req.params; // Asumo que el user_id viene de los params de la URL
        // cartsViewService ahora devuelve el array de productos del carrito del usuario
        // o un array vacío si no hay carrito o productos.
        const cartProducts = await cartsViewService(user_id); 

        let total = 0;
        if (cartProducts && cartProducts.length > 0) {
            total = cartProducts.reduce((acc, item) => {
                // Aseguramos que 'item.product_id' exista y que 'price' exista
                if (item && item.quantity && item.product_id && item.product_id.price !== undefined) {
                    return acc + item.quantity * item.product_id.price;
                } else {
                    console.warn("Advertencia: Un ítem del carrito no tiene el producto populado o el precio está indefinido.", item);
                    return acc;
                }
            }, 0);
        }

        // Pasamos el array de productos del carrito a la plantilla
        // y el total calculado.
        res.status(200).render("cart", { 
            title: "CART", 
            carts: cartProducts, // Renombrado para claridad en la plantilla
            total 
        });
    } catch (error) {
        console.error("Error en cartsView:", error);
        next(error); // Pasa el error al middleware de manejo de errores
    }
};


const registerView = (req, res) => {
    res.status(200).render("register", { title: "REGISTER FORM" });
};

const loginView = (req, res) => {
    res.status(200).render("login", { title: "LOGIN FORM" });
};

export { homeView, profileView, detailsView, cartsView, registerView, loginView };

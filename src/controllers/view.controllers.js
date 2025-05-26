import viewsService from "../services/views.service.js"

const homeView = async (req, res) => {
    const product = await viewsService.homeView()
    if (!product || product.length === 0) {
        return res.status(404).render("error", {
            title: "Error",
            message: "No hay productos para mostrar",
        });
    }
    res.status(200).render("index", { product, title: "HOME" });
};

const profileView = async (req, res) => {
    const { user_id } = req.params;
    const profile = await viewsService.profileView(user_id);
    if (!profile) {
        return res.status(404).render("error", {
            title: "Usuario no encontrado",
            message: ` No se encontró el perfil con ID: ${user_id} `,
        });
    }
    res.status(200).render("profile", { title: "PROFILE", profile });
};

const detailsView = async (req, res) => {
    const { product_id } = req.params;
    const product = await viewsService.detailsView(product_id);
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
const cartsView = async (req, res, next) => {
    try {
        const { user_id } = req.params; 
        const cartProducts = await viewsService.cartsView(user_id); 

        let total = 0;
        if (cartProducts && cartProducts.length > 0) {
            total = cartProducts.reduce((acc, item) => {
                
            if (item && item.quantity && item.product_id && item.product_id.price !== undefined) {
                    return acc + item.quantity * item.product_id.price;
                } else {
                    console.warn("Advertencia: Un ítem del carrito no tiene el producto populado o el precio está indefinido.", item);
                    return acc;
                }
            }, 0);
        }

        res.status(200).render("cart", { 
            title: "CART", 
            carts: cartProducts,
            total
        });
    } catch (error) {
        console.error("Error en cartsView:", error);
        next(error);
    }
};


const registerView = (req, res) => {
    res.status(200).render("register", { title: "REGISTER FORM" });
};

const loginView = (req, res) => {
    res.status(200).render("login", { title: "LOGIN FORM" });
};
const verifyView = (req, res) => {
  try {
    res.status(200).render("verify", { title: "VERIFY YOUR ACCOUNT" });
  } catch (error) {
    console.log(error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).render("error");
  }
};

export { verifyView,homeView, profileView, detailsView, cartsView, registerView, loginView };

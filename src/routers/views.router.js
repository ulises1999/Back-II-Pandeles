import CustomRouter from "./custom.router.js";
import { usersManager, productsManager } from "../data/mongo/managers/manager.mongo.js";
import { cartsManager } from "../data/mongo/managers/carts.mongo.js";

class ViewsRouter extends CustomRouter {
  constructor() {
    super();
    this.read("/", ["PUBLIC"], this.homeView);
    this.read("/profile/:user_id", ["USER", "ADMIN"], this.profileView);
    this.read("/product/:product_id", ["PUBLIC"], this.detailsView);
    this.read("/cart/:user_id", ["USER"], this.cartView);
    this.read("/register", ["PUBLIC"], this.registerView);
    this.read("/login", ["PUBLIC"], this.loginView);
  }

  homeView = async (req, res) => {
    const product = await productsManager.readAll();
    if (!product || product.length === 0) {
      return res.status(404).render("error", {
        title: "Error",
        message: "No hay productos para mostrar",
      });
    }
    res.status(200).render("index", { product, title: "HOME" });
  };

  profileView = async (req, res) => {
    const { users_id } = req.params;
    const profile = await usersManager.readById(users_id);
    if (!profile) {
      return res.status(404).render("error", {
        title: "Usuario no encontrado",
        message: `No se encontró el perfil con ID: ${users_id}`,
      });
    }
    res.status(200).render("profile", { title: "PROFILE", profile });
  };

  detailsView = async (req, res) => {
    const { product_id } = req.params;
    const product = await productsManager.readById(product_id);
    if (!product) {
      return res.status(404).render("error", {
        title: "Producto no encontrado",
        message: `No se encontró el producto con ID: ${product_id}`,
      });
    }
    res.status(200).render("product", {
      title: product.title.toUpperCase(),
      product,
    });
  };

  cartView = async (req, res) => {
    const { users_id } = req.params;
    const carts = await cartsManager.readProductsFromUser(users_id);
    const totalData = await cartsManager.totalToPay(users_id);
    const total = totalData?.[0]?.total || 0;
    res.status(200).render("cart", { title: "CART", carts, total });
  };

  registerView = (req, res) => {
    res.status(200).render("register", { title: "REGISTER FORM" });
  };

  loginView = (req, res) => {
    res.status(200).render("login", { title: "LOGIN FORM" });
  };
}

export default new ViewsRouter().getRouter();

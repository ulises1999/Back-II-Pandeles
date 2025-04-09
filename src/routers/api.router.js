import CustomRouter from "./custom.router.js";
import authRouter from "./api/auth.router.js";
import productRouter from "./api/products.router.js";
import cartRouter from "./api/carts.router.js";
import setupProductsManager from "../middlewares/productsManager.mid.js";

class ApiRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init = () => {
    this.use("/auth", authRouter);
    this.use("/products", setupProductsManager, productRouter);
    this.use("/carts", cartRouter);
  };
}

const apiRouter = new ApiRouter();
export default apiRouter.getRouter();

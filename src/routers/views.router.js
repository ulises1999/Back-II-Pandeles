import CustomRouter from "./custom.router.js";
import { homeView, profileView, detailsView, cartsView, registerView,verifyView, loginView  } from "../controllers/view.controllers.js";

class ViewsRouter extends CustomRouter {
  constructor() {
    super();
    this.read("/", ["PUBLIC"], homeView);
    this.read("/profile/:user_id", ["USER", "ADMIN"], profileView);
    this.read("/product/:product_id", ["PUBLIC"], detailsView);
    this.read("/cart/:user_id", ["USER"], cartsView);
    this.read("/register", ["PUBLIC"], registerView);
    this.read("/login", ["PUBLIC"], loginView);
    this.read("/verify",["PUBLIC"],verifyView);
  }
}
export default new ViewsRouter().getRouter();
 
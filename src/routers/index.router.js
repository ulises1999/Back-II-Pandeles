import CustomRouter from "./custom.router.js";
import apiRouter from "./api.router.js";
import viewsRouter from "./views.router.js";

class IndexRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init = () => {
    this.use("/api", apiRouter);
    this.use("/", viewsRouter);
  };
}

const router = new IndexRouter();
export default router.getRouter();
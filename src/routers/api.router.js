import { Router } from "express";
import authRouter from "./api/auth.router.js";
import productRouter from "./api/products.router.js";
import cartRouter from "./api/carts.router.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/carts", cartRouter);


export default apiRouter;
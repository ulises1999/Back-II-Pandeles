import CustomRouter from "../custom.router.js";
import passport from "../../middlewares/passport.mid.js";
import passportCb from "../../middlewares/passportCb.mid.js";


const register = async (req, res) => {
  const response = req.user;
  const token = req.token;
  const opts = { maxAge: 60 * 60 * 24 * 7, httpOnly: true };
  res.cookie("token", token, opts).json201(response, "Registered");
};

const login = async (req, res) => {
  const response = req.user; 
  const token = req.token;
  const opts = { maxAge: 60 * 60 * 24 * 7, httpOnly: true };
  res.cookie("token", token, opts).json200(response, "Logged in");
};

const online = async (req, res) => {
  if (!req.user.user_id) {
    return res.json401("User not authenticated");
  }
  res.json200({ user: req.user });
};

const signout = async (req, res) => {
  res.clearCookie("token").json200(null, "Signed out");
};

const badAuth = async (req, res) => {
  res.json401("Bad auth from redirect");
};

const google = async (req, res) => {
  const response = req.user;
  res.json200(response);
};

class AuthRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init = () => {
    this.create(
      "/register",
      ["PUBLIC"],
      passportCb("register"),
      register
    );
    this.create(
      "/login",
      ["PUBLIC"],
      passportCb("login"),
      login 
    );
    this.create("/online", ["USER", "ADMIN"], online);
    this.read("/signout", ["USER", "ADMIN"], signout);
    this.read("/bad-auth", ["PUBLIC"], badAuth);
    this.read(
      "/google",
      ["PUBLIC"],
      passport.authenticate("google", {
        scope: ["email", "profile"],
        failureRedirect: "/api/auth/bad-auth",
      })
    );
    this.read(
      "/google/cb",
      ["PUBLIC"],
      passport.authenticate("google", {
        session: false,
        failureRedirect: "/api/auth/bad-auth",
      }),
      google
    );
  };
}

const authRouter = new AuthRouter();
export default authRouter.getRouter();

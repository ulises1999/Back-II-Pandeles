import { usersManager } from "../dao/mongo/managers/manager.mongo.js";


const register = async (req, res) => {
  const response = req.user;
  res.json201(response, "registered"); 
};

const login = async (req, res) => {
  try {
    
    if (!req.user || !req.token) {
      
      return res.json500("Error interno: Usuario o token no disponibles después del login.");
    }

    
    res.cookie('token', req.token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, 
      httpOnly: true, 
      
    });

    
    return res.json200({ message: "Login exitoso", user: req.user });

  } catch (error) {
    console.error("Error en el controlador de login:", error);
    res.json500("Error interno del servidor durante el login.");
  }
};


const me = (req, res) => res.json200({
    email: req.user.email,
    avatar: req.user.avatar,
});
const online = async (req, res) => {
  const user = req.user || null;

  if (!user || !user.user_id) {
    return res.json200({ user: null }, "User not authenticated");
  }

  return res.json200({ user }, "User authenticated");
};


const signout = async (req, res) => {
    res.clearCookie("token").json200(null, "signed out");
}
const badAuth = async (req, res) => {
    res.json401("bad auth from redirect")
}

const google = async (req, res) => {
    const response = req.user
    res.json200(response);
}
const verifyAccount = async (req, res)=> {
  const { email, code } = req.params
  const user = await usersManager.readBy({ email, verifyCode: code})
  if (!user) return res.json401()
  await usersManager.updateById(user._id, { isVerify: true })
res.json200("VERIFIED")
}

export { verifyAccount,register, login, me, signout, badAuth, online, google };
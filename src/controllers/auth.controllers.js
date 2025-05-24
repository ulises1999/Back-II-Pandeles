const register = async (req, res) => {
  const response = req.user;
  res.json201(response, "registered"); 
};
//  const login = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const token = req.token; 

//     if (!token) return res.json401("No token provided");

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false, 
//     });

//     res.json200({ user });
//   } catch (error) {
//     next(error);
//   }
// };
const login = async (req, res) => {
  try {
    // En este punto, req.user debería estar poblado con el usuario autenticado
    // y req.token debería contener el JWT que acabamos de adjuntar en passportCb.mid.js

    if (!req.user || !req.token) {
      // Esto solo debería ocurrir si hay un problema fundamental en la autenticación
      return res.json500("Error interno: Usuario o token no disponibles después del login.");
    }

    // *** CAMBIO APLICADO AQUÍ: Establecer la cookie HTTP-only ***
    res.cookie('token', req.token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // Duración de la cookie (7 días en milisegundos)
      httpOnly: true, // Muy importante: la cookie no es accesible por JavaScript en el navegador
      // secure: process.env.NODE_ENV === 'production', // Habilitar en producción si usas HTTPS
      // sameSite: 'Lax', // O 'Strict' o 'None' dependiendo de tus necesidades de CORS y seguridad
    });

    // Envía una respuesta al frontend indicando el éxito del login
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

export { register, login, me, signout, badAuth, online, google };
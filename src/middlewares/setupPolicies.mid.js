// import { verifyToken } from "../helpers/token.helper.js";

// const setupPolicies = (policies) => async (req, res, next) => {
//   try {
//     if (policies.includes("PUBLIC")) return next();

//     const token = req?.cookies?.token;
//     if (!token) {
//       return res.json401("JWT must be provided");
//     }

//     let data;
//     try {
//       data = verifyToken(token);
//     } catch (err) {
//       return res.json401("Invalid or malformed token");
//     }

//     const { role, user_id } = data;

//     if (!role || !user_id) return res.json401("Invalid token payload");

//     const roles = {
//       USER: policies.includes("USER"),
//       ADMIN: policies.includes("ADMIN"),
//     };

//     if (roles[role]) {
//       req.user = data;
//       return next();
//     } else {
//       return res.status(403).json({ error: "Forbidden: insufficient permissions" });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// export default setupPolicies;

import { verifyToken } from "../helpers/token.helper.js";

const setupPolicies = (policies) => async (req, res, next) => {
  try {
    if (policies.includes("PUBLIC")) return next();

    const token = req?.cookies?.token;
    if (!token) {
      return res.json401("JWT must be provided");
    }

    let data;
    try {
      data = verifyToken(token); // data contendrá { _id, email, role } si el token es válido
    } catch (err) {
      return res.json401("Invalid or malformed token");
    }

    // *** CAMBIO AQUÍ: Desestructurar '_id' en lugar de 'user_id' ***
    const { role, user_id } = data; 

    // *** Y AQUÍ: Verificar que '_id' exista ***
    if (!role || !user_id) return res.json401("Invalid token payload");

    const roles = {
      USER: policies.includes("USER"),
      ADMIN: policies.includes("ADMIN"),
    };

    if (roles[role]) {
      req.user = data; // req.user ahora contendrá { _id, email, role }
      return next();
    } else {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
  } catch (error) {
    next(error);
  }
};

export default setupPolicies;
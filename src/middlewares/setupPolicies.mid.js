// import { verifyToken } from "../helpers/token.helper.js";


// const setupPolicies = (policies) => async (req, res, next) => {
//   try {
//     if (policies.includes("PUBLIC")) return next();
//     const token = req?.cookies?.token;
//     if (!token) {
//       return res.json401("JWT must be provided");
//     }
//     const data = verifyToken(token);
//     const { role, user_id } = data;
//     console.log(data);
//     if (!role || !user_id) return res.json401();
//     const roles = {
//       USER: policies.includes("USER"),
//       ADMIN: policies.includes("ADMIN"),
//     };
//     if (roles[role]) {
//       req.user = data;
//       return next();
//     } else {
//       res.json(403);
//     }
//   } catch (error) {
//     next(error)
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

    const data = verifyToken(token);
    const { role, user_id } = data;
    console.log("Token payload:", data);

    if (!role || !user_id) return res.json401("Invalid token payload");

    const roles = {
      USER: policies.includes("USER"),
      ADMIN: policies.includes("ADMIN"),
    };

    if (roles[role]) {
      req.user = data;
      return next();
    } else {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
  } catch (error) {
    next(error);
  }
};

export default setupPolicies;

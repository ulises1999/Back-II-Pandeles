const register = async (req, res) => {
  const response = req.user;
  res.json201(response, "registered"); 
};
 const login = async (req, res, next) => {
  try {
    const user = req.user;
    const token = req.token; 

    if (!token) return res.json401("No token provided");

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
    });

    res.json200({ user });
  } catch (error) {
    next(error);
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
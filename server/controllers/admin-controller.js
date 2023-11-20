const AuthenticateAdmin = (req, res, next) => {
  const { name, password } = req.body;
  if (name === "admin" && password == "admin") {
    res.status(200).send({name: "admin"});
  } else {
    res.status(401).send("UnauthorizedAdmin");
  }
};


exports.AuthenticateAdmin = AuthenticateAdmin;
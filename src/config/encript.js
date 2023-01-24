const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  hashPassword: (password) => {
    const salt = bcrypt.genSaltSync(10);

    const hashPass = bcrypt.hashSync(password, salt);

    return hashPass;
  },
  createToken: (payload, expired = "24h") => {
    let token = jwt.sign(payload, "library!", {
      expiresIn: expired,
    });

    return token;
  },
  readToken: (req, res, next) => {
    jwt.verify(req.token, "library!", (error, decript) => {
      if (error) {
        return res.status(401).send({
          success: false,
          message: "Authenticate token failed",
        });
      }

      console.log(decript);
      req.decript = decript;
      next();
    });
  },
};

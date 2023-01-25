const { check, validationResult } = require("express-validator");

module.exports = {
  checkUser: async (req, res, next) => {
    try {
      console.log(req.path);
      await check("username").notEmpty().isAlphanumeric().run(req);
      await check("password")
        .notEmpty()
        .isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
          })
        .run(req);
      await check("fullname").notEmpty().run(req);
      await check("address").notEmpty().run(req);
      await check("phone").notEmpty().run(req);
      await check("email").notEmpty().isEmail().run(req);
      await check("birthdate").notEmpty().run(req);
      await check("gender").notEmpty().run(req);

      const validation = validationResult(req);
      console.log("cek", validation);

      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(200).send({
          success: false,
          message: "Validation invalid, please check your data.",
          error: validation.errors,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};

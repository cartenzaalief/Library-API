const UsersModel = require("../model/users");

module.exports = {
  getUsersData: async (req, res) => {
    try {
      let data = await UsersModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  login: async (req, res) => {
    let { username, password } = req.body;

    try {
      let data = await UsersModel.findAll({
        where: {
          username,
          password,
        },
      });

      if (data.length > 0) {
        return res.status(200).send(data[0].dataValues);
      } else {
        return res.status(200).send({
          success: false,
          message: "Account does not exist",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  register: async (req, res) => {
    let {
      username,
      password,
      firstname,
      lastname,
      birthdate,
      gender,
      address,
      phone,
      email,
    } = req.body;

    
  },
};

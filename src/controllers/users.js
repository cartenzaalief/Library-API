const UsersModel = require("../model/users");
const { hashPassword, createToken } = require("../config/encript");
const bcrypt = require("bcrypt");
const sequelize = require("sequelize");

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
        },
      });

      if (data.length > 0) {
        let checkPass = bcrypt.compareSync(
          password,
          data[0].dataValues.password
        );

        if (checkPass) {
          let token = createToken({ ...data[0].dataValues });
          return res.status(200).send({
            success: true,
            message: "Log In success",
            value: { ...data[0].dataValues, token },
          });
        } else {
          return res.status(200).send({
            success: false,
            message: "Password incorrect",
          });
        }
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

    try {
      let data = await UsersModel.findAll({
        where: {
          [sequelize.Op.or]: [{ username, phone, email }],
        },
      });

      console.log("cek", data);

      if (data.length > 0) {
        return res.status(200).send({
          success: false,
          message: "Username or Phone or E-mail is already exist",
        });
      } else {
        try {
          let newPass = hashPassword(password);
          let data = await UsersModel.findAll();

          let userid =
            new Date().getFullYear().toString().slice(2, 4) +
            (new Date().getMonth() + 1).toString().padStart(2, "0") +
            (data.length + 1).toString().padStart(3, "0");

          let create = await UsersModel.create({
            userid,
            username,
            fullname: firstname + " " + lastname,
            birthdate,
            gender,
            address,
            phone,
            email,
            password: newPass,
          });
          return res.status(200).send({
            success: true,
            message: "Sign up success",
            value: create,
          });
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};

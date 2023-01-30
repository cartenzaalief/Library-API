const UsersModel = require("../model/users");
const { hashPassword, createToken } = require("../config/encript");
const bcrypt = require("bcrypt");
const sequelize = require("sequelize");
const { transport } = require("../config/nodemailer");

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
    try {
      let { username, password } = req.body;
      let data = await UsersModel.findAll({
        where: {
          username,
        },
      });

      console.log(data);

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
    try {
      let {
        username,
        password,
        fullname,
        birthdate,
        gender,
        address,
        phone,
        email,
      } = req.body;
      let data = await UsersModel.findAll({
        where: {
          [sequelize.Op.or]: [{ username }, { email }, { phone }],
        },
      });

      console.log(data);

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
            fullname,
            birthdate,
            gender,
            address,
            phone,
            email,
            password: newPass,
          });

          let token = createToken({
            id: data.length + 1,
            userid,
            username,
            email,
          });

          transport.sendMail({
            from: "Library Labs",
            to: email,
            subject: "E-mail Verification",
            html: `<div>
              <h3>Please confirm your e-mail address by clicking on the link below</h3>
              <a href="http://localhost:3000/verification?t=${token}">Confirm e-mail</a>
              </div>`,
          });

          return res.status(200).send({
            success: true,
            message:
              "Sign up success, please check your e-mail to confirm your e-mail address",
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
  keepLogin: async (req, res) => {
    try {
      console.log(req.decript);
      let data = await UsersModel.findAll({
        where: {
          id: req.decript.id,
        },
      });

      console.log(data);

      let token = createToken({ ...data[0].dataValues });
      return res.status(200).send({ ...data[0].dataValues, token });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  verifiedAccount: async (req, res) => {
    try {
      console.log(req.decript);
      let update = await UsersModel.update(
        {
          status: "verified",
        },
        {
          where: {
            id: req.decript.id,
          },
        }
      );

      console.log(update);

      return res.status(200).send({
        success: true,
        message: "E-mail confirmation success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};

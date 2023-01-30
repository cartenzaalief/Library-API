const BooksModel = require("../model/books");

module.exports = {
  getBooksData: async (req, res) => {
    try {
      let data = await BooksModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};

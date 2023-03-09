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
  addBook: async (req, res) => {
    try {
      console.log("cek file", req.files);
      console.log("cek body", req.body);
      let { title, author, published, pages, description } = JSON.parse(
        req.body.data
      );
      let create = await BooksModel.create({
        title,
        author,
        published,
        pages,
        description,
        cover: `/bookCover/${req.files[0].filename}`,
      });
      return res.status(200).send({
        success: true,
        message: "Add new book success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};

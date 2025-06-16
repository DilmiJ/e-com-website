const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, quantityAvailable, description, discount, category } = req.body;
    const image = req.file?.filename;

    const newProduct = new Product({
      name,
      price,
      quantityAvailable,
      description,
      discount,
      category,
      image
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

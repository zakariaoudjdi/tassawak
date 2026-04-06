import Product from '../models/Product.js';
import { publishProductCreated } from '../kafka/producer.js';

async function listProducts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const product = await Product.create({ name, description, price, image, category, stock });
    // Publish to Kafka asynchronously, but don't block the response
    await publishProductCreated(product.toJSON()).catch((err) =>
      console.error('Kafka publish failed:', err.message)
    );
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export { listProducts, getProduct, createProduct };

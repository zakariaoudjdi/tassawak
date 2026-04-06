import 'dotenv/config';
import sequelize from './db.js';
import Product from './models/Product.js';

const products = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality noise-cancelling wireless headphones with 30-hour battery life.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    stock: 50,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight and breathable running shoes for all terrain types.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Sports',
    stock: 120,
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable drip coffee maker with thermal carafe and built-in grinder.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    category: 'Kitchen',
    stock: 30,
  },
  {
    name: 'Leather Wallet',
    description: 'Slim genuine leather bifold wallet with RFID blocking protection.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400',
    category: 'Accessories',
    stock: 200,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip extra-thick yoga mat with alignment lines and carrying strap.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1601925228008-aae68b958f7b?w=400',
    category: 'Sports',
    stock: 75,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'TKL mechanical keyboard with Cherry MX switches and RGB backlight.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    category: 'Electronics',
    stock: 40,
  },
  {
    name: 'Scented Candle Set',
    description: 'Set of 6 hand-poured soy wax candles in calming lavender and eucalyptus scents.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1602874801006-31178046e571?w=400',
    category: 'Home',
    stock: 90,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: '32oz double-wall insulated bottle keeps drinks cold 24h and hot 12h.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    category: 'Kitchen',
    stock: 150,
  },
  {
    name: 'Polarized Sunglasses',
    description: 'Polarized UV400 sunglasses with lightweight titanium frame.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    category: 'Accessories',
    stock: 60,
  },
  {
    name: 'LED Desk Lamp',
    description: 'LED desk lamp with 5 brightness levels, USB charging port, and touch control.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1534281384660-95adb5a9dd8a?w=400',
    category: 'Home',
    stock: 35,
  },
  {
    name: 'Waterproof Backpack',
    description: '30L waterproof backpack with laptop compartment and ergonomic design.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    category: 'Accessories',
    stock: 80,
  },
  {
    name: 'Cast Iron Skillet',
    description: '10-inch pre-seasoned cast iron skillet, oven-safe up to 500°F.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400',
    category: 'Kitchen',
    stock: 45,
  },
];

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  await Product.bulkCreate(products);
  console.log(`Seeded ${products.length} products successfully.`);
  await sequelize.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

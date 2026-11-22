// seed.js - adds a demo seller and 6 sample products (run once: npm run seed)

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/quicksell";

async function addSampleData() {
  await mongoose.connect(MONGO_URL);

  // Demo seller (login: demo@quicksell.com / 123456)
  let seller = await User.findOne({ email: "demo@quicksell.com" });
  if (!seller) {
    seller = await User.create({
      name: "Demo Seller",
      email: "demo@quicksell.com",
      phone: "9876543210",
      password: await bcrypt.hash("123456", 10),
    });
  }

  // Remove old sample products of this demo seller, then add fresh ones
  await Product.deleteMany({ seller: seller._id });

  const items = [
    ["Old Newspapers", "Paper", "50 kg", 300, "Chennai", "Clean and dry newspapers collected over one year."],
    ["Plastic Bottles", "Plastic", "200 pieces", 500, "Madurai", "Empty water bottles, washed and ready for recycling."],
    ["Iron Scrap", "Metal", "100 kg", 2500, "Coimbatore", "Mixed iron scrap from an old workshop."],
    ["Old Laptop", "Electronic", "1 piece", 4000, "Trichy", "Not working. Good for spare parts or recycling."],
    ["Wooden Table", "Furniture", "2 pieces", 1500, "Salem", "Old wooden tables, need small repair."],
    ["Cardboard Boxes", "Paper", "80 pieces", 400, "Chennai", "Strong boxes in good condition."],
  ];

  for (const item of items) {
    await Product.create({
      name: item[0],
      category: item[1],
      quantity: item[2],
      price: item[3],
      location: item[4],
      description: item[5],
      contactPhone: "9876543210",
      seller: seller._id,
    });
  }

  console.log("Sample data added. Login: demo@quicksell.com / 123456");
  await mongoose.disconnect();
}

addSampleData().catch(function (err) {
  console.log("Seed failed: " + err.message);
  process.exit(1);
});

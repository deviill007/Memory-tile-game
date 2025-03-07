const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

//Initializes a new Sequelize instance for PostgreSQL.
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// Establishes a connection to the PostgreSQL database.
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed. Please check your database credentials and ensure the server is running.");
  }
};

module.exports = { sequelize, connectDB };

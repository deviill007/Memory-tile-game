const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // ✅ Import the database connection
const User = require("./User"); // ✅ Import User model for associations

const Score = sequelize.define(
  "Score",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users", // ✅ Make sure this matches the table name
        key: "id",
      },
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Scores", // ✅ Ensure it matches the DB table name
    timestamps: true,
  }
);

// ✅ Establish relationship with User model
Score.belongsTo(User, { foreignKey: "userId" });

module.exports = Score;

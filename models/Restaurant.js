const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema(
  {
    restaurantName: String,
    address: String,
    zipCode: String,
    website: String,
    latitude: String,
    longitude: String,
    stateName: String,
    cityName: String,
    hoursInterval: String,
    cuisineType: String,
  },

  {
    timestamps: true,
  }
);

module.exports = model("Restaurant", restaurantSchema);

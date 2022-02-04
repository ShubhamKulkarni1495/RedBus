const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      unique: true,
      required: true
    },
    numberOfseats: {
      type: Number,
      required: true,
      max: 40
    },
    costOfticket: {
      type: Number,
      require: true
    },
    name: {
      type: String,
      required: true
    },
    startCity: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    endCity: {
      type: String,
      required: true
    },
    arrivalDate: {
      type: Date,
      default: Date.now()
    },
    departureDate: {
      type: Date,
      default: Date.now()
    },
    departureTiming: {
      type: Date,
      default: Date.now()
    },
    arrivalTiming: {
      type: Date,
      default: Date.now()
    }
  }
);

module.exports = mongoose.model("bus", BusSchema);
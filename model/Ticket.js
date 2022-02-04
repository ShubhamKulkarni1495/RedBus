const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    seatNo: {
      type: Number,
      max: 40
    },
    isBooked: {
      type: Boolean,
      default: false
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      require: true
    },
    passenger: {
      name: {
        type: String
      },
      gender: {
        type: String
      },
      phoneNo: {
        type: Number
      },
      email: {
        type: String
      }
    }
  },
);

module.exports = mongoose.model("ticket", TicketSchema);
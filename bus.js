const express = require("express");
const Bus = require("../../model/Bus.js");
const User = require("../../model/User.js");
const Ticket = require("../../model/Ticket.js");
const auth = require("../../middleware/auth.js");
const validation = require("../../validation/busvalidation.js");
const busValidation = validation.busValidation;
const validations = require("../../validation/ticketvalidation.js");
const ticketValidation = validations.ticketValidation;
const { check, validationResult } = require("express-validator/check");
const checkObjectId = require("../../middleware/checkObjectId");  

const router = express.Router();

// Create Bus Information
router.post("/buses", auth, async (req, res) => {
  let [result, data] = busValidation(req.body);
  if (!result) return res.status(400).json({ data });
  try {
    const user = await User.findById(req.user.id);
    let isAdmin = user.isAdmin;
    if (isAdmin === true) {
      const bus = new Bus(req.body);
      const newbus = await bus.save();
      if (newbus) {
        const busId = bus.id;
        return res.status(200).json({ msg: "Bus Id is", busId });
      }
    } else {
      return res.status(400).json({ msg: "enter the valid admin token" });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send({ error: "Bus number has to be unique" });
  }
}),
//Search Buses
router.post(
    "/busSearch",
    [
      check("startCity", "please enter start city")
        .not()
        .isEmpty(),
      check("endCity", "please enter end city")
        .not()
        .isEmpty(),
        check("Date", "please enter date").isDate()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }
      try {
        const startCity = req.body.startCity;
        const endCity = req.body.endCity;
        const Date = req.body.Date;
        const buses = await Bus.find({
          startCity,
          endCity,
          Date
        });
        // console.log(buses);
        if (buses.length === 0) {
          return res.status(404).json({ msg: "Bus not found" });
        }
        return res.status(200).json({ msg: "Avalibale buses are", buses });
      } catch (err) {
        console.log(err);
        res.status(400).json("sever error");
      }
    }
  );

// @route    GET api/AllBuses
// @desc     Get All Buses
// @access   Private
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find({bus:req.body})
    res.json(buses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route    GET api/profile/bus/:bus_id
// @desc     Get Bus by bus ID
// @access   Public
router.get(
  '/:bus_id',
  checkObjectId('bus_id'),
  async (req,res) => {
    try {
      const bus = await Bus.findOne({
        bus:req.body
      });

      if (!bus) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(bus);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);


//Create Ticket Information
router.post("/tickets", auth, async (req, res) => {
  let [result, data] = ticketValidation(req.body);
  if (!result) return res.status(400).json({ data });

  try {
    const user = await User.findById(req.user.id);
    const isAdmin = user.isAdmin;
    if (isAdmin === true) {
      const busId = req.body.busId;
      let bus = await Bus.findById(busId);
      if (!bus) {
        return res.status(404).json({ msg: "bus not found" });
      }
      let busid = await Ticket.findOne({ busId });
      if (busid) {
        return res
          .status(404)
          .json({ msg: "Tickets aleardy created for this bus" });
      } else {
        const numberOfseats = bus.numberOfseats;
        const ticketlist = [];
        for (i = 1; i <= numberOfseats; i++) {
          const ticketObj = {};
          ticketObj.seatNo = i;
          ticketObj.isBooked = false;
          ticketObj.busId = req.body.busId;
          ticketlist.push(ticketObj);
        }
        await Ticket.insertMany(ticketlist);
        return res.status(200).json({ msg: "Ticket created succesfully" });
      }
    } else {
      return res.status(400).json({ msg: "Enter the valid token" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json("sever error");
  }
});

module.exports = router;
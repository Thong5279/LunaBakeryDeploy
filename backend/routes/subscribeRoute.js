const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// @route POST /api/subscribe
// @desc handle newsletter subscription
// @access Public
router.post("/", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        //check if the email already subscribed
        let subscriber = await Subscriber.findOne({email});
        if (subscriber) {
            return res.status(400).json({ message: "Email already subscribed" });
        }
        //Create a new subscriber
        subscriber = new Subscriber({ email });
        await subscriber.save();

        res.status(201).json({ message: "Subscription successful" });
    } catch (error) {
        console.error("Error subscribing:", error);
        res.status(500).json({ message: "Server error" });
    }
})
module.exports = router;
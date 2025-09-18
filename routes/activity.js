const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// GET activities for a user
router.get("/", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  try {
    const activities = await Activity.find({ userId }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new activity
router.post("/", async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();

    // Emit via socket
    if (req.io) req.io.to(activity.userId.toString()).emit("activityUpdated", activity);

    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH update activity status
router.patch("/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    // Emit via socket
    if (req.io) req.io.to(activity.userId.toString()).emit("activityUpdated", activity);

    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

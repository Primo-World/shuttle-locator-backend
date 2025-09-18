const axios = require("axios");
const Location = require("../models/Location");

// Use environment variable instead of hardcoding API key
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

exports.searchLocations = async (req, res) => {
  const { q } = req.query;

  try {
    if (!q || q.trim() === "") {
      return res.json({ locations: [] });
    }

    // Optional: Search your DB first
    const regex = new RegExp(q, "i");
    let dbLocations = await Location.find({ name: regex }).limit(5);

    // Search Google Places API
    const googleRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: q,
          key: GOOGLE_API_KEY, // pulled from .env
          types: "geocode", // or 'establishment' if needed
        },
      }
    );

    const googleLocations = googleRes.data.predictions.map((pred) => ({
      name: pred.description,
      route: pred.structured_formatting?.secondary_text || "",
    }));

    // Combine DB results + Google results
    const locations = [...dbLocations, ...googleLocations];

    res.json({ locations });
  } catch (error) {
    console.error("searchLocations error", error.response?.data || error.message);
    res.status(500).json({ error: "Server error" });
  }
};

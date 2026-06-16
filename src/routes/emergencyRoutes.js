const express = require("express");
const {
  submitEmergencyRequest,
  getNearbyEmergencyWorkers,
  dispatchEmergencyWorker,
  getEmergencyStatus
} = require("../controllers/emergencyController");

const router = express.Router();

// Emergency flows operate fast and allow guest requests (optional tokens)
router.post("/request", submitEmergencyRequest);
router.get("/nearby", getNearbyEmergencyWorkers);
router.post("/dispatch/:workerId", dispatchEmergencyWorker);
router.get("/status/:requestId", getEmergencyStatus);

module.exports = router;

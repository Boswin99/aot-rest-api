const express = require("express");
const { authenticateFirebaseToken } = require("../middleware/authenticateFirebaseToken");
const { validate } = require("../middleware/validate");
const { createTourSchema, updateTourSchema, tourIdParamSchema } = require("../validators/tour.validator");
const { createNewTour, getAllTours, getTourById, updateExistingTour, deleteExistingTour } = require("../controllers/tours.controller");

const router = express.Router();

router.post("/", authenticateFirebaseToken, validate(createTourSchema), createNewTour);
router.get("/", getAllTours);
router.get("/:id", validate(tourIdParamSchema), getTourById);
router.put("/:id", authenticateFirebaseToken, validate(updateTourSchema), updateExistingTour);
router.delete("/:id", authenticateFirebaseToken, validate(tourIdParamSchema), deleteExistingTour);

module.exports = router;

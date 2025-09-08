const tourService = require("../services/tour.service");

const createNewTour = async (req, res, next) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  try {
    const tour = await tourService.createTour(req.user.id, req.body);
    res.status(201).json(tour);
  } catch (error) {
    next(error);
  }
};

const getAllTours = async (req, res, next) => {
  try {
    const tours = await tourService.getAllToursPublic();
    res.status(200).json(tours);
  } catch (error) {
    next(error);
  }
};

const getTourById = async (req, res, next) => {
  try {
    const tour = await tourService.getTourByIdPublic(req.params);
    if (!tour) {
      res.status(404).json({ message: "Tour not found" });
      return;
    }
    res.status(200).json(tour);
  } catch (error) {
    next(error);
  }
};

const updateExistingTour = async (req, res, next) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  try {
    const updatedTour = await tourService.updateTourById(req.user.id, req.params, req.body);
    if (!updatedTour) {
      res.status(404).json({ message: "Tour not found or access denied" });
      return;
    }
    res.status(200).json(updatedTour);
  } catch (error) {
    next(error);
  }
};

const deleteExistingTour = async (req, res, next) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  try {
    const success = await tourService.deleteTourById(req.user.id, req.params);
    if (!success) {
      res.status(404).json({ message: "Tour not found or access denied" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewTour,
  getAllTours,
  getTourById,
  updateExistingTour,
  deleteExistingTour,
};

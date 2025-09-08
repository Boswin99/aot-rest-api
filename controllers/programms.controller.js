const programService = require("../services/program.service");

const createNewProgram = async (req, res, next) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  try {
    const program = await programService.createProgram(req.user.id, req.body);
    res.status(201).json(program);
  } catch (error) {
    next(error);
  }
};

const getAllPrograms = async (req, res, next) => {
  try {
    const programs = await programService.getAllProgramsPublic();
    res.status(200).json(programs);
  } catch (error) {
    next(error);
  }
};

const updateExistingProgram = async (req, res, next) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  try {
    const updatedProgram = await programService.updateProgramById(req.user.id, req.params, req.body);
    if (!updatedProgram) {
      res.status(404).json({ message: "Program not found or access denied" });
      return;
    }
    res.status(200).json(updatedProgram);
  } catch (error) {
    next(error);
  }
};

const getProgramById = async (req, res, next) => {
  try {
    const program = await programService.getProgramByIdPublic(req.params);
    if (!program) {
      res.status(404).json({ message: "Program not found" });
      return;
    }
    res.status(200).json(program);
  } catch (error) {
    next(error);
  }
};

const deleteExistingProgram = async (req, res, next) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  try {
    const success = await programService.deleteProgramById(req.user.id, req.params);
    if (!success) {
      res.status(404).json({ message: "Program not found or access denied" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewProgram,
  getAllPrograms,
  getProgramById,
  updateExistingProgram,
  deleteExistingProgram,
};

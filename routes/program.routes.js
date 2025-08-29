const express = require("express");
const { authenticateFirebaseToken } = require("../middleware/authenticateFirebaseToken");
const { validate } = require("../middleware/validate");
const { createProgramSchema, updateProgramSchema, programIdParamSchema } = require("../validators/program.validator");
const { createNewProgram, getAllPrograms, getProgramById, updateExistingProgram, deleteExistingProgram } = require("../controllers/programms.controller");

const router = express.Router();

router.post("/", authenticateFirebaseToken, validate(createProgramSchema), createNewProgram);
router.get("/", getAllPrograms);
router.get("/:id", validate(programIdParamSchema), getProgramById);
router.put("/:id", authenticateFirebaseToken, validate(updateProgramSchema), updateExistingProgram);
router.delete("/:id", authenticateFirebaseToken, validate(programIdParamSchema), deleteExistingProgram);

module.exports = router;

import express from "express"
import rateLimit from "express-rate-limit"
import { createNote, unlockNote, summarizeNoteController, checkNoteExists } from "../controllers/NotesController.js"
import { validateCreateNote, validateUnlockNote } from "../middleware/Validation.js";
const router = express.Router();

//Rate Limit

const createRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        error:  'too many notes created , Please try again after an hour'
    }
})

// prevent brute force

const unlockRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: {
    success: false,
    error: 'Too many unlock attempts. Please wait 15 minutes before trying again.',
  },
});

//Max 10 Ai summarize request per hour

const summarizeRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10,
  message: {
    success: false,
    error: 'Too many summarize requests. Please try again after an hour.',
  },
});

router.post("/", createRateLimit, validateCreateNote, createNote);


router.get("/:id/exists", checkNoteExists);


router.post("/:id/unlock", unlockRateLimit, validateUnlockNote, unlockNote );


router.post("/:id/summarize", summarizeRateLimit, validateUnlockNote, summarizeNoteController)


export default router;
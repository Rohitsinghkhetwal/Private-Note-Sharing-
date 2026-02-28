import { body, validationResult} from "express-validator"

const validationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()[0].msg,
            errors: errors.array().map((e) => e.msg)
        })
    }
    next();
}


const validateCreateNote = [
    body('text')
    .exists()
    .withMessage("Note text is required")
    .bail()
    .isString()
    .withMessage("Note text must be string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Note cannot be empty')
    .bail()
    .isLength({max: 500})
    .withMessage('Note must be under 500 character'),
    
    body('expiresIn')
    .optional()
    .isIn(['never', '1h', '24h', '7d', '30d'])
    .withMessage('Invalid expiry option Choose from: never, 1h, 24h, 7d, 30d. '),

    validationErrors,
]

// Validation rules for unlocking a note 

const validateUnlockNote = [
  body('password')
    .exists()
    .withMessage('Password is required.')
    .bail()
    .isString()
    .withMessage('Password must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Password cannot be empty.'),

  validationErrors,
];

export { validateCreateNote, validateUnlockNote  }
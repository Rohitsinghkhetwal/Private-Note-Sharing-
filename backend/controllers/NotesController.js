import { nanoid } from "nanoid";
import bcrypt from "bcrypt"
import noteModel from "../models/Note.js";
import summarizeNote from "../services/Summarize.js"


const SALT_ROUNDS = 10;
const PASSWORD_LENGTH = 8;
const NOTE_ID_LENGTH = 10;

// yo I am adding the comments here for your refrence here ! 

const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let password = ''
    for(let i = 0; i < PASSWORD_LENGTH; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Helper function to calculate expiry date 

const calculateExpiry = (expiryOption) => {
  if (!expiryOption || expiryOption === 'never') return null;

  const now = new Date();
  const options = {
    '1h':  new Date(now.getTime() + 1 * 60 * 60 * 1000),
    '24h': new Date(now.getTime() + 24 * 60 * 60 * 1000),
    '7d':  new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    '30d': new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
  };

  return options[expiryOption] || null;
};

// create a new note controller (POST /api/notes)
const createNote = async (req, res) => {
    try {
        const { text, expiresIn} = req.body;

        const noteId = nanoid(NOTE_ID_LENGTH);
        const plainPassword = generatePassword();

        const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        const expiresAt = calculateExpiry(expiresIn);

        await noteModel.create({
            noteId,
            text,
            password: hashedPassword,
            expiresAt
        });

        // Build the sharable URL
        const baseUrl = process.env.FRONTEND_URL;
        const sharableUrl = `${baseUrl}/note/${noteId}`;

        return res.status(201).json({
            success: true,
            message: 'Note created successfully ',
            data: {
                url: sharableUrl,
                password: plainPassword,
                expiresAt: expiresAt || null
            }
        })


    }catch(err) {
        console.log("Something went wrong while creating the notes");
        return res.status(500).json({
            success: false,
            error: 'Failed to create the note '
        })
    }
}


// Unlock the view a note 

const unlockNote = async(req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        //find note by noteid 
        const note = await noteModel.findOne({noteId: id});
        //if note does not exists

        if(!note) {
            return res.status(404).json({
                success: false,
                error: 'Note not found , It may Deleted or link is incorrect .'
            })
        }

        // check if note is expired , we will check here 
        if(note.expiresAt && new Date() > note.expiresAt) {
            await noteModel.deleteOne({ noteId: id});
            return res.status(410).json({
                success: false,
                error: 'Link is expired'
            })
        }

        // compare password with incorrect or correct 
        const isCorrectPassword = await bcrypt.compare(password, note.password)

        // check if password is correct 
        if(!isCorrectPassword) {
            return res.status(401).json({
                success: false,
                error: "Incorrect Password , Please try again"
            })
        }

        // Increment view count 
        await noteModel.updateOne({noteId: id}, {$inc: {viewCount: 1}});

        // Return the note text when it is success . 

        return res.status(200).json({
            success: true,
            data: {
                text: note.text,
                createdAt: note.createdAt,
                expiresAt: note.expiresAt || null
            }
        })

    }catch(err) {
        console.log("Something went wrong here ", err)
        return res.status(500).json({
            success: false,
            message: 'Failed to unlock the note ...'
        })

    }

}

// Summerize the note using Ai ( I am using Gemini for my use case )

const summarizeNoteController = async(req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        
        const note = await noteModel.findOne({noteId: id})

        // check if note is exist or not 

        if(!note) {
            return res.status(404).json({
                success: false,
                error: 'Note not found'
            })
        }
        // check if note has ecpired or not 

        if(note.expiresAt && new Date() > note.expiresAt) {
            return res.status(401).json({
                success: false,
                error: "This note is expired ......"
            })
        }

        // Always varify password before summarize
        const isPasswordCorrect = await bcrypt.compare(password, note.password);

        if(!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect password !'
            })
        }

        // o boy , we will call the AI service here that we have created for the AI summarize purpose 
        // service/Aiservice
        const summary = await summarizeNote(note.text);

        return res.status(200).json({
            success: true,
            data: {
                summary
            }
        })

    }catch(err) {
        console.log("this is the error ", err)
        return res.status(500).json({
            success: false,
            error: 'Failed to summarize note.'
        })

    }
}

// api for check if note exists or not 
const checkNoteExists = async(req, res) => {
    try {
        const { id } = req.params;

        const note = await noteModel.findOne({ noteId: id}).select('noteId expiresAt')

        if(!note) {
            return res.status(404).json({
                success: false,
                error: 'Note not found . It may have been deleted or the link is incorrect'
            })
        }

        if(note.expiresAt && new Date() > note.expiresAt) {
            return res.status(410).json({
                success: false,
                error: 'This note has expired and is no longer available'
            })
        }

        return res.status(200).json({
            success: true,
            data: {
                expiresAt: note.expiresAt || null
            }
        })

    }catch(err) {
        console.log("Error", err)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong , Please try again '
        })

    }
}



export {createNote, unlockNote, summarizeNoteController, checkNoteExists }
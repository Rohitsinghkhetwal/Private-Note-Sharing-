import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    noteId: {
        type: String,
        required:true,
        unique:true,
        index: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 500,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: null,
    },
    viewCount: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

noteSchema.index({ expiresAt: 1}, {expireAfterSeconds: 0, sparse: true});

const noteModel = mongoose.model("Notes", noteSchema)

export default noteModel;
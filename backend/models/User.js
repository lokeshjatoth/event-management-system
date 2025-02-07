import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
}, { timestamps: true }); 


export default mongoose.model("User", UserSchema);
// Schema User Mongo 

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true
    },
    cart: {
        type: Array,
        default: []
    }
}, { timestamps: true }
)

export default mongoose.model( "Users", userSchema );

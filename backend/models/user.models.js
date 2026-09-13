import mongoose from "mongoose";



const userSchema = new mongoose.Schema({

        fullName: {
            type: String,
            required: true

        },

        email: {
            type: String,
            required: true,
            unique: true

        },
        password: {
            type: String,
        },
        mobile: {
            type: String,
            required: true

        },
        role: {
            type: String,
            required: true,
            enum: ["user", "owner", "deliveryBoy"],

        },
        // to store otp for reset password 

        resetOtp: {
            type: String,
        },
        isotpVerified: {
            type: Boolean,
            default: false
        },
        otpExpires: {
            type: Date
        },
        location: {

            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] }


        }

    }, { timestamps: true }) // timstamp ki us db ka time save rhe  Db me
userSchema.index({ location: "2dsphere" }); // 2d sphere index create krne ke liye




const User = mongoose.model("User", userSchema);

export default User;
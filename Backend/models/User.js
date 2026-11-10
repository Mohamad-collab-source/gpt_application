
import mongoose from "mongoose";

// 1. Define the structure of a user
const userSchema = new mongoose.Schema({

  // 2. Store the user's name
  name: {
    type: String,
    required: true,
    trim: true
  },

  // 3. Store the user's email
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  // 4. Store the hashed password
  password: {
    type: String,
    required: true,
    select: false
  }

}, { timestamps: true });

// 5. Create the MongoDB model
const User = mongoose.model("User", userSchema);

// 6. Export the model
export default User;

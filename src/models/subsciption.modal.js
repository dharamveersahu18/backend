import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  subsciber: {
    type: Schema.Types.ObjectId,// user who is subscibing
    ref: "User"
  },
  channel:{
        type: Schema.Types.ObjectId,// one  to whom subscriber is  subscribing                                                
    ref: "User"
  }
},{timestamps: true});

export const Subsciption = mongoose.model("Subsciption", subscriptionSchema);

//category schema
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const colorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Color = mongoose.model("Color", colorSchema);

export default Color;

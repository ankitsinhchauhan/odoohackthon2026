import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: String,
    plate: String,
    capacity: Number,
    status: { type: String, default: "Available" },
  },
  { timestamps: true },
);

export default mongoose.model("Vehicle", vehicleSchema);

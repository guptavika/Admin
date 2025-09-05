import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
});

const Slider = mongoose.model("Slider", sliderSchema);

export default Slider;

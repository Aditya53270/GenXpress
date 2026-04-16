import mongoose from "mongoose";

const scheduledContentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    caption: { type: String, required: true },
    hashtags: { type: String, default: "" },
    scheduledTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "posted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ScheduledContent =
  mongoose.models.ScheduledContent ||
  mongoose.model("ScheduledContent", scheduledContentSchema);

export default ScheduledContent;

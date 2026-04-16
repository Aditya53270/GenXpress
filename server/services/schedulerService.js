import cron from "node-cron";
import ScheduledContent from "../models/scheduledContentModel.js";

export const startScheduleCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await ScheduledContent.updateMany(
        { status: "pending", scheduledTime: { $lte: new Date() } },
        { $set: { status: "posted" } }
      );
    } catch (error) {
      console.error("Scheduler error:", error.message);
    }
  });
};

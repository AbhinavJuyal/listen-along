import mongoose from "mongoose";
import config from "config";
import chalk from "chalk";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.get("mongoURI") as string);
    console.log(chalk.cyan.underline("MongoDB Connected!!"));
  } catch (e) {
    console.log("error: " + e);
    process.exit(1);
  }
};

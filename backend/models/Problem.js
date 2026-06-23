import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    problemId: { type: String, required: true, unique: true },

    title: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    description: { type: String, required: true },

    examples: [{ type: String }],

    constraints: [{ type: String }],

    starterCode: {
      type: String,
      default: "def solution():\n    pass",
    },

    testCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Problem", problemSchema);
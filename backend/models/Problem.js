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

    methodNames: [{ type: String, required: true }],

    starterCode: {
      type: String,
      default: "def solution():\n    pass",
    },

    sampleTestCases: [
      {
        input: { type: mongoose.Schema.Types.Mixed, required: true },
        output: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],

    hiddenTestCases: [
      {
        input: { type: mongoose.Schema.Types.Mixed, required: true },
        output: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Problem", problemSchema);

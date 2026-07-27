import mongoose from "mongoose";

export const DBTypes = [
  "int",
  "float",
  "string",
  "boolean",
  "int[]",
  "float[]",
  "string[]",
  "boolean[]",
  "int[][]",
  "float[][]",
  "string[][]",
  "boolean[][]",
  "void",
];

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

    params: [
      {
        name: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          required: true,
          enum: DBTypes.filter((type) => type !== "void"),
        },
      },
    ],

    returnType: {
      type: String,
      required: true,
      enum: DBTypes,
    },

    examples: [
      {
        text: {
          type: String,
          required: true,
        },

        images: {
          type: [String],
          default: [],
        },
      },
    ],

    constraints: [{ type: String }],

    methodNames: [{ type: String, required: true }],

    starterCode: {
      type: String,
      default: "def solution():\n    pass",
    },

    sampleTestCases: [
      {
        input: { type: mongoose.Schema.Types.Mixed, required: true },
        expected: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],

    hiddenTestCases: [
      {
        input: { type: mongoose.Schema.Types.Mixed, required: true },
        expected: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Problem", problemSchema);

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const evaluateCode = async (problem, constraints, code) => {
  const prompt = `
You are a code reviewer for a technical coding practice platform.

Analyze the submitted Python solution below.

Problem:
${problem}

Constraints:
${constraints}

Submitted code:
${code}

Evaluate the submission on:

1. timeComplexity: The current time complexity using Big O notation.
2. spaceComplexity: The current space complexity using Big O notation.
3. optimalTimeComplexity: The best possible time complexity for this problem using Big O notation.
4. optimalSpaceComplexity: The best possible space complexity for this problem using Big O notation.
5. codeStyle: Your written feedback on the code style.
6. suggestions: An array of clear, actionable tips to improve the code, if any.

Do not rewrite the entire solution.
You can ignore any missing imports that would otherwise be needed in the code.

`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          timeComplexity: {
            type: "STRING",
          },
          spaceComplexity: {
            type: "STRING",
          },
          optimalTimeComplexity: {
            type: "STRING",
          },
          optimalSpaceComplexity: {
            type: "STRING",
          },
          codeStyle: {
            type: "STRING",
          },
          suggestions: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
        },
        required: [
          "timeComplexity",
          "spaceComplexity",
          "optimalTimeComplexity",
          "optimalSpaceComplexity",
          "codeStyle",
          "suggestions",
        ],
      },
    },
  });

  return JSON.parse(response.text);
};

export const generateHint = async (problem, constraints, code) => {
  const prompt = `
You are providing a hint for a coding practice problem.

Problem:
${problem}

Constraints:
${constraints}

Current code:
${code}

Evaluate the user's current code to determine whether they are on the right track toward a correct solution.
Provide one concise hint that helps the user move toward the solution
without giving them the complete solution or code.
If the approach is already correct, provide a hint about optimizing it rather than suggesting an entirely different approach.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          hint: { type: "STRING" },
        },
        required: ["hint"],
      },
    },
  });

  return JSON.parse(response.text);
};

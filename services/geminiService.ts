
import { GoogleGenAI, Type } from "@google/genai";
import { RubricCriterion } from "../types";

// Note: API_KEY is expected to be set in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const validationSchema = {
    type: Type.OBJECT,
    properties: {
        status: {
            type: Type.STRING,
            enum: ['Supported', 'Partially Supported', 'Not Supported'],
            description: 'The validation status of the justification.'
        },
        referencedExcerpt: {
            type: Type.STRING,
            description: 'The most relevant quote from the student submission that supports your validation reasoning. This quote must be an exact substring from the submission text.'
        },
        reasoning: {
            type: Type.STRING,
            description: 'A brief, 1-2 sentence explanation for the validation status, directly comparing the justification to the submission text and rubric.'
        },
        suggestedRefinement: {
            type: Type.STRING,
            description: 'A suggested improvement to the grader\'s written justification to make it stronger or more accurate.'
        }
    },
    required: ['status', 'referencedExcerpt', 'reasoning', 'suggestedRefinement']
};


const mockValidate = (score: number, explanation: string) => {
    return new Promise(resolve => {
        setTimeout(() => {
            let status: 'Supported' | 'Partially Supported' | 'Not Supported' = 'Supported';
            if (score < 15 && explanation.includes("excellent")) status = 'Partially Supported';
            if (score > 20 && explanation.includes("poor")) status = 'Not Supported';
            
            resolve({
                status: status,
                referencedExcerpt: "The firm should pivot to subscription pricing because...",
                reasoning: "The justification aligns with the provided text, but the sentiment could be stronger.",
                suggestedRefinement: "Consider explicitly quoting the part about 'recurring revenue streams' to bolster your point."
            });
        }, 800);
    });
};

export const validateJustification = async (
    submissionContent: string,
    criterion: RubricCriterion,
    score: number,
    explanation: string
) => {
    if (!ai) {
        return mockValidate(score, explanation);
    }

    const prompt = `
        You are RubricGuard AI, an expert assistant for academic grading. Your task is to validate a grader's assessment of a student submission against a specific rubric criterion. Be objective and concise.

        **Student Submission Text:**
        ---
        ${submissionContent}
        ---

        **Rubric Criterion:**
        - Name: "${criterion.name}"
        - Description: "${criterion.description}"
        - Max Points: ${criterion.max_points}

        **Grader's Assessment:**
        - Score: ${score} / ${criterion.max_points}
        - Justification: "${explanation}"

        **Your Task:**
        1.  **Analyze Justification:** Does the grader's justification accurately reflect the content of the student's submission?
        2.  **Analyze Score:** Is the score provided by the grader consistent with the rubric description, the submission content, and their own justification? A low score should correspond to weaknesses mentioned, and a high score to strengths.
        3.  **Provide Feedback:** Based on your analysis, return a JSON object with your findings. The 'referencedExcerpt' must be an exact quote from the submission.

        Respond ONLY with a valid JSON object matching the required schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: validationSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error validating justification with Gemini API:", error);
        throw new Error("Failed to get a valid response from the AI assistant.");
    }
};

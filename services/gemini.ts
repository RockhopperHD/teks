import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

const AINARA_ACTIVITIES_CONTEXT = `
# Activities de Ainara

## Images
AINARA can AI-generate images.

## Quiz (Base & Open Question)
In Quiz, learners answer a series of questions derived from the reading material, designed to test their comprehension and recall. This activity has two primary modes:
Multiple Choice (Base): Learners select the correct answer(s) from a list of options provided for a question.
Open Question: Learners input their own short or medium-length written response into a text field.
Quiz is great for content material like verifying factual recall, assessing reading comprehension, and encouraging learners to articulate specific details or concepts from the text.

## True/False
In True/False, learners evaluate a series of statements derived from the text to determine if they accurately reflect the information presented or if they contain false or modified details.
True/False is great for content material like fact-checking, distinguishing between similar concepts, and verifying close attention to detail in a reading.

## Fill-in-the-gaps
In Fill-in-the-gaps, learners complete sentences or paragraphs by selecting or identifying key terms—such as nouns or adjectives—that have been removed from the text context.
Fill-in-the-gaps is great for content material like vocabulary reinforcement, grammar structure practice, and understanding context clues within a sentence.

## Relations
In Relations, learners draw logical connections between pairs of items, such as matching words to their definitions or linking semantically related concepts found in the reading (one-to-one relationships).
Relations is great for content material like synonym/antonym practice, vocabulary building, and reinforcing specific terminology or concept associations.

## Spot the Intruder
In Spot the Intruder, learners analyze a group of words related to the text to identify the single term that does not belong to the specific semantic category or theme shared by the others.
Spot the Intruder is great for content material like taxonomic categorization, logical reasoning, and differentiating between closely related themes or attributes.

## Choose the Best Summary
In Choose the Best Summary, learners evaluate three potential summaries of a text to select the one that most accurately and completely reflects the main ideas, avoiding options with errors or irrelevant details.
Choose the Best Summary is great for content material like reading comprehension synthesis, identifying main ideas versus supporting details, and practicing summarization skills.

## Write Your Summary
In Write Your Summary, learners practice synthesis and expression by drafting their own original synopsis of the reading, often including a creative title.
Write Your Summary is great for content material like creative writing, advanced comprehension assessment, and encouraging learners to express information in their own voice.

## Word Search
In Word Search, learners scan a grid of letters to locate and select specific key terms hidden vertically or horizontally that are relevant to the reading material.
Word Search is great for content material like visual scanning, spelling reinforcement, and familiarizing learners with key vocabulary in a low-stress environment.

## Crossword
In Crossword, learners use brief definitions based on the text to figure out specific words and fit them into an interlocking grid structure.
Crossword is great for content material like testing definitions, recalling specific terminology, and combining logic with vocabulary recall.

## Memory
In Memory, learners flip virtual cards to find and match pairs of related concepts or words derived from the text, relying on recall and concentration.
Memory is great for content material like vocabulary retention, visual memory training, and gamified reinforcement of simple concept associations.
`;

// Schema from pieces/schema
const lessonPlanSchema = {
    type: SchemaType.OBJECT,
    description: "Unit or week plan schema.",
    properties: {
        title: {
            type: SchemaType.STRING,
            description: "Title for the unit or week plan."
        },
        description: {
            type: SchemaType.STRING,
            description: "A comprehensive description of the lesson or unit."
        },
        subject: {
            type: SchemaType.STRING,
            description: "The subject of the lesson/unit."
        },
        overarching_goals_standards: {
            type: SchemaType.ARRAY,
            description: "A list of relevant TEKS ID standards (e.g., '112.2.b.4') that apply to the unit's overarching goals.",
            items: {
                type: SchemaType.STRING
            }
        },
        activities: {
            type: SchemaType.ARRAY,
            description: "A list of activities or lessons for the plan. The number of activities must match the requested number of days.",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    title: {
                        type: SchemaType.STRING,
                        description: "Title of the specific activity."
                    },
                    timeframe: {
                        type: SchemaType.STRING,
                        description: "Timeframe for the lesson (e.g., 'one class period', '120 minutes')."
                    },
                    student_will_statement: {
                        type: SchemaType.STRING,
                        description: "A statement starting with 'Students will...' describing what they will learn and do."
                    },
                    assignment_description: {
                        type: SchemaType.STRING,
                        description: "A paragraph describing the assignment details."
                    },
                    evaluation_criteria: {
                        type: SchemaType.OBJECT,
                        description: "Rubric for grading the assignment.",
                        properties: {
                            score_4_proficient: {
                                type: SchemaType.STRING,
                                description: "Criteria for 'Proficient'. What qualifies a student to achieve this rating."
                            },
                            score_3_developing: {
                                type: SchemaType.STRING,
                                description: "Criteria for 'Developing'. What qualifies a student to achieve this rating."
                            },
                            score_2_beginning: {
                                type: SchemaType.STRING,
                                description: "Criteria for 'Beginning to develop'. What qualifies a student to achieve this rating."
                            },
                            score_1_not_yet: {
                                type: SchemaType.STRING,
                                description: "Criteria for 'Not Yet'. What qualifies a student to achieve this rating."
                            },
                            score_0_no_participation: {
                                type: SchemaType.STRING,
                                description: "Criteria for 'Doesn't Participate'. e.g., 'Student submits blank work'."
                            }
                        },
                        required: [
                            "score_4_proficient",
                            "score_3_developing",
                            "score_2_beginning",
                            "score_1_not_yet",
                            "score_0_no_participation"
                        ]
                    },
                    activity_standards: {
                        type: SchemaType.ARRAY,
                        description: "A list of relevant TEKS ID standards (e.g., '112.2.b.4') specific to this activity.",
                        items: {
                            type: SchemaType.STRING
                        }
                    },
                    ainara_activities: {
                        type: SchemaType.ARRAY,
                        description: "A list of 1 to 3 suggested AINARA activities that complement this lesson activity.",
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                title: {
                                    type: SchemaType.STRING,
                                    description: "The title of the AINARA activity (must be one of the defined AINARA activity types)."
                                },
                                rationale: {
                                    type: SchemaType.STRING,
                                    description: "Explanation of why this AINARA activity is fitting for this part of the lesson."
                                }
                            },
                            required: ["title", "rationale"]
                        }
                    }
                },
                required: [
                    "title",
                    "timeframe",
                    "student_will_statement",
                    "assignment_description",
                    "evaluation_criteria",
                    "activity_standards",
                    "ainara_activities"
                ]
            }
        },
        notes: {
            type: SchemaType.STRING,
            description: "Any additional notes regarding the plan."
        }
    },
    required: [
        "title",
        "description",
        "subject",
        "overarching_goals_standards",
        "activities",
        "notes"
    ]
};

export const generateLessonPlan = async (subject: string, topic: string, standardsCsvContent: string, numDays: number) => {
    const systemInstruction = `You are a lesson planner. Generate a JSON structure for a lesson plan based on the following standards.

As an expert lesson creator, you are tasked with developing a lesson plan structured in JSON format. Your focus must be on aligning all components to relevant standards and ensuring the lessons are appropriate for the specified grade level and context. You are strictly prohibited from including inappropriate or controversial items. You have the freedom to devise intuitive lessons, provided you do not deviate from the given standards. The required JSON structure includes a title for the unit, a description summarizing it, the subject area, an array of overarching_goals_standards (TEKS IDs), and a notes field. The core of the plan is the activities array, which must contain between 1 and 5 activity objects. Each activity object must include a title, timeframe, a student_will_statement beginning with "Students will...", an assignment_description (a paragraph detailing the assignment), an array of activity_standards (specific TEKS IDs), and an evaluation_criteria object acting as a rubric. This rubric is strictly required to contain five fields: score_4_proficient, score_3_developing, score_2_beginning, score_1_not_yet, and score_0_no_participation (e.g., "Student submits blank work").

Additionally, for each activity, you MUST suggest between 1 and 3 "AINARA activities" that complement the lesson. Choose from the following list of AINARA activities and provide a rationale for each choice based on the provided descriptions:

${AINARA_ACTIVITIES_CONTEXT}`;

    const prompt = `Subject: ${subject}
Topic: ${topic}
Number of Days/Sessions: ${numDays}

Standards CSV Content:
${standardsCsvContent}

Generate a lesson plan for the above subject and topic, spanning exactly ${numDays} days/sessions, using the provided standards.`;

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: lessonPlanSchema as any, // Cast to any to avoid strict SchemaType mismatch in SDK types
    };


    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: "user",
                    parts: [
                        { text: systemInstruction },
                    ],
                },
            ],
        });

        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating lesson plan:", error);
        throw error;
    }
};

export const generateActivity = async (subject: string, topic: string, standardsCsvContent: string) => {
    const systemInstruction = `You are a lesson planner. Generate a single activity object for a lesson plan based on the following standards.

As an expert lesson creator, you are tasked with developing a single activity for a lesson plan structured in JSON format. Your focus must be on aligning all components to relevant standards and ensuring the activity is appropriate for the specified grade level and context. You are strictly prohibited from including inappropriate or controversial items.

The required JSON structure is a single activity object with the following fields:
- title: string
- timeframe: string
- student_will_statement: string (starting with "Students will...")
- assignment_description: string
- activity_standards: array of TEKS IDs
- evaluation_criteria: object (rubric with score_4_proficient, score_3_developing, score_2_beginning, score_1_not_yet, score_0_no_participation)
- ainara_activities: array of 1-3 suggested AINARA activities (title, rationale)

${AINARA_ACTIVITIES_CONTEXT}`;

    const prompt = `Subject: ${subject}
Topic: ${topic}

Standards CSV Content:
${standardsCsvContent}

Generate a single activity for the above subject and topic, using the provided standards.`;

    // Extract the activity schema from the full lesson plan schema
    const activitySchema = lessonPlanSchema.properties.activities.items;

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: activitySchema as any,
    };

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: "user",
                    parts: [
                        { text: systemInstruction },
                    ],
                },
            ],
        });

        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating activity:", error);
        throw error;
    }
};

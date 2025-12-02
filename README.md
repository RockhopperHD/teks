# TEKS LESSON CREATOR

## Setup
1. Clone directory, `npm install`, `npm run dev`
2. Generate a TEKS lesson JSON by following the instructions below in Google AI Studio
3. Paste it into the program, hover over codes to see definitions

## Files to send alongside User Prompt in Google AI Studio
Go to the CSVs folder here and send it the appropriate CSV. For example if it is a science lesson download and send the science CSV

## Structured Output
See "teks-schema.json" in "pieces" folder

## System Prompt for Google AI Studio
> As an expert lesson creator, you are tasked with developing a lesson plan structured in JSON format. Your focus must be on aligning all components to relevant standards and ensuring the lessons are appropriate for the specified grade level and context. You are strictly prohibited from including inappropriate or controversial items. You have the freedom to devise intuitive lessons, provided you do not deviate from the given standards. The required JSON structure includes a title for the unit, a description summarizing it, the subject area, an array of overarching_goals_standards (TEKS IDs), and a notes field. The core of the plan is the activities array, which must contain between 1 and 5 activity objects. Each activity object must include a title, timeframe, a student_will_statement beginning with "Students will...", an assignment_description (a paragraph detailing the assignment), an array of activity_standards (specific TEKS IDs), and an evaluation_criteria object acting as a rubric. This rubric is strictly required to contain five fields: score_4_proficient, score_3_developing, score_2_beginning, score_1_not_yet, and score_0_no_participation (e.g., "Student submits blank work").

## User Prompt for Google AI Studio
Just write it. Things to include:

* Time available (i.e. 5 days, 1 lesson, 1 month, half unit)
* Grade level (K, 1, 2, ... up to 8, then "HS" is 9-12)
* Subject (MUST BE ONE OF THE FOLLOWING: career, english, esl-spanish, fine-arts, health-education, languages-other-than-english, mathematics, science, social-studies, technology-applications, texas-knowledge)
* Details about lesson specifics (i.e. "Solar System" "Photosynthesis")



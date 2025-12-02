import React, { useState, useEffect } from 'react';
import { LessonPlan, StandardDefinition } from './types';
import LessonPlanView from './components/LessonPlanView';
import { parseCSV } from './services/teksData';

const INITIAL_JSON_STRING = `{
  "title": "Exploring Our Cosmic Neighborhood: A 3-Day Solar System Unit",
  "description": "This three-day unit for high school astronomy/science focuses on the structure, scale, and composition of the solar system. Students will move from understanding the vast distances and relative sizes of celestial bodies to comparing the specific characteristics of planets and investigating the significance of smaller solar system objects like asteroids and comets. The unit emphasizes modeling, comparative analysis, and communicating scientific findings.",
  "subject": "Science",
  "overarching_goals_standards": [
    "112.48.c.7.C",
    "112.48.c.11.B",
    "112.48.c.11.C"
  ],
  "activities": [
    {
      "title": "Scaling the Void: A Solar System Walk",
      "timeframe": "One class period (45-60 minutes)",
      "student_will_statement": "Students will calculate scale distances for planetary orbits and construct a physical model to demonstrate the relative sizes and distances of the Sun and planets, identifying the limitations of physical models.",
      "assignment_description": "Students will work in small groups to perform calculations converting astronomical units (AU) into a walkable scale (e.g., 1 AU = 1 meter or 1 AU = 10 steps). Using a central object to represent the Sun, groups will place markers for each planet at the calculated distances in a hallway or outdoor space. Afterward, they will complete a reflection sheet analyzing the vastness of space compared to the size of the planets themselves, and discuss why creating a model that is to scale for both size and distance simultaneously is difficult.",
      "evaluation_criteria": {
        "score_4_proficient": "Calculations for scale distances are 100% accurate. The physical model is laid out correctly. The student provides a deep analysis of the limitations of the model (e.g., inability to scale size and distance simultaneously in a small space).",
        "score_3_developing": "Calculations are mostly accurate with minor errors. The model is laid out with reasonable accuracy. The reflection identifies limitations but lacks depth or specific examples.",
        "score_2_beginning": "Calculations contain significant errors leading to an inaccurate model layout. The reflection is incomplete or demonstrates a misunderstanding of the concept of scale.",
        "score_1_not_yet": "Calculations are missing or wholly incorrect. No model is constructed or the student does not participate in the layout process.",
        "score_0_no_participation": "Student submits no work and refuses to participate in the group activity."
      },
      "activity_standards": [
        "112.48.c.7.C",
        "112.48.c.2.A"
      ]
    },
    {
      "title": "Planetary Comparative Analysis",
      "timeframe": "One class period (45-60 minutes)",
      "student_will_statement": "Students will compare and contrast the planets in terms of orbit, size, composition, rotation, atmosphere, natural satellites, magnetic fields, and geological activity.",
      "assignment_description": "Students will be assigned a specific planetary group (Terrestrial or Jovian) or specific pairs of planets to research. They must create a 'Planetary Data Sheet' or infographic that compares their assigned planets against Earth. The analysis must include data on composition, atmosphere, magnetic fields, and geological activity. Finally, students will write a summary paragraph explaining how distance from the Sun influences the physical properties of the planets (e.g., temperature, state of matter, atmosphere retention).",
      "evaluation_criteria": {
        "score_4_proficient": "The data sheet is comprehensive, visually organized, and accurate. The summary paragraph clearly articulates the relationship between solar distance and planetary properties with specific evidence.",
        "score_3_developing": "The data sheet contains most required information but may miss details on magnetic fields or geological activity. The summary explains the relationship generally but lacks specific evidence.",
        "score_2_beginning": "The data sheet is incomplete or contains factual errors. The summary fails to connect the physical properties to the distance from the Sun.",
        "score_1_not_yet": "The assignment is fragmentary with minimal data. No summary is provided.",
        "score_0_no_participation": "Student submits blank work."
      },
      "activity_standards": [
        "112.48.c.11.C"
      ]
    },
    {
      "title": "Small Bodies, Big Significance",
      "timeframe": "One class period (45-60 minutes)",
      "student_will_statement": "Students will explore and communicate the origins and significance of planets, planetary rings, satellites, asteroids, comets, Oort cloud, and Kuiper belt objects.",
      "assignment_description": "Students will conduct a 'jigsaw' research activity where different groups investigate specific non-planetary bodies: Asteroids, Comets, Kuiper Belt Objects, and the Oort Cloud. Groups will create a 3-minute presentation or a digital poster explaining what these objects are made of, where they are located, and what they tell us about the formation of the solar system. The class will conclude with a discussion on the difference between these objects and major planets.",
      "evaluation_criteria": {
        "score_4_proficient": "Presentation includes accurate, detailed information on composition, location, and origin significance. Student demonstrates strong understanding of how these bodies relate to solar system formation.",
        "score_3_developing": "Presentation includes basic information on composition and location but may miss the significance regarding solar system formation.",
        "score_2_beginning": "Presentation is vague, missing key definitions (e.g., confusing comets and asteroids) or location data.",
        "score_1_not_yet": "Presentation is significantly incomplete or incorrect.",
        "score_0_no_participation": "Student refuses to present or submit work."
      },
      "activity_standards": [
        "112.48.c.11.B"
      ]
    }
  ],
  "notes": "This lesson is designed for an Astronomy or Earth and Space Science course but can be adapted for Physics by emphasizing gravitational calculations in Day 1 and 2. Access to a long hallway or outdoor track is recommended for Day 1."
}`;

// Explicit mapping for common subject names to known CSV filenames
const SUBJECT_FILE_MAP: Record<string, string> = {
  "english language arts": "english",
  "english": "english",
  "ela": "english",
  "math": "mathematics",
  "mathematics": "mathematics",
  "science": "science",
  "social studies": "social-studies",
  "fine arts": "fine-arts",
  "health": "health-education",
  "health education": "health-education",
  "pe": "physical-education",
  "physical education": "physical-education",
  "tech apps": "technology-applications",
  "technology applications": "technology-applications",
  "lote": "languages-other-than-english",
  "languages other than english": "languages-other-than-english",
  "career": "career",
  "cte": "career",
  "career and technical education": "career"
};

const getCsvFilename = (subject: string): string => {
  const normalized = subject.toLowerCase().trim();
  
  // 1. Check explicit map
  if (SUBJECT_FILE_MAP[normalized]) {
    return SUBJECT_FILE_MAP[normalized];
  }

  // 2. Fallback: dashes for spaces
  return normalized.replace(/\s+/g, '-');
};

const App: React.FC = () => {
  const [jsonInput, setJsonInput] = useState(INITIAL_JSON_STRING);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [standardsDb, setStandardsDb] = useState<Record<string, StandardDefinition>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load standards when a lesson plan is successfully parsed
  useEffect(() => {
    if (lessonPlan) {
      setLoading(true);
      
      const filename = getCsvFilename(lessonPlan.subject);
      const path = `CSVs/${filename}.csv`;
      
      console.log(`Attempting to fetch standards from: ${path}`);

      fetch(path)
        .then(res => {
           if(!res.ok) {
             console.warn(`Failed to fetch ${path}, trying generic teks.csv or failing gracefully.`);
             // Fallback generic or simple failure
             return fetch('CSVs/teks.csv');
           }
           return res;
        })
        .then(res => {
          if (!res.ok) throw new Error(`Could not load standards CSV file for subject: ${lessonPlan.subject}`);
          return res.text();
        })
        .then(text => {
          const parsed = parseCSV(text);
          setStandardsDb(parsed);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load CSV:", err);
          // Don't crash, just show empty DB (which will result in red pills)
          setStandardsDb({});
          setLoading(false);
        });
    }
  }, [lessonPlan]);

  const handleVisualize = () => {
    try {
      setError(null);
      const parsed = JSON.parse(jsonInput);
      
      // Basic schema check
      if (!parsed.title || !parsed.activities || !parsed.subject) {
        throw new Error("Invalid JSON: Missing required fields (title, activities, subject)");
      }

      setLessonPlan(parsed);
    } catch (e: any) {
      setError(e.message || "Invalid JSON format");
    }
  };

  const handleBack = () => {
    setLessonPlan(null);
    setStandardsDb({});
    setError(null);
  };

  if (lessonPlan) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-slate-500 font-medium">Loading TEKS Standards for {lessonPlan.subject}...</p>
            <p className="text-xs text-slate-400 mt-2">Looking for CSVs/{getCsvFilename(lessonPlan.subject)}.csv</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-50">
        <LessonPlanView 
          plan={lessonPlan} 
          standardsDb={standardsDb}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          TEKS Lesson Planner
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Paste your lesson plan JSON below to visualize it.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label htmlFor="json-input" className="block text-sm font-medium text-slate-700">
                Lesson Plan JSON
              </label>
              <div className="mt-1">
                <textarea
                  id="json-input"
                  name="json-input"
                  rows={20}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-mono text-xs"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error parsing JSON
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={handleVisualize}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Visualize Lesson Plan
              </button>
            </div>
            
            <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setJsonInput(INITIAL_JSON_STRING)}
                  className="text-sm text-slate-500 hover:text-primary underline"
                >
                    Reset to Example
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
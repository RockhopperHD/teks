import React, { useState, useEffect } from 'react';
import { LessonPlan, StandardDefinition, Activity } from './types';
import ActivityBlock from './components/ActivityBlock';
import StandardPill from './components/StandardPill';
import { parseTSV } from './services/teksData';
import { generateLessonPlan, generateActivity } from './services/gemini';

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
    }
  ],
  "notes": "This lesson is designed for an Astronomy or Earth and Space Science course but can be adapted for Physics by emphasizing gravitational calculations in Day 1 and 2. Access to a long hallway or outdoor track is recommended for Day 1."
}`;

const SUBJECT_OPTIONS = [
  "Science",
  "Math",
  "ELA",
  "SLA"
];

const SUBJECT_PREFIX_MAP: Record<string, string> = {
  "Science": "S",
  "Math": "MATH",
  "ELA": "ELA",
  "SLA": "SLA"
};

const TSV_FILE_PATH = 'csvs/compressed - Copy of combined_master.tsv';

const App: React.FC = () => {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(() => JSON.parse(INITIAL_JSON_STRING));
  const [standardsDb, setStandardsDb] = useState<Record<string, StandardDefinition>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  // Sidebar Inputs
  const [subject, setSubject] = useState<string>('Science');
  const [topic, setTopic] = useState<string>('');
  const [numDays, setNumDays] = useState<number>(3);

  // Load ALL standards from TSV on mount (or when needed)
  useEffect(() => {
    fetch(TSV_FILE_PATH)
      .then(res => {
        if (!res.ok) throw new Error("Could not load standards TSV file");
        return res.text();
      })
      .then(text => {
        const parsed = parseTSV(text);
        setStandardsDb(parsed);
      })
      .catch(err => {
        console.error("Failed to load TSV:", err);
        setStandardsDb({});
      });
  }, []);

  const fetchFilteredStandards = async (subj: string) => {
    try {
      const res = await fetch(TSV_FILE_PATH);
      if (!res.ok) throw new Error("Could not load standards TSV");
      const text = await res.text();

      const prefix = SUBJECT_PREFIX_MAP[subj];
      if (!prefix) return "";

      // Filter lines that start with the prefix
      const lines = text.split('\n');
      const filteredLines = lines.filter(line => line.startsWith(prefix));

      return filteredLines.join('\n');
    } catch (err) {
      console.warn("Failed to load TSV for generation.", err);
      return "";
    }
  };

  const handleGenerateFullPlan = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const csvContent = await fetchFilteredStandards(subject);
      const generatedJson = await generateLessonPlan(subject, topic, csvContent, numDays);
      const parsed = JSON.parse(generatedJson);
      setLessonPlan(parsed);
    } catch (e: any) {
      console.error("Generation failed:", e);
      setError(e.message || "Failed to generate lesson plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSingleActivity = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to generate an activity.");
      return;
    }
    if (!lessonPlan) {
      setError("Please generate or create a lesson plan first.");
      return;
    }

    setActivityLoading(true);
    setError(null);

    try {
      const csvContent = await fetchFilteredStandards(subject);
      const generatedJson = await generateActivity(subject, topic, csvContent);
      const newActivity = JSON.parse(generatedJson);

      setLessonPlan(prev => prev ? {
        ...prev,
        activities: [...prev.activities, newActivity]
      } : null);

    } catch (e: any) {
      console.error("Activity generation failed:", e);
      setError(e.message || "Failed to generate activity.");
    } finally {
      setActivityLoading(false);
    }
  };

  const handleAddBlankActivity = () => {
    if (!lessonPlan) return;
    const blankActivity: Activity = {
      title: "New Activity",
      timeframe: "45 minutes",
      student_will_statement: "Students will...",
      assignment_description: "Description...",
      activity_standards: [],
      evaluation_criteria: {
        score_4_proficient: "",
        score_3_developing: "",
        score_2_beginning: "",
        score_1_not_yet: "",
        score_0_no_participation: ""
      }
    };
    setLessonPlan({
      ...lessonPlan,
      activities: [...lessonPlan.activities, blankActivity]
    });
  };

  const handleUpdateActivity = (index: number, updatedActivity: Activity) => {
    if (!lessonPlan) return;
    const newActivities = [...lessonPlan.activities];
    newActivities[index] = updatedActivity;
    setLessonPlan({ ...lessonPlan, activities: newActivities });
  };

  const handleMoveActivity = (index: number, direction: 'up' | 'down') => {
    if (!lessonPlan) return;
    const newActivities = [...lessonPlan.activities];
    if (direction === 'up' && index > 0) {
      [newActivities[index], newActivities[index - 1]] = [newActivities[index - 1], newActivities[index]];
    } else if (direction === 'down' && index < newActivities.length - 1) {
      [newActivities[index], newActivities[index + 1]] = [newActivities[index + 1], newActivities[index]];
    }
    setLessonPlan({ ...lessonPlan, activities: newActivities });
  };

  const handleDeleteActivity = (index: number) => {
    if (!lessonPlan) return;
    const newActivities = lessonPlan.activities.filter((_, i) => i !== index);
    setLessonPlan({ ...lessonPlan, activities: newActivities });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">

      {/* LEFT SIDEBAR - CONTROLS */}
      <aside className="w-96 bg-white border-r border-slate-200 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">TEKS Planner <span className="text-primary">Builder</span></h1>
          <p className="text-xs text-slate-400 mt-1">AI-Powered Lesson Construction</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8">

          {/* Context Section */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lesson Context</h2>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-sm border-slate-300 focus:ring-primary focus:border-primary rounded-md"
              >
                {SUBJECT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Solar System"
                className="block w-full px-3 py-2 border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
              />
            </div>

            <div>
              <label htmlFor="numDays" className="block text-sm font-medium text-slate-700 mb-1">Sessions / Days</label>
              <input
                type="number"
                id="numDays"
                min="1"
                max="10"
                value={numDays}
                onChange={(e) => setNumDays(parseInt(e.target.value))}
                className="block w-full px-3 py-2 border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Actions Section */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</h2>

            <button
              onClick={handleGenerateFullPlan}
              disabled={loading}
              className={`w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Generating Plan...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span> Generate Full Plan
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleGenerateSingleActivity}
                disabled={activityLoading || !lessonPlan}
                className={`flex items-center justify-center py-2 px-3 border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${activityLoading || !lessonPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {activityLoading ? '...' : '+ AI Activity'}
              </button>
              <button
                onClick={handleAddBlankActivity}
                disabled={!lessonPlan}
                className={`flex items-center justify-center py-2 px-3 border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${!lessonPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                + Blank Activity
              </button>
            </div>
          </section>

          {error && (
            <div className="rounded-md bg-red-50 p-3 border border-red-100">
              <div className="flex">
                <div className="ml-1">
                  <h3 className="text-xs font-medium text-red-800">Error</h3>
                  <div className="mt-1 text-xs text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[10px] text-slate-400">Powered by Google Gemini</p>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT - PREVIEW/BUILDER */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
        {lessonPlan ? (
          <div className="max-w-4xl mx-auto">
            {/* Header Section (Editable? For now just display) */}
            <header className="mb-12 border-b border-slate-200 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs tracking-wide uppercase">
                  {lessonPlan.subject}
                </span>
              </div>

              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
                {lessonPlan.title}
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {lessonPlan.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {lessonPlan.overarching_goals_standards.map(id => (
                  <StandardPill key={id} standardId={id} definition={standardsDb[id]} />
                ))}
              </div>
            </header>

            {/* Activities List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Activities ({lessonPlan.activities.length})</h2>
              </div>

              {lessonPlan.activities.map((activity, index) => (
                <ActivityBlock
                  key={index}
                  index={index}
                  activity={activity}
                  totalActivities={lessonPlan.activities.length}
                  standardsDb={standardsDb}
                  onUpdate={(updated) => handleUpdateActivity(index, updated)}
                  onMoveUp={() => handleMoveActivity(index, 'up')}
                  onMoveDown={() => handleMoveActivity(index, 'down')}
                  onDelete={() => handleDeleteActivity(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <p className="text-lg font-medium">Start by generating a lesson plan on the left.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
import React, { useMemo } from 'react';
import { LessonPlan, StandardDefinition } from '../types';
import ActivityCard from './ActivityCard';
import StandardPill from './StandardPill';

interface LessonPlanViewProps {
  plan: LessonPlan;
  standardsDb: Record<string, StandardDefinition>;
  onBack?: () => void;
}

const LessonPlanView: React.FC<LessonPlanViewProps> = ({ plan, standardsDb, onBack }) => {
  // Check for errors (missing standards)
  const errors = useMemo(() => {
    const missing: string[] = [];
    
    // Check overarching
    plan.overarching_goals_standards.forEach(id => {
      if (!standardsDb[id]) missing.push(id);
    });

    // Check activities
    plan.activities.forEach(act => {
      act.activity_standards.forEach(id => {
        if (!standardsDb[id] && !missing.includes(id)) {
          missing.push(id);
        }
      });
    });

    return missing;
  }, [plan, standardsDb]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 print:px-0 print:py-0">
      
      {/* Navigation for Screen */}
      <div className="no-print mb-6">
        {onBack && (
          <button 
            onClick={onBack}
            className="text-sm text-slate-500 hover:text-primary flex items-center transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Editor
          </button>
        )}
      </div>

      {/* Error Banner */}
      {errors.length > 0 && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm no-print">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Data Error: Standards Not Found
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>The following TEKS IDs could not be resolved in the <strong>{plan.subject}</strong> database:</p>
                <ul className="list-disc list-inside mt-1">
                  {errors.map(err => <li key={err}>{err}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-12 border-b border-slate-200 pb-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-sm tracking-wide uppercase">
              {plan.subject} Unit
            </span>
            <div className="text-slate-400 text-sm font-medium">TEKS Aligned Lesson Plan</div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          {plan.title}
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-4xl mb-8">
          {plan.description}
        </p>

        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Overarching Goals</h3>
            <div className="flex flex-wrap gap-2">
              {plan.overarching_goals_standards.map(id => (
                <StandardPill key={id} standardId={id} definition={standardsDb[id]} />
              ))}
            </div>
          </div>
          
          {plan.notes && (
             <div className="flex-1 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
               <h3 className="text-xs font-bold text-yellow-800 uppercase tracking-widest mb-2 flex items-center">
                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                 </svg>
                 Teacher Notes
               </h3>
               <p className="text-sm text-yellow-900 leading-snug">{plan.notes}</p>
             </div>
          )}
        </div>
      </header>

      {/* Activities List */}
      <main>
        <div className="flex items-center gap-4 mb-8">
           <div className="h-px bg-slate-200 flex-grow"></div>
           <h2 className="text-2xl font-bold text-slate-800">Lesson Activities</h2>
           <div className="h-px bg-slate-200 flex-grow"></div>
        </div>

        <div className="space-y-10">
          {plan.activities.map((activity, index) => (
            <ActivityCard 
              key={index} 
              activity={activity} 
              index={index} 
              standardsDb={standardsDb}
            />
          ))}
        </div>
      </main>

      <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm no-print">
        <p>Generated by TEKS Lesson Planner &bull; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default LessonPlanView;
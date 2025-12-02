import React from 'react';
import { Activity, StandardDefinition } from '../types';
import RubricTable from './RubricTable';
import StandardPill from './StandardPill';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  standardsDb: Record<string, StandardDefinition>;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, index, standardsDb }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 print:shadow-none print:border-slate-300 print:break-inside-avoid">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1 block">Activity {index + 1}</span>
            <h3 className="text-2xl font-bold text-slate-800 leading-tight">{activity.title}</h3>
            <div className="flex items-center mt-2 text-slate-500 text-sm font-medium">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {activity.timeframe}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-start md:justify-end max-w-xs">
            {activity.activity_standards.map(id => (
              <StandardPill 
                key={id} 
                standardId={id} 
                definition={standardsDb[id]}
              />
            ))}
          </div>
        </div>

        <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Student Will
          </h4>
          <p className="text-slate-700 italic">"{activity.student_will_statement}"</p>
        </div>

        <div className="mb-8">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Assignment Description</h4>
          <p className="text-slate-600 leading-relaxed text-base">{activity.assignment_description}</p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Evaluation Criteria</h4>
          <RubricTable rubric={activity.evaluation_criteria} />
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
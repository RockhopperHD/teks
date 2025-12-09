import React, { useState } from 'react';
import { Activity, StandardDefinition } from '../types';
import StandardPill from './StandardPill';
import RubricTable from './RubricTable';

interface ActivityBlockProps {
    activity: Activity;
    index: number;
    totalActivities: number;
    standardsDb: Record<string, StandardDefinition>;
    onUpdate: (updatedActivity: Activity) => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

const ActivityBlock: React.FC<ActivityBlockProps> = ({
    activity,
    index,
    totalActivities,
    standardsDb,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedActivity, setEditedActivity] = useState<Activity>(activity);

    const handleSave = () => {
        onUpdate(editedActivity);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedActivity(activity);
        setIsEditing(false);
    };

    const handleChange = (field: keyof Activity, value: any) => {
        setEditedActivity(prev => ({ ...prev, [field]: value }));
    };

    const handleRubricChange = (field: string, value: string) => {
        setEditedActivity(prev => ({
            ...prev,
            evaluation_criteria: {
                ...prev.evaluation_criteria,
                [field]: value
            }
        }));
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-xl shadow-lg border-2 border-primary/20 mb-8 p-6 relative">
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button onClick={handleSave} className="text-green-600 hover:text-green-800 font-medium text-sm">Save</button>
                    <button onClick={handleCancel} className="text-slate-500 hover:text-slate-700 font-medium text-sm">Cancel</button>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-4">Edit Activity {index + 1}</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                            value={editedActivity.title}
                            onChange={e => handleChange('title', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Timeframe</label>
                        <input
                            type="text"
                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                            value={editedActivity.timeframe}
                            onChange={e => handleChange('timeframe', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Student Will Statement</label>
                        <textarea
                            rows={2}
                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                            value={editedActivity.student_will_statement}
                            onChange={e => handleChange('student_will_statement', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                        <textarea
                            rows={4}
                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                            value={editedActivity.assignment_description}
                            onChange={e => handleChange('assignment_description', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Standards (Comma separated IDs)</label>
                        <input
                            type="text"
                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                            value={editedActivity.activity_standards.join(', ')}
                            onChange={e => handleChange('activity_standards', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        />
                    </div>

                    <div className="border-t border-slate-200 pt-4 mt-4">
                        <h4 className="text-sm font-bold text-slate-700 uppercase mb-3">Rubric</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {Object.entries(editedActivity.evaluation_criteria).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-xs text-slate-500 uppercase mb-1">{key.replace('score_', '').replace(/_/g, ' ')}</label>
                                    <textarea
                                        rows={2}
                                        className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-xs"
                                        value={val as string}
                                        onChange={e => handleRubricChange(key, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 relative group hover:shadow-md transition-shadow">
            {/* Controls */}
            <div className="absolute top-2 -right-12 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-white text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full shadow-sm border border-slate-200 transition-colors"
                    title="Edit"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button
                    onClick={onMoveUp}
                    disabled={index === 0}
                    className={`p-2 bg-white rounded-full shadow-sm border border-slate-200 transition-colors ${index === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                    title="Move Up"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                </button>
                <button
                    onClick={onMoveDown}
                    disabled={index === totalActivities - 1}
                    className={`p-2 bg-white rounded-full shadow-sm border border-slate-200 transition-colors ${index === totalActivities - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                    title="Move Down"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full shadow-sm border border-slate-200 transition-colors"
                    title="Delete"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>

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

                {activity.ainara_activities && activity.ainara_activities.length > 0 && (
                    <div className="mb-8 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-wide mb-3 flex items-center">
                            <span className="mr-2">✨</span> Suggested AINARA Activities
                        </h4>
                        <div className="space-y-3">
                            {activity.ainara_activities.map((ainara, idx) => (
                                <div key={idx} className="bg-white p-3 rounded border border-indigo-100 shadow-sm">
                                    <h5 className="font-semibold text-indigo-900 text-sm mb-1">{ainara.title}</h5>
                                    <p className="text-slate-600 text-sm">{ainara.rationale}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rubric Preview (Collapsed or Simplified?) - Let's keep it full for now but maybe styled simpler */}
                <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Evaluation Criteria</h4>
                    <RubricTable rubric={activity.evaluation_criteria} />
                </div>
            </div>
        </div>
    );
};

export default ActivityBlock;

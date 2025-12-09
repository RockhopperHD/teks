import React from 'react';
import { StandardDefinition } from '../types';

interface StandardPillProps {
  standardId: string;
  definition?: StandardDefinition;
}

const StandardPill: React.FC<StandardPillProps> = ({ standardId, definition }) => {
  const isValid = !!definition;

  return (
    <div className="group/pill relative inline-flex flex-col items-center">
      <span
        className={`
          cursor-help
          px-2 py-1 rounded-full text-xs font-semibold tracking-wide uppercase
          border transition-colors duration-200
          ${!isValid
            ? 'bg-red-100 text-red-800 border-red-200'
            : 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200 hover:border-indigo-300'}
        `}
      >
        {standardId}
        {!isValid && <span className="ml-1 text-red-600 font-bold">!</span>}
      </span>

      {isValid && (
        <div className="opacity-0 group-hover/pill:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none">
          <div className="font-bold mb-1 text-slate-300 border-b border-slate-600 pb-1 flex justify-between items-center">
            <span>{standardId}</span>
            <div className="flex items-center space-x-2">
              {definition.isFolder && (
                <span className="bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider border border-slate-600">
                  Folder
                </span>
              )}
              <span className="font-normal opacity-75 text-[10px]">{definition.category}</span>
            </div>
          </div>
          <p className="leading-relaxed text-slate-100">{definition.description}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};

export default StandardPill;
import React from 'react';
import { Rubric } from '../types';

interface RubricTableProps {
  rubric: Rubric;
}

const RubricTable: React.FC<RubricTableProps> = ({ rubric }) => {
  const rows = [
    { score: '4 - Proficient', desc: rubric.score_4_proficient, color: 'bg-green-50 border-green-200 text-green-900' },
    { score: '3 - Developing', desc: rubric.score_3_developing, color: 'bg-blue-50 border-blue-200 text-blue-900' },
    { score: '2 - Beginning', desc: rubric.score_2_beginning, color: 'bg-yellow-50 border-yellow-200 text-yellow-900' },
    { score: '1 - Not Yet', desc: rubric.score_1_not_yet, color: 'bg-orange-50 border-orange-200 text-orange-900' },
    { score: '0 - No Participation', desc: rubric.score_0_no_participation, color: 'bg-red-50 border-red-200 text-red-900' },
  ];

  return (
    <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm mt-4">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600 w-1/4 uppercase tracking-wider text-xs">Score</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider text-xs">Criteria</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.map((row) => (
            <tr key={row.score}>
              <td className={`px-4 py-3 font-medium whitespace-nowrap ${row.color} border-l-4`}>
                {row.score}
              </td>
              <td className="px-4 py-3 text-slate-600 leading-relaxed">
                {row.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RubricTable;
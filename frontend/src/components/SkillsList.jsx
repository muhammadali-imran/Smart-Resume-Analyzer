import React from 'react';
import { Check, X } from 'lucide-react';

const SkillsList = ({ relevantSkills, missingSkills }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-green-50/50 rounded-xl p-5 border border-green-100">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <span className="bg-green-100 p-1 rounded-full"><Check size={14} /></span>
                    Matched Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                    {relevantSkills && relevantSkills.map((skill, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-white text-green-700 border border-green-200 rounded-full text-sm font-medium shadow-sm"
                        >
                            {skill}
                        </span>
                    ))}
                    {(!relevantSkills || relevantSkills.length === 0) && (
                        <p className="text-sm text-green-600 italic">No exact matches found yet.</p>
                    )}
                </div>
            </div>

            <div className="bg-red-50/50 rounded-xl p-5 border border-red-100">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <span className="bg-red-100 p-1 rounded-full"><X size={14} /></span>
                    Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                    {missingSkills && missingSkills.map((skill, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-white text-red-700 border border-red-200 rounded-full text-sm font-medium shadow-sm opacity-75"
                        >
                            {skill}
                        </span>
                    ))}
                    {(!missingSkills || missingSkills.length === 0) && (
                        <p className="text-sm text-red-600 italic">No missing critical skills detected.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillsList;

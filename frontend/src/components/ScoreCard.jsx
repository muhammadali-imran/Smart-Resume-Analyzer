import React from 'react';
import classNames from 'classnames';

const ScoreCard = ({ score, overallFit }) => {

    const getGradient = (score) => {
        if (score >= 80) return 'from-green-500 to-emerald-600';
        if (score >= 60) return 'from-orange-400 to-amber-500';
        return 'from-red-500 to-rose-600';
    };

    const getColor = (fit) => {
        switch (fit?.toLowerCase()) {
            case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
            case 'good': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default: return 'text-red-600 bg-red-50 border-red-200';
        }
    };

    return (
        <div className="card p-8 text-center relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getGradient(score)}`} />

            <div className="relative z-10">
                <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4">
                    Match Score
                </h3>

                <div className="flex items-center justify-center mb-6">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${getGradient(score)} shadow-xl transform group-hover:scale-105 transition-transform duration-500`}>
                        <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
                            <span className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br ${getGradient(score)}`}>
                                {Math.round(score)}
                            </span>
                            <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                                Percent
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border capitalize ${getColor(overallFit)}`}>
                        {overallFit} Fit
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ScoreCard;

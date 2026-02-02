import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const JobCard = ({ job, onViewDetails }) => {
    return (
        <div className="card hover:border-primary/50 group cursor-pointer flex flex-col h-full bg-white transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
                        {job.title}
                    </h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1 gap-4">
                        <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(job.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex-1">
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                    {job.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {job.required_skills.split(',').slice(0, 3).map((skill, index) => (
                        <span
                            key={index}
                            className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                        >
                            {skill.trim()}
                        </span>
                    ))}
                    {job.required_skills.split(',').length > 3 && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                            +{job.required_skills.split(',').length - 3} more
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={() => onViewDetails(job)}
                className="w-full btn btn-secondary group-hover:border-primary group-hover:text-primary gap-2"
            >
                View Details
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
};

export default JobCard;

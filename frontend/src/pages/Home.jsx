import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';
import Modal from '../components/Modal';
import { Briefcase, Loader2, MapPin, CheckCircle2 } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getJobs();
            setJobs(data);
        } catch (err) {
            setError('Failed to load jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (job) => {
        navigate('/evaluate', { state: { selectedJob: job } });
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mr-2" />
                Loading jobs...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center py-20">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="mb-10 text-center max-w-2xl mx-auto pt-8">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Find Your Perfect Match
                </h1>
                <p className="text-slate-600 text-lg">
                    Upload your resume and let our AI analyze your fit for top positions instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onViewDetails={setSelectedJob}
                    />
                ))}
                {jobs.length === 0 && (
                    <div className="col-span-full text-center py-20 text-slate-400">
                        No jobs found.
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!selectedJob}
                onClose={() => setSelectedJob(null)}
                title={selectedJob?.title}
            >
                {selectedJob && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-slate-500 pb-4 border-b border-slate-100">
                            <MapPin size={18} />
                            <span>{selectedJob.location}</span>
                            <span className="mx-2">•</span>
                            <span>Posted {new Date(selectedJob.created_at).toLocaleDateString()}</span>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3 text-lg">About the Role</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {selectedJob.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3 text-lg">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedJob.required_skills.split(',').map((skill, index) => (
                                    <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                        <CheckCircle2 size={14} />
                                        {skill.trim()}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <button
                                onClick={() => handleApply(selectedJob)}
                                className="btn btn-primary flex-1 text-base py-3"
                            >
                                Apply for this Position
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Home;

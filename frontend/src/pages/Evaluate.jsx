import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getJobs, evaluateResume } from '../services/api';
import EvaluationForm from '../components/EvaluationForm';
import ScoreCard from '../components/ScoreCard';
import SkillsList from '../components/SkillsList';
import { Sparkles, AlertCircle } from 'lucide-react';

const Evaluate = () => {
    const location = useLocation();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Pre-select job passed from Home page via navigation state
    const selectedJob = location.state?.selectedJob;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (err) {
                console.error('Failed to load jobs');
            }
        };
        fetchJobs();
    }, []);

    const handleEvaluation = async (formData) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await evaluateResume(formData);
            setResult(data);
            // Scroll to results on mobile
            if (window.innerWidth < 768) {
                setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } catch (err) {
            setError('Evaluation failed. Please check your file and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Form */}
                <div className="lg:col-span-5 space-y-6">
                    <EvaluationForm
                        jobs={jobs}
                        selectedJob={selectedJob}
                        onSubmit={handleEvaluation}
                        loading={loading}
                    />
                </div>

                {/* Right Column: Results */}
                <div id="results-section" className="lg:col-span-7 space-y-6">
                    {!result && !loading && !error && (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <Sparkles className="text-blue-400" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Ready to Analyze</h3>
                            <p className="text-slate-500 max-w-sm">
                                Select a job and upload a resume to see a detailed skills gap analysis and compatibility score.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg flex items-center gap-3">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Score Card */}
                                <div className="md:col-span-1">
                                    <ScoreCard score={result.score} overallFit={result.overall_fit} />
                                </div>

                                {/* Feedback Summary */}
                                <div className="card p-6 md:col-span-1 flex flex-col justify-center bg-blue-50/30 border-blue-100">
                                    <h4 className="font-semibold text-slate-800 mb-3">AI Analysis</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed italic">
                                        "{result.feedback.split('\n')[0]}..."
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-blue-100/50">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Evaluation Method</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            <span className="text-sm font-medium text-slate-700">
                                                {result.structured_assessment?.heuristic_score ? 'Hybrid Scoring' : 'AI Analysis'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills List */}
                            <div className="card">
                                <h3 className="text-lg font-bold text-slate-800 px-6 pt-6">Skills Breakdown</h3>
                                <div className="px-6 pb-6">
                                    <SkillsList
                                        relevantSkills={result.relevant_skills}
                                        missingSkills={result.missing_skills}
                                    />
                                </div>
                            </div>

                            {/* Detailed Feedback */}
                            <div className="card p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Detailed Feedback</h3>
                                <div className="prose prose-sm text-slate-600 max-w-none">
                                    <p className="whitespace-pre-line">{result.feedback}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Evaluate;

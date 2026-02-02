import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check } from 'lucide-react';

const EvaluationForm = ({ jobs, selectedJob, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        candidate_name: '',
        candidate_email: '',
        job_id: selectedJob?.id || '',
        job_description: '',
        file: null
    });

    // Update form if selectedJob changes prop update
    useEffect(() => {
        if (selectedJob) {
            setFormData(prev => ({ ...prev, job_id: selectedJob.id }));
        }
    }, [selectedJob]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData(prev => ({ ...prev, file: e.target.files[0] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('candidate_name', formData.candidate_name);
        data.append('candidate_email', formData.candidate_email);
        data.append('resume', formData.file);

        if (formData.job_id) {
            data.append('job_id', formData.job_id);
        } else {
            data.append('job_description', formData.job_description);
        }

        onSubmit(data);
    };

    return (
        <div className="card">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
                Resume Evaluation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Candidate Name</label>
                        <input
                            type="text"
                            name="candidate_name"
                            required
                            className="form-control"
                            placeholder="John Doe"
                            value={formData.candidate_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="candidate_email"
                            required
                            className="form-control"
                            placeholder="john@example.com"
                            value={formData.candidate_email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Select Position</label>
                    <select
                        name="job_id"
                        className="form-control"
                        value={formData.job_id}
                        onChange={handleChange}
                    >
                        <option value="">-- Generic Evaluation (Paste Description) --</option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id}>
                                {job.title} - {job.location}
                            </option>
                        ))}
                    </select>
                </div>

                {!formData.job_id && (
                    <div className="form-group fade-in">
                        <label className="form-label">Job Description</label>
                        <textarea
                            name="job_description"
                            className="form-control"
                            rows="4"
                            placeholder="Paste the job description and requirements here..."
                            value={formData.job_description}
                            onChange={handleChange}
                            required={!formData.job_id}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">Upload Resume</label>
                    <div className="relative">
                        <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                            required
                        />
                        <label
                            htmlFor="resume-upload"
                            className={`file-upload block ${formData.file ? 'border-primary bg-blue-50/50' : ''}`}
                        >
                            <div className="flex flex-col items-center gap-3">
                                {formData.file ? (
                                    <>
                                        <div className="bg-blue-100 p-3 rounded-full text-primary">
                                            <FileText size={32} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{formData.file.name}</p>
                                            <p className="text-sm text-slate-500">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-slate-100 p-3 rounded-full text-slate-400">
                                            <Upload size={32} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">Click to upload or drag and drop</p>
                                            <p className="text-sm text-slate-500">PDF, DOCX, TXT or Images</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.file}
                    className="btn btn-primary w-full py-3 text-base shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Analyzing...' : 'Evaluate Resume'}
                </button>
            </form>
        </div>
    );
};

export default EvaluationForm;

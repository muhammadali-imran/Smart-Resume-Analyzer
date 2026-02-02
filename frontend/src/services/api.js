import axios from 'axios';

const api = axios.create({
    baseURL: '/main/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getJobs = async () => {
    try {
        const response = await api.get('/jobs/');
        return response.data.jobs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const applyJob = async (jobId, formData) => {
    try {
        const response = await api.post(`/jobs/${jobId}/apply/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error applying for job:', error);
        throw error;
    }
};

export const evaluateResume = async (formData) => {
    try {
        const response = await api.post('/evaluate_resume/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error evaluating resume:', error);
        throw error;
    }
};

export default api;

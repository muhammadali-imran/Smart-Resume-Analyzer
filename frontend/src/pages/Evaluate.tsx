import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, RefreshCw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import ScoreCard from "@/components/ScoreCard";
import SkillsList from "@/components/SkillsList";
import { getJobs, evaluateResume } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/components/JobCard";

interface EvaluationResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  feedback?: string;
}

const Evaluate = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const { toast } = useToast();

  // Load jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data || []);
      } catch (error) {
        console.error("Failed to load jobs", error);
      }
    };
    fetchJobs();
  }, []);

  // Handle URL param for job pre-selection
  useEffect(() => {
    const jobIdParam = searchParams.get("jobId");
    if (jobIdParam) {
      setSelectedJobId(jobIdParam);
    }
  }, [searchParams]);

  const selectedJob = jobs.find((job) => job.id.toString() === selectedJobId);

  const handleEvaluation = async () => {
    if (!name || !email || !selectedJobId || !file) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and upload your resume.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_id", selectedJobId);
      formData.append("candidate_name", name);
      formData.append("candidate_email", email);

      const data = await evaluateResume(formData);

      setResult({
        score: data.score,
        matchedSkills: data.relevant_skills || [],
        missingSkills: data.missing_skills || [],
        feedback: data.feedback
      });

      toast({
        title: "Evaluation Complete!",
        description: `Your resume has been analyzed for ${selectedJob?.title || "the position"}.`,
      });
    } catch (error) {
      toast({
        title: "Evaluation Failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setSelectedJobId("");
    setFile(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-2">Evaluate Your Resume</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Upload your resume and select a job to get instant AI-powered feedback
              on your skill match and areas for improvement.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Your Information</h2>

              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Job Selection */}
                <div className="space-y-2">
                  <Label>Select Job Position</Label>
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose a job to apply for" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id.toString()}>
                          {job.title} - {job.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Upload Resume</Label>
                  <FileUpload onFileSelect={setFile} />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleEvaluation}
                    disabled={isLoading || !name || !email || !selectedJobId || !file}
                    className="flex-1 h-12 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Evaluate Resume
                      </>
                    )}
                  </Button>
                  {result && (
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="h-12 gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass-card p-8 flex flex-col items-center justify-center h-full min-h-[400px]"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-6">
                      <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Analyzing Your Resume</h3>
                    <p className="text-muted-foreground text-center">
                      Our AI is comparing your skills and experience with the job requirements...
                    </p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    <ScoreCard score={result.score} />
                    <SkillsList
                      matchedSkills={result.matchedSkills}
                      missingSkills={result.missingSkills}
                    />
                    {selectedJob && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6"
                      >
                        <h3 className="font-semibold mb-2">Evaluated For</h3>
                        <p className="text-muted-foreground">
                          {selectedJob.title} at {selectedJob.company}
                        </p>
                      </motion.div>
                    )}
                    {/* Feedback display */}
                    {result.feedback && (
                      <div className="glass-card p-6 mt-4">
                        <h3 className="font-semibold mb-2">Detailed Feedback</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.feedback}</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-8 flex flex-col items-center justify-center h-full min-h-[400px]"
                  >
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                      <Send className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Evaluate</h3>
                    <p className="text-muted-foreground text-center max-w-sm">
                      Fill in your details, select a job, and upload your resume to get
                      personalized feedback and skill matching analysis.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Evaluate;

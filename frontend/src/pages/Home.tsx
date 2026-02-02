import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, FileText, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import JobCard, { Job } from "@/components/JobCard";
import JobModal from "@/components/JobModal";
import { mockJobs } from "@/data/mockJobs";
import { useState } from "react";

const Home = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const featuredJobs = mockJobs.slice(0, 3);

  const features = [
    {
      icon: FileText,
      title: "Smart Resume Parsing",
      description: "AI-powered analysis extracts skills and experience from any resume format"
    },
    {
      icon: Target,
      title: "Skill Matching",
      description: "Compare your qualifications against job requirements instantly"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get actionable insights to improve your resume in seconds"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Analysis
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Land Your{" "}
              <span className="gradient-text">Dream Job</span>
              <br />
              With Confidence
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your resume, select a job, and get instant AI-powered feedback 
              on how well you match. Improve your chances of getting hired.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/evaluate">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6 rounded-xl shadow-glow"
                >
                  Evaluate My Resume
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl"
                >
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mt-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Jobs</h2>
              <p className="text-muted-foreground">Discover opportunities that match your skills</p>
            </div>
            <Link to="/jobs">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                index={index}
                onClick={() => setSelectedJob(job)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />
            <div className="relative px-8 py-16 text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Stand Out?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                Get personalized insights and improve your resume to match your dream job requirements.
              </p>
              <Link to="/evaluate">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 text-lg px-8 py-6 rounded-xl bg-background text-foreground hover:bg-background/90"
                >
                  Start Your Evaluation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <JobModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};

export default Home;

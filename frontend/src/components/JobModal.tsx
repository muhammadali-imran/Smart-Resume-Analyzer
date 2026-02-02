import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Briefcase, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "./JobCard";

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: (jobId: number) => void;
}

const JobModal = ({ job, isOpen, onClose, onApply }: JobModalProps) => {
  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] z-50 glass-card overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{job.title}</h2>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.type}
                </div>
                <span className="text-xs">{job.postedAt}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 text-foreground">Job Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {job.description || 
                    `We are looking for a talented ${job.title} to join our team at ${job.company}. 
                    This is an exciting opportunity to work on cutting-edge projects and grow your career 
                    in a dynamic environment. You'll collaborate with cross-functional teams to deliver 
                    high-quality solutions that make a real impact.`}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Required Skills</h3>
                <div className="grid grid-cols-2 gap-2">
                  {job.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={() => onApply?.(job.id)}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JobModal;

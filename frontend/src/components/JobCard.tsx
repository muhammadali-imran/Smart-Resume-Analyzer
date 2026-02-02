import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
  postedAt: string;
  description?: string;
}

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  index?: number;
}

const JobCard = ({ job, onClick, index = 0 }: JobCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-6 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
        </div>
        <motion.div
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {job.type}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 4).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20 border-0"
          >
            {skill}
          </Badge>
        ))}
        {job.skills.length > 4 && (
          <Badge variant="outline" className="text-muted-foreground">
            +{job.skills.length - 4} more
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{job.postedAt}</span>
        <Button
          size="sm"
          variant="ghost"
          className="text-primary hover:text-primary-foreground hover:bg-primary"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export default JobCard;

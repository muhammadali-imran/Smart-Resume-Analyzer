import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface SkillsListProps {
  matchedSkills: string[];
  missingSkills: string[];
}

const SkillsList = ({ matchedSkills, missingSkills }: SkillsListProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Matched Skills */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <h3 className="font-semibold text-lg">Matched Skills</h3>
          <span className="ml-auto text-sm text-muted-foreground">
            {matchedSkills.length} found
          </span>
        </div>

        <div className="space-y-2">
          {matchedSkills.length > 0 ? (
            matchedSkills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20"
              >
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm font-medium">{skill}</span>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-muted text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">No matching skills found</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Missing Skills */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="font-semibold text-lg">Skills to Improve</h3>
          <span className="ml-auto text-sm text-muted-foreground">
            {missingSkills.length} suggested
          </span>
        </div>

        <div className="space-y-2">
          {missingSkills.length > 0 ? (
            missingSkills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
              >
                <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                <span className="text-sm font-medium">{skill}</span>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-success/10 text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">All required skills matched!</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SkillsList;

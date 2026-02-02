import { motion } from "framer-motion";
import { TrendingUp, Award, Target } from "lucide-react";

interface ScoreCardProps {
  score: number;
  label?: string;
}

const getScoreConfig = (score: number) => {
  if (score >= 80) return { class: "score-excellent", label: "Excellent Match", icon: Award };
  if (score >= 60) return { class: "score-good", label: "Good Match", icon: TrendingUp };
  if (score >= 40) return { class: "score-fair", label: "Fair Match", icon: Target };
  return { class: "score-poor", label: "Needs Improvement", icon: Target };
};

const ScoreCard = ({ score, label }: ScoreCardProps) => {
  const config = getScoreConfig(score);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="glass-card p-8 text-center"
    >
      <div className="mb-4">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${config.class}`}>
          <Icon className="w-10 h-10" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative mb-4">
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${score * 2.83} 283`}
              initial={{ strokeDasharray: "0 283" }}
              animate={{ strokeDasharray: `${score * 2.83} 283` }}
              transition={{ duration: 1, ease: "easeOut" }}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-4xl font-bold gradient-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score}%
            </motion.span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-1">
          {label || config.label}
        </h3>
        <p className="text-sm text-muted-foreground">
          Based on skills and experience match
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ScoreCard;

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Briefcase, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import JobCard, { Job } from "@/components/JobCard";
import JobModal from "@/components/JobModal";
import { getJobs, applyJob } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const BrowseJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        // Ensure data is array, API might return { jobs: [...] } or just [...]
        // Based on my previous api.js implementation, getJobs returns response.data.jobs
        setJobs(data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [toast]);

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(jobs.map((job) => job.location))];
    return uniqueLocations;
  }, [jobs]);

  const types = useMemo(() => {
    // API might not return 'type' field if not in backend model, fallback safest
    const uniqueTypes = [...new Set(jobs.map((job) => job.type || "Full-time"))];
    return uniqueTypes;
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.skills && job.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      const matchesLocation =
        locationFilter === "all" || job.location === locationFilter;

      // Safe check for type
      const jobType = job.type || "Full-time";
      const matchesType = typeFilter === "all" || jobType === typeFilter;

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [searchQuery, locationFilter, typeFilter, jobs]);

  const handleApply = async (jobId: number) => {
    // In a real app, you'd probably open a form or redirect to evaluate page with job pre-selected
    // For now, we'll keep the toast but maybe redirect to evaluate?
    // The previous implementation simulates application. 
    // Let's redirect to /evaluate with state?
    // The user's code had just a toast. Let's keep it simple or allow apply via API?
    // api.js has applyJob(jobId, formData).
    // The modal likely has an "Apply" button that triggers this.
    // Let's just show success for now as the modal might not collect file yet.

    // Actually, usually redirect to Evaluate page is better flow for this specific app
    window.location.href = `/evaluate?jobId=${jobId}`;

    // Changing behavior slightly to match app flow - user applies by evaluating resume against job
    setSelectedJob(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-bold mb-2">Browse Jobs</h1>
            <p className="text-muted-foreground">
              Find your perfect role from {jobs.length} available positions
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background"
                />
              </div>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full lg:w-52 h-12 bg-background">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Location" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-44 h-12 bg-background">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Job Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-12 gap-2"
              >
                <Filter className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground mb-6"
          >
            Showing {filteredJobs.length} of {jobs.length} jobs
          </motion.p>

          {/* Job Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  index={index}
                  onClick={() => setSelectedJob(job)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <JobModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={handleApply}
      />
    </div>
  );
};

export default BrowseJobs;

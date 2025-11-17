import { useState, useMemo } from "react";
import { JobSidebar } from "@/components/JobSidebar";
import { JobHeader } from "@/components/JobHeader";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/JobCard";
import { jobsData } from "@/data/jobsData";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    province: "All Provinsi",
    branch: "All Cabang",
    position: "All Posisi",
  });

  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      const matchProvince =
        filters.province === "All Provinsi" || job.province === filters.province;
      const matchBranch =
        filters.branch === "All Cabang" || job.branch === filters.branch;
      const matchPosition =
        filters.position === "All Posisi" || job.position === filters.position;

      return matchProvince && matchBranch && matchPosition;
    });
  }, [filters]);

  const handleJobDetail = (jobId: string) => {
    toast({
      title: "Job Details",
      description: `Viewing details for job ${jobId}`,
    });
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <JobSidebar />

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
        <JobHeader userName="Candidate" />

        <main className="flex-1 p-6 space-y-8">
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* Job Board Section */}
          <section className="space-y-6">
            {/* Section Header with Green Indicator */}
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="h-8 w-1.5 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">Job Board</h2>
            </div>

            {/* Filters */}
            <JobFilters onFilterChange={setFilters} />

            {/* Results Count */}
            <div className="flex items-center justify-between animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> opportunities
              </p>
              {filters.province !== "All Provinsi" && (
                <p className="text-sm text-primary font-medium">
                  Filtered by: {filters.province}
                  {filters.branch !== "All Cabang" && ` → ${filters.branch}`}
                  {filters.position !== "All Posisi" && ` → ${filters.position}`}
                </p>
              )}
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <JobCard
                      position={job.position}
                      branch={job.branch}
                      location={job.location}
                      province={job.province}
                      type={job.type}
                      onDetail={() => handleJobDetail(job.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                  <div className="w-24 h-24 mb-4 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Jobs Found
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    No positions match your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;

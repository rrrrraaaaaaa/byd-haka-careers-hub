import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import TopNav from "@/components/TopNav";
import FilterSidebar from "@/components/FilterSidebar";
import JobHeader from "@/components/JobHeader";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { JobCard } from "@/components/JobCard";
import { JobDetail } from "@/components/JobDetail";
import { jobsData } from "@/data/jobsData";
import { useToast } from "@/hooks/use-toast";
import { Briefcase } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    province: "All Provinces",
    branch: "All Branches",
    position: "All Positions",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      const matchProvince =
        filters.province === "All Provinces" || job.province === filters.province;
      const matchBranch =
        filters.branch === "All Branches" || job.branch === filters.branch;
      const matchPosition =
        filters.position === "All Positions" || job.position === filters.position;

      return matchProvince && matchBranch && matchPosition;
    });
  }, [filters]);

  const handleJobDetail = (jobId: string) => {
    setSelectedJob(jobId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
  };

  const handleApply = () => {
    toast({
      title: "Apply for Position",
      description: "Redirecting to application form...",
    });
    // Navigate to application form page
    navigate("/application-form");
  };

  const selectedJobData = selectedJob 
    ? jobsData.find(job => job.id === selectedJob)
    : null;

  // All 34 Indonesian provinces
  const provinces = [
    "Aceh",
    "Bali",
    "Banten",
    "Bengkulu",
    "DI Yogyakarta",
    "DKI Jakarta",
    "Gorontalo",
    "Jambi",
    "Jawa Barat",
    "Jawa Tengah",
    "Jawa Timur",
    "Kalimantan Barat",
    "Kalimantan Selatan",
    "Kalimantan Tengah",
    "Kalimantan Timur",
    "Kalimantan Utara",
    "Kepulauan Bangka Belitung",
    "Kepulauan Riau",
    "Lampung",
    "Maluku",
    "Maluku Utara",
    "Nusa Tenggara Barat",
    "Nusa Tenggara Timur",
    "Papua",
    "Papua Barat",
    "Papua Barat Daya",
    "Papua Pegunungan",
    "Papua Selatan",
    "Papua Tengah",
    "Riau",
    "Sulawesi Barat",
    "Sulawesi Selatan",
    "Sulawesi Tengah",
    "Sulawesi Tenggara",
    "Sulawesi Utara",
    "Sumatera Barat",
    "Sumatera Selatan",
    "Sumatera Utara"
  ];
  const branches = useMemo(() => {
    if (filters.province === "All Provinces") {
      return Array.from(new Set(jobsData.map((job) => job.branch))).sort();
    }
    return Array.from(
      new Set(
        jobsData
          .filter((job) => job.province === filters.province)
          .map((job) => job.branch)
      )
    ).sort();
  }, [filters.province]);

  const positions = Array.from(new Set(jobsData.map((job) => job.position))).sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav isPublic={false} />

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Filters - Sticky */}
        <div className="hidden lg:block lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <FilterSidebar
            selectedProvince={filters.province}
            selectedBranch={filters.branch}
            selectedPosition={filters.position}
            onProvinceChange={(value) => setFilters({ ...filters, province: value, branch: "All Branches" })}
            onBranchChange={(value) => setFilters({ ...filters, branch: value })}
            onPositionChange={(value) => setFilters({ ...filters, position: value })}
            provinces={provinces}
            branches={branches}
            positions={positions}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {!selectedJob && (
              <>
                {/* Header */}
                <JobHeader />

                {/* Welcome Banner */}
                <WelcomeBanner />
              </>
            )}

            {/* Show Job Detail or Job List */}
            {selectedJob && selectedJobData ? (
              <JobDetail
                position={selectedJobData.position}
                branch={selectedJobData.branch}
                location={selectedJobData.location}
                onBack={handleBackToJobs}
                onApply={handleApply}
              />
            ) : (
              <>
                {/* Mobile Filters */}
                <div className="lg:hidden space-y-4 p-4 bg-card rounded-lg border animate-fade-in">
                  <h3 className="font-semibold text-base sm:text-lg mb-4">Filter Jobs</h3>
                  <FilterSidebar
                    selectedProvince={filters.province}
                    selectedBranch={filters.branch}
                    selectedPosition={filters.position}
                    onProvinceChange={(value) => setFilters({ ...filters, province: value, branch: "All Branches" })}
                    onBranchChange={(value) => setFilters({ ...filters, branch: value })}
                    onPositionChange={(value) => setFilters({ ...filters, position: value })}
                    provinces={provinces}
                    branches={branches}
                    positions={positions}
                  />
                </div>

                {/* Job Board Section */}
                <section className="space-y-4 sm:space-y-6">
                  {/* Section Header with Green Indicator */}
                  <div className="flex items-center gap-3 animate-fade-in">
                    <div className="h-6 sm:h-8 w-1 sm:w-1.5 bg-byd-green rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Job Board</h2>
                  </div>

                  {/* Results Count */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fade-in">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> opportunities
                    </p>
                    {filters.province !== "All Provinces" && (
                      <p className="text-xs sm:text-sm text-primary font-medium">
                        Filtered by: {filters.province}
                        {filters.branch !== "All Branches" && ` → ${filters.branch}`}
                        {filters.position !== "All Positions" && ` → ${filters.position}`}
                      </p>
                    )}
                  </div>

                  {/* Job Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                      <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 text-center animate-fade-in">
                        <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">
                          No jobs found
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          Try changing your filters to see other positions
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
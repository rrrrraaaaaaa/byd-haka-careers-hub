import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import TopNav from "@/components/TopNav";
import FilterSidebar from "@/components/FilterSidebar";
import { JobHeader } from "@/components/JobHeader";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { JobCard } from "@/components/JobCard";
import { jobsData } from "@/data/jobsData";
import { useToast } from "@/hooks/use-toast";
import { Briefcase } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    province: "All Provinsi",
    branch: "All Cabang",
    position: "All Posisi",
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

  const provinces = Array.from(new Set(jobsData.map((job) => job.province))).sort();
  const branches = useMemo(() => {
    if (filters.province === "All Provinsi") {
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
      {/* Top Navigation */}
      <TopNav />

      <div className="flex">
        {/* Left Sidebar - Filters - Sticky */}
        <div className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <FilterSidebar
            selectedProvince={filters.province}
            selectedBranch={filters.branch}
            selectedPosition={filters.position}
            onProvinceChange={(value) => setFilters({ ...filters, province: value, branch: "All Cabang" })}
            onBranchChange={(value) => setFilters({ ...filters, branch: value })}
            onPositionChange={(value) => setFilters({ ...filters, position: value })}
            provinces={provinces}
            branches={branches}
            positions={positions}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <JobHeader userName="Candidate" />

            {/* Welcome Banner */}
            <WelcomeBanner />

            {/* Mobile Filters */}
            <div className="md:hidden space-y-4 p-4 bg-card rounded-lg border animate-fade-in">
              <h3 className="font-semibold text-lg mb-4">Filter Lowongan</h3>
              <FilterSidebar
                selectedProvince={filters.province}
                selectedBranch={filters.branch}
                selectedPosition={filters.position}
                onProvinceChange={(value) => setFilters({ ...filters, province: value, branch: "All Cabang" })}
                onBranchChange={(value) => setFilters({ ...filters, branch: value })}
                onPositionChange={(value) => setFilters({ ...filters, position: value })}
                provinces={provinces}
                branches={branches}
                positions={positions}
              />
            </div>

            {/* Job Board Section */}
            <section className="space-y-6">
              {/* Section Header with Green Indicator */}
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="h-8 w-1.5 bg-byd-green rounded-full" />
                <h2 className="text-2xl font-bold text-foreground">Job Board</h2>
              </div>

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
                    <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                      Tidak ada lowongan ditemukan
                    </h3>
                    <p className="text-muted-foreground">
                      Coba ubah filter untuk melihat lowongan lainnya
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

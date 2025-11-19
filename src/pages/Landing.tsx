import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import FilterSidebar from "@/components/FilterSidebar";
import TopNav from "@/components/TopNav";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { JobHeader } from "@/components/JobHeader";
import { jobsData } from "@/data/jobsData";
import { Briefcase } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    province: "All Provinsi",
    branch: "All Cabang",
    position: "All Posisi",
  });

  // Filter only open jobs
  const openJobs = useMemo(() => {
    return jobsData.filter(job => job.isOpen === true);
  }, []);

  // Apply filters to open jobs
  const filteredJobs = useMemo(() => {
    return openJobs.filter((job) => {
      const provinceMatch = filters.province === "All Provinsi" || job.province === filters.province;
      const branchMatch = filters.branch === "All Cabang" || job.branch === filters.branch;
      const positionMatch = filters.position === "All Posisi" || job.position === filters.position;
      return provinceMatch && branchMatch && positionMatch;
    });
  }, [openJobs, filters]);

  const handleFilterChange = (newFilters: { province: string; branch: string; position: string }) => {
    setFilters(newFilters);
  };

  const handleJobDetail = (jobId: string) => {
    // Redirect to auth page with intended job
    navigate(`/auth?redirect=/job/${jobId}`);
  };

  // Get unique values for filters from open jobs only
  const provinces = Array.from(new Set(openJobs.map((job) => job.province))).sort();
  const branches = useMemo(() => {
    if (filters.province === "All Provinsi") {
      return Array.from(new Set(openJobs.map((job) => job.branch))).sort();
    }
    return Array.from(
      new Set(
        openJobs
          .filter((job) => job.province === filters.province)
          .map((job) => job.branch)
      )
    ).sort();
  }, [filters.province, openJobs]);
  const positions = Array.from(new Set(openJobs.map((job) => job.position))).sort();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="flex">
        {/* Desktop Sidebar - Sticky */}
        <aside className="hidden lg:block w-64 sticky top-0 h-screen overflow-y-auto border-r border-border">
          <FilterSidebar
            selectedProvince={filters.province}
            selectedBranch={filters.branch}
            selectedPosition={filters.position}
            onProvinceChange={(province) => handleFilterChange({ ...filters, province, branch: "All Cabang" })}
            onBranchChange={(branch) => handleFilterChange({ ...filters, branch })}
            onPositionChange={(position) => handleFilterChange({ ...filters, position })}
            provinces={provinces}
            branches={branches}
            positions={positions}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <JobHeader />
            <WelcomeBanner />

            {/* Mobile Filter Sidebar */}
            <div className="lg:hidden">
              <FilterSidebar
                selectedProvince={filters.province}
                selectedBranch={filters.branch}
                selectedPosition={filters.position}
                onProvinceChange={(province) => handleFilterChange({ ...filters, province, branch: "All Cabang" })}
                onBranchChange={(branch) => handleFilterChange({ ...filters, branch })}
                onPositionChange={(position) => handleFilterChange({ ...filters, position })}
                provinces={provinces}
                branches={branches}
                positions={positions}
              />
            </div>

            {/* Job Listings */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Lowongan Terbuka</h2>
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      position={job.position}
                      branch={job.branch}
                      location={job.location}
                      province={job.province}
                      type={job.type}
                      onDetail={() => handleJobDetail(job.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Tidak ada lowongan yang sesuai dengan filter Anda.</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

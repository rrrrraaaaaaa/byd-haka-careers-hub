import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import FilterSidebar from "@/components/FilterSidebar";
import TopNav from "@/components/TopNav";
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
      <TopNav isPublic={true} />
      
      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar - Sticky */}
        <aside className="hidden lg:block w-64 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto border-r border-border">
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
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Open Positions</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Browse our currently available job openings</p>
            </div>

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
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                  <Briefcase className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
                  <p className="text-sm sm:text-base text-muted-foreground">No positions match your filter criteria.</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

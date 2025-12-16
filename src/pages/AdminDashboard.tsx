import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import TopNav from "@/components/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Download,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { toast } from "sonner";

type ApplicationStatus = 
  | 'submitted'
  | 'on_review'
  | 'interview_hc'
  | 'interview_user'
  | 'psikotes'
  | 'test_bidang'
  | 'assessment'
  | 'background_check'
  | 'offering'
  | 'onboarding'
  | 'accepted'
  | 'rejected';

interface ApplicationWithProfile {
  id: string;
  user_id: string;
  position: string;
  branch: string;
  province: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  age: number;
  gender: string;
  expected_salary: number;
  has_automotive_experience: boolean;
  work_experience_duration: string;
  education_level: string;
  residential_address: string;
  info_source: string;
  cv_url: string;
  certificate_url: string;
  admin_notes: string | null;
  profiles: {
    full_name: string | null;
    nik: string;
  } | null;
}

const statusLabels: Record<ApplicationStatus, string> = {
  submitted: 'Submitted',
  on_review: 'On Review',
  interview_hc: 'HR Interview',
  interview_user: 'User Interview',
  psikotes: 'Psychological Test',
  test_bidang: 'Technical Test',
  assessment: 'Assessment',
  background_check: 'Background Check',
  offering: 'Offering',
  onboarding: 'Onboarding',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

const statusColors: Record<ApplicationStatus, string> = {
  submitted: 'bg-secondary text-secondary-foreground',
  on_review: 'bg-amber-100 text-amber-800',
  interview_hc: 'bg-blue-100 text-blue-800',
  interview_user: 'bg-blue-100 text-blue-800',
  psikotes: 'bg-purple-100 text-purple-800',
  test_bidang: 'bg-purple-100 text-purple-800',
  assessment: 'bg-indigo-100 text-indigo-800',
  background_check: 'bg-cyan-100 text-cyan-800',
  offering: 'bg-emerald-100 text-emerald-800',
  onboarding: 'bg-primary/10 text-primary',
  accepted: 'bg-primary text-primary-foreground',
  rejected: 'bg-destructive/10 text-destructive',
};

const allStatuses: ApplicationStatus[] = [
  'submitted', 'on_review', 'interview_hc', 'interview_user', 
  'psikotes', 'test_bidang', 'assessment', 'background_check', 
  'offering', 'onboarding', 'accepted', 'rejected'
];

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAdminCheck();
  const [applications, setApplications] = useState<ApplicationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<ApplicationWithProfile | null>(null);
  const [editingStatus, setEditingStatus] = useState<ApplicationStatus | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchApplications();
    }
  }, [isAdmin]);

  const fetchApplications = async () => {
    setLoading(true);
    
    // Fetch all applications
    const { data: appsData, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
      return;
    }

    if (appsData) {
      // Fetch profiles separately
      const userIds = [...new Set(appsData.map(app => app.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, nik")
        .in("user_id", userIds);
      
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      
      const appsWithProfiles = appsData.map(app => ({
        ...app,
        profiles: profilesMap.get(app.user_id) || null
      }));
      
      setApplications(appsWithProfiles as ApplicationWithProfile[]);
    }
    
    setLoading(false);
  };

  const updateApplicationStatus = async (appId: string, newStatus: ApplicationStatus, notes: string) => {
    setIsUpdating(true);
    
    const { error } = await supabase
      .from("applications")
      .update({ 
        status: newStatus,
        admin_notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", appId);

    if (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } else {
      toast.success(`Status updated to ${statusLabels[newStatus]}`);
      fetchApplications();
      setSelectedApp(null);
    }
    
    setIsUpdating(false);
  };

  const exportToExcel = () => {
    const filteredData = getFilteredApplications();
    
    // Create CSV content
    const headers = [
      "Name", "NIK", "Position", "Branch", "Province", "Status", 
      "Age", "Gender", "Expected Salary", "Automotive Experience",
      "Work Experience", "Education", "Address", "Info Source",
      "Applied Date", "Last Updated", "Admin Notes"
    ];
    
    const rows = filteredData.map(app => [
      app.profiles?.full_name || "N/A",
      app.profiles?.nik || "N/A",
      app.position,
      app.branch,
      app.province,
      statusLabels[app.status],
      app.age,
      app.gender,
      app.expected_salary,
      app.has_automotive_experience ? "Yes" : "No",
      app.work_experience_duration,
      app.education_level,
      app.residential_address,
      app.info_source,
      format(new Date(app.created_at), "yyyy-MM-dd"),
      format(new Date(app.updated_at), "yyyy-MM-dd"),
      app.admin_notes || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `applications_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    
    toast.success("Data exported successfully");
  };

  const getFilteredApplications = () => {
    return applications.filter(app => {
      const matchesSearch = 
        (app.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (app.profiles?.nik?.includes(searchTerm) || false) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.branch.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      const matchesPosition = positionFilter === "all" || app.position === positionFilter;
      const matchesBranch = branchFilter === "all" || app.branch === branchFilter;
      
      return matchesSearch && matchesStatus && matchesPosition && matchesBranch;
    });
  };

  const uniquePositions = [...new Set(applications.map(app => app.position))];
  const uniqueBranches = [...new Set(applications.map(app => app.branch))];
  const filteredApplications = getFilteredApplications();

  // Stats
  const totalApplications = applications.length;
  const pendingReview = applications.filter(app => app.status === 'submitted' || app.status === 'on_review').length;
  const inProcess = applications.filter(app => 
    !['submitted', 'on_review', 'accepted', 'rejected'].includes(app.status)
  ).length;
  const accepted = applications.filter(app => app.status === 'accepted').length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">HR Dashboard</h1>
            <p className="text-muted-foreground">Manage and track all job applications</p>
          </div>
          <Button onClick={exportToExcel} className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Export to Excel
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalApplications}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingReview}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inProcess}</p>
                  <p className="text-sm text-muted-foreground">In Process</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{accepted}</p>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, NIK, position, or branch..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {allStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {statusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {uniquePositions.map(pos => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {uniqueBranches.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Applications ({filteredApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No applications found matching your filters
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map(app => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.profiles?.full_name || "N/A"}</p>
                            <p className="text-sm text-muted-foreground">{app.profiles?.nik || "N/A"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{app.position}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            {app.branch}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[app.status]}>
                            {statusLabels[app.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(app.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedApp(app);
                                    setEditingStatus(app.status);
                                    setAdminNotes(app.admin_notes || "");
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Application Details</DialogTitle>
                                </DialogHeader>
                                {selectedApp && (
                                  <div className="space-y-6">
                                    {/* Applicant Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                        <p className="font-medium">{selectedApp.profiles?.full_name || "N/A"}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">NIK</label>
                                        <p className="font-medium">{selectedApp.profiles?.nik || "N/A"}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Age</label>
                                        <p>{selectedApp.age} years</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Gender</label>
                                        <p>{selectedApp.gender}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                                        <p>{selectedApp.residential_address}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Expected Salary</label>
                                        <p>Rp {selectedApp.expected_salary.toLocaleString()}</p>
                                      </div>
                                    </div>

                                    {/* Job Info */}
                                    <div className="border-t pt-4">
                                      <h4 className="font-semibold mb-3">Position Applied</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Position</label>
                                          <p>{selectedApp.position}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Branch</label>
                                          <p>{selectedApp.branch}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Province</label>
                                          <p>{selectedApp.province}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Info Source</label>
                                          <p>{selectedApp.info_source}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Experience */}
                                    <div className="border-t pt-4">
                                      <h4 className="font-semibold mb-3">Experience & Education</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Education Level</label>
                                          <p>{selectedApp.education_level}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Work Experience</label>
                                          <p>{selectedApp.work_experience_duration}</p>
                                        </div>
                                        <div className="col-span-2">
                                          <label className="text-sm font-medium text-muted-foreground">Automotive Experience</label>
                                          <p>{selectedApp.has_automotive_experience ? "Yes" : "No"}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Documents */}
                                    <div className="border-t pt-4">
                                      <h4 className="font-semibold mb-3">Documents</h4>
                                      <div className="flex gap-4">
                                        {selectedApp.cv_url && (
                                          <Button variant="outline" size="sm" asChild>
                                            <a href={selectedApp.cv_url} target="_blank" rel="noopener noreferrer">
                                              <Download className="w-4 h-4 mr-2" />
                                              Download CV
                                            </a>
                                          </Button>
                                        )}
                                        {selectedApp.certificate_url && (
                                          <Button variant="outline" size="sm" asChild>
                                            <a href={selectedApp.certificate_url} target="_blank" rel="noopener noreferrer">
                                              <Download className="w-4 h-4 mr-2" />
                                              Download Certificate
                                            </a>
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Status Update */}
                                    <div className="border-t pt-4">
                                      <h4 className="font-semibold mb-3">Update Status</h4>
                                      <div className="space-y-4">
                                        <Select 
                                          value={editingStatus || selectedApp.status} 
                                          onValueChange={(val) => setEditingStatus(val as ApplicationStatus)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {allStatuses.map(status => (
                                              <SelectItem key={status} value={status}>
                                                {statusLabels[status]}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                            Admin Notes
                                          </label>
                                          <Textarea 
                                            placeholder="Add notes about this application..."
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            rows={3}
                                          />
                                        </div>
                                        <Button 
                                          onClick={() => {
                                            if (editingStatus) {
                                              updateApplicationStatus(selectedApp.id, editingStatus, adminNotes);
                                            }
                                          }}
                                          disabled={isUpdating}
                                          className="w-full"
                                        >
                                          {isUpdating ? "Updating..." : "Update Status"}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import TopNav from "@/components/TopNav";
import { PDFPreviewModal } from "@/components/PDFPreviewModal";
import JobManagement from "@/components/JobManagement";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Users,
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Calendar as CalendarIcon,
  MapPin,
  Building2,
  Briefcase,
  FileText,
  XCircle,
  Phone,
  MessageCircle,
  Loader2
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
    expected_salary: number;
    current_salary: number | null;
    whatsapp_number: string | null;
    gender: string | null;
    avatar_url: string | null;
  } | null;
  jobs: {
    job_level: string | null;
  } | null;
}

const statusLabels: Record<ApplicationStatus, string> = {
  submitted: 'Submitted',
  on_review: 'On Review',
  interview_hc: 'HR Interview',
  interview_user: 'User Interview',
  psikotes: 'Psych. Test / Assessment',
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
  'psikotes', 'test_bidang', 'background_check',
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
  const [monthFilter, setMonthFilter] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<ApplicationWithProfile | null>(null);
  const [editingStatus, setEditingStatus] = useState<ApplicationStatus | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("applications");
  const [cvPreviewOpen, setCvPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const navigate = useNavigate();

  // Onboarding Data State
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [onboardingLoading, setOnboardingLoading] = useState(false);

  // Detailed Profile Data for Popup
  const [educationData, setEducationData] = useState<any[]>([]);
  const [experienceData, setExperienceData] = useState<any[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Interview Data State
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("09:00");
  const [interviewType, setInterviewType] = useState("HR Interview");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [isSavingInterview, setIsSavingInterview] = useState(false);

  const fetchOnboardingData = async (userId: string) => {
    setOnboardingLoading(true);
    setOnboardingOpen(true);
    console.log("Fetching onboarding data for:", userId);
    const { data } = await supabase
      .from("employees" as any)
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    setOnboardingData(data);
    setOnboardingLoading(false);
  };

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

      let profilesData = [];
      if (userIds.length > 0) {
        // Try to fetch with current_salary (new column)
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id, full_name, nik, expected_salary, current_salary, whatsapp_number, gender, avatar_url")
          .in("user_id", userIds);

        if (error) {
          console.warn("Error fetching profiles with current_salary, trying fallback:", error);
          // Fallback: fetch without current_salary (migration might not be applied yet)
          const { data: fallbackData } = await supabase
            .from("profiles")
            .select("user_id, full_name, nik, expected_salary, whatsapp_number, gender, avatar_url")
            .in("user_id", userIds);
          profilesData = fallbackData || [];
        } else {
          profilesData = data || [];
        }
      }

      // Fetch jobs to get job_level (manual join since relation might not exist in Supabase types)
      const { data: jobs } = await supabase
        .from("jobs" as any)
        .select("title, job_level");

      const jobsData = jobs as any[];

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      const jobsMap = new Map(jobsData?.map(j => [j.title, j]) || []);

      const appsWithProfiles = appsData.map(app => ({
        ...app,
        profiles: profilesMap.get(app.user_id) || null,
        jobs: jobsMap.get(app.position) || null
      }));

      setApplications(appsWithProfiles as ApplicationWithProfile[]);
    }

    setLoading(false);
  };

  const updateApplicationStatus = async (appId: string, newStatus: ApplicationStatus, notes: string) => {
    setIsUpdating(true);

    // 1. Update Application
    const { error: updateError } = await supabase
      .from("applications")
      .update({
        status: newStatus,
        admin_notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", appId);

    if (updateError) {
      console.error("Error updating status:", updateError);
      toast.error("Failed to update status");
    } else {
      // 2. Create Log Entry
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { error: logError } = await supabase
          .from("application_logs" as any)
          .insert({
            application_id: appId,
            status: newStatus,
            notes: notes || null,
            created_by: session.user.id
          });

        if (logError) console.error("Error creating log:", logError);
      }

      toast.success(`Status updated to ${statusLabels[newStatus]}`);

      // CHECK FOR INTERVIEW_HC, INTERVIEW_USER, TEST_BIDANG, PSIKOTES, OFFERING, OR BACKGROUND_CHECK STATUS
      if (["interview_hc", "interview_user", "test_bidang", "psikotes", "offering", "background_check"].includes(newStatus)) {
        // Find the application details
        const app = applications.find(a => a.id === appId) || selectedApp;

        if (app && app.profiles?.whatsapp_number) {
          const gender = app.profiles.gender?.toLowerCase() === "male" ? "Bapak" : "Ibu";
          const honorific = gender;
          const name = app.profiles.full_name || "Nama";
          const position = app.position;
          const placement = app.branch;

          // Format phone number
          let phone = app.profiles.whatsapp_number;
          if (phone.startsWith('0')) {
            phone = '62' + phone.substring(1);
          }

          let message = "";

          if (newStatus === "interview_hc") {
            // ... (keep existing)
            message = `Dear ${honorific} ${name},

Salam sejahtera,
Perkenalkan kami dari Talent Acquisition HAKA Auto. Melalui pesan ini, kami ingin menyampaikan apresiasi atas ketertarikan ${honorific} untuk bergabung bersama perusahaan kami. Berdasarkan hasil seleksi awal, kami melihat bahwa profil dan pengalaman ${honorific} memiliki potensi yang sesuai untuk berkontribusi di perusahaan kami HAKA Auto.

Sehubungan dengan hal tersebut, kami mengundang ${honorific} untuk mengikuti Interview HC dengan detail sebagai berikut:

Posisi : ${position}
Penempatan : ${placement}
Hari/Tanggal : 
Waktu : 
Media : 
Link Zoom : 

Kami mohon kesediaan ${honorific} untuk melakukan konfirmasi kehadiran dengan membalas email ini menggunakan format:
Ya/Tidak – Nama Lengkap

Kami berharap ${honorific} dapat hadir dan berdiskusi lebih lanjut mengenai peran, tanggung jawab, serta peluang pengembangan karier bersama BYD HAKA Auto.

Atas perhatian dan kerja sama ${honorific}, kami ucapkan terima kasih. Kami menantikan kesempatan untuk bertemu dengan ${honorific}.

Hormat kami,
Human Capital - Talent Acquisition
HAKA Auto`;
          } else if (newStatus === "interview_user") {
            // ... (keep existing)
            message = `Dear ${honorific} ${name},

Salam sejahtera,
Terima kasih atas partisipasi ${honorific} dalam tahapan seleksi sebelumnya. Berdasarkan hasil Interview HC, kami menilai bahwa profil dan pengalaman ${honorific} sesuai dengan kualifikasi yang dibutuhkan.

Sehubungan dengan hal tersebut, kami mengundang ${honorific} untuk mengikuti Interview User dengan detail sebagai berikut:

Posisi : ${position}
Penempatan : ${placement}
Hari/Tanggal : 
Waktu : 
Media : 
Link Zoom : 

Kami mohon kesediaan ${honorific} untuk melakukan konfirmasi kehadiran dengan membalas email ini menggunakan format:
Ya/Tidak – Nama Lengkap

Kami berharap ${honorific} dapat hadir dan berdiskusi lebih lanjut mengenai peran, tanggung jawab, serta peluang pengembangan karier bersama BYD HAKA Auto.

Atas perhatian dan kerja sama ${honorific}, kami ucapkan terima kasih. Kami menantikan kesempatan untuk bertemu dengan ${honorific}.

Hormat kami,
Human Capital - Talent Acquisition
HAKA Auto`;
          } else if (newStatus === "test_bidang") {
            // ... (keep existing)
            message = `

Dear ${honorific} ${name},

Salam sejahtera,
Terima kasih atas partisipasi ${honorific} dalam proses seleksi yang sedang berjalan. Sebagai tahapan selanjutnya dalam proses rekrutmen di perusahaan kami, bersama pesan ini kami sampaikan link Technical Test (Tes Bidang) yang perlu ${honorific} kerjakan.

Link Technical Test:
https://docs.google.com/spreadsheets/d/1y3r-exmSkn19nsWNvZBivRTZQBB-hl1z_xzPPuP_OsM/edit?usp=sharing

Soal serta petunjuk pengerjaan telah kami cantumkan di dalam link tersebut. Mohon untuk dipelajari dan dikerjakan sesuai dengan ketentuan yang tersedia.

Apabila terdapat hal yang ingin ditanyakan atau kendala dalam pengerjaan, silakan menghubungi kami kembali.

Terima kasih atas perhatian dan kerja samanya.

Hormat kami,
Human Capital - Talent Acquisition
HAKA Auto`;
          } else if (newStatus === "psikotes") {
            // ... (keep existing)
            const jobLevel = app.jobs?.job_level?.toUpperCase() || "STAFF";
            const isLeader = ["EXECUTIVE LEADER", "STRATEGIC LEADER", "OPERATIONAL LEADER", "TECHNICAL LEADER"].includes(jobLevel);

            if (isLeader) {
              // ASSESSMENT TEMPLATE
              message = `Dear ${honorific} ${name},

Salam sejahtera,
Terima kasih atas partisipasi ${honorific} dalam proses seleksi yang sedang berjalan. Sehubungan dengan hal tersebut, kami mengundang ${honorific} untuk mengikuti Assesstment Online dengan detail sebagai berikut:

Posisi : ${position}
Penempatan : ${placement}
Hari/Tanggal : 
Waktu : 
Media : Assesstment Online
Link : 🌐 https://bit.ly/ABSroom

Mohon kesediaan ${honorific} untuk mengonfirmasi ketersediaan di jadwal tersebut. Apabila berhalangan, silakan informasikan waktu alternatif yang memungkinkan.

Boleh dibantu untuk mengisi terlebih dahulu dengan data berikut:
✅ Nama Lengkap
✅ Tempat & Tanggal Lahir
✅ Alamat Email
✅ Posisi Jabatan yang Dilamar

Apabila terdapat pertanyaan atau kendala teknis, silakan menghubungi kami melalui kontak ini.
Terima kasih atas perhatian dan kerja samanya.

Hormat kami,
Human Capital - Talent Acquisition
HAKA Auto`;
            } else {
              // PSYCHOTEST TEMPLATE
              message = `Dear ${honorific} ${name},

Salam sejahtera,
Terima kasih atas partisipasi ${honorific} dalam proses seleksi yang sedang berjalan. Sehubungan dengan hal tersebut, kami mengundang ${honorific} untuk mengikuti Psikotest Online dengan detail sebagai berikut:

Posisi : ${position}
Penempatan : ${placement}
Hari/Tanggal : 
Waktu : 
Media : 
Link Zoom : 
Kode Test : 

Catatan Penting:
1. Tes hanya dapat diakses pada tanggal dan jam yang telah ditentukan.
2. Pastikan koneksi internet dalam kondisi stabil.
3. Disarankan menggunakan laptop atau komputer.
4. Tes wajib diselesaikan dalam satu kali sesi tanpa menutup browser.
5. Akses lebih dari satu kali akan menyebabkan diskualifikasi.
6. Seluruh aktivitas selama tes akan direkam oleh sistem.
7. Jika mengalami kendala teknis, silakan menghubungi tim rekrutmen kami.

Mohon konfirmasi kesediaan ${honorific} untuk mengikuti assessment ini.
Terima kasih atas perhatian dan kerja samanya.

Hormat kami,
Human Capital - Talent Acquisition
HAKA Auto`;
            }
          } else if (newStatus === "offering") {
            // ... (keep existing)
            message = `Dear ${honorific} ${name},

Salam sejahtera,
Terima kasih atas partisipasi ${honorific} dalam proses seleksi yang sedang berjalan. Bersamaan dengan pesan ini kami ucapkan selamat karena sudah terpilih untuk melanjutkan proses rekrutmen ke tahap terakhir yaitu Offering Letter.

Sebelum kami melanjutkan ke tahap selanjutnya, kami mohon kesediaan ${honorific} untuk melengkapi data biodata melalui link berikut:

🔗 Link Form Finalisasi
👉 https://bumiauto.link/FinalisasiKaryawanHakaAuto

Mohon untuk mengisi data dengan lengkap dan benar.
Apabila sudah selesai mengisi, silakan melakukan konfirmasi kepada kami.

Terima kasih atas perhatian dan kerja samanya.

Hormat kami,
Human Capital - Talent Acquisition
HAKA Auto`;
          } else if (newStatus === "background_check") {
            message = `Dear ${honorific} ${name},

Salam sejahtera,
Terima kasih atas partisipasi ${honorific} dalam proses seleksi yang sedang berjalan.
Kami informasikan bahwa ${honorific} dinyatakan lolos ke tahapan seleksi selanjutnya.

Informasi mengenai tahapan berikutnya akan kami sampaikan kembali.
Terima kasih atas perhatian dan kerja samanya.

Hormat kami,
Human Capital - Talent Acquisition
HAKA Auto`;
          }



          // Open WhatsApp
          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        }
      }

      // 3. Auto-Reject Other Applications if Accepted
      if (newStatus === "accepted") {
        const currentApp = applications.find(a => a.id === appId) || selectedApp;
        if (currentApp) {
          const { error: autoRejectError } = await supabase
            .from("applications")
            .update({
              status: "rejected",
              admin_notes: "Auto-rejected: Candidate accepted for another position",
              updated_at: new Date().toISOString()
            })
            .eq("user_id", currentApp.user_id)
            .neq("id", appId)
            .neq("status", "rejected")
            .neq("status", "accepted");

          if (autoRejectError) {
            console.error("Error auto-rejecting applications:", autoRejectError);
            toast.error("Failed to auto-reject other applications");
          } else {
            toast.info("Other applications for this candidate have been auto-rejected.");
          }
        }
      }

      // 4. Create Notification
      if (selectedApp) {
        const { error: notifError } = await supabase
          .from("notifications" as any)
          .insert({
            user_id: selectedApp.user_id,
            title: "Application Update",
            message: `Your application for ${selectedApp.position} at ${selectedApp.branch} has been updated to: ${statusLabels[newStatus]}`,
            link: "/applications"
          });

        if (notifError) console.error("Error creating notification:", notifError);
      }

      fetchApplications();
      setSelectedApp(null);
    }

    setIsUpdating(false);
  };

  const handleOpenInterview = (app: ApplicationWithProfile) => {
    setSelectedApp(app);
    setInterviewOpen(true);
    setDate(undefined);
    setTime("09:00");
    setInterviewLocation("");
    setInterviewNotes("");
    setInterviewType("HR Interview");
  };

  const saveInterview = async () => {
    if (!selectedApp || !date || !time || !interviewLocation || !interviewType) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSavingInterview(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Combine date and time
    const scheduledAt = new Date(date);
    const [hours, minutes] = time.split(':');
    scheduledAt.setHours(parseInt(hours), parseInt(minutes));

    // 1. Save Interview
    const { error } = await supabase
      .from("interviews" as any)
      .insert({
        application_id: selectedApp.id,
        scheduled_at: scheduledAt.toISOString(),
        interview_type: interviewType,
        location_url: interviewLocation,
        notes: interviewNotes,
        created_by: session.user.id
      });

    if (error) {
      console.error("Error saving interview:", error);
      toast.error("Failed to schedule interview");
      setIsSavingInterview(false);
      return;
    }

    // 2. Auto-update status if applicable
    let newStatus: ApplicationStatus | null = null;
    if (interviewType === "HR Interview") newStatus = "interview_hc";
    else if (interviewType === "User Interview") newStatus = "interview_user";
    else if (interviewType === "Psychotes") newStatus = "psikotes";
    else if (interviewType === "Technical Test") newStatus = "test_bidang";

    if (newStatus && selectedApp.status !== newStatus) {
      await updateApplicationStatus(selectedApp.id, newStatus, `Interview scheduled: ${interviewType}`);
    } else {
      toast.success("Interview scheduled successfully");
      // Create notification manually if status didn't change (updateApplicationStatus handles it otherwise)
      const { error: notifError } = await supabase
        .from("notifications" as any)
        .insert({
          user_id: selectedApp.user_id,
          title: "New Interview Scheduled",
          message: `You have a new ${interviewType} scheduled for ${format(scheduledAt, "MMM d, HH:mm")}. Check your application details.`,
          link: "/applications"
        });
    }

    setInterviewOpen(false);
    setIsSavingInterview(false);
  };

  const openCvPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setCvPreviewOpen(true);
  };

  const exportToExcel = () => {
    const filteredData = getFilteredApplications();

    if (filteredData.length === 0) {
      toast.error("No data matches the selected filters.");
      return;
    }

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

      // Filter by Month (based on updated_at for "joined date" accuracy, or created_at default)
      // User specific request: "khusus untuk joined date/pelamar yg lolos" implies we care about when they reached their current status (especially if accepted).
      // We will use updated_at as it reflects the time of the last status change.
      let matchesMonth = true;
      if (monthFilter) {
        const appDate = new Date(app.updated_at);
        const filterDate = new Date(monthFilter);
        matchesMonth =
          appDate.getMonth() === filterDate.getMonth() &&
          appDate.getFullYear() === filterDate.getFullYear();
      }

      return matchesSearch && matchesStatus && matchesPosition && matchesBranch && matchesMonth;
    });
  };

  const uniquePositions = [...new Set(applications.map(app => app.position).filter(Boolean))];
  const uniqueBranches = [...new Set(applications.map(app => app.branch).filter(Boolean))];
  const filteredApplications = getFilteredApplications();

  // Stats
  const totalApplications = applications.length;
  const pendingReview = applications.filter(app => app.status === 'submitted' || app.status === 'on_review').length;
  const inProcess = applications.filter(app =>
    !['submitted', 'on_review', 'accepted', 'rejected'].includes(app.status)
  ).length;
  const accepted = applications.filter(app => app.status === 'accepted').length;
  const rejected = applications.filter(app => app.status === 'rejected').length;

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
          <Button onClick={exportToExcel} className="gap-2" disabled={loading}>
            <FileSpreadsheet className="w-4 h-4" />
            Export to Excel
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalApplications}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
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
                  <p className="text-sm text-muted-foreground">Pending</p>
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
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate("/admin/fixed-employees")}
          >
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
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate("/admin/talent-pool")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs & Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant={activeTab === "applications" ? "default" : "outline"}
              onClick={() => setActiveTab("applications")}
              className={activeTab === "applications" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Applications
            </Button>
            <Button
              variant={activeTab === "jobs" ? "default" : "outline"}
              onClick={() => setActiveTab("jobs")}
              className={activeTab === "jobs" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Job Management
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              {activeTab === "applications" ? (
                <>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* ... Existing Filters ... */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, NIK, position, or branch..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="w-[180px]">
                      <Input
                        type="month"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          <SelectValue placeholder="Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {allStatuses.map(status => (
                          <SelectItem key={status} value={status}>
                            {statusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={branchFilter} onValueChange={setBranchFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Branches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {Array.from(new Set(applications.map(a => a.branch))).map(branch => (
                          <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Positions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Positions</SelectItem>
                        {Array.from(new Set(applications.map(a => a.position))).map(position => (
                          <SelectItem key={position} value={position}>{position}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applied Date</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredApplications.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No applications found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredApplications.map((app) => (
                              <TableRow key={app.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{app.profiles?.full_name || "Unknown"}</p>
                                    <p className="text-xs text-muted-foreground">{app.profiles?.nik || "No NIK"}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{app.position}</p>
                                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {app.branch}
                                    </div>
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
                                <TableCell>
                                  <div className="flex gap-2">
                                    {app.profiles?.whatsapp_number ? (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        title="Chat WhatsApp"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => {
                                          let phone = app.profiles?.whatsapp_number || "";
                                          if (phone.startsWith('0')) {
                                            phone = '62' + phone.substring(1);
                                          }
                                          window.open(`https://wa.me/${phone}`, '_blank');
                                        }}
                                      >
                                        <MessageCircle className="w-5 h-5" />
                                      </Button>
                                    ) : (
                                      <span className="text-muted-foreground text-xs">-</span>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      title="Schedule Interview"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      onClick={() => handleOpenInterview(app)}
                                    >
                                      <CalendarIcon className="w-5 h-5" />
                                    </Button>
                                  </div>
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

                                            // Fetch detailed data
                                            setDetailsLoading(true);
                                            Promise.all([
                                              (supabase.from("profile_educations" as any) as any).select("*").eq("user_id", app.user_id).order("start_year", { ascending: false }),
                                              (supabase.from("profile_experiences" as any) as any).select("*").eq("user_id", app.user_id).order("start_year", { ascending: false })
                                            ]).then(([eduRes, expRes]) => {
                                              if (eduRes.data) setEducationData(eduRes.data);
                                              if (expRes.data) setExperienceData(expRes.data);
                                              setDetailsLoading(false);
                                            });
                                          }}
                                        >
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                          <DialogTitle>Application Details</DialogTitle>
                                        </DialogHeader>
                                        {selectedApp && (
                                          <div className="space-y-6">
                                            <div className="bg-blue-50 px-4 py-2 rounded-md text-xs text-blue-700 flex items-start gap-2">
                                              <div className="mt-0.5">ℹ️</div>
                                              <p>
                                                <strong>Note:</strong> Personal details (Address, Age, Experience) are a snapshot from submission.
                                                Name, NIK, and Expected Salary are fetched from the current profile.
                                              </p>
                                            </div>

                                            {/* Applicant Info */}
                                            <div className="flex gap-4 items-start mb-4">
                                              {selectedApp.profiles?.avatar_url ? (
                                                <img
                                                  src={supabase.storage.from('avatars').getPublicUrl(selectedApp.profiles.avatar_url).data.publicUrl}
                                                  alt="Profile"
                                                  className="w-24 h-24 rounded-lg object-cover border-2 border-gray-100 shadow-sm"
                                                />
                                              ) : (
                                                <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                                                  <Users className="w-10 h-10" />
                                                </div>
                                              )}
                                              <div className="flex-1">
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
                                                    <p className="capitalize">{selectedApp.gender}</p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                              <div className="col-span-2">
                                                <label className="text-sm font-medium text-muted-foreground">Address</label>
                                                <p>{selectedApp.residential_address}</p>
                                              </div>
                                              <div>
                                                <label className="text-sm font-medium text-muted-foreground">Current Salary</label>
                                                <p className="font-medium text-emerald-600">
                                                  {selectedApp.profiles?.current_salary
                                                    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(selectedApp.profiles.current_salary)
                                                    : "Rp 0"}
                                                </p>
                                              </div>
                                              <div>
                                                <label className="text-sm font-medium text-muted-foreground">Expected Salary</label>
                                                <p className="font-medium text-emerald-600">
                                                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(selectedApp.expected_salary)}
                                                  <span className="text-xs text-muted-foreground block font-normal">
                                                    (Profile: {selectedApp.profiles?.expected_salary ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(selectedApp.profiles.expected_salary) : "-"})
                                                  </span>
                                                </p>
                                              </div>
                                            </div>

                                            {/* Dynamic Education & Experience Section */}
                                            <div className="mt-6 space-y-6 border-t pt-6">
                                              {detailsLoading ? (
                                                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                                              ) : (
                                                <>
                                                  {/* Education */}
                                                  <div>
                                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                      <Building2 className="w-5 h-5 text-gray-500" /> Education History
                                                    </h3>
                                                    {educationData.length > 0 ? (
                                                      <div className="space-y-4">
                                                        {educationData.map((edu: any) => (
                                                          <div key={edu.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                            <div className="flex justify-between items-start">
                                                              <div>
                                                                <p className="font-semibold text-gray-800">{edu.institution}</p>
                                                                <p className="text-sm text-gray-600">{edu.degree} - {edu.major}</p>
                                                                {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa} / {edu.gpa_max}</p>}
                                                              </div>
                                                              <Badge variant="outline" className="bg-white">
                                                                {edu.start_year} - {edu.is_current ? 'Present' : edu.end_year}
                                                              </Badge>
                                                            </div>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    ) : (
                                                      <p className="text-sm text-gray-400 italic">No detailed education history found.</p>
                                                    )}
                                                  </div>

                                                  {/* Experience */}
                                                  <div>
                                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                      <Briefcase className="w-5 h-5 text-gray-500" /> Work Experience
                                                    </h3>
                                                    {experienceData.length > 0 ? (
                                                      <div className="space-y-4">
                                                        {experienceData.map((exp: any) => (
                                                          <div key={exp.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                            <div className="flex justify-between items-start">
                                                              <div>
                                                                <p className="font-semibold text-gray-800">{exp.position}</p>
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                  <span className="font-medium">{exp.company}</span>
                                                                  <span>•</span>
                                                                  <span>{exp.job_level}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{exp.job_description}</p>
                                                              </div>
                                                              <div className="text-right">
                                                                <Badge variant="outline" className="bg-white mb-1">
                                                                  {exp.start_year} - {exp.is_current ? 'Present' : exp.end_year}
                                                                </Badge>
                                                                {exp.net_salary && (
                                                                  <p className="text-xs text-emerald-600 font-medium">
                                                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(exp.net_salary)}
                                                                  </p>
                                                                )}
                                                              </div>
                                                            </div>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    ) : (
                                                      <p className="text-sm text-gray-400 italic">No detailed work experience found.</p>
                                                    )}
                                                  </div>
                                                </>
                                              )}
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
                                                  <p className="capitalize">{selectedApp.info_source}</p>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Experience */}
                                            <div className="border-t pt-4">
                                              <h4 className="font-semibold mb-3">Experience & Education</h4>
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <label className="text-sm font-medium text-muted-foreground">Education Level</label>
                                                  <p className="uppercase">{selectedApp.education_level}</p>
                                                </div>
                                                <div>
                                                  <label className="text-sm font-medium text-muted-foreground">Work Experience</label>
                                                  <p>
                                                    {selectedApp.work_experience_duration}
                                                  </p>
                                                </div>
                                              </div>

                                              {/* Documents */}
                                              <div className="border-t pt-4">
                                                <h4 className="font-semibold mb-3">Documents</h4>
                                                <div className="flex flex-wrap gap-3">
                                                  {/* View CV */}
                                                  {/* View CV */}
                                                  {selectedApp.cv_url && (
                                                    <div className="flex gap-2">
                                                      <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
                                                        onClick={() => {
                                                          const publicUrl = supabase.storage.from("application-documents").getPublicUrl(selectedApp.cv_url).data.publicUrl;
                                                          setPreviewUrl(publicUrl);
                                                          setPreviewTitle(`CV - ${selectedApp.profiles?.full_name}`);
                                                          setCvPreviewOpen(true);
                                                        }}
                                                      >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View CV
                                                      </Button>
                                                      <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50"
                                                        onClick={() => {
                                                          const publicUrl = supabase.storage.from("application-documents").getPublicUrl(selectedApp.cv_url).data.publicUrl;
                                                          window.open(publicUrl, '_blank');
                                                        }}
                                                      >
                                                        <Download className="w-3.5 h-3.5 text-blue-600" />
                                                      </Button>
                                                    </div>
                                                  )}

                                                  {/* View Certificate/Paklaring */}
                                                  {selectedApp.certificate_url && (
                                                    <div className="flex gap-2">
                                                      <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-2 text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100"
                                                        onClick={() => {
                                                          const publicUrl = supabase.storage.from("application-documents").getPublicUrl(selectedApp.certificate_url).data.publicUrl;
                                                          setPreviewUrl(publicUrl);
                                                          setPreviewTitle(`Certificate/Paklaring - ${selectedApp.profiles?.full_name}`);
                                                          setCvPreviewOpen(true);
                                                        }}
                                                      >
                                                        <FileText className="w-3.5 h-3.5" />
                                                        View Ijazah/Paklaring
                                                      </Button>
                                                      <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 border-purple-200 hover:bg-purple-50"
                                                        onClick={() => {
                                                          const publicUrl = supabase.storage.from("application-documents").getPublicUrl(selectedApp.certificate_url).data.publicUrl;
                                                          window.open(publicUrl, '_blank');
                                                        }}
                                                      >
                                                        <Download className="w-3.5 h-3.5 text-purple-600" />
                                                      </Button>
                                                    </div>
                                                  )}
                                                  {/* View Onboarding Data Button */}
                                                  {["offering", "onboarding", "accepted"].includes(selectedApp.status) && (
                                                    <div className="flex gap-2 w-full mt-2">
                                                      <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="w-full gap-2 bg-teal-600 hover:bg-teal-700"
                                                        onClick={() => fetchOnboardingData(selectedApp.user_id)}
                                                      >
                                                        <FileText className="w-3.5 h-3.5" />
                                                        View Full Onboarding Data
                                                      </Button>
                                                    </div>
                                                  )}
                                                </div>

                                                {/* Admin Actions */}
                                                <div className="border-t pt-4 bg-muted/30 -mx-6 px-6 pb-6 -mb-6 mt-4">
                                                  <h4 className="font-semibold mb-3 pt-4">Admin Actions</h4>
                                                  <div className="space-y-4">
                                                    <div>
                                                      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Update Status</label>
                                                      <div className="flex flex-wrap gap-2">
                                                        {allStatuses.filter(s => s !== 'submitted').map((status) => (
                                                          <Button
                                                            key={status}
                                                            size="sm"
                                                            variant={editingStatus === status ? "default" : "outline"}
                                                            className={`
                                                              ${editingStatus === status ? statusColors[status] : "text-muted-foreground"}
                                                              ${editingStatus === status ? "ring-2 ring-offset-2 ring-primary" : ""}
                                                            `}
                                                            onClick={() => setEditingStatus(status)}
                                                          >
                                                            {statusLabels[status]}
                                                          </Button>
                                                        ))}
                                                      </div>
                                                    </div>

                                                    <div className="grid gap-2">
                                                      <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                                                      <Textarea
                                                        placeholder="Add internal notes about this candidate..."
                                                        value={adminNotes}
                                                        onChange={(e) => setAdminNotes(e.target.value)}
                                                        className="min-h-[100px]"
                                                      />
                                                    </div>

                                                    <div className="flex justify-end gap-2 pt-2">
                                                      <Button
                                                        className="w-full sm:w-auto"
                                                        disabled={isUpdating}
                                                        onClick={() => {
                                                          if (selectedApp && editingStatus) {
                                                            updateApplicationStatus(selectedApp.id, editingStatus, adminNotes);
                                                          }
                                                        }}
                                                      >
                                                        {isUpdating ? "Updating..." : "Save Changes"}
                                                      </Button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              ) : (
                <JobManagement />
              )}
            </CardContent>
          </Card>
        </div>



        {/* PDF Preview Modal */}
        < PDFPreviewModal
          isOpen={cvPreviewOpen}
          onClose={() => setCvPreviewOpen(false)
          }
          fileUrl={previewUrl}
          title={previewTitle}
        />

        {/* Onboarding Data Modal */}
        <Dialog open={onboardingOpen} onOpenChange={setOnboardingOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Employee Onboarding Data</DialogTitle>
            </DialogHeader>
            {onboardingLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
            ) : onboardingData ? (
              <div className="space-y-8">
                {/* Personal Data */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">Personal Data</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-sm text-muted-foreground">Full Name</label><p className="font-medium">{selectedApp?.profiles?.full_name}</p></div>
                    <div><label className="text-sm text-muted-foreground">KTP Number</label><p className="font-medium">{onboardingData.ktp_number}</p></div>
                    <div><label className="text-sm text-muted-foreground">KK Number</label><p className="font-medium">{onboardingData.kk_number}</p></div>
                    <div><label className="text-sm text-muted-foreground">NPWP</label><p className="font-medium">{onboardingData.npwp_number}</p></div>
                    <div><label className="text-sm text-muted-foreground">Birth Place/Date</label><p className="font-medium">{onboardingData.birth_place}, {onboardingData.birth_date}</p></div>
                    <div><label className="text-sm text-muted-foreground">Religion</label><p className="font-medium">{onboardingData.religion}</p></div>
                    <div><label className="text-sm text-muted-foreground">Blood Type</label><p className="font-medium">{onboardingData.blood_type}</p></div>
                    <div><label className="text-sm text-muted-foreground">Marital Status</label><p className="font-medium">{onboardingData.marital_status}</p></div>
                    <div><label className="text-sm text-muted-foreground">Children</label><p className="font-medium">{onboardingData.children_count}</p></div>
                    <div><label className="text-sm text-muted-foreground">SIM A</label><p className="font-medium">{onboardingData.has_sim_a}</p></div>
                    <div><label className="text-sm text-muted-foreground">KTP Address</label><p className="font-medium">{onboardingData.ktp_address}</p></div>
                    <div><label className="text-sm text-muted-foreground">Domicile Address</label><p className="font-medium">{onboardingData.domicile_address}</p></div>
                  </div>
                </div>

                {/* Bank Data */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">Bank Account</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-sm text-muted-foreground">Bank Name</label><p className="font-medium">{onboardingData.bank_name}</p></div>
                    <div><label className="text-sm text-muted-foreground">Account Number</label><p className="font-medium">{onboardingData.bank_account_number}</p></div>
                    <div><label className="text-sm text-muted-foreground">Account Holder</label><p className="font-medium">{onboardingData.bank_account_holder}</p></div>
                    <div><label className="text-sm text-muted-foreground">BPJS Cair Status</label><p className="font-medium">{onboardingData.bpjs_cair_status}</p></div>
                  </div>
                </div>

                {/* Family Data */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">Family & Emergency</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-sm text-muted-foreground">Emergency Contact</label><p className="font-medium">{onboardingData.emergency_contact_name} ({onboardingData.emergency_contact_relation})</p></div>
                    <div><label className="text-sm text-muted-foreground">Emergency Phone</label><p className="font-medium">{onboardingData.emergency_contact_phone}</p></div>
                    <div><label className="text-sm text-muted-foreground">Father's Name</label><p className="font-medium">{onboardingData.father_name}</p></div>
                    <div><label className="text-sm text-muted-foreground">Mother's Name</label><p className="font-medium">{onboardingData.mother_name}</p></div>
                    <div><label className="text-sm text-muted-foreground">Medical History</label><p className="font-medium">{onboardingData.medical_history}</p></div>
                  </div>
                </div>

                {/* Files */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">Uploaded Documents</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(onboardingData).filter(k => k.endsWith('_url') && onboardingData[k]).map(key => (
                      <Button
                        key={key}
                        variant="outline"
                        className="w-full justify-start overflow-hidden"
                        onClick={() => window.open(onboardingData[key], '_blank')}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {key.replace('_url', '').toUpperCase().replace(/_/g, ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No onboarding data submitted yet.
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Interview Schedule Dialog */}
        <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Interview Type</label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR Interview">HR Interview</SelectItem>
                    <SelectItem value="User Interview">User Interview</SelectItem>
                    <SelectItem value="Psychotes">Psychotes / Assessment</SelectItem>
                    <SelectItem value="Technical Test">Technical Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date & Time</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full sm:w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="w-full sm:w-[120px]">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => {
                        const hour = Math.floor(i / 2) + 8; // Start from 08:00
                        const minute = (i % 2) * 30;
                        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        if (hour > 20) return null;
                        return (
                          <SelectItem key={timeStr} value={timeStr}>
                            {timeStr}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location / Meeting Link</label>
                <Input
                  placeholder="e.g. Zoom Link or Office Address"
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Textarea
                  placeholder="Additional instructions..."
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setInterviewOpen(false)}>Cancel</Button>
              <Button onClick={saveInterview} disabled={isSavingInterview}>
                {isSavingInterview ? "Saving..." : "Schedule Interview"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main >
    </div >
  );
}

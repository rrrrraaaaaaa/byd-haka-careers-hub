import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import TopNav from "@/components/TopNav";
import { ApplicationProgress } from "@/components/ApplicationProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Building2, Calendar, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

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

interface Application {
  id: string;
  position: string;
  branch: string;
  province: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
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
  on_review: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  interview_hc: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  interview_user: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  psikotes: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  test_bidang: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  assessment: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  background_check: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  offering: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  onboarding: 'bg-primary/10 text-primary',
  accepted: 'bg-primary text-primary-foreground',
  rejected: 'bg-destructive/10 text-destructive',
};

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (profile?.full_name) {
      setUserName(profile.full_name);
    }

    // Fetch applications
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
    } else {
      setApplications(data || []);
      if (data && data.length > 0) {
        setSelectedApplication(data[0]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
          <p className="text-muted-foreground">
            {userName ? `Hello, ${userName}! ` : ""}Track your job application progress here.
          </p>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-1/3 mb-4" />
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Briefcase className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                You haven't submitted any job applications yet.<br />
                Browse our open positions and start your career journey with Haka Auto!
              </p>
              <button 
                onClick={() => navigate("/job-board")}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse Jobs
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Applications List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-3">Your Applications</h2>
              {applications.map((app) => (
                <Card 
                  key={app.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedApplication?.id === app.id 
                      ? "ring-2 ring-primary shadow-md" 
                      : ""
                  }`}
                  onClick={() => setSelectedApplication(app)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{app.position}</h3>
                      <Badge className={statusColors[app.status]}>
                        {statusLabels[app.status]}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{app.branch}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{app.province}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Applied {format(new Date(app.created_at), "MMMM d, yyyy", { locale: enUS })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress Detail */}
            <div className="lg:col-span-2">
              {selectedApplication && (
                <Card>
                  <CardHeader className="border-b border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{selectedApplication.position}</CardTitle>
                        <p className="text-muted-foreground mt-1">
                          {selectedApplication.branch} • {selectedApplication.province}
                        </p>
                      </div>
                      <Badge className={statusColors[selectedApplication.status]}>
                        {statusLabels[selectedApplication.status]}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-3">
                      <span>Applied: {format(new Date(selectedApplication.created_at), "MMMM d, yyyy", { locale: enUS })}</span>
                      <span>•</span>
                      <span>Last Update: {format(new Date(selectedApplication.updated_at), "MMMM d, yyyy", { locale: enUS })}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ApplicationProgress currentStatus={selectedApplication.status} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

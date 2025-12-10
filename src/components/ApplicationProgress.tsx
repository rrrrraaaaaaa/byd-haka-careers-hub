import { Check, Clock, Circle, X, FileText, Users, Brain, ClipboardList, Shield, Gift, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ApplicationProgressProps {
  currentStatus: ApplicationStatus;
  className?: string;
}

const stages = [
  { id: 'submitted', label: 'Submitted', icon: FileText },
  { id: 'on_review', label: 'On Review', icon: Clock },
  { id: 'interview_hc', label: 'HR Interview', icon: Users },
  { id: 'interview_user', label: 'User Interview', icon: Users },
  { id: 'psikotes', label: 'Psychological Test', icon: Brain },
  { id: 'test_bidang', label: 'Technical Test', icon: ClipboardList },
  { id: 'assessment', label: 'Assessment', icon: ClipboardList },
  { id: 'background_check', label: 'Background Check', icon: Shield },
  { id: 'offering', label: 'Offering', icon: Gift },
  { id: 'onboarding', label: 'Onboarding', icon: Rocket },
];

const getStageIndex = (status: ApplicationStatus): number => {
  if (status === 'accepted') return stages.length;
  if (status === 'rejected') return -1;
  return stages.findIndex(s => s.id === status);
};

export function ApplicationProgress({ currentStatus, className }: ApplicationProgressProps) {
  const currentIndex = getStageIndex(currentStatus);
  const isRejected = currentStatus === 'rejected';
  const isAccepted = currentStatus === 'accepted';

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Application Progress</h3>
        <p className="text-sm text-muted-foreground">
          {isRejected 
            ? "We're sorry, your application was not successful this time." 
            : isAccepted 
              ? "Congratulations! Your application has been accepted!" 
              : "Track your application status below"}
        </p>
      </div>

      {/* Progress Steps - Vertical Timeline */}
      <div className="relative">
        {stages.map((stage, index) => {
          const isCompleted = !isRejected && currentIndex > index;
          const isCurrent = !isRejected && currentIndex === index;
          const isPending = isRejected || currentIndex < index;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative flex items-start gap-4 pb-8 last:pb-0">
              {/* Vertical Line */}
              {index < stages.length - 1 && (
                <div 
                  className={cn(
                    "absolute left-5 top-10 w-0.5 h-full -translate-x-1/2",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}

              {/* Circle/Icon */}
              <div 
                className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "bg-primary/10 border-primary text-primary animate-pulse",
                  isPending && !isRejected && "bg-muted border-border text-muted-foreground",
                  isRejected && "bg-muted border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  <Icon className="w-5 h-5" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1.5">
                <p 
                  className={cn(
                    "font-medium transition-colors",
                    isCompleted && "text-primary",
                    isCurrent && "text-foreground",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {stage.label}
                </p>
                {isCurrent && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Currently at this stage
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Final Status */}
        {(isAccepted || isRejected) && (
          <div className="relative flex items-start gap-4 pt-4 border-t border-border mt-4">
            <div 
              className={cn(
                "relative z-10 flex items-center justify-center w-10 h-10 rounded-full",
                isAccepted && "bg-primary text-primary-foreground",
                isRejected && "bg-destructive text-destructive-foreground"
              )}
            >
              {isAccepted ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </div>
            <div className="flex-1 pt-1.5">
              <p 
                className={cn(
                  "font-semibold",
                  isAccepted && "text-primary",
                  isRejected && "text-destructive"
                )}
              >
                {isAccepted ? "Accepted" : "Not Successful"}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isAccepted 
                  ? "Welcome to Haka Auto! We'll contact you soon." 
                  : "Thank you for your interest. Keep trying!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

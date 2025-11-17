import { MapPin, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface JobCardProps {
  position: string;
  branch: string;
  location: string;
  province: string;
  type?: string;
  onDetail?: () => void;
}

export function JobCard({
  position,
  branch,
  location,
  province,
  type = "Full Time",
  onDetail,
}: JobCardProps) {
  return (
    <Card className="group hover:shadow-strong hover:-translate-y-1 transition-all duration-300 bg-card border-border overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                {position}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-medium">{branch}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{location}, {province}</span>
              </div>
            </div>
            <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
              {type}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Posted: Today
            </div>
            <Button
              onClick={onDetail}
              size="sm"
              className="group-hover:shadow-medium transition-all bg-primary hover:bg-primary-glow"
            >
              Lihat Detail
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

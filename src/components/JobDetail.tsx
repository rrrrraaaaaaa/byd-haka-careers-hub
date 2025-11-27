import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobDescription } from "@/data/jobDescriptions";

interface JobDetailProps {
  position: string;
  branch: string;
  location: string;
  onBack: () => void;
  onApply: () => void;
}

export function JobDetail({ position, branch, location, onBack, onApply }: JobDetailProps) {
  const jobInfo = getJobDescription(position);
  return (
    <div className="animate-fade-in">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 text-primary hover:text-primary-glow"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Job Board
      </Button>

      <Card className="shadow-strong">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl lg:text-3xl text-primary mb-2">
                {position}
              </CardTitle>
              <p className="text-primary font-medium">{branch}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <img 
                src="/placeholder.svg" 
                alt="BYD Haka Logo" 
                className="h-12 w-auto"
              />
              <p className="text-xs text-center mt-2 text-primary font-medium">Company Profile</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 lg:p-8 space-y-6">
          {/* Notice Box */}
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-md">
            <p className="text-sm text-foreground leading-relaxed">
              Keseluruhan proses rekrutmen & seleksi tidak memungut biaya apapun. Hanya 
              kandidat sesuai kualifikasi yang akan diproses lebih lanjut, silahkan mengikuti 
              perkembangan proses seleksi Anda pada website ini
            </p>
          </div>

          {/* Job Location */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Lokasi Pekerjaan</h3>
            <p className="text-foreground">{location}</p>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Deskripsi Pekerjaan</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {jobInfo.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Benefit</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {jobInfo.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          {/* General Qualifications */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Kualifikasi Umum</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {jobInfo.generalQualifications.map((qual, index) => (
                <li key={index}>{qual}</li>
              ))}
            </ul>
          </div>

          {/* Specific Qualifications */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Kualifikasi Khusus</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {jobInfo.specificQualifications.map((qual, index) => (
                <li key={index}>{qual}</li>
              ))}
            </ul>
          </div>

          {/* Apply Button */}
          <div className="pt-4">
            <Button 
              onClick={onApply}
              size="lg"
              className="w-full lg:w-auto bg-primary hover:bg-primary-glow text-white font-semibold px-12 py-6 text-lg"
            >
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

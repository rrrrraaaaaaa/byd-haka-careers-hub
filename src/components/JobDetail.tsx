import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobDetailProps {
  position: string;
  branch: string;
  location: string;
  onBack: () => void;
  onApply: () => void;
}

export function JobDetail({ position, branch, location, onBack, onApply }: JobDetailProps) {
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
            <p className="text-muted-foreground leading-relaxed">
              Memastikan tercapainya target melalui penjualan kendaraan BYD sesuai prosedur, 
              yang didukung oleh pelayanan sesuai standar perusahaan serta kelengkapan dokumen kendaraan
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Benefit</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Jenjang Karir</li>
              <li>Insentif & Bonus</li>
            </ul>
          </div>

          {/* General Qualifications */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Kualifikasi Umum</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Usia maksimal 27 tahun</li>
              <li>Pend. min D3 atau SMA berpengalaman. Fresh graduate diperbolehkan melamar</li>
            </ul>
          </div>

          {/* Specific Qualifications */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Kualifikasi khusus</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Memiliki passion di bidang penjualan</li>
              <li>Berpenampilan menarik</li>
              <li>Memiliki kemampuan menjalin relasi dan analisa yang baik</li>
              <li>Memiliki kemampuan mengoperasikan Microsoft Office</li>
              <li>Diutamakan berdomisili di wilayah penempatan dan sekitarnya. (Pelamar diluar area tsb, silahkan cek kembali lowongan yang sesuai dengan kota/ domisili Anda.</li>
            </ul>
          </div>

          {/* Facilities & Benefits */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Fasilitas & Tunjangan</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>BPJS Ketenagakerjaan</li>
              <li>BPJS Kesehatan</li>
              <li>Tunjangan Makan</li>
              <li>Tunjangan Transportasi</li>
            </ul>
          </div>

          {/* Job Level */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Level jabatan : OJT</h3>
          </div>

          {/* Deadline */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Batas akhir pengumuman : 2025-11-30</h3>
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

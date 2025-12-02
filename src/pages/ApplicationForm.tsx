import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { jobsData } from "@/data/jobsData";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/application-success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav isPublic={false} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-primary hover:text-primary-glow"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="shadow-strong">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="text-2xl lg:text-3xl text-primary">
              Job Application Form
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Please fill out all required information to complete your application
            </p>
          </CardHeader>

          <CardContent className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Position Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Lowongan Tersedia</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Pilih Posisi *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih posisi yang Anda lamar" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobsData.filter(job => job.isOpen).map((job) => (
                        <SelectItem key={job.id} value={`${job.position} - ${job.branch}`}>
                          {job.position} - {job.branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job Information Source */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobSource">Dari mana Anda mendapatkan informasi loker ini? *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sumber informasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">Tiktok</SelectItem>
                      <SelectItem value="website">Website Career</SelectItem>
                      <SelectItem value="referral">Referensi</SelectItem>
                      <SelectItem value="other">Yang lain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Informasi Pribadi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap *</Label>
                    <Input id="fullName" placeholder="Masukkan nama lengkap Anda" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nik">NIK (National ID) *</Label>
                    <Input id="nik" placeholder="Masukkan NIK Anda" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon *</Label>
                    <Input id="phone" type="tel" placeholder="+62 xxx xxxx xxxx" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domicile">Alamat Domisili *</Label>
                  <Input 
                    id="domicile" 
                    placeholder="Kota dan Provinsi (Cth. Magelang-Jawa Tengah, Banjarmasin-Kalimantan Selatan)" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Usia *</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="Angka saja dalam Tahun" 
                      min="17" 
                      max="65" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jenis Kelamin *</Label>
                    <RadioGroup required>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">Laki-Laki</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">Perempuan</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Gaji yang diharapkan *</Label>
                  <Input 
                    id="expectedSalary" 
                    placeholder="Cth. 5.500.000, 6.200.000, 7.500.000 dst........" 
                    required 
                  />
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Pengalaman Kerja</h3>
                
                <div className="space-y-2">
                  <Label>Memiliki pengalaman di bidang otomotif *</Label>
                  <RadioGroup required>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="expYes" />
                      <Label htmlFor="expYes" className="font-normal cursor-pointer">YA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="expNo" />
                      <Label htmlFor="expNo" className="font-normal cursor-pointer">TIDAK</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsExp">Berapa lama pengalaman kerja yang sesuai dengan posisi yang Anda lamar *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih lama pengalaman" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1">&lt;1 Tahun</SelectItem>
                      <SelectItem value="1-3">1-3 Tahun</SelectItem>
                      <SelectItem value="3-5">3-5 Tahun</SelectItem>
                      <SelectItem value=">5">&gt;5 Tahun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Pendidikan</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="education">Pendidikan Terakhir *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pendidikan terakhir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sma">SMA / SMK</SelectItem>
                      <SelectItem value="d3">D3</SelectItem>
                      <SelectItem value="s1">S1</SelectItem>
                      <SelectItem value="s2">S2</SelectItem>
                      <SelectItem value="s3">S3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Dokumen</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="cv">Silahkan Upload CV terbaru Anda *</Label>
                  <Input 
                    id="cv" 
                    type="file" 
                    accept=".pdf" 
                    required 
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload 1 file yang didukung: PDF. Maks 100 MB.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paklaring">Silahkan Upload Paklaring (Surat keterangan pernah bekerja) terbaru Anda *</Label>
                  <Input 
                    id="paklaring" 
                    type="file" 
                    accept=".pdf" 
                    required 
                  />
                  <p className="text-xs text-muted-foreground">
                    *Bagi fresh graduate dan yang pertama kali bekerja bisa dilampirkan Ijazah / SKL
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload 1 file yang didukung: PDF. Maks 100 MB.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-glow px-8"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

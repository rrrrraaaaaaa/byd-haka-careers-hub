import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Validation schema
const applicationSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap harus diisi").max(100, "Nama terlalu panjang"),
  nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK harus berupa angka"),
  residentialAddress: z.string().min(3, "Alamat domisili harus diisi").max(200, "Alamat terlalu panjang"),
  cityProvince: z.string().min(3, "Kota dan Provinsi harus diisi"),
  dateOfBirth: z.string().min(1, "Tanggal lahir harus diisi"),
  gender: z.enum(["male", "female"], { required_error: "Pilih jenis kelamin" }),
  whatsappNumber: z.string().min(10, "Nomor WhatsApp tidak valid").regex(/^[0-9+]+$/, "Nomor WhatsApp harus berupa angka"),
  expectedSalary: z.number().positive("Masukkan gaji yang valid"),
  hasAutomotiveExperience: z.boolean(),
  workExperienceDuration: z.string().min(1, "Pilih lama pengalaman kerja"),
  educationLevel: z.string().min(1, "Pilih pendidikan terakhir"),
  infoSource: z.string().min(1, "Pilih sumber informasi"),
});

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  // Get job details from URL params
  const position = searchParams.get("position") || "";
  const branch = searchParams.get("branch") || "";
  const province = searchParams.get("province") || "";

  // Form state
  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [cityProvince, setCityProvince] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [hasAutomotiveExperience, setHasAutomotiveExperience] = useState<string>("");
  const [workExperienceDuration, setWorkExperienceDuration] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [infoSource, setInfoSource] = useState("");

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [paklaringFile, setPaklaringFile] = useState<File | null>(null);

  // Existing files from profile
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [paklaringUrl, setPaklaringUrl] = useState<string | null>(null);

  // Check authentication & Autofill
  useEffect(() => {
    const initData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Silahkan login untuk melamar pekerjaan",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email || "");

      // Autofill from Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setNik(profile.nik || "");
        setResidentialAddress(profile.residential_address || "");
        setCityProvince(profile.city_province || "");
        setDateOfBirth(profile.date_of_birth || "");
        setGender(profile.gender || "");
        setWhatsappNumber(profile.whatsapp_number || "");
        setExpectedSalary(profile.expected_salary?.toString() || "");
        setHasAutomotiveExperience(profile.has_automotive_experience ? "yes" : "no");
        setWorkExperienceDuration(profile.work_experience_duration || "");
        setEducationLevel(profile.education_level || "");
        setInfoSource(profile.info_source || "");
        // Files
        if (profile.cv_url) setCvUrl(profile.cv_url);
        if (profile.certificate_url) setPaklaringUrl(profile.certificate_url);
      }
    };
    initData();
  }, [navigate, toast]);

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    if (!userId) throw new Error("User not authenticated");

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('application-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Gagal mengupload ${folder}: ${uploadError.message}`);
    }

    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      navigate('/auth');
      return;
    }

    // Validate required files (If URL exists, file input is optional)
    if (!cvFile && !cvUrl) {
      toast({
        title: "CV Diperlukan",
        description: "Silahkan upload CV terbaru Anda",
        variant: "destructive",
      });
      return;
    }

    if (!paklaringFile && !paklaringUrl) {
      toast({
        title: "Paklaring Diperlukan",
        description: "Silahkan upload Paklaring / Ijazah Anda",
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes
    const maxSize = 5 * 1024 * 1024;
    if (cvFile && cvFile.size > maxSize) {
      toast({
        title: "File Terlalu Besar",
        description: "Ukuran CV maksimal 5MB",
        variant: "destructive",
      });
      return;
    }
    if (paklaringFile && paklaringFile.size > maxSize) {
      toast({
        title: "File Terlalu Besar",
        description: "Ukuran Paklaring maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    // Parse salary
    const parsedSalary = parseFloat(expectedSalary.replace(/[^0-9]/g, ''));

    // Validate form data
    const validationResult = applicationSchema.safeParse({
      fullName,
      nik,
      residentialAddress,
      cityProvince,
      dateOfBirth,
      gender,
      whatsappNumber,
      expectedSalary: parsedSalary,
      hasAutomotiveExperience: hasAutomotiveExperience === "yes",
      workExperienceDuration,
      educationLevel,
      infoSource,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast({
        title: "Validasi Gagal",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine final URLs (upload new or keep existing)
      let finalCvUrl = cvUrl;
      let finalPaklaringUrl = paklaringUrl;

      if (cvFile) {
        finalCvUrl = await uploadFile(cvFile, 'cv');
      }
      if (paklaringFile) {
        finalPaklaringUrl = await uploadFile(paklaringFile, 'certificate');
      }

      if (!finalCvUrl || !finalPaklaringUrl) {
        throw new Error("Gagal memproses dokumen");
      }

      // Insert application record
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          user_id: userId,
          position,
          branch,
          province,
          info_source: infoSource,

          // New/Renamed fields
          nik,
          whatsapp_number: whatsappNumber,
          date_of_birth: dateOfBirth,
          city_province: cityProvince,

          residential_address: residentialAddress,
          age: new Date().getFullYear() - new Date(dateOfBirth).getFullYear(), // Approximate

          gender,
          expected_salary: parsedSalary,
          has_automotive_experience: hasAutomotiveExperience === "yes",
          work_experience_duration: workExperienceDuration,
          education_level: educationLevel,
          cv_url: finalCvUrl,
          certificate_url: finalPaklaringUrl,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast({
        title: "Lamaran Terkirim",
        description: "Lamaran Anda berhasil dikirim!",
      });

      navigate("/application-success");
    } catch (error) {
      console.error("Application submission error:", error);
      toast({
        title: "Pengiriman Gagal",
        description: error instanceof Error ? error.message : "Gagal mengirim lamaran. Silahkan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          Kembali
        </Button>

        <Card className="shadow-strong">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="text-2xl lg:text-3xl text-primary">
              Formulir Lamaran Kerja
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Silahkan isi data diri Anda dengan lengkap dan benar
            </p>
            {position && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">
                  Posisi yang dilamar: <span className="text-primary">{position}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {branch}, {province}
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Data Pribadi</h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap *</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nik">NIK KTP *</Label>
                  <Input
                    id="nik"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="16 digit NIK"
                    required
                    maxLength={16}
                    pattern="\d{16}"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domicile">Alamat Domisili *</Label>
                  <Input
                    id="domicile"
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    placeholder="Alamat lengkap tempat tinggal saat ini"
                    required
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cityProvince">Kota dan Provinsi *</Label>
                  <Input
                    id="cityProvince"
                    value={cityProvince}
                    onChange={(e) => setCityProvince(e.target.value)}
                    placeholder="Cth. Magelang-Jawa Tengah, Banjarmasin-Kalimantan Selatan"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Tanggal Lahir *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jenis Kelamin *</Label>
                    <RadioGroup value={gender} onValueChange={setGender} required>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">Laki-laki</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">Perempuan</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    value={userEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Cth. 081234567890"
                    required
                    type="tel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Gaji yang diharapkan *</Label>
                  <Input
                    id="expectedSalary"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="Cth. 5.500.000, 6.200.000"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Masukkan angka nominal
                  </p>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Pengalaman Kerja</h3>

                <div className="space-y-2">
                  <Label>Memiliki pengalaman di bidang otomotif *</Label>
                  <RadioGroup value={hasAutomotiveExperience} onValueChange={setHasAutomotiveExperience} required>
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
                  <Select value={workExperienceDuration} onValueChange={setWorkExperienceDuration} required>
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
                  <Select value={educationLevel} onValueChange={setEducationLevel} required>
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

              {/* Job Info Source */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Informasi Lowongan</h3>
                <div className="space-y-2">
                  <Label htmlFor="jobSource">Darimana Anda mengetahui lowongan ini? *</Label>
                  <Select value={infoSource} onValueChange={setInfoSource} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sumber informasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="website">Website Karir</SelectItem>
                      <SelectItem value="referral">Referensi Teman/Karyawan</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Dokumen</h3>

                <div className="space-y-2">
                  <Label htmlFor="cv">Silahkan Upload CV terbaru Anda *</Label>
                  {cvUrl && (
                    <div className="text-sm text-green-600 mb-1 flex items-center">
                      ✓ CV sudah tersedia dari profil
                    </div>
                  )}
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    required={!cvUrl}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload 1 supported file: PDF. Max 5 MB.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paklaring">Silahkan Upload Paklaring (Surat keterangan pernah bekerja) terbaru Anda *</Label>
                  {paklaringUrl && (
                    <div className="text-sm text-green-600 mb-1 flex items-center">
                      ✓ Paklaring sudah tersedia dari profil
                    </div>
                  )}
                  <Input
                    id="paklaring"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPaklaringFile(e.target.files?.[0] || null)}
                    required={!paklaringUrl}
                  />
                  <p className="text-xs text-muted-foreground">
                    *Bagi fresh graduate dan yang pertama kali bekerja bisa dilampirkan Ijazah / SKL
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload 1 supported file: PDF. Max 5 MB.
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
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-glow px-8"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Lamaran"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

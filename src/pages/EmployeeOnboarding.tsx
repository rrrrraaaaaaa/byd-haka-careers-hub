import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import TopNav from "@/components/TopNav"; // Fixed import path
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

export default function EmployeeOnboarding() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

    // Register select fields manually for validation
    useEffect(() => {
        register("blood_type", { required: true });
        register("marital_status", { required: true });
        register("has_sim_a", { required: true });
        register("bpjs_cair_status", { required: true });
        register("emergency_contact_relation", { required: true });
    }, [register]);

    // File states
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        ktp: null,
        kk: null,
        npwp: null,
        bank: null,
        ijazah: null,
        offering: null
    });

    const [existingFiles, setExistingFiles] = useState<{ [key: string]: string | null }>({
        ktp: null,
        kk: null,
        npwp: null,
        bank: null,
        ijazah: null,
        offering: null
    });

    useEffect(() => {
        checkEligibility();
    }, []);

    const checkEligibility = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate("/auth");
            return;
        }

        setUserId(session.user.id);

        // Check application status
        const { data: appData } = await supabase
            .from("applications")
            .select("status")
            .eq("user_id", session.user.id)
            .in("status", ["offering", "onboarding", "accepted"])
            .maybeSingle();

        if (!appData) {
            toast.error("You are not eligible for this page.");
            navigate("/dashboard");
            return;
        }

        // Check if data already exists in EMPLOYEES table
        const { data: rawData } = await supabase
            .from("employees" as any)
            .select("*")
            .eq("user_id", session.user.id)
            .maybeSingle();

        const existingData = rawData as any;

        if (existingData) {
            Object.keys(existingData).forEach(key => {
                setValue(key, existingData[key]);
            });

            // Set existing file URLs
            setExistingFiles({
                ktp: existingData.ktp_url,
                kk: existingData.kk_url,
                npwp: existingData.npwp_url,
                bank: existingData.cover_buku_rekening_url,
                ijazah: existingData.ijazah_url,
                offering: existingData.offering_letter_url
            });
        }

        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
        }
    };

    const uploadFile = async (file: File, path: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${path}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('documents').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const onSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            // 1. Upload Files
            const fileUrls: any = {};

            const uploadPromises = Object.entries(files).map(async ([key, file]) => {
                if (file) {
                    const url = await uploadFile(file, key);
                    // Map key to DB column
                    if (key === 'bank') fileUrls['cover_buku_rekening_url'] = url;
                    else if (key === 'offering') fileUrls['offering_letter_url'] = url;
                    else fileUrls[`${key}_url`] = url;
                }
            });

            await Promise.all(uploadPromises);

            // 2. Insert/Update Data
            // We do not need to explicitly include existing URLs because we used upsert
            // However, Supabase upsert merges if we don't specify, but here we want to be safe.
            // If we don't send the column, it keeps the old value? Yes for partial update, but upsert usually requires all NOT NULL fields for new rows.
            // Since we are using upsert, for EXISTING rows, we can just send changed fields + PK/Unique Key.
            // But for NEW rows we need all fields.
            // So we send everything from `data` (which has prefilled values) + new `fileUrls`.

            const payload = {
                user_id: userId,
                ...data,
                ...fileUrls,
                children_count: parseInt(data.children_count) || 0,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from("employees" as any)
                .upsert(payload);

            if (error) throw error;

            toast.success("Data berhasil disimpan! (Data saved successfully)");
            // Refresh data to show updates
            checkEligibility();

        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to submit data");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50/50">
            <TopNav />

            <main className="container max-w-4xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Form Karyawan Baru</h1>
                    <p className="text-gray-500 mt-2">Silahkan lengkapi data berikut untuk proses onboarding.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* DATA PRIBADI */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl text-primary">DATA PRIBADI</CardTitle>
                            <p className="text-sm text-gray-500">
                                Pada bagian ini, anda diminta untuk mengisi data pribadi sehingga perlu menyiapkan : <br />
                                1. KTP <br />
                                2. KK <br />
                                3. NPWP (yang sudah di sinkronkan dengan NIK KTP) <br />
                                4. Rekening Bank Mandiri (payroll gaji)
                            </p>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>NOMOR WA AKTIF *</Label>
                                    <Input {...register("whatsapp_number", { required: true })} placeholder="08..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>EMAIL PRIBADI AKTIF *</Label>
                                    <Input {...register("email", { required: true })} type="email" />
                                </div>
                                <div className="space-y-2">
                                    <Label>NOMOR KTP *</Label>
                                    <Input {...register("ktp_number", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>NOMOR KARTU KELUARGA (KK) *</Label>
                                    <Input {...register("kk_number", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>NO. NPWP *</Label>
                                    <Input {...register("npwp_number", { required: true })} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>ALAMAT KTP *</Label>
                                    <Input {...register("ktp_address", { required: true })} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>ALAMAT DOMISILI *</Label>
                                    <Input {...register("domicile_address", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>TEMPAT LAHIR *</Label>
                                    <Input {...register("birth_place", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>TANGGAL LAHIR (YYYY-MM-DD)*</Label>
                                    <Input {...register("birth_date", { required: true })} type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label>AGAMA *</Label>
                                    <Input {...register("religion", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>GOLONGAN DARAH *</Label>
                                    <Select onValueChange={v => setValue("blood_type", v)} value={watch("blood_type") || ""}>
                                        <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">A</SelectItem>
                                            <SelectItem value="B">B</SelectItem>
                                            <SelectItem value="AB">AB</SelectItem>
                                            <SelectItem value="O">O</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>STATUS PERNIKAHAN *</Label>
                                    <Select onValueChange={v => setValue("marital_status", v)} value={watch("marital_status") || ""}>
                                        <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SINGLE">SINGLE</SelectItem>
                                            <SelectItem value="MENIKAH">MENIKAH</SelectItem>
                                            <SelectItem value="CERAI HIDUP">CERAI HIDUP</SelectItem>
                                            <SelectItem value="CERAI MENINGGAL">CERAI MENINGGAL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>JUMLAH ANAK</Label>
                                    <Input {...register("children_count")} type="number" defaultValue={0} />
                                </div>
                                <div className="space-y-2">
                                    <Label>SIM A *</Label>
                                    <Select onValueChange={v => setValue("has_sim_a", v)} value={watch("has_sim_a") || ""}>
                                        <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PUNYA">PUNYA</SelectItem>
                                            <SelectItem value="TIDAK PUNYA">TIDAK PUNYA</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>APAKAH SAUDARA/I SEDANG PROSES PENCAIRAN BPJS KETENAGAKERJAAN? *</Label>
                                    <Select onValueChange={v => setValue("bpjs_cair_status", v)} value={watch("bpjs_cair_status") || ""}>
                                        <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ya">Ya</SelectItem>
                                            <SelectItem value="Tidak">Tidak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <Separator className="mb-4" />
                                    <h3 className="font-semibold mb-4">Data Rekening (Payroll)</h3>
                                </div>

                                <div className="space-y-2">
                                    <Label>NAMA BANK *</Label>
                                    <Input {...register("bank_name", { required: true })} defaultValue="Mandiri" />
                                </div>
                                <div className="space-y-2">
                                    <Label>NOMOR REKENING BANK *</Label>
                                    <Input {...register("bank_account_number", { required: true })} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>NAMA PEMEGANG REKENING *</Label>
                                    <Input {...register("bank_account_holder", { required: true })} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* KETERANGAN KELUARGA */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl text-primary">KETERANGAN KELUARGA</CardTitle>
                            <p className="text-sm text-gray-500">Pada bagian ini, anda diminta untuk mengisi hal-hal yang berkaitan dengan data keluarga</p>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>NAMA LENGKAP KONTAK DARURAT *</Label>
                                    <Input {...register("emergency_contact_name", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>HUBUNGAN DENGAN KONTAK DARURAT *</Label>
                                    <Select onValueChange={v => setValue("emergency_contact_relation", v)} value={watch("emergency_contact_relation") || ""}>
                                        <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SUAMI">SUAMI</SelectItem>
                                            <SelectItem value="ISTRI">ISTRI</SelectItem>
                                            <SelectItem value="ANAK">ANAK</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>NO TELP KONTAK DARURAT *</Label>
                                    <Input {...register("emergency_contact_phone", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    {/* Empty Spacer */}
                                </div>
                                <div className="space-y-2">
                                    <Label>NAMA AYAH *</Label>
                                    <Input {...register("father_name", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>NAMA IBU *</Label>
                                    <Input {...register("mother_name", { required: true })} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>RIWAYAT PENYAKIT *</Label>
                                    <Input {...register("medical_history", { required: true })} placeholder="Tulis '-' jika tidak ada" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* KELENGKAPAN BERKAS */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl text-primary">KELENGKAPAN BERKAS</CardTitle>
                            <p className="text-sm text-gray-500">Pada bagian ini, anda diminta untuk mengupload beberapa berkas</p>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Foto NPWP *</Label>
                                    <p className="text-xs text-muted-foreground">WAJIB SCREENSHOOT HALAMAN UTAMA DJP ONLINE</p>
                                    <div className="border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer text-center">
                                        <Input type="file" className="hidden" id="npwp-upload" onChange={(e) => handleFileChange(e, 'npwp')} accept="image/*,.pdf" />
                                        <Label htmlFor="npwp-upload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {files.npwp ? files.npwp.name : (existingFiles.npwp ? "Ganti File (Sudah ada)" : "Click to upload")}
                                            </span>
                                        </Label>
                                    </div>
                                    {existingFiles.npwp && (
                                        <a href={existingFiles.npwp} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                                            Lihat File Saat Ini
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Foto KTP *</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer text-center">
                                        <Input type="file" className="hidden" id="ktp-upload" onChange={(e) => handleFileChange(e, 'ktp')} accept="image/*,.pdf" />
                                        <Label htmlFor="ktp-upload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {files.ktp ? files.ktp.name : (existingFiles.ktp ? "Ganti File (Sudah ada)" : "Click to upload")}
                                            </span>
                                        </Label>
                                    </div>
                                    {existingFiles.ktp && (
                                        <a href={existingFiles.ktp} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                                            Lihat File Saat Ini
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Foto Kartu Keluarga *</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer text-center">
                                        <Input type="file" className="hidden" id="kk-upload" onChange={(e) => handleFileChange(e, 'kk')} accept="image/*,.pdf" />
                                        <Label htmlFor="kk-upload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {files.kk ? files.kk.name : (existingFiles.kk ? "Ganti File (Sudah ada)" : "Click to upload")}
                                            </span>
                                        </Label>
                                    </div>
                                    {existingFiles.kk && (
                                        <a href={existingFiles.kk} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                                            Lihat File Saat Ini
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Foto Cover Buku Rekening *</Label>
                                    <p className="text-xs text-muted-foreground">Atau Screenshot Mbanking (Harus ada No Rek & Nama)</p>
                                    <div className="border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer text-center">
                                        <Input type="file" className="hidden" id="bank-upload" onChange={(e) => handleFileChange(e, 'bank')} accept="image/*,.pdf" />
                                        <Label htmlFor="bank-upload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {files.bank ? files.bank.name : (existingFiles.bank ? "Ganti File (Sudah ada)" : "Click to upload")}
                                            </span>
                                        </Label>
                                    </div>
                                    {existingFiles.bank && (
                                        <a href={existingFiles.bank} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                                            Lihat File Saat Ini
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Foto Ijazah Terakhir *</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer text-center">
                                        <Input type="file" className="hidden" id="ijazah-upload" onChange={(e) => handleFileChange(e, 'ijazah')} accept="image/*,.pdf" />
                                        <Label htmlFor="ijazah-upload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {files.ijazah ? files.ijazah.name : (existingFiles.ijazah ? "Ganti File (Sudah ada)" : "Click to upload")}
                                            </span>
                                        </Label>
                                    </div>
                                    {existingFiles.ijazah && (
                                        <a href={existingFiles.ijazah} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                                            Lihat File Saat Ini
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Offering Letter (Signed) *</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer text-center">
                                        <Input type="file" className="hidden" id="offering-upload" onChange={(e) => handleFileChange(e, 'offering')} accept="image/*,.pdf" />
                                        <Label htmlFor="offering-upload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {files.offering ? files.offering.name : (existingFiles.offering ? "Ganti File (Sudah ada)" : "Click to upload")}
                                            </span>
                                        </Label>
                                    </div>
                                    {existingFiles.offering && (
                                        <a href={existingFiles.offering} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                                            Lihat File Saat Ini
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                        {submitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : "Submit Data"}
                    </Button>

                </form>
            </main>
        </div>
    );
}

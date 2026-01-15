import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import TopNav from "@/components/TopNav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import authIllustration from "@/assets/auth-illustration.png";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  nik: z.string().length(16, "NIK must be 16 digits").regex(/^\d+$/, "NIK must be numbers"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  residentialAddress: z.string().min(3, "Address required"),
  cityProvince: z.string().min(3, "City/Province required"),
  dateOfBirth: z.string().min(1, "Date of birth required"),
  gender: z.enum(["male", "female"], { required_error: "Gender required" }),
  whatsappNumber: z.string().min(10, "Valid WhatsApp number required"),
  expectedSalary: z.number().positive("Valid salary required"),
  hasAutomotiveExperience: z.boolean(),
  workExperienceDuration: z.string().min(1, "Experience duration required"),
  educationLevel: z.string().min(1, "Education level required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "register");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(mode !== "register");
  }, [mode]);

  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register form state
  const [nik, setNik] = useState("");
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [residentialAddress, setResidentialAddress] = useState("");
  const [cityProvince, setCityProvince] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [hasAutomotiveExperience, setHasAutomotiveExperience] = useState<string>("");
  const [workExperienceDuration, setWorkExperienceDuration] = useState("");

  const [educationLevel, setEducationLevel] = useState("");

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);



  const [cvFile, setCvFile] = useState<File | null>(null);
  const [paklaringFile, setPaklaringFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const checkUserRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (data) {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkUserRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        checkUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = loginSchema.parse({ email, password });
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) throw error;

      toast.success("Login successful!");
      // Navigation handled by useEffect
    } catch (error: any) {
      console.error("Login Check Error:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        // Check for specific Supabase errors
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please verify your email address before logging in.");
        } else if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password.");
        } else {
          toast.error(error.message || "An error occurred during login");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (userId: string, file: File, folder: string, bucket: string = 'application-documents'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Failed to upload ${folder}: ${uploadError.message}`);
    }

    return fileName;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Custom validation for files
    if (!cvFile) {
      toast.error("Please upload your CV");
      return;
    }
    if (!paklaringFile) {
      toast.error("Please upload your Paklaring/Certificate");
      return;
    }
    if (!photoFile) {
      toast.error("Please upload your Pass Foto");
      return;
    }

    try {
      const parsedSalary = parseFloat(expectedSalary.replace(/[^0-9]/g, ''));

      const validated = registerSchema.parse({
        nik,
        fullName,
        email: registerEmail,
        password: registerPassword,
        confirmPassword,
        residentialAddress,
        cityProvince,
        dateOfBirth,
        gender,
        whatsappNumber,
        expectedSalary: parsedSalary,
        hasAutomotiveExperience: hasAutomotiveExperience === "yes",
        workExperienceDuration,
        educationLevel,
      });

      setLoading(true);

      // 1. Generate Temp ID for File Uploads (Since we don't have user ID yet)
      const tempId = self.crypto.randomUUID();

      // 2. Upload Files FIRST
      let cvUrl = "";
      let paklaringUrl = "";
      let photoUrl = "";

      try {
        // Upload immediately using the temp ID
        // Note: RLS must allow public INSERT for this to work
        cvUrl = await uploadFile(tempId, cvFile!, 'cv', 'application-documents');
        paklaringUrl = await uploadFile(tempId, paklaringFile!, 'certificate', 'application-documents');
        photoUrl = await uploadFile(tempId, photoFile!, 'photos', 'avatars');

      } catch (fileError: any) {
        console.error("Pre-registration file upload failed:", fileError);
        toast.error(`File upload failed: ${fileError.message}. Please try again.`);
        setLoading(false);
        return; // Stop registration if files fail
      }

      const metadata = {
        nik: validated.nik,
        full_name: validated.fullName,
        residential_address: validated.residentialAddress,
        city_province: validated.cityProvince,
        date_of_birth: validated.dateOfBirth,
        gender: validated.gender,
        whatsapp_number: validated.whatsappNumber,
        expected_salary: validated.expectedSalary,
        has_automotive_experience: validated.hasAutomotiveExperience,
        work_experience_duration: validated.workExperienceDuration,
        education_level: validated.educationLevel,
        // Pass the uploaded file URLs to metadata
        cv_url: cvUrl,
        certificate_url: paklaringUrl,
        avatar_url: photoUrl,
        info_source: "website",
      };

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: metadata,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        toast.success("Registration successful! Please check your email to verify your account.");
        // Reset form? Or just wait for redirect logic if applicable, but usually verification is needed.
        setIsLogin(true); // Switch to login view
      }

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset link sent! Please check your email.");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav isPublic={true} />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-white sticky top-[64px] h-[calc(100vh-64px)]">
          <div className="max-w-xl">
            <img
              src={authIllustration}
              alt="Haka Auto Talent Hunt"
              className="w-full h-auto object-contain animate-fade-in"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 bg-white p-6 lg:p-12">
          <div className={`w-full ${isLogin ? 'max-w-md' : 'max-w-2xl'} space-y-8 animate-fade-in m-auto`}>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-primary tracking-tight">
                {isLogin ? "Login" : "Register"}
              </h2>
              {/* <p className="text-muted-foreground">
                {isLogin ? "Welcome back!" : "Create your account"}
              </p> */}
            </div>

            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
              {isLogin ? (
                /* LOGIN FORM */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">KTP Number (NIK) / Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email or NIK"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              ) : (
                /* REGISTER FORM */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SAME REGISTER FIELDS BUT STYLED */}
                  <div className="space-y-4">
                    {/* Account & Personal */}
                    <div className="space-y-2">
                      <Label htmlFor="regEmail">Email *</Label>
                      <Input
                        id="regEmail"
                        type="email"
                        value={registerEmail}
                        onChange={e => setRegisterEmail(e.target.value)}
                        required
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nik">NIK KTP (16 Digits) *</Label>
                      <Input id="nik" value={nik} onChange={e => setNik(e.target.value)} maxLength={16} required className="bg-gray-50 border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value.toUpperCase())} required className="bg-gray-50 border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regPass">Password *</Label>
                      <Input id="regPass" type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required className="bg-gray-50 border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regConfirm">Confirm Password *</Label>
                      <Input id="regConfirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="bg-gray-50 border-gray-200" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Details */}
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                      <Input id="whatsapp" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} type="tel" required className="bg-gray-50 border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input id="dob" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required className="bg-gray-50 border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender *</Label>
                      <Select value={gender} onValueChange={setGender} required>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City & Province *</Label>
                      <Input id="city" value={cityProvince} onChange={e => setCityProvince(e.target.value.toUpperCase())} placeholder="e.g. Jakarta" required className="bg-gray-50 border-gray-200" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input id="address" value={residentialAddress} onChange={e => setResidentialAddress(e.target.value.toUpperCase())} required className="bg-gray-50 border-gray-200" />
                    </div>
                  </div>

                  {/* Full width fields for complex sections */}
                  <div className="col-span-1 md:col-span-2 space-y-4 border-t pt-4 mt-2">
                    <h3 className="font-semibold text-gray-900">Experience & Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="salary">Expected Salary *</Label>
                        <Input id="salary" value={expectedSalary} onChange={e => setExpectedSalary(e.target.value)} required className="bg-gray-50 border-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label>Education Level *</Label>
                        <Select value={educationLevel} onValueChange={setEducationLevel} required>
                          <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select Level" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sma">SMA/SMK</SelectItem>
                            <SelectItem value="d3">D3</SelectItem>
                            <SelectItem value="s1">S1</SelectItem>
                            <SelectItem value="s2">S2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Experience Duration *</Label>
                        <Select value={workExperienceDuration} onValueChange={setWorkExperienceDuration} required>
                          <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select Duration" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<1">&lt; 1 Year</SelectItem>
                            <SelectItem value="1-3">1 - 3 Years</SelectItem>
                            <SelectItem value="3-5">3 - 5 Years</SelectItem>
                            <SelectItem value=">5">&gt; 5 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Automotive Experience? *</Label>
                        <Select value={hasAutomotiveExperience} onValueChange={setHasAutomotiveExperience} required>
                          <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-gray-900">Documents</h3>
                    <div className="space-y-2">
                      <Label>CV (PDF, Max 5MB) *</Label>
                      <Input type="file" accept=".pdf" onChange={e => setCvFile(e.target.files?.[0] || null)} required className="bg-gray-50 border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label>Experience Certificate / Paklaring (PDF) *</Label>
                      <Input type="file" accept=".pdf" onChange={e => setPaklaringFile(e.target.files?.[0] || null)} required className="bg-gray-50 border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label>Passport Photo (Image) *</Label>
                      <Input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files?.[0] || null)} required className="bg-gray-50 border-gray-200" />
                    </div>
                  </div>

                </div>
              )}

              <div className="space-y-4 pt-2">
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                  {loading ? "Processing..." : isLogin ? "Login" : "Register"}
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-primary">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </span>
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => setIsLogin(!isLogin)}
                    className="bg-primary hover:bg-primary/90 text-white min-w-[100px]"
                  >
                    {isLogin ? "Register" : "Login"}
                  </Button>
                </div>
              </div>
            </form>


          </div>
        </div>
      </div>
      <Footer />

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email</Label>
              <Input
                id="resetEmail"
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={resetLoading}>
                {resetLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

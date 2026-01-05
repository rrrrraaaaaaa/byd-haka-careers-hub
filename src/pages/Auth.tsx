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

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [paklaringFile, setPaklaringFile] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/job-board");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/job-board");
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
      navigate("/job-board");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (userId: string, file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('application-documents')
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
    if (!isLogin) {
      if (!cvFile) {
        toast.error("Please upload your CV");
        return;
      }
      if (!paklaringFile) {
        toast.error("Please upload your Paklaring/Certificate");
        return;
      }
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

      // 1. Sign Up
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
        // 2. Upload Files (Only if session is active)
        if (authData.session) {
          try {
            const cvUrl = await uploadFile(authData.user.id, cvFile!, 'cv');
            const paklaringUrl = await uploadFile(authData.user.id, paklaringFile!, 'certificate');

            // 3. Update Profile with File URLs
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                cv_url: cvUrl,
                certificate_url: paklaringUrl,
                // We update these again just in case, but they are already in metadata -> profile via trigger
              })
              .eq('user_id', authData.user.id);

            if (updateError) throw updateError;

            toast.success("Registration successful! Complete.");
            navigate("/job-board");
          } catch (fileError) {
            console.error("File upload failed:", fileError);
            toast.success("Account created, but file upload failed. Please login to upload documents.");
            navigate("/job-board");
          }
        } else {
          // No session (email verification required)
          toast.success("Registration successful! Please check your email to verify your account.");
          // Profile data is saved via trigger. Files must be uploaded later.
        }
      }

    } catch (error) {
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

  return (
    <div className="min-h-screen bg-background">
      <TopNav isPublic={true} />

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className={`w-full ${isLogin ? 'max-w-md' : 'max-w-4xl'} space-y-6 transition-all duration-300`}>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-primary">
              {isLogin ? "Login" : "Register"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Welcome back to Haka Auto Talent Hunt!" : "Start your career journey with us"}
            </p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
            {isLogin ? (
              /* LOGIN FORM */
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              /* RICH REGISTER FORM */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT COLUMN: Account & Personal */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Account & Personal</h3>

                  <div className="space-y-2">
                    <Label htmlFor="regEmail">Email *</Label>
                    <Input id="regEmail" type="email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regPass">Password *</Label>
                    <Input id="regPass" type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regConfirm">Confirm Password *</Label>
                    <Input id="regConfirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nik">NIK KTP (16 Digits) *</Label>
                    <Input id="nik" value={nik} onChange={e => setNik(e.target.value)} maxLength={16} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input id="dob" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <RadioGroup value={gender} onValueChange={setGender} required className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* RIGHT COLUMN: Details & Docs */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Experience & Documents</h3>

                  <div className="space-y-2">
                    <Label htmlFor="address">Residential Address *</Label>
                    <Input id="address" value={residentialAddress} onChange={e => setResidentialAddress(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City & Province *</Label>
                    <Input id="city" value={cityProvince} onChange={e => setCityProvince(e.target.value)} placeholder="e.g. Magelang-Jawa Tengah" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                    <Input id="whatsapp" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} type="tel" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Expected Salary *</Label>
                    <Input id="salary" value={expectedSalary} onChange={e => setExpectedSalary(e.target.value)} placeholder="e.g. 5500000" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Automotive Experience?</Label>
                    <RadioGroup value={hasAutomotiveExperience} onValueChange={setHasAutomotiveExperience} required className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="expYes" />
                        <Label htmlFor="expYes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="expNo" />
                        <Label htmlFor="expNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Experience Duration</Label>
                    <Select value={workExperienceDuration} onValueChange={setWorkExperienceDuration} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<1">&lt;1 Year</SelectItem>
                        <SelectItem value="1-3">1-3 Years</SelectItem>
                        <SelectItem value="3-5">3-5 Years</SelectItem>
                        <SelectItem value=">5">&gt;5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Education</Label>
                    <Select value={educationLevel} onValueChange={setEducationLevel} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education" />
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

                  <div className="space-y-2">
                    <Label>CV (PDF, Max 5MB) *</Label>
                    <Input type="file" accept=".pdf" onChange={e => setCvFile(e.target.files?.[0] || null)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Paklaring / Ijazah (PDF, Max 5MB) *</Label>
                    <Input type="file" accept=".pdf" onChange={e => setPaklaringFile(e.target.files?.[0] || null)} required />
                  </div>

                </div>
              </div>
            )}

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Register & Create Profile"}
            </Button>

            <div className="text-center text-sm pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

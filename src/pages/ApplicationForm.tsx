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
  infoSource: z.string().min(1, "Please select how you found this job"),
  residentialAddress: z.string().min(3, "Please enter your residential address").max(200, "Address is too long"),
  age: z.number().int().min(17, "Minimum age is 17").max(65, "Maximum age is 65"),
  gender: z.enum(["male", "female"], { required_error: "Please select your gender" }),
  expectedSalary: z.number().positive("Please enter a valid salary"),
  hasAutomotiveExperience: z.boolean(),
  workExperienceDuration: z.string().min(1, "Please select your work experience"),
  educationLevel: z.string().min(1, "Please select your education level"),
});

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get job details from URL params
  const position = searchParams.get("position") || "";
  const branch = searchParams.get("branch") || "";
  const province = searchParams.get("province") || "";

  // Form state
  const [infoSource, setInfoSource] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [hasAutomotiveExperience, setHasAutomotiveExperience] = useState<string>("");
  const [workExperienceDuration, setWorkExperienceDuration] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please login to submit your application",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);
    };
    checkAuth();
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
      throw new Error(`Failed to upload ${folder}: ${uploadError.message}`);
    }

    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an application",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // Validate required files
    if (!cvFile) {
      toast({
        title: "CV Required",
        description: "Please upload your CV",
        variant: "destructive",
      });
      return;
    }

    if (!certificateFile) {
      toast({
        title: "Certificate Required", 
        description: "Please upload your employment certificate or diploma",
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (cvFile.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "CV must be less than 100MB",
        variant: "destructive",
      });
      return;
    }
    if (certificateFile.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Certificate must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    // Parse salary (remove commas and parse as number)
    const parsedSalary = parseFloat(expectedSalary.replace(/,/g, ''));

    // Validate form data
    const validationResult = applicationSchema.safeParse({
      infoSource,
      residentialAddress,
      age: parseInt(age, 10),
      gender,
      expectedSalary: parsedSalary,
      hasAutomotiveExperience: hasAutomotiveExperience === "yes",
      workExperienceDuration,
      educationLevel,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files
      const cvUrl = await uploadFile(cvFile, 'cv');
      const certificateUrl = await uploadFile(certificateFile, 'certificate');

      // Insert application record
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          user_id: userId,
          position,
          branch,
          province,
          info_source: infoSource,
          residential_address: residentialAddress,
          age: parseInt(age, 10),
          gender,
          expected_salary: parsedSalary,
          has_automotive_experience: hasAutomotiveExperience === "yes",
          work_experience_duration: workExperienceDuration,
          education_level: educationLevel,
          cv_url: cvUrl,
          certificate_url: certificateUrl,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted!",
      });
      
      navigate("/application-success");
    } catch (error) {
      console.error("Application submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
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
            {position && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">
                  Applying for: <span className="text-primary">{position}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {branch}, {province}
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Information Source */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobSource">How did you find out about this job? *</Label>
                  <Select value={infoSource} onValueChange={setInfoSource} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select information source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="website">Career Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="domicile">Residential Address *</Label>
                  <Input 
                    id="domicile" 
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    placeholder="City and Province (e.g., Jakarta-DKI Jakarta, Surabaya-East Java)" 
                    required 
                    maxLength={200}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input 
                      id="age" 
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter your age in years" 
                      min="17" 
                      max="65" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <RadioGroup value={gender} onValueChange={setGender} required>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Expected Salary *</Label>
                  <Input 
                    id="expectedSalary"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="e.g., 5500000 or 6200000" 
                    required 
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter numbers only (e.g., 5500000 for Rp 5,500,000)
                  </p>
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
                
                <div className="space-y-2">
                  <Label>Do you have experience in the automotive industry? *</Label>
                  <RadioGroup value={hasAutomotiveExperience} onValueChange={setHasAutomotiveExperience} required>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="expYes" />
                      <Label htmlFor="expYes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="expNo" />
                      <Label htmlFor="expNo" className="font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsExp">How long is your relevant work experience for this position? *</Label>
                  <Select value={workExperienceDuration} onValueChange={setWorkExperienceDuration} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1">&lt;1 Year</SelectItem>
                      <SelectItem value="1-3">1-3 Years</SelectItem>
                      <SelectItem value="3-5">3-5 Years</SelectItem>
                      <SelectItem value=">5">&gt;5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Education</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="education">Highest Education Level *</Label>
                  <Select value={educationLevel} onValueChange={setEducationLevel} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sma">High School / Vocational</SelectItem>
                      <SelectItem value="d3">Diploma (D3)</SelectItem>
                      <SelectItem value="s1">Bachelor's Degree (S1)</SelectItem>
                      <SelectItem value="s2">Master's Degree (S2)</SelectItem>
                      <SelectItem value="s3">Doctoral Degree (S3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Documents</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="cv">Please upload your latest CV *</Label>
                  <Input 
                    id="cv" 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    required 
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload 1 supported file: PDF. Max 100 MB.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paklaring">Please upload your Employment Certificate *</Label>
                  <Input 
                    id="paklaring" 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                    required 
                  />
                  <p className="text-xs text-muted-foreground">
                    *For fresh graduates or first-time workers, please attach your Diploma or Graduation Letter
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload 1 supported file: PDF. Max 100 MB.
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

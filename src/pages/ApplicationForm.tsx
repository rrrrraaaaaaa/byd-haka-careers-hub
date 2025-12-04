import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
              {/* Job Information Source */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobSource">How did you find out about this job? *</Label>
                  <Select required>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" placeholder="Enter your full name" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nik">NIK (National ID) *</Label>
                    <Input id="nik" placeholder="Enter your NIK" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="+62 xxx xxxx xxxx" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domicile">Residential Address *</Label>
                  <Input 
                    id="domicile" 
                    placeholder="City and Province (e.g., Jakarta-DKI Jakarta, Surabaya-East Java)" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="Enter your age in years" 
                      min="17" 
                      max="65" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <RadioGroup required>
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
                    placeholder="e.g., 5,500,000 / 6,200,000 / 7,500,000" 
                    required 
                  />
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
                
                <div className="space-y-2">
                  <Label>Do you have experience in the automotive industry? *</Label>
                  <RadioGroup required>
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
                  <Select required>
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
                  <Select required>
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
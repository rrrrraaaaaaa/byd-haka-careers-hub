import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });
      setIsSubmitting(false);
      navigate("/dashboard");
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
                  <Label htmlFor="address">Address *</Label>
                  <Textarea id="address" placeholder="Enter your complete address" required />
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Education</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Last Education *</Label>
                    <Input id="education" placeholder="e.g., Bachelor's Degree" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="major">Major/Field of Study *</Label>
                    <Input id="major" placeholder="e.g., Business Administration" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution Name *</Label>
                  <Input id="institution" placeholder="University/School name" required />
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="lastPosition">Last Position</Label>
                  <Input id="lastPosition" placeholder="Your last job title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastCompany">Last Company</Label>
                  <Input id="lastCompany" placeholder="Company name" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExp">Years of Experience</Label>
                    <Input id="yearsExp" type="number" placeholder="0" min="0" />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to join BYD Haka? *</Label>
                  <Textarea 
                    id="motivation" 
                    placeholder="Tell us about your motivation..." 
                    rows={4}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cv">Upload CV/Resume *</Label>
                  <Input id="cv" type="file" accept=".pdf,.doc,.docx" required />
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
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

import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, Award, TrendingUp } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopNav isPublic={true} />
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-4">
              Welcome to Haka Auto Talent Hunt
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Join Indonesia's leading automotive dealership network. Build your career with us and drive innovation in the electric vehicle revolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/lowongan')}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                <Briefcase className="mr-2 h-5 w-5" />
                View Open Positions
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/tentang-kami')}
                className="w-full sm:w-auto"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">35+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Branch Locations</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">500+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Team Members</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">15+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Provinces</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">20+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Career Paths</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Join Haka Auto?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center space-y-4 p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Dynamic Team Culture</h3>
              <p className="text-muted-foreground">
                Work with passionate professionals in a collaborative environment that values innovation and growth.
              </p>
            </div>
            <div className="text-center space-y-4 p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Career Development</h3>
              <p className="text-muted-foreground">
                Access comprehensive training programs and clear career progression pathways to reach your full potential.
              </p>
            </div>
            <div className="text-center space-y-4 p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Industry Leader</h3>
              <p className="text-muted-foreground">
                Be part of Indonesia's fastest-growing automotive network at the forefront of electric vehicle technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold px-4">Ready to Start Your Journey?</h2>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            Explore our current openings and find the perfect role that matches your skills and aspirations.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/lowongan')}
            className="w-full sm:w-auto mx-4"
          >
            Browse Open Positions
          </Button>
        </div>
      </section>
    </div>
  );
}

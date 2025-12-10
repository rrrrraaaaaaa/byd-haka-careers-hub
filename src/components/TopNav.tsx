import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import hakaLogo from "@/assets/haka-logo.png";

interface TopNavProps {
  isPublic?: boolean;
}

export default function TopNav({ isPublic = false }: TopNavProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    } else {
      toast.success("Successfully logged out");
    }
  };

  const publicNavItems = [
    { to: "/", label: "Home" },
    { to: "/lowongan", label: "Careers" },
    { to: "/tentang-kami", label: "About Us" },
    { to: "/kontak-kami", label: "Contact" },
  ];

  const authNavItems = [
    { to: "/job-board", label: "Job Board" },
    { to: "/applications", label: "Applications" },
  ];

  const navItems = isPublic ? publicNavItems : authNavItems;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={hakaLogo} 
              alt="Haka Auto" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.to
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isPublic ? (
              <>
                <Link
                  to="/auth?mode=register"
                  className="text-sm font-medium transition-colors hover:text-primary text-foreground"
                >
                  Register
                </Link>
                <Link
                  to="/auth"
                  className="text-sm font-medium transition-colors hover:text-primary text-foreground"
                >
                  Login
                </Link>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isPublic ? (
                <>
                  <Link
                    to="/auth?mode=register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

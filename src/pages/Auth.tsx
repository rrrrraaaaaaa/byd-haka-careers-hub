import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

const registerSchema = z.object({
  nik: z.string().min(16, { message: "NIK harus 16 digit" }).max(16, { message: "NIK harus 16 digit" }),
  fullName: z.string().min(3, { message: "Nama lengkap minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form
  const [registerNik, setRegisterNik] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = loginSchema.parse({ email: loginEmail, password: loginPassword });
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) throw error;
      
      toast.success("Login berhasil!");
      navigate("/");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = registerSchema.parse({
        nik: registerNik,
        fullName: registerFullName,
        email: registerEmail,
        password: registerPassword,
        confirmPassword: registerConfirmPassword,
      });
      
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            nik: validated.nik,
            full_name: validated.fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
      
      toast.success("Registrasi berhasil! Silakan login.");
      setIsLogin(true);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-byd-green">BYD HAKA</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-foreground hover:text-byd-green transition-colors">Beranda</a>
              <a href="#" className="text-foreground hover:text-byd-green transition-colors">Lowongan</a>
              <a href="#" className="text-foreground hover:text-byd-green transition-colors">Tentang Kami</a>
              <a href="#" className="text-foreground hover:text-byd-green transition-colors">Registrasi</a>
              <a href="#" className="text-byd-green font-semibold">Login</a>
              <a href="#" className="text-foreground hover:text-byd-green transition-colors">Kontak Kami</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Illustration */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-full max-w-md">
              <svg viewBox="0 0 400 400" className="w-full h-auto">
                {/* Background circles */}
                <circle cx="200" cy="200" r="180" fill="#f0f9ff" opacity="0.5"/>
                <circle cx="200" cy="200" r="140" fill="#e0f2fe" opacity="0.5"/>
                
                {/* Person illustration */}
                <g transform="translate(120, 180)">
                  {/* Body */}
                  <ellipse cx="80" cy="120" rx="60" ry="80" fill="#10b981"/>
                  
                  {/* Head */}
                  <ellipse cx="80" cy="40" rx="35" ry="40" fill="#fde68a"/>
                  
                  {/* Hair */}
                  <path d="M 60 20 Q 50 10 45 25 Q 40 15 40 30 Q 45 20 50 35" fill="#1f2937"/>
                  <path d="M 100 20 Q 110 10 115 25 Q 120 15 120 30" fill="#1f2937"/>
                  
                  {/* Glasses */}
                  <circle cx="70" cy="42" r="8" fill="none" stroke="#1f2937" strokeWidth="2"/>
                  <circle cx="90" cy="42" r="8" fill="none" stroke="#1f2937" strokeWidth="2"/>
                  <line x1="78" y1="42" x2="82" y2="42" stroke="#1f2937" strokeWidth="2"/>
                  
                  {/* Laptop */}
                  <rect x="40" y="140" width="80" height="50" rx="3" fill="#1f2937"/>
                  <rect x="45" y="145" width="70" height="40" fill="#3b82f6"/>
                </g>
                
                {/* Security shield */}
                <g transform="translate(280, 180)">
                  <path d="M 0 0 L -20 10 L -20 40 Q -20 60 0 70 Q 20 60 20 40 L 20 10 Z" fill="#10b981"/>
                  <path d="M 0 15 L -12 22 L -12 40 Q -12 52 0 58 Q 12 52 12 40 L 12 22 Z" fill="#064e3b"/>
                  {/* Lock icon */}
                  <rect x="-6" y="32" width="12" height="15" rx="2" fill="#10b981"/>
                  <path d="M -4 32 L -4 26 Q -4 22 0 22 Q 4 22 4 26 L 4 32" fill="none" stroke="#10b981" strokeWidth="2"/>
                </g>
                
                {/* Floating documents */}
                <g transform="translate(320, 280)" opacity="0.7">
                  <rect x="0" y="0" width="30" height="40" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="2"/>
                  <line x1="5" y1="8" x2="25" y2="8" stroke="#e5e7eb" strokeWidth="2"/>
                  <line x1="5" y1="15" x2="25" y2="15" stroke="#e5e7eb" strokeWidth="2"/>
                  <line x1="5" y1="22" x2="20" y2="22" stroke="#e5e7eb" strokeWidth="2"/>
                </g>
              </svg>
            </div>
          </div>

          {/* Right Side - Login/Register Form */}
          <Card className="w-full max-w-md mx-auto border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-byd-green">
                {isLogin ? "Login" : "Registrasi"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      placeholder="Email"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      placeholder="Password"
                      className="w-full"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button variant="link" className="text-byd-green text-sm p-0 h-auto">
                      Lupa Password ?
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setIsLogin(false)}
                      className="text-byd-green text-sm p-0 h-auto"
                    >
                      Belum Punya Akun
                    </Button>
                    
                    <Button 
                      type="submit" 
                      className="bg-byd-green hover:bg-byd-green/90 text-white px-8"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Login"}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nik" className="text-sm font-medium">Nomor KTP (NIK)</Label>
                    <Input
                      id="nik"
                      type="text"
                      value={registerNik}
                      onChange={(e) => setRegisterNik(e.target.value)}
                      required
                      maxLength={16}
                      pattern="[0-9]{16}"
                      placeholder="16 digit NIK"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">Nama Lengkap</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={registerFullName}
                      onChange={(e) => setRegisterFullName(e.target.value)}
                      required
                      placeholder="Nama Lengkap"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      placeholder="Email"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Password (minimal 6 karakter)"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Konfirmasi Password"
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setIsLogin(true)}
                      className="text-byd-green text-sm p-0 h-auto"
                    >
                      Sudah Punya Akun
                    </Button>
                    
                    <Button 
                      type="submit" 
                      className="bg-byd-green hover:bg-byd-green/90 text-white px-8"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Daftar"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-4 text-center text-sm text-muted-foreground">
        BYD Haka © 2025
      </footer>
    </div>
  );
}

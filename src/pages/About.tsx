
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { Award, Heart, Lightbulb, Shield, Star, Zap } from "lucide-react";
import aboutHero from "@/assets/about-hero-flat.png";
import ceoImg from "@/assets/ceo-haka.png";
import cfoImg from "@/assets/cfo-haka.png";
import cooImg from "@/assets/coo-haka.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <TopNav isPublic />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* ... (Hero Content) ... */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 space-y-8 animate-fade-in-left">
              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-110%">
                Driving the <span className="text-primary">Future</span> of <br />
                Automotive Retail
              </h1>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Founded on October 10, 2023, <span className="font-semibold text-gray-900">HAKA Auto</span> (PT Bumi Hijau Motor)
                  is a premier BYD mega dealer in Indonesia. We are backed by a business group with decades
                  of automotive legacy and a team of seasoned professionals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">EV Specialized</span>
                  </div>
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">3S+ Facilities</span>
                  </div>
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Trusted Partner</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative animate-fade-in-right">
              <div className="relative z-10 p-4">
                <img
                  src={aboutHero}
                  alt="Future of Mobility"
                  className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section - Glassmorphism Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Meet Our Leader</h2>
            <p className="text-gray-600">Guided by experienced visionaries committed to excellence and innovation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* CEO Card */}
            <div className="group relative bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                <img
                  src={ceoImg}
                  alt="Hariyadi Kaimuddin"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-100 object-cover"
                />
                <div className="text-center sm:text-left space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Hariyadi Kaimuddin</h3>
                  <p className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full tracking-wide uppercase">Chief Executive Officer</p>
                  <p className="text-gray-600 text-sm leading-relaxed pt-2">
                    Industrial Engineering graduate from ITB with extensive leadership history at PT HM Sampoerna and Kalla Group (Director of Kalla Toyota).
                  </p>
                </div>
              </div>
            </div>

            {/* CFO Card */}
            <div className="group relative bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                <img
                  src={cfoImg}
                  alt="Nanda Parulian Sinaga"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-100 object-cover"
                />
                <div className="text-center sm:text-left space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Nanda Parulian Sinaga</h3>
                  <p className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full tracking-wide uppercase">Chief Finance Officer</p>
                  <p className="text-gray-600 text-sm leading-relaxed pt-2">
                    Finance expert with 15+ years in international financial institutions and corporate financial management.
                  </p>
                </div>
              </div>
            </div>
            {/* COO Card */}
            <div className="group relative bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                <img
                  src={cooImg}
                  alt="Judianto"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-100 object-cover"
                />
                <div className="text-center sm:text-left space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Judianto</h3>
                  <p className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full tracking-wide uppercase">Chief Operating Officer</p>
                  <p className="text-gray-600 text-sm leading-relaxed pt-2">
                    Experienced operational leader dedicated to optimizing dealership efficiency and customer satisfaction across the Haka Auto network.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values - Dark Mode Style Section */}
      <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Vision & Mission */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/50">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">VISI</h2>
                </div>
                <p className="text-xl text-gray-300 font-light leading-relaxed border-l-4 border-primary pl-6">
                  "Menjadi grup bisnis otomotif terkemuka di Indonesia melalui keunggulan produk, layanan, dan inovasi berkelanjutan."
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/50">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">MISI</h2>
                </div>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5"></div>
                    <p>Mengembangkan sumber daya manusia yang unggul, proses bisnis yang profesional, efektif, dan efisien serta pengelolaan keuangan yang baik.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5"></div>
                    <p>Memberikan layanan terbaik, cepat, dan akurat untuk kebutuhan pelanggan.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5"></div>
                    <p>Berpartisipasi aktif dalam melindungi dan melestarikan lingkungan.</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Values Grid */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

              <div className="text-center mb-10 relative">
                {/* Large background text for depth */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-white/5 select-none pointer-events-none blur-sm scale-110">
                  DRIVE
                </div>

                <h3 className="relative z-10 text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white tracking-tighter drop-shadow-2xl mb-2">
                  DRIVE
                </h3>
                <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-400">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50"></div>
                  <span className="tracking-[0.3em] uppercase text-primary font-bold">Our Core Values</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                {[
                  { letter: "D", rest: "EDICATION", icon: Heart },
                  { letter: "R", rest: "ELIABILITY", icon: Shield },
                  { letter: "I", rest: "NNOVATION", icon: Zap },
                  { letter: "V", rest: "IRTUE", icon: Star },
                  { letter: "E", rest: "XCELLENCE", icon: Award }
                ].map((val, idx) => (
                  <div key={idx} className={`p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center group/card ${idx === 4 ? 'col-span-2' : ''}`}>
                    <div className="p-3 rounded-full bg-white/5 group-hover/card:bg-primary/20 transition-colors duration-300">
                      <val.icon className="w-6 h-6 text-primary group-hover/card:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="font-bold tracking-wider text-sm">
                      <span className="text-2xl text-primary font-black">{val.letter}</span>
                      <span className="text-gray-200">{val.rest}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer-like Branding Strip */}
      <section className="py-12 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 opacity-40">
          <span className="text-4xl font-extrabold text-gray-900 tracking-tighter">HAKA<span className="text-primary"> AUTO</span></span>
          <span className="text-2xl text-gray-300 font-light">×</span>
          <span className="text-4xl font-extrabold text-gray-900 tracking-tighter">BYD</span>
        </div>
      </section>
      <Footer />
    </div>
  );
}

import TopNav from "@/components/TopNav";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav isPublic />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                HAKA Auto hadir dengan berbagai fasilitas yang lengkap
              </h1>
              <div className="space-y-4 text-base lg:text-lg text-muted-foreground">
                <p>
                  Didirikan pada 10 Oktober 2023, PT Bumi Hijau Motor (Haka Auto) 
                  adalah perusahaan mega dealer BYD di Indonesia, dibentuk oleh 
                  group usaha yang berpengalaman puluhan tahun dalam industri 
                  otomotif dan didukung oleh profesional yang telah memiliki jam 
                  terbang tinggi di bidangnya masing-masing.
                </p>
                <p>
                  Sebagai bentuk komitmen untuk memberikan pelayanan terbaik 
                  bagi masyarakat, Haka Auto akan terus membangun dan 
                  mengoperasikan puluhan cabang dealer secara bertahap di seluruh 
                  kota besar di Jabodetabek, Pulau Jawa, Kalimantan, Sulawesi hingga 
                  wilayah Timur Indonesia. Meliputi fasilitas dealership 3S+ (sales, 
                  service, spare parts, EV Charging Station) dan fasilitas pendukung 
                  lainnya untuk kenyamanan Masyarakat.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/placeholder.svg" 
                  alt="BYD Haka Dealership" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-teal-50/50 to-background dark:from-teal-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
            ABOUT HAKA AUTO
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* CEO Card */}
            <div className="group">
              <div className="relative bg-gradient-to-br from-teal-100/80 to-teal-50/50 dark:from-teal-900/30 dark:to-teal-950/20 rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg transform -rotate-6"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src="/placeholder.svg" 
                        alt="Hariyadi Kaimuddin" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-1">
                      HARIYADI KAIMUDDIN
                    </h3>
                    <p className="text-teal-600 dark:text-teal-400 italic mb-4">
                      (Chief Executive Officer)
                    </p>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                      Profesional lulusan Teknik Industri ITB, merintis karir 
                      di bidang Marketing PT HM Sampoerna kemudian 
                      melanjutkan ke Kalla Group sebagai Direktur Kalla 
                      Toyota pada tahun 2007 sampai posisi board of 
                      Director Kalla Group
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CFO Card */}
            <div className="group">
              <div className="relative bg-gradient-to-br from-teal-100/80 to-teal-50/50 dark:from-teal-900/30 dark:to-teal-950/20 rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg transform -rotate-6"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src="/placeholder.svg" 
                        alt="Nanda Parulian Sinaga" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-1">
                      NANDA PARULIAN SINAGA
                    </h3>
                    <p className="text-teal-600 dark:text-teal-400 italic mb-4">
                      (Chief Finance Officer)
                    </p>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                      Profesional di bidang keuangan dengan pengalaman 
                      kerja 15 tahun di Lembaga keuangan baik Dalam 
                      Negeri maupun Luar Negeri serta 15 tahun di 
                      Korporasi dalam pengelolaan keuangan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center gap-8 lg:gap-16">
            <div className="text-5xl lg:text-7xl font-bold">
              HAKA<br/>AUTO
            </div>
            <div className="text-4xl lg:text-6xl text-muted-foreground">×</div>
            <div className="text-5xl lg:text-7xl font-bold">
              BYD
            </div>
          </div>
        </div>
      </section>

      {/* Diversification Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold text-white text-center lg:text-left">
            DIVERSIFICATION
          </h2>
        </div>
      </section>

      {/* Vision, Mission & Values */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">VISI, MISI, & VALUES</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-4 text-teal-600 dark:text-teal-400">VISI</h3>
                <p className="text-lg leading-relaxed">
                  Menjadi kelompok bisnis otomotif terdepan di Indonesia melalui keunggulan product dan layanan serta inovasi yang berkelanjutan.
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold mb-4 text-teal-600 dark:text-teal-400">MISI</h3>
                <ol className="list-decimal list-inside space-y-3 text-lg">
                  <li>Mewujudkan sumber daya manusia yang unggul, proses bisnis dan pengelolan keuangan yang profesional, efektif dan efisien.</li>
                  <li>Memberikan pelayanan terbaik yang cepat dan tepat atas kebutuhan pelanggan.</li>
                  <li>Berperan aktif dalam menjaga dan melestarikan lingkungan.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-3xl font-bold mb-6 text-teal-600 dark:text-teal-400">VALUES</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="border-2 border-teal-500 rounded-lg p-6 text-center hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors">
                    <h4 className="text-xl font-bold">DEDICATION</h4>
                  </div>
                  <div className="border-2 border-teal-500 rounded-lg p-6 text-center hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors">
                    <h4 className="text-xl font-bold">RELIABILITY</h4>
                  </div>
                  <div className="border-2 border-teal-500 rounded-lg p-6 text-center hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors">
                    <h4 className="text-xl font-bold">INNOVATION</h4>
                  </div>
                  <div className="border-2 border-teal-500 rounded-lg p-6 text-center hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors">
                    <h4 className="text-xl font-bold">VIRTUE</h4>
                  </div>
                  <div className="border-2 border-teal-500 rounded-lg p-6 text-center hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors">
                    <h4 className="text-xl font-bold">EXCELLENCE</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

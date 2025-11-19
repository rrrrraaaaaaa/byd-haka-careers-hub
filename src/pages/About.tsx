import TopNav from "@/components/TopNav";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">VISI, MISI, & VALUES BUMI AUTO</h1>
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">VISI :</h2>
            <p className="text-lg leading-relaxed">
              Menjadi kelompok bisnis otomotif terdepan di Indonesia melalui keunggulan product dan layanan serta inovasi yang berkelanjutan.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">MISI :</h2>
            <ol className="list-decimal list-inside space-y-3 text-lg">
              <li>Mewujudkan sumber daya manusia yang unggul, proses bisnis dan pengelolan keuangan yang profesional, efektif dan efisien.</li>
              <li>Memberikan pelayanan terbaik yang cepat dan tepat atas kebutuhan pelanggan.</li>
              <li>Berperan aktif dalam menjaga dan melestarikan lingkungan.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">VALUES:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="border-2 border-foreground rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold">DEDICATION</h3>
              </div>
              <div className="border-2 border-foreground rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold">RELIABILITY</h3>
              </div>
              <div className="border-2 border-foreground rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold">INNOVATION</h3>
              </div>
              <div className="border-2 border-foreground rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold">VIRTUE</h3>
              </div>
              <div className="border-2 border-foreground rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold">EXCELLENCE</h3>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

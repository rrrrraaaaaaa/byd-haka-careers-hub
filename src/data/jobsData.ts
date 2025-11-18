export interface Job {
  id: string;
  position: string;
  branch: string;
  location: string;
  province: string;
  type: string;
}

export const jobsData: Job[] = [
  // DKI Jakarta
  { id: "1", position: "Branch Manager", branch: "BYD Haka Bintaro", location: "Bintaro", province: "DKI Jakarta", type: "Full Time" },
  { id: "2", position: "Sales Supervisor", branch: "BYD Haka Cibubur", location: "Cibubur", province: "DKI Jakarta", type: "Full Time" },
  { id: "3", position: "Sales Executive", branch: "BYD Haka Pejaten", location: "Pejaten", province: "DKI Jakarta", type: "Full Time" },
  { id: "4", position: "Service Manager", branch: "BYD Haka Bonjer", location: "Bonjer", province: "DKI Jakarta", type: "Full Time" },
  { id: "5", position: "Admin Sales", branch: "DENZA Pluit", location: "Pluit", province: "DKI Jakarta", type: "Full Time" },
  { id: "6", position: "Sales Executive", branch: "BYD Haka Gunung Sahari", location: "Gunung Sahari", province: "DKI Jakarta", type: "Full Time" },
  { id: "7", position: "Service Advisor", branch: "BYD Haka Mangga Dua", location: "Mangga Dua", province: "DKI Jakarta", type: "Full Time" },
  { id: "8", position: "Admin Sales", branch: "DENZA Pondok Indah", location: "Pondok Indah", province: "DKI Jakarta", type: "Full Time" },

  // Jawa Barat
  { id: "9", position: "Sales Executive", branch: "BYD Haka Dago Bandung", location: "Bandung", province: "Jawa Barat", type: "Full Time" },
  { id: "10", position: "Service Advisor", branch: "BYD Haka Depok", location: "Depok", province: "Jawa Barat", type: "Full Time" },
  { id: "11", position: "Administration Head", branch: "BYD Haka Cikampek", location: "Cikampek", province: "Jawa Barat", type: "Full Time" },
  { id: "12", position: "Mekanik", branch: "BYD Haka Kota Baru Parahyangan", location: "Kota Baru Parahyangan", province: "Jawa Barat", type: "Full Time" },

  // Banten
  { id: "13", position: "Sales Executive", branch: "BYD Haka City Store Supermall Karawaci", location: "Karawaci", province: "Banten", type: "Full Time" },
  { id: "14", position: "Cashier", branch: "BYD Haka City Store Sentul Highlands", location: "Sentul", province: "Banten", type: "Full Time" },

  // Jawa Tengah
  { id: "15", position: "Branch Manager", branch: "BYD Haka Semarang", location: "Semarang", province: "Jawa Tengah", type: "Full Time" },
  { id: "16", position: "Sales Executive", branch: "BYD Haka Solo", location: "Solo", province: "Jawa Tengah", type: "Full Time" },
  { id: "17", position: "Marketing Specialist", branch: "BYD Haka Klaten", location: "Klaten", province: "Jawa Tengah", type: "Full Time" },
  { id: "18", position: "Sales Executive", branch: "BYD Haka Pati", location: "Pati", province: "Jawa Tengah", type: "Full Time" },
  { id: "19", position: "Service Manager", branch: "BYD Haka Tegal", location: "Tegal", province: "Jawa Tengah", type: "Full Time" },
  { id: "20", position: "Sales Supervisor", branch: "BYD Haka Magelang", location: "Magelang", province: "Jawa Tengah", type: "Full Time" },
  { id: "21", position: "Admin Faktur", branch: "BYD Haka Madiun", location: "Madiun", province: "Jawa Tengah", type: "Full Time" },
  { id: "22", position: "Customer Relation Officer", branch: "BYD Haka Cilacap", location: "Cilacap", province: "Jawa Tengah", type: "Full Time" },

  // Jawa Timur
  { id: "23", position: "Sales Supervisor", branch: "BYD Haka Merr Surabaya", location: "Surabaya", province: "Jawa Timur", type: "Full Time" },
  { id: "24", position: "Sales Executive", branch: "BYD Haka Malang", location: "Malang", province: "Jawa Timur", type: "Full Time" },
  { id: "25", position: "Service Manager", branch: "BYD Haka Gresik (ex-Hyundai)", location: "Gresik", province: "Jawa Timur", type: "Full Time" },
  { id: "26", position: "Sales Executive", branch: "BYD Haka Banyuwangi", location: "Banyuwangi", province: "Jawa Timur", type: "Full Time" },
  { id: "27", position: "Admin Sales", branch: "DENZA Darmo Surabaya", location: "Surabaya", province: "Jawa Timur", type: "Full Time" },
  { id: "28", position: "Sales Executive", branch: "BYD Haka City Store CWS Surabaya", location: "Surabaya", province: "Jawa Timur", type: "Full Time" },

  // Kalimantan Timur
  { id: "29", position: "Branch Manager", branch: "BYD Haka Balikpapan", location: "Balikpapan", province: "Kalimantan Timur", type: "Full Time" },
  { id: "30", position: "Sales Executive", branch: "BYD Haka City Store Big Mall Samarinda", location: "Samarinda", province: "Kalimantan Timur", type: "Full Time" },

  // Sulawesi Selatan
  { id: "31", position: "Sales Executive", branch: "BYD Haka Karebosi", location: "Makassar", province: "Sulawesi Selatan", type: "Full Time" },

  // Sulawesi Utara
  { id: "32", position: "Sales Supervisor", branch: "BYD Haka Manado", location: "Manado", province: "Sulawesi Utara", type: "Full Time" },

  // Sulawesi Tengah
  { id: "33", position: "Branch Manager", branch: "BYD Haka Palu", location: "Palu", province: "Sulawesi Tengah", type: "Full Time" },

  // Sulawesi Tenggara
  { id: "34", position: "Sales Executive", branch: "BYD Haka Kendari", location: "Kendari", province: "Sulawesi Tenggara", type: "Full Time" },

  // Kalimantan Selatan
  { id: "35", position: "Service Advisor", branch: "BYD Haka Banjarmasin", location: "Banjarmasin", province: "Kalimantan Selatan", type: "Full Time" },
];

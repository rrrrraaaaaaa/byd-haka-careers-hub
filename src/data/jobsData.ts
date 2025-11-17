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
  { id: "1", position: "Branch Manager", branch: "BYD Jakarta Pusat", location: "Jakarta Pusat", province: "DKI Jakarta", type: "Full Time" },
  { id: "2", position: "Sales Supervisor", branch: "BYD Jakarta Selatan", location: "Jakarta Selatan", province: "DKI Jakarta", type: "Full Time" },
  { id: "3", position: "Sales Executive", branch: "BYD Jakarta Timur", location: "Jakarta Timur", province: "DKI Jakarta", type: "Full Time" },
  { id: "4", position: "Service Manager", branch: "BYD Jakarta Barat", location: "Jakarta Barat", province: "DKI Jakarta", type: "Full Time" },
  { id: "5", position: "Admin Sales", branch: "BYD Jakarta Utara", location: "Jakarta Utara", province: "DKI Jakarta", type: "Full Time" },

  // Jawa Barat
  { id: "6", position: "Sales Executive", branch: "BYD Bandung", location: "Bandung", province: "Jawa Barat", type: "Full Time" },
  { id: "7", position: "Service Advisor", branch: "BYD Bekasi", location: "Bekasi", province: "Jawa Barat", type: "Full Time" },
  { id: "8", position: "Administration Head", branch: "BYD Bogor", location: "Bogor", province: "Jawa Barat", type: "Full Time" },
  { id: "9", position: "Mekanik", branch: "BYD Depok", location: "Depok", province: "Jawa Barat", type: "Full Time" },
  { id: "10", position: "Customer Relation Officer", branch: "BYD Cirebon", location: "Cirebon", province: "Jawa Barat", type: "Full Time" },

  // Jawa Tengah
  { id: "11", position: "Branch Manager", branch: "BYD Semarang", location: "Semarang", province: "Jawa Tengah", type: "Full Time" },
  { id: "12", position: "Sales Executive", branch: "BYD Solo", location: "Solo", province: "Jawa Tengah", type: "Full Time" },
  { id: "13", position: "Marketing Specialist", branch: "BYD Yogyakarta", location: "Yogyakarta", province: "Jawa Tengah", type: "Full Time" },

  // Jawa Timur
  { id: "14", position: "Sales Supervisor", branch: "BYD Surabaya", location: "Surabaya", province: "Jawa Timur", type: "Full Time" },
  { id: "15", position: "Sales Executive", branch: "BYD Malang", location: "Malang", province: "Jawa Timur", type: "Full Time" },
  { id: "16", position: "Admin Faktur", branch: "BYD Sidoarjo", location: "Sidoarjo", province: "Jawa Timur", type: "Full Time" },
  { id: "17", position: "Service Manager", branch: "BYD Gresik", location: "Gresik", province: "Jawa Timur", type: "Full Time" },

  // Banten
  { id: "18", position: "Sales Executive", branch: "BYD Tangerang", location: "Tangerang", province: "Banten", type: "Full Time" },
  { id: "19", position: "Cashier", branch: "BYD Serang", location: "Serang", province: "Banten", type: "Full Time" },
  { id: "20", position: "Stock Management", branch: "BYD Cilegon", location: "Cilegon", province: "Banten", type: "Full Time" },

  // Sumatera Utara
  { id: "21", position: "Branch Manager", branch: "BYD Medan", location: "Medan", province: "Sumatera Utara", type: "Full Time" },
  { id: "22", position: "Sales Executive", branch: "BYD Pematang Siantar", location: "Pematang Siantar", province: "Sumatera Utara", type: "Full Time" },

  // Sumatera Barat
  { id: "23", position: "Sales Executive", branch: "BYD Padang", location: "Padang", province: "Sumatera Barat", type: "Full Time" },
  { id: "24", position: "Service Advisor", branch: "BYD Bukittinggi", location: "Bukittinggi", province: "Sumatera Barat", type: "Full Time" },

  // Sumatera Selatan
  { id: "25", position: "Sales Supervisor", branch: "BYD Palembang", location: "Palembang", province: "Sumatera Selatan", type: "Full Time" },

  // Bali
  { id: "26", position: "Sales Executive", branch: "BYD Denpasar", location: "Denpasar", province: "Bali", type: "Full Time" },
  { id: "27", position: "In-House Trainer", branch: "BYD Gianyar", location: "Gianyar", province: "Bali", type: "Full Time" },

  // Kalimantan Timur
  { id: "28", position: "Branch Manager", branch: "BYD Balikpapan", location: "Balikpapan", province: "Kalimantan Timur", type: "Full Time" },
  { id: "29", position: "Sales Executive", branch: "BYD Samarinda", location: "Samarinda", province: "Kalimantan Timur", type: "Full Time" },

  // More positions
  { id: "30", position: "Admin AR", branch: "BYD Jakarta Pusat", location: "Jakarta Pusat", province: "DKI Jakarta", type: "Full Time" },
  { id: "31", position: "Admin Service", branch: "BYD Bandung", location: "Bandung", province: "Jawa Barat", type: "Full Time" },
  { id: "32", position: "Accounting", branch: "BYD Surabaya", location: "Surabaya", province: "Jawa Timur", type: "Full Time" },
  { id: "33", position: "Partman", branch: "BYD Medan", location: "Medan", province: "Sumatera Utara", type: "Full Time" },
  { id: "34", position: "Personalisasi & GA", branch: "BYD Jakarta Selatan", location: "Jakarta Selatan", province: "DKI Jakarta", type: "Full Time" },
];

// Türkiye alt ligleri: 2026-27 TFF 1. Lig takımları ve oyundaki 2. Lig grubu (alt lig kulüplerinden seçme 16 takım).
// Kadrolar world-squads.js'ten gelir; bulunamayanlar oyun içinde üretilir. Renkler kulüplerin geleneksel renklerine yakındır.

const T = (id, name, short, city, rep, colors, stadium, capacity, pattern = 'plain') => ({
  id, name, short, city, country: 'TR', rep, colors, kit: { pattern, colors }, stadium, capacity,
});

export const TR1_CLUBS = [
  T('ant', 'Antalyaspor', 'ANT', 'Antalya', 55, ['#E30613', '#FFFFFF'], 'Corendon Airlines Park', 29307),
  T('ban', 'Bandırmaspor', 'BAN', 'Bandırma', 45, ['#E30613', '#FFFFFF'], '17 Eylül Stadyumu', 11000),
  T('bat', 'Batman Petrolspor', 'BAT', 'Batman', 42, ['#E30613', '#111111'], 'Batman Stadyumu', 10000),
  T('bdr', 'Bodrum FK', 'BDR', 'Bodrum', 48, ['#00843D', '#FFFFFF'], 'Bodrum İlçe Stadyumu', 5000),
  T('blu', 'Boluspor', 'BOL', 'Bolu', 44, ['#E30613', '#FFFFFF'], 'Bolu Atatürk Stadyumu', 8881),
  T('brs', 'Bursaspor', 'BRS', 'Bursa', 50, ['#00843D', '#FFFFFF'], 'Matlı Bursa Stadyumu', 43331, 'stripes'),
  T('ero', 'Esenler Erokspor', 'ERO', 'İstanbul', 43, ['#E30613', '#111111'], 'Esenler Stadyumu', 5000),
  T('fkg', 'Fatih Karagümrük', 'FKG', 'İstanbul', 52, ['#E30613', '#111111'], 'Atatürk Olimpiyat Stadyumu', 74753, 'stripes'),
  T('igd', 'Iğdır FK', 'IĞD', 'Iğdır', 40, ['#0055A4', '#FFFFFF'], 'Iğdır Stadyumu', 3000),
  T('ist', 'İstanbulspor', 'İST', 'İstanbul', 46, ['#FFD700', '#111111'], 'Necmi Kadıoğlu Stadyumu', 4000),
  T('kay', 'Kayserispor', 'KAY', 'Kayseri', 54, ['#FFD700', '#E30613'], 'RHG Enertürk Enerji Stadyumu', 32864, 'halves'),
  T('kec', 'Keçiörengücü', 'KEÇ', 'Ankara', 43, ['#5A2D82', '#FFFFFF'], 'Aktepe Stadyumu', 4883),
  T('man', 'Manisa FK', 'MAN', 'Manisa', 45, ['#111111', '#FFFFFF'], 'Manisa 19 Mayıs Stadyumu', 16597),
  T('mrd', 'Mardin 1969 Spor', 'MRD', 'Mardin', 41, ['#E30613', '#FFD700'], 'Mardin Stadyumu', 10000),
  T('mug', 'Muğlaspor', 'MUĞ', 'Muğla', 41, ['#0055A4', '#FFFFFF'], 'Muğla Atatürk Stadyumu', 7500),
  T('pen', 'Pendikspor', 'PEN', 'İstanbul', 47, ['#E30613', '#FFFFFF'], 'Pendik Stadyumu', 2500),
  T('sar', 'Sarıyer', 'SAR', 'İstanbul', 43, ['#0055A4', '#FFFFFF'], 'Yusuf Ziya Öniş Stadyumu', 4500),
  T('siv', 'Sivasspor', 'SİV', 'Sivas', 51, ['#E30613', '#FFFFFF'], 'Yeni 4 Eylül Stadyumu', 27532),
  T('umr', 'Ümraniyespor', 'ÜMR', 'İstanbul', 45, ['#E30613', '#0055A4'], 'Ümraniye Şehir Stadyumu', 3513),
  T('van', 'Vanspor FK', 'VAN', 'Van', 42, ['#E30613', '#111111'], 'Van Atatürk Stadyumu', 15000),
];

export const TR2_CLUBS = [
  T('ank', 'MKE Ankaragücü', 'ANK', 'Ankara', 44, ['#FFD700', '#00205B'], 'Eryaman Stadyumu', 20560),
  T('alt', 'Altay', 'ALT', 'İzmir', 40, ['#111111', '#FFFFFF'], 'Alsancak Mustafa Denizli Stadyumu', 15000, 'stripes'),
  T('den', 'Denizlispor', 'DEN', 'Denizli', 39, ['#00843D', '#111111'], 'Denizli Atatürk Stadyumu', 18745),
  T('gir', 'Giresunspor', 'GİR', 'Giresun', 40, ['#00843D', '#FFFFFF'], 'Çotanak Spor Kompleksi', 22028),
  T('ads', 'Adana Demirspor', 'ADS', 'Adana', 42, ['#6CACE4', '#00205B'], 'Yeni Adana Stadyumu', 33543),
  T('hat', 'Hatayspor', 'HAT', 'Hatay', 41, ['#8E1F2F', '#FFFFFF'], 'Mersin Stadyumu', 25497),
  T('tuz', 'Tuzlaspor', 'TUZ', 'İstanbul', 39, ['#E30613', '#0055A4'], 'Tuzla Belediye Stadyumu', 3000),
  T('aln', 'Altınordu', 'ALN', 'İzmir', 38, ['#E30613', '#00205B'], 'Altınordu Stadyumu', 8000),
  T('url', 'Şanlıurfaspor', 'URF', 'Şanlıurfa', 39, ['#FFD700', '#00843D'], '11 Nisan Stadyumu', 28965),
  T('men', 'Menemen FK', 'MEN', 'İzmir', 37, ['#E30613', '#FFFFFF'], 'Menemen İlçe Stadyumu', 3000),
  T('ksk', 'Karşıyaka', 'KSK', 'İzmir', 40, ['#00843D', '#E30613'], 'Alsancak Mustafa Denizli Stadyumu', 15000, 'halves'),
  T('esk', 'Eskişehirspor', 'ESK', 'Eskişehir', 40, ['#E30613', '#111111'], 'Eskişehir Atatürk Stadyumu', 34930, 'stripes'),
  T('sak', 'Sakaryaspor', 'SAK', 'Sakarya', 43, ['#00843D', '#111111'], 'Sakarya Atatürk Stadyumu', 28154, 'stripes'),
  T('ada', 'Adanaspor', 'ADA', 'Adana', 40, ['#F58220', '#FFFFFF'], 'Yeni Adana Stadyumu', 33543),
  T('buc', 'Bucaspor 1928', 'BUC', 'İzmir', 39, ['#FFD700', '#0055A4'], 'Buca Arena', 10000),
  T('afy', 'Afyonspor', 'AFY', 'Afyonkarahisar', 38, ['#E30613', '#111111'], 'Afyon Zafer Stadyumu', 12000),
];

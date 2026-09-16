// 2026-27 Trendyol Süper Lig takımları ve kadroları.
// Kadrolar Eylül 2026 itibarıyla kamuya açık kaynaklardan (Wikipedia, kulüp duyuruları) derlenmiştir.
// Güç (rating) değerleri ve bilinmeyen yaşlar bu oyun için yapılmış TAHMİNLERDİR; düzeltmeler için PR açabilirsiniz.
//
// Oyuncu satırı biçimi:  forma no | ad soyad | ülke kodu | yaş | mevki | güç [| potansiyel] [| K:kiralandığı kulüp]
// Mevkiler: GK kaleci, RB sağ bek, CB stoper, LB sol bek, DM defansif orta saha, CM merkez orta saha,
//           AM ofansif orta saha, RW sağ kanat, LW sol kanat, ST santrfor

export const SEASON = 2026;

export const TEAMS = [
  {
    id: 'gs', name: 'Galatasaray', short: 'GS', city: 'İstanbul', stadium: 'RAMS Park', capacity: 53978,
    colors: ['#A90432', '#FDB912'], kit: { pattern: 'halves', colors: ['#A90432', '#FDB912'] }, rep: 90, balance: 32000000, coach: 'Okan Buruk', formation: '4-2-3-1',
    players: `
1|Uğurcan Çakır|TR|30|GK|81
19|Günay Güvenç|TR|35|GK|68
24|Jankat Yılmaz|TR|20|GK|55|68
70|Enes Büyük|TR|19|GK|52|66
6|Davinson Sánchez|CO|30|CB|80
90|Wilfried Singo|CI|25|CB|79
42|Abdülkerim Bardakcı|TR|31|CB|77
23|Kaan Ayhan|TR|31|CB|74
3|Chadaille Bitshiabu|FR|21|CB|73|80|K:RB Leipzig
91|Arda Ünyay|TR|20|CB|60|72
7|Roland Sallai|HU|29|RB|77
4|Ismail Jakobs|SN|26|LB|76
17|Eren Elmalı|TR|26|LB|74
88|Kazımcan Karataş|TR|23|LB|66|70
34|Lucas Torreira|UY|30|DM|80
18|Lesley Ugochukwu|FR|22|DM|74|79|K:Burnley
20|İlkay Gündoğan|DE|35|CM|80
8|Gabriel Sara|BR|27|CM|80
5|Eyüp Aydın|TR|22|CM|68|74
74|Renato Nhaga|GW|19|CM|62|76
29|Armando Güner|AR|20|CM|58|70
83|Aleksey Batrakov|RU|21|AM|77|85
73|Berat Luş|TR|19|AM|55|70
10|Leroy Sané|DE|30|RW|84
11|Yunus Akgün|TR|26|RW|77
27|Rafael Leão|PT|27|LW|85
53|Barış Alper Yılmaz|TR|26|LW|78
45|Victor Osimhen|NG|27|ST|87
21|Deniz Gül|TR|22|ST|70|77
62|Ada Yüzgeç|TR|18|ST|54|72
`,
  },
  {
    id: 'fb', name: 'Fenerbahçe', short: 'FB', city: 'İstanbul', stadium: 'Chobani Stadyumu', capacity: 47430,
    colors: ['#0B2A6F', '#FFED00'], kit: { pattern: 'stripes', colors: ['#FFED00', '#0B2A6F'] }, rep: 88, balance: 30000000, coach: 'İsmail Kartal', formation: '4-2-3-1',
    players: `
31|Ederson|BR|33|GK|82
34|Mert Günok|TR|37|GK|74
13|Tarık Çetin|TR|29|GK|65
37|Milan Škriniar|SK|31|CB|80
15|Nathan Aké|NL|31|CB|79
21|Kojo Peprah Oppong|GH|22|CB|74|80
14|Yiğit Efe Demir|TR|22|CB|70|76
27|Nélson Semedo|PT|32|RB|75
18|Mert Müldür|TR|27|RB|73
77|Ognjen Mimović|RS|22|RB|70|75
24|Jayden Oosterwolde|NL|25|LB|76
3|Archie Brown|EN|24|LB|75
22|Levent Mercan|TR|25|LB|70
91|N'Golo Kanté|FR|35|DM|79
5|İsmail Yüksek|TR|27|DM|74
6|Mattéo Guendouzi|FR|27|CM|81
8|Mert Hakan Yandaş|TR|32|CM|70
28|Bartuğ Elmaz|TR|23|CM|66|72
10|Marco Asensio|ES|30|AM|82
11|Mason Greenwood|EN|24|RW|84|86
17|İrfan Can Kahveci|TR|31|RW|75
7|Kerem Aktürkoğlu|TR|27|LW|80
45|Dorgeles Nene|ML|23|LW|76|80
70|Oğuz Aydın|TR|25|LW|73
9|Romelu Lukaku|BE|33|ST|80
19|Vedat Muriqi|XK|32|ST|78
`,
  },
  {
    id: 'bjk', name: 'Beşiktaş', short: 'BJK', city: 'İstanbul', stadium: 'Tüpraş Stadyumu', capacity: 42684,
    colors: ['#111111', '#FFFFFF'], kit: { pattern: 'plain', colors: ['#FFFFFF', '#111111'] }, rep: 84, balance: 22000000, coach: 'Vincenzo Italiano', formation: '4-2-3-1',
    players: `
1|Alexander Nübel|DE|29|GK|79
90|Doğan Alemdar|TR|23|GK|70|75
-|Emir Yaşar|TR|20|GK|55|68
12|Emmanuel Agbadou|CI|29|CB|76
50|Tiago Djaló|PT|26|CB|75
58|Emirhan Topçu|TR|26|CB|72
53|Ümit Akdağ|TR|22|CB|71|77
62|Yasin Özcan|TR|20|CB|62|74
66|Mustafa Azem Yortaç|TR|18|CB|52|70
63|Michael Murillo|PA|30|RB|73
23|Taylan Bulut|TR|20|RB|67|77
11|Kassoum Ouattara|FR|21|LB|74|81
35|Rıdvan Yılmaz|TR|25|LB|71
4|Wilfred Ndidi|NG|29|DM|78
6|Salih Özcan|TR|28|DM|74
10|Orkun Kökçü|TR|25|CM|81|83
22|Fabio Miretti|IT|22|CM|73|78|K:Juventus
8|Kartal Kayra Yılmaz|TR|25|CM|68
15|Junior Olaitan|BJ|24|AM|73
33|İlhan Fakılı|TR|20|AM|66|76
70|Ozan Sevim|TR|19|AM|56|70
17|Ernest Poku|NL|22|RW|76|82|K:Bayer Leverkusen
18|Václav Černý|CZ|28|RW|77
7|Milot Rashica|XK|30|RW|72
77|Ahmet Sami Bircan|TR|19|RW|54|68
19|Leandro Trossard|BE|31|LW|80
80|Can Keleş|AT|24|LW|68
29|Dušan Vlahović|RS|26|ST|83
9|Oh Hyeon-gyu|KR|25|ST|73
96|Semih Kılıçsoy|TR|20|ST|70|80
28|Mustafa Hekimoğlu|TR|19|ST|60|74
`,
  },
  {
    id: 'ts', name: 'Trabzonspor', short: 'TS', city: 'Trabzon', stadium: 'Papara Park', capacity: 41000,
    colors: ['#7B1E3C', '#4FA3DC'], kit: { pattern: 'stripes', colors: ['#7B1E3C', '#4FA3DC'] }, rep: 80, balance: 14000000, coach: 'Fatih Tekke', formation: '4-2-3-1',
    players: `
24|André Onana|CM|30|GK|79|K:Manchester United
1|Ahmet Doğan Yıldırım|TR|19|GK|58|72
25|Onuralp Çevikkan|TR|20|GK|55|68
15|Stefan Savić|ME|35|CB|74
27|Chibuike Nwaiwu|NG|22|CB|72|78
39|Cenk Özkacar|TR|26|CB|72
44|Arseniy Batagov|UA|24|CB|72
4|Samet Akaydın|TR|32|CB|70
20|Wagner Pina|CV|23|RB|72|77
19|Mustafa Eskihellaç|TR|28|RB|68
55|Sidny Lopes Cabral|CV|23|LB|73|78
6|Fabinho|BR|32|DM|77
5|Okay Yokuşlu|TR|32|DM|72
-|Batista Mendy|FR|26|DM|70
8|Benjamin Bouchouari|MA|24|CM|73
26|Tim Jabol-Folcarelli|FR|26|CM|72
11|Ozan Tufan|TR|31|CM|69
77|Metehan Mimaroğlu|TR|25|CM|66
57|Melih Kabasakal|TR|22|CM|65|71
17|Ruslan Malinovskyi|UA|33|AM|75
7|Ernest Muçi|AL|25|AM|75
-|Cihan Çanak|TR|21|AM|64|74
10|Mohamed Salah|EG|34|RW|83
49|René Mitongo|BE|20|RW|65|76
-|Ali Habeşoğlu|TR|22|RW|64|70
58|Aral Şimşir|TR|24|LW|73|77
70|Noah Saviolo|PT|22|LW|72|79
30|Paul Onuachu|NG|32|ST|76
-|Franculino|GW|22|ST|73|80
14|Umut Nayir|TR|33|ST|66
`,
  },
  {
    id: 'ibfk', name: 'Başakşehir', short: 'İBFK', city: 'İstanbul', stadium: 'Başakşehir Fatih Terim Stadyumu', capacity: 17067,
    colors: ['#E35205', '#0D2240'], kit: { pattern: 'plain', colors: ['#E35205', '#0D2240'] }, rep: 70, balance: 6000000, coach: 'Nuri Şahin', formation: '4-2-3-1',
    players: `
1|Volkan Babacan|TR|38|GK|68
16|Muhammed Şengezer|TR|30|GK|68
3|Jerome Opoku|GH|27|CB|72
27|Ousseynou Ba|SN|30|CB|71
23|Emin Bayram|TR|23|CB|68|73
15|Hamza Güreler|TR|23|CB|66|72
6|Onur Bulut|TR|32|RB|68
42|Ömer Ali Şahiner|TR|34|RB|66
33|Michał Karbownik|PL|25|LB|71
21|Christopher Opéri|CI|29|LB|70
38|Saba Kharebashvili|GE|18|LB|63|78
4|Onur Ergün|TR|33|DM|67
8|Olivier Kemen|CM|30|CM|72
18|Jakub Kałuziński|PL|24|CM|71
20|Umut Güneş|TR|26|CM|66
45|Berkay Aslan|TR|19|CM|56|70
11|Abbosbek Fayzullayev|UZ|23|AM|72|77
19|Berkay Özcan|TR|28|AM|70
17|Ömer Faruk Beyaz|TR|22|AM|67|74
70|Andreas Skov Olsen|DK|27|RW|76|K:VfL Wolfsburg
77|Ivan Brnić|HR|25|RW|70
34|Edin Višća|BA|36|RW|70
7|Yusuf Sarı|TR|27|RW|69
14|Eldor Shomurodov|UZ|31|ST|74
9|Davie Selke|DE|31|ST|73
91|Bertuğ Yıldırım|TR|24|ST|70|74
-|Umut Bozok|TR|30|ST|70
-|Tuğra Turhan|CH|19|ST|55|70
`,
  },
  {
    id: 'sam', name: 'Samsunspor', short: 'SAM', city: 'Samsun', stadium: 'Samsun Yeni 19 Mayıs Stadyumu', capacity: 34303,
    colors: ['#E30A17', '#FFFFFF'], kit: { pattern: 'plain', colors: ['#E30A17', '#FFFFFF'] }, rep: 66, balance: 6000000, coach: 'Thorsten Fink', formation: '4-2-3-1',
    players: `
1|Okan Kocuk|TR|31|GK|71
25|Bilal Bayazıt|TR|27|GK|64
13|Efe Yiğit Üstün|TR|21|GK|58|68
16|Strahinja Eraković|RS|25|CB|73|K:Zenit
34|Gabriele Guarino|IT|22|CB|68|74
3|Igor Drapiński|PL|22|CB|66|72
22|Yunus Emre Çift|TR|23|CB|64|70
29|Mustafa Tan|TR|20|CB|58|70
-|Kerem Fidan|TR|19|CB|52|66
2|Joe Mendes|SE|23|RB|69|74
96|Bedirhan Çetin|TR|21|RB|60|70
17|Logi Tómasson|IS|25|LB|71
23|Enes Albak|TR|22|LB|62
4|Elliot Watt|SC|26|DM|70
5|Celil Yüksel|TR|27|DM|69
19|Oskar Øhlenschlæger|DK|22|CM|66|73
8|Samed Onur|TR|23|CM|64|70
42|Anto Sekongo|ML|22|CM|63|70
20|Yalçın Kayan|TR|26|CM|60
77|Afonso Sousa|PT|26|AM|72
7|Elayis Tavşan|TR|24|RW|69
15|Jaurès Assoumou|CI|22|RW|66|73
30|Saikuba Jarju|GM|20|RW|62|72
10|Tanguy Coulibaly|FR|25|LW|71
11|Emre Kılınç|TR|32|LW|70
9|Marius Mouandilmadji|TD|28|ST|73
18|Mohamed Bayo|GN|27|ST|70
14|Fatih Kaya|TR|26|ST|66
`,
  },
  {
    id: 'goz', name: 'Göztepe', short: 'GÖZ', city: 'İzmir', stadium: 'Gürsel Aksel Stadyumu', capacity: 23376,
    colors: ['#FFD200', '#E30613'], kit: { pattern: 'halves', colors: ['#FFD200', '#E30613'] }, rep: 64, balance: 5000000, coach: 'Stanimir Stoilov', formation: '3-5-2',
    players: `
25|Luka Gugeshashvili|GE|26|GK|72
1|Arda Özçimen|TR|22|GK|60
21|Nevzat Üzel|TR|22|GK|55
3|Allan Godói|BR|30|CB|72
26|Malcom Bokele|CM|26|CB|71
19|Noah Sonko Sundberg|GM|29|CB|68
4|Taha Altıkardeş|TR|25|CB|66
2|Arda Okan Kurtulan|TR|23|RB|67
16|Ogün Bayrak|TR|27|RB|67
12|Richard Akonnor|AE|24|RB|63
13|Ege Yıldırım|TR|20|RB|58|68
23|Furkan Bayır|TR|26|LB|66
5|Rhaldney|BR|25|DM|69
20|Novatus Miroshi|TZ|23|DM|68
6|Alex Matos|EN|21|CM|66|73
8|Alexis Antunes|CH|26|AM|70
18|Tino Anjorin|EN|24|AM|68
10|Efkan Bekiroğlu|TR|30|AM|67
7|André Henrique|BR|24|RW|68
-|Ibrahim Sabra|JO|22|RW|64
39|Janderson|BR|27|LW|71
17|Gökdeniz Bayrakdar|TR|24|LW|67
9|Juan|BR|25|ST|72
22|Sinclair Armstrong|IE|23|ST|66|72
14|Bekir Turaç Böke|TR|20|ST|60|70
`,
  },
  {
    id: 'kas', name: 'Kasımpaşa', short: 'KAS', city: 'İstanbul', stadium: 'Recep Tayyip Erdoğan Stadyumu', capacity: 13797,
    colors: ['#1F3F8F', '#FFFFFF'], kit: { pattern: 'plain', colors: ['#1F3F8F', '#FFFFFF'] }, rep: 60, balance: 3500000, coach: 'Emre Belözoğlu', formation: '4-2-3-1',
    players: `
1|Andreas Gianniotis|GR|33|GK|69
25|Ali Emre Yanar|TR|23|GK|60
61|Ege Albayrak|TR|19|GK|50
4|Adem Arous|TN|22|CB|68|74
14|Kévin Mouanga|FR|24|CB|67
27|Matei Ilie|RO|22|CB|67|73
5|Jakob Jessen|DK|25|CB|66
29|Taylan Aydın|TR|20|CB|56
2|Cláudio Winck|BR|32|RB|69
22|Kamil Ahmet Çörekçi|TR|34|RB|64
45|Ayberk Karapo|TR|20|RB|55
21|Godfried Frimpong|NL|26|LB|68
12|Mortadha Ben Ouanes|TN|31|LB|67
-|Ömer Bayram|TR|34|LB|63
26|Kerem Demirbay|DE|33|CM|70
16|Andri Fannar Baldursson|IS|24|CM|67
19|Marcus Rafferty|SE|21|CM|63
51|Elson Mendes|CW|23|CM|62
8|Atakan Müjde|TR|20|CM|58
10|Haris Hajradinović|BA|32|AM|70
34|Fousseni Diabaté|ML|30|RW|67
17|Jesurun Rak-Sakyi|GH|26|RW|67
7|Ali Yavuz Kol|TR|23|RW|63
11|Thiemoko Diarra|ML|22|LW|66|72
-|Emirhan Yiğit|TR|19|LW|54
9|Adrian Benedyczak|PL|25|ST|70
50|Güven Yalçın|TR|27|ST|66
23|Sinan Alkaş|TR|19|ST|55
`,
  },
  {
    id: 'eyup', name: 'Eyüpspor', short: 'EYP', city: 'İstanbul', stadium: 'Recep Tayyip Erdoğan Stadyumu', capacity: 13797,
    colors: ['#6A2C91', '#FFD100'], kit: { pattern: 'plain', colors: ['#6A2C91', '#FFD100'] }, rep: 58, balance: 4000000, coach: 'Atila Gerin', formation: '4-3-3',
    players: `
31|Horațiu Moldovan|RO|28|GK|71|K:Atlético Madrid
1|Emre Bilgin|TR|22|GK|63|70
-|Umut Keseci|TR|20|GK|52
5|Jawad El Yamiq|MA|34|CB|68
33|Zak Jules|SC|29|CB|66
-|Diabel Ndoye|SN|23|CB|62
4|Anıl Yaşar|TR|23|CB|62|K:Çaykur Rizespor
42|Berhan Şatlı|TR|21|CB|60
44|Ömer Ceyhan|TR|20|CB|58
7|Talha Ülvan|TR|25|RB|66
3|Arda Yavuz|TR|22|RB|58
21|Simone Giordano|IT|24|LB|66
-|Yiğit Demir|TR|20|LB|55
15|Charles-André Raux-Yao|FR|25|DM|66
8|David Costa|CV|24|CM|67
18|Hamza Akman|TR|21|CM|64|72
88|Chandrel Massanga|CG|22|CM|62
28|Taşkın İlter|TR|30|CM|62
70|Mete Demir|TR|20|CM|58
10|Abdelhamid Sabiri|MA|29|AM|70
77|Konrad Michalak|PL|28|RW|67
98|Bilal Boutobba|FR|27|RW|66
84|Christ Sadia|CI|21|RW|62
11|Lenny Pintor|FR|26|LW|68
29|Ahmed Abdullahi|NG|22|ST|66|73
9|Yusuf Barası|TR|23|ST|66|72|K:Kasımpaşa
25|Abdou Khadre Sy|SN|22|ST|60
`,
  },
  {
    id: 'koc', name: 'Kocaelispor', short: 'KOC', city: 'Kocaeli', stadium: 'Turka Araç Muayene Kocaeli Stadyumu', capacity: 34829,
    colors: ['#00843D', '#111111'], kit: { pattern: 'stripes', colors: ['#00843D', '#111111'] }, rep: 58, balance: 3000000, coach: 'Selçuk İnan', formation: '4-2-3-1',
    players: `
1|Aleksandar Jovanović|RS|34|GK|69
83|Serhat Öztaşdelen|TR|30|GK|62
23|Onurcan Piri|TR|25|GK|60
4|Tanguy Zoukrou|FR|23|CB|68|73
6|Matej Maglica|HR|28|CB|68
5|Emir Ortakaya|TR|22|CB|64
41|Onur Öztonga|TR|21|CB|60
2|Anfernee Dijksteel|SR|29|RB|68
22|Uğur Kaan Yıldız|TR|22|RB|58
21|Massadio Haïdara|ML|33|LB|67
75|Tayfur Bingöl|TR|32|LB|63
3|Muharrem Cinan|TR|22|LB|60
14|Show|AO|27|DM|68
10|Berkan Kutlu|TR|28|CM|69
20|Mahamadou Susoho|ES|21|CM|66|74
19|Haydar Karataş|TR|19|CM|56
8|Tobias Gulliksen|NO|23|AM|68|73
32|Makana Baku|DE|28|RW|67
7|Dan Agyei|GH|28|RW|66
99|Rigoberto Rivas|HN|27|LW|66
17|Arda Özyar|TR|20|LW|55
9|Bruno Petković|HR|32|ST|72
97|Florian Ayé|FR|29|ST|68
11|Gonçalo Sousa|PT|22|ST|64
26|Metehan Altunbaş|TR|24|ST|60
`,
  },
  {
    id: 'gen', name: 'Gençlerbirliği', short: 'GEN', city: 'Ankara', stadium: 'Eryaman Stadyumu', capacity: 20000,
    colors: ['#E30613', '#111111'], kit: { pattern: 'halves', colors: ['#E30613', '#111111'] }, rep: 57, balance: 3000000, coach: 'Metin Diyadin', formation: '4-4-2',
    players: `
70|İrfan Can Eğribayat|TR|28|GK|70
23|Gökhan Akkan|TR|31|GK|67
61|Berk Deniz Çukurcu|TR|20|GK|52
6|Dimitrios Goutas|GR|31|CB|69
2|Thalisson|BR|26|CB|67
90|Metehan Baltacı|TR|23|CB|66|72|K:Galatasaray
15|Arda Çağan Çelik|TR|21|CB|58
13|Pedro Pereira|PT|28|RB|67
88|Fıratcan Üzüm|TR|26|RB|63
77|Abdurrahim Dursun|TR|27|RB|62
11|Kévin Rodrigues|PT|31|LB|67
5|Peter Etebo|NG|30|DM|68
19|Cheikh Niasse|SN|26|DM|67|K:Hellas Verona
14|Adama Traoré|ML|30|CM|68
48|Salih Uçan|TR|32|CM|68
42|Ousmane Diabaté|GN|24|CM|64
35|Oğulcan Ülgün|TR|26|CM|63
83|Rafael Luís|PT|22|CM|63
10|Franco Tongya|IT|24|AM|67
-|Dilhan Demir|DE|22|AM|60
7|Tiago Gouveia|PT|25|RW|70|K:Benfica
45|Prince Martor Jr.|LR|21|LW|60
-|Arda Akgül|TR|20|LW|55
20|Sékou Koïta|ML|26|ST|69
9|Pedro Mendes|PT|27|ST|68
12|Victor Orakpo|NG|22|ST|64|72|K:OGC Nice
99|Ayaz Özcan|TR|19|ST|55
`,
  },
  {
    id: 'ala', name: 'Alanyaspor', short: 'ALA', city: 'Alanya', stadium: 'Alanya Oba Stadyumu', capacity: 9727,
    colors: ['#F58220', '#00843D'], kit: { pattern: 'plain', colors: ['#F58220', '#00843D'] }, rep: 60, balance: 4000000, coach: 'João Pereira', formation: '4-2-3-1',
    players: `
48|Paulo Victor|BR|29|GK|70
-|Yusuf Karagöz|TR|28|GK|60
23|Mert Bayram|TR|22|GK|55
3|Nuno Lima|PT|25|CB|70
20|Fatih Aksoy|TR|29|CB|68
4|Bedirhan Özyurt|TR|20|CB|58
-|Bilal Demirağ|TR|19|CB|52
94|Florent Hadergjonaj|XK|32|RB|70
5|Fidan Aliti|XK|33|LB|69
-|Nejdet Bilin|TR|19|LB|52
42|Gaius Makouta|CG|28|DM|70
32|Arouna Soro|CI|22|DM|64
58|Maestro|AO|23|CM|69|75
26|İzzet Çelik|TR|25|CM|63
88|Yusuf Özdemir|TR|28|CM|63
8|Enes Keskin|TR|21|CM|60
55|Baran Gezek|TR|20|CM|56
10|Ianis Hagi|RO|27|AM|73
14|Emre Demir|TR|22|AM|65|72
22|Paolo Fernandes|ES|28|RW|68|K:AEK Atina
7|İbrahim Kaya|TR|20|RW|58
12|Meschak Elia|CD|28|LW|71
11|Ruan|BR|25|LW|67
16|Hwang Ui-jo|KR|34|ST|68
19|Iván Cédric|CM|25|ST|66
9|Omar Ben Ali|TN|22|ST|62
17|Arda Usluoğlu|TR|20|ST|56
`,
  },
  {
    id: 'kon', name: 'Konyaspor', short: 'KON', city: 'Konya', stadium: 'Medaş Konya Büyükşehir Stadyumu', capacity: 41600,
    colors: ['#00843D', '#FFFFFF'], kit: { pattern: 'band', colors: ['#00843D', '#FFFFFF'] }, rep: 60, balance: 3500000, coach: 'Çağdaş Atan', formation: '4-2-3-1',
    players: `
13|Bahadır Han Güngördü|TR|27|GK|67
1|Deniz Ertaş|TR|30|GK|66
29|Egemen Aydın|TR|21|GK|54
15|Chidozie Awaziem|NG|29|CB|69
22|Rayyan Baniya|TR|27|CB|68
4|Adil Demirbağ|TR|32|CB|67
5|Uğurcan Yazğılı|TR|27|CB|67
41|Da Mata|BR|26|CB|63
2|Ahmet Oğuz|TR|33|RB|63
26|Arthur Masuaku|CD|32|LB|69
17|Yhoan Andzouana|CG|29|LB|67
3|Arif Boşluk|TR|22|LB|66|72
8|Marko Jevtović|RS|33|DM|67
77|Melih İbrahimoğlu|TR|26|CM|66
66|Rajmund Tóth|HU|23|CM|63
24|Mücahit İbrahimoğlu|AT|21|CM|62
25|Ömer Çobanoğlu|TR|20|CM|56
10|Enis Bardhi|MK|30|AM|71
9|Deniz Türüç|TR|33|AM|66
7|Diogo Gonçalves|PT|29|RW|70
19|Ebrima Colley|GM|26|LW|69|K:Young Boys
91|Jean-Luc Dompé|FR|31|LW|68
11|Jackson Muleka|CD|27|ST|71
94|Enis Destan|TR|25|ST|65
`,
  },
  {
    id: 'gfk', name: 'Gaziantep FK', short: 'GFK', city: 'Gaziantep', stadium: 'Gaziantep Stadyumu', capacity: 30320,
    colors: ['#D2232A', '#111111'], kit: { pattern: 'stripes', colors: ['#D2232A', '#111111'] }, rep: 68, balance: 5500000, coach: 'Mirel Rădoi', formation: '4-2-3-1',
    players: `
25|Kacper Tobiasz|PL|23|GK|72|77
-|Ataberk Dadakdeniz|TR|22|GK|58
81|Cemilhan Aslan|TR|22|GK|58
4|Arda Kızıldağ|TR|27|CB|71
14|Myenty Abena|SR|31|CB|71
21|Abakar Sylla|CI|23|CB|69
77|Sabahattin Destici|TR|20|CB|59
2|Luis Pérez|ES|31|RB|70
18|Deian Sorescu|RO|29|RB|71
-|Nazım Sangaré|TR|31|RB|69
96|Florin Ștefan|RO|30|LB|69
23|Kerim Çalhanoğlu|DE|24|LB|67
3|Drissa Camara|CI|24|DM|71
6|Ulrich Meleke|CI|23|DM|67
7|Juninho Bacuna|CW|28|CM|71
61|Ogün Özçiçek|TR|28|CM|68
8|Victor Gidado|NG|22|CM|67
-|Karamba Gassama|GM|23|CM|63
11|Mirza Cihan|TR|21|CM|61
10|Kacper Kozłowski|PL|23|AM|73|78
44|Alexandru Maxim|RO|36|AM|72
22|Sontje Hansen|NL|24|RW|71|K:Middlesbrough
-|Muhammet Akmelek|TR|19|RW|57
27|Enver Kulašin|BA|22|LW|66
28|Halil Dervişoğlu|TR|26|ST|71|K:Galatasaray
9|Trivante Stewart|JM|27|ST|70|K:Maccabi Haifa
19|Serdar Dursun|TR|34|ST|70
97|Fuat Bavuk|TR|20|ST|58
`,
  },
  {
    id: 'riz', name: 'Çaykur Rizespor', short: 'RİZ', city: 'Rize', stadium: 'Çaykur Didi Stadyumu', capacity: 14879,
    colors: ['#00843D', '#0072BC'], kit: { pattern: 'halves', colors: ['#00843D', '#0072BC'] }, rep: 68, balance: 5500000, coach: 'Recep Uçar', formation: '4-2-3-1',
    players: `
75|Yahia Fofana|CI|25|GK|75
30|Zafer Görgen|TR|28|GK|63
31|Hasan Döne|TR|20|GK|55
2|Husniddin Aliqulov|UZ|27|CB|72
4|Attila Mocsi|HU|25|CB|71
93|Modibo Sagnan|ML|26|CB|71
5|Tayyip Talha Sanuç|TR|26|CB|69
19|Umut Erdem|TR|20|CB|61|71
17|Zakaria Ariss|MA|22|RB|65
37|Muhammet Taha Şahin|TR|21|RB|61
54|Mithat Pala|TR|25|LB|69
21|Siaka Bakayoko|FR|23|LB|65
14|Taylan Antalyalı|TR|31|DM|70
6|Moussa Diakité|ML|22|DM|69|K:Cádiz
20|Qazim Laçi|AL|30|CM|73
-|Can Bozdoğan|TR|25|CM|69
47|Emirhan Yılmaz|TR|20|CM|58
10|Ibrahim Olawoyin|NG|28|AM|72
8|Dal Varešanović|BA|25|AM|71
11|Adedire Mebude|SC|22|RW|71|77
53|Iustin Doicaru|RO|21|RW|65
7|Valentin Mihăilă|RO|26|LW|75
99|Emrecan Bulut|TR|22|LW|61
-|Gennaro Borrelli|IT|26|ST|72|K:Cagliari
9|Ali Sowe|GM|32|ST|71
23|Ahmed Kutucu|TR|26|ST|70|K:Galatasaray
80|Mustafa Coşkun Tosun|TR|19|ST|57
`,
  },
  {
    id: 'erz', name: 'Erzurumspor FK', short: 'ERZ', city: 'Erzurum', stadium: 'Erzurum Kazım Karabekir Stadyumu', capacity: 21374,
    colors: ['#0072BC', '#FFFFFF'], kit: { pattern: 'plain', colors: ['#0072BC', '#FFFFFF'] }, rep: 62, balance: 4500000, coach: 'Serkan Özbalta', formation: '4-4-2',
    players: `
31|Matija Orbanić|HR|28|GK|68
1|Ertuğrul Taşkıran|TR|36|GK|66
17|Erkan Anapa|TR|29|GK|61
18|Nihad Mujakić|BA|27|CB|70
4|Amar Gërxhaliu|XK|24|CB|69
22|Mustafa Yumlu|TR|39|CB|63
23|Cengizhan Bayrak|TR|21|CB|59
-|Taha Rençber|TR|19|CB|55
2|Festy Ebosele|IE|24|RB|71|K:Başakşehir
25|Ömer Arda Kara|TR|19|RB|57
15|Guram Giorbelidze|GE|30|LB|69
53|Orhan Ovacıklı|TR|35|LB|63
3|Yakup Kırtay|TR|22|LB|61
42|Elisha Owusu|GH|28|DM|71
6|Brandon Baiye|BE|25|DM|70
-|Lawrence Agyekum|GH|22|CM|69|76|K:Cercle Brugge
8|Sefa Akgün|TR|26|CM|63
-|Emirhan Acar|TR|20|CM|57
9|Gyrano Kerk|SR|31|RW|71
65|Martín Rodríguez|CL|32|RW|69
97|Kerem Erener|TR|20|RW|58
20|Miguel Cardoso|PT|32|LW|69
90|Nariman Akhundzade|AZ|22|ST|70|76|K:Columbus Crew
19|Ibrahim Diabate|CI|22|ST|67|K:GAIS
10|Eren Tozlu|TR|35|ST|65
99|Mustafa Fettahoğlu|TR|21|ST|58
`,
  },
  {
    id: 'amed', name: 'Amedspor', short: 'AMD', city: 'Diyarbakır', stadium: 'Diyarbakır Stadyumu', capacity: 33000,
    colors: ['#E30613', '#00843D'], kit: { pattern: 'stripes', colors: ['#E30613', '#00843D'] }, rep: 62, balance: 4500000, coach: 'Besnik Hasi', formation: '4-2-3-1',
    players: `
40|Alban Lafont|FR|27|GK|75
27|Burak Bozan|TR|26|GK|61
-|Veysel Sapan|TR|21|GK|55
4|David Bates|SC|29|CB|70
5|Lumbardh Dellova|XK|26|CB|70
33|Amadou Cissé|GN|24|CB|65
81|Ali Turap Bülbül|TR|21|CB|65|75
-|Berat Perçin|TR|20|CB|55
21|Mehmet Yeşil|TR|25|RB|63
47|Kahraman Demirtaş|TR|33|RB|65
17|Umut Meraş|TR|31|LB|69
3|Miraç Acer|TR|25|LB|63
18|Gökhan Gül|DE|28|DM|69
22|Rayan Raveloson|MG|29|CM|70
8|Furkan Soyalp|TR|31|CM|68
6|Cem Üstündağ|AT|24|CM|67
97|Berk Kızıldemir|TR|20|CM|57
91|Dia Saba|IL|33|AM|71
93|Rayan Lutin|KM|23|AM|65
7|Ermal Krasniqi|XK|27|RW|70
10|Samuel Ballet|CH|24|RW|69
11|Yira Sor|NG|26|LW|72
99|Gift Orban|NG|24|ST|74|K:TSG Hoffenheim
45|Mbaye Diagne|SN|34|ST|70
74|Mohamed Khalil|SY|22|ST|61
19|Muhammed Yıldırım|TR|21|ST|59
`,
  },
  {
    id: 'cor', name: 'Çorum FK', short: 'ÇOR', city: 'Çorum', stadium: 'Çorum Şehir Stadyumu', capacity: 15000,
    colors: ['#E30613', '#111111'], kit: { pattern: 'plain', colors: ['#E30613', '#111111'] }, rep: 60, balance: 5000000, coach: 'Uğur Uçar', formation: '4-2-3-1',
    players: `
1|Marcos Felipe|BR|30|GK|73
18|Erhan Erentürk|TR|31|GK|65
54|Arif Şimşir|TR|23|GK|61
-|Çağlar Söyüncü|TR|30|CB|76
5|Alexandre Penetra|PT|25|CB|71
6|Hrvoje Smolčić|HR|25|CB|71
4|Serdar Saatçı|TR|23|CB|70|75
15|Arda Şengül|TR|21|CB|58
11|Gökhan Sazdağı|TR|31|RB|67
22|Hüseyin Bulut|TR|24|RB|61
24|Andrei Borza|RO|20|LB|70|79
88|Cemali Sertel|TR|30|LB|67
3|Berat Özdemir|TR|28|DM|71
20|Ylber Ramadani|AL|30|DM|71
10|Mohamed Diomande|CI|24|CM|72
8|Markus Karlsbakk|NO|22|CM|69|75
26|Ermin Mahmić|BA|28|CM|66
30|Ahmed Ildız|TR|30|CM|66
17|Emircan Gürlük|TR|21|CM|58
16|Fredy|AO|36|AM|69
21|Göktan Gürpüz|TR|23|AM|66|73
23|Cengiz Ünder|TR|29|RW|75
89|Alexandros Kyziridis|GR|26|RW|66
45|Furkan Çetinkaya|TR|22|LW|59
-|Youssoufa Moukoko|DE|21|ST|73|81
9|Mame Thiam|SN|33|ST|69
19|Jesús Ramírez|VE|28|ST|66
`,
  },

// Yurt dışı kulüpleri: transfer tekliflerinin ve satışların muhatapları.
export const FOREIGN_CLUBS = [
  { name: 'Al-Hilal', country: 'SA', rep: 82, money: 3 },
  { name: 'Al-Nassr', country: 'SA', rep: 80, money: 3 },
  { name: 'Al-Ittihad', country: 'SA', rep: 78, money: 3 },
  { name: 'Al-Ahli', country: 'SA', rep: 77, money: 3 },
  { name: 'Al-Qadsiah', country: 'SA', rep: 70, money: 2.5 },
  { name: 'Al-Sadd', country: 'QA', rep: 68, money: 2 },
  { name: 'FC Porto', country: 'PT', rep: 84, money: 1.2 },
  { name: 'Benfica', country: 'PT', rep: 85, money: 1.3 },
  { name: 'Sporting CP', country: 'PT', rep: 84, money: 1.2 },
  { name: 'Ajax', country: 'NL', rep: 82, money: 1.2 },
  { name: 'PSV', country: 'NL', rep: 82, money: 1.2 },
  { name: 'Feyenoord', country: 'NL', rep: 80, money: 1.1 },
  { name: 'Olympiakos', country: 'GR', rep: 76, money: 1 },
  { name: 'PAOK', country: 'GR', rep: 74, money: 0.9 },
  { name: 'Panathinaikos', country: 'GR', rep: 73, money: 0.9 },
  { name: 'Club Brugge', country: 'BE', rep: 78, money: 1 },
  { name: 'Anderlecht', country: 'BE', rep: 74, money: 0.9 },
  { name: 'Celtic', country: 'SC', rep: 78, money: 1.1 },
  { name: 'Rangers', country: 'SC', rep: 76, money: 1 },
  { name: 'Red Bull Salzburg', country: 'AT', rep: 77, money: 1.1 },
  { name: 'Dinamo Zagreb', country: 'HR', rep: 72, money: 0.8 },
  { name: 'Kızılyıldız', country: 'RS', rep: 73, money: 0.8 },
  { name: 'Zenit', country: 'RU', rep: 76, money: 1.4 },
  { name: 'Olympique Marsilya', country: 'FR', rep: 84, money: 1.5 },
  { name: 'Olympique Lyon', country: 'FR', rep: 82, money: 1.4 },
  { name: 'Lille', country: 'FR', rep: 81, money: 1.3 },
  { name: 'Sevilla', country: 'ES', rep: 82, money: 1.3 },
  { name: 'Villarreal', country: 'ES', rep: 83, money: 1.5 },
  { name: 'Real Betis', country: 'ES', rep: 81, money: 1.4 },
  { name: 'Atalanta', country: 'IT', rep: 85, money: 1.8 },
  { name: 'AS Roma', country: 'IT', rep: 85, money: 1.8 },
  { name: 'Lazio', country: 'IT', rep: 82, money: 1.5 },
  { name: 'Fiorentina', country: 'IT', rep: 81, money: 1.5 },
  { name: 'Bologna', country: 'IT', rep: 80, money: 1.4 },
  { name: 'Eintracht Frankfurt', country: 'DE', rep: 83, money: 1.8 },
  { name: 'VfB Stuttgart', country: 'DE', rep: 82, money: 1.7 },
  { name: 'VfL Wolfsburg', country: 'DE', rep: 79, money: 1.6 },
  { name: 'Brighton', country: 'EN', rep: 84, money: 2.5 },
  { name: 'West Ham United', country: 'EN', rep: 82, money: 2.4 },
  { name: 'Everton', country: 'EN', rep: 81, money: 2.2 },
  { name: 'Crystal Palace', country: 'EN', rep: 82, money: 2.3 },
  { name: 'Fulham', country: 'EN', rep: 80, money: 2.1 },
  { name: 'Leicester City', country: 'EN', rep: 76, money: 1.6 },
  { name: 'LA Galaxy', country: 'US', rep: 70, money: 1.8 },
  { name: 'Inter Miami', country: 'US', rep: 72, money: 2 },
];

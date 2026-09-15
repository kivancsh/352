// Otomatik üretildi: tools/fetch_squads.py + tools/build_squads.py (Wikipedia / Wikidata, Eylül 2026).
// Kadrolar, forma numaraları, uyruklar, yaşlar ve kiralıklar gerçektir; güç değerleri tahmindir.
// Biçim: no|ad|ülke|yaş|mevki|güç[|potansiyel][|K:ana kulüp@kiralık bitiş yılı]

export const WORLD_SQUADS = {
  "psg": { coach: "Luis Enrique", capacity: 47929, players: `
9|Ferran Torres|ES|26|ST|82
10|Ousmane Dembélé|FR|29|ST|90
7|Khvicha Kvaratskhelia|GE|25|LW|88
8|Fabián Ruiz|ES|30|CM|84
2|Achraf Hakimi|MA|27|RB|87
12|Lucas Digne|FR|33|LB|76
14|Désiré Doué|FR|21|RW|85|90
5|Marquinhos|BR|32|CB|84
11|Maghnes Akliouche|FR|24|AM|80
22|Mika Godts|BE|21|LW|78
21|Lucas Hernandez|FR|30|CB|80
33|Warren Zaïre-Emery|FR|20|CM|82|88
25|Nuno Mendes|PT|24|LB|87
17|Vitinha|PT|26|CM|88
87|João Neves|PT|21|CM|86
39|Matvey Safonov|RU|27|GK|80
6|Illia Zabarnyi|UA|23|CB|81
27|Dro Fernández|ES|18|AM|72|86
51|Willian Pacho|EC|24|CB|84
30|Lucas Chevalier|FR|24|GK|82
24|Senny Mayulu|FR|20|AM|76|85
4|Lucas Beraldo|BR|22|CB|76
16|Alessandro Longoni|IT|18|GK|72
47|Quentin Ndjantou|FR|19|LW|74
` },
  "bay": { coach: "Vincent Kompany", capacity: 75024, players: `
9|Harry Kane|EN|33|ST|89
17|Michael Olise|FR|24|RW|88
10|Jamal Musiala|DE|23|AM|88
34|Ismael Saibari|MA|25|AM|81
14|Luis Díaz|CO|29|LW|86
6|Joshua Kimmich|DE|31|DM|87
19|Alphonso Davies|CA|25|LB|83
2|Dayot Upamecano|FR|27|CB|84
11|Nathaniel Brown|DE|23|LB|80
7|Serge Gnabry|DE|31|RW|80
3|Kim Min-jae|KR|29|CB|81
4|Jonathan Tah|DE|30|CB|83
1|Manuel Neuer|DE|40|GK|82
45|Aleksandar Pavlović|DE|22|DM|83|88
42|Lennart Karl|DE|18|AM|76|88
8|Tom Bischof|DE|21|CM|77|85
27|Konrad Laimer|AT|29|RB|81
21|Hiroki Itō|JP|27|LB|79
39|Bara Sapoko Ndiaye|SN|18|DM|77
44|Josip Stanišić|HR|26|CB|77
23|Sacha Boey|FR|25|RB|77
40|Jonas Urbig|DE|23|GK|76|85
47|David Santos Daiber|PT|19|CM|74
26|Sven Ulreich|DE|38|GK|68
` },
  "rma": { coach: "José Mourinho", capacity: 83186, players: `
10|Kylian Mbappé|FR|27|ST|91
5|Jude Bellingham|EN|23|AM|88
17|Marc Cucurella|ES|28|LB|83
7|Vinícius Júnior|BR|26|LW|89
25|Yan Diomande|CI|19|RW|78|87
20|Bernardo Silva|PT|32|CM|86
19|Carlos Espí|ES|21|ST|72|82
11|Rodrygo|BR|25|RW|84
16|Ibrahima Konaté|FR|27|CB|85
12|Trent Alexander-Arnold|EN|27|RB|84
9|Endrick|BR|20|ST|78|88
1|Thibaut Courtois|BE|34|GK|88
15|Arda Güler|TR|21|AM|84|89
24|Denzel Dumfries|NL|30|RB|82
8|Federico Valverde|UY|28|CM|87
4|Dean Huijsen|ES|21|CB|83|88
21|Brahim Díaz|MA|27|AM|80
6|Eduardo Camavinga|FR|23|CM|83
14|Aurélien Tchouaméni|FR|26|DM|84
22|Antonio Rüdiger|DE|33|CB|82
2|Raúl Asencio|ES|23|CB|78
18|Álvaro Carreras|ES|23|LB|82
3|Éder Militão|BR|28|CB|83
23|Ferland Mendy|FR|31|LB|79
13|Andriy Lunin|UA|27|GK|78
27|Thiago Pitarch|ES|19|AM|71
` },
  "liv": { coach: "Andoni Iraola", capacity: 61276, players: `
29|Bradley Barcola|FR|23|LW|84
10|Alexis Mac Allister|AR|27|CM|86
33|Ronald Araújo|UY|27|CB|83|K:Barcelona
23|Víctor Muñoz|ES|23|LW|79
9|Alexander Isak|SE|26|ST|87
18|Cody Gakpo|NL|27|LW|84
1|Alisson Becker|BR|33|GK|86
8|Dominik Szoboszlai|HU|25|CM|86
4|Virgil van Dijk|NL|35|CB|85
5|Jérémy Jacquet|FR|21|CB|78|86
7|Florian Wirtz|DE|23|AM|86
14|Federico Chiesa|IT|28|RW|78
22|Hugo Ekitike|FR|24|ST|84
73|Rio Ngumoha|EN|17|LW|72|86
30|Jeremie Frimpong|NL|25|RB|82
6|Milos Kerkez|HU|22|LB|81
21|Kostas Tsimikas|GR|30|LB|77
2|Joe Gomez|EN|29|CB|78
67|Lewis Koumas|WL|20|ST|77
38|Ryan Gravenberch|NL|24|DM|86
3|Wataru Endo|JP|33|DM|76
25|Giorgi Mamardashvili|GE|25|GK|83
42|Trey Nyoni|EN|19|DM|73
15|Giovanni Leoni|IT|19|CB|76|86
12|Conor Bradley|NX|23|RB|79
28|Freddie Woodman|EN|29|GK|68
56|Vítězslav Jaroš|CZ|25|GK|68
76|Jayden Danns|EN|20|RW|68
53|James McConnell|EN|21|AM|68
44|Luke Chambers|EN|22|CB|66
95|Harvey Davies|EN|22|GK|64
` },
  "int": { coach: "Cristian Chivu", capacity: 75817, players: `
10|Lautaro Martínez|AR|28|ST|88
99|Djed Spence|EN|26|RB|80
6|John Stones|EN|32|CB|81
21|Curtis Jones|EN|25|CM|83
28|Benjamin Pavard|FR|30|CB|82
25|Manuel Akanji|CH|31|CB|84
9|Marcus Thuram|FR|29|ST|85
20|Hakan Çalhanoğlu|TR|32|DM|84
95|Alessandro Bastoni|IT|27|CB|86
1|Josep Martínez|ES|28|GK|80
23|Nicolò Barella|IT|29|CM|86
32|Federico Dimarco|IT|28|LB|85
94|Pio Esposito|IT|21|ST|78|87
22|Henrikh Mkhitaryan|AM|37|AM|79
7|Piotr Zieliński|PL|32|CM|80
17|Andy Diouf|FR|23|CM|78
8|Petar Sučić|HR|22|CM|79|85
5|Aleksandar Stanković|RS|21|DM|76
49|Ivan Provedel|IT|32|GK|81
31|Yann Bisseck|DE|25|CB|75
11|Luis Henrique|BR|24|RW|79
30|Carlos Augusto|BR|27|LB|79
14|Ange-Yoan Bonny|CI|22|ST|78
12|Raffaele Di Gennaro|IT|32|GK|70
` },
  "mci": { coach: "Enzo Maresca", capacity: 61038, players: `
9|Erling Haaland|NO|26|ST|91
17|Enzo Fernández|AR|25|CM|85
5|Elliot Anderson|EN|23|CM|84|88
7|Iliman Ndiaye|SN|26|LW|81
10|Rayan Cherki|FR|22|AM|85|89
47|Phil Foden|EN|26|AM|85
1|Gianluigi Donnarumma|IT|27|GK|88
32|Ayyoub Bouaddi|MA|18|DM|74|87
6|Marc Guéhi|EN|26|CB|84
8|Mateo Kovačić|HR|32|CM|81
3|Rúben Dias|PT|29|CB|86
42|Antoine Semenyo|GH|26|RW|84
33|Nico O'Reilly|EN|21|LB|80|86
11|Jérémy Doku|BE|24|LW|83
28|Gerónimo Rulli|AR|34|GK|77
24|Joško Gvardiol|HR|24|CB|85
45|Abdukodir Khusanov|UZ|22|CB|78|85
82|Rico Lewis|EN|21|RB|79
21|Rayan Aït-Nouri|DZ|25|LB|81
27|Matheus Nunes|PT|27|RB|80
37|Allan|BR|22|RW|76
22|Vitor Reis|BR|20|CB|73
56|Ryan McAidoo|EN|18|ST|74
13|Marcus Bettinelli|EN|34|GK|70
61|Kaden Braithwaite|EN|18|LB|71
75|Floyd Samba|FR|17|CM|72
` },
  "ars": { coach: "Mikel Arteta", capacity: 60704, players: `
7|Bukayo Saka|EN|24|RW|88
17|Christos Tzolis|GR|24|LW|81
41|Declan Rice|EN|27|DM|88
15|Ezri Konsa|EN|28|CB|83
39|Bruno Guimarães|BR|28|CM|86
23|Mikel Merino|ES|30|CM|82
8|Martin Ødegaard|NO|27|AM|86
29|Kai Havertz|DE|27|ST|83
1|David Raya|ES|30|GK|86
14|Viktor Gyökeres|SE|28|ST|85
10|Eberechi Eze|EN|28|AM|84
36|Martín Zubimendi|ES|27|DM|85
2|William Saliba|FR|25|CB|87
20|Noni Madueke|EN|24|RW|81
33|Riccardo Calafiori|IT|24|LB|81
6|Gabriel Magalhães|BR|28|CB|87
13|Kepa Arrizabalaga|ES|31|GK|78
49|Myles Lewis-Skelly|EN|19|LB|78|87
5|Piero Hincapié|EC|24|LB|82
4|Ben White|EN|28|RB|81
12|Jurriën Timber|NL|25|RB|84
30|Illan Meslier|FR|26|GK|76
3|Cristhian Mosquera|ES|22|CB|78|85
` },
  "bar": { coach: "Hansi Flick", capacity: 105000, players: `
10|Lamine Yamal|ES|19|RW|90|95
5|Pau Cubarsí|ES|19|CB|84|90
16|Rodri|ES|30|DM|87
17|Anthony Gordon|EN|25|LW|83
20|Dani Olmo|ES|28|AM|83
9|Gabriel Jesus|BR|29|ST|79
8|Pedri|ES|23|CM|88
6|Gavi|ES|22|CM|83
14|Karim Adeyemi|DE|24|RW|81
11|Raphinha|BR|29|LW|87
2|João Cancelo|PT|32|RB|81
7|Fermín López|ES|23|AM|83
29|Hamza Abdelkarim|EG|18|ST|70|82
21|Frenkie de Jong|NL|29|CM|85
3|Alejandro Balde|ES|22|LB|82
1|Joan Garcia|ES|25|GK|85
25|Dominik Livaković|HR|31|GK|78
23|Jules Koundé|FR|27|RB|85
15|Andreas Christensen|DK|30|CB|79
27|Jesse Bisiwu|BE|18|LW|77
19|Roony Bardghji|SE|20|RW|74|84
12|Xavi Espart|ES|19|CB|75
13|Wojciech Szczęsny|PL|36|GK|78
22|Marc Bernal|ES|19|DM|76|85
24|Eric Garcia|ES|25|CB|73
18|Gerard Martín|ES|24|RB|70
4|Brian Fariñas|ES|20|CM|71
` },
  "atm": { coach: "Diego Simeone", capacity: 70692, players: `
19|Julián Alvarez|AR|26|ST|87
21|Cristian Romero|AR|28|CB|85
20|Giuliano Simeone|AR|23|RW|81
14|Marcos Llorente|ES|31|RB|83
10|Álex Baena|ES|25|AM|83
7|Lee Kang-in|KR|25|AM|81
22|Alejandro Grimaldo|ES|30|LB|83
15|Jonathan David|CA|26|ST|82|K:Juventus
9|Alexander Sørloth|NO|30|ST|81
11|Ademola Lookman|NG|28|LW|83
18|Marc Pubill|ES|23|CB|78
13|Jan Oblak|SI|33|GK|86
6|Koke|ES|34|DM|80
24|Robin Le Normand|ES|29|CB|80
1|Juan Musso|AR|32|GK|77
23|Morten Hjulmand|DK|27|DM|83
8|Pablo Barrios|ES|23|CM|83|87
3|Obed Vargas|MX|21|DM|74
5|Johnny Cardoso|US|24|DM|80
17|Dávid Hancko|SK|28|CB|73
4|Rodrigo Mendoza|ES|21|DM|74
16|Arnau Ortiz|ES|24|AM|72
30|Dani Martínez|ES|22|LB|71
25|Salvi Esquivel|ES|20|GK|68
` },
  "bvb": { coach: "Niko Kovač", capacity: 81365, players: `
7|Jobe Bellingham|EN|20|CM|79|86
18|Ethan Nwaneri|EN|19|AM|79|88|K:Arsenal
23|Emre Can|DE|32|DM|78
9|Serhou Guirassy|GN|30|ST|85
8|Felix Nmecha|DE|25|CM|82
4|Nico Schlotterbeck|DE|26|CB|84
19|Konstantinos Karetsas|GR|18|AM|74|86
20|Marcel Sabitzer|AT|32|CM|80
17|Carney Chukwuemeka|AT|22|AM|77
21|Fábio Silva|PT|24|ST|77
45|Giannis Konstantelias|GR|23|AM|76
1|Gregor Kobel|CH|28|GK|85
26|Julian Ryerson|NO|28|RB|80
25|Joey Veerman|NL|27|CM|79
3|Waldemar Anton|DE|30|CB|81
14|Maximilian Beier|DE|23|ST|80
5|Ramy Bensebaini|DZ|31|LB|78
24|Daniel Svensson|SE|24|LB|78
40|Samuele Inácio|IT|18|RW|73
22|Joane Gadou|FR|19|CB|72
41|Mathis Albert|US|17|LW|72
28|Justin Lerma|EC|18|CM|71
36|Kauã Prates|BR|17|CB|71
49|Luca Reggiani|IT|18|RB|70
39|Filippo Mane|IT|21|LB|69
44|Enzo dos Santos|LU|17|DM|66
33|Alexander Meyer|DE|35|GK|64
30|Patrick Drewes|DE|33|GK|65
31|Silas Ostrzinski|DE|22|GK|63
48|Mussa Kaba|DE|17|AM|63
` },
  "rom": { coach: "Gian Piero Gasperini", capacity: 70634, players: `
21|Paulo Dybala|AR|32|AM|81
20|Nahuel Molina|AR|28|RB|80
17|Manu Koné|FR|25|CM|84
14|Donyell Malen|NL|27|ST|81
86|Rodrigo Mora|PT|19|AM|76|86
18|Matías Soulé|AR|23|RW|82
7|Lorenzo Pellegrini|IT|30|AM|79
26|Leonardo Balerdi|AR|27|CB|80|K:Marsilya
4|Bryan Cristante|IT|31|DM|79
9|Santiago Castro|AR|21|ST|77
99|Mile Svilar|RS|26|GK|86
23|Gianluca Mancini|IT|30|CB|82
22|Mario Hermoso|ES|31|CB|78
3|Konstantinos Koulierakis|GR|25|CB|76
43|Wesley|BR|22|RB|80
15|Marten de Roon|NL|35|DM|76
5|Evan Ndicka|CI|26|CB|83
95|Pierluigi Gollini|IT|31|GK|72
2|Devyne Rensch|NL|23|RB|72
61|Niccolò Pisilli|IT|21|DM|72
87|Daniele Ghilardi|IT|23|LB|69
70|Giorgio De Marzi|US|19|GK|69
77|Emanuele Lulli|IT|19|CB|68
` },
  "scp": { coach: "Rui Borges", capacity: 52707, players: `
19|Nestory Irankunda|AU|20|RW|76|84
97|Luis Suárez|CO|28|ST|83
25|Gonçalo Inácio|PT|24|CB|83
20|Maximiliano Araújo|UY|26|LB|81
28|Jesse Derry|EN|19|LW|70|82|K:Chelsea
10|Geny Catamo|MZ|25|RW|79
17|Rodrigo Zalazar|UY|26|AM|80
6|Zeno Debast|BE|22|CB|80
72|Eduardo Quaresma|PT|24|CB|79
1|Rui Silva|PT|32|GK|81
22|Iván Fresneda|ES|21|RB|76
7|Fotis Ioannidis|GR|26|ST|79
77|Issa Doumbia|IT|22|CM|75
5|Sergi Altimira|ES|24|CM|76
31|Luis Guilherme|BR|20|LW|74
58|Flávio Gonçalves|PT|19|AM|75
13|Georgios Vagiannidis|GR|24|RB|74
55|Ibrahima Ba|SN|21|LB|74
11|Nuno Santos|PT|31|CB|72
4|Silas Andersen|DK|22|CM|72
9|Rafael Nel|PT|21|ST|71
8|João Simões|PT|19|DM|70
30|Kaique Pereira|BR|23|GK|67
18|Moncef Zekri|MA|17|RB|68
21|Pedro Lima|BR|23|AM|68
73|Eduardo Felicíssimo|PT|19|LB|66
99|Francisco Silva|PT|20|GK|63
41|Diego Callai|BR|22|GK|63
50|Rodrigo Dias|PT|25|CB|64
` },
  "avl": { coach: "Unai Emery", capacity: 43205, players: `
17|Alejandro Garnacho|AR|22|LW|81|K:Chelsea
1|Zion Suzuki|JP|23|GK|80
39|Brian Madjo|EN|17|ST|68|80
11|Nicolas Jackson|SN|25|ST|81
27|Leon Goretzka|DE|31|CM|82
19|Ibrahim Mbaye|SN|18|LW|72|85
7|John McGinn|SC|31|CM|81
18|Tammy Abraham|EN|28|ST|79
6|Ross Barkley|EN|32|AM|77
29|Aaron Wan-Bissaka|CD|28|RB|80|K:West Ham United
44|Johan Manzambi|CH|20|CM|77|86
35|João Gomes|BR|25|DM|82
4|Taylor Harwood-Bellis|EN|24|CB|78
3|Victor Lindelöf|SE|32|CB|78
13|Matteo Ruggeri|IT|24|LB|78
10|Emiliano Buendía|AR|29|AM|78
2|Matty Cash|PL|29|RB|80
14|Pau Torres|ES|29|CB|82
22|Ian Maatsen|NL|24|LB|79
24|Amadou Onana|BE|24|DM|82
5|Tyrone Mings|EN|33|CB|79
8|Boubacar Kamara|FR|26|DM|83
53|George Hemmings|EN|19|DM|70
47|Alysson|BR|20|RW|68
48|Modou Kéba Cissé|SN|21|LB|67
40|Marco Bizot|NL|35|GK|64
26|Lamare Bogarde|NL|22|AM|66
20|Jamaldeen Jimoh-Aloba|EN|19|CM|63
42|James Wright|EN|21|GK|62
` },
  "por": { coach: "Francesco Farioli", capacity: 50033, players: `
29|Santiago Giménez|MX|25|ST|82|K:Milan
99|Diogo Costa|PT|26|GK|86
19|André Silva|PT|30|ST|77
9|Samu Aghehowa|ES|22|ST|83|88
4|Jakub Kiwior|PL|26|CB|81
16|Hwang In-beom|KR|29|CM|79
42|Seko Fofana|CI|31|CM|79|K:Rennes
10|Gabri Veiga|ES|24|CM|81
8|Victor Froholdt|DK|20|CM|79|86
5|Jan Bednarek|PL|30|CB|79
33|Souza|BR|20|CB|79|K:Tottenham
7|William Gomes|BR|20|RW|77
13|Pablo Rosario|DO|29|DM|77
11|Pepê|BR|29|RW|80
18|Nehuén Pérez|AR|26|CB|79
17|Borja Sainz|ES|25|LW|78
77|Oskar Pietuszewski|PL|18|LW|72|86
22|Alan Varela|AR|25|DM|82
12|Zaidu Sanusi|NG|29|RB|72
-|Gabriel Veron|BR|23|ST|71
20|Alberto Costa|PT|23|RB|77
37|Gabriel Mec|BR|18|RW|70
74|Francisco Moura|PT|26|LB|80
52|Martim Fernandes|PT|20|RB|78|85
24|João Costa|PT|30|GK|64
21|Dominik Prpić|HR|22|LB|65
14|Cláudio Ramos|PT|34|GK|62
15|Vasco Sousa|PT|23|AM|63
50|João Afonso|PT|25|GK|62
` },
  "mun": { coach: "Michael Carrick", capacity: 74158, players: `
9|Marcus Rashford|EN|28|LW|82
18|Youri Tielemans|BE|29|CM|82
8|Bruno Fernandes|PT|31|AM|86
6|Lisandro Martínez|AR|28|CB|83
20|Carlos Baleba|CM|22|DM|81|87
23|Luke Shaw|EN|31|LB|78
7|Mason Mount|EN|27|AM|79
17|Andrey Santos|BR|22|CM|79
5|Harry Maguire|EN|33|CB|79
30|Benjamin Šeško|SI|23|ST|82|87
19|Bryan Mbeumo|CM|27|RW|84
37|Kobbie Mainoo|EN|21|CM|80|86
10|Matheus Cunha|BR|27|LW|84
4|Matthijs de Ligt|NL|26|CB|82
11|Joshua Zirkzee|NL|25|ST|77
1|Senne Lammens|BE|24|GK|81
16|Amad Diallo|CI|24|RW|82
3|Noussair Mazraoui|MA|28|RB|79
13|Patrick Dorgu|DK|21|LB|79
2|Diogo Dalot|PT|27|RB|80
15|Leny Yoro|FR|20|CB|80|87
26|Ayden Heaven|EN|19|CB|74|84
31|Shea Lacey|EN|19|LW|70
41|Harry Amass|EN|19|CB|68
39|Tyler Fletcher|SC|19|DM|67
25|Manuel Ugarte|UY|25|DM|79
12|Karl Darlow|WL|35|GK|63
38|Jack Fletcher|EN|19|DM|65
45|Dermot Mee|NX|23|GK|62
22|Tom Heaton|EN|40|GK|57
` },
  "bru": { coach: "Ivan Leko", capacity: 29062, players: `
7|Nicolò Tresoldi|DE|21|ST|76
1|Yann Sommer|CH|37|GK|80
4|Joel Ordóñez|EC|22|CB|80
8|Freddie Potts|EN|22|CM|72
65|Joaquin Seys|BE|21|LB|77
20|Hans Vanaken|BE|33|AM|81
9|Carlos Forbs|PT|25|RW|78
3|Lee Han-beom|KR|24|CB|76
11|Jan Virgili|ES|20|RW|74
44|Brandon Mechele|BE|33|CB|77
41|Hugo Siquet|BE|24|RB|76
10|Hugo Vetlesen|NO|26|CM|79
27|Wisdom Mike|DE|17|LW|69
32|Matteo Dams|BE|22|LB|73
17|Romeo Vermant|BE|22|ST|72
85|Tian Nai Koren|SI|17|AM|69
16|Cheveyo Tsawa|CH|19|CM|72
67|Mamadou Diakhon|SN|20|RW|70
86|Gianluca Okon|IT|25|DM|70
64|Kyriani Sabbe|BE|21|RB|76
80|Félix Lemaréchal|FR|23|AM|67
70|Alejandro Granados|ES|20|CM|68
58|Jorne Spileers|BE|21|RB|66
29|Nordin Jackers|BE|28|GK|76
62|Lynnt Audoor|BE|22|DM|66
77|Andrej Vasovic|CH|18|LW|63
81|Argus Vanden Driessche|BE|25|GK|60
` },
  "bet": { coach: "Manuel Pellegrini", capacity: 70000, players: `
19|Troy Parrott|IE|24|ST|79
2|Héctor Bellerín|ES|31|RB|78
7|Antony|BR|26|RW|82
25|Dani Ceballos|ES|30|CM|80
22|Isco|ES|34|AM|81
20|Giovanni Lo Celso|AR|30|AM|80
11|Fran García|ES|26|LB|78
5|Marc Bartra|ES|35|CB|75
10|Abde Ezzalzouli|MA|24|LW|81
17|Rodrigo Riquelme|ES|26|LW|77
8|Pablo Fornals|ES|30|CM|81
9|Cucho Hernández|CO|27|ST|80
3|Diego Llorente|ES|32|CB|77
23|Junior Firpo|DO|29|LB|77
15|Álvaro Fidalgo|MX|29|CM|77
1|Álvaro Valles|ES|29|GK|79
4|Natan|BR|25|CB|79
21|Marc Roca|ES|29|DM|80
18|Nelson Deossa|CO|26|DM|69
6|Facundo Bernal|UY|22|DM|69
16|Valentín Gómez|AR|23|CB|69
13|Diego Conde|ES|27|GK|67|K:Villarreal
24|Aitor Ruibal|ES|30|RB|76
14|Iker Losada|ES|25|RW|66
12|Ángel Ortiz|ES|22|LB|65
` },
  "psv": { coach: "Peter Bosz", capacity: 35000, players: `
8|Sergiño Dest|US|25|RB|79
2|Lutsharel Geertruida|NL|26|CB|78|K:RB Leipzig
18|Filip Kostić|RS|33|LB|76
5|Ivan Perišić|HR|37|LW|77
9|Ricardo Pepi|US|23|ST|78
7|Ruben van Bommel|NL|22|LW|78
19|Esmir Bajraktarević|BA|21|RW|76
32|Matěj Kovář|CZ|26|GK|78
20|Guus Til|NL|28|AM|81
10|Paul Wanner|AT|20|AM|77|85
24|Kodai Sano|JP|23|DM|78
27|Dennis Man|RO|27|RW|78
14|Alassane Pléa|FR|33|ST|75
29|Sam Lammers|NL|29|ST|74
17|Mauro Júnior|BR|27|LB|77
22|Jerdy Schouten|NL|29|DM|81
3|Yarek Gasiorowski|ES|21|CB|76|84
4|Armando Obispo|CW|27|CB|77
23|Mikkel Bro Hansen|DK|17|ST|71
6|Ryan Flamingo|NL|23|CB|78
25|Kiliann Sildillia|FR|24|LB|68
39|Adamo Nagalo|BF|23|CB|69
31|Noah Fernandez|BE|18|CM|69
21|Sven Mijnans|NL|26|AM|78
11|Sami Ouaissa|NL|21|RW|65
1|Nick Olij|NL|31|GK|64
35|Ayoni Santos|CV|21|AM|63
37|Amir Bouhamdi|NL|18|LW|63
38|Fabian Merién|NL|17|CB|62
51|Tijn Smolenaars|NL|21|GK|59
` },
  "fey": { coach: "Giovanni van Bronckhorst", capacity: 47500, players: `
17|Reiss Nelson|EN|26|LW|76
49|Shaqueel van Persie|NL|19|ST|70|84
23|Anis Hadj Moussa|DZ|24|RW|80
15|Jordan Bos|AU|23|LB|76
4|Tsuyoshi Watanabe|JP|29|CB|79
26|Givairo Read|NL|20|RB|77|84
7|Jakub Moder|PL|27|CM|78
14|Sem Steijn|NL|24|AM|79
6|Jerry St. Juste|NL|29|CB|76
10|Luciano Valente|NL|22|AM|76
35|Mika Mármol|ES|25|CB|75
16|Javi López|ES|24|LB|74|K:Real Sociedad
8|Gjivai Zechiël|NL|22|CM|73
19|Nacho Ferri|ES|21|ST|73
1|Tjark Ernst|DE|23|GK|76
28|Oussama Targhalline|MA|24|DM|76
11|Gonçalo Borges|PT|25|RW|74
34|Charles Vanhoutte|BE|27|DM|76
27|Gaoussou Diarra|ML|23|RW|70
33|Florian Kastenmeier|DE|29|GK|68
2|Bart Nieuwkoop|NL|30|CB|70
20|Mats Deijl|NL|29|LB|67
22|Tobias van den Elshout|NL|19|AM|68
5|Gijs Smal|NL|28|CB|66
39|Liam Bossin|IE|30|GK|63
3|Thomas Beelen|NL|25|CB|64
24|Thijs Kraaijeveld|NL|19|CM|63
36|Jivayno Zinhagel|NL|17|LW|62
` },
  "lil": { coach: "Davide Ancelotti", capacity: 50186, players: `
8|Ethan Mbappé|FR|19|CM|70|80
18|Ayase Ueda|JP|27|ST|79
9|Olivier Giroud|FR|39|ST|74
12|Orlando Gill|PY|26|GK|74
6|Nabil Bentaleb|DZ|31|CM|77
24|Calvin Verdonk|ID|29|LB|75
23|Tanguy Nianzou|FR|24|CB|76
3|Nathan Ngoy|BE|23|CB|77
7|Dilane Bakwa|FR|23|RW|78|K:Nottingham Forest
10|Hákon Haraldsson|IS|23|AM|79
29|Hamza Igamane|MA|23|ST|76
15|Romain Perraud|FR|28|LB|77
1|Berke Özer|TR|26|GK|78
4|Alexsandro|BR|27|CB|81
17|Ngal'ayel Mukau|CD|21|CM|76|84
11|Osame Sahraoui|MA|25|RW|75
14|Maurits Kjærgaard|DK|23|AM|73
22|Tiago Santos|PT|24|RB|77
19|Başar Önal|TR|22|LW|71
21|Benjamin André|FR|36|DM|79
28|Gaëtan Perrin|FR|30|ST|69
16|Arnaud Bodart|BE|28|GK|66
2|Loun Srdanovic|CH|20|CB|68
35|Soriba Diaoune|FR|18|RW|67
26|Isaac Cossier|FR|19|RB|66
38|Maxima Goffi|FR|18|LB|63
` },
  "bod": { coach: "Kjetil Knutsen", capacity: 8270, players: `
7|Patrick Berg|NO|28|CM|79
10|Jens Petter Hauge|NO|26|ST|78
12|Nikita Haikin|RU|31|GK|76
15|Fredrik André Bjørkan|NO|27|CB|76
22|Joel Mvuka|NO|23|ST|77
16|Joshua Kitolano|NO|25|CM|77
9|Andreas Helmersen|NO|28|RW|76
1|Julian Faye Lund|NO|27|GK|76
11|Ole Didrik Blomberg|NO|26|LW|73
5|Haitam Aleesami|NO|35|CB|73
17|Ola Brynhildsen|NO|27|ST|73
26|Håkon Evjen|NO|26|DM|72
19|Sondre Brunstad Fet|NO|29|AM|72
25|Isak Dybvik Määttä|NO|24|CB|70
8|Sondre Auklend|NO|23|CM|71
2|Villads Nielsen|DK|21|CB|69
14|Ulrik Saltnes|NO|33|DM|69
4|Odin Bjørtuft|NO|27|RB|69
94|August Mikkelsen|NO|25|RW|67
20|Fredrik Sjøvold|NO|22|LB|67
6|Jostein Gundersen|NO|30|CB|67
23|Magnus Riisnæs|NO|21|AM|65
28|Assan Sanyang|GM|25|CM|65
32|Kasper Solhaug|NO|25|RB|64
45|Isak Sjong|NO|25|GK|62
` },
  "nap": { coach: "Massimiliano Allegri", capacity: 54732, players: `
11|Kevin De Bruyne|BE|35|AM|84
19|Rasmus Højlund|DK|23|ST|82
8|Scott McTominay|SC|29|CM|86
5|Benoît Badiashile|FR|25|CB|78|K:Chelsea
6|Billy Gilmour|SC|25|DM|80
70|Noa Lang|NL|27|LW|80
32|Vanja Milinković-Savić|RS|29|GK|81
7|David Neres|BR|29|RW|81
99|Frank Anguissa|CM|30|CM|83
22|Giovanni Di Lorenzo|IT|33|RB|82
1|Alex Meret|IT|29|GK|81
37|Leonardo Spinazzola|IT|33|LB|77
68|Stanislav Lobotka|SK|31|DM|84
20|Lorenzo Lucca|IT|25|ST|78
13|Amir Rrahmani|XK|32|CB|81
21|Matteo Politano|IT|33|RW|80
17|Mathías Olivera|UY|28|LB|81
26|Antonio Vergara|IT|23|AM|72
4|Alessandro Buongiorno|IT|27|CB|83
27|Alisson Santos|BR|23|RW|73
16|Rafa Marín|ES|24|CB|79
23|Giovane|BR|22|LW|72
31|Sam Beukema|NL|27|CB|81
2|Costantino Favasuli|IT|22|LB|69|K:Catanzaro
14|Nikita Contini|UA|30|GK|68
35|Luca Marianucci|IT|22|CB|67
` },
  "rbl": { coach: "Martín Demichelis", capacity: 47800, players: `
28|Christopher Nkunku|FR|28|ST|81|K:Milan
9|Marc Guiu|ES|20|ST|74|83
7|Antonio Nusa|NO|21|LW|80|87
22|David Raum|DE|28|LB|82
1|Ørjan Nyland|NO|35|GK|74
23|Castello Lukeba|FR|23|CB|83|87
21|Neil El Aynaoui|MA|25|CM|78|K:Roma
14|Christoph Baumgartner|AT|27|AM|81
11|Johan Bakayoko|BE|23|RW|80|85
8|Assan Ouédraogo|DE|20|CM|76|86
13|Nicolas Seiwald|AT|25|DM|79
4|Willi Orbán|HU|33|CB|79
10|Brajan Gruda|DE|22|AM|78|85|K:Brighton
3|Maxime Estève|FR|24|CB|77
16|Lukas Klostermann|DE|30|CB|77
17|Ridle Baku|DE|28|RB|79
39|Benjamin Henrichs|DE|29|RB|76
26|Maarten Vandevoordt|BE|24|GK|78|85
20|Rocco Reitz|DE|24|DM|71
30|Andrija Maksimović|RS|19|AM|70
40|Rômulo|BR|24|ST|76
6|Ezechiel Banzuzi|NL|21|CM|69
27|Tidiam Gomis|FR|20|RW|68
18|Suleman Sani|NG|19|LW|68
2|Abdoul Koné|FR|21|RB|66
25|Leopold Zingerle|DE|32|GK|64
45|Samba Konaté|FR|17|ST|64
35|Max Finkgräfe|DE|22|LB|63
47|Viggo Gebel|DE|19|DM|63
37|Benno Kaltefleiter|DE|25|AM|62
` },
  "vil": { coach: "Iñigo Pérez", capacity: 23008, players: `
9|Georges Mikautadze|GE|25|ST|80
19|Nicolas Pépé|CI|31|RW|80
12|Renato Veiga|PT|23|CB|80
3|Alex Freeman|US|22|RB|75
22|Ayoze Pérez|ES|33|ST|79
8|Juan Foyth|AR|28|RB|80
24|Nathan Saliba|CA|21|CM|72
17|Tajon Buchanan|CA|27|RW|78
18|Pape Gueye|SN|27|DM|80
7|Gerard Moreno|ES|34|ST|79
25|Péter Gulácsi|HU|36|GK|76
21|Tani Oluwaseyi|CA|26|ST|74
2|Logan Costa|CV|25|CB|79
11|Ilias Akhomach|MA|22|RW|74
10|Alberto Moleiro|ES|22|AM|79|85
15|Santiago Mouriño|UY|24|CB|77
20|Carlos Romero|ES|24|LB|76
1|Luiz Júnior|BR|25|GK|80
14|Santi Comesaña|ES|29|CM|79
23|Sergi Cardona|ES|27|LB|78
6|Pau Navarro|ES|21|RB|68
16|Carlos Maciá|ES|17|DM|69
5|Alassane Diatta|SN|21|AM|68
13|Rubén Gómez|ES|24|GK|66
` },
  "sha": { coach: "Arda Turan", capacity: 34915, players: `
9|Kauã Elias|BR|20|ST|75|84
2|Lassina Traoré|BF|25|ST|79
4|Marlon Santos|BR|30|CB|78
22|Mykola Matviyenko|UA|30|CB|78
10|Pedrinho|BR|28|CM|77
17|Vinicius Tobias|BR|22|RB|77
25|Gabriel Carvalho|BR|19|RW|73|K:Al Qadsiah
30|Alisson|BR|20|LW|75
6|Marlon Gomes|BR|22|CM|76
28|Alan Matturro|UY|21|CB|74
77|Gleiker Mendoza|VE|24|RW|74
16|Irakli Azarovi|GE|24|LB|73
5|Valeriy Bondar|UA|27|CB|71
11|Newerton|BR|21|LW|71
49|Luca Meirelles|BR|19|ST|71
13|Pedro Henrique|BR|24|RB|71
99|Bruninho|BR|18|ST|70
7|Eguinaldo|BR|22|LW|74
20|Oleksandr Karavayev|UA|34|LB|67
37|Lucas Ferreira|BR|20|CM|66
31|Dmytro Riznyk|UA|27|GK|77
27|Oleh Ocheretko|UA|23|AM|66
14|Isaque|BR|19|DM|64
8|Dmytro Kryskiv|UA|25|CM|63
18|Alaa Ghram|TN|25|CB|64
68|Prosper Obah|NG|22|LW|62
71|Ryan Roberto|BR|25|ST|62
29|Yehor Nazaryna|UA|29|AM|60
23|Kiril Fesyun|UA|24|GK|58
24|Viktor Tsukanov|UA|20|CM|58
48|Denys Tvardovskyi|UA|25|GK|57
` },
  "sla": { coach: "Jindřich Trpišovský", capacity: 19370, players: `
26|Ivan Schranz|SK|32|ST|79
25|Tomáš Chorý|CZ|31|ST|79
23|Michal Sadílek|CZ|27|CM|77
4|David Zima|CZ|25|CB|77
39|David Jurásek|CZ|26|CB|76
17|Lukáš Provod|CZ|29|CM|75
2|Štěpán Chaloupek|CZ|23|CB|74
3|Tomáš Holeš|CZ|33|CB|74
13|Mojmír Chytil|CZ|27|RW|75
10|Danijel Šturm|SI|27|LW|74
5|Igoh Ogbu|NG|26|RB|71
8|Oskar Kubiak|PL|19|DM|71
1|Ondřej Kolář|CZ|31|GK|72
30|Wiktor Nowak|PL|21|AM|71
16|David Moses|NG|22|CM|70
27|Tomáš Vlček|CZ|25|LB|69
35|Jakub Markovič|CZ|25|GK|67
20|Emmanuel Ayaosi|NG|21|ST|67
18|Adonija Ouanda|CI|21|RW|66
22|Toumani Diakité|CI|20|DM|67
6|Ange N'Guessan|FR|22|CB|65
14|Samuel Isife|NG|25|RB|66
15|Mubarak Suleiman|NG|25|AM|63
29|Nazar Domchak|UA|25|GK|62
32|Pavel Kačor|CZ|25|CM|61
42|Mikuláš Konečný|CZ|25|LB|60
43|Eliáš Piták|CZ|25|CB|61
` },
  "slb": { coach: "Yaya Touré", capacity: 22500, players: `
99|Andraž Šporar|SI|32|RW|78
21|Suleiman Camara|GM|24|LW|74
70|Cristian Martínez|PA|29|CM|75
6|Kevin Wimmer|AT|33|RB|74
28|César Blackman|PA|28|CB|72
11|Tigran Barseghyan|AM|32|CM|73
88|Daiki Matsuoka|JP|25|DM|72|K:Avispa Fukuoka
9|Mykola Kukharevych|UA|25|ST|72
12|Kenan Bajrić|SI|31|CB|70
15|Svetozar Marković|RS|26|CB|70
1|Aleksandar Popović|RS|26|GK|71
10|Nino Marcelli|SK|21|RW|68
3|Peter Pokorný|SK|25|AM|69
20|Alen Mustafić|BA|27|CM|67
77|Danylo Ihnatenko|UA|29|DM|68
5|Rahim Ibrahim|GH|25|AM|67
71|Dominik Takáč|SK|27|GK|65
14|Alasana Yirajang|GM|21|LW|65
19|Manasse Kianga|EN|24|ST|66
13|Roman Čerepkai|SK|24|ST|64
57|Sandro Cruz|AO|25|CB|63
97|Kelvin Ofori|GH|25|RW|62
8|Artur Gajdoš|SK|22|CM|60
-|Sahmkou Camara|GN|25|LB|60|K:Slavia Prag
30|Adam Griger|SK|22|ST|60|K:Hradec Králové
17|Jurij Medveděv|CZ|30|CB|59
2|Samuel Kozlovský|SK|26|RB|56
44|Matúš Macík|SK|33|GK|55
7|Leo Hofstädter|SK|25|DM|55
24|Matúš Tomáško|SK|25|LW|54
29|Alexej Maroš|SK|25|ST|53
` },
  "stu": { coach: "Sebastian Hoeneß", capacity: 60058, players: `
26|Deniz Undav|DE|30|ST|82
9|Ermedin Demirović|BA|28|ST|80
6|Angelo Stiller|DE|25|CM|84
11|Bilal El Khannouss|MA|22|AM|79
18|Jamie Leweling|DE|25|RW|80
17|Dženan Pejčinović|DE|21|ST|72
7|Maximilian Mittelstädt|DE|29|LB|81
44|Leo Sauer|SK|20|RW|72|83
23|Dan-Axel Zagadou|FR|27|CB|78
4|Josha Vagnoman|DE|25|RB|76
21|Grischa Prömel|DE|31|CM|78
10|Chris Führich|DE|28|LW|79
29|Finn Jeltsch|DE|20|CB|78|86
16|Atakan Karazor|TR|29|DM|78
8|Tiago Tomás|PT|24|ST|76
24|Jeff Chabot|DE|28|CB|79
14|Luca Jaquez|CH|23|CB|76
1|Fabian Bredlow|DE|31|GK|73
20|Leonidas Stergiou|CH|24|RB|69
28|Nikolas Nartey|DK|26|CM|75
2|Ameen Al-Dakhil|BE|24|CB|76
41|Dennis Seimen|DE|20|GK|67
3|Ramon Hendriks|NL|25|LB|77
22|Lorenz Assignon|FR|26|RB|76
33|Marius Funk|DE|30|GK|63
43|Jarzinho Malanga|DE|20|LW|65
31|Justin Diehl|DE|22|ST|62
46|Stefan Drljača|DE|27|GK|61
39|Ertuğrul Yiğit|DE|25|AM|61
` },
  "aek": { coach: "Marko Nikolić", capacity: 32500, players: `
9|Luka Jović|RS|28|ST|77
14|Lovro Majer|HR|28|AM|78
23|João Mário|PT|33|RB|74
18|Răzvan Marin|RO|30|DM|76
19|Barnabás Varga|HU|32|ST|76
1|Thomas Strakosha|AL|31|GK|74
10|Oleksandr Zubkov|UA|30|AM|74
6|Kaan Kairinen|FI|27|CM|74
16|Kervin Arriaga|HN|28|DM|73
8|Mijat Gaćinović|RS|31|AM|72
21|Domagoj Vida|HR|37|CB|70
22|Charalampos Lykogiannis|GR|32|LB|75
2|Harold Moukoudi|CM|28|CB|70
27|Milán Vitális|HU|24|CM|69
11|Aboubakary Koïta|MR|27|RW|70
12|Lazaros Rota|GR|28|CB|68
20|Petros Mantalos|GR|34|DM|67
90|Zini|AO|24|LW|66
15|Martin Georgiev|BG|20|RB|65
3|Stavros Pilios|AL|25|LB|67
80|Hakim Sahabo|RW|21|AM|65
7|Dereck Kutesa|CH|28|CM|65
91|Alberto Brignoli|IT|34|GK|62
44|Filipe Relvas|PT|27|CB|63
5|Christos Alexiou|GR|21|RB|61|K:Inter Milan U23
17|Dimitris Kaloskamis|GR|21|DM|61
39|Zois Karargyris|GR|25|ST|59
41|Marios Balamotis|GR|25|GK|57
` },
  "lsk": { coach: "Dietmar Kühbauer", capacity: 19080, players: `
14|Saša Kalajdžić|AT|29|ST|75
7|Samuel Adeniran|US|27|ST|76
2|George Bello|US|24|CB|73
18|Alessandro Schöpf|AT|32|CM|73
10|Robert Ljubičić|HR|27|CM|72|K:AEK Atina
30|Sascha Horvath|AT|29|DM|73
4|Xavier Mbuyamba|NL|24|CB|72
6|Melayro Bogarde|SR|24|AM|71
16|Andrés Andrade|PA|27|RB|72
8|Moses Usor|NG|24|RW|71
3|Miguel Freckleton|EN|23|CB|71
20|Kasper Jørgensen|DK|26|CB|69
43|Alemão|BR|23|LB|67
9|Kryštof Daněk|CZ|23|CM|67
27|Christoph Lang|AT|24|LW|67
23|Daniel Elfadli|LY|29|DM|66|K:Hamburg
29|Florian Flecker|AT|30|CB|66
1|Lukas Jungwirth|AT|22|GK|64
22|Ramiz Harakaté|FR|24|ST|64
5|Art Smakaj|XK|23|AM|64
25|Yvan Dibango|CM|24|RB|62
33|Tobias Schützenauer|AT|29|GK|61
15|Mohamed Sanogo|ML|25|CM|60
21|Manoël Verhaeghe|CD|25|LB|60
37|Filip Perović|ME|25|RW|59
50|Fabian Schillinger|AT|25|GK|58
52|Cheikne Kébé|ML|25|CB|57
` },
  "com": { coach: "Cesc Fàbregas", capacity: 13602, players: `
10|Nico Paz|AR|21|AM|77
97|Robert Sánchez|ES|28|GK|80|K:Chelsea
99|Trevoh Chalobah|EN|27|CB|81
90|Moise Kean|IT|26|ST|82|K:Fiorentina
20|Martin Baturina|HR|23|AM|79
9|Anastasios Douvikas|GR|27|ST|75
27|Yan Couto|BR|24|RB|75|K:Borussia Dortmund
11|Assane Diao|SN|20|RW|75
5|Máximo Perrone|AR|23|CM|74
4|Jacobo Ramón|ES|21|LB|73
30|Mattia Liberali|IT|19|DM|72
17|Jesús Rodríguez|ES|20|LW|73
53|Willy Kambwala|CD|21|CB|72|K:Villarreal
21|Samuele Ricci|IT|24|DM|79|K:Milan
7|Lucas Da Cunha|FR|25|DM|70
6|Luis Milla|ES|31|AM|69
8|Maxence Caqueret|FR|26|CM|69
1|Jean Butez|FR|31|GK|68
2|Marc-Oliver Kempf|DE|31|CB|67
3|Álex Valle|ES|22|CB|67
16|Kaiki Bruno|BR|23|RB|67|K:Cruzeiro
13|Alberto Dossena|IT|27|LB|64
18|Edoardo Goldaniga|IT|32|CB|64
42|Jayden Addai|NL|20|ST|64
28|Ivan Smolčić|HR|25|CB|63
15|Adrian Lahdo|SE|18|DM|62
22|Mauro Vigorito|IT|36|GK|56
` },
  "len": { coach: "Dino Toppmöller", capacity: 38223, players: `
10|Florian Thauvin|FR|33|CM|81
9|Thorgan Hazard|BE|33|ST|80
20|Jean-Clair Todibo|FR|26|CB|77|K:West Ham United
40|Robin Risser|FR|21|GK|78
11|Odsonne Édouard|FR|28|ST|77
23|Saud Abdulhamid|SA|27|RB|77
38|Mezian Mesloub|PT|16|RW|65
29|Franjo Ivanović|HR|22|ST|76|K:Benfica
21|Amadou Haidara|ML|28|CM|75
27|Michaël Cuisance|FR|26|DM|75
19|Abdallah Sima|SN|25|ST|73
8|Yacine Titraoui|DZ|23|AM|74
22|Michał Skóraś|PL|26|CM|73
3|Maik Nawrocki|PL|25|CB|70
25|Ismaëlo Ganiou|FR|21|CB|71
4|Nidal Čelik|BA|20|CB|71
2|Ruben Aguilar|FR|33|LB|69
6|Samson Baidoo|AT|22|CB|70
14|Matthieu Udol|FR|30|RB|69
32|Kyllian Antonio|FR|18|LB|67
5|Andrija Bulatović|ME|19|DM|68
13|Jhoanner Chávez|EC|24|CB|67
7|Florian Sotoca|FR|35|RW|63
28|Junior Kadile|FR|23|LW|65|K:Servette
24|Jonathan Gradit|FR|33|RB|63
16|Mathieu Gorgelin|FR|36|GK|59
31|Souleymane Sagnan|ML|21|LB|60
1|Régis Gurtner|FR|39|GK|53
60|Ilan Jourdren|FR|25|GK|56
` },
  "vik": { coach: "Bjarte Lunde Aarsheim", capacity: 15900, players: `
10|Zlatko Tripić|NO|33|ST|74
25|Henrik Falchener|NO|23|CB|73
22|Erik Botheim|NO|26|ST|73
8|Joe Bell|NZ|27|CM|72
9|Nicholas D'Agostino|AU|28|RW|71
6|Gianni Stensness|AU|27|CB|71
14|Veton Berisha|NO|32|LW|70
27|Jesper Daland|NO|26|CB|71|K:Cardiff City
20|Peter Christiansen|DK|26|ST|68
11|Romano Postema|NL|24|RW|68
29|Tobias Moi|NO|20|CM|67
16|Henrik Bjørdal|NO|29|DM|66
7|Kristoffer Askildsen|NO|25|AM|65
17|Essiën Bassey|NL|19|CB|66
5|Henrik Heggheim|NO|25|RB|64
30|Ľubomír Belko|SK|24|GK|62
28|Kristoffer Haugen|NO|32|LB|64
23|Niklas Fuglestad|NO|20|LW|63
1|Arild Østbø|NO|35|GK|59
3|Viljar Vevatne|NO|31|CB|62
2|Herman Haugen|NO|26|RB|60
26|Simen Kvia-Egeskog|NO|23|CM|61
21|Anders Bærtelsen|DK|26|LB|60
24|Vetle Auklend|NO|21|CB|58
18|Sondre Bjørshol|NO|32|RB|56
33|Jakob Segadal Hansen|NO|21|DM|57
4|Martin Ove Roseth|NO|28|LB|55
12|Erlend Jacobsen|NO|25|GK|53
19|Amin Ćosić|IS|25|ST|54
42|Kelvin Frimpong|GH|25|RW|53
` },
  "sab": { coach: "Valdas Dambrauskas", capacity: 8969, players: `
20|Joy-Lance Mickels|RW|32|ST|73
27|Tymoteusz Puchacz|PL|27|CB|73
-|Veljko Simić|RS|31|ST|72|K:Sivasspor@2026
11|Kaheem Parris|JM|26|CM|71
8|Christian Nwachukwu|NG|20|RW|68
4|Aden McCarthy|ZA|22|CB|69
7|Umarali Rakhmonaliev|UZ|22|CM|69
34|Xander Severina|CW|25|LW|68
13|Ivan Lepinjica|HR|27|DM|69
3|Steve Solvet|GP|30|CB|68
88|Rodrigo Fernandes|PT|25|AM|66
80|Akim Zedadka|DZ|31|CB|67
22|Zinédine Ould Khaled|FR|26|CM|64
92|Stas Pokatilov|KZ|33|GK|63
10|Aleksey Isayev|AZ|30|DM|65
23|Younes Lachaab|FR|21|ST|63|K:Lille
37|Du Queiroz|BR|26|AM|63|K:Zenit
99|Orphé Mbina|GA|25|RW|62
17|Tellur Mutallimov|AZ|31|RB|61
1|Amin Ramazanov|AZ|23|GK|59
5|Rahman Dashdamirov|AZ|26|LB|60
33|Erivaldo Almeida|BR|26|CB|60
6|Abdulakh Khaybulayev|AZ|24|CM|59
9|Khayal Aliyev|AZ|22|LW|56
18|Carlos Eduardo|BR|24|ST|57|K:Gil Vicente
16|Rauf Rustamli|AZ|22|DM|56
35|Japhet Dungus|NG|25|RB|54
89|Jafar Mukhtarov|AZ|25|AM|52
94|Ravan Mirzammadov|AZ|25|GK|50
95|Shahin Ibrahimov|AZ|25|CM|50
` },
  "lev": { coach: "Carles Martínez Novell", capacity: 30210, players: `
4|Jarell Quansah|EN|23|CB|81
2|Facundo Medina|AR|27|LB|80
19|Moussa Diaby|FR|27|RW|82
10|Malik Tillman|US|24|AM|82
14|Patrik Schick|CZ|30|ST|83
22|Victor Boniface|NG|25|ST|80
20|Guéla Doué|CI|23|RB|76
17|Lucas Vázquez|ES|35|RB|77
30|Ibrahim Maza|DZ|20|AM|79|87
24|Aleix García|ES|29|CM|82
3|Miguel Gutiérrez|ES|25|LB|81
12|Edmond Tapsoba|BF|27|CB|82
35|Christian Kofane|CM|20|ST|74|84
8|Robert Andrich|DE|31|DM|79
5|Loïc Badé|FR|26|CB|80
23|Nathan Tella|NG|27|RW|76
1|Mark Flekken|NL|33|GK|79
6|Equi Fernández|AR|24|DM|81
29|Eliesse Ben Seghir|MA|21|LW|78|85
7|Jonas Hofmann|DE|34|CM|72
9|Afonso Moreira|PT|21|RW|75
11|Martin Terrier|FR|29|LW|78
18|Kennet Eichhorn|DE|17|DM|69
42|Montrell Culbreath|DE|18|AM|68
15|Tim Oermann|DE|22|CB|68
28|Janis Blaswich|DE|35|GK|76
36|Niklas Lomb|DE|33|GK|64
` },
  "ben": { coach: "Marco Silva", capacity: 68100, players: `
22|Jhon Durán|CO|22|ST|79|K:Al-Nassr
36|João Palhinha|PT|31|DM|83
30|Claudio Echeverri|AR|20|AM|77|87|K:Manchester City
2|Clément Lenglet|FR|31|CB|78|K:Atlético Madrid
21|Andreas Schjelderup|NO|22|LW|80
25|Gianluca Prestianni|AR|20|RW|76|85
14|Vangelis Pavlidis|GR|27|ST|82
3|Alessandro Circati|AU|22|CB|76
11|Dodi Lukébakio|BE|28|RW|81
1|Anatoliy Trubin|UA|25|GK|83
27|Rafa Silva|PT|33|AM|78
5|Enzo Barrenechea|AR|25|DM|79
8|Fredrik Aursnes|NO|30|CM|81
44|Tomás Araújo|PT|24|CB|81
10|Heorhiy Sudakov|UA|23|AM|80
13|Jakub Kamiński|PL|24|LW|77
34|Souffian El Karouani|MA|25|LB|76|K:Al-Qadsiah
18|Leandro Barreiro|LU|26|CM|78
6|Alexander Bah|DK|28|RB|73
26|Samuel Dahl|SE|23|LB|77
24|Samuel Soares|PT|24|GK|71
72|Anísio Cabral|PT|18|LW|71
58|Daniel Banjaqui|PT|18|CB|68
16|Manu Silva|PT|25|CM|69
62|José Neto|PT|18|RB|67
33|Gabriel Índio|BR|18|LB|68
50|Diogo Ferreira|PT|19|GK|64
` },
  "juv": { coach: "Luciano Spalletti", capacity: 41507, players: `
27|Nick Woltemade|DE|24|ST|81|K:Newcastle United
9|Randal Kolo Muani|FR|27|ST|81
10|Kenan Yıldız|TR|21|LW|86|90
17|Kerim Alajbegović|BA|18|AM|72|85
25|Guglielmo Vicario|IT|29|GK|84|K:Tottenham
29|Pape Matar Sarr|SN|23|CM|81|K:Tottenham
12|Douglas Luiz|BR|28|CM|79
22|Weston McKennie|US|27|CM|80
7|Francisco Conceição|PT|23|RW|82
2|Zeki Çelik|TR|29|RB|77
5|Manuel Locatelli|IT|28|DM|83
14|Arkadiusz Milik|PL|32|ST|76
8|Teun Koopmeiners|NL|28|AM|80
26|Jhon Lucumí|CO|28|CB|81
1|Kamil Grabara|PL|27|GK|77|K:Wolfsburg
19|Khéphren Thuram|FR|25|CM|83
6|Lloyd Kelly|EN|27|CB|79
3|Bremer|BR|29|CB|84
11|Edon Zhegrova|XK|27|RW|81
15|Pierre Kalulu|FR|26|CB|81
13|Jérémie Boga|CI|29|LW|77
24|Daniele Rugani|IT|32|LB|70
4|Federico Gatti|IT|28|CB|80
20|Andrea Cambiaso|IT|26|LB|82
18|Jeff Ekhator|IT|19|LW|68
31|Nico González|AR|28|DM|67
32|Juan Cabal|CO|25|LB|77
23|Carlo Pinsoglio|IT|36|GK|61
` },
  "mil": { coach: "Ruben Amorim", capacity: 75817, players: `
11|Christian Pulisic|US|27|RW|84
9|Gonçalo Ramos|PT|25|ST|80
12|Adrien Rabiot|FR|31|CM|83
16|Mike Maignan|FR|31|GK|87
14|Luka Modrić|HR|40|CM|81
23|Fikayo Tomori|EN|28|CB|80
22|Diego Moreira|BE|22|RW|76
8|Ruben Loftus-Cheek|EN|30|CM|79
21|Samuel Chukwueze|NG|27|RW|77
20|Omari Hutchinson|EN|22|RW|76|K:Nottingham Forest
2|Pervis Estupiñán|EC|28|LB|79
70|Alphadjo Cisse|IT|19|CM|70|83
80|Yunus Musah|US|23|CM|78
73|Francesco Camarda|IT|18|ST|72|85
56|Alexis Saelemaekers|BE|27|RB|81
34|Mario Gila|ES|25|CB|81
31|Strahinja Pavlović|RS|25|CB|81
30|Ardon Jashari|CH|24|DM|79
5|Koni De Winter|BE|24|CB|78
13|Sankhoun Diawara|FR|20|CB|72
46|Matteo Gabbia|IT|26|CB|79
33|Davide Bartesaghi|IT|20|RB|71
28|Christian Comotto|IT|18|AM|70
96|Lorenzo Torriani|IT|21|GK|67
42|Filippo Terracciano|IT|23|LB|68
1|Pietro Terracciano|IT|36|GK|63
35|Valeri Vladimirov|BG|18|CB|66
` },
  "lyo": { coach: "Paulo Fonseca", capacity: 59186, players: `
3|Nicolás Tagliafico|AR|33|LB|78
17|Loïs Openda|BE|26|ST|81|K:Juventus
11|Keito Nakamura|JP|26|LW|79
8|Corentin Tolisso|FR|32|CM|80
21|Ruben Kluivert|NL|25|LB|76
10|Pavel Šulc|CZ|25|AM|79
23|Tyler Morton|EN|23|DM|77
7|Ernest Nuamah|GH|22|RW|76
24|Julien Duranville|BE|20|LW|74
6|Tanner Tessmann|US|24|CM|77
19|Moussa Niakhaté|SN|30|CB|81
13|Zachary Athekame|CH|21|RB|74|K:Milan
2|Mads Bidstrup|DK|25|CM|74
32|Alejandro Gomes Rodríguez|EN|18|ST|72
16|Abner|BR|26|LB|76
1|Dominik Greif|SK|29|GK|78
40|Rémy Descamps|FR|30|GK|72
20|Felix Bacher|AT|25|CB|72
85|Noham Kamara|FR|19|CB|69
99|Noah Nartey|DK|20|DM|69
22|Clinton Mata|AO|33|RB|78
26|Kaïl Boudache|DZ|20|RW|67
76|Mohamed Ouédraogo|BF|23|LB|68
18|Khalis Merah|FR|19|AM|65
50|Lassine Diarra|ML|23|GK|64
25|Justin Bengui|FR|21|GK|63
` },
  "azk": { coach: "Lee-Roy Echteld", capacity: 19500, players: `
5|Mateo Chávez|MX|22|LB|76
10|Kees Smit|NL|20|CM|76|87
14|Calvin Stengs|NL|27|AM|77
29|Wesley Hoedt|NL|32|CB|76
8|Jordy Clasie|NL|35|DM|75
6|Peer Koopmeiners|NL|26|CM|77
19|Jizz Hornkamp|NL|28|ST|74
20|Andrea Natali|IT|18|CB|71
7|Weslley Patati|BR|22|RW|73
9|Mexx Meerdink|NL|23|ST|74
2|Seiya Maikuma|JP|28|RB|76
11|Ro-Zangelo Daal|NL|22|LW|73
31|Rion Ichihara|JP|21|CB|72
17|Valdemar Byskov|DK|21|CM|72
3|Wouter Goes|NL|22|CB|75
1|Rome-Jayden Owusu-Oduro|NL|22|GK|77|84
41|Jeroen Zoet|NL|35|GK|71
18|Bendegúz Kovács|HU|19|RW|69
21|Dave Kwakman|NL|22|CM|69
24|Ayoub Oufkir|NL|20|LW|67
4|Lewis Schouten|NL|22|CB|68
22|Elijah Dijkstra|NL|20|RB|66
34|Mees de Wit|NL|28|LB|66
16|Stije Resink|NL|23|DM|65
28|Jari De Busser|BE|26|GK|63
30|Denso Kasius|NL|23|RB|76
27|Wassim Bouziane|NL|19|ST|63
12|Hobie Verhulst|NL|33|GK|60
` },
  "oly": { coach: "Imanol Alguacil", capacity: 33334, players: `
17|Leon Bailey|JM|29|RW|78
34|Armando González|MX|23|ST|74
15|Gustavo Puerta|CO|23|CM|77
1|Stefan Ortega|DE|33|GK|81
9|Ayoub El Kaabi|MA|33|ST|81
19|Remo Freuler|CH|34|DM|79
11|Roman Yaremchuk|UA|30|ST|77
27|Marcus Pedersen|NO|26|RB|76
10|Gelson Martins|PT|31|RW|79
8|Gustavo Sá|PT|21|CM|77
97|Yusuf Yazıcı|TR|29|AM|76
-|Jota Silva|PT|27|RW|76|K:Nottingham Forest
71|Nair Tiknizyan|AM|27|LB|75
7|Kostas Fortounis|GR|33|AM|75
6|David Carmo|AO|27|CB|77
73|Joel Roca|ES|21|LW|72
45|Panagiotis Retsos|GR|28|CB|77
2|Manolis Saliakas|GR|29|RB|76
4|Zinedin Smajlović|BA|22|CB|72
32|Santiago Hezze|AR|24|DM|78
22|Chiquinho|PT|31|AM|79
70|Bruno Onyemaechi|NG|27|LB|67
31|Balša Popović|ME|26|GK|64
5|Lorenzo Pirola|IT|24|CB|77
14|Dani García|ES|36|DM|61
90|Clayton|BR|27|ST|63
16|Lorenzo Scipioni|AR|25|DM|63
91|Dimitrios Stournaras|GR|25|GK|60
21|Theofanis Bakoulas|GR|21|AM|59
` },
  "rso": { coach: "Pellegrino Matarazzo", capacity: 40000, players: `
10|Mikel Oyarzabal|ES|29|ST|83
14|Takefusa Kubo|JP|25|RW|82
22|Héctor Fort|ES|20|RB|74|83
19|Mamadou Sarr|SN|20|CB|72|K:Chelsea
24|Luka Sučić|HR|23|CM|79
18|Carlos Soler|ES|29|CM|79
11|Gonçalo Guedes|PT|29|LW|77
17|Sergio Gómez|ES|25|LB|78
20|Álvaro Odriozola|ES|30|RB|76
1|Álex Remiro|ES|31|GK|82
9|Orri Óskarsson|IS|21|ST|76
7|Ander Barrenetxea|ES|24|LW|78
6|Jon Martín|ES|20|CB|76|84
23|Arsen Zakharyan|RU|23|AM|77
21|Yangel Herrera|VE|28|CM|79
2|Jon Aramburu|VE|24|RB|77
8|Beñat Turrientes|ES|24|CM|77
5|Igor Zubeldia|ES|29|CB|80
12|Job Ochieng|KE|23|ST|69
16|Jon Pacheco|ES|25|CB|69
4|Jon Gorrotxategi|ES|23|CM|76
3|Aihen Muñoz|ES|28|LB|75
15|Pablo Marín|ES|23|DM|66
13|Unai Marrero|ES|24|GK|65
` },
  "om": { coach: "Bruno Génésio", capacity: 67394, players: `
23|Pierre-Emile Højbjerg|DK|31|DM|82
22|Timothy Weah|US|26|RB|78
11|Neal Maupay|FR|29|ST|76
7|Angel Gomes|EN|25|CM|79
14|Igor Paixão|BR|26|LW|80
33|Emerson Palmieri|IT|32|LB|78
9|Amine Gouiri|DZ|26|ST|81
21|Nayef Aguerd|MA|30|CB|81
19|Geoffrey Kondogbia|CF|33|DM|78
13|Derek Cornelius|CA|28|CB|77
4|CJ Egan-Riley|EN|23|CB|76
77|Amine Harit|MA|29|AM|78
48|Keyliane Abdallah|FR|20|RW|70
1|Jeffrey de Lange|NL|28|GK|76
25|Ulisses Garcia|CH|30|LB|75
8|Himad Abdelli|DZ|26|CM|76
6|Tochukwu Nnadi|NG|23|DM|73
29|Faris Moumbagna|CM|26|ST|74
18|Bamo Meïté|CI|25|CB|71
43|Tadjidine Mmadi|FR|19|CM|70
40|Jelle Van Neck|BE|25|GK|69
92|Théo Vermot|FR|25|GK|68
` },
  "fer": { coach: "Balázs Borbély", capacity: 23700, players: `
8|Naby Keïta|GN|31|CM|77
47|Callum O'Dowda|IE|31|CM|76
15|Daniel Arzani|AU|27|ST|75
75|Lenny Joseph|HT|25|ST|73
6|Ádám Nagy|HU|31|DM|72
7|Veljko Birmančević|RS|28|AM|72
22|Matúš Bero|SK|30|CM|74
17|Marius Corbu|RO|24|DM|73
16|Kristoffer Zachariassen|NO|32|RW|73
19|Franko Kovačević|HR|27|LW|71
10|Jonathan Levi|SE|30|ST|69
70|Edgar Sevikyan|AM|25|AM|69
90|Dénes Dibusz|HU|35|GK|75
11|Bamidele Yusuf|NG|25|RW|69
76|Krisztián Lisztes|HU|21|CM|67|K:Eintracht Frankfurt
4|Mariano Gómez|AR|27|CB|67
88|Philippe Rommens|BE|28|DM|67
80|Habib Maïga|CI|30|AM|65
21|Endre Botka|HU|31|CB|65
20|Cadu|BR|29|CM|64
28|Toon Raemaekers|BE|25|CB|63
14|Attila Osváth|HU|30|CB|63
22|Gábor Szalai|HU|26|RB|62
1|Ádám Varga|HU|27|GK|59
5|Nathan Zohoré|FR|25|LB|61
23|Bence Ötvös|HU|28|DM|58
77|Barnabás Nagy|HU|25|CB|58
54|Olivér Nagy|HU|25|RB|56
18|Ádám Bagi|HU|25|AM|55
33|Levente Őri|HU|25|GK|52
63|Dániel Radnóti|HU|25|GK|52
68|Zétény Varga|HU|25|LW|52
71|Csongor Lakatos|HU|25|LB|51
72|Ádám Madarász|HU|25|CM|50
` },
  "plz": { coach: "Radoslav Kováč", capacity: 11700, players: `
11|Matěj Vydra|CZ|34|ST|76
99|Amar Memić|BA|25|CM|75
3|Denis Vavro|SK|30|CB|77
14|Merchas Doski|IQ|26|CB|75
80|Prince Kwabena Adu|GH|22|ST|75
44|Florian Wiegele|AT|25|GK|75
6|Lukáš Červ|CZ|25|CM|74
9|Denis Višinský|CZ|23|RW|73
12|Alexandr Sojka|CZ|25|DM|72
19|Cheick Souaré|FR|23|AM|71
17|Patrik Hrošovský|SK|34|CM|69
25|Christophe Kabongo|CZ|22|LW|69
29|Adam Gabriel|CZ|25|CB|70
7|Salim Fago Lawal|NG|23|ST|69
40|Sampson Dweh|LR|24|CB|68
21|Václav Jemelka|CZ|31|RB|67
23|Baboucarr Faal|GM|23|RW|67
18|Tomáš Ladra|CZ|29|DM|67
2|Tobiáš Pališčák|SK|18|LB|65
20|Jiří Panoš|CZ|19|AM|64
5|Karel Spáčil|CZ|23|CB|63
10|Mohamed Toure|GN|20|LW|62
98|Filip Prebsl|CZ|23|CM|61
1|Dominik Ťapaj|SK|22|GK|59
30|Viktor Baier|CZ|21|GK|59
13|Marián Tvrdoň|SK|31|GK|57
22|Jan Paluska|CZ|25|RB|58
36|Stefan Pirgić|RS|25|DM|56
` },
  "usg": { coach: "David Hubert", capacity: 9400, players: `
5|Kevin Mac Allister|AR|28|CB|78
38|Relebohile Mofokeng|ZA|21|RW|77
55|Nikki Havenaar|JP|31|CB|78
13|Kevin Rodríguez|EC|26|ST|77
12|Hervé Koffi|BF|29|GK|75|K:Lens
23|Besfort Zeneli|SE|23|CM|74
28|Darius Olaru|RO|28|DM|74
26|Ross Sykes|EN|27|CB|74
30|Raul Florucz|AT|25|ST|74
8|Adem Zorgane|DZ|26|AM|72
10|Anouar Ait El Hadj|BE|24|CM|73
11|Guilherme Smith|BR|23|LW|72
1|Vic Chambaere|BE|23|GK|72
6|Kamiel Van de Perre|BE|22|CM|70
9|Mateo Biondić|DE|23|ST|70
80|Ondřej Kričfaluši|CZ|22|DM|70
21|Denzel De Roeve|BE|22|CB|68
27|Louis Patris|BE|25|RB|68
29|Massiré Sylla|SN|21|LB|67
14|Ivan Pavlić|NL|24|AM|65
20|Dylan Aquino|AR|21|RW|65
17|Rob Schoofs|BE|32|CM|65
4|Nohim Chibani|FR|25|CB|63
18|Giorgi Kavlashvili|GE|25|GK|61
25|Ilan Hurtevent|BE|25|LW|61
71|Keo Boets|BE|25|GK|60
` },
  "dzg": { coach: "Mario Kovačević", capacity: 24851, players: `
26|Scott McKenna|SC|29|CB|76
99|Mislav Oršić|HR|33|ST|76
24|Dominik Kotarski|HR|26|GK|74|K:Kopenhag
9|Dion Drena Beljo|HR|24|ST|75
17|Luka Ivanušec|HR|27|CM|74
7|Dani Rodríguez|ES|21|RW|73
14|Smail Prevljak|BA|31|LW|74
27|Josip Mišić|HR|32|CM|72
36|Sergi Domínguez|ES|21|CB|72
6|Stjepan Radeljić|BA|28|CB|72
8|Miha Zajc|SI|32|DM|70
13|Paul Tabinas|PH|24|CB|71
10|Luka Stojković|HR|22|AM|70
11|Arbër Hoxha|AL|27|ST|68
22|Matteo Pérez Vinlöf|SE|20|RB|68
5|Kirill Kravtsov|RU|24|CM|68
80|Lukas Kačavenda|HR|23|DM|67
23|Iker Almena|ES|22|RW|66|K:Al Qadsiah
77|Noah Nsoki|FR|19|LW|64
20|Robert Mudražija|HR|29|AM|64
21|Mateo Lisica|HR|23|ST|65
25|Moris Valinčić|HR|23|LB|63
44|Ivan Filipović|HR|31|GK|61
33|Ivan Nevistić|HR|28|GK|61
15|Niko Galešić|HR|25|CB|59
3|Bruno Goda|HR|28|RB|59
1|Danijel Zagorac|HR|39|GK|51
30|Fran Topić|HR|22|RW|58
19|Aleks Stojaković|SI|25|LW|56
41|Sven Šunta|SI|25|CM|56
` },
  "rbs": { coach: "Danny Röhl", capacity: 30188, players: `
9|Haris Tabaković|BA|32|ST|80
35|Jesper Lindstrøm|DK|26|ST|79|K:Napoli
19|Karim Konaté|CI|22|RW|79
8|Sōta Kitano|JP|21|CM|77
91|Anrie Chase|JP|22|CB|77
11|Yorbe Vertessen|BE|25|LW|76
1|Christian Früchtl|DE|26|GK|74
4|John Mellberg|SE|20|CB|75
23|Damir Redzic|HU|23|ST|75
22|Stefan Lainer|AT|33|CB|74
20|Edmund Baidoo|GH|20|RW|72
13|Frans Krätzig|DE|23|RB|73
27|Johannes Moser|AT|18|CM|70
15|Bartosz Mazurek|PL|19|DM|71
44|Kévin Boma|TG|23|LB|70
7|Umut Tohumcu|DE|21|AM|69|K:Hoffenheim
30|Gaoussou Diakité|ML|20|LW|69
21|Tim Drexler|DE|21|CB|67
39|Leandro Morgalla|DE|21|CB|66
32|Abubakr Barry|GM|26|CM|67
18|Nikolas Veratschnig|AT|23|RB|65
52|Christian Zawieschitzky|AT|19|GK|63
43|Enrique Aguilar|CH|19|ST|64
31|Dominik Schmid|CH|28|LB|63
28|Filip Matijašević|RS|18|DM|64
36|Justin Omoregie|AT|22|AM|61
5|Soumaïla Diabaté|ML|21|CM|61
33|Aboubacar Camara|BF|25|RW|59
41|Nikola Šarčević|AT|25|GK|57
47|Valentin Zabransky|AT|25|CB|58
` },
  "cel": { coach: "Martin O'Neill", capacity: null, players: `
21|Alex Oxlade-Chamberlain|EN|32|CM|78
9|Kasper Høgh|DK|25|ST|77
23|Haissem Hassan|EG|24|RW|79
26|Sam Johnstone|EN|33|GK|77|K:Wolves
63|Kieran Tierney|SC|29|LB|76
11|Camilo Durán|CO|24|ST|76
2|Alistair Johnston|CA|27|RB|76
8|Benjamin Nygren|SE|25|CM|75
3|Jordan Lotomba|CH|27|CB|75
7|Jota|PT|27|LW|74
42|Callum McGregor|SC|33|CM|77
18|Oliver Sørensen|DK|24|AM|72|K:Parma
6|Auston Trusty|US|27|CB|72
20|Cameron Carter-Vickers|US|28|CB|78
29|Shim Mheuka|EN|18|ST|70|K:Chelsea
22|Mika Baur|DE|22|CM|69
13|Yang Hyun-jun|KR|24|RW|70
12|Landon Emenalo|EN|18|DM|68|K:Chelsea
1|Viljami Sinisalo|FI|24|GK|66
17|Sebastian Tounekti|TN|24|LW|68
49|James Forrest|SC|35|ST|64
56|Anthony Ralston|SC|27|RB|64
35|Joël van den Berg|NL|19|AM|64
5|Liam Scales|IE|28|CB|62
51|Colby Donovan|SC|19|CB|63
14|Luke McCowan|SC|28|CM|61
19|Callum Osmand|WL|20|RW|60
47|Dane Murray|SC|23|LB|60
31|Ross Doohan|SC|28|GK|56
` },
  "spa": { coach: "Brian Priske", capacity: 18349, players: `
14|Jonatan Braut Brunes|NO|26|ST|78
25|Ki-Jana Hoever|NL|24|CB|78
31|Matěj Jurásek|CZ|22|RW|75|K:Norwich City
21|Joao Grimaldo|PE|23|CM|74
18|Andy Irving|SC|26|CM|74
22|Loïc Mbe Soh|FR|25|CB|75
17|John Mercado|EC|24|DM|73
10|Adam Karabec|CZ|23|AM|76
20|Sivert Mannsverk|NO|24|CM|73
7|Josimar Alcócer|CR|22|ST|71
38|Hugo Sochůrek|CZ|18|DM|68
3|Pavel Kadeřábek|CZ|34|RB|71
30|Jaroslav Zelený|CZ|33|CB|70
47|Krisztián Hegyi|HU|23|GK|68
6|Tobias Guddal|NO|24|CB|69
8|Magnus Kofod Andersen|DK|27|AM|68
5|Santiago Eneme|GQ|25|CM|68
11|Matěj Ryneš|CZ|25|LB|66
27|Ebrima Singhateh|GM|22|DM|65
26|Patrik Vydra|CZ|23|AM|66
28|Roman Macek|CZ|29|CM|64
2|Martin Suchomel|CZ|23|CB|62
29|Matyáš Vojta|CZ|22|LW|62
19|Adam Ševínský|CZ|22|RB|62
4|Jakub Martinec|CZ|28|LB|60
16|Emmanuel Uchenna|NG|22|CB|61
15|Viktor Vitályos|HU|25|RB|60
44|Jakub Surovčík|SK|25|GK|57
52|Ondřej Penxa|CZ|25|DM|57
` },
  "ren": { coach: "Franck Haise", capacity: 29778, players: `
30|Brice Samba|FR|32|GK|82
4|Charlie Cresswell|EN|23|CB|76|K:Toulouse
9|Esteban Lepaul|FR|26|ST|78
11|Musa Al-Taamari|JO|29|RW|78
22|Boulaye Dia|SN|29|ST|77|K:Lazio
17|Sebastian Szymański|PL|27|AM|80
12|Eliezer Mayenda|ES|21|ST|72
95|Przemysław Frankowski|PL|31|RB|77|K:Galatasaray
14|Bryan Reynolds|US|25|RB|75
28|Adrien Thomasson|FR|32|CM|77
48|Abdelhamid Aït Boudlal|MA|20|CB|74
21|Valentin Rongier|FR|31|CM|77
10|Ludovic Blas|FR|28|AM|78
36|Alidu Seidu|GH|26|CB|75
26|Quentin Merlin|FR|24|LB|76
70|Arnaud Nordin|FR|28|LW|74
6|Djaoui Cissé|FR|22|CM|73
45|Mahdi Camara|FR|28|DM|76
-|Ayanda Sishuba|BE|21|CM|69
24|Anthony Rouault|FR|25|CB|76
35|Elías Legendre|EC|18|RW|66
90|Issa Soumaré|SN|25|LW|65
18|Aboubakar Nagida|CM|21|CB|65
5|Gonçalo Oliveira|PT|20|RB|65
16|Nicolas Lemaître|FR|29|GK|61
65|Henrick Do Marcolino|FR|20|DM|63
60|Kilian Belazzoug|DZ|25|GK|59
` },
  "and": { coach: "Vítor Bruno", capacity: 22500, players: `
19|Thelo Aasgaard|NO|24|CM|78|K:Rangers
11|Oliver Antman|FI|24|ST|78
12|Andrew Omobamidele|IE|24|CB|77|K:Strasbourg
6|Ludwig Augustinsson|SE|32|RB|77
4|Giulian Biancone|FR|26|CB|75
14|Danylo Sikan|UA|25|ST|76
9|Mihajlo Cvetković|RS|19|RW|71
5|Oleg Reabciuk|MD|28|CB|75
21|Tawfik Bentayeb|MA|24|LW|72
29|Mario Stroeykens|CD|21|CM|73
18|Lukáš Ambros|CZ|22|DM|72
10|Marten Winkler|DE|23|ST|72
8|Romeo Amane|CI|23|AM|70
91|Adriano Bertaccini|BE|25|RW|70
79|Ali Maamar|MA|21|CB|70
27|Léo Pétrot|FR|29|LB|68
30|Ilias Koutsoupias|GR|25|CM|68
55|Marco Kana|BE|24|DM|68
61|Joshua Nga Kana|BE|17|LW|66
24|Enric Llansana|NL|25|AM|67
7|Ilay Camara|SN|23|CB|65
54|Killian Sardella|BE|24|RB|65
26|Colin Coosemans|BE|34|GK|60
3|Lucas Hey|DK|23|LB|61
83|Tristan Degreef|BE|21|ST|60
32|Justin Heekeren|DE|25|GK|59
49|Jayden Onia Seke|BE|17|RW|59
2|Zoumana Keita|DE|20|CB|57
33|Mattis Seghers|BE|25|GK|56
50|Kaïs Barry|BE|25|RB|56
53|Noa Ojea|BE|25|LW|55
62|Basile Vroninks|BE|25|LB|54
66|Michiel Haentjens|BE|25|GK|52
68|Noah Kalonji|BE|25|CM|52
` },
  "stg": { coach: "Fabio Ingolitsch", capacity: 16364, players: `
-|Oumar Diakité|CI|22|ST|76|K:Reims
4|Jon Gorenc Stanković|SI|30|CM|75
10|Otar Kiteishvili|GE|30|CM|76
44|Nelson Weiper|DE|21|ST|73|K:Mainz 05
23|Arjan Malić|BA|20|CB|72
20|Seedy Jatta|NO|23|RW|73
18|Emran Soglo|EN|21|CB|73
17|Szymon Włodarczyk|PL|23|LW|73
27|Luis Balbo|VE|20|CB|72
53|Daniil Khudyakov|RU|22|GK|70
8|Filip Rózga|PL|20|DM|69
15|Gizo Mamageishvili|GE|23|AM|70
36|Amady Camara|ML|21|ST|69
21|Petar Petrović|RS|21|CB|69
11|Axel Kayombo|CD|20|RW|67
39|Luca Weinhandl|AT|17|CM|64
9|Leon Grgić|HR|20|LW|65
43|Jacob Hödl|AT|19|DM|66
79|Valmir Matoshi|XK|23|AM|64
5|Albert Vallçi|AT|31|RB|64
28|Jürgen Heil|AT|29|LB|64
26|Belmin Beganović|AT|21|ST|61
19|Simon Seidl|AT|23|CM|62
22|Ammar Helac|AT|28|GK|59
35|Niklas Geyrhofer|AT|26|CB|59
30|Paul Koller|AT|25|RB|58
41|Elias Lorenz|AT|25|GK|55
` },
  "lec": { coach: "Niels Frederiksen", capacity: 42837, players: `
9|Mikael Ishak|SE|33|ST|76
17|Allahyar Sayyadmanesh|IR|25|ST|74
77|Luis Palma|HN|26|RW|73
10|Patrik Wålemark|SE|24|LW|72
8|Ali Gholizadeh|IR|30|ST|72
20|Robert Gumny|PL|28|CB|73
4|João Moutinho|PT|28|CM|75
5|Gustav Berggren|SE|28|CM|71
1|Mateusz Lis|PL|29|GK|70
11|Daniel Håkans|FI|25|RW|71
7|Yannick Agnero|CI|23|LW|70
21|Pablo Rodríguez|ES|25|CM|68
59|Terry Yegbe|GH|25|CB|67
22|Radosław Murawski|PL|32|DM|67
14|Leo Bengtsson|SE|28|AM|65
24|Filip Jagiełło|PL|29|CM|67
2|Joel Pereira|PT|29|CB|64
43|Antoni Kozubal|PL|21|DM|64
72|Mateusz Skrzypczak|PL|25|RB|64
15|Michał Gurgul|PL|20|LB|63
3|Alex Douglas|SE|24|CB|61
27|Wojciech Mońka|PL|19|RB|60
31|Wiktor Obremski|PL|25|GK|58
33|Mateusz Pruchniewski|PL|25|GK|59
53|Karol Delikat|PL|25|AM|57
54|Kamil Jakóbczyk|PL|25|ST|57
56|Wojciech Szymczak|PL|25|RW|56
90|Hubert Janyszka|PL|25|LB|54
` },
  "cry": { coach: "Pierre Sage", capacity: 25194, players: `
33|Ben Chilwell|EN|29|LB|76
7|Ismaïla Sarr|SN|28|RW|81
1|Dean Henderson|EN|29|GK|82
17|Takehiro Tomiyasu|JP|27|CB|77
10|Yéremy Pino|ES|23|RW|80
14|Jean-Philippe Mateta|FR|29|ST|81
5|Axel Disasi|FR|28|CB|78|K:Chelsea
20|Adam Wharton|EN|22|DM|82|88
11|Dwight McNeil|EN|26|LW|77
23|Quinten Timber|NL|25|CM|76
25|Anan Khalaili|IL|21|RB|72
9|Eddie Nketiah|EN|27|ST|75
18|Daichi Kamada|JP|30|CM|79
30|Óscar Mingueza|ES|27|RB|78
21|Honest Ahanor|IT|18|CB|72|84|K:Atalanta
22|Jørgen Strand Larsen|NO|26|ST|78
29|Evann Guessand|CI|25|RW|77|K:Aston Villa
26|Chris Richards|US|26|CB|79
4|Chadi Riad|MA|23|CB|71
24|Darío Osorio|CL|22|ST|71|K:Midtjylland
19|Will Hughes|EN|31|AM|69
3|Tyrick Mitchell|EN|26|LB|79
8|Jefferson Lerma|CO|31|DM|78
12|Zavier Gozo|US|19|RW|65
28|Cheick Doucouré|ML|26|DM|65
44|Walter Benítez|AR|33|GK|77
6|Jaydee Canvot|FR|20|CB|62
31|Remi Matthews|EN|32|GK|61
` },
  "bou": { coach: "Marco Rose", capacity: 12357, players: `
8|Alex Scott|EN|22|CM|78|85
19|Justin Kluivert|NL|27|AM|81
37|Rayan|BR|20|RW|74|85
22|Eli Junior Kroupi|FR|20|ST|74|85
12|Tyler Adams|US|27|DM|80
14|António Silva|PT|22|CB|80
16|Marcus Tavernier|EN|27|LW|80
11|Ben Gannon-Doak|SC|20|RW|74
28|Max Aarons|EN|26|RB|74
2|Julián Araujo|MX|24|RB|77
20|Michele Di Gregorio|IT|29|GK|81|K:Juventus
30|Álvaro Rodríguez|UY|22|ST|70
1|Đorđe Petrović|RS|26|GK|80
3|Adrien Truffert|FR|24|LB|79
24|Juanlu Sánchez|ES|22|RB|76
9|Evanilson|BR|26|ST|79
10|Ryan Christie|SC|31|CM|78
4|Lewis Cook|EN|29|DM|78
7|David Brooks|WL|29|RW|76
29|Daniel Jebbison|CA|22|ST|68
21|Amine Adli|MA|26|RW|78
6|Julio Soler|AR|21|LB|67
15|Adam Smith|EN|35|RB|66
18|Bafodé Diakité|FR|25|CB|79
5|James Hill|EN|24|CB|75
17|Fraser Forster|EN|38|GK|59
44|Veljko Milosavljević|RS|19|CB|72|84
27|Alex Tóth|HU|20|CM|61
` },
  "sun": { coach: "Régis Le Bris", capacity: 48095, players: `
34|Granit Xhaka|CH|33|CM|79
39|Malick Fofana|BE|21|LW|80|87
4|Kevin Danso|AT|27|CB|79|K:Tottenham
9|Brian Brobbey|NL|24|ST|77
12|Thomas Meunier|BE|34|RB|76
18|Wilson Isidor|HT|25|ST|75
10|Nilson Angulo|EC|23|RW|76
5|Daniel Ballard|NX|26|CB|75
20|Nordi Mukiele|FR|28|LB|74
28|Enzo Le Fée|FR|26|CM|73
7|Chemsdine Talbi|MA|21|RW|78
17|Reinildo|MZ|32|RB|71
13|Luke O'Nien|EN|31|AM|73
22|Robin Roefs|NL|23|GK|70
19|Habib Diarra|SN|22|CM|71
27|Noah Sadiki|CD|21|DM|70
6|Dayann Methalie|FR|20|CB|69
32|Trai Hume|NX|24|CB|67
15|Omar Alderete|PY|29|CB|67
8|Alan Browne|IE|31|AM|66
11|Chris Rigg|EN|19|CM|65
14|Romaine Mundle|EN|23|RW|65
46|Abdoullah Ba|FR|23|DM|64
-|Juan Riquelme Angulo|EC|18|LW|64
42|Aji Alese|EN|25|LB|63
31|Melker Ellborg|SE|23|GK|61
37|Jocelin Ta Bi|CI|21|ST|60
21|Simon Moore|EN|36|GK|56
29|Jules Ahoka|CD|25|DM|58
` },
  "clj": { coach: "", capacity: 13059, players: `
7|Benjamin Verbič|SI|32|ST|71
47|Armandas Kučys|LT|23|ST|71
33|Leonardo Koutris|GR|31|RB|70
91|Yaya Dukuly|AU|23|RW|71
9|Blaž Kramer|SI|30|LW|69
10|Svit Sešlar|SI|24|CM|70
20|Alpha Diounkou|SN|24|LB|67
6|Artemijus Tutyškinas|LT|23|CB|69
11|Milot Avdyli|XK|24|CM|67
8|Mario Kvesić|BA|34|DM|67
1|Žan-Luk Leban|SI|23|GK|67
2|Pijus Širvys|LT|28|CB|65
94|Rudi Požeg Vancaš|SI|32|ST|65
13|Papa Daniel|NG|25|AM|63
44|Łukasz Bejger|PL|24|CB|63
19|Mark Zabukovnik|SI|25|CM|64
25|Veton Tusha|XK|23|RW|62
23|Žiga Frelih|SI|28|GK|61
17|Andrej Kotnik|SI|31|DM|60
15|Žan Žužek|SI|29|CB|60
3|Damjan Vuklišević|SI|31|CB|60
14|Luka Vešner Tičić|SI|25|AM|59
4|Darko Hrka|SI|25|CM|56
5|Gašper Vodeb|SI|25|RB|55
12|Luka Kolar|SI|25|GK|54
27|Ivan Ćalušić|HR|25|DM|55
77|Matic Ivanšek|SI|25|LB|53
` },
  "jag": { coach: "Adrian Siemieniec", capacity: 22432, players: `
4|Yuki Kobayashi|JP|26|CB|74
99|Nik Prelec|SI|25|ST|73
27|Rodrigo Conceição|PT|26|CB|73
10|Jeremy Agbonifo|SE|20|ST|70|K:Lens
72|Kamil Jóźwiak|PL|28|CM|70
19|Anders Klynge|DK|25|CM|70
6|Taras Romanczuk|PL|34|DM|69
7|Kajetan Szmyt|PL|24|AM|70
30|Ousmane Sow|SN|26|RW|68|K:Brøndby
21|Sergio Lozano|ES|27|CM|68
11|Jesús Imaz|ES|35|LW|67
32|Aleksandar Ćirković|RS|24|DM|67|K:Ferencváros
9|Dimitris Rallis|GR|21|ST|66
17|Youssuf Sylla|BE|23|RW|65
5|Bernardo Vital|PT|25|CB|65
44|Apostolos Konstantopoulos|GR|24|CB|64
14|Hampus Finndell|SE|26|AM|64
50|Sławomir Abramowicz|PL|22|GK|61
20|Bartłomiej Wdowik|PL|25|RB|63|K:Braga
3|Dušan Stojinović|SI|25|LB|61
23|Guilherme Montóia|PT|22|CB|60
15|Norbert Wojtuszek|PL|24|CM|61
8|Dawid Drachal|PL|21|DM|60
80|Zachary Zalewski|PL|17|AM|57
2|Cezary Polak|PL|23|RB|58
1|Michał Perchel|PL|25|GK|55
59|Paweł Pakieła|PL|25|CM|56
61|Bartłomiej Krasiewicz|PL|25|LB|53
63|Olaf Pankiewicz|PL|25|CB|52
65|Maksim Kononov|BY|25|LW|51
66|Adrian Damasiewicz|PL|25|GK|50
67|Jakub Rabiczko|PL|25|GK|49
85|Eryk Kozłowski|PL|25|DM|50
90|Maciej Kuczyński|PL|25|AM|48
` },
  "omo": { coach: "Henning Berg", capacity: 22859, players: `
1|Thomas Kaminski|BE|33|GK|73|K:Charlton Athletic
8|David Akintola|NG|30|ST|72
93|Jean-Kévin Duverne|HT|29|CB|73
37|Ľubomír Šatka|SK|30|CB|72
99|Loïs Diony|FR|33|ST|70
17|Florin Tănase|RO|31|AM|70
22|Muamer Tanković|SE|31|CM|70
77|Loïc Négo|HU|35|CB|67
28|Moses Odubajo|EN|33|RB|70
27|Stefan Simić|CZ|31|CB|67
6|Carel Eiting|NL|28|CM|66
5|Senou Coulibaly|ML|31|LB|66
29|Jure Balkovec|SI|31|RB|66
20|Luuk Brouwers|NL|28|DM|65
9|Andronikos Kakoullis|CY|25|RW|64
21|Mihlali Mayambela|ZA|29|LW|65
11|Ewandro|BR|30|CM|63
7|Jaden Montnor|SR|24|ST|62
40|Fabiano|CY|38|GK|57
33|Mateusz Musiałowski|PL|22|DM|60
14|Mateo Marić|BA|28|AM|59
3|Fotis Kitsos|GR|23|CB|60
74|Panagiotis Andreou|CY|25|CM|59
78|Pantelis Michael|CY|25|GK|55
82|Andreas Christou|CY|25|DM|57
85|Angelos Neophytou|CY|25|RW|55
88|Chrysis Evangelou|CY|25|LW|55
90|Christos Constantinides|CY|25|LB|53
91|Constantinos Panayi|CY|25|ST|53
` },
  "rcv": { coach: "Claudio Giráldez", capacity: 24870, players: `
7|Borja Iglesias|ES|33|ST|79
1|Altay Bayındır|TR|28|GK|76|K:Manchester United
3|Marcos Alonso|ES|35|LB|76
6|Ilaix Moriba|GN|23|CM|77
24|Couhaib Driouech|MA|24|RW|77
21|Sebastián Cáceres|UY|26|CB|76
10|Iago Aspas|ES|39|ST|76
2|Carl Starfelt|SE|31|CB|77
9|Ferran Jutglà|ES|27|ST|76
13|Ionuț Radu|RO|29|GK|77
19|Williot Swedberg|SE|22|LW|77
22|Javi Galán|ES|31|LB|74
4|Abdoulaye Faye|SN|21|CB|72|K:Bayer Leverkusen
20|Javi Rodríguez|ES|23|CB|75
25|Iván Villar|ES|29|GK|72
39|Jones El-Abdellaoui|MA|20|RW|70
14|Aleix Febas|ES|30|CM|73
17|Javi Rueda|ES|24|RB|74
11|Pablo Durán|ES|25|ST|76
5|Sergio Carreira|ES|25|RB|68
16|Hugo González|ES|23|ST|68
15|Álvaro Núñez|ES|26|LB|67
23|Hugo Álvarez|ES|23|LW|76
8|Miguel Román|ES|23|DM|64
18|Yoel Lago|ES|22|CB|65
` },
  "hof": { coach: "Christian Ilzer", capacity: 30150, players: `
27|Andrej Kramarić|HR|35|AM|79
5|Ozan Kabak|TR|26|CB|78
11|Fisnik Asllani|XK|24|ST|78
10|Adam Hložek|CZ|24|ST|79
34|Vladimír Coufal|CZ|33|RB|76
17|Nathan De Cat|BE|18|CM|70|83
1|Oliver Baumann|DE|36|GK|81
8|Patrick Wimmer|AT|25|RW|76
14|Adam Daghim|DK|20|LW|72
28|Kōki Machida|JP|28|CB|76
2|Robin Hranáč|CZ|26|CB|77
13|Bernardo|BR|31|LB|76
22|Alexander Prass|AT|25|LB|76
16|Luis Engelns|DE|19|AM|71
18|Wouter Burger|NL|25|DM|78
7|Leon Avdullahu|XK|22|DM|76
9|Max Moerstedt|DE|20|ST|71
39|Mats Rots|NL|20|CB|70
21|Albian Hajdari|XK|23|RB|68
19|Tim Lemperle|DE|24|ST|76
35|Arthur Chaves|BR|25|LB|68
15|Valentin Gendrey|FR|26|CB|65
20|Bambasé Conté|DE|23|AM|65
32|Cajetan Lenz|DE|20|CM|65
36|Lúkas Petersson|IS|22|GK|63
4|Sean Dulic|DE|21|CB|62
29|Natnael Abraha|DE|25|RB|62
37|Luca Philipp|DE|25|GK|59
` },
  "tor": { coach: "", capacity: null, players: `
2|Stopira|CV|38|CB|69
7|Dany Jean|HT|23|ST|72
14|Jorge Aguirre|CU|26|ST|71
30|Bob Omoregbe|IT|22|RW|70
19|Karem Zoabi|IL|20|LW|68
16|Lisandru Olmeta|FR|21|GK|70
-|João Marques|PT|24|CM|70|K:Braga@2027
29|Luis Quintero|CO|21|ST|69
10|Costinha|PT|33|CM|67
23|Javi Vázquez|ES|25|CB|66
1|Lucas Paes|BR|28|GK|67
17|Musa Drammeh|ES|24|RW|65
21|Nuha Jatta|DE|20|DM|66
-|Amine Oudrhiri|MA|33|AM|63
98|Bryan Meyo|GA|20|LW|63
-|Vando Félix|GW|23|ST|62
45|Jonathan Mutombo|FR|25|CB|62
8|Álex Alfaro|ES|24|CM|61
31|Adriel|BR|25|GK|59
11|Manu Pozo|ES|24|RW|61
5|Mohamed Ali Diadié|MR|21|CB|58
28|Hugo Pérez|ES|23|RB|59
3|Juan Alcedo|ES|25|LB|58
22|David Bruno|PT|34|CB|55
46|Brian Agbor|CM|25|RB|56
44|Silas Bjerre|DK|21|GK|54
13|Unai Pérez|ES|25|GK|51
20|Carlos Reina|ES|25|DM|51
24|Patrick Injai|FR|25|AM|51
25|Jérémy Mounsesse|CG|25|LB|50
26|André Simões|PT|25|CM|49
47|Adama Baradji|FR|25|LW|48
55|Zé Breno|BR|25|DM|47
57|Danilo|BR|25|CB|47
` },
  "hbs": { coach: "Ran Kozuch", capacity: 16126, players: `
66|Igor Zlatanović|RS|28|ST|75
17|Amankwah Forson|GH|23|CM|73|K:Norwich City
20|Javon East|JM|31|ST|73
5|Pedro Amador|PT|27|CB|73
9|Zahi Ahmed|IL|24|RW|72
44|Djibril Diop|SN|27|CB|71
25|Lucas Ventura|BR|28|CM|70
70|João Victor|BR|22|LW|71
7|Eliel Peretz|IL|29|DM|69
4|Miguel Vítor|IL|37|CB|65
27|Yoni Stoyanov|BG|25|CM|69
10|Dan Bitton|IL|31|DM|67
1|Ofir Marciano|IL|36|GK|65
90|Adrián Ugarriza|PE|29|ST|67
15|Idan Nachmias|IL|29|CB|66
45|Muhammad Abu Rumi|IL|22|AM|64
8|Mohammed Kna'an|IL|26|AM|64
14|Yonas Malede|IL|26|RW|64
3|Matan Baltaxa|IL|30|RB|63
11|Amir Ganah|IL|21|CM|63
2|Guy Mizrahi|IL|25|CB|61
34|Marco Wolff|AR|29|GK|58
13|Ofir Davidzada|IL|35|LB|58
12|Itay Rotman|IL|23|RB|59
28|Niv Yehoshua|IL|21|DM|58
18|Roy Levy|IL|25|LB|57
23|Itay Hazut|IL|25|AM|55
36|Yonatan Shani|IL|25|GK|53
` },
  "nec": { coach: "Dick Schreuder", capacity: 12650, players: `
7|Emre Mor|TR|29|ST|77
10|Dušan Tadić|RS|37|ST|71
4|Perr Schuurs|NL|26|CB|76
18|Kōki Ogawa|JP|29|RW|75
35|Jamiro Monteiro|CV|32|CM|73
8|Isak Hansen-Aarøen|NO|21|CM|73
3|Philippe Sandler|NL|29|CB|72
2|Brayann Pereira|FR|23|RB|72
99|Clement Bischoff|DK|20|LW|71|K:Red Bull Salzburg
14|Kaj Sierhuis|NL|28|ST|72
24|Deveron Fonville|CW|23|CB|71
66|Almugera Kabar|DE|20|CB|70|K:Borussia Dortmund
6|Darko Nejašmić|HR|27|DM|69
11|Willum Þór Willumsson|IS|27|AM|68
21|Tobias Storm|DK|22|LB|68
-|Dennis Geiger|DE|28|CM|67
1|Gonzalo Crettaz|ES|26|GK|66
9|Tjaronn Chery|SR|38|DM|62
5|Thomas Ouwejan|NL|29|CB|65
12|Nikolas Polster|AT|24|GK|62
30|Bryan Linssen|NL|35|RW|61
20|Noé Lebreton|FR|22|AM|61
17|Bram Nuytinck|NL|36|RB|58
32|Vito van Crooij|NL|30|CM|61
36|Freek Entius|NL|25|GK|57
` },
  "ofi": { coach: "Christos Kontis", capacity: 26240, players: `
19|Kenan Kodro|BA|32|ST|72|K:Ferencváros
10|Aitor Cantalapiedra|ES|30|CM|72
9|Aaron Leya Iseka|BE|28|ST|70
11|Taxiarchis Fountas|GR|30|RW|71
14|Thanasis Androutsos|GR|29|CM|70
24|Lorenzo Dickmann|IT|29|CB|70
18|Thiago Nuss|AR|25|DM|69
43|Dimitrios Nikolaou|GR|27|CB|67|K:Palermo
41|Andreas Bouchalakis|GR|33|AM|68
21|Giannis Apostolakis|GR|21|CM|67
16|Christos Sielis|CY|26|CB|65
5|Konstantinos Kostoulas|GR|21|CB|64
17|Borja González|ES|30|RB|65
4|Nikos Marinakis|GR|32|LB|65
2|Krešimir Krizmanić|HR|26|CB|64
15|Achilleas Poungouras|GR|30|RB|62
3|Nikos Athanasiou|GR|25|LB|62|K:Olympiakos
1|Klidman Lilo|AL|23|GK|60
30|Thiago Romano|AR|20|DM|61
8|Georgios Kanellopoulos|GR|26|AM|61
31|Nikos Christogeorgos|GR|26|GK|58
6|Zisis Karachalios|GR|30|CM|57
7|Anastasios Chatzigiovanis|GR|29|DM|57
46|Giannis Theodosoulakis|GR|21|LW|55
13|Panagiotis Katsikas|GR|27|GK|54
23|Manuel Kalafatis|GR|25|GK|52
44|Lefteris Kontekas|GR|25|CB|53
52|Konstantinos Lagoudakis|GR|25|RB|52
90|Pavlos Kenourgiakis|GR|25|LB|51
91|Emmanouil Chnaris|GR|25|AM|50
` },
  "lil2": { coach: "Hans Erik Ødegaard", capacity: 12250, players: `
8|Fredrik Gulbrandsen|NO|33|ST|71
22|Daniel Bassi|NO|21|CM|71
12|Pontus Dahlberg|SE|27|GK|70
20|Felix Vá|AO|27|ST|69
29|Ylldren Ibrahimaj|XK|30|CM|70
17|Eric Kitolano|NO|28|DM|69
28|Ruben Gabrielsen|NO|34|CB|68
10|Thomas Lehne Olsen|NO|35|RW|67
2|Lars Ranger|NO|27|CB|67
7|Linus Alperud|SE|20|AM|68
21|Filip Ottosson|SE|29|CM|67|K:IFK Göteborg
14|Gustav Nyheim|NO|20|DM|66
19|Camil Jebara|SE|23|LW|65
5|Sander Moen Foss|NO|27|CB|64
16|Henrik Melland|NO|21|AM|63
26|Yaw Paintsil|NO|26|RW|63
18|Kevin Martin Krygård|NO|26|CM|63
6|Harald Woxen|NO|18|DM|61
3|Sturla Ottesen|NO|25|CB|62
47|Stian Kristiansen|NO|27|RB|59
11|Frederik Elkær|DK|24|LB|58
4|Espen Garnås|NO|31|CB|58
1|Stefan Hagerup|NO|32|GK|55
15|Gustav Nordh|SE|25|AM|56
25|Seun Akanji|NG|25|ST|54
35|Filip Reshane|NO|25|RB|54
36|Isa Daniel Jallow|NO|25|LB|54
41|Ivar Winje|NO|25|LW|51
50|Lazar Babic|NO|25|GK|51
` },
  "lvs": { coach: "Julio Velázquez", capacity: 17688, players: `
8|Marko Grujić|RS|30|CM|73
11|Armstrong Oko-Flex|IE|24|ST|72
4|Christian Makoun|VE|26|CB|73
50|Kristian Dimitrov|BG|29|CB|71
19|El Mehdi El Moubarik|MA|25|CM|69
20|Álex Centelles|ES|26|RB|70
7|Reinaldo|BR|25|ST|70
92|Svetoslav Vutsov|BG|24|GK|68
12|Mustapha Sangaré|ML|27|RW|69
55|Petko Hristov|BG|27|CB|68|K:Spezia
2|Hevertton|BR|25|CB|67
31|Nikola Serafimov|MK|27|LB|66
47|Akram Bouras|DZ|24|DM|65
3|Maicon|BR|26|CB|66
35|Serginho|PT|26|AM|65
17|Everton Bala|BR|27|LW|64
21|Aldair Neves|PT|26|RB|62
10|Asen Mitkov|BG|21|CM|63
9|Juan Perea|CO|26|ST|63
18|Gašper Trdin|SI|28|DM|60
71|Oliver Kamdem|CM|23|LB|61
99|Radoslav Kirilov|BG|34|RW|59
22|Mazire Soula|FR|33|AM|58
27|David Kusso|AO|22|LW|57
78|Martin Lukov|BG|33|GK|55
1|Ognyan Vladimirov|BG|18|GK|54
28|Stivan Stoyanchov|BG|18|ST|53
77|Adrian Raychev|BG|25|RW|54|K:Pisa
` },
  "ara": { coach: "Tulipa", capacity: 1428, players: `
95|França|BR|31|CM|71
77|Artur Serobyan|AM|23|ST|68
13|Kamo Hovhannisyan|AM|33|CB|68
10|Armen Ambartsumyan|AM|32|CM|68
91|Sandro Lima|BR|35|ST|66
3|Junior Bueno|AM|29|CB|67
43|Bruno Wilson|PT|29|CB|66
2|Hugo Oliveira|PT|24|CB|66
7|Zhirayr Shaghoyan|AM|25|RW|66
11|Zidane Banjaqui|GW|27|DM|64
17|Maxence Carlier|FR|29|AM|63
5|Luis Felipe|BR|25|RB|62
70|Benny|PT|29|CM|63
25|Alioune Ndour|SN|28|LW|61
19|Karen Muradyan|AM|33|DM|61
47|Alexandros Malis|GR|29|LB|59
16|Edgar Grigoryan|AM|27|CB|60
20|Alwyn Tera|KE|29|AM|60
8|Juan Balanta|CO|29|CM|59
9|Arayik Eloyan|AM|22|ST|58
98|João Bravim|BR|28|GK|54
90|Paul Ayongo|GH|29|RW|55
1|Arman Nersesyan|AM|25|GK|53
6|Michel Ayvazyan|AM|25|DM|55
12|Hayk Khachatryan|AM|25|GK|53
14|Bruno Pereira|PT|25|RB|52
27|Davit Petrosyan|AM|25|AM|52
28|Davit Barseghyan|AM|25|CM|51
36|Vahram Makhsudyan|AM|25|DM|49
-|Shirak Badalyan|AM|25|GK|46
` },
  "ata": { coach: "Maurizio Sarri", capacity: 23439, players: `
19|Franck Kessié|CI|29|CM|80
17|Charles De Ketelaere|BE|25|AM|83
99|Eljif Elmas|MK|26|AM|79|K:RB Leipzig
23|Sead Kolašinac|BA|33|CB|78
11|Jonathan Rowe|EN|23|LW|77|K:Bologna
9|Gianluca Scamacca|IT|27|ST|80
8|Mario Pašalić|HR|31|AM|80
18|Giacomo Raspadori|IT|26|ST|80
42|Giorgio Scalvini|IT|22|CB|81|86
59|Nicola Zalewski|PL|24|LW|78
7|Kamaldeen Sulemana|GH|24|RW|77
3|Odilon Kossounou|CI|25|CB|79
29|Marco Carnesecchi|IT|26|GK|83
16|Raoul Bellanova|IT|26|RB|80
10|Lazar Samardžić|RS|24|AM|79
77|Davide Zappacosta|IT|34|RB|77
4|Isak Hien|SE|27|CB|82
90|Nikola Krstović|ME|26|ST|78
70|Gianluca Gaetano|IT|26|AM|73
31|Thomas Kristensen|DK|24|CB|70|K:Udinese
57|Marco Sportiello|IT|34|GK|69
47|Lorenzo Bernasconi|IT|22|RB|71
22|Thomas Pompei|IT|25|GK|68
` },
  "bra": { coach: "Carlos Vicens", capacity: 30286, players: `
10|Pau Víctor|ES|24|ST|76
8|João Moutinho|PT|39|CM|75
21|Ricardo Horta|PT|31|AM|80
19|Jonas Wind|DK|27|ST|76
16|Tommy Marqués|ES|19|DM|73
14|Gustaf Lagerbielke|SE|26|CB|76
17|Jovan Milošević|RS|21|ST|72
9|Fran Navarro|ES|28|ST|76
44|Adrian Bajrami|CH|24|CB|73
11|Gabriel Silva|BR|24|RW|74
26|Bright Arrey-Mbi|DE|23|CB|75
23|Denis Huseinbašić|BA|25|CM|74
2|Víctor Gómez|ES|26|RB|76
34|Demir Ege Tıknaz|TR|21|DM|75|84
4|Sikou Niakaté|ML|27|CB|76
37|Adrian Barišić|BA|25|LB|75
20|Mario Dorgeles|CI|22|CM|75
12|Tiago Sá|PT|31|GK|74
6|Vitor Carvalho|BR|29|DM|69
77|Gabri Martínez|ES|23|RW|76
22|Sergio Barcia|ES|25|CB|68
7|Diogo Travassos|PT|22|RB|67
50|Diego Rodrigues|PT|21|AM|65
29|Jean-Baptiste Gorby|FR|24|CM|76
31|Bernardo|BR|24|LB|76
73|João Aragão|PT|18|ST|61
78|João Carvalho|PT|25|GK|61
` },
  "aja": { coach: "Míchel", capacity: 55865, players: `
1|Marc-André ter Stegen|DE|34|GK|83|K:Barcelona
8|Julian Brandt|DE|30|AM|81
4|Sofyan Amrabat|MA|29|DM|79
99|Tolu Arokodare|NG|25|ST|76|K:Wolverhampton Wanderers
9|Kasper Dolberg|DK|28|ST|78
17|Daley Blind|NL|36|CB|75
7|Simon Adingra|CI|24|LW|76|K:Sunderland
38|Marcos Leonardo|BR|23|ST|74
6|Thilo Kehrer|DE|29|CB|77|K:Monaco
18|Davy Klaassen|NL|33|CM|76
11|Viktor Tsyhankov|UA|28|RW|77
10|Oscar Gloukh|IL|22|AM|77
26|Maarten Paes|ID|28|GK|75
12|Caio Henrique|BR|29|LB|77
23|Steven Berghuis|NL|34|RW|76
21|Jofre Torrents|ES|19|LB|70
68|Abdellah Ouazane|MA|17|CM|69
5|Owen Wijndal|NL|26|LB|72
24|Jorthy Mokio|CD|18|CB|76|86
15|Youri Baas|NL|23|CB|78|84
20|Oliver Edvardsen|NO|27|RW|75
2|Lucas Rosa|BR|26|CB|67
43|Rayane Bounida|MA|20|CM|66
3|Anton Gaaei|DK|23|RB|76
30|Aaron Bouwman|NL|18|LB|64
22|Joeri Heerkens|NL|20|GK|63
36|Dies Janse|NL|20|CB|63
` },
  "scf": { coach: "Julian Schuster", capacity: 34700, players: `
31|Igor Matanović|HR|23|ST|76
28|Matthias Ginter|DE|32|CB|80
14|Yuito Suzuki|JP|24|AM|76
42|Keisuke Gotō|JP|21|ST|77
32|Vincenzo Grifo|IT|33|LW|78
3|Philipp Lienhart|AT|30|CB|78
1|Mio Backhaus|DE|22|GK|75
30|Christian Günter|DE|33|LB|76
20|Rihito Yamamoto|JP|24|AM|77
8|Maximilian Eggestein|DE|29|CM|79
19|Niklas Beste|DE|27|LW|77
7|Derry Scherhant|DE|23|RW|73
16|Yannik Engelhardt|DE|25|DM|74
21|Florian Müller|DE|28|GK|76
9|Lucas Höler|DE|32|ST|75
22|Cyriaque Irié|BF|21|ST|71
23|Florent Muslija|XK|28|AM|74
24|Jannik Huth|DE|32|GK|70
33|Jordy Makengo|FR|25|LB|75
27|Berkay Yılmaz|TR|21|CB|67
5|Anthony Jung|DE|34|RB|67
29|Philipp Treu|DE|25|RB|76
37|Max Rosenfelder|DE|23|LB|66
43|Bruno Ogbus|CH|20|CB|65
6|Patrick Osterhage|DE|26|CM|76
17|Lukas Kübler|DE|33|RB|77
39|Rouven Tarnutzer|CH|25|CM|63
` },
  "asm": { coach: "Filipe Luís", capacity: 16360, players: `
9|Folarin Balogun|US|25|ST|79
31|Ansu Fati|ES|23|LW|76
8|Lamine Camara|SN|22|CM|79|86
15|Eric Dier|EN|32|CB|77
18|Takumi Minamino|JP|31|AM|80
10|Aleksandr Golovin|RU|30|AM|79
6|Denis Zakaria|CH|29|DM|82
29|Paris Brunner|DE|20|AM|72
14|Mika Biereth|DK|23|ST|78
7|Mathys Detourbet|FR|19|ST|75|K:Manchester City
1|Lukas Hradecky|FI|36|GK|78
22|Mohammed Salisu|GH|27|CB|80
2|Vanderson|BR|25|RB|80
11|Matthis Abline|FR|23|ST|76
4|Jordan Teze|NL|26|CB|77
20|Flávio Nazinho|PT|23|RB|72
16|Philipp Köhn|CH|28|GK|77
17|Stanis Idumbo|BE|21|CM|72
13|Christian Mawissa|FR|21|CB|75|84
28|Mamadou Coulibaly|FR|22|DM|69
72|Sadibou Sané|SN|22|CB|70
37|Edan Diop|FR|21|AM|68
19|Pape Cabral|FR|19|CM|67
44|Samuel Nibombé|BE|19|RB|67
49|Ilane Touré|FR|20|LB|65
40|Jules Stawiecki|FR|25|GK|64
41|Aymen Assab|FR|25|DM|62
42|Oumar Konaté|CI|25|LW|62
46|Anis Soubeir|MA|25|AM|61
47|Safouane Benzahra|MA|25|ST|60
` },
  "fck": { coach: "Bo Svensson", capacity: 38065, players: `
12|Thapelo Maseko|ZA|22|RW|78
10|Mohamed Elyounoussi|NO|32|ST|76
33|Alex Král|CZ|28|CM|76
7|Maher Carrizo|AR|20|ST|73|K:Ajax
27|Thomas Delaney|DK|34|CM|73
14|Andreas Cornelius|DK|33|LW|75
20|Junnosuke Suzuki|JP|23|CB|73
1|Diant Ramaj|DE|24|GK|73|K:Borussia Dortmund
31|Rúnar Alex Rúnarsson|IS|31|GK|74
4|Asger Sørensen|DK|30|CB|71
13|Rodrigo Huescas|MX|22|CB|72
15|Marcos López|PE|26|CB|69
36|William Clem|DK|22|DM|70
24|Birger Meling|NO|31|RB|68
2|Felix Beijmo|SE|28|LB|69
39|Viktor Daðason|IS|18|ST|67
16|Robert Silva|BR|21|RW|66
6|Ákos Markgráf|HU|21|CB|67
21|Mads Emil Madsen|DK|28|AM|65
8|Magnus Mattsson|DK|27|CM|65
18|Kenay Myrie|CR|19|RB|63
28|Hunor Németh|HU|19|DM|63
44|Geovanni Vianney Ndjee|CM|18|LW|62
51|Tobias Breum-Harild|DK|25|GK|59
` },
  "fcm": { coach: "Mike Tullberg", capacity: 12055, players: `
10|Cho Gue-sung|KR|28|ST|77
8|Philip Billing|DK|30|CM|76
5|Rasmus Kristensen|DK|29|RB|78
98|David Martínez|VE|20|ST|73
6|Martin Erlić|HR|28|CB|74
20|Hong Hyun-seok|KR|27|CM|73|K:Mainz 05
21|Denil Castillo|EC|22|DM|74
9|Mileta Rajović|DK|27|RW|71|K:Legia Warsaw
29|Kjell Wätjen|DE|20|AM|73
17|Mikael Uhre|DK|31|LW|71
22|Mads Bech Sørensen|DK|27|CB|72
41|Mikel Gogorza|DK|19|ST|70
74|Júnior Brumado|BR|27|RW|68
90|Friday Etim|NG|24|LW|68
30|Ovie Ejeheri|EN|23|GK|67
19|Pedro Bravo|CO|21|CM|68
3|Magnus Jensen|DK|29|CB|67
4|Ousmane Diao|SN|22|RB|65
25|Nordin Bakker|NL|28|GK|64
27|Sofus Johannesen|DK|19|DM|65
55|Victor Bak|DK|22|LB|64
1|Elías Ólafsson|IS|26|GK|62
38|Julius Emefile|DK|19|ST|63
15|Djé Beni|CI|25|CB|61
18|Stanley Iheanacho|NG|25|RW|61
33|Alamara Djabi|GW|25|AM|59
34|Abdou Aziz Ndiaye|SN|25|RB|58
60|Mark Ugboh|NG|25|GK|56
` },
  "crv": { coach: "Albert Riera", capacity: 51755, players: `
9|Bamba Dieng|SN|25|ST|79
32|Derrick Luckassen|GH|31|CB|76
7|Marko Arnautović|AT|37|ST|73
14|Osman Bukari|GH|27|CM|76|K:Widzew Łódź
70|Muhammed Cham|AT|25|CM|74|K:Trabzonspor
33|Rade Krunić|BA|32|DM|73
15|Mohammad Abu Fani|IL|28|CM|75
3|Yūta Nakayama|JP|29|CB|72
22|Vasilije Kostov|RS|18|CM|68
13|Miloš Veljković|RS|30|CB|72
4|Mirko Ivanić|ME|32|DM|72
23|Mihailo Ristić|RS|30|CB|70
75|Loizos Loizou|CY|23|AM|71
10|Aleksandar Katai|RS|35|CM|66
21|Timi Max Elšnik|SI|28|DM|68
8|Kristiyan Balov|BG|20|AM|67
1|Matheus|BR|34|GK|64
20|Tomás Händel|PT|25|CM|66
5|Rodrigão|BR|30|RB|65
71|Adem Avdić|RS|18|LB|66
30|Franklin Tebo Uchenna|NG|26|CB|63
45|Stefan Gudelj|RS|20|RB|63
6|Mahmudu Bajo|GM|21|DM|63
37|Vladimir Lučić|RS|24|AM|62
50|Savo Radanović|RS|17|GK|58
27|Matej Strika|RS|16|LB|60
55|Dimitrije Šarić|RS|17|CM|60
77|Ivan Guteša|RS|24|GK|57
60|Matej Gashtarov|MK|25|DM|56
19|Kim Ye-geon|KR|25|AM|55
` },
  "gnt": { coach: "Rik De Mil", capacity: 20175, players: `
7|Michel-Ange Balikwisha|CD|25|ST|77|K:Celtic
21|Max Dean|EN|22|ST|75
16|Christian Burgess|EN|34|CB|74
8|László Bénes|SK|28|CM|74
3|Maksim Paskotši|EE|23|CB|74
11|Momodou Sonko|SE|21|RW|74
33|Davy Roef|BE|32|GK|72
47|Josué Vergara|PA|19|LW|70
22|Leonardo Lopes|PT|27|CM|73
44|Siebe Van der Heyden|BE|28|CB|72
20|Tiago Araújo|PT|25|CB|72
-|Pieter Gerkens|BE|31|DM|70
5|El Bachir Ngom|SN|26|RB|68
37|Abdelkahar Kadri|DZ|26|AM|69
18|Matisse Samoise|BE|24|CM|69
27|Tibe De Vlieger|BE|20|DM|68
17|Mathias Delorge|BE|22|AM|67
39|Abdoul Ayinde|BF|21|LB|67
10|Aimé Omgba|NL|23|CM|65
30|Kjell Peersman|BE|22|GK|62
61|Abubakar Abdullahi|NG|20|ST|63
28|Mohammed El Âdfaoui|BE|25|DM|63
23|Tom Vandenberghe|BE|33|GK|61
14|Kyrell Wilson|EN|25|RW|62
29|Lars Cooman|BE|25|CB|59
31|Bas Evers|BE|25|GK|58
35|Gilles De Meyer|BE|25|RB|59
45|Hyllarion Goore|CI|25|LW|58
51|Victor De Coninck|BE|25|GK|54
56|Mamadou Diallo|SN|25|LB|55
57|Matties Volckaert|BE|25|CB|53
59|El Hadji Seck|SN|25|ST|52
62|Wout Asselman|BE|25|AM|51
75|Ibrahima Cissé|SN|25|RW|51
` },
  "pao": { coach: "Jacob Neestrup", capacity: 69618, players: `
21|Azzedine Ounahi|MA|26|CM|79
1|Iñaki Peña|ES|27|GK|77
6|Stefan de Vrij|NL|34|CB|75
5|Anass Salah-Eddine|MA|24|CB|74|K:Roma
9|Cyriel Dessers|NG|31|ST|76
26|Imrân Louza|MA|27|CM|75
28|Facundo Pellistri|UY|24|DM|75
42|Kings Kangwa|ZM|27|AM|73
2|Davide Calabria|IT|29|RB|73
99|Levi García|TT|28|ST|71|K:Spartak Moscow
34|Victor Kristiansen|DK|23|CB|72|K:Leicester City
55|Rick van Drongelen|NL|27|CB|70
4|Pedro Chirivella|ES|29|CM|71
7|Andrews Tetteh|GR|25|RW|70
14|Erik Palmer-Brown|US|29|LB|69
74|Elmin Rastoder|MK|24|LW|68
15|Sverrir Ingi Ingason|IS|33|CB|68
22|Etienne Camara|FR|23|DM|67
10|Santino Andino|AR|20|AM|67
8|Adriano Jagušić|HR|20|CM|64
77|Giorgos Kyriakopoulos|GR|30|RB|64
20|Vicente Taborda|AR|25|DM|63
18|Sotiris Kontouris|GR|21|AM|64
12|Lucas Chaves|AR|31|GK|60|K:Argentinos Juniors
3|Giorgos Katris|GR|20|LB|61
19|Triantafyllos Tsapras|GR|24|CB|60
17|Pavlos Pantelidis|GR|23|CM|58
70|Konstantinos Kotsaris|GR|30|GK|57
30|Giorgos Kyriopoulos|GR|21|DM|57
39|Giannis Bokos|GR|19|AM|55
` },
  "paf": { coach: "Ricardo Sá Pinto", capacity: 9300, players: `
4|David Luiz|BR|39|CB|69
26|Ivan Šunjić|BA|29|CM|73
12|Ken Sema|SE|32|CM|71
2|Yoram Zague|FR|20|CB|69|K:Paris Saint-Germain
13|Moumi Ngamaleu|CM|32|ST|72
30|Vlad Dragomir|RO|27|AM|69
3|Samy Mmaee|MA|29|CB|69|K:Dinamo Zagreb
99|Radosław Majecki|PL|26|GK|69|K:Monaco
8|Domingos Quina|PT|26|DM|68
88|Pêpê|PT|29|CM|69
1|Jay Gorter|NL|26|GK|67
33|Anderson Silva|BR|28|ST|67
7|Bruno Felipe|BR|32|DM|66
11|Jajá|BR|25|RW|65
14|Nikolas Ioannou|CY|30|CB|65
5|David Goldar|ES|31|RB|65
20|Biel Teixeira|BR|25|AM|65|K:Sporting CP
77|João Correia|CV|29|LB|63
6|Guga|PT|29|CM|63
18|Lelê|BR|28|LW|61|K:Fluminense
17|Afonso Patrão|PT|19|ST|61
50|Alexandre Brito|PT|21|DM|60
98|Charalampos Kyriakidis|CY|27|GK|56
47|Murad Mammadov|AZ|20|RW|57
23|Jónatas Noro|PT|21|CB|58
60|Christos Evzona|CY|25|AM|57
71|Michalis Papastylianou|CY|25|GK|53
` },
  "bha": { coach: "Fabian Hürzeler", capacity: 32176, players: `
44|Luka Vušković|HR|19|CB|76|88
11|Yankuba Minteh|GM|22|RW|79|85
12|Promise David|CA|25|ST|74|K:Union Saint-Gilloise
28|Evan Ferguson|IE|21|ST|76
7|Kaoru Mitoma|JP|29|LW|81
35|Malick Yalcouyé|CI|20|CM|72|83
23|Jason Steele|EN|35|GK|72
8|Jack Hinshelwood|EN|21|CM|77
29|Maxim De Cuyper|BE|25|LB|77
26|Yasin Ayari|SE|22|CM|78
24|Ferdi Kadıoğlu|TR|26|LB|80
25|Diego Gómez|PY|23|CM|78
1|Bart Verbruggen|NL|23|GK|81
14|Chema Andrés|ES|21|DM|74
13|Pascal Groß|DE|35|CM|78
5|Lewis Dunk|EN|34|CB|78
19|Charalampos Kostoulas|GR|19|ST|72|84
4|Pascal Struijk|NL|26|CB|76
33|Matt O'Riley|DK|25|CM|79
39|Femi Azeez|NG|25|CM|69
10|Georginio Rutter|FR|24|AM|79
21|Olivier Boscagli|FR|28|CB|79
27|Mats Wieffer|NL|26|CM|78
30|Michael Svoboda|AT|27|CB|67
15|Ibrahim Osman|GH|21|DM|65
36|Zadok Yohanna|NG|19|AM|63
3|Jaouen Hadjam|DZ|23|RB|63
9|Stefanos Tzimas|GR|20|ST|74|84
20|Costinha|PT|26|LB|61
38|Tom McGill|CA|26|GK|58
` },
  "lug": { coach: "Mattia Croci-Torti", capacity: 8093, players: `
7|Ezgjan Alioski|MK|34|RB|73
2|Bekhruz Karimov|UZ|19|CB|66
3|Hannes Delcroix|HT|27|CB|73
11|Renato Steffen|CH|34|CM|70
91|Kevin Behrens|DE|35|ST|69
30|Dereck Moncada|HN|18|ST|64
46|Mattia Zanotti|IT|23|CB|71
17|Lars Lukas Mai|DE|26|CB|69
6|Antonios Papadopoulos|DE|26|LB|69
19|Claudio Cassano|IT|23|DM|69|K:Chicago Fire
16|David von Ballmoos|CH|31|GK|68
25|Uran Bislimi|CH|26|CM|67
8|Anto Grgić|CH|29|AM|66
22|Beckham Castro|CO|22|RW|66
14|Ahmed Kendouci|DZ|27|CM|64
24|Elias Pihlström|SE|19|DM|64
21|Yanis Cimignani|FR|24|AM|64
27|Daniel Dos Santos|CH|23|CM|62
26|Martim Marques|PT|22|CB|62
28|Felix Gebhardt|DE|24|GK|60
4|Damian Kelvin|CH|25|RB|61
18|Joel Bichsel|CH|25|LB|60
23|Gjan Ajdin|SE|25|DM|59
31|Jason Parente|CH|25|AM|58
32|Nicolò Puddu|CH|25|LW|56
33|Christian Raffa|CH|25|ST|57
36|Bryan Zurmühle|CH|25|RW|55
37|Ian Tiraboschi|CH|25|LW|53
44|Carbone|BR|25|CB|53
99|Diego Mina|CH|25|GK|51
` },
  "get": { coach: "José Bordalás", capacity: 16500, players: `
19|Enes Ünal|TR|29|ST|80
9|Borja Mayoral|ES|29|ST|80
8|Nemanja Gudelj|RS|34|DM|77
23|Orel Mangala|BE|28|CM|77|K:Lyon
-|Christantus Uche|NG|23|CM|76
21|Andrés García|ES|23|CB|77|K:Aston Villa
22|Johan Mojica|CO|33|RB|75
7|Juanmi|ES|33|RW|76
20|Iván Azón|ES|23|LW|74|K:Como
13|David Soria|ES|33|GK|73
10|Martín Satriano|UY|25|ST|72
4|Saba Sazonov|GE|24|CB|72
6|Mario Martín|ES|22|AM|72
24|Zaid Romero|AR|26|CB|71
17|Kiko Femenía|ES|35|LB|69
5|Abdel Abqar|MA|27|CB|70
11|Ramon Terrats|ES|25|CM|68
2|Dakonam Djené|TG|34|CB|68
15|Sebastián Boselli|UY|22|RB|69
3|Davinchi|ES|18|LB|66
1|Jiří Letáček|CZ|27|GK|65
16|Francho Serrano|ES|24|DM|65
26|Jean Ives Valou|CI|20|CB|64|K:Villarreal
` },
  "kup": { coach: "Miika Nuutinen", capacity: 5000, players: `
11|Jaime Moreno|NI|31|ST|71
20|Piotr Parzyszek|PL|32|ST|69
9|Gustav Engvall|SE|30|RW|68
4|Kasim Nuhu|GH|31|CB|67
-|Julius Eskesen|DK|27|CM|68
-|Ayman Aiki|FR|21|CM|66
19|Calvin Kabuye|UG|23|LW|66
1|Johannes Kreidl|AT|30|GK|65
25|Clinton Antwi|GH|26|CB|66
30|Jorginho|PT|28|CB|66
22|Saikou Touray|GM|26|DM|64
16|Tommi Jyry|FI|26|AM|63
8|Petteri Pennanen|FI|35|CM|62
21|Joslyn Luyeye-Lutumba|FI|23|ST|62
7|Jerry Voutilainen|FI|31|DM|62
6|Saku Savolainen|FI|29|RB|60
24|Bob Nii Armah|GH|22|CB|59
33|Taneli Hämäläinen|FI|25|LB|60
29|Akseli Puukko|FI|19|CB|58
28|Brahima Magassa|FR|29|RB|57
14|Samuel Pasanen|FI|20|AM|56
10|Valentín Gasc|AR|25|CM|56
3|Saku Heiskanen|FI|24|LB|55
17|Arttu Heinonen|FI|27|DM|54
23|Arttu Lötjönen|FI|22|CB|53
12|Hemmo Riihimäki|FI|23|GK|50
26|Aaro Toivonen|FI|21|AM|50
13|Niilo Kujasalo|FI|22|CM|51
18|Eemil Tanninen|FI|19|DM|50
32|Rasmus Tikkanen|FI|19|RB|48
37|Kasperi Silen|FI|25|GK|47
` },
  "twe": { coach: "John van den Brom", capacity: 30205, players: `
9|Wout Weghorst|NL|34|ST|78
7|Marko Pjaca|HR|31|LW|75
4|Ruud Nijstad|NL|18|CB|68
25|Lucas Vennegoor of Hesselink|NL|20|RW|73
6|Ramiz Zerrouki|DZ|28|CM|76
37|Naci Ünüvar|TR|23|LW|75
17|Filip Thorvaldsen|NO|20|RW|73
16|Joël Drommel|NL|29|GK|73
23|Stav Lemkin|IL|23|CB|72
14|Kristian Hlynsson|IS|22|CM|71
3|Robin Pröpper|NL|32|CB|72
10|Younes Taha|MA|23|AM|69
1|Lars Unnerstall|DE|36|GK|68
11|Daan Rots|NL|25|ST|68
27|Sondre Ørjasæter|NO|22|LW|68
28|Bart van Rooij|NL|25|RB|68
29|Aske Adelgaard|DK|22|CB|68
8|Daouda Weidmann|FR|23|DM|68
20|Thomas van den Belt|NL|25|CM|66
22|Remko Pasveer|NL|42|GK|74
38|Max Bruns|NL|23|LB|65
32|Arno Verschueren|BE|29|DM|63
2|Michał Rosiak|PL|20|CB|63
44|Juliën Mesbahi|MA|20|AM|63
24|Krzysztof Kurowski|PL|19|RB|60
41|Gijs Besselink|NL|22|CM|60
31|Yannick Gerritsen|NL|25|GK|57
` },
  "lri": { coach: "Juanma Pavón", capacity: 2300, players: `
6|Bernardo Lopes|GI|33|CB|65
2|Ethan Jolley|GI|29|CB|65
10|Álex Mula|ES|30|ST|63
22|Graeme Torrilla|GI|28|CM|63
17|Aly Coulibaly|FR|30|CM|62
66|Julliani Eersteling|NL|24|CB|62
99|Ayman El Ghobashy|EG|30|ST|63
1|Nauzet Santana|ES|32|GK|61
20|Ethan Britto|GI|25|RB|60
7|Lee Casciaro|GI|44|RW|50
3|Christian Rutjens|ES|28|CB|59
5|Gabri Cardozo|UY|28|LB|58
11|Álvaro Romero|ES|30|LW|57
8|Mandi|ES|37|DM|55
16|Leon Mason|GI|19|ST|56
13|Jaylan Hankins|GI|25|GK|55
18|Toni García|ES|35|RW|55
21|Nano|ES|41|RB|48
4|Nico Pinto|NL|25|AM|54
9|Kike Gómez|PH|25|LW|52
19|Yussef Flalhi|ES|25|ST|51
23|Joe|ES|25|CM|51
27|Mark Hamm|NL|25|GK|48
32|Facu Álvarez|AR|25|RW|49
33|Jay Coombes|GI|25|CB|49
44|Manu Toledano|ES|25|LW|47
77|Theo Montovio|GI|25|ST|45
` },
  "bor": { coach: "Vinko Marinović", capacity: 10030, players: `
72|Mladen Jurkas|BA|18|GK|59
18|Miloš Jojić|RS|34|CM|68
7|Luka Juričić|BA|29|ST|67
13|Anderson Esiti|NG|32|CM|66
16|Sebastián Herrera|MK|31|CB|67
44|Ante Roguljić|HR|30|DM|67
89|Matej Deket|BA|16|ST|54
1|Damjan Shishkovski|MK|31|GK|65
2|Bart Meijers|NL|29|CB|63
99|Dani Romera|ES|30|RW|63
24|Jurich Carolina|CW|28|CB|63
6|Siniša Saničanin|BA|31|CB|61
15|Srđan Grahovac|BA|33|AM|60
4|Branimir Cipetić|BA|31|RB|60
98|Sandi Ogrinec|SI|28|CM|59
36|Nikola Terzić|RS|25|LW|59
10|David Vuković|BA|22|DM|59
12|Amer Hiroš|BA|30|AM|58
19|Viktor Rogan|RS|23|LB|57
23|Stojan Vranješ|BA|39|CM|52
30|Nemanja Jakšić|RS|31|RB|56
17|Omar Sijarić|ME|24|DM|54
93|Petar Kunić|BA|33|ST|55
3|Abel Pascual|ES|25|CB|54
9|Karlo Perić|HR|25|RW|53
11|Damir Hrelja|BA|25|AM|51
14|Pavle Đajić|BA|25|LW|49
20|Erik Riđan|HR|25|LB|50
21|Nikola Ćetković|BA|25|GK|47
22|Ivan Kukavica|HR|25|CM|48
47|Amar Milak|BA|25|DM|47
` },
  "stv": { coach: "Frédéric De Meyer", capacity: 14600, players: `
4|Kōta Takai|JP|21|CB|72|K:Tottenham
9|Samed Baždar|BA|22|ST|73
16|Leo Kokubo|JP|25|GK|71
5|Shōgo Taniguchi|JP|35|CB|71
11|Nathanaël Mbuku|CD|24|ST|71|K:Augsburg
18|Nelson Ishiwatari|JP|21|CM|72
3|Taiga Hata|JP|24|CB|70
71|Ryōtarō Araki|JP|24|CM|69
26|Visar Musliu|MK|31|CB|69
7|Arbnor Muja|AL|27|RW|68
10|Ilias Sebaoui|MA|24|LW|69
99|Shion Shinkawa|JP|19|ST|67
38|Kaito Matsuzawa|JP|25|RW|67
8|Abdoulaye Sissako|FR|28|DM|66
14|Ryan Merlen|FR|25|AM|65
77|Oumar Diouf|SN|23|LW|66
22|Wolke Janssens|BE|31|RB|63
60|Robert-Jan Vanwesemael|BE|24|LB|63
23|Joedrick Pupe|BE|29|CB|62
19|Frédéric Soèllé Soèllé|BE|25|ST|61
21|Matt Lendfers|BE|25|GK|59
25|Ahmad Abu Rasen|SA|25|GK|59
31|Illyès Benachour|MA|25|CM|59
32|Jay-David Mbalanda|BE|25|RW|58
33|Alouis Diriken|BE|25|DM|58
39|Rune Verheyden|BE|25|RB|55
` },
  "brn": { coach: "Eirik Horneland", capacity: 17950, players: `
21|Neraysho Kasanwirjo|NL|24|CB|74
8|Sondre Tronstad|NO|30|CM|72
9|Niklas Castro|CL|30|ST|73
29|Noah Holm|NO|25|ST|71
10|Kristall Máni Ingason|IS|24|RW|70
11|Bård Finne|NO|31|LW|70
7|Kjartan Már Kjartansson|IS|20|CM|70
16|Kristian Eriksen|NO|31|ST|68
18|Jacob Lungi Sørensen|DK|28|DM|69
2|Leo Cornic|NO|25|RB|69
1|Mathias Dyngeland|NO|30|GK|67
19|Eggert Aron Guðmundsson|IS|22|AM|66
22|Sævar Atli Magnússon|IS|26|RW|67
3|Fredrik Pallesen Knudsen|NO|29|CB|65
17|Joachim Soltvedt|NO|30|CB|65
25|Niklas Jensen Wassberg|NO|22|CM|65
5|Sakarias Opsahl|NO|27|DM|63
4|Nana Kwame Boakye|GH|20|CB|62
14|Ulrik Mathisen|NO|27|AM|61
23|Thore Pedersen|NO|29|LB|63
20|Vetle Dragsnes|NO|32|CB|62
15|Jonas Torsvik|NO|21|RB|59
12|Simen Vidtun Nilsen|NO|26|GK|56
-|Tom Bramel|NL|25|GK|57
30|Chinedu Cyprain Ononogbo|NG|25|LW|56
36|Håkon Hellesøy|NO|25|GK|54
39|Julian Lægreid|NO|25|ST|55
` },
  "hea": { coach: "Wouter Vrancken", capacity: null, players: `
21|James Wilson|SC|19|ST|66
15|Josh McPake|SC|24|ST|72
10|Cláudio Braga|PT|26|RW|73
74|Rogers Mato|UG|22|LW|71
31|Yan Dhanda|EN|27|CM|71
7|Calvin Miller|SC|28|RB|70
9|JJ Williams|US|28|ST|70
1|Beau Reus|NL|24|GK|70
64|Malachi Fagan-Walcott|EN|24|CB|69
17|Stuart Findlay|SC|30|CB|67
2|Christian Borchgrevink|NO|27|CB|68
11|Pierre Landry Kaboré|BF|25|RW|67
16|Blair Spittal|SC|30|CM|65
3|Stephen Kingsley|SC|32|CB|64
6|Oisin McEntee|IE|25|LB|65
77|Amadou Ba-Sy|FR|25|LW|63
78|Laurent Mendy|FR|29|DM|63
14|Elton Kabangu|BE|28|ST|62
28|Zander Clark|SC|34|GK|59
4|Craig Halkett|SC|31|CB|60
5|Jamie McCart|SC|29|RB|60
19|Sabri Guendouz|FR|26|RW|59
12|Tom Renaud|FR|25|AM|58
29|Sabah Kerjota|AL|24|CM|58
30|Ryan Fulton|SC|30|GK|55
34|Kieran Wright|SC|27|GK|54
23|Jordi Altena|NL|25|LB|54
8|Eduardo Ageu|BR|24|DM|55
22|Tómas Bent Magnússon|IS|23|AM|53
18|Harry Milne|SC|29|CB|51
33|Finlay Pollock|SC|22|CM|49
27|Aron Benjaminsen|FO|18|LW|50
20|Leart Kabashi|CH|25|DM|49
` },
  "kai": { coach: "Rafael Urazbakhtin", capacity: 23804, players: `
28|Marc Gual|ES|30|ST|71
7|Jorginho|PT|28|ST|71
9|Edmilson|BR|29|RW|70
3|Luís Mata|PT|29|CB|69
13|Jaakko Oksanen|FI|25|CM|69
1|Temirlan Anarbekov|KZ|22|GK|69
19|Oiva Jukkola|FI|24|LW|67
44|Lucas Áfrico|BR|31|CB|66
22|Gustavo Mendonça|PT|25|CM|67
82|Sherkhan Kalmurza|KZ|19|GK|64
20|Yerkin Tapalov|KZ|32|CB|64
6|Adilet Sadybekov|KZ|24|DM|65
4|Damir Kasabulat|KZ|23|CB|63
14|Alyaksandr Martynovich|BY|38|RB|58
24|Aleksandr Mrynskiy|KZ|22|LB|62
30|Danila Buch|KZ|18|GK|60
5|Lev Kurgin|KZ|25|CB|60
25|Alexander Shirobokov|KZ|25|RB|60
8|Olzhas Baybek|KZ|25|AM|60
23|Ramazan Bagdat|KZ|25|ST|58
15|Mansur Birkurmanov|KZ|25|RW|57
17|Azamat Tuyakbaev|KZ|25|CM|58
21|Amirbek Bazarbaev|KZ|25|LB|57
27|Mukhamedali Abish|KZ|25|DM|56
32|Adlan Nurgaliev|KZ|25|CB|54
59|Daniyar Tashpulatov|KZ|25|RB|53
81|Ismail Bekbolat|KZ|25|AM|53
` },
  "ucv": { coach: "Filipe Coelho", capacity: 31000, players: `
20|Alexandru Cicâldău|RO|29|AM|74
9|Assad Al Hamlawi|PS|25|ST|72
8|Tudor Băluță|RO|27|CM|71
10|Ștefan Baiaram|RO|23|RW|72
11|Nicușor Bancu|RO|33|RB|70
28|Adrian Rus|RO|30|CB|71
19|Heri Tavares|CV|29|ST|70
17|Carlos Mora|CR|25|CM|69
22|Simon Elisor|FR|27|LW|69
90|Răzvan Sava|RO|24|GK|67
6|Vladimir Screciu|RO|26|DM|68
3|Oleksandr Romanchuk|UA|26|CB|67
21|Laurențiu Popescu|RO|29|GK|65
30|David Matei|RO|20|CM|64
7|Steven Nsimba|FR|30|ST|64
31|Ronaldo Webster|JM|25|CB|63
24|Nikola Stevanović|RS|27|CB|63
16|João Lameira|PT|27|DM|62
12|Monday Etim|NG|27|RW|63
5|Baptiste Roux|FR|26|LB|61|K:TSC
23|Samuel Teles|PT|29|AM|60
77|Pavlo Isenko|UA|23|GK|57
4|Alexandru Crețu|RO|34|CM|58
18|Mihnea Rădulescu|RO|20|DM|58
29|Luca Băsceanu|RO|20|AM|56
14|Alexandru Iamandache|RO|26|CM|55
33|Alexandru Glodean|RO|25|GK|54
38|Denys Muntean|RO|25|DM|54
39|Sebastian Șerban|RO|25|AM|53
` },
  "rig": { coach: "Adrián Guľa", capacity: 8087, players: `
4|Orlando Galo|CR|25|CM|68
9|Anthony Contreras|CR|26|ST|67
12|Kenan Pirić|BA|32|GK|68
34|Antonijs Černomordijs|LV|29|CB|66
18|Salah-Eddine Oulad M'Hand|NL|22|CM|65
6|Coli Saco|ML|24|DM|66
10|Reginaldo Ramires|BR|25|ST|63
19|Mohamed Badamosi|GM|27|RW|65
17|Andrés Salazar|CO|23|CB|63
25|Abdulrahman Taiwo|NG|28|LW|63
15|Samuel Pedro|PT|25|RW|63
7|Raki Aouani|TN|21|AM|61
1|Krišjānis Zviedris|LV|29|GK|61
13|Raivis Jurkovskis|LV|29|CB|60
99|Caio Ferreira|BR|25|ST|59
23|Maksims Toņiševs|LV|26|CB|60
3|Abner|BR|22|LB|76
14|Renārs Varslavāns|LV|24|CM|56
33|Paulo Eduardo|BR|24|LB|55
28|Emmanuel Maviram|NG|25|CB|56
27|Emīls Birka|LV|26|RB|54
31|Athanasios Papadoudis|GR|22|GK|52
5|Karl Wassom|CM|25|LB|52
8|Iago Siqueira|BR|25|DM|53
21|Baba Musah|GH|25|CB|52
22|Meissa Diop|SN|25|AM|50
29|Eriks Maurs-Boks|LV|25|RB|50
40|Ahmed Ankrah|GH|25|CM|49
44|Mārcis Kazainis|LV|25|GK|45
91|Frenks Orols|LV|25|GK|45
` },
  "haj": { coach: "Gonzalo García", capacity: 33987, players: `
18|Leander Dendoncker|BE|31|CM|76
10|Marko Livaja|HR|32|ST|74
77|Carlos Martín|ES|24|ST|73|K:Atlético Madrid
6|Dennis Hadžikadunić|BA|28|CB|74
1|Ivica Ivušić|HR|31|GK|73
11|Michele Šego|HR|26|RW|72
23|Marin Šotiček|HR|22|LW|72|K:Basel
20|Alberto del Moral|ES|26|CM|71
4|Adrion Pajaziti|AL|23|DM|69
8|Khalil Fayad|FR|22|AM|70
5|Alec Van Hoorenbeeck|BE|27|CB|69
7|Abdoulie Sanyang|GM|27|ST|68
9|Dalisson de Almeida|BR|26|CM|67|K:Córdoba
17|Dario Melnjak|HR|33|RB|66
22|Mathieu Acapandié|MG|21|CB|65
15|Dario Marešić|AT|26|CB|65
32|Šimun Hrgović|HR|22|LB|64
28|Roko Brajković|HR|21|DM|64
14|Ron Raçi|XK|23|CB|63
19|Etnik Brruti|AL|22|AM|64
33|Toni Silić|HR|22|GK|62
38|Luka Hodak|HR|20|RB|62
26|Adam Huram|UA|17|CM|61
44|Dante Stipica|HR|35|GK|55
39|Illia Kutia|UA|18|DM|58
99|Davyd Fesyuk|UA|21|GK|56
36|Marino Skelin|HR|19|LB|56
16|Anđelo Šutalo|HR|25|AM|55
` },
  "jab": { coach: "Luboš Kozel", capacity: 5690, players: `
36|Garang Kuol|AU|21|CM|71
23|Eduard Sobol|UA|31|RB|71
17|Saidou Alioum|CM|23|CM|70
7|Vakhtang Chanturishvili|GE|33|DM|69
44|Lamin Jawo|GM|31|ST|69
16|Hugo Ahl|SE|25|AM|69
9|Antonín Růsek|CZ|27|ST|69
57|Filip Novák|CZ|36|CB|65
4|Nemanja Tekijaški|RS|29|CB|67
24|Dominik Hollý|SK|22|CM|67
25|Sebastian Nebyla|SK|24|DM|66
19|Jan Chramosta|CZ|35|RW|64
14|Daniel Souček|CZ|28|CB|66
18|Martin Cedidla|CZ|24|CB|64
13|Richard Sedláček|CZ|27|AM|64
10|Jan Suchan|CZ|30|CM|62
90|Nassim Innocenti|FR|24|LB|61
27|Filip Vecheta|CZ|23|LW|61|K:Pardubice
8|Filip Zorvan|CZ|30|DM|62
33|Michal Kukučka|SK|24|GK|58|K:Nürnberg
21|Matěj Polidar|CZ|26|AM|59
1|Jan Hanuš|CZ|38|GK|52
11|Kevin-Prince Milla|CM|25|ST|58|K:Sparta Prag
6|Nelson Okeke|NG|25|CM|57
12|David Nykrín|CZ|25|CB|55
15|Dušan Pavlović|RS|25|RB|54
20|Jiří Sláma|CZ|25|LB|54
22|Roman Horák|CZ|25|DM|52
26|Kryštof Karban|CZ|25|CB|52
50|Daniel Kvítek|CZ|25|GK|49
99|Klemen Mihelak|SI|25|GK|47
` },
  "fcn": { coach: "Jens Fønsskov Olsen", capacity: 9200, players: `
25|Victor Nelsson|DK|27|CB|74
9|Ola Solbakken|NO|27|ST|73
14|Ibrahim Adel|EG|25|ST|72
10|Prince Amoako Junior|GH|19|RW|67
11|Alexander Lind|DK|24|LW|71
5|Juho Lähteenmäki|FI|20|CB|70
18|Justin Janssen|DK|20|CM|70
2|Peter Ankersen|DK|35|RB|67
23|Runar Norheim|NO|21|CB|68
16|Jakob Busk|DK|32|GK|68
8|Nicklas Røjkjær|DK|28|CM|69
4|Noah Markmann|DK|19|LB|67
3|Tobias Salquist|DK|31|CB|65
28|Markus Walker|DK|19|CB|65
22|Carljohan Eriksson|FI|31|GK|64
29|Villum Berthelsen|DK|20|ST|65
37|Lamine Sadio|SN|18|DM|64
13|Andreas Hansen|DK|30|GK|63
6|Mark Brink|DK|28|AM|63
40|Hjalte Boe|DK|18|RW|63
33|Souleymane Alio|BF|25|LW|60
15|Stephen Acquah|GH|20|RB|60
47|Malte Heyde|DK|19|CM|60
31|Andreas Søndenbroe|DK|25|GK|57
32|Victor Gustafsen|DK|25|LB|57
35|Villads Rutkjær|DK|25|CB|57
42|Matej Tuka|SE|25|RB|56
43|Mouekeinga Kone|CI|25|ST|55
49|William Faber|DK|25|RW|53
` },
  "agf": { coach: "Jakob Poulsen", capacity: 11500, players: `
18|Callum McCowatt|NZ|27|CM|74
25|Colin Rösler|NO|26|CB|73
28|James Bogere|UG|18|ST|64
17|Kevin Yakob|IQ|25|CM|70
10|Kristian Arnstad|NO|22|DM|70
23|Mikael Anderson|IS|28|AM|69
7|Markus Solbakken|NO|26|CM|71
11|Gift Links|ZA|27|DM|68
16|Jens Jønsson|DK|33|AM|68
19|Eric Kahl|SE|24|CB|68
3|Daníel Leó Grétarsson|IS|30|CB|67
13|Janni Serra|DE|28|ST|67
21|Mads Hedenstad Christiansen|NO|25|GK|65
31|Tobias Bech|DK|24|RW|66
8|Sebastian Jørgensen|DK|26|LW|64
4|Magnus Knudsen|NO|25|CM|65
29|Rasmus Carstensen|DK|25|DM|63
39|Frederik Emmery|DK|19|ST|63
20|Tómas Kristjánsson|IS|18|AM|62
5|Frederik Tingager|DK|33|CB|61
6|Nicolai Poulsen|DK|32|CM|59
26|Jacob Andersen|DK|22|RB|59
27|Stefen Tchamche|DK|20|RW|58
14|Tobias Mølgaard|DK|30|LB|57
33|Luka Callø|DK|20|CB|57
1|Jesper Hansen|DK|41|GK|48
22|Oskar Haugstrup|DK|19|DM|54
` },
  "ice": { coach: "Felip Ortiz", capacity: null, players: `
24|Maurizio Pochettino|ES|25|ST|62
7|Juan Cámara|ES|32|CM|61
31|Klebinho|BR|28|CB|59
17|Dacu|AD|25|CB|60
1|Adrià Muñoz|ES|32|GK|58
14|Antonio Otegui|ES|28|DM|57
13|Javi Díaz|ES|29|GK|57
9|Kaxe|ES|32|ST|58
-|José García|ES|29|RW|55
33|Martín Calderón|ES|27|CM|55
22|Joseba Muguruza|ES|32|RB|56
2|Anwar Hernández|MX|25|CB|53
3|Jilmar Torres|CO|25|CB|53
4|Álex Sánchez|ES|25|LB|53
5|Jaouad Erraji|MA|25|CB|53
6|Víctor Alonso|ES|25|AM|51
8|David López|ES|25|CM|52
10|Ángel de la Torre|ES|25|LW|52
11|Alejandro Gómez|ES|25|ST|50
18|Predrag Muñoz|ES|25|RW|49
19|Pablo Molina|ES|25|DM|48
20|Arnau Sans|ES|25|AM|47
30|Diego Messoussi|ES|25|LW|47
55|Guillermo Torres|ES|25|RB|45
70|Borja Arellano|ES|25|ST|44
99|Faysal Chouaib|ES|25|RW|44
` },
  "thu": { coach: "Gian-Luca Privitelli", capacity: 10000, players: `
14|Mattias Käit|EE|28|CM|72
23|Marco Bürki|CH|33|CB|71
96|Brighton Labeau|MQ|30|ST|70
70|Nils Reichmuth|CL|24|CM|70
20|Riccardo Braschi|IT|19|ST|64
15|Patrik Kristal|EE|18|DM|62|K:Köln
9|Furkan Dursun|AT|21|RW|68
18|Tom Strannegård|SE|24|AM|66
5|Nicolas Bürgy|CH|31|CB|65
4|Genís Montolio|ES|30|CB|66
1|Niklas Steffen|CH|25|GK|64
19|Jan Bamert|CH|28|CB|64
47|Fabio Fehr|CH|26|RB|64
2|Olivier Mambwa|CH|17|LB|59|K:Young Boys
33|Marc Gutbub|CH|23|LW|62
30|Nico Maier|CH|26|CM|61
13|Nassim Zoukit|CH|25|DM|61
17|Ashvin Balaruban|CH|25|CB|60
16|Justin Roth|CH|25|AM|59
21|Dorian Derbaci|CH|20|CM|58
25|Tim Spycher|CH|22|GK|56
37|Lucien Dähler|CH|25|RB|57
8|Fabio Saiz|CH|25|DM|56
26|Noah Christoffersson|SE|25|ST|54
22|Dario Wälti|CH|25|GK|53
24|Mats Seiler|CH|25|LB|54
34|Leo Stucki|CH|25|GK|50
52|Adam Ilić|CH|25|AM|52
54|Louis Passavant|CH|25|CB|51
80|Simon Lengen|CH|25|RW|49
` },
  "csk": { coach: "Daniel Morales", capacity: 43230, players: `
8|Stefano Sensi|IT|31|CM|74
5|Jean-Philippe Gbamin|CI|30|CB|74
6|Bruno Jordão|PT|27|CM|72
28|Ioannis Pittas|CY|30|ST|72
7|Max Ebong|BY|26|AM|72
99|James Eto'o|CM|25|CM|70
67|Cătălin Itu|RO|26|DM|69
10|Joël Zwarts|NL|27|ST|68
9|Santiago Godoy|AR|25|RW|68
21|Fyodor Lapoukhov|BY|23|GK|67
4|Dinis Almeida|PT|31|CB|67
37|Barry Cotter|IE|27|CB|66
11|Mohamed Brahimi|FR|27|AM|65
25|Dimitar Evtimov|BG|32|GK|63
17|Ángelo Martino|AR|28|CB|65
32|Facundo Rodríguez|AR|26|RB|65|K:Estudiantes
2|Pastor|BR|26|LB|64
38|Léo Pereira|BR|26|LW|63
3|Tamimou Ouorou|BJ|23|CB|63|K:Botev Vratsa
14|Teodor Ivanov|BG|22|RB|61
94|Isaac Solet|CF|25|DM|60
30|Petko Panayotov|BG|21|CM|59
80|Georgi Chorbadzhiyski|BG|21|DM|59
91|Aleks Tunchev|BG|17|LB|59
19|Andrey Yordanov|BG|24|CB|57
34|Vasil Kaymakanov|BG|19|ST|56
31|Daniel Nikolov|BG|20|GK|53
` },
  "kza": { coach: "Željko Sopić", capacity: 15026, players: `
20|Anthony Kalik|AU|28|CM|67
11|Fedor Černych|LT|35|ST|65
14|Vykintas Slivka|LT|31|CM|66
27|Gabriel Debeljuh|HR|29|ST|65
17|Ivan Fiolić|HR|30|DM|64
19|Renan Oliveira|BR|29|RW|63
7|Amine Benchaib|BE|28|AM|63
9|Leon Kreković|HR|26|LW|63
55|Tomas Švedkauskas|LT|32|GK|62
8|Yukiyoshi Karashima|JP|29|CM|62
4|Luka Racic|DK|27|CB|60
62|Lirim Kastrati|XK|27|CB|60
32|Franco Baldassarra|AR|27|DM|60
10|Gratas Sirgėdas|LT|31|AM|60
45|Joris Moutachy|MQ|28|CB|58
37|Nosa Edokpolor|AT|29|CB|57
70|Fabien Ourega|FR|33|CM|58
99|Haris Kadrić|SI|26|ST|57
3|Anton Tolordava|GE|30|RB|54
23|Aldayr Hernández|CO|31|LB|53
32|Marko Konatar|RS|26|CB|53
77|Rokas Lekiatas|LT|27|RB|54
1|Joris Aliukonis|LT|25|GK|50
2|Tautvydas Burdzilauskas|LT|25|LB|51
15|Léo Ribeiro|BR|25|DM|51
22|Deividas Mikelionis|LT|25|GK|48
24|Motiejus Burba|LT|25|RW|48
66|Eduardas Jurjonas|LT|25|CB|47
` },
  "mja": { coach: "Andreas Brännström", capacity: 6750, players: `
5|Abdullah Iqbal|PK|24|CB|70
10|Jeppe Kjær|DK|22|RW|68
18|Jacob Bergström|SE|31|ST|68
23|Áki Samuelsen|FO|22|ST|67
9|Ali Youssef|TN|26|LW|66|K:Apollon Limassol
26|Ian Hoffmann|US|24|CB|66|K:Lech Poznań
3|Martin Agnarsson|FO|22|RB|67
33|Tony Miettinen|FI|23|CB|66
11|Timo Stavitski|FI|27|ST|66
6|Mads Enggård|DK|22|CM|65
4|Axel Norén|SE|27|LB|63
22|Jesper Gustavsson|SE|31|CM|62
2|Ludvig Svanberg|SE|23|CB|62
39|Romeo Leandersson|SE|18|DM|60
7|Viktor Gustafson|SE|31|AM|62
24|Tom Pettersson|SE|36|CB|58
35|Alexander Lundin|SE|33|GK|58
1|Sebastian Hansen|NO|25|GK|59
8|Teo Helge|SE|25|CM|58
13|Robin Wallinder|SE|25|GK|57
14|Villiam Granath|SE|25|DM|56
19|Paul Colley|GM|25|RW|57
20|Måns Isaksson|SE|25|AM|56
21|Villum Dalsgaard|DK|25|LW|53
25|Max Nielsen|DK|25|CM|54
27|Ludvig Tidstrand|SE|25|DM|52
29|Olle Lindberg|SE|25|AM|52
31|Dani Hodžić|SE|25|RB|50
` },
  "ibe": { coach: "Andriy Demchenko", capacity: 27223, players: `
11|Andria Bartishvili|GE|17|ST|55|K:Kolkheti
14|Ibrahim Alhassan|NG|29|CM|67
4|Vahid Selimovic|LU|29|CB|66
23|Eldar Kuliyev|UA|24|CM|65
31|Giorgi Makaridze|GE|36|GK|61
22|Sebastián Figueredo|UY|24|CB|65|K:CD Leganes
24|Vakho Bedoshvili|GE|22|ST|63|K:Pari Nizhny Novgorod
8|Bakar Kardava|GE|31|DM|64
3|Phillip Cancar|AU|25|CB|64
18|Lucas Café|BR|25|AM|63
1|Tornike Megrelishvili|GE|25|GK|61
5|Giorgi Jinjolava|GE|25|CB|60
6|Nikoloz Dadiani|GE|25|CM|61
7|Daniel Kvartskhava|GE|25|RW|59
9|Amiran Dzagania|GE|25|LW|58
10|Zviad Natchkebia|GE|25|ST|59
15|Luka Mamulashvili|GE|25|RB|57
16|Revaz Kurtanidze|GE|25|GK|54
17|Stephen Ende|NG|25|RW|55
19|Nika Sikharulashvili|GE|25|DM|54
20|Saba Marsagishvili|GE|25|AM|54
25|Aleksandre Amisulashvili|GE|25|LB|53
27|Giorgi Kutsia|GE|25|CM|53|K:Veres Rivne
29|Lado Chikhradze|GE|25|LW|52
30|Nikoloz Bochorishvili|GE|25|CB|52
32|Davit Gogilashvili|GE|25|ST|50
33|Jean-Marc Tiboue|FR|25|RB|48
35|Saba Avdoevi|GE|25|DM|49
39|Giorgi Chanturia|GE|25|LB|47
40|Giorgi Kobuladze|GE|25|CB|46
` },
  "egn": { coach: "Nevil Dede", capacity: 5000, players: `
10|Alessandro Albanese|BE|26|ST|66
7|Fernando Medeiros|BR|30|CM|65
22|Guillem Jaime|ES|27|CB|64
20|Karim Loukili|MA|29|ST|62
99|Jurguens Montenegro|CR|25|RW|63
17|Altin Kryeziu|XK|24|CM|61
6|Albano Aleksi|AL|33|DM|61
77|Ildi Gruda|AL|26|LW|61
33|Eneo Bitri|AL|29|CB|62
98|Mario Dajsinani|AL|27|GK|59
16|Edison Ndreca|AL|32|RB|59
9|Soumaila Bakayoko|CI|24|ST|57
28|Eljon Sota|AL|28|CB|58
1|Levan Tandilashvili|GE|23|GK|56
55|Geralb Smajli|AL|24|CB|56
27|Ledio Beqja|AL|25|AM|56
12|Bruno Puja|AL|26|GK|54
4|Zamiq Əliyev|AZ|25|LB|54
2|Daniel Adjessa|CM|25|RW|55
13|Alessandro Kacbufi|AL|25|CB|52
19|Deivid Hoxha|AL|25|LW|51|K:Panetolikos
23|Bjorni Duka|AL|25|CM|50
24|Numan Ajeti|MK|25|RB|50
29|Andrey Yago|BR|25|LB|50
30|Reis Bakalli|AL|25|DM|49
35|Zyber Çullhaj|AL|25|AM|46
` },
  "itu": { coach: "Vesa Vasara", capacity: 9372, players: `
-|Robert Ivanov|FI|31|CB|69
9|Jasse Tuominen|FI|30|ST|69
10|Alie Conteh|SL|21|ST|66|K:Strømsgodset
11|Jean Botué|BF|24|RW|67
16|Clinton Jephta|NG|19|LW|62
30|Yeboah Amankwah|GH|25|CB|67
7|Herman Sjögrell|SE|25|ST|64
4|Prosper Ahiabu|GH|27|CM|64
23|Loic Essomba|CM|22|RW|65
2|Jussi Niska|FI|23|CB|64
18|Seth Saarinen|FI|25|CB|61
24|Julius Tauriainen|FI|25|RB|63
3|Juuso Hämäläinen|FI|32|LB|60
5|Albin Granlund|FI|36|RB|58
1|Eetu Huuhtanen|FI|23|GK|58
14|Janne-Pekka Laine|FI|25|CM|60
17|Bismark Ampofo|GH|24|DM|59
28|Lauri Laine|FI|21|AM|58|K:Baník Ostrava
8|Johannes Yli-Kokko|FI|24|CM|56
19|Iiro Järvinen|FI|29|DM|56
22|Luka Kuittinen|FI|23|CB|54
20|Axel Sandler|FI|19|LB|55
35|Eeli Kiiskilä|FI|18|AM|54
36|Ville Seppä|FI|30|GK|52
-|Muhammed Suso|GM|20|LW|51|K:Pardubice
27|Vincent Ulundu|FI|21|CM|52
12|Eero Vuorjoki|FI|20|GK|47
26|Vilho Huovila|FI|20|ST|49
-|Lukáš Prokop|SK|25|RW|47|K:Žilina
13|Alex Hilden|FI|25|GK|45
` },
  "che": { coach: "Xabi Alonso", capacity: 40044, players: `
1|Emiliano Martínez|AR|33|GK|85
17|Morgan Rogers|EN|24|AM|84
4|Valentín Barco|AR|22|LB|77
10|Cole Palmer|EN|24|AM|86
18|Danny Welbeck|EN|35|ST|76
9|João Pedro|BR|24|ST|83
5|Maxence Lacroix|FR|26|CB|81
14|Jordan Henderson|EN|36|CM|76
24|Reece James|EN|26|RB|84
7|Pedro Neto|PT|26|RW|83
27|Malo Gusto|FR|23|RB|81
2|Marco Palestra|IT|21|RB|76|85
25|Moisés Caicedo|EC|24|DM|88
41|Estêvão|BR|19|RW|83|90
45|Roméo Lavia|BE|22|DM|80
29|Pep Chavarría|ES|28|LB|76
39|Mike Penders|BE|21|GK|72|84
3|Wesley Fofana|FR|25|CB|80
11|Jamie Gittens|EN|22|LW|79
22|Emmanuel Emegha|NL|23|RW|73
23|Geovany Quenda|PT|19|RW|79|88
21|Jorrel Hato|NL|20|LB|78|86
6|Levi Colwill|EN|23|CB|83
34|Josh Acheampong|EN|20|LB|70
30|Aarón Anselmino|AR|21|CB|68
44|Gabriel Slonina|US|22|GK|68
28|Teddy Sharman-Lowe|EN|23|GK|65
32|Mahdi Nicoll-Jazuli|EN|16|CM|66
31|Reggie Watson|EN|16|CM|64
37|Olutayo Subuloye|EN|25|RB|63
` },
  "tot": { coach: "Roberto De Zerbi", capacity: 62850, players: `
27|Mykhailo Mudryk|UA|25|LW|76|K:Chelsea
22|Omar Marmoush|EG|27|ST|82|K:Manchester City
23|Pedro Porro|ES|26|RB|83
9|Richarlison|BR|29|ST|78
16|Sandro Tonali|IT|26|DM|85
3|Andy Robertson|SC|32|LB|80
4|Tosin Adarabioyo|EN|28|CB|77
5|Marcos Senesi|AR|29|CB|80
7|Xavi Simons|NL|23|AM|83
18|Mateus Fernandes|PT|22|CM|79
10|James Maddison|EN|29|AM|81
19|Dominic Solanke|EN|28|ST|80
8|Conor Gallagher|EN|26|CM|80
15|Lucas Bergvall|SE|20|CM|79|87
17|Sávio|BR|22|RW|83
6|Jan Paul van Hecke|NL|26|CB|80
37|Micky van de Ven|NL|25|CB|84
11|Mathys Tel|FR|21|LW|76|85
21|Dejan Kulusevski|SE|26|RW|82
14|Archie Gray|EN|20|CM|76|86
20|Mohammed Kudus|GH|26|RW|83
30|Rodrigo Bentancur|UY|29|CM|79
33|Ben Davies|WL|33|RB|71
31|Antonín Kinský|CZ|23|GK|77|84
13|Destiny Udogie|IT|23|LB|80
39|Martin Dúbravka|SK|37|GK|61
28|Wilson Odobert|FR|21|LW|76
40|Brandon Austin|US|27|GK|63
` },
  "new": { coach: "Matthias Jaissle", capacity: 52729, players: `
6|Nico González|ES|24|DM|82
20|Matias Fernandez-Pardo|BE|21|ST|76|84
19|Anthony Elanga|SE|24|RW|80
37|Amar Dedić|BA|23|RB|80
9|Yoane Wissa|CD|29|ST|81
3|Lewis Hall|EN|21|LB|81|86
33|Dan Burn|EN|34|CB|78
21|Lukáš Horníček|CZ|24|GK|76
11|Harvey Barnes|EN|28|LW|79
17|Bazoumana Touré|CI|20|LW|74
28|Joe Willock|EN|26|CM|77
1|Nick Pope|EN|34|GK|81
7|Joelinton|BR|29|CM|81
8|Aladji Bamba|FR|20|CM|70
10|William Osula|DK|23|ST|75
12|Malick Thiaw|DE|25|CB|81
2|Tino Livramento|EN|23|RB|81
14|Sean Steur|NL|18|AM|68|82
41|Jacob Ramsey|EN|25|CM|78
67|Lewis Miley|EN|20|CM|76|85
23|Jacob Murphy|EN|31|RW|79
4|Sven Botman|NL|26|CB|81
5|Fabian Schär|CH|34|CB|79
24|Ewen Jaouen|FR|20|GK|67
29|Mark Gillespie|EN|34|GK|66
` },
  "whu": { coach: "Nuno Espírito Santo", capacity: 62500, players: `
20|Jarrod Bowen|EN|29|RW|82
10|Manor Solomon|IL|27|LW|76
4|Edson Álvarez|MX|28|DM|79
9|Joël Piroe|SR|27|ST|77|K:Leeds United
7|Arne Engels|BE|22|CM|76
11|Taty Castellanos|AR|27|ST|78
34|Joël Veltman|NL|34|RB|74
23|Alphonse Areola|FR|33|GK|78
28|Tomáš Souček|CZ|31|CM|79
15|Konstantinos Mavropanos|GR|28|CB|77
22|Maxwel Cornet|CI|29|LW|72
14|Divine Mukasa|EN|18|CM|72|K:Manchester City
2|Kyle Walker-Peters|EN|29|RB|77
5|Morato|BR|25|CB|75|K:Nottingham Forest
3|Maximilian Kilman|EN|29|CB|78
1|Mads Hermansen|DK|26|GK|78
18|Adama Boiro|ES|24|LB|70|K:Athletic Bilbao
35|Edvin Austbø|NO|21|RW|70
19|Pablo|BR|22|LW|70
27|Soungoutou Magassa|FR|22|DM|76
17|Mohamadou Kanté|FR|20|AM|69
30|Oliver Scarles|EN|20|CB|67
21|Keiber Lamadrid|VE|22|LW|67
61|Lewis Orford|EN|20|CM|66
58|Airidas Golambeckis|EN|18|RB|64
63|Ezra Mayers|EN|19|LB|63
66|Joshua Ajala|EN|19|ST|62
49|Finlay Herrick|EN|20|GK|60
` },
  "eve": { coach: "David Moyes", capacity: 52769, players: `
10|Jack Grealish|EN|30|LW|81|K:Manchester City
1|Jordan Pickford|EN|32|GK|84
2|Ainsley Maitland-Niles|EN|28|RB|73
22|Brennan Johnson|WL|25|RW|80
23|Christian Nørgaard|DK|32|DM|79
19|Tyrique George|EN|20|LW|74
11|Thierno Barry|FR|23|ST|77
8|Kiernan Dewsbury-Hall|EN|27|CM|79
6|James Tarkowski|EN|33|CB|80
37|James Garner|EN|25|CM|80
5|Michael Keane|EN|33|CB|77
4|Jarrad Branthwaite|EN|24|CB|80|85
30|Hayden Hackney|EN|24|CM|76
16|Vitalii Mykolenko|UA|27|LB|78
20|Tyler Dibling|EN|20|RW|74|84
45|Harrison Armstrong|EN|19|CM|72|82
24|Charly Alcaraz|AR|23|AM|76
15|Jake O'Brien|IE|25|CB|78
34|Merlin Röhl|DE|24|CM|74
12|Mark Travers|IE|27|GK|66
31|Tom King|WL|31|GK|67
` },
  "ful": { coach: "Álvaro Arbeloa", capacity: 28107, players: `
7|Gonzalo García|ES|22|ST|77|85
17|Alex Iwobi|NG|30|RW|79
14|Oscar Bobb|NO|23|RW|76
16|Sander Berge|NO|28|DM|80
32|Emile Smith Rowe|EN|26|AM|78
30|Ryan Sessegnon|EN|26|LB|76
24|Josh King|EN|19|CM|72|82
33|Antonee Robinson|US|29|LB|80
8|César Palacios|ES|21|CM|70
19|Shea Charles|NX|22|DM|74
2|Kenny Tete|NL|30|RB|77
15|Hugo Larsson|SE|22|CM|78|85|K:Eintracht Frankfurt
3|Calvin Bassey|NG|26|CB|79
1|Bernd Leno|DE|34|GK|81
21|Timothy Castagne|BE|30|RB|76
18|Jonah Kusi-Asare|SE|19|ST|70|80
22|David Affengruber|AT|25|CB|74
5|Joachim Andersen|DK|30|CB|79
11|Kevin|BR|23|LW|74
4|Jorge Cuenca|ES|26|CB|69
6|Harrison Reed|EN|31|CM|68
9|Rodrigo Muniz|BR|25|ST|78
20|Manuel Ángel|ES|22|DM|65
10|Tom Cairney|SC|35|CM|74
36|Alex Borto|US|25|GK|62
23|Benjamin Lecomte|FR|35|GK|59
` },
  "nfo": { coach: "Oliver Glasner", capacity: 31212, players: `
19|Liam Delap|EN|23|ST|78|85
2|Ousmane Diomande|CI|22|CB|83|87
10|Morgan Gibbs-White|EN|26|AM|83
27|Daniel Muñoz|CO|30|RB|82
3|Neco Williams|WL|25|LB|79
21|Xaver Schlager|AT|28|CM|80
24|James McAtee|EN|23|AM|77
9|Chris Wood|NZ|34|ST|78
7|Callum Hudson-Odoi|EN|25|LW|79
14|Dan Ndoye|CH|25|RW|80
6|Ibrahim Sangaré|CI|28|DM|78
34|Ola Aina|NG|29|RB|79
11|Igor Jesus|BR|25|ST|77
31|Nikola Milenković|RS|28|CB|82
15|Arnaud Kalimuendo|FR|24|ST|78
5|Murillo|BR|24|CB|81
8|Nicolás Domínguez|AR|28|CM|78
22|Ryan Yates|EN|28|DM|76
26|Matz Sels|BE|34|GK|81
23|Jair Cunha|BR|21|CB|68
25|Luca Netz|DE|23|RB|69
33|Steven Benda|DE|27|GK|65
37|Nicolò Savona|IT|23|RB|76
-|Grady McDonnell|IE|18|AM|66
12|John Victor|BR|30|GK|77
-|Matthew Orr|NX|19|CB|63
-|Jimmy Sinclair|EN|19|CM|62
-|Aaron Bott|EN|25|GK|61
-|Luke Campbell|EN|25|GK|60
-|George Murray-Jones|EN|25|GK|57
-|Keehan Willows|EN|25|GK|57
-|Ethan Broomes|EN|25|RB|57
-|Kristian Clarke|ZW|25|LB|56
-|David Modupe|EN|25|CB|55
` },
  "bur": { coach: "Nicky Hayen", capacity: 21944, players: `
9|Jamie Vardy|EN|39|ST|73
2|Kyle Walker|EN|36|RB|75
12|Dastan Satpayev|KZ|17|ST|66|K:Chelsea
27|Armando Broja|AL|24|RW|76
5|Reo Hatate|JP|28|CM|78
28|Hannibal Mejbri|TN|23|CM|74
15|Anel Ahmedhodžić|BA|27|CB|74
19|Largie Ramazani|BE|25|LW|75|K:Leeds United
10|Marcus Edwards|EN|27|ST|74
3|Max Alleyne|EN|21|CB|74|K:Manchester City
44|Igor Julio|BR|28|CB|77
21|Aaron Ramsey|EN|23|AM|71
11|Zeki Amdouni|CH|25|RW|71
7|Jacob Bruun Larsen|DK|27|LW|69
14|Connor Roberts|WL|30|CB|68
45|Michael Obafemi|IE|26|ST|69
13|Ben Amos|EN|36|GK|65
24|Josh Cullen|IE|30|DM|68
22|Oliver Sonne|PE|25|LB|66
35|Ashley Barnes|EN|36|RW|64
18|Hjalmar Ekdal|SE|27|CB|64
6|Bashir Humphreys|EN|23|RB|65
20|Shurandy Sambo|CW|24|LB|62
31|Mike Trésor|BE|27|CM|62
8|Ugo Raghouber|FR|23|DM|60
17|Andréas Hountondji|BJ|24|LW|61
1|Max Weiß|DE|22|GK|58
29|Josh Laurent|EN|31|AM|59
37|Grégoire Coudert|FR|27|GK|56
34|Jaydon Banel|NL|21|ST|55
23|Lucas Pires|BR|25|RB|56
48|Enock Agyei|BE|21|RW|54
30|Lluc Castell|ES|18|LW|53
` },
  "mid": { coach: "Kim Hellberg", capacity: 33746, players: `
7|Will Lankshear|EN|21|ST|75
6|Sebastian Berhalter|US|25|CM|76
1|Radek Vítek|CZ|22|GK|75
17|Max Arfsten|US|25|CB|74
3|Sam Byram|EN|32|CB|73
16|Jeremy Sarmiento|EC|24|CM|74
21|Rokas Pukštas|US|21|DM|71
4|Ashley Phillips|EN|21|CB|72
11|Amario Cozier-Duberry|EN|21|ST|70|K:Brighton
10|Aidan Morris|US|24|AM|70
12|Luke Ayling|EN|34|CB|70
5|Alfie Jones|CA|28|RB|70
13|David Strelec|SK|25|RW|69
8|Riley McGree|AU|27|CM|68
9|Tommy Conway|SC|24|LW|67
19|Leo Castledine|EN|20|DM|66
18|Connor Barron|SC|23|AM|66|K:Rangers
14|Myles Peart-Harris|EN|23|CM|65
22|Kyle Joseph|SC|24|ST|66
30|Neto Borges|BR|29|LB|63
-|Micah Hamilton|EN|22|DM|62
29|Adilson Malanda|FR|24|CB|63
2|Callum Brittain|EN|28|RB|62
25|George Edmundson|EN|28|LB|61
24|Alex Bangura|SL|27|CB|60
31|Sol Brynn|EN|25|GK|57
33|Jon McLaughlin|SC|38|GK|52
44|Cruz Ibeh|EN|17|AM|57
28|Law McCabe|EN|20|CM|56
` },
  "sev": { coach: "Luis García Plaza", capacity: 42714, players: `
9|Robbie Ure|SC|22|ST|70
11|Rubén Vargas|CH|28|LW|78
1|Odysseas Vlachodimos|GR|32|GK|77|K:Newcastle United
24|Youssouf Fofana|FR|27|CM|79|K:Milan
8|Giorgi Kochorashvili|GE|27|CM|76
17|Gabriel Suazo|CL|29|LB|76
19|Lucas Stassin|BE|21|ST|76|84|K:Saint-Étienne
13|Fran González|ES|21|GK|70
21|Chidera Ejuke|NG|28|RW|77
23|Marcão|BR|30|CB|78
6|Lucien Agoumé|FR|24|DM|78
18|Jon Guridi|ES|31|CM|75
16|Isaac Romero|ES|26|ST|76
12|Arouna Sangante|SN|24|CB|74
20|Félix Correia|PT|25|RW|74|K:Lille
4|Kike Salas|ES|24|CB|77
2|Juan Iglesias|ES|28|RB|76
3|Julio Díaz|ES|21|LB|70
22|José Ángel Carmona|ES|24|RB|77
30|Miguel Sierra|ES|22|LW|67
10|Peque Fernández|ES|23|CM|68
27|Nico Guillén|ES|18|DM|67
5|Andrés Castrín|ES|23|RB|66
7|Alfon González|ES|27|ST|65
14|Manu Bueno|ES|22|AM|63
33|Rafa Romero|ES|25|GK|60
` },
  "val": { coach: "Óscar Sánchez", capacity: 49430, players: `
10|Harvey Elliott|EN|23|AM|80|K:Liverpool
14|José Gayà|ES|31|LB|78
7|Arnaut Danjuma|NL|29|LW|77
2|Guido Rodríguez|AR|32|DM|78
24|Pablo Maffeo|AR|29|RB|76|K:Olympiakos
6|Umar Sadiq|NG|29|ST|75
25|Kayne van Oevelen|NL|23|GK|70|K:Ipswich Town
39|Ryūnosuke Satō|JP|19|CM|73
1|Stole Dimitrievski|MK|32|GK|79
8|Javi Guerra|ES|23|CM|79|85
15|Aliou Dieng|ML|28|CM|72
22|Arnau Martínez|ES|23|RB|76
4|Mouctar Diakhaby|GN|29|CB|77
9|Hugo Duro|ES|26|ST|78
16|Diego López|ES|24|RW|77
18|Pepelu|ES|27|DM|77
12|Justin de Haas|NL|26|CB|70
20|Dimitri Foulquier|GP|33|RB|73
23|Filip Ugrinić|CH|27|AM|76
5|César Tárrega|ES|24|CB|78|84
21|Jesús Vázquez|ES|23|LB|74
19|Dani Raba|ES|30|ST|67
11|Luis Rioja|ES|32|RW|76
3|José Copete|ES|26|LB|64
13|Cristian Rivero|ES|28|GK|62
` },
  "ath": { coach: "Edin Terzić", capacity: 53289, players: `
10|Nico Williams|ES|24|LW|84
1|Unai Simón|ES|29|GK|84
14|Aymeric Laporte|ES|32|CB|81
9|Iñaki Williams|GH|32|RW|80
8|Oihan Sancet|ES|26|AM|82
3|Dani Vivian|ES|27|CB|81
13|Álex Padilla|MX|22|GK|72
25|Álvaro Djaló|GW|26|LW|74
31|Johaneko Louis-Jean|FR|22|RB|70
21|Maroan Sannadi|MA|25|ST|74
11|Gorka Guruzeta|ES|29|ST|78
5|Yeray Álvarez|ES|31|CB|79
7|Álex Berenguer|ES|31|RW|78
17|Yuri Berchiche|ES|36|LB|75
4|Aitor Paredes|ES|26|CB|78
23|Robert Navarro|ES|24|RW|76
18|Mikel Jauregizar|ES|22|CM|79|86
22|Nico Serrano|ES|23|LW|72
28|Peio Canales|ES|21|RW|71
12|Jesús Areso|ES|27|RB|77
16|Iñigo Ruiz de Galarreta|ES|33|CM|79
15|Hugo Rincón|ES|23|LB|68
6|Beñat Prados|ES|25|CM|78
24|Beñat Gerenabarrena|ES|23|CM|68
-|Unai Egiluz|ES|24|CB|66
20|Alejandro Rego|ES|23|DM|65
` },
  "cad": { coach: "Albert Celades", capacity: 20724, players: `
16|Antonio Cordero|ES|19|RW|66|K:Newcastle United
12|Giorgi Gocholeishvili|GE|25|CB|73|K:Şahtar Donetsk
5|Marc-Olivier Doué|FR|25|CM|71
25|Gonzalo Petit|UY|19|ST|66|K:Real Betis
10|Javi Ontiveros|ES|28|ST|70
19|Urko Izeta|ES|26|LW|71
13|Jokin Ezkieta|ES|29|GK|70|K:Racing Santander
17|Aïmen Moueffek|MA|25|RB|68|K:Saint-Étienne
1|David Gil|ES|32|GK|69
28|Dilan Zárate|ES|19|CM|66|K:Inter
23|Damián Rodríguez|ES|23|DM|68|K:Celta Vigo
7|Iuri Tabatadze|GE|26|RW|66
6|Manu Fernández|ES|25|CB|66
18|Jandro Orellana|ES|26|AM|66
15|Kenan Toibibou|KM|21|CB|64
14|Bojan Kovačević|RS|22|CB|64
9|Álvaro García Pascual|ES|24|ST|64
4|Javi Castro|ES|25|LB|62
8|Efe Aghama|NG|22|LW|63
11|José Antonio de la Rosa|ES|22|CM|62
21|Vladys Kopotun|UA|25|ST|59
24|Ibon Sánchez|ES|22|DM|58
3|Sergio Arribas|ES|23|CB|60
2|Beñat de Jesús|ES|24|RB|59
22|Cristian Gutiérrez|ES|25|LB|56|K:Las Palmas
20|Borja Vázquez|ES|21|RW|55
27|Juan Díaz|ES|20|CB|54
26|Rubén Domínguez|ES|25|GK|53
` },
  "laz": { coach: "Gennaro Gattuso", capacity: 70634, players: `
15|Romano Floriani Mussolini|IT|23|RB|70
16|Davide Frattesi|IT|26|CM|81|K:Inter
37|Josip Šutalo|HR|26|CB|78|K:Ajax
80|Albert Guðmundsson|IS|29|AM|80|K:Fiorentina
17|Nuno Tavares|PT|26|LB|80
24|Kenneth Taylor|NL|24|CM|78
10|Mattia Zaccagni|IT|31|LW|81
2|Diogo Leite|PT|27|CB|76
9|Andrea Pinamonti|IT|27|ST|76
23|Alfonso Pedraza|ES|30|LB|78
5|Danilho Doekhi|NL|28|CB|77
22|Matteo Cancellieri|IT|24|RW|75
35|Christos Mandas|GR|24|GK|78|84
3|Luca Pellegrini|IT|27|LB|74
6|Nicolò Rovella|IT|24|DM|81
11|Gustav Isaksen|DK|25|RW|78
77|Adam Marušić|ME|33|RB|77
7|Fisayo Dele-Bashiru|NG|25|CM|74
14|Tijjani Noslin|NL|27|ST|76
29|Manuel Lazzari|IT|32|AM|69
4|Patric|ES|33|LB|68
32|Danilo Cataldi|IT|32|CM|69
25|Oliver Provstgaard|DK|23|CB|68
21|Reda Belahyane|MA|22|CM|74
40|Edoardo Motta|IT|21|GK|63
28|Adrian Przyborek|PL|19|AM|65
76|Filipe Bordon|BR|21|RB|63
8|Bruno Galassi|ES|19|CM|61
55|Alessio Furlanetto|IT|24|GK|61
59|Davide Renzetti|IT|25|GK|59
63|Federico Serra|IT|25|ST|60
71|Valerio Farcomeni|IT|25|DM|57
` },
  "fio": { coach: "Paolo Vanoli", capacity: 43147, players: `
30|Franco Mastantuono|AR|18|RW|76|88|K:Real Madrid
43|David de Gea|ES|35|GK|83
23|Beto|GW|28|ST|76
3|Radu Drăgușin|RO|24|CB|78|K:Tottenham
29|Wilfried Gnonto|IT|22|RW|77|K:Leeds United
28|Pedro Gonçalves|PT|28|AM|80|K:Sporting CP
21|Víctor Valdepeñas|ES|19|CB|75
20|Álex Jiménez|ES|21|RB|76|K:Bournemouth
42|Christ Inao Oulaï|CI|20|CM|77
17|João Mário|PT|26|RB|74|K:Juventus
2|Dodô|BR|27|RB|81
44|Nicolò Fagioli|IT|25|CM|79
27|Cher Ndour|IT|22|CM|76
32|Mateo Pellegrino|AR|24|LW|72
5|Marin Pongračić|HR|28|CB|78
14|Arthur Atta|FR|23|CM|71
33|Viery|BR|21|CB|71
6|Luca Ranieri|IT|27|CB|78
25|Alieu Njie|SE|21|ST|71|K:Torino
53|Oliver Christensen|DK|27|GK|74
4|Marco Brescianini|IT|26|DM|69
65|Fabiano Parisi|IT|25|LB|76
19|Luca Lezzerini|IT|31|GK|66
` },
  "bol": { coach: "Domenico Tedesco", capacity: 36532, players: `
9|Artem Dovbyk|UA|29|ST|79|K:Roma
10|Federico Bernardeschi|IT|32|RW|78
19|Lewis Ferguson|SC|26|CM|81
3|Arthur Theate|BE|26|CB|79|K:Eintracht Frankfurt
33|Juan Miranda|ES|26|LB|78
7|Riccardo Orsolini|IT|29|RW|81
14|Torbjørn Heggem|NO|27|CB|77
91|Roberto Piccoli|IT|25|ST|76|K:Fiorentina
6|Nikola Moro|HR|28|CM|77
2|Emil Holm|SE|26|RB|78
4|Tommaso Pobega|IT|27|CM|76
11|Samuel Mbangula|BE|22|LW|74|K:Werder Bremen
23|Rahim Alhassane|NE|24|LB|75
22|Jay Enem|NL|23|ST|74
17|Oussama El Azzouzi|MA|25|DM|74
21|Jens Odgaard|DK|27|AM|78
1|Łukasz Skorupski|PL|35|GK|79
41|Martin Vitík|CZ|23|CB|76
28|Nicolò Cambiaghi|IT|25|LW|77
5|Eivind Helland|NO|21|CB|69
25|Massimo Pessina|IT|18|GK|67
16|Nicolò Casale|IT|28|RB|69
20|Nadir Zortea|IT|27|RB|76
8|Mikel Amondarain|AR|21|CM|65
29|Lorenzo De Silvestri|IT|38|RB|61
77|Ukko Happonen|FI|19|GK|63
` },
  "cag": { coach: "Fabio Pisacane", capacity: 16416, players: `
6|Harry Winks|EN|30|CM|77
70|Daniel Maldini|IT|24|AM|75|K:Atalanta
26|Yerry Mina|CO|31|CB|76
28|Yukinari Sugawara|JP|26|CB|74|K:Southampton
4|Alessandro Romano|IT|20|CM|73|K:Roma
79|Yanis Massolin|FR|23|DM|74|K:Inter
21|Roberto Gagliardini|IT|32|CM|74
18|M'Bala Nzola|AO|29|ST|71
9|Kevin Carlos|ES|25|ST|74|K:Nice
39|Alieu Fadera|GM|24|DM|71|K:Como
19|Yael Trepy|FR|20|RW|71
1|Elia Caprile|IT|24|GK|70
33|Adam Obert|SK|23|CB|69
10|Jacopo Fazzini|IT|23|AM|68|K:Fiorentina
14|Alessandro Deiola|IT|31|CM|68
31|Paul Mendy|SN|19|LW|68
8|Michel Adopo|FR|26|DM|66
12|Alen Sherri|AL|28|GK|63
15|Juan Rodríguez|UY|25|CB|65
2|Zé Pedro|PT|29|RB|63
3|Riyad Idrissi|IT|21|LB|64
23|Boris Radunović|RS|30|GK|61
20|Riccardo Ciervo|IT|24|ST|63|K:Sassuolo
24|Giuseppe Aurelio|IT|26|RB|62
17|Mattia Felici|IT|25|AM|61
27|Joseph Liteta|ZM|20|CM|59
32|Ivan Sulev|BG|19|DM|58
22|Raphael Kofler|IT|25|CB|58|K:Südtirol
30|Demi Akarakiri|EN|25|AM|56
36|Nicola Grandu|IT|25|CM|54
` },
  "hve": { coach: "Marco Baroni", capacity: 39211, players: `
14|Dailon Livramento|CV|25|ST|78
8|Suat Serdar|DE|29|CM|77
20|Grigoris Kastanos|CY|28|CM|76
27|Paweł Dawidowicz|PL|31|DM|75
10|Tomáš Suslov|SK|24|AM|74
6|Domagoj Bradarić|HR|26|CB|72
81|Caleb Ekuban|GH|32|ST|72
9|Amin Sarr|SE|25|RW|72
1|Nicola Leali|IT|33|GK|72
17|Andréa Le Borgne|FR|20|CM|71|K:Como
19|Samuele Mulattieri|IT|25|LW|72|K:Sassuolo
5|Andrias Edmundsson|FO|25|CB|70
24|Antoine Bernède|FR|27|DM|69
48|Seid Korać|LU|24|CB|68|K:Venezia
4|Gabriele Zappa|IT|26|CB|68|K:Cagliari
21|Abdou Harroui|MA|28|AM|67
28|Tobias Slotsager|DK|20|RB|67
25|Daniel Mosquera|CO|26|ST|66
3|Martin Frese|DK|28|LB|65
79|Kacper Sezonienko|PL|23|RW|64
11|Mattia Compagnon|IT|24|CM|64|K:Venezia
44|Edoardo Iannoni|IT|25|DM|64
23|Nunzio Lella|IT|26|AM|63
34|Simone Perilli|IT|31|GK|60
70|Fallou Cham|GM|20|CB|59
18|Leorat Bega|CH|25|CM|59
22|Giacomo Toniolo|IT|25|GK|58
33|Noe Mael Tagne|FR|25|RB|58
35|Salvatore Cerbone|IT|25|LW|56
37|Nicolò Calabrese|IT|25|LB|55
38|Ruben Akalé|FR|25|ST|53
47|Arthur Borghi|BR|25|GK|52
71|Davide De Battisti|IT|25|CB|52
` },
  "sge": { coach: "Adi Hütter", capacity: 60100, players: `
27|Mario Götze|DE|34|AM|78
20|Ritsu Dōan|JP|28|RW|81
11|Younes Ebnoutalib|MA|22|ST|75
42|Can Uzun|TR|20|AM|79|88
25|Raphael Onyedika|NG|25|DM|80
4|Robin Koch|DE|30|CB|81
1|Noah Atubolu|DE|24|GK|81|86|K:Freiburg
9|Jonathan Burkardt|DE|26|ST|80
8|Farès Chaïbi|DZ|23|AM|78
29|Ayoube Amaimouni|MA|21|RW|68|80
6|Oscar Højlund|DK|21|CM|76|84
7|Ansgar Knauff|DE|24|RW|78
34|Nnamdi Collins|DE|22|CB|76|84
26|Keita Kosugi|JP|20|CB|72
22|Timothy Chandler|US|36|RB|68
15|Noël Aséko|DE|20|DM|70|82
40|Kauã Santos|BR|23|GK|76|84
2|Elias Baum|DE|20|LB|72
3|Lilian Brassier|FR|26|CB|76
35|Malik Pimpong|DK|18|LW|71
44|Jessic Ngankam|DE|26|ST|69
31|Love Arrhov|SE|18|DM|69
5|Otávio|BR|20|CB|69
33|Jens Grahl|DE|37|GK|62
37|Jeremiaha Maluze|DE|21|RB|66
39|Amil Šiljević|BA|25|GK|63
` },
  "wob": { coach: "", capacity: 30000, players: `
24|Christian Eriksen|DK|34|CM|78
21|Joakim Mæhle|DK|29|RB|77
27|Maximilian Arnold|DE|32|CM|79
7|Kento Shiogai|JP|21|ST|72
36|Aster Vranckx|BE|23|CM|76
32|Mattias Svanberg|SE|27|CM|78
10|Fraser Hornby|SC|26|ST|70
1|Timon Wellenreuther|DE|30|GK|75
5|Vini Souza|BR|27|DM|77
17|Alexander Bernhardsson|SE|27|LW|72
11|Fabian Reese|DE|28|LW|76
19|Robert Glatzel|DE|32|ST|74
18|Jonas Adjetey|GH|22|CB|74
26|Saël Kumbedi|FR|21|RB|72
8|Bence Dárdai|HU|20|CM|73
31|Yannick Gerhardt|DE|32|LB|74
20|Muhammed Damar|DE|22|CM|70
37|Elvis Rexhbeçaj|XK|28|CM|72
15|Moritz Jenz|DE|27|CB|68
13|Rogério|BR|28|CB|67
30|Jakub Zieliński|PL|18|GK|65
6|Hauke Wahl|DE|32|CB|66
23|Alessio Besio|CH|22|RW|66
22|Mathys Angély|FR|19|CB|63
2|Kilian Fischer|DE|25|RB|64
25|Aaron Zehnter|DE|21|LB|62
33|Cleiton|BR|23|CB|61
12|Pavao Pervan|AT|38|GK|54
14|Pharell Hensel|DE|25|AM|59
42|Bruno Katz|FI|25|LW|58
43|Trevor Benedict|DE|25|ST|56
` },
  "bmg": { coach: "Jan-Moritz Lichte", capacity: 54057, players: `
6|Kō Itakura|JP|29|CB|79
19|Nicolas Kühn|DE|26|ST|77|K:Como
4|Kevin Diks|ID|29|CB|78
17|Jens Castrop|KR|23|CM|76
29|Joe Scally|US|23|CB|77
14|Daiki Hashioka|JP|27|CB|75|K:Slavia Prag
18|Shūto Machino|JP|26|ST|75
11|Tim Kleindienst|DE|30|RW|74
10|Florian Neuhaus|DE|29|CM|75
2|Fabio Chiarodia|IT|21|RB|73
22|Yukhym Konoplya|UA|26|LB|73
3|Isac Lidberg|SE|27|LW|71
38|Hugo Bolin|SE|23|DM|71
47|Zento Uno|JP|22|AM|71
36|Wael Mohya|DE|17|CM|67
9|Franck Honorat|FR|29|DM|69
7|Kevin Stöger|AT|32|AM|69
1|Moritz Nicolas|DE|28|GK|67
25|Robin Hack|DE|27|CM|68
26|Lukas Ullrich|DE|22|CB|66
5|Jan Leszczyński|PL|19|RB|66
8|Enzo Leopold|DE|26|DM|65
16|Philipp Sander|DE|28|AM|63
20|David Herold|DE|23|LB|63
33|Daniel Batz|DE|35|GK|60
23|Jan Olschowsky|DE|24|GK|60
21|Tobias Sippel|DE|38|GK|54
27|Fritz Fleck|DE|25|CM|59
34|Mathieu Nguefack|DE|25|DM|58
39|Iaia Manco Danfa|GW|25|ST|57
` },
  "nic": { coach: "Olivier Pantaloni", capacity: 36178, players: `
28|Axel Witsel|BE|37|DM|72
11|Elye Wahi|CI|23|ST|76|K:Eintracht Frankfurt
9|Mohamed Amoura|DZ|26|ST|80|K:Wolfsburg
64|Moïse Bombito|CA|26|CB|80
27|Niels Nkounkou|FR|25|LB|77|K:Eintracht Frankfurt
8|Morgan Sanson|FR|31|CM|76
5|Mohamed Abdelmonem|EG|27|CB|76
92|Jonathan Clauss|FR|33|RB|78
6|Hicham Boudaoui|DZ|26|CM|78
10|Sofiane Diop|MA|26|AM|81
2|Ali Abdi|TN|32|LB|75
33|Antoine Mendy|SN|22|CB|72
99|Salis Abdul Samed|GH|26|DM|76
23|Yehvann Diouf|SN|26|GK|77
55|Youssouf Ndayishimiye|BI|27|DM|77
29|Nathan Ngoumou|CM|26|RW|70
7|Gauthier Hein|FR|30|AM|71
21|Isak Jansson|SE|24|LW|72
19|Laurent Abergel|FR|33|CM|68
39|Djibril Coulibaly|FR|17|DM|67
22|Issiaga Camara|GN|21|AM|67
84|Hamza Koutoune|MA|19|LB|65
77|Teddy Boulhendi|DZ|25|GK|63
87|Everton Pereira|FR|22|CM|66
44|Zoumana Diallo|FR|21|ST|63
35|Xavier Mandza|FR|17|CB|63
34|Nassim Laarej|FR|25|DM|62
38|Aboulaye Camara|MR|25|AM|60
41|Djelan Morana|FR|25|ST|59
60|Martin Ponsot|FR|25|GK|57
` },
  "rcs": { coach: "Hugo Oliveira", capacity: 32300, players: `
10|Giovanni Reyna|US|23|AM|76
14|Dário Essugo|PT|21|DM|75|84|K:Chelsea
1|Filip Jörgensen|DK|24|GK|78|K:Chelsea
26|Omari Kellyman|EN|20|CM|70
42|Deivid Washington|BR|21|ST|74
80|Gessime Yassine|MA|20|RW|69
40|Conrad Harder|DK|21|ST|76|84|K:RB Leipzig
9|Joaquín Panichelli|AR|23|ST|77
16|Genesis Antwi|SE|19|CB|66|K:Chelsea
29|Samir El Mourabet|MA|20|AM|70
7|Sam Amo-Ameyaw|EN|20|RW|70
-|Sékou Mara|FR|24|ST|72
4|Jeyland Mitchell|CR|21|CB|72
30|Jacobo Ortega|ES|20|LW|68
8|Maxi Oyedele|PL|21|CM|69
11|Sebastian Nanasi|SE|24|LW|76
36|Oso|ES|23|CB|70
31|Karim Coulibaly|DE|19|CB|68
6|Ismaël Doukouré|FR|23|CB|77
20|Martial Godo|CI|23|RW|67
24|Lucas Høgsberg|DK|20|LB|67
15|Mateo Del Blanco|AR|22|CB|67
21|Pape Demba Diop|SN|22|DM|65
45|Benjamin Brantlind|SE|17|AM|65
12|Miłosz Piekutowski|PL|20|GK|61
-|Hermann Malonga|FR|18|RB|62
23|Diogo Sousa|PT|20|CM|61
28|Tyrese Noubissie|FR|17|DM|61
19|Fábio Baldé|PT|21|LW|59
37|Ghianny Kodia|FR|25|ST|60
` },
  "ran": { coach: "Derek McInnes", capacity: 51700, players: `
7|Lawrence Shankland|SC|31|ST|79
19|Kevin Kelsy|VE|22|ST|77
4|Ben Godfrey|EN|28|CB|77|K:Atalanta
18|Kosta Nedeljković|RS|20|RB|76|K:Aston Villa
1|Ivor Pandur|HR|26|GK|76
14|Cammy Devlin|AU|27|CM|76
29|James Penrice|SC|27|RB|75|K:AEK Atina
24|Olwethu Makhanya|ZA|22|CB|75
43|Nicolas Raskin|BE|25|CM|77
5|John Souttar|SC|29|CB|72
17|Daisuke Yokota|JP|26|DM|71
26|Badredine Bouanani|DZ|21|RW|71|K:Stuttgart
22|Vanja Dragojević|RS|20|AM|71
6|Dan Neil|EN|24|CM|71
9|Youssef Chermiti|PT|22|LW|71
28|Bojan Miovski|MK|27|ST|69
10|Kim Min-su|KR|20|RW|69
2|Ross McCrorie|SC|28|LB|68
52|Findlay Curtis|SC|20|DM|67
21|Dujon Sterling|EN|26|CB|66
15|José Cifuentes|EC|27|AM|65
37|Emmanuel Fernandez|NG|24|RB|63
31|Liam Kelly|SC|30|GK|63
45|Ross McCausland|NX|23|LW|63
23|Djeidi Gassama|MR|22|ST|61
42|Tochi Chukwuani|DK|23|CM|60
20|Ryan Naderi|DE|23|RW|59
25|Tuur Rommens|BE|23|LB|60
-|Clinton Nsiala|FR|22|CB|57
54|Mason Munn|NX|20|GK|56
` },
  "ceb": { coach: "Lars Friis", capacity: 29062, players: `
45|Tayo Adaramola|IE|22|CB|74
17|Joel Ndala|EN|20|CM|69
18|Luke Le Roux|ZA|26|CM|72
22|Lucas Michal|FR|21|ST|71|K:Monaco
13|Dante Vanzeir|BE|28|ST|71|K:Gent
20|Abdoulie Manneh|GM|20|DM|69|K:Mjällby
9|Steve Ngoura|FR|21|RW|69
30|Tunde Akinsola|NG|23|LW|68
1|Gaëtan Coucke|BE|27|GK|69
2|Ibrahim Diakité|GN|22|CB|69
21|Yann Lienard|FR|23|GK|66|K:Monaco
11|Charles Herrmann|DE|20|AM|67
10|Lazare Amani|CI|28|CM|67
28|Hannes Van der Bruggen|BE|33|DM|64
7|Abdoul Kader Ouattara|BF|21|ST|65
8|Erick Nunes|BR|22|AM|64
12|Valy Konaté|CI|19|RB|64|K:Monaco
42|Lukas Mondele|BE|22|CM|63
15|Gary Magnée|BE|26|CB|62
5|Emmanuel Kakou|CI|25|CB|61
24|Geoffrey Kondo|FR|24|LB|59
3|Yago Lincoln|BR|25|CB|60
33|Royer Caicedo|CO|25|RB|59
41|Krys Kouassi|FR|25|RW|57
71|Viggo Martens|BE|25|DM|58
84|Bas Langenbick|BE|25|GK|54
` },
  "yb": { coach: "Gerardo Seoane", capacity: 32000, players: `
16|Christian Fassnacht|CH|32|CM|77
8|Armin Gigović|BA|24|CM|76
6|Edimilson Fernandes|CH|30|DM|75
17|Saidy Janko|GM|30|RB|74
22|Isaac Schmidt|CH|26|CB|75
10|Alvyn Sanches|CH|23|AM|73
1|Marvin Keller|CH|24|GK|72
9|Kaly Sène|SN|25|ST|73
99|Samuel Essende|CD|28|ST|72
11|Joël Monteiro|CH|27|CM|72
15|Cédric Zesiger|CH|28|CB|72
7|Alan Virginius|FR|23|RW|70
23|Loris Benito|CH|34|LB|68
2|Ryan Andrews|EN|21|CB|68
33|Stefan Bukinac|RS|21|CB|68
5|Gregory Wüthrich|CH|31|CB|68
27|Lewin Blum|CH|25|RB|67
18|Joël Mall|CY|35|GK|63
31|Facinet Conte|GN|21|LW|66
30|Sandro Lauper|CH|29|DM|65
13|Dominik Pech|CZ|19|AM|64
40|Dario Marzino|CH|29|GK|61
24|Benjamin Kabeya|CH|25|LB|62
34|Edin Etoski|CH|25|CM|62
` },
  "zen": { coach: "Sergei Semak", capacity: 67800, players: `
11|Luiz Henrique|BR|25|CM|79
3|Douglas Santos|BR|32|RB|77
5|Wilmar Barrios|CO|32|CM|77
9|Felipe Augusto|BR|22|ST|77
8|Wendel|BR|28|CM|77
7|Aleksandr Sobolev|RU|29|ST|75
20|Pedro|BR|20|LW|76
28|Nuraly Alip|KZ|26|CB|74
33|Nino|BR|29|CB|76
10|Maksim Glushenkov|RU|27|AM|74
14|Jhon Jhon|BR|23|CM|73
66|Román Vega|AR|22|CB|71
78|Igor Diveyev|RU|26|CB|72
15|Vyacheslav Karavayev|RU|31|LB|70
31|Gustavo Mantuan|BR|25|DM|71
16|Denis Adamov|RU|28|GK|69
25|Kevin Andrade|CO|27|CB|69
21|Aleksandr Yerokhin|RU|36|AM|65
93|Artyom Karpukas|RU|24|CM|66
82|Sergei Volkov|RU|23|RB|67
71|Daniil Odoyevsky|RU|23|GK|64
57|Bogdan Moskvichyov|RU|22|GK|64
43|Denis Terentyev|RU|33|LB|65
51|Vadim Shilov|RU|18|LW|62
91|Kirill Kosarev|RU|25|ST|63
61|Daniil Kondakov|RU|18|DM|62
86|Dmitry Barkov|RU|34|RW|60
38|Amir Musayev|RU|25|AM|60
70|Nikita Vershinin|RU|25|CB|58
` },
  "mha": { coach: "Barak Bakhar", capacity: 30950, players: `
11|Kenji Gorré|CW|31|ST|76
55|Omri Glazer|IL|30|GK|74
9|Andrija Novakovich|US|29|ST|74
21|Nigel Lonwijk|NL|23|CB|72
16|Kenny Saief|US|32|CM|71
10|Bruninho|BR|26|CM|73
4|Ali Mohamed|NE|30|AM|72
66|Wenderson Tsunami|BR|30|CB|71
30|Pedro Brazão|PT|23|CM|71
25|Jelle Bataille|BE|27|CB|69
3|Sean Goldberg|IL|31|CB|70
19|Ethan Azoulay|IL|24|DM|68
27|Pierre Cornud|FR|29|RB|68
18|Guy Melamed|IL|33|RW|67
8|Yarin Levi|IL|21|DM|66
44|Pedrão|BR|29|LB|67
26|Silva Kani|IL|23|LW|66
99|Omer Nir'on|IL|25|GK|63|K:Maccabi Netanya
40|Shareef Keouf|IL|25|GK|63
45|Cédric Don|CI|22|ST|63
2|Zohar Zasno|IL|24|RB|62
7|Yair Mordechai|IL|22|AM|62
17|Yinon Feingezicht|IL|25|CB|60
29|Eyad Khalaily|IL|25|CM|59
31|Amit Arazi|IL|25|DM|58
35|Noam Sztejfman|IL|25|LB|58
36|Navot Ratner|IL|25|AM|57
37|Elad Amir|IL|25|CB|54
38|Adam Grimberg|IL|25|RW|55
39|Arad Gaist|IL|25|RB|53
42|Liam Luski|IL|25|LW|51
90|Glenn Alvin|IL|25|GK|49
1|Mark Golankov|IL|25|GK|48
2|Eylon Baruch|IL|25|LB|50
` },
  "gai": { coach: "Fredrik Holmberg", capacity: 18416, players: `
20|Samuel Salter|CA|26|ST|69
2|Matteo de Brienne|CA|24|CB|69
22|Anes Čardaklija|BA|21|CB|68
8|William Milovanovic|SE|24|CM|68
9|Gustav Lundgren|SE|31|CM|66
21|Nikola Vasić|SE|34|ST|65
32|Oscar Pettersson|SE|26|RW|66
34|Dennis Collander|SE|24|DM|67
4|Oskar Ågren|SE|27|CB|65
27|Mohamed Bawa|LY|22|RW|63
19|Christos Gravius|SE|28|AM|64
11|Rasmus Niklasson Petrovic|SE|23|LW|62
10|Henry Sletsjøe|SE|26|CM|63
1|Mergim Krasniqi|SE|33|GK|60
24|Filip Beckman|SE|23|CB|60
7|Joackim Fagerjord|SE|28|DM|61
17|Róbert Frosti Þorkelsson|IS|20|AM|59
12|Robin Frej|SE|28|RB|59
28|Lucas Hedlund|SE|27|ST|58
18|Kevin Holmén|SE|24|CM|57
25|Jonas Lindberg|SE|37|DM|53
5|Robin Wendin Thomasson|SE|25|LB|57
6|August Wängberg|SE|25|CB|55
14|Simon Girke Jørgensen|DK|25|AM|55
16|Max Andersson|SE|25|CM|52
26|Blessing Asumang|GH|25|LW|52
33|Andreas Hermansen|DK|25|GK|51
` },
  "hil": { coach: "Simone Inzaghi", capacity: 26000, players: `
11|Ollie Watkins|EN|30|ST|81
7|Gabriel Martinelli|BR|25|LW|81
38|Crysencio Summerville|NL|24|RW|78
19|Théo Hernandez|FR|28|LB|83
8|Rúben Neves|PT|29|DM|82
22|Sergej Milinković-Savić|RS|31|CM|82
37|Yassine Bounou|MA|35|GK|82
3|Kalidou Koulibaly|SN|35|CB|79
29|Salem Al-Dawsari|SA|34|LW|78
75|Mohamed Kader Meïté|CI|18|ST|72
28|Mohamed Kanno|SA|31|CM|76
4|Yusuf Akçiçek|TR|20|CB|72|85
70|Saïmon Bouabré|FR|20|AM|73
6|Nasser Al-Dawsari|SA|27|DM|74
33|Mohammed Al-Owais|SA|34|GK|73
87|Hassan Al-Tambakti|SA|27|CB|76
27|Sultan Mandash|SA|31|RB|72
78|Ali Lajami|SA|30|CB|72
17|Mohammed Al-Rubaie|SA|28|GK|69
24|Moteb Al-Harbi|SA|26|LB|73
2|Mohammed Mahzari|SA|24|CB|67
88|Hamad Al-Yami|SA|27|RB|68
18|Murad Hawsawi|SA|25|AM|68
77|Nawaf Al-Habashi|SA|25|RW|66
72|Sabri Dahal|SA|25|CM|66
44|Saad Al-Mutairi|SA|25|LB|63
55|Mishal Al-Dawood|SA|25|CB|62
73|Mohammed Al-Sarnoukh|SA|25|RB|61
93|Abdullah Al-Anazi|SA|25|DM|60
96|Suhayb Al-Zaid|SA|25|AM|60
31|Rayan Al-Ghamdi|SA|25|LB|57
35|Rayan Al-Dossary|SA|25|GK|57
` },
  "nas": { coach: "Ange Postecoglou", capacity: 25000, players: `
7|Cristiano Ronaldo|PT|41|ST|80
79|João Félix|PT|26|AM|80
10|Sadio Mané|SN|34|LW|80
21|Kingsley Coman|FR|30|RW|80
11|Samú Costa|PT|25|CM|77
26|Iñigo Martínez|ES|35|CB|80
3|Mohamed Simakan|FR|26|CB|80
20|Ângelo Gabriel|BR|21|RW|74
24|Bento|BR|27|GK|79
9|Abdullah Al-Hamdan|SA|26|ST|72
1|Nawaf Al-Aqidi|SA|26|GK|74
5|Abdulelah Al-Amri|SA|29|CB|75
2|Sultan Al-Ghannam|SA|32|RB|73
17|Abdullah Al-Khaibari|SA|29|CM|72
29|Abdulrahman Ghareeb|SA|29|LW|73
12|Nawaf Boushal|SA|26|LB|72
23|Ayman Yahya|SA|25|RW|73
8|Hayder Abdulkareem|IQ|22|DM|68
14|Sami Al-Najei|SA|29|AM|70
16|Mohammed Maran|SA|25|ST|69
6|Saad Al-Nasser|SA|25|CB|67
83|Salem Al-Najdi|SA|23|RB|68
4|Nader Al-Sharari|SA|30|CB|67
50|Majed Qasheesh|SA|24|LB|67
61|Mubarak Al-Buainain|SA|25|GK|64
88|Bassam Hazazi|SA|25|CM|63
53|Abdulrahman Al-Otaibi|SA|25|GK|60
56|Rakan Al-Ghamdi|SA|25|CB|61
60|Saad Haqawi|SA|25|LW|60
70|Awad Aman|SA|25|RB|61
40|Youssef Al-Tahan|SA|25|LB|59
94|Abdulrahaman Sufyani|SA|25|DM|58
` },
  "itt": { coach: "Jens Wissing", capacity: 66345, players: `
23|Georginio Wijnaldum|NL|35|CM|74
34|Steven Bergwijn|NL|28|RW|79
5|Richard Ríos|CO|26|CM|79|K:Benfica
21|Youssef En-Nesyri|MA|29|ST|80
10|Houssem Aouar|DZ|28|AM|79
9|George Ilenikhena|NG|19|ST|70|82
2|Danilo Pereira|PT|34|CB|74
1|Predrag Rajković|RS|30|GK|79
4|Jan-Carlo Simić|RS|21|CB|74
7|Roger Fernandes|PT|20|LW|72
8|Mukhtar Ali|SA|28|CM|72
30|Dion Lopy|SN|24|DM|74
11|Saleh Al-Shehri|SA|32|ST|72
17|Mahamadou Doumbia|ML|25|AM|72
25|Faris Abdi|SA|27|CB|70
22|Marwan Al-Sahafi|SA|22|LW|70
15|Hassan Kadesh|SA|33|RB|69
90|Talal Haji|SA|18|RW|66|78
27|Ahmed Al-Ghamdi|SA|24|DM|70
13|Muhannad Al-Shanqeeti|SA|27|CB|69
20|Ahmed Sharahili|SA|32|CB|67
6|Saad Al-Mousa|SA|23|LB|66
80|Hamed Al-Ghamdi|SA|27|AM|65
42|Muath Faqeehi|SA|24|CB|63
29|Farhah Al-Shamrani|SA|20|CM|63
60|Rakan Kaabi|SA|23|DM|64
66|Mohammed Barnawi|SA|21|RB|62
32|Ahmed Al-Julaydan|SA|22|LB|61
41|Mohammed Fallatah|SA|25|AM|60
50|Mohammed Al-Absi|SA|25|GK|56
87|Yaseen Al-Jaber|SA|25|CB|57
88|Osama Al-Mermesh|SA|25|GK|55
` },
  "ahl": { coach: "Marino Pušić", capacity: 62345, players: `
17|Ivan Toney|EN|30|ST|81
7|Francisco Trincão|PT|26|RW|81
16|Édouard Mendy|SN|34|GK|80
28|Merih Demiral|TR|28|CB|80
3|Roger Ibañez|BR|27|CB|80
8|Eduard Spertsyan|AM|26|AM|76
13|Galeno|BR|28|LW|81
6|Valentin Atangana|FR|20|CM|72
9|Firas Al-Buraikan|SA|26|ST|76
20|Matheus Gonçalves|BR|20|RW|70
19|Artem Bondarenko|UA|25|CM|76|K:Shakhtar Donetsk
24|Abubacarr Sedi Kinteh|GM|19|CB|66
27|Ali Majrashi|SA|26|RB|72
30|Ziyad Al-Johani|SA|24|CM|72
21|Abdullah Radif|SA|23|ST|70
2|Zakaria Hawsawi|SA|25|CB|71
47|Saleh Abu Al-Shamat|SA|23|DM|68
1|Abdulrahman Al-Sanbi|SA|25|GK|68
46|Rayan Hamed|SA|24|LB|69
5|Mohammed Sulaiman|SA|22|CB|68
66|Naif Masoud|SA|25|AM|67
31|Saad Balobaid|SA|26|RB|65
29|Mohammed Abdulrahman|SA|23|LB|65
11|Meshal Al-Mutairi|SA|27|CM|65
15|Saeed Baattiah|SA|26|CB|64
49|Salem Abdullah|SA|25|RW|61
-|Ibrahima Diaby|FR|25|DM|62
23|Ibrahim Azzam|SA|25|AM|61
25|Faisal Fallatah|SA|25|CM|59
62|Abdullah Abdoh|SA|25|GK|58
72|Salman Al-Jadani|SA|25|GK|57
87|Ramez Al-Attar|SA|25|DM|58
` },
  "mia": { coach: "Kily González", capacity: 26700, players: `
10|Lionel Messi|AR|39|RW|85
7|Rodrigo De Paul|AR|32|CM|78
5|Casemiro|BR|34|DM|79
9|Luis Suárez|UY|39|ST|76
3|Sergio Reguilón|ES|29|CB|75
19|Germán Berterame|MX|27|RW|72
34|Rocco Ríos Novo|AR|24|GK|74
97|Dayne St. Clair|CA|29|GK|72
-|Matías Galarza|PY|24|CM|73|K:River Plate
21|Tadeo Allende|AR|27|LW|73
8|Telasco Segovia|VE|23|AM|71
42|Yannick Bright|IT|24|CM|70
22|David Ayala|AR|24|DM|68
17|Ian Fray|JM|23|CB|68
2|Gonzalo Luján|AR|25|CB|68
37|Maximiliano Falcón|UY|29|CB|68
4|Facundo Mura|AR|27|RB|66
24|Mateo Silvetti|AR|20|ST|66
16|Micael|BR|26|LB|65|K:Palmeiras
15|Fricio Caicedo|EC|18|CB|64|K:Moravia FCM
20|Santiago Morales|US|19|AM|64
56|Dániel Pintér|US|19|RW|64
13|Luis Barraza|US|29|GK|61
62|Israel Boatwright|DO|21|RB|61
26|Tyler Hall|US|20|LB|61
-|Riquelme Fillipi|BR|19|LW|60
59|Preston Plambeck|US|20|CM|58
54|Lovend's Delinois|HT|25|ST|58
70|Daniel Sumalla|US|25|CB|55
76|Cesar Abadia|US|25|RB|56
88|Alexander Shaw|US|25|DM|54
` },
  "lag": { coach: "Greg Vanney", capacity: 27000, players: `
10|Riqui Puig|ES|26|CM|77
7|Kyōgo Furuhashi|JP|31|ST|75
11|Hirving Lozano|MX|31|ST|74|K:San Diego FC
6|Sergi Roberto|ES|34|CB|73
18|Marco Reus|DE|37|AM|75
4|Maya Yoshida|JP|37|CB|70
21|Robert Taylor|FI|31|RW|72
28|Joseph Paintsil|GH|28|LW|72
99|João Klauss|BR|29|ST|71
5|Jakob Glesnes|NO|32|CB|71
27|Erik Thommy|DE|31|CM|69
17|Pablo Ruiz|AR|27|DM|68
8|Lucas Sanabria|UY|22|CM|67
12|JT Marcinkowski|US|29|GK|67
3|Julián Aude|AR|23|CB|67
2|Lucas Calegari|BR|24|RB|66
15|Justin Haak|US|23|DM|67
1|Novak Mićović|RS|24|GK|63
14|John Nelson|US|28|LB|65
22|Elijah Wynder|US|23|AM|64
25|Carlos Garcés|CO|24|CB|64
16|Isaiah Parente|US|26|CM|61
31|Brady Scott|US|27|GK|59
20|Chris Rindov|US|24|RB|61
26|Harbor Miller|US|25|LB|60
50|Riley Dalgado|US|25|CB|58
76|Troy Elgersma|US|25|RW|57
` },
  "clb": { coach: "Laurent Courtois", capacity: 20371, players: `
3|Eric Bailly|CI|32|CB|76
20|André Gomes|PT|33|CM|73
10|Brais Méndez|ES|29|AM|80
77|Josef Martínez|VE|33|ST|73
21|Anass Zaroury|MA|25|DM|73|K:Panathinaikos
31|Steven Moreira|CV|31|RB|72
9|Wessam Abou Ali|PS|27|ST|70
28|Patrick Schulte|US|25|GK|69
33|Gonzalo Tapia|CL|24|RW|69|K:São Paulo
8|Santiago Rodríguez|UY|26|LW|70
16|Taha Habroune|US|20|ST|68
11|Brooks Lennon|US|28|CB|67
1|Nicholas Hagen|GT|30|GK|67
23|Mohamed Farsi|DZ|26|CB|66
25|Sean Zawadzki|US|26|CB|65
2|Andrés Herrera|AR|27|LB|65
46|Chase Adams|US|18|RW|65
29|Cole Mrowka|PH|20|AM|64
19|Jamal Thiaré|SN|33|LW|63
12|Cesar Ruvalcaba|US|25|CB|61
18|Malte Amundsen|DK|28|RB|61
7|Dylan Chambost|FR|28|CM|61
26|Lautaro Giaccone|AR|25|DM|60|K:Argentinos Juniors
4|Rudy Camacho|FR|35|LB|57
14|Amar Sejdić|US|29|AM|57
22|Tristan Brown|US|18|CM|56
17|Sekou Bangoura|GN|24|DM|57
41|Stanislav Lapkes|BY|20|GK|53
50|Tarun Karumanchi|US|25|AM|53
54|Luke Pruter|US|25|GK|52
24|Evan Bush|US|40|GK|44
` },
  "ant": { coach: "Bülent Korkmaz", capacity: 29307, players: `
10|Yohan Boli|CI|32|ST|71
26|Nikola Storm|BE|31|ST|69
8|Ramzi Safouri|IL|30|AM|70
88|Dario Šarić|BA|29|CM|69
70|Doğukan Sinik|TR|27|RW|69
22|Sander van de Streek|NL|33|CM|67
1|Julián Cuesta|ES|35|GK|64
27|Mert Yılmaz|TR|27|CB|67
14|Pedrinho|PT|33|CM|77
7|Bünyamin Balcı|TR|26|CB|65
17|Erdoğan Yeşilyurt|TR|32|CB|65
15|Francis Nzaba|CG|24|CB|63
6|Soner Dikmen|TR|32|CM|62
16|Ufuk Akyol|TR|28|DM|62
89|Veysel Sarı|TR|38|RB|58
11|Güray Vural|TR|38|LB|57
21|Abdullah Yiğiter|TR|26|GK|59
4|Ensar Buğra Tivsiz|TR|25|CB|59
13|Doğukan Özkan|TR|25|GK|58
19|Samet Karakoç|TR|25|RB|57
20|Yakub İlçin|TR|25|AM|56
23|Ahmet Sağat|TR|25|LW|56
24|Bachir Gueye|SN|25|ST|56
44|Ismail Chehaima|DZ|25|CM|55
92|Hasan Ürkmez|TR|25|DM|54
97|Mevlüt Şimşek|TR|25|RW|52
98|Ege İzmirli|TR|25|LB|51
99|Kağan Arıcan|TR|25|GK|49
` },
  "ban": { coach: "Mustafa Gürsel", capacity: 12237, players: `
9|Gianni Bruno|BE|34|ST|65
11|Tosin Kehinde|NG|28|ST|65
92|Rémi Mulumba|CD|33|CM|65
10|Muhammed Gümüşkaya|TR|25|CM|64
6|Lucas Lima|BR|34|RB|63
3|Huseyin Biler|TR|24|CB|63
18|Cem Türkmen|TR|24|DM|63
8|Dean Liço|AL|26|AM|62
86|Burak Bekaroğlu|TR|29|CB|60
77|Hakan Bilgiç|TR|33|CB|61
14|Yusuf Kocatürk|TR|25|CB|61
17|Emirhan Ayhan|TR|25|CM|58
19|Arda Midiliç|TR|25|LB|57
20|Enes Çinemre|TR|25|DM|57
22|Ali Ülgen|TR|25|CB|56|K:Erzurumspor FK
23|Kerem Dönertaş|TR|25|AM|58
25|Bartu Kulbilge|TR|25|GK|54
27|Dame Seck|SN|25|RW|54
29|Amidou Badji|SN|25|LW|55
34|Enes Aydın|TR|25|RB|53
90|Yalın Dilek|TR|25|ST|52
99|Furkan Bekleviç|TR|25|GK|50
-|Joseph Namatane|SN|25|CM|52
-|Tümer Oruç|TR|25|RW|49
16|Akın Alkan|TR|37|GK|44
` },
  "bat": { coach: "Selçuk Şahin", capacity: 15000, players: `
9|Sergio Córdova|VE|29|ST|65|K:Young Boys
21|Matheus Dória|BR|31|CB|63
7|Mickaël Biron|MQ|28|ST|63|K:Nürnberg
6|Jo Jin-ho|KR|23|CM|62|K:Konyaspor
77|Benny|PT|26|CM|62
10|Pedrinho|BR|29|CM|77
11|Omar Imeri|AL|26|CB|61
25|Çağlar Akbaba|TR|31|GK|60
3|Yasir Subaşı|TR|30|RB|59
5|Emirhan Aydoğan|TR|29|DM|59
4|Metehan Mert|TR|27|CB|58
72|Polat Yaldır|TR|23|LW|59
79|Gökhan Altıparmak|TR|25|ST|58
17|Gökhan Karadeniz|TR|36|AM|53
26|Buğra Çağıran|TR|31|CM|56
27|Ömürcan Artan|TR|27|CB|56
13|Birkan Tetik|TR|30|GK|53
8|Oğuz Gürbulak|TR|34|DM|53
15|David Kaiki|BR|25|AM|52
18|Karan Topdemir|TR|25|RW|51
28|Murat Sipahioğlu|TR|25|LB|52
34|Mamadou Cissokho|SN|25|CM|50
46|Devran Bozardiç|TR|25|CB|51
-|Ali İmran Işık|TR|25|RB|49
53|Mücahit Albayrak|TR|35|LB|47
` },
  "bdr": { coach: "", capacity: null, players: `
80|Ruben Providence|HT|25|CM|68
22|Jonathan Okita|CD|30|ST|67
52|Devrim Şahin|TR|19|ST|60
1|Diogo Sousa|PT|27|GK|64
14|Florian Loshaj|XK|29|CM|64
75|Emre Kaplan|TR|25|CB|65
4|Ali Şahin Yılmaz|TR|22|CB|63
8|Mustafa Erdilman|TR|22|DM|64
11|Ege Bilsel|TR|22|RW|63
9|Kerem Kayaarası|TR|25|LW|61
17|Ege Arslan|TR|25|AM|61
18|Gabriel Obekpa|NG|25|CM|60
20|Yusuf Sertkaya|TR|25|DM|60
23|Furkan Apaydın|TR|25|CB|60
25|Adem Metin Türk|TR|25|ST|59
27|Kartal Cengizer|TR|25|AM|58
32|Bahri Can Tosun|TR|25|GK|56
34|Ali Aytemur|TR|25|CB|56
68|İsmail Tarım|TR|25|RB|55
70|Enes Koç|TR|25|CM|55
77|Berşan Yavuzay|TR|25|LB|54
82|Boran Başkan|TR|25|DM|53
` },
  "blu": { coach: "Daniel Farrar", capacity: 8456, players: `
32|Elvin Yunuszade|AZ|33|CB|65
9|Rodrigo Rivas|CO|29|ST|66
21|Muhammed Mert|TR|31|CM|64
24|Juan Argüello|AR|26|CB|64
-|Orkun Özdemir|TR|31|GK|62
1|Angelo Tafas|AL|25|GK|61
2|Furkan Metin|TR|25|CB|62
3|Kevin Cuesta|CO|25|CB|62
5|Ali Çırak|TR|25|RB|61
6|Can Arda Yılmaz|TR|25|CM|60
7|Erdem Can Polat|TR|25|ST|58
8|Tolunay Artuç|TR|25|DM|60
10|Fernando Escobar|PY|25|RW|58
11|Furkan Kaçmaz|TR|25|LW|57
14|Abdulsamet Kırım|TR|25|LB|57
15|Burak Topçu|TR|25|AM|57
16|Temel Çakmak|TR|25|CM|55
17|Alptekin Çaylı|TR|25|ST|55
19|Hosue Díaz|PY|25|DM|55
20|Deniz Yıldız|TR|25|AM|54
22|Arda Saygı|TR|25|CB|52
23|Zeki Dursun|TR|25|CM|51
25|Muhammet Özkan|TR|25|GK|50
35|Ege Özkayımoğlu|TR|25|RW|51
50|Bartu Göçmen|TR|25|RB|48
67|Bertu Özyürek|TR|25|DM|47
76|Kaan Alp Dizbay|TR|25|GK|46
80|Emmanuel Aderinola|NG|25|AM|46
88|Yusuf Can Esendemir|TR|25|LB|44
` },
  "brs": { coach: "Mustafa Er", capacity: 43361, players: `
14|Kelechi Iheanacho|NG|29|ST|69
42|Lewis Baker|EN|31|CM|68
10|Lincoln|BR|27|CM|66
27|Toral Bayramov|AZ|25|CB|67
6|Juergen Elitim|CO|27|DM|64
18|Amine Boutrah|FR|25|ST|64
4|Ertuğrul Ersoy|TR|29|CB|64
5|Zeki Yavru|TR|34|RB|64
24|Alperen Babacan|TR|29|CB|64
8|Soner Aydoğdu|TR|35|AM|60
11|İlhan Depe|TR|33|RW|61
9|Emir Kaan Gültekin|TR|25|LW|61
52|Tayfun Aydoğan|TR|30|CM|61
1|Anıl Atağ|TR|25|GK|59
20|Baran Başyiğit|TR|25|ST|58
34|Eyüp Akcan|TR|25|DM|59
39|Ahmet Kıvanç|TR|25|GK|57
44|Emir Kayacık|TR|25|CB|56
57|Batuhan Yayıkcı|TR|25|LB|57
66|Hüseyin Maldar|TR|25|CB|57
77|Rahmetullah Berişbek|TR|25|RB|56
93|Barış Gök|TR|25|LB|53
98|Kerem Matışlı|TR|25|GK|52
99|Ertuğrul Furat|TR|25|RW|52
` },
  "ero": { coach: "Osman Özköylü", capacity: 5296, players: `
-|Pape Habib Guèye|SN|26|ST|65|K:Kasımpaşa
18|Braian Samudio|PY|30|ST|64
7|Nicolas Janvier|FR|27|CM|63
20|Muhamed Buljubašić|BA|22|CM|63|K:Çaykur Rizespor
88|Altin Zeqiri|XK|26|RW|61
53|Yusuf Erdoğan|TR|34|DM|61
34|Ertuğrul Çetin|TR|23|GK|61
10|Recep Niyaz|TR|31|AM|61
27|Ferhat Yazgan|TR|33|CM|59
9|Kubilay Kanatsızkuş|TR|29|LW|61
4|Luccas Claro|BR|34|CB|58
21|Bahadır Öztürk|TR|30|CB|59
22|Erdem Canpolat|TR|25|GK|56|K:Çaykur Rizespor
6|Tugay Kacar|TR|32|DM|56
39|Erkan Kaş|TR|34|CB|55
77|Hayrullah Bilazer|TR|31|CB|56
5|Mikail Okyar|TR|25|AM|55
14|Onur Ulaş|TR|25|RB|54
17|Burak Çoban|TR|25|CM|52
24|Doğukan Demir|TR|25|GK|51
33|Enes Alıç|TR|25|LB|51
52|Yusuf Özyurt|TR|25|ST|52
70|Furkan Orak|TR|25|CB|49|K:Çaykur Rizespor
80|Harun Genç|TR|25|DM|49
` },
  "fkg": { coach: "Aleksandar Stanojević", capacity: 77563, players: `
9|Cenk Tosun|TR|35|ST|69
20|Manolis Siopis|GR|32|CM|69
10|Daniele Verde|IT|30|ST|68
72|Aleksandar Pešić|RS|34|RW|67
8|Dorukhan Toköz|TR|30|CM|66
4|Davide Biraschi|IT|32|CB|66
1|Marco Silvestri|IT|35|GK|63
11|Tiago Çukur|TR|23|LW|64
5|Emre Akbaba|TR|33|DM|64
6|Robin Yalçın|TR|32|CB|65
3|Atınç Nukan|TR|33|CB|62
23|Batuhan Şen|TR|27|GK|63
7|Barış Kalaycı|TR|20|AM|61
22|Ramazan Civelek|TR|30|CB|61
25|Muhammed Sarıkaya|TR|24|RB|60
33|Çağtay Kurukalıp|TR|24|LB|59
14|Marius Tresor|CI|25|CM|60
17|Tarık Buğra Kalpaklı|TR|25|ST|57
19|Yaya Onogo|CI|25|DM|58
21|Candan Başkale|TR|25|AM|56
24|Burhan Ersoy|TR|25|CB|56
26|Ahmed Traore|CI|25|RW|56
27|Muhammed Kadıoğlu|TR|25|RB|55
28|Anıl Yiğit Çınar|TR|25|LB|53
` },
  "igd": { coach: "Kenan Koçak", capacity: 2700, players: `
10|Leandro Bacuna|CW|34|CM|62
33|Felix Afena-Gyan|GH|23|ST|63
99|Douglas Tanque|BR|32|ST|61
23|Dino Hotić|BA|31|RW|61
5|Alim Öztürk|TR|33|CB|61
24|Giovanni Crociata|IT|28|CM|59
21|Doğan Erdoğan|TR|29|DM|61
3|Emrecan Terzi|TR|22|CB|59
61|Serkan Asan|TR|27|RB|59
29|Jakub Szumski|PL|34|GK|57
28|Soner Gönül|TR|29|CB|57
18|Loïc Kouagba|FR|32|CB|57
1|Muhammet Taha Tepe|TR|25|GK|57
58|Gökcan Kaya|TR|31|AM|55
2|Baran Moğultay|TR|22|LB|54
4|Arda Öztürk|TR|25|CB|55
6|Devran Şenyurt|TR|25|RB|53
7|Moustapha Camara|SN|25|LW|54
8|Efe Kaan Şıhlaroğlu|TR|25|CM|52
9|Arda Çolak|TR|25|ST|51
11|Malik Yılmaz|TR|25|DM|51
17|Emirhan Altundağ|TR|25|AM|50
19|Özder Özcan|TR|25|RW|48
22|Alperen Selvi|TR|25|LB|48
35|Eren Karataş|TR|25|GK|45
39|Hüseyin Karabey|TR|25|CB|47
44|Leon Çalıskan|TR|25|CM|45
77|Ahmet Köse|TR|25|RB|44
94|Fahri Pınar|TR|25|LB|43
95|Yiğit Ali Buz|TR|25|CB|42
-|Ertuğrul Yıldırım|TR|25|DM|41
` },
  "ist": { coach: "Barış Kanbak", capacity: 4274, players: `
10|Ilian Iliev Jr.|BG|26|CM|66
2|Demeaco Duhaney|EN|27|RB|67
5|Michael Ologo|NG|23|CB|66
15|Elvin Mendy|GM|19|CM|59
77|Mario Krstovski|MK|28|ST|64
8|Vefa Temel|TR|23|DM|62
58|Muhlis Dağaşan|TR|22|LB|64
44|Erdem Seçgin|TR|26|AM|63
21|Dijlan Aydın|TR|26|CM|62
13|Fatih Tultak|TR|25|CB|62
1|İsa Doğan|TR|25|GK|61
3|Yusuf Özer|TR|25|CB|59
4|Duran Şahin|TR|25|CB|59
6|Isa Dayakli|AT|25|DM|57
7|Phellipe|BR|25|AM|57
9|Mustafa Sol|TR|25|ST|56
11|Berk Nizam|TR|25|CM|57
16|Saviour Kagbetor|GH|25|DM|56
18|Deniz Tuncer|TR|25|CB|54
20|Özcan Şahan|TR|25|RB|55
26|Mücahit Serbest|TR|25|GK|51
28|Alp Tutar|TR|25|GK|52
30|Alieu Cham|GM|25|RW|52
31|Ertuğrul Sandıkcı|TR|25|LW|51
32|Demir Mermerci|TR|25|AM|50
40|İzzet Erdal|TR|25|LB|49
52|Ömer Faruk Duymaz|TR|25|CM|47
61|Enver Sarıalioğlu|TR|25|DM|46
` },
  "kay": { coach: "Atila Gerin", capacity: 31856, players: `
20|Joshua Brenet|CW|32|RB|69
97|Taulant Seferi|AL|29|ST|68
9|Florent Hasani|XK|29|ST|68
3|Jemal Tabidze|GE|30|CB|69
28|Mamadi Camará|GW|22|CM|68
16|Deniz Dönmezer|TR|17|GK|58
88|Marco Dulca|RO|27|CM|66
27|Daniel Moreno|CO|31|RW|66
71|Oğulcan Çağlayan|TR|30|DM|65
22|Denis Radu|RO|23|AM|64
4|Semih Güler|TR|31|CB|63
61|Görkem Sağlam|TR|28|CM|64
6|Murat Cem Akpınar|TR|27|DM|62
8|Sinan Kurt|TR|31|AM|61
10|Benhur Keser|TR|29|LW|61
99|Talha Sarıarslan|TR|21|ST|62
5|Kayra Cihan|TR|25|CB|60
7|Murat Uçar|TR|25|CB|59
11|Ensar Kemaloğlu|TR|25|CM|58
14|Muhammed Eren Arıkan|TR|25|LB|58
17|Mert Göçkan|TR|25|CB|56
18|Fethi Özer|TR|25|RB|55
19|Malik Hayvalı|TR|25|DM|55
23|Abdulsamet Burak|TR|25|LB|55
24|Enes Melih Gökçek|TR|25|AM|53
29|Burak Erkan|TR|25|RW|53
38|Ataol Taylan Karapınar|TR|25|CM|51
40|Hasan Kaan Yalçı|TR|25|GK|50
45|Aras Çelik|TR|25|DM|50
77|Cenk Şen|TR|25|CB|47
-|Efe Arslan Düzgün|TR|25|AM|47
-|Enes Tulgay|TR|25|RB|47
35|Gökhan Değirmenci|TR|37|GK|40
` },
  "kec": { coach: "Yalçın Koşukavak", capacity: 4518, players: `
55|Mame Biram Diouf|SN|38|ST|62
7|Odise Roshi|AL|35|CM|62
9|Ali Akman|TR|24|ST|64
10|Jefferson|BR|32|CM|62
45|Herculano Nabian|PT|22|RW|63
3|Wellington|BR|31|CB|61
77|Moryké Fofana|CI|34|LW|61
2|Yunus Bahadır|TR|24|CB|61
21|Francis Ezeh|NG|28|ST|61
-|Duhan Aksu|TR|29|CB|59
14|İbrahim Akdağ|TR|35|DM|58
18|Emre Satılmış|TR|30|GK|58
1|Mehmet Erdoğan|TR|25|GK|58
4|Abdullah Çelik|AT|25|CB|56
5|Oğuzcan Çalışkan|TR|25|RB|57
8|İshak Karaoğul|TR|25|AM|55
12|Berkan Keskin|TR|25|LB|56
15|Yunus Emre Metin|TR|25|CB|55
16|Oğuzhan Ayaydın|TR|25|CM|52
17|Recep Taşbakır|TR|25|DM|52
19|Enes Yılmaz|TR|25|AM|53
20|Alcídio Raice|MZ|25|RW|52
22|Halil Can Ayan|TR|25|CM|51
33|Süleyman Luş|TR|25|RB|48
-|Emin Arda Doğan|TR|25|LB|48
-|Ömer Faruk Demirel|TR|25|LW|47
-|Efe Kaan Yıldız|TR|25|GK|46
` },
  "man": { coach: "Mustafa Dalcı", capacity: 16597, players: `
11|Noha Lemina|GA|21|CM|64
20|Yassine Benrahou|MA|27|CM|65
70|Alenis Vargas|HN|22|ST|63|K:SJK Seinäjoki
10|Jonathan Lindseth|NO|30|DM|64
23|Julien Anziani|FR|27|AM|62
60|Birama Touré|ML|34|CM|62
5|Christophe Hérelle|MQ|33|CB|62
6|Atakan Çankaya|TR|28|CB|61
1|Vedat Karakuş|TR|28|GK|62
2|Yunus Köse|TR|25|CB|60
4|Fırat İnal|TR|25|CB|59
7|Yusuf Talum|TR|25|RB|58
8|Kerem Arık|TR|25|DM|58
9|Cheikne Sylla|ML|25|ST|57
13|Egemen Yaylı|TR|25|GK|57
17|Osman Kahraman|TR|25|RW|56
21|Emre Akboğa|TR|25|AM|56
22|Kadir Yurdakul|TR|25|CM|56
24|Yunus Emre Dursun|TR|25|DM|54
25|Ahmet Şen|TR|25|AM|53
45|Ada İbik|TR|25|LB|54
27|Yasin Güreler|TR|35|CB|51
` },
  "mrd": { coach: "Ahmet Cingöz", capacity: 5700, players: `
-|Olarenwaju Kayode|NG|33|ST|64
-|Zdravko Dimitrov|BG|27|ST|64
-|Emre Taşdemir|TR|31|RB|62
-|Đorđe Denić|RS|30|CM|61
-|Erce Kardeşler|TR|32|GK|60
7|Şahverdi Çetin|TR|25|CM|60
29|Ömer Kahveci|TR|34|GK|60
8|Abdullah Aydın|TR|25|DM|60
3|Nafican Yardimci|TR|25|CB|60
4|Ömer Karslioğlu|TR|25|CB|58
11|Bünyamin Balat|TR|25|AM|57
19|Ahmet Ülük|TR|25|CM|57
20|Umutcan Kirboğa|TR|25|DM|56
21|Vural Altan|TR|25|CB|56
28|Erol Can Akdağ|TR|25|AM|55
31|Emir Kireççi|TR|25|GK|54
35|Arda Kemal Gülmez|TR|25|GK|52
42|Şener Kaya|TR|25|CB|52
45|Osman Yildirim|TR|25|RW|52
64|Berkay Dogan|AT|25|LB|51
70|Enes Erol|TR|25|CM|51
77|Melih İnan|TR|25|DM|50
-|Mustafa Şengül|TR|25|CB|49
-|Uğur Gezer|TR|25|RB|49
-|Eray Korkmaz|TR|25|LB|47|K:Çaykur Rizespor
-|Rojhat Sağlam|TR|25|AM|47
-|Mesih Kayabaş|TR|25|CM|45
-|Denizhan Taşkan|TR|25|LW|44
` },
  "mug": { coach: "Yalçın Koşukavak", capacity: 7755, players: `
7|Driton Camaj|ME|29|ST|65
10|Daniel Avramovski|MK|31|CM|62
44|Luis Mago|VE|31|CB|63
9|Poyraz Yıldırım|TR|21|RW|61|K:Trabzonspor
11|Mamady Diarra|ML|26|LW|60
21|Jurgen Çelhaka|AL|25|CM|60
26|Salem Bouajila|TN|19|ST|57|K:Göztepe
28|Ahmet Engin|TR|30|ST|60
-|Buluthan Bulut|TR|24|DM|58|K:Alanyaspor
23|Ali Kaan Güneren|TR|26|AM|58|K:Iğdır FK
25|Selim Dilli|TR|28|CM|59
17|Ekrem Kılıçarslan|TR|28|GK|58
-|Mustafa Erkasap|TR|25|DM|55|K:Manisa FK@2026
3|Ali Barak|TR|25|CB|55
15|Orhan Nahırcı|TR|25|CB|56
16|Yiğitali Bayrak|TR|25|AM|54
19|Oguzhan Özlesen|AT|25|CM|54
22|Bilal Ceylan|TR|25|CB|53
31|Arel Ekinci|TR|25|GK|52
33|Batuhan Yılmaz|TR|25|RB|51
48|Ozan Sol|TR|25|RW|50
53|Alihan Kazmaz|TR|25|LB|50
77|Emre Şimşek|TR|25|DM|49
88|Yiğit Fidan|TR|25|CB|49|K:Fenerbahçe
` },
  "pen": { coach: "Sinan Kaloğlu", capacity: 4105, players: `
9|Jonson Clarke-Harris|JM|32|ST|66
6|Vinko Soldo|HR|28|CB|67
14|Hakan Yeşil|TR|24|CM|65
77|Adnan Uğur|BE|25|CM|64
34|Thuram|BR|35|ST|62
-|Emrah Başsan|TR|34|RW|63
22|Kerem Kalafat|TR|25|RB|62
12|Görkem Bitin|TR|28|LW|62
2|Taha Emre İnce|TR|25|CB|61
4|Ahmet Özkaya|TR|25|CB|60
5|Berkay Sülüngöz|TR|25|CB|61
11|Ahmet Karademir|TR|25|DM|60
17|Samuel Abifade|DE|25|LB|60
20|Yekta Sönmez|TR|25|AM|59
27|Ismaila Manga|SN|25|CM|59
28|Efehan Pekdemir|TR|25|DM|57
30|Emre Koyuncu|TR|25|GK|56
33|Hüseyin İşlek|TR|25|GK|54
41|Mesut Özdemir|TR|25|AM|54
60|Bekir Karadeniz|TR|25|CM|54
61|Onuralp Çakıroğlu|TR|25|ST|54
66|Furkan Doğan|TR|25|CB|52
81|Tarık Tekdal|TR|25|RB|52
97|Utku Yuvakuran|TR|25|GK|49
-|Safa Yıldırım|TR|25|DM|49
-|Erdem Gökçe|TR|25|LB|48
-|Mirko Sušak|HR|25|AM|47
` },
  "sar": { coach: "Bülent Bölükbaşı", capacity: 4100, players: `
93|Mamadou Thiam|SN|31|ST|66
53|André Biyogo Poko|GA|33|CM|64
13|Ibrahim Šehić|BA|37|GK|59
90|Emeka Eze|NG|29|ST|63
3|Joseph Attamah|GH|32|CB|61
7|Barış Alıcı|TR|29|RW|63
10|Efecan Karaca|TR|36|LW|59
77|Cebrail Karayel|TR|31|RB|62
11|Eren Karadağ|TR|26|ST|61
24|Işık Kaan Arslan|TR|25|CB|61
1|Furkan Onur Akyüz|TR|20|GK|58
28|Hasan Emre Yeşilyurt|TR|25|CM|59
22|Fatih Kurucuk|TR|28|CB|58|K:Fatih Karagümrük@2026
4|Erdi Dikmen|TR|29|CB|56
88|Caner Osmanpaşa|TR|38|LB|51
23|Üzeyir Ergün|TR|25|CB|55
5|Eşref Korkmazoğlu|TR|25|RB|55
8|Marcos Silva|AO|25|DM|54
9|Batuhan Kör|TR|25|RW|54
14|Tunahan Ergül|TR|25|AM|52
17|Doğan Can Davas|TR|25|CM|53
19|Yağız Şen|TR|25|DM|51
27|Mahmut Yücel|TR|25|AM|50
35|Hasan Kayalı|TR|25|LB|49
41|Furkan Gedik|TR|25|CM|48
61|Emirhan Özkan|TR|25|DM|47
91|Ahmet Göcen|TR|25|GK|45
99|Stann Élysée Dalo|CI|25|LW|45
-|İsmail Korkut|TR|25|AM|44
-|Berke Sanlitürk|DE|25|ST|44
` },
  "siv": { coach: "İsmet Taşdemir", capacity: 27532, players: `
9|Rey Manaj|AL|29|ST|70
8|Charis Charisis|GR|31|CM|67
17|Clinton Duodu|GH|21|ST|67|K:Apollon Limassol
4|Mert Çelik|AZ|26|CB|66
2|Aaron Appindangoyé|GA|34|CB|65
11|Burak Kapacak|TR|26|RW|66
27|Valon Ethemi|MK|28|CM|66
20|Musah Mohammed|GH|24|DM|65
23|Cihat Çelik|TR|30|AM|64
89|Amilton|BR|36|LW|61
19|Emre Gökay|TR|25|CM|61
58|Uğur Çiftçi|TR|34|CB|61
22|Okan Erdoğan|TR|27|CB|60
1|Göktuğ Bakırbaş|TR|30|GK|58
7|Murat Paluli|TR|32|RB|60
25|Süleyman Özdamar|TR|33|LB|59
28|Salih Kavrazlı|TR|25|ST|59|K:Bursaspor
6|Kamil Fidan|TR|25|DM|59
16|Arda Erdursun|TR|25|GK|56
43|Eymen Yurdcu|TR|25|AM|56
53|Yiğit Baynazoğlu|TR|25|CM|55
66|Oğuzhan Aksoy|TR|25|DM|55
77|Yusuf Kefkir|TR|25|CB|53
92|Savaş Ala|TR|25|AM|54
99|Yılmaz Cin|TR|25|RW|52
` },
  "umr": { coach: "Tayfun Rıdvan Albayrak", capacity: 3425, players: `
11|Álex Blanco|ES|27|ST|66
7|Santeri Hostikka|FI|28|ST|66
27|Cebio Soukou|BJ|33|RW|63
77|Tunahan Taşçı|TR|24|LW|63|K:Konyaspor
10|Andrej Đokanović|BA|25|CM|62
5|Kubilay Aktaş|TR|31|CM|64
66|Ali Yaşar|TR|31|CB|62
20|Atalay Babacan|TR|26|DM|62
44|Tomislav Glumac|HR|35|CB|60
28|Oğuzhan Aydoğan|DE|29|AM|60
9|Melih Bostan|TR|22|ST|59|K:Konyaspor
16|Kerem Şen|TR|24|CM|58
53|Burak Öksüz|TR|30|CB|59
4|Mustafa Eser|TR|24|CB|57
8|Serkan Göksu|TR|33|DM|57
35|Cihan Topaloğlu|TR|34|GK|53
13|Özgün Köklü|TR|25|GK|55
17|Berat Yılmaz|TR|25|AM|55|K:Galatasaray
18|Talha Özdemir|TR|25|RW|55
26|Batuhan Çakır|TR|25|RB|53
30|Yusuf Şaş|TR|25|CM|53
31|Deniz Aksoy|TR|25|LW|51
58|Mustafa Kartal|TR|25|LB|51
70|Oğuz Yıldırım|TR|25|CB|51
88|Emre Gedik|TR|25|RB|48
99|Onur Yıldırım|TR|25|GK|46
` },
  "van": { coach: "Osman Zeki Korkmaz", capacity: 5885, players: `
30|Richairo Živković|CW|29|ST|66
10|Ozan Kökcü|AZ|27|CM|65
-|Alvaro de Oliveira|AE|25|ST|62
7|Ilias Alhaft|NL|29|RW|61
15|Tenton Yenne|NG|26|LW|62
8|Molik Khan|TT|22|CM|61
27|Jurgen Bardhi|AL|28|DM|60
1|Alperen Uysal|TR|32|GK|60
-|Kadir Seven|TR|23|CB|59
19|Hikmet Çiftçi|TR|28|AM|59
61|Faruk Can Genç|TR|26|CB|59
5|Sinan Osmanoğlu|TR|36|CB|55
22|Abdulsamed Damlu|TR|27|GK|57
58|Özkan Yiğiter|TR|26|CM|57
3|Şahan Aslan|TR|25|CB|56
6|Anıl Yıldırım|TR|25|DM|55
11|Mehmet Manış|TR|25|ST|54
13|Naby Oularé|GN|25|RB|54
17|İlkan Sever|TR|25|RW|54
25|Furkan Özhan|TR|25|LW|51
33|Çınar Benzer|TR|25|GK|50
35|Batuhan İşçiler|TR|25|LB|51
41|Mehmet Özcan|TR|25|AM|49
46|Mehmet Davarcıoğlu|TR|25|ST|48
53|Güvenç Usta|TR|25|CB|48
57|Abdulsamet Kayman|TR|25|CM|46
65|Medeni Bingöl|TR|25|RB|46
77|Celal Hanalp|TR|25|LB|44
80|Soran Tümen|TR|25|DM|43
91|Boran Yağızer|TR|25|RW|43
97|Engin Taş|TR|25|CB|42
` },
  "ank": { coach: "Recep Karatepe", capacity: 20000, players: `
33|Diogo Coelho|PT|32|CB|66
21|Mahmut Tekdemir|TR|38|CB|60
70|Enes Tepecik|AT|22|CM|64
4|Özgür Aktaş|NL|29|CB|62
88|Osman Çelik|TR|34|CM|63
3|Halil İbrahim Pehlivan|TR|33|CB|62
16|İsmail Çokçalış|TR|26|RB|62
10|Yusuf Emre Gültekin|TR|33|DM|61
2|Berat Dolu|TR|25|LB|61
5|Mesut Kesik|DE|25|AM|61
9|Atakan Güner|TR|25|ST|59
15|Yusuf Eren Göktaş|TR|25|CB|57
17|Recep Yiğit Sevinç|TR|25|ST|57
19|Fatih Arhan|TR|25|CM|58
20|Arda Doğan|TR|25|RB|56
22|Mert Can|TR|25|LB|57
23|Hüseyin Sevgili|TR|25|CB|56
27|Kürşat Gül|TR|25|GK|54
28|Fatih Demir|TR|25|GK|53
40|Ahmet Emre Polat|TR|25|DM|53
41|Mervan Yiğit|TR|25|RW|52
44|Bedirhan Karababa|TR|25|AM|52
46|Mehmet Aydoğan|TR|25|RB|51
55|Batuhan Gürsoy|TR|25|LW|51
77|Zahir Ersari|TR|25|LB|48
90|Miraç Şimşek|TR|25|CB|47
91|Görkem Cihan|TR|25|GK|45
97|Turgut Yazgan|TR|25|CM|45
25|Ertaç Özbir|TR|36|GK|41
` },
  "alt": { coach: "Gökhan Karaaslan", capacity: 12285, players: `
6|Ceyhun Gülselam|TR|38|CM|60
1|Ozan Evrim Özenç|TR|33|GK|64
63|Deniz Kadah|TR|40|ST|57
3|Yusuf Tekin|TR|25|CB|61
4|Hikmet Çolak|TR|25|CB|60
5|Sefa Özdemir|TR|25|CB|61
7|Caner Baycan|TR|25|CM|60
8|Murat Demir|TR|25|DM|60
9|Onur Yıldız|TR|25|ST|60
11|Murat Uluç|TR|25|RW|58
13|Ulaş Hasan Özçelik|TR|25|GK|57
16|Semih Mendeş|TR|25|GK|56
17|Emre Tangeldi|TR|25|LW|56
18|Salih Oktay|TR|25|CB|56
20|Mert Yıldırım|TR|25|RB|54
22|Mehmet Kaymaz|TR|25|ST|55
25|İsa Toygar Ekinci|TR|25|AM|54
26|Ege Parmaksiz|TR|25|CM|53
28|Mehmet Gündüz|TR|25|DM|52
30|Efe Sarıkaya|TR|25|LB|51
32|Arda Gezer|TR|25|AM|50
35|Ali Kızılkuyu|TR|25|CM|49
44|Kuban Altunbudak|TR|25|CB|48
77|Onur Efe|TR|25|RB|48
99|Ünal Alihan Kavlak|TR|25|RW|46
88|Özgür Özkaya|TR|38|LB|42
` },
  "den": { coach: "Yavuz Özkan", capacity: 18745, players: `
3|Emre Yıldırım|TR|24|CB|62
20|Abdülkadir Sünger|TR|26|GK|61
11|Mehmet Ali Ulaman|TR|23|ST|62
4|Muhammet Özkal|TR|26|CB|62
5|Emirhan Kaşcıoğlu|TR|25|CB|60
37|Alaattin Öner|TR|22|CM|60
26|Gökhan Süzen|TR|39|CB|55
16|Eren Kıryolcu|TR|23|RB|59
1|Ali Eren Yalçın|TR|25|GK|59
6|Mehmet Eren Sıngın|TR|25|LB|57
7|Alihan Kalkan|TR|25|ST|58
10|Omer Gündüz|TR|25|CM|55
17|Deniz Kodal|TR|25|RW|56
24|Oktay Kısaoğlu|TR|25|CB|56
25|Yusuf Emre İnanır|TR|25|DM|54
27|Emre Sağlık|TR|25|RB|54
31|Ertuğrul Bağ|TR|25|GK|51
42|Ahmet Tekin|TR|25|LB|53
45|Emre Burgaz|TR|25|CB|51
53|Mustafa Kemal Naza|TR|25|RB|50
66|Berkant Gündem|TR|25|LB|51
77|Emre Furtana|TR|25|AM|48
` },
  "gir": { coach: "Adil Tozlu", capacity: 21166, players: `
9|Mert Kurt|TR|23|ST|65
5|Faustin Senghor|SN|32|CM|64
4|Fatih Yılmaz|TR|24|CB|63
28|Erol Can Akdağ|TR|30|CM|62
17|Şahin Dik|TR|25|CB|61
21|Miraç Çakıroğlu|TR|25|ST|59
22|Ali Akçay|TR|25|CB|59
23|Ertuğrul Şenlikoğlu|TR|25|CB|59
24|Göktan Cörüt|TR|25|GK|59
30|Yunus Emre Kobya|TR|25|RW|58
50|Barış Gün|TR|25|RB|56
63|Mustafa Eren Keskin|TR|25|LW|57
66|Alperen Köşker|TR|25|DM|55
70|Emre Nizam|TR|25|ST|56
77|Mehmet Keskin|TR|25|LB|55
81|Enishan Ceylan|TR|25|AM|53
82|Arda Cebeci|TR|25|CM|54
84|Metin Caner Akbayrak|TR|25|CB|52
88|Ahmet Kara|TR|25|RB|53
97|Furkan Kütük|TR|25|DM|51
-|Efe Salih Oksal|TR|25|GK|50
` },
  "ads": { coach: "Kubilayhan Yücel", capacity: 30960, players: `
2|Enes Demirtaş|TR|25|CB|64
3|Hasan Alp Kaya|TR|25|CB|63
4|Aslan Atay|TR|25|CB|63
7|Sefa Gülay|TR|25|ST|63
14|Demir Yavuz|TR|25|CM|61
15|Diyar Zengin|TR|25|ST|61
16|Kürşat Türkeş Küçük|TR|25|CM|60
17|Mert Menemencioğlu|TR|25|CB|59
18|Ahmet Bolat|TR|25|RW|59
20|Ahmet Arda Birinci|TR|25|LW|60
22|Gökdeniz Tunç|TR|25|ST|57
23|Yusuf Demirkıran|TR|25|RB|58
24|Aykut Sarıkaya|TR|25|LB|57
25|Murat Eser|TR|25|GK|55
26|Doğuhan Asım Dübüş|TR|25|CB|55
27|Ata Gül|TR|25|GK|54
30|Yücel Gürol|TR|25|RB|55
43|Ali Fidan|TR|25|LB|54
61|Ali Arda Yıldız|TR|25|CB|52
66|Halil Eray Aktaş|TR|25|DM|53
77|Osman Kaynak|TR|25|RW|51
80|Ahmet Yılmaz|TR|25|AM|50
87|Ulaş İmergi|TR|25|CM|50
88|Kayra Saygan|TR|25|DM|49
99|Eren Fidan|TR|25|GK|45
` },
  "hat": { coach: "Bekir İrtegün", capacity: 9800, players: `
7|Funsho Bamgboye|NG|27|ST|64
5|Hakan Çinemre|TR|32|CB|62
15|Burak Yılmaz|TR|30|CB|62
85|Ensar Arslan|TR|25|ST|63
13|Engin Can Aksoy|TR|22|CB|61
4|Muhammed Gönülaçar|TR|25|CM|60
6|Baran Sarka|TR|25|CM|59
17|Yilmaz Cin|TR|25|RW|60|K:Sivasspor
18|Ünal Durmuşhan|TR|25|LW|59
20|Ali Yıldız|TR|25|DM|60
21|Seyit Gazanfer|TR|25|CB|59
23|Cenk Doğan|TR|25|RB|57
25|Yunus Azrak|TR|25|ST|56
26|Birhan Vatansever|TR|25|AM|56
30|Eren Güler|TR|25|RW|55
33|Ersin Aydemir|TR|25|LB|54
34|Demir Sarıcalı|TR|25|GK|53
44|Taylan Özgün|TR|25|LW|53
47|Sinan Özen|NL|25|CB|52
48|Sharif Ozman|GH|25|CM|51
57|Musa Abdulahi Danjuma|NG|25|ST|52
66|Abdulkadir Adıyaman|TR|25|RB|51
71|Mert Çiçek|TR|25|GK|48
78|Emir Dadük|TR|25|GK|48
81|Rakhim Chaadaev|RU|25|DM|46|K:Angusht Nazran
84|Halil Cen Cemali|TR|25|AM|47
86|Mehmet Haluk Alagöz|TR|25|CM|46
90|Prince Ating|NG|25|RW|45
97|Melih Şen|TR|25|LB|44
98|Mustafa Said Aydın|TR|25|DM|42
` },
  "tuz": { coach: "Eren Şafak", capacity: 2581, players: `
1|Harun Tekin|TR|37|GK|60
17|Muhammed Enes Durmuş|TR|29|ST|61
53|Ozan Papaker|TR|30|ST|62
11|Berkay Sefa Kara|TR|27|RW|62
2|Berat Köşker|TR|25|CB|61
4|Doğan Ateş|TR|25|CM|61
7|Melik Derin|TR|25|LW|60
8|Merdan Erdinç|TR|25|CM|58
9|Seçkin Batuhan Fırıncı|TR|25|ST|59
10|Yusuf Akyel|TR|25|DM|57
15|Yunus Mertoğlu|TR|25|AM|58
16|Muhammed İlham Mallayev|TR|25|RW|55
18|Zihni Temelci|TR|25|CM|55
20|Baran Zan|TR|25|DM|55
22|Dursun Ali Emirhan Topal|TR|25|CB|54
23|Arda Çağdaş|TR|25|AM|55
26|Onur Arıkan|TR|25|CB|53
27|Anıl Can Bozkuş|TR|25|GK|52
28|Reşo Akın|TR|25|CM|52
31|Görkem Demiryürek|TR|25|GK|49
34|Turan Tuzlacık|NL|25|CB|51
35|Kurtuluş Yurt|TR|25|GK|47
37|Utku Kayra Yılmaz|TR|25|DM|49
41|Volkan Mert Korkmaz|TR|25|GK|46
46|Erhan Kara|TR|25|RB|46
50|Efe Geçim|TR|25|AM|44
61|Ahmet Enes Menteşe|TR|25|CM|44
62|Ulaş Oktay Yıldız|TR|25|DM|42|K:Fatih Karagümrük
90|Yusuf Avcılar|TR|25|LB|43
95|Seyfi Boran Özkan|TR|25|LW|42
99|Berat Ali Genç|TR|25|ST|40
-|Alp Koçaş|TR|25|CB|40
-|Yusuf Baran Öner|TR|25|AM|40
-|Ege Türkeri|TR|25|CM|40
` },
  "aln": { coach: "Yusuf Şimşek", capacity: 9138, players: null },
  "url": { coach: "Mesut Bakkal", capacity: 21541, players: `
5|Levent Gülen|CH|32|CB|62
26|Hasan Hüseyin Acar|TR|31|CM|62
14|Berk İsmail Ünsal|TR|32|ST|61
7|Berk Yıldız|TR|30|ST|61
2|Burak Çamoğlu|TR|29|CB|61
70|Vedat Bora|TR|31|CM|59
99|Sinan Kurumuş|TR|32|RW|59
23|Çınar Tarhan|TR|29|DM|60
11|Emircan Altıntaş|TR|31|LW|59
9|Safa Kınalı|TR|27|ST|59
67|Onur Karakabak|TR|34|CB|57
37|Recep Yemişçi|TR|27|CB|56
1|Ahmet Güneş|TR|25|GK|55
8|Turan Çalhanoğlu|DE|25|RW|54
16|Burak Öğür|TR|25|GK|53
17|Yılmaz Ceylan|TR|25|LW|53
19|Erkan Sasa|TR|25|RB|54|K:Amedspor
22|Mehmet İlhan|TR|25|ST|53
24|Mert Çölgeçen|TR|25|AM|52
30|Salih Şen|TR|25|CM|50
35|Mazlum Demir|TR|25|LB|50
48|Ali Kerem Bostancı|TR|25|CB|49
63|Mahmut Küçük|TR|25|DM|49
66|Güney Tutcuoğlu|TR|25|AM|48
77|Arda Yılmaztürk|TR|25|RB|47
` },
  "men": { coach: "Yılmaz Vural", capacity: 5000, players: `
9|Baran Demiroğlu|TR|21|ST|61
4|Eren Fansa|TR|23|CB|62
22|Yusuf Abdioğlu|TR|36|CB|59
70|Efe Taylan Altunkara|TR|25|ST|60|K:Manisa FK
3|Hakan Özkan|TR|25|CB|59
5|Onur Akdeniz|TR|25|CB|58
6|Batuhan Özduran|TR|25|RB|59
7|Burak Yeşilay|TR|25|RW|57
8|Emre Keskin|TR|25|CM|58
10|Seçim Can Koç|TR|25|LW|56
11|Yunus Emre Karagöz|TR|25|CM|56
14|Alican Özfesli|TR|25|DM|54
17|Berkant Kök|TR|25|ST|55
18|Ahmet Kartal Dede|TR|25|AM|54
19|Burak Tolunay Sekin|TR|25|RW|53
25|Yiğit Kerem|TR|25|CM|52
27|Çağan Taş|TR|25|LW|53
28|Mustafa Can Birol|TR|25|DM|51
30|Emir Akay|TR|25|GK|48
33|Burak Enes Yıkıcı|TR|25|AM|50|K:Gaziantep FK
53|Hakan Selim Yıldız|TR|25|LB|49
55|Alper Efe Pazar|TR|25|CM|47|K:Samsunspor
58|Fırat Arslan|TR|25|CB|47
77|Eyüp Poyraz|TR|25|RB|46
80|Erkan Gövercin|TR|25|DM|45
94|Kerem Korkmaz|TR|25|AM|45
` },
  "ksk": { coach: "Burhanettin Basatemür", capacity: 15000, players: `
45|Yasin Uzunoğlu|TR|25|ST|63|K:Muğlaspor
1|Bayram Kılıç|TR|25|GK|62
2|Harun Kaya|TR|25|CB|62
3|Ferdi Burgaz|TR|25|CB|62
4|Menderes Şahin|TR|25|CB|61
6|Alpay Eroğlu|TR|25|CM|60
7|Namık Barış Çelik|TR|25|ST|59
8|Mücahit Aslan|TR|25|CM|60
9|Hamza Küçükköylü|TR|25|RW|60
10|Erhan Öztürk|TR|25|LW|59
11|Onur İnan|TR|25|DM|58|K:Başakşehir
13|Muharrem Tunay Meral|TR|25|GK|56
20|Doğanay Avcı|TR|25|AM|56|K:Çaykur Rizespor
22|Arda Baran Eren|TR|25|CB|56
23|Hıdır Aytekin|TR|25|RB|55
37|Samet Seymen Sargın|TR|25|CM|54|K:Fenerbahçe
41|Erol Zöngür|TR|25|LB|54
48|Sadri Ege Dipci|TR|25|GK|52
54|Muhammet Ensar Akgün|TR|25|CB|52
59|Adem Yeşilyurt|TR|25|DM|50
81|Ahmet Yağız Mengi|TR|25|AM|50|K:Beşiktaş
88|Efe Kartal Yıldız|TR|25|CM|49
90|Selahattin Çankırlı|TR|25|ST|49
93|Selim Demirci|TR|25|DM|48
95|Berat Şahin|TR|25|AM|47
99|Mehmet Güneş|TR|25|CM|45
14|Tolga Ünlü|DE|36|RB|43
` },
  "esk": { coach: "Ümit Metin Yıldız", capacity: 32500, players: `
1|Efehan Kaptan|TR|25|GK|65
3|Muhammet Akbulut|TR|25|CB|63
4|Hasan Ulaş Uyğur|TR|25|CM|62
5|Arda Okumuş|TR|25|CB|61
6|Kaan Gaman|TR|25|CM|62
7|Göktuğ Ünüvar|TR|25|ST|61
9|Onur Arı|TR|25|ST|60
10|Tolga Yakut|TR|25|DM|59
11|Onurhan Uyanık|TR|25|AM|59
17|Selman Çiftkanatlı|TR|25|CB|58
20|Bedirhan Akçay|TR|25|CM|56
21|Utku Kızılkaya|TR|25|DM|57
22|Metehan Toprak|TR|25|RW|55
25|Eray Ertorun|BE|25|CB|55
26|Berkay Tanır|AT|25|AM|56
30|Eren Altıntaş|TR|25|CM|55
34|Yunus Emre Alagöz|TR|25|DM|55
44|Sezgin Çolpan|TR|25|RB|53
77|Cihangir Çağlıyan|TR|25|LB|52
90|Hasan Alp Altınoluk|TR|25|LW|52
97|Ömer Faruk Söyler|TR|25|AM|49
-|Ozan İsmail Koç|TR|25|CM|49
8|Onur Bayramoğlu|TR|36|DM|46
` },
};

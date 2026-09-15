// Üretilen oyuncular için ülkelere göre isim havuzları.

const G = {
  en: {
    first: ['James', 'Jack', 'Harry', 'Oliver', 'George', 'Charlie', 'Alfie', 'Callum', 'Kyle', 'Ryan', 'Lewis', 'Jordan', 'Mason', 'Jamie', 'Connor', 'Liam', 'Reece', 'Ben', 'Tom', 'Sam', 'Aaron', 'Dominic', 'Joe', 'Marcus'],
    last: ['Smith', 'Walker', 'Taylor', 'Wright', 'Robinson', 'Hughes', 'Clarke', 'Johnson', 'Palmer', 'Morgan', 'Barnes', 'Mitchell', 'Ward', 'Carter', 'Bennett', 'Lloyd', 'Harrison', 'Cole', 'Fletcher', 'Gibbs', 'Shaw', 'Watson', 'Simpson', 'Young', 'Murray', 'Kennedy', 'Doyle', 'Reid'],
  },
  es: {
    first: ['Pablo', 'Álvaro', 'Sergio', 'Diego', 'Javier', 'Carlos', 'Marcos', 'Iker', 'Raúl', 'Hugo', 'Adrián', 'Mario', 'Daniel', 'Rubén', 'Óscar', 'Unai', 'Aitor', 'Jorge', 'Víctor', 'Fran', 'Nico', 'Mikel', 'Rodrigo', 'Gonzalo'],
    last: ['García', 'Martínez', 'López', 'Sánchez', 'Romero', 'Navarro', 'Torres', 'Ruiz', 'Morales', 'Ortega', 'Delgado', 'Castro', 'Vidal', 'Iglesias', 'Molina', 'Herrera', 'Gil', 'Cabrera', 'Soler', 'Llorente', 'Zubimendi', 'Oyarzabal', 'Pedraza', 'Merino'],
  },
  it: {
    first: ['Lorenzo', 'Matteo', 'Alessandro', 'Federico', 'Nicolò', 'Davide', 'Giacomo', 'Andrea', 'Riccardo', 'Tommaso', 'Gianluca', 'Marco', 'Stefano', 'Luca', 'Simone', 'Filippo', 'Manuel', 'Alessio', 'Francesco', 'Samuele'],
    last: ['Rossi', 'Bianchi', 'Esposito', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Galli', 'Conti', 'De Luca', 'Mancini', 'Barbieri', 'Lombardi', 'Moretti', 'Fontana', 'Rinaldi', 'Caruso', 'Ferri', 'Colombo', 'Gatti', 'Bastoni', 'Scamacca'],
  },
  de: {
    first: ['Leon', 'Lukas', 'Felix', 'Jonas', 'Maximilian', 'Niklas', 'Tim', 'Florian', 'Julian', 'Kai', 'Jan', 'Moritz', 'Paul', 'Timo', 'David', 'Robin', 'Marvin', 'Nico', 'Benjamin', 'Tobias'],
    last: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Wagner', 'Becker', 'Hoffmann', 'Koch', 'Richter', 'Wolf', 'Schröder', 'Neumann', 'Braun', 'Zimmermann', 'Krüger', 'Hartmann', 'Lange', 'Werner', 'Keller', 'Baumann', 'Vogel'],
  },
  fr: {
    first: ['Hugo', 'Lucas', 'Théo', 'Mathis', 'Enzo', 'Nathan', 'Maxime', 'Antoine', 'Kylian', 'Jules', 'Adrien', 'Clément', 'Rayan', 'Yanis', 'Mehdi', 'Bastien', 'Florian', 'Axel', 'Warren', 'Désiré'],
    last: ['Martin', 'Bernard', 'Dubois', 'Laurent', 'Lefèvre', 'Girard', 'Fournier', 'Mercier', 'Rousseau', 'Blanc', 'Guerin', 'Faure', 'Chevalier', 'Gautier', 'Perrin', 'Robin', 'Clement', 'Morel', 'Lemoine', 'Camara', 'Koné', 'Diallo'],
  },
  pt: {
    first: ['João', 'Diogo', 'Tiago', 'Rafael', 'Gonçalo', 'Pedro', 'Bruno', 'Rúben', 'André', 'Nuno', 'Francisco', 'Miguel', 'Vitinha', 'Ricardo', 'Hugo', 'Fábio', 'Samuel', 'Martim'],
    last: ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Costa', 'Oliveira', 'Rodrigues', 'Martins', 'Sousa', 'Fernandes', 'Gomes', 'Lopes', 'Marques', 'Almeida', 'Carvalho', 'Teixeira', 'Neves', 'Cancelo', 'Palhinha', 'Mendes'],
  },
  br: {
    first: ['Gabriel', 'Lucas', 'Matheus', 'Vinícius', 'Rodrygo', 'Bruno', 'Felipe', 'Igor', 'Thiago', 'Wesley', 'Douglas', 'Paulinho', 'Danilo', 'Éverton', 'Caio', 'Renan', 'Lucão', 'Wendell', 'Murilo', 'João Pedro'],
    last: ['Silva', 'Souza', 'Oliveira', 'Lima', 'Ribeiro', 'Alves', 'Barbosa', 'Moura', 'Cardoso', 'Rocha', 'Dias', 'Nascimento', 'Freitas', 'Araújo', 'Pinto', 'Teixeira', 'Andrade', 'Gomes'],
  },
  nl: {
    first: ['Daan', 'Sem', 'Lucas', 'Milan', 'Thijs', 'Jesse', 'Bram', 'Ruben', 'Stijn', 'Joey', 'Kenneth', 'Wout', 'Jurriën', 'Xavi', 'Quinten', 'Mats', 'Luuk', 'Tygo'],
    last: ['de Jong', 'Janssen', 'de Vries', 'van Dijk', 'Bakker', 'Visser', 'Smit', 'Meijer', 'Mulder', 'de Boer', 'Bos', 'Vos', 'Peters', 'Hendriks', 'van Leeuwen', 'Koopmeiners', 'Timber', 'Gravenberch', 'Wijnaldum'],
  },
  nordic: {
    first: ['Erik', 'Lars', 'Magnus', 'Oscar', 'Emil', 'Mathias', 'Jonas', 'Kasper', 'Andreas', 'Mikkel', 'Sander', 'Viktor', 'Anton', 'Joakim', 'Rasmus', 'Kristian', 'Elias', 'Hugo'],
    last: ['Hansen', 'Johansen', 'Nielsen', 'Andersen', 'Pedersen', 'Larsen', 'Berg', 'Lindqvist', 'Eriksson', 'Karlsson', 'Nilsson', 'Solberg', 'Haugen', 'Jensen', 'Kristensen', 'Lund', 'Dahl', 'Holm', 'Virtanen', 'Korhonen'],
  },
  cz: {
    first: ['Jakub', 'Tomáš', 'Lukáš', 'Ondřej', 'Adam', 'Matěj', 'Martin', 'David', 'Jan', 'Filip', 'Patrik', 'Michal', 'Marek', 'Dominik', 'Vladimír', 'Peter'],
    last: ['Novák', 'Svoboda', 'Dvořák', 'Černý', 'Procházka', 'Kučera', 'Veselý', 'Horák', 'Němec', 'Pokorný', 'Král', 'Hašek', 'Škriniar', 'Hamšík', 'Kováč', 'Sobota', 'Holeš'],
  },
  pl: {
    first: ['Jakub', 'Kacper', 'Mateusz', 'Bartosz', 'Piotr', 'Kamil', 'Szymon', 'Michał', 'Paweł', 'Łukasz', 'Filip', 'Dawid', 'Krystian', 'Przemysław'],
    last: ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Piątek', 'Grabara', 'Kiwior'],
  },
  hr: {
    first: ['Luka', 'Ivan', 'Marko', 'Josip', 'Nikola', 'Stefan', 'Filip', 'Mateo', 'Dario', 'Ante', 'Dušan', 'Aleksandar', 'Mihailo', 'Jan', 'Žan', 'Amar', 'Edin'],
    last: ['Horvat', 'Kovačević', 'Babić', 'Marić', 'Jurić', 'Petrović', 'Jovanović', 'Nikolić', 'Pavlović', 'Ilić', 'Stanković', 'Mlakar', 'Zupan', 'Hodžić', 'Begić', 'Perišić', 'Vlašić', 'Milinković'],
  },
  gr: {
    first: ['Giorgos', 'Dimitris', 'Konstantinos', 'Nikos', 'Christos', 'Vasilis', 'Panagiotis', 'Andreas', 'Kostas', 'Stavros', 'Michalis', 'Fotis', 'Charalampos'],
    last: ['Papadopoulos', 'Georgiou', 'Nikolaou', 'Pappas', 'Vlachos', 'Konstantinou', 'Ioannou', 'Karagiannis', 'Mavropanos', 'Tzolis', 'Bakasetas', 'Pelkas', 'Christodoulou', 'Charalambous'],
  },
  ua: {
    first: ['Oleksandr', 'Mykola', 'Andriy', 'Viktor', 'Dmytro', 'Artem', 'Serhiy', 'Heorhiy', 'Yehor', 'Ilya', 'Maksym', 'Denys', 'Vladislav', 'Kirill'],
    last: ['Shevchenko', 'Kovalenko', 'Bondarenko', 'Tkachenko', 'Kravchenko', 'Mudryk', 'Zinchenko', 'Sudakov', 'Tymchyk', 'Ivanov', 'Smirnov', 'Petrov', 'Volkov', 'Sokolov'],
  },
  hu: {
    first: ['Dominik', 'Bence', 'Márton', 'Ádám', 'Dániel', 'Roland', 'Barnabás', 'Kristóf', 'Levente', 'Zsolt', 'Attila'],
    last: ['Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Kiss', 'Molnár', 'Németh', 'Farkas', 'Balogh', 'Szoboszlai', 'Sallai'],
  },
  ro: {
    first: ['Andrei', 'Alexandru', 'Ionuț', 'Florin', 'Răzvan', 'Denis', 'Nicolae', 'Vlad', 'Darius', 'Mihai', 'Radu'],
    last: ['Popescu', 'Ionescu', 'Stanciu', 'Dumitru', 'Munteanu', 'Radu', 'Marin', 'Drăguș', 'Hagi', 'Mitriță', 'Nedelcearu'],
  },
  bg: {
    first: ['Georgi', 'Ivan', 'Dimitar', 'Nikolay', 'Petar', 'Kristian', 'Martin', 'Todor', 'Radoslav'],
    last: ['Ivanov', 'Georgiev', 'Dimitrov', 'Petrov', 'Nikolov', 'Todorov', 'Stoyanov', 'Kostov', 'Despodov'],
  },
  al: {
    first: ['Arber', 'Ermal', 'Klaus', 'Taulant', 'Elseid', 'Kristjan', 'Nedim', 'Armando', 'Myrto', 'Jasir'],
    last: ['Hoxha', 'Berisha', 'Krasniqi', 'Gashi', 'Shala', 'Asllani', 'Broja', 'Uzuni', 'Djimsiti', 'Bajrami'],
  },
  turkic: {
    first: ['Emin', 'Ramil', 'Mahir', 'Anatoliy', 'Abat', 'Nuraly', 'Toral', 'Rustam', 'Elvin', 'Islam', 'Bauyrzhan'],
    last: ['Mahmudov', 'Aliyev', 'Guliyev', 'Mammadov', 'Zhaksylykov', 'Satpaev', 'Bayramov', 'Hüseynov', 'Nurmagambetov', 'Seydakhmet'],
  },
  ge: {
    first: ['Giorgi', 'Levan', 'Luka', 'Otar', 'Zuriko', 'Saba', 'Nika', 'Guram'],
    last: ['Mamardashvili', 'Kvaratskhelia', 'Mikautadze', 'Kochorashvili', 'Lochoshvili', 'Kiteishvili', 'Beridze', 'Tsitaishvili'],
  },
  am: {
    first: ['Henrikh', 'Tigran', 'Hovhannes', 'Artak', 'Narek', 'Eduard', 'Vahan'],
    last: ['Barseghyan', 'Hambardzumyan', 'Grigoryan', 'Spertsyan', 'Dashyan', 'Harutyunyan', 'Ranos'],
  },
  il: {
    first: ['Eran', 'Manor', 'Dor', 'Liel', 'Oscar', 'Gabi', 'Eden', 'Omer', 'Shon'],
    last: ['Zahavi', 'Solomon', 'Peretz', 'Abada', 'Gloukh', 'Kanichowsky', 'Dasa', 'Weissman', 'Turgeman'],
  },
  ar: {
    first: ['Mohammed', 'Salem', 'Saud', 'Abdullah', 'Firas', 'Yasser', 'Nasser', 'Sultan', 'Hassan', 'Ali'],
    last: ['Al-Dawsari', 'Al-Shehri', 'Al-Buraikan', 'Kanno', 'Al-Faraj', 'Al-Ghannam', 'Al-Tambakti', 'Al-Amri', 'Abdulhamid'],
  },
  baltic: {
    first: ['Jānis', 'Mārtiņš', 'Kristers', 'Rokas', 'Gvidas', 'Edgaras', 'Vytautas', 'Roberts'],
    last: ['Ikaunieks', 'Zjuzins', 'Savaļnieks', 'Girdvainis', 'Lasickas', 'Sirvys', 'Uldriķis', 'Kazlauskas'],
  },
  latam: {
    first: ['Julián', 'Lautaro', 'Enzo', 'Nicolás', 'Facundo', 'Federico', 'Luis', 'Darwin', 'Juan', 'Santiago', 'Matías', 'Rodrigo', 'Jhon', 'Cristian'],
    last: ['González', 'Fernández', 'Álvarez', 'Martínez', 'Rodríguez', 'Pérez', 'Gómez', 'Núñez', 'Valverde', 'Suárez', 'Díaz', 'Arias', 'Mac Allister', 'Lo Celso'],
  },
  afr: {
    first: ['Victor', 'Samuel', 'Moses', 'Kelechi', 'Emmanuel', 'Ibrahim', 'Mohamed', 'Ismaïla', 'Sadio', 'Idrissa', 'Franck', 'Wilfried', 'Serge', 'André', 'Thomas', 'Kofi', 'Yaw'],
    last: ['Osimhen', 'Chukwueze', 'Iwobi', 'Ndidi', 'Mané', 'Sarr', 'Diatta', 'Gueye', 'Kessié', 'Zaha', 'Aurier', 'Anguissa', 'Onana', 'Partey', 'Kudus', 'Semenyo', 'Traoré', 'Touré', 'Bamba'],
  },
  ma: {
    first: ['Achraf', 'Hakim', 'Youssef', 'Sofiane', 'Azzedine', 'Bilal', 'Brahim', 'Nayef', 'Ilias', 'Amine'],
    last: ['Hakimi', 'Ziyech', 'En-Nesyri', 'Boufal', 'Ounahi', 'El Khannouss', 'Aguerd', 'Mazraoui', 'Amrabat', 'Saibari'],
  },
  jp: {
    first: ['Takumi', 'Kaoru', 'Takefusa', 'Daichi', 'Wataru', 'Ritsu', 'Kyogo', 'Ko', 'Hiroki', 'Ayase'],
    last: ['Minamino', 'Mitoma', 'Kubo', 'Kamada', 'Endo', 'Doan', 'Furuhashi', 'Itakura', 'Ito', 'Ueda'],
  },
  us: {
    first: ['Christian', 'Weston', 'Tyler', 'Gio', 'Brenden', 'Timothy', 'Sergiño', 'Folarin', 'Ricardo', 'Josh'],
    last: ['Pulisic', 'McKennie', 'Adams', 'Reyna', 'Aaronson', 'Weah', 'Dest', 'Balogun', 'Pepi', 'Sargent'],
  },
};

// Ülke kodu → isim grubu
const COUNTRY_GROUP = {
  EN: 'en', SC: 'en', GI: 'en', IE: 'en', US: 'us',
  ES: 'es', AD: 'es', IT: 'it', DE: 'de', AT: 'de', CH: 'de', FR: 'fr', BE: 'nl', NL: 'nl', PT: 'pt', BR: 'br',
  NO: 'nordic', SE: 'nordic', DK: 'nordic', FI: 'nordic', CZ: 'cz', SK: 'cz', PL: 'pl',
  HR: 'hr', RS: 'hr', BA: 'hr', SI: 'hr', GR: 'gr', CY: 'gr', UA: 'ua', RU: 'ua', HU: 'hu', RO: 'ro', BG: 'bg',
  AL: 'al', AZ: 'turkic', KZ: 'turkic', GE: 'ge', AM: 'am', IL: 'il', SA: 'ar', LV: 'baltic', LT: 'baltic',
  AR: 'latam', UY: 'latam', CO: 'latam', NG: 'afr', SN: 'afr', CI: 'afr', GH: 'afr', CM: 'afr', ML: 'afr', MA: 'ma', JP: 'jp',
};

// Kulüplere dışarıdan gelen oyuncuların ülke dağılımı
export const IMPORT_POOL = [
  ['BR', 20], ['FR', 12], ['AR', 8], ['ES', 8], ['PT', 6], ['NG', 6], ['SN', 6], ['CI', 5], ['NL', 5], ['DE', 5],
  ['EN', 4], ['HR', 4], ['RS', 4], ['DK', 3], ['CO', 3], ['UY', 3], ['MA', 3], ['GH', 3], ['CM', 3], ['JP', 2], ['US', 2],
];

export function namePool(country) {
  return G[COUNTRY_GROUP[country]] || null;
}

export const TR_NAMES = {
  first: ['Emir', 'Yusuf', 'Kerem', 'Arda', 'Mert', 'Eren', 'Efe', 'Berat', 'Ömer', 'Ali', 'Deniz', 'Kaan', 'Burak', 'Emre', 'Batuhan', 'Umut', 'Can', 'Onur', 'Furkan', 'Hakan', 'Alperen', 'Barış', 'Metehan', 'Doruk', 'Egemen', 'Taha', 'Yiğit', 'Serkan', 'Tuna', 'Utku', 'Oğuzhan', 'Enes', 'Muhammet', 'Sinan', 'Görkem', 'Cenk', 'Volkan', 'Tolga'],
  last: ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Korkmaz', 'Erdem', 'Güneş', 'Aksoy', 'Tekin', 'Bulut', 'Ünal', 'Yavuz', 'Karaca', 'Taş', 'Uçar', 'Akın', 'Keskin', 'Bozkurt', 'Güler', 'Duman', 'Sarı', 'Çakır', 'Ateş'],
};

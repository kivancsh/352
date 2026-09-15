#!/usr/bin/env python3
"""Avrupa ve Türkiye alt lig kulüplerinin güncel kadrolarını Wikipedia ve Wikidata'dan çeker.

Çıktı: tools/cache/raw.json (ham veri). Oyun verisini build_squads.py üretir.
Kullanım: python3 tools/fetch_squads.py
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')
os.makedirs(CACHE, exist_ok=True)
UA = 'SuperLigMenajer/1.0 (https://github.com/kivancsh/super-lig-menajer)'

CLUB_TITLES = {
    'psg': 'Paris Saint-Germain F.C.', 'bay': 'FC Bayern Munich', 'rma': 'Real Madrid CF', 'liv': 'Liverpool F.C.',
    'int': 'Inter Milan', 'mci': 'Manchester City F.C.', 'ars': 'Arsenal F.C.', 'bar': 'FC Barcelona',
    'atm': 'Atlético Madrid', 'bvb': 'Borussia Dortmund', 'rom': 'AS Roma', 'scp': 'Sporting CP',
    'avl': 'Aston Villa F.C.', 'por': 'FC Porto', 'mun': 'Manchester United F.C.', 'bru': 'Club Brugge KV',
    'bet': 'Real Betis', 'psv': 'PSV Eindhoven', 'fey': 'Feyenoord', 'lil': 'Lille OSC', 'bod': 'FK Bodø/Glimt',
    'nap': 'SSC Napoli', 'rbl': 'RB Leipzig', 'vil': 'Villarreal CF', 'sha': 'FC Shakhtar Donetsk',
    'sla': 'SK Slavia Prague', 'slb': 'ŠK Slovan Bratislava', 'stu': 'VfB Stuttgart', 'aek': 'AEK Athens F.C.',
    'lsk': 'LASK', 'com': 'Como 1907', 'len': 'RC Lens', 'vik': 'Viking FK', 'sab': 'Sabah FC (Azerbaijan)',
    'lev': 'Bayer 04 Leverkusen', 'ben': 'S.L. Benfica', 'juv': 'Juventus FC', 'mil': 'AC Milan',
    'lyo': 'Olympique Lyonnais', 'azk': 'AZ Alkmaar', 'oly': 'Olympiacos F.C.', 'rso': 'Real Sociedad',
    'om': 'Olympique de Marseille', 'fer': 'Ferencvárosi TC', 'plz': 'FC Viktoria Plzeň',
    'usg': 'Royale Union Saint-Gilloise', 'dzg': 'GNK Dinamo Zagreb', 'rbs': 'FC Red Bull Salzburg',
    'cel': 'Celtic F.C.', 'spa': 'AC Sparta Prague', 'ren': 'Stade Rennais F.C.', 'and': 'R.S.C. Anderlecht',
    'stg': 'SK Sturm Graz', 'lec': 'Lech Poznań', 'cry': 'Crystal Palace F.C.', 'bou': 'AFC Bournemouth',
    'sun': 'Sunderland A.F.C.', 'clj': 'NK Celje', 'jag': 'Jagiellonia Białystok', 'omo': 'AC Omonia',
    'rcv': 'RC Celta de Vigo', 'hof': 'TSG 1899 Hoffenheim', 'tor': 'S.C.U. Torreense',
    'hbs': "Hapoel Be'er Sheva F.C.", 'nec': 'NEC Nijmegen', 'ofi': 'OFI Crete F.C.', 'lil2': 'Lillestrøm SK',
    'lvs': 'PFC Levski Sofia', 'ara': 'FC Ararat-Armenia', 'ata': 'Atalanta BC', 'bra': 'S.C. Braga',
    'aja': 'AFC Ajax', 'scf': 'SC Freiburg', 'asm': 'AS Monaco FC', 'fck': 'F.C. Copenhagen',
    'fcm': 'FC Midtjylland', 'crv': 'Red Star Belgrade', 'gnt': 'K.A.A. Gent', 'pao': 'Panathinaikos F.C.',
    'paf': 'Pafos FC', 'bha': 'Brighton & Hove Albion F.C.', 'lug': 'FC Lugano', 'get': 'Getafe CF',
    'kup': 'Kuopion Palloseura', 'twe': 'FC Twente', 'lri': 'Lincoln Red Imps F.C.', 'bor': 'FK Borac Banja Luka',
    'stv': 'Sint-Truidense V.V.', 'brn': 'SK Brann', 'hea': 'Heart of Midlothian F.C.', 'kai': 'FC Kairat',
    'ucv': 'CS Universitatea Craiova', 'rig': 'Riga FC', 'haj': 'HNK Hajduk Split', 'jab': 'FK Jablonec',
    'fcn': 'FC Nordsjælland', 'agf': 'Aarhus Gymnastikforening', 'ice': "Inter Club d'Escaldes", 'thu': 'FC Thun',
    'csk': 'PFC CSKA Sofia', 'kza': 'FK Kauno Žalgiris', 'mja': 'Mjällby AIF', 'ibe': 'FC Iberia 1999',
    'egn': 'KF Egnatia', 'itu': 'FC Inter Turku', 'che': 'Chelsea F.C.', 'tot': 'Tottenham Hotspur F.C.',
    'new': 'Newcastle United F.C.', 'whu': 'West Ham United F.C.', 'eve': 'Everton F.C.', 'ful': 'Fulham F.C.',
    'nfo': 'Nottingham Forest F.C.', 'bur': 'Burnley F.C.', 'mid': 'Middlesbrough F.C.', 'sev': 'Sevilla FC',
    'val': 'Valencia CF', 'ath': 'Athletic Bilbao', 'cad': 'Cádiz CF', 'laz': 'SS Lazio', 'fio': 'ACF Fiorentina',
    'bol': 'Bologna FC 1909', 'cag': 'Cagliari Calcio', 'hve': 'Hellas Verona FC', 'sge': 'Eintracht Frankfurt',
    'wob': 'VfL Wolfsburg', 'bmg': 'Borussia Mönchengladbach', 'nic': 'OGC Nice', 'rcs': 'RC Strasbourg Alsace',
    'ran': 'Rangers F.C.', 'ceb': 'Cercle Brugge K.S.V.', 'yb': 'BSC Young Boys', 'zen': 'FC Zenit Saint Petersburg',
    'mha': 'Maccabi Haifa F.C.', 'gai': 'GAIS', 'hil': 'Al Hilal SFC', 'nas': 'Al Nassr FC', 'itt': 'Ittihad FC',
    'ahl': 'Al-Ahli Saudi FC', 'mia': 'Inter Miami CF', 'lag': 'LA Galaxy', 'clb': 'Columbus Crew',
    # Türkiye 1. Lig
    'ant': 'Antalyaspor', 'ban': 'Bandırmaspor', 'bat': 'Batman Petrolspor', 'bdr': 'Bodrum F.K.',
    'blu': 'Boluspor', 'brs': 'Bursaspor', 'ero': 'Esenler Erokspor', 'fkg': 'Fatih Karagümrük S.K.',
    'igd': 'Iğdır FK', 'ist': 'İstanbulspor', 'kay': 'Kayserispor', 'kec': 'Ankara Keçiörengücü S.K.',
    'man': 'Manisa FK', 'mrd': 'Mardin 1969 Spor', 'mug': 'Muğlaspor', 'pen': 'Pendikspor', 'sar': 'Sarıyer S.K.',
    'siv': 'Sivasspor', 'umr': 'Ümraniyespor', 'van': 'Vanspor FK',
    # Kupa için alt lig kulüpleri
    'ank': 'MKE Ankaragücü', 'alt': 'Altay S.K.', 'den': 'Denizlispor', 'gir': 'Giresunspor',
    'ads': 'Adana Demirspor', 'hat': 'Hatayspor', 'tuz': 'Tuzlaspor', 'aln': 'Altınordu F.K.',
    'url': 'Şanlıurfaspor', 'men': 'Menemen FK', 'ksk': 'Karşıyaka S.K.', 'esk': 'Eskişehirspor',
    # Süper Lig (sadece teknik direktör ve kiralık eşleştirmesi için)
    'gs': 'Galatasaray S.K. (football)', 'fb': 'Fenerbahçe S.K. (football)', 'bjk': 'Beşiktaş J.K.',
    'ts': 'Trabzonspor', 'ibfk': 'İstanbul Başakşehir F.K.', 'sam': 'Samsunspor', 'goz': 'Göztepe S.K.',
    'kas': 'Kasımpaşa S.K.', 'eyup': 'Eyüpspor', 'koc': 'Kocaelispor', 'gen': 'Gençlerbirliği S.K.',
    'ala': 'Alanyaspor', 'kon': 'Konyaspor', 'gfk': 'Gaziantep F.K.', 'riz': 'Çaykur Rizespor',
    'erz': 'Erzurumspor FK', 'amed': 'Amed S.F.K.', 'cor': 'Çorum FK',
}


def get(url, params, tries=5):
    q = url + '?' + urllib.parse.urlencode(params)
    for i in range(tries):
        try:
            req = urllib.request.Request(q, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except Exception as e:  # noqa
            if i == tries - 1:
                raise
            time.sleep(2 + i * 3)


WP = 'https://en.wikipedia.org/w/api.php'
WD = 'https://www.wikidata.org/w/api.php'


def fetch_page(title):
    d = get(WP, {'action': 'parse', 'page': title, 'prop': 'wikitext', 'redirects': 1, 'format': 'json', 'formatversion': 2})
    if 'error' in d:
        s = get(WP, {'action': 'query', 'list': 'search', 'srsearch': title + ' football club', 'srlimit': 1, 'format': 'json'})
        hits = s.get('query', {}).get('search', [])
        if not hits:
            return None
        d = get(WP, {'action': 'parse', 'page': hits[0]['title'], 'prop': 'wikitext', 'redirects': 1, 'format': 'json', 'formatversion': 2})
        if 'error' in d:
            return None
    return {'title': d['parse']['title'], 'wikitext': d['parse']['wikitext']}


def templates(text, names):
    """Wikitext içindeki verilen adlı şablonları (iç içe parantezleri gözeterek) döndürür."""
    out = []
    i = 0
    while True:
        j = text.find('{{', i)
        if j < 0:
            break
        m = re.match(r'\{\{\s*([^|}]+?)\s*\|', text[j:j + 80])
        depth, k = 0, j
        while k < len(text):
            if text.startswith('{{', k):
                depth += 1
                k += 2
            elif text.startswith('}}', k):
                depth -= 1
                k += 2
                if depth == 0:
                    break
            else:
                k += 1
        if m and m.group(1).strip().lower() in names:
            out.append((j, text[j + 2:k - 2]))
            i = k
        else:
            i = j + 2
    return out


def split_params(body):
    parts, depth, cur = [], 0, ''
    i = 0
    while i < len(body):
        two = body[i:i + 2]
        if two in ('{{', '[['):
            depth += 1
            cur += two
            i += 2
            continue
        if two in ('}}', ']]'):
            depth -= 1
            cur += two
            i += 2
            continue
        if body[i] == '|' and depth == 0:
            parts.append(cur)
            cur = ''
        else:
            cur += body[i]
        i += 1
    parts.append(cur)
    params = {}
    for p in parts[1:]:
        if '=' in p:
            k, v = p.split('=', 1)
            params[k.strip().lower()] = v.strip()
    return params


def link_of(v):
    m = re.search(r'\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]', v)
    if m:
        return m.group(1).strip(), (m.group(2) or m.group(1)).strip()
    m = re.search(r'\{\{\s*sortname\s*\|([^|}]*)\|([^|}]*)(?:\|([^|}=]*))?', v, re.I)
    if m:
        disp = (m.group(1).strip() + ' ' + m.group(2).strip()).strip()
        link = (m.group(3) or '').strip() or disp
        return link, disp
    plain = re.sub(r'\{\{[^}]*\}\}|<[^>]+>|\'\'+', '', v).strip()
    return None, plain


PLAYER_T = {'fs player', 'football squad player', 'fs2 player', 'football squad player2'}
BAD_HEAD = re.compile(r'youth|academy|reserve|under|u-?\d\d|\bb\b|ii\b|women|former|notable|retired|staff|record|captain|history|development|generation|dual|winner|legend|hall of fame|all-time|primavera|next gen|castilla|atlètic|juvenil|second team|jong|u2|u1', re.I)


def headings(text):
    return [(m.start(), m.group(2).strip()) for m in re.finditer(r'^(={2,6})\s*(.*?)\s*\1\s*$', text, re.M)]


def heading_at(heads, pos):
    h = ''
    for p, t in heads:
        if p < pos:
            h = t
        else:
            break
    return h


def parse_club(page):
    text = page['wikitext']
    heads = headings(text)
    players, loans = [], []
    for pos, body in templates(text, PLAYER_T):
        h = heading_at(heads, pos)
        prm = split_params(body)
        link, disp = link_of(prm.get('name', ''))
        if not disp:
            continue
        row = {'no': re.sub(r'\D', '', prm.get('no', '')) or None, 'nat': prm.get('nat', '').strip().upper(),
               'pos': prm.get('pos', '').strip().upper(), 'name': disp, 'link': link, 'other': prm.get('other', ''), 'head': h}
        if row['link'] and any(r['link'] == row['link'] for r in players + loans):
            continue
        if re.search(r'loan', h, re.I):
            loans.append(row)
        elif BAD_HEAD.search(h):
            continue
        else:
            players.append(row)
    info = {}
    ib = templates(text, {'infobox football club'})
    if ib:
        prm = split_params(ib[0][1])
        for key in ('manager', 'head coach', 'head_coach', 'coach'):
            if prm.get(key):
                info['coach'] = link_of(prm[key])[1]
                break
        if prm.get('ground'):
            info['ground'] = link_of(prm['ground'])[1]
        if prm.get('capacity'):
            m = re.search(r'\d[\d,.\s]*\d', re.sub(r'<ref.*?(</ref>|/>)', '', prm['capacity'], flags=re.S))
            if m:
                info['capacity'] = int(re.sub(r'\D', '', m.group(0)))
    return players, loans, info


def main():
    raw_path = os.path.join(CACHE, 'raw.json')
    pages_path = os.path.join(CACHE, 'pages.json')
    pages = json.load(open(pages_path)) if os.path.exists(pages_path) else {}
    todo = [cid for cid in CLUB_TITLES if cid not in pages]
    with ThreadPoolExecutor(6) as ex:
        for cid, pg in zip(todo, ex.map(lambda c: fetch_page(CLUB_TITLES[c]), todo)):
            pages[cid] = pg
            print('sayfa', cid, pg and pg['title'], file=sys.stderr)
    json.dump(pages, open(pages_path, 'w'))

    clubs = {}
    for cid, pg in pages.items():
        if not pg:
            clubs[cid] = {'title': None, 'players': [], 'loans': [], 'info': {}}
            continue
        players, loans, info = parse_club(pg)
        clubs[cid] = {'title': pg['title'], 'players': players, 'loans': loans, 'info': info}

    # Oyuncu sayfaları: yönlendirme, Wikidata kimliği ve son 60 gün görüntülenme
    links = sorted({r['link'] for c in clubs.values() for r in c['players'] + c['loans'] if r['link']})
    pinfo_path = os.path.join(CACHE, 'pinfo.json')
    pinfo = json.load(open(pinfo_path)) if os.path.exists(pinfo_path) else {}
    need = [l for l in links if l not in pinfo]

    def batch_query(chunk):
        res = {}
        params = {'action': 'query', 'titles': '|'.join(chunk), 'redirects': 1, 'prop': 'pageprops|pageviews',
                  'ppprop': 'wikibase_item', 'pvipdays': 60, 'format': 'json', 'formatversion': 2}
        norm = {}
        pages_out = {}
        cont = {}
        while True:
            d = get(WP, {**params, **cont})
            q = d.get('query', {})
            for n in q.get('normalized', []):
                norm[n['from']] = n['to']
            for n in q.get('redirects', []):
                norm[norm.get(n['from'], n['from'])] = n['to']
                for k, v in list(norm.items()):
                    if v == n['from']:
                        norm[k] = n['to']
            for p in q.get('pages', []):
                cur = pages_out.setdefault(p['title'], {'qid': None, 'views': 0, 'missing': p.get('missing', False)})
                if p.get('pageprops', {}).get('wikibase_item'):
                    cur['qid'] = p['pageprops']['wikibase_item']
                pv = p.get('pageviews')
                if pv:
                    cur['views'] = max(cur['views'], sum(v or 0 for v in pv.values()))
            if 'continue' in d:
                cont = d['continue']
            else:
                break
        for l in chunk:
            t = l
            seen = 0
            while t in norm and seen < 5:
                t = norm[t]
                seen += 1
            res[l] = {**pages_out.get(t, {'qid': None, 'views': 0, 'missing': True}), 'title': t}
        return res

    chunks = [need[i:i + 50] for i in range(0, len(need), 50)]
    with ThreadPoolExecutor(4) as ex:
        for n, r in enumerate(ex.map(batch_query, chunks)):
            pinfo.update(r)
            print('oyuncu sayfaları', (n + 1) * 50, '/', len(need), file=sys.stderr)
    json.dump(pinfo, open(pinfo_path, 'w'))

    # Wikidata: doğum tarihi, mevki, site sayısı
    qids = sorted({v['qid'] for v in pinfo.values() if v.get('qid')})
    wd_path = os.path.join(CACHE, 'wd.json')
    wd = json.load(open(wd_path)) if os.path.exists(wd_path) else {}
    need = [q for q in qids if q not in wd]

    def wd_batch(chunk):
        d = get(WD, {'action': 'wbgetentities', 'ids': '|'.join(chunk), 'props': 'claims|sitelinks', 'format': 'json'})
        out = {}
        for q, e in d.get('entities', {}).items():
            cl = e.get('claims', {})

            def vals(pid):
                r = []
                for c in cl.get(pid, []):
                    dv = c.get('mainsnak', {}).get('datavalue', {}).get('value')
                    if dv is not None:
                        r.append(dv)
                return r
            birth = next((v['time'][1:11] for v in vals('P569') if isinstance(v, dict) and 'time' in v), None)
            positions = [v['id'] for v in vals('P413') if isinstance(v, dict) and 'id' in v]
            height = next((v.get('amount') for v in vals('P2048') if isinstance(v, dict)), None)
            foot = [v['id'] for v in vals('P552') if isinstance(v, dict) and 'id' in v]
            out[q] = {'birth': birth, 'pos': positions, 'sites': len(e.get('sitelinks', {})), 'foot': foot, 'height': height}
        return out

    chunks = [need[i:i + 50] for i in range(0, len(need), 50)]
    with ThreadPoolExecutor(3) as ex:
        for n, r in enumerate(ex.map(wd_batch, chunks)):
            wd.update(r)
            print('wikidata', (n + 1) * 50, '/', len(need), file=sys.stderr)
    json.dump(wd, open(wd_path, 'w'))

    labels_path = os.path.join(CACHE, 'labels.json')
    labels = json.load(open(labels_path)) if os.path.exists(labels_path) else {}
    lq = sorted({p for v in wd.values() for p in v['pos'] + v['foot']} - set(labels))
    for i in range(0, len(lq), 50):
        d = get(WD, {'action': 'wbgetentities', 'ids': '|'.join(lq[i:i + 50]), 'props': 'labels', 'languages': 'en', 'format': 'json'})
        for q, e in d.get('entities', {}).items():
            labels[q] = e.get('labels', {}).get('en', {}).get('value', '')
    json.dump(labels, open(labels_path, 'w'))

    json.dump({'clubs': clubs, 'pinfo': pinfo, 'wd': wd, 'labels': labels}, open(raw_path, 'w'), ensure_ascii=False)
    for cid, c in clubs.items():
        print(f"{cid:5} {len(c['players']):3} +{len(c['loans']):2} loan  {c['title']}  {c['info']}")


if __name__ == '__main__':
    main()

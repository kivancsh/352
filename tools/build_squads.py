#!/usr/bin/env python3
"""fetch_squads.py'nin ham verisinden oyunun kadro dosyasını (js/data/world-squads.js) üretir.

Gerçek olan: kulüp kadrosu, forma numarası, uyruk, yaş (doğum tarihinden), mevki, kiralık durumu, teknik direktör.
Tahmin olan: güç değerleri. Wikipedia görüntülenme ve dil sayısına göre kulüp içi sıralama + kulüp gücü
+ overrides.py'deki elle girilmiş değerler.
"""
import datetime
import hashlib
import json
import math
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from overrides import OVERRIDES  # noqa: E402

REF_DATE = datetime.date(2026, 8, 10)

FIFA = {
    'ALB': 'AL', 'ALG': 'DZ', 'AND': 'AD', 'ANG': 'AO', 'ARG': 'AR', 'ARM': 'AM', 'AUS': 'AU', 'AUT': 'AT', 'AZE': 'AZ',
    'BDI': 'BI', 'BEL': 'BE', 'BEN': 'BJ', 'BFA': 'BF', 'BIH': 'BA', 'BLR': 'BY', 'BRA': 'BR', 'BUL': 'BG', 'CAF': 'CF',
    'CAN': 'CA', 'CGO': 'CG', 'CHE': 'CH', 'CHI': 'CL', 'CIV': 'CI', 'CMR': 'CM', 'COD': 'CD', 'COL': 'CO', 'COM': 'KM',
    'CPV': 'CV', 'CRC': 'CR', 'CRO': 'HR', 'CTA': 'CF', 'CUB': 'CU', 'CUR': 'CW', 'CUW': 'CW', 'CYP': 'CY', 'CZE': 'CZ',
    'DEN': 'DK', 'DOM': 'DO', 'DRC': 'CD', 'ECU': 'EC', 'EGY': 'EG', 'ENG': 'EN', 'EQG': 'GQ', 'ESP': 'ES', 'EST': 'EE',
    'FIN': 'FI', 'FRA': 'FR', 'FRO': 'FO', 'GAB': 'GA', 'GAM': 'GM', 'GEO': 'GE', 'GER': 'DE', 'GHA': 'GH', 'GIB': 'GI',
    'GLP': 'GP', 'GNB': 'GW', 'GRC': 'GR', 'GRE': 'GR', 'GUA': 'GT', 'GUI': 'GN', 'HAI': 'HT', 'HON': 'HN', 'HUN': 'HU',
    'IDN': 'ID', 'IRL': 'IE', 'IRN': 'IR', 'IRQ': 'IQ', 'ISL': 'IS', 'ISR': 'IL', 'ITA': 'IT', 'JAM': 'JM', 'JOR': 'JO',
    'JPN': 'JP', 'KAZ': 'KZ', 'KEN': 'KE', 'KOR': 'KR', 'KOS': 'XK', 'KSA': 'SA', 'KVX': 'XK', 'LAT': 'LV', 'LBR': 'LR',
    'LBY': 'LY', 'LTU': 'LT', 'LUX': 'LU', 'LVA': 'LV', 'MAD': 'MG', 'MAR': 'MA', 'MDA': 'MD', 'MEX': 'MX', 'MKD': 'MK',
    'MLI': 'ML', 'MNE': 'ME', 'MOZ': 'MZ', 'MRT': 'MR', 'MTN': 'MR', 'MTQ': 'MQ', 'NED': 'NL', 'NGA': 'NG', 'NGR': 'NG',
    'NIC': 'NI', 'NIG': 'NE', 'NIR': 'NX', 'NOR': 'NO', 'NZL': 'NZ', 'PAK': 'PK', 'PAN': 'PA', 'PAR': 'PY', 'PER': 'PE',
    'PHI': 'PH', 'PLE': 'PS', 'POL': 'PL', 'POR': 'PT', 'PRY': 'PY', 'ROM': 'RO', 'ROU': 'RO', 'RSA': 'ZA', 'RUS': 'RU',
    'RWA': 'RW', 'SCO': 'SC', 'SEN': 'SN', 'SER': 'RS', 'SLE': 'SL', 'SLO': 'SI', 'SPA': 'ES', 'SRB': 'RS', 'SUI': 'CH',
    'SUR': 'SR', 'SVK': 'SK', 'SVN': 'SI', 'SWE': 'SE', 'SWI': 'CH', 'SYR': 'SY', 'TAN': 'TZ', 'TCD': 'TD', 'TOG': 'TG',
    'TR': 'TR', 'TRI': 'TT', 'TUN': 'TN', 'TUR': 'TR', 'UAE': 'AE', 'UGA': 'UG', 'UKR': 'UA', 'URU': 'UY', 'USA': 'US',
    'UZB': 'UZ', 'VEN': 'VE', 'WAL': 'WL', 'ZAM': 'ZM', 'ZIM': 'ZW',
}

SPECIFIC = {
    'goalkeeper': 'GK', 'centre-back': 'CB', 'stopper': 'CB', 'centerhalf': 'CB', 'sweeper': 'CB',
    'left-back': 'LB', 'left back': 'LB', 'right-back': 'RB', 'right back': 'RB',
    'full-back': 'FB', 'fullback': 'FB', 'wing-back': 'FB',
    'defensive midfielder': 'DM', 'central midfielder': 'CM', 'attacking midfielder': 'AM', 'playmaker': 'AM',
    'left midfielder': 'LW', 'right midfielder': 'RW', 'wide midfielder': 'W', 'left winger': 'LW', 'left wing': 'LW',
    'right winger': 'RW', 'winger': 'W', 'inverted winger': 'W',
    'centre-forward': 'ST', 'striker': 'ST', 'second striker': 'ST',
}
COARSE_OK = {
    'GK': {'GK'}, 'DF': {'CB', 'LB', 'RB', 'FB', 'DM'}, 'MF': {'DM', 'CM', 'AM', 'LW', 'RW', 'W', 'FB', 'LB', 'RB'},
    'FW': {'ST', 'LW', 'RW', 'W', 'AM'},
}
TARGET = {'GK': 3, 'RB': 2, 'LB': 2, 'CB': 5, 'DM': 2, 'CM': 3, 'AM': 2, 'RW': 2, 'LW': 2, 'ST': 3}
OFFSETS = [5, 4, 3.2, 2.6, 2, 1.5, 1, 0.5, 0, -0.6, -1.4, -2.2, -2.8, -3.4, -4, -4.6, -5.2, -6, -6.8, -7.6, -8.4, -9.2, -10, -11, -12, -13]
TOP11_MEAN = sum(OFFSETS[:11]) / 11


def norm(s):
    s = unicodedata.normalize('NFKD', s.lower())
    return re.sub(r'[^a-z ]', '', ''.join(c for c in s if not unicodedata.combining(c))).strip()


def js_clubs():
    out = {}
    src = open(os.path.join(ROOT, 'js/data/europe.js')).read()
    for m in re.finditer(r"C\('([\w]+)', '((?:[^'\\]|\\.)*)', '[^']*', '(\w\w)', (\d+)", src):
        out[m.group(1)] = {'name': m.group(2).replace("\\'", "'"), 'country': m.group(3), 'rep': int(m.group(4)), 'tr': False}
    src = open(os.path.join(ROOT, 'js/data/turkey-lower.js')).read()
    for m in re.finditer(r"T\('([\w]+)', '([^']*)', '[^']*', '[^']*', (\d+)", src):
        out[m.group(1)] = {'name': m.group(2), 'country': 'TR', 'rep': int(m.group(3)), 'tr': True}
    return out


def super_lig():
    src = open(os.path.join(ROOT, 'js/data/teams.js')).read()
    names, teams = set(), {}
    for m in re.finditer(r"id: '(\w+)', name: '([^']+)'.*?players: `(.*?)`", src, re.S):
        rows = [l.split('|') for l in m.group(3).strip().splitlines() if l.strip()]
        ovrs = sorted((int(r[5]) for r in rows), reverse=True)
        teams[m.group(1)] = {'name': m.group(2), 'top11': sum(ovrs[:11]) / 11}
        for r in rows:
            names.add(norm(r[1]))
    return names, teams


def club_base(c):
    if c['tr']:
        return 42 + c['rep'] * 0.46
    return 58 + (c['rep'] - 45) * 0.58


OV_BY_NAME = {}
for _k, _v in OVERRIDES.items():
    OV_BY_NAME.setdefault(_k.split(':', 1)[1], set()).add(_v)
OV_USED = set()


def find_override(cid, name):
    """Önce kulübe özel anahtar, yoksa adı tek anlamlı olan kayıt."""
    if f'{cid}:{name}' in OVERRIDES:
        return OVERRIDES[f'{cid}:{name}']
    vals = OV_BY_NAME.get(name)
    if vals and len({v[0] for v in vals}) == 1:
        return max(vals, key=len)
    return None


def jitter(name, amp):
    h = int(hashlib.md5(name.encode()).hexdigest()[:8], 16) / 0xFFFFFFFF
    return (h * 2 - 1) * amp


def main():
    raw = json.load(open(os.path.join(HERE, 'cache/raw.json')))
    clubs_raw, pinfo, wd, labels = raw['clubs'], raw['pinfo'], raw['wd'], raw['labels']
    meta = js_clubs()
    sl_names, sl_teams = super_lig()
    title_to_id = {c['title']: cid for cid, c in clubs_raw.items() if c['title']}
    name_to_id = {}
    for cid, m in meta.items():
        name_to_id[norm(m['name'])] = cid
    for cid, t in sl_teams.items():
        name_to_id[norm(t['name'])] = cid

    def club_ref(text):
        """'on loan from [[X|Y]]' / 'at [[X]] until 30 June 2027' → (oyun kulüp id | None, görünen ad, bitiş yılı)"""
        links = re.findall(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]', text)
        links = [l for l in links if not l[0].lower().startswith(('captain', ':'))]
        if not links:
            return None, None, None
        title, disp = links[-1][0].strip(), (links[-1][1] or links[-1][0]).strip()
        target = pinfo.get(title, {}).get('title', title)
        cid = title_to_id.get(target) or title_to_id.get(title) or name_to_id.get(norm(disp)) or name_to_id.get(norm(re.sub(r'\s*\(.*\)|\b(F\.?C\.?|S\.?K\.?|A\.?F\.?C\.?|CF|SC|AC|FK)\b', '', disp)))
        ym = re.search(r'until[^0-9]*?(?:\d{1,2}\s+\w+\s+)?(20\d\d)', text)
        year = int(ym.group(1)) if ym else None
        return cid, disp, year

    def wd_of(row):
        if not row['link']:
            return {}, 0
        pi = pinfo.get(row['link'], {})
        return wd.get(pi.get('qid') or '', {}), pi.get('views', 0)

    # 1) Tüm kayıtları topla: (bulunduğu kulüp, satır, kiralık bilgisi)
    entries = []
    for cid, c in clubs_raw.items():
        if cid in sl_teams or cid not in meta:
            continue
        for row in c['players']:
            other = row['other']
            lo = other.lower()
            if 'loan from' in lo:
                pid, disp, year = club_ref(other)
                entries.append({'club': cid, 'row': row, 'loanFrom': pid, 'loanFromName': disp, 'until': year, 'prio': 2})
            elif 'loan to' in lo or re.search(r'\bat\b.*\[\[', other):
                dest, disp, year = club_ref(other)
                if dest and dest in meta:
                    entries.append({'club': dest, 'row': row, 'loanFrom': cid, 'loanFromName': meta[cid]['name'], 'until': year, 'prio': 1})
            else:
                entries.append({'club': cid, 'row': row, 'loanFrom': None, 'prio': 0})
        for row in c['loans']:
            dest, disp, year = club_ref(row['other'])
            if dest and dest in meta:
                entries.append({'club': dest, 'row': row, 'loanFrom': cid, 'loanFromName': meta[cid]['name'], 'until': year, 'prio': 1})

    # 2) Tekilleştir: aynı oyuncu birden fazla yerde görünürse kiralık kaydı tercih edilir; Süper Lig'dekiler atlanır
    best = {}
    for e in entries:
        w, _ = wd_of(e['row'])
        key = (pinfo.get(e['row']['link'] or '', {}).get('qid')) or norm(e['row']['name'])
        if norm(e['row']['name']) in sl_names:
            continue
        if key not in best or e['prio'] > best[key]['prio']:
            best[key] = e
    by_club = {}
    for e in best.values():
        by_club.setdefault(e['club'], []).append(e)

    out = {}
    report = []
    for cid, m in meta.items():
        lst = by_club.get(cid, [])
        coach = (clubs_raw.get(cid, {}).get('info', {}) or {}).get('coach') or ''
        if coach.lower() in ('vacant', 'tba', ''):
            coach = ''
        info = clubs_raw.get(cid, {}).get('info', {}) or {}
        if len(lst) < 16:
            out[cid] = {'coach': coach, 'capacity': info.get('capacity'), 'players': None}
            report.append(f'{cid}: kadro yetersiz ({len(lst)}), üretilecek')
            continue
        players = []
        for e in lst:
            row = e['row']
            w, views = wd_of(row)
            birth = w.get('birth')
            age = None
            if birth and re.match(r'\d{4}-\d\d-\d\d', birth) and not birth.endswith('-00-00'):
                try:
                    b = datetime.date.fromisoformat(birth.replace('-00', '-01'))
                    age = REF_DATE.year - b.year - ((REF_DATE.month, REF_DATE.day) < (b.month, b.day))
                except ValueError:
                    pass
            coarse = row['pos'] if row['pos'] in COARSE_OK else 'MF'
            spec = None
            for q in w.get('pos', []):
                s = SPECIFIC.get(labels.get(q, ''))
                if s and s in COARSE_OK[coarse]:
                    spec = s
                    break
            foot = ' '.join(labels.get(q, '') for q in w.get('foot', []))
            sites = w.get('sites', 0)
            fame = math.log10(views + 30) + 0.9 * math.log10(sites + 1) if row['link'] else None
            players.append({'e': e, 'name': row['name'], 'no': row['no'], 'nat': FIFA.get(row['nat'], row['nat'][:2] or m['country']),
                            'age': age, 'coarse': coarse, 'spec': spec, 'foot': foot, 'fame': fame})
        known = [p['fame'] for p in players if p['fame'] is not None]
        floor = (min(known) - 0.3) if known else 1.0
        for p in players:
            if p['fame'] is None:
                p['fame'] = floor - (0.2 if (p['age'] or 25) < 21 else 0)
            if p['age'] is None:
                p['age'] = 19 if p['fame'] < floor else 25
            if p['age'] >= 33:
                p['fame'] -= 0.12 * (p['age'] - 32)
        players.sort(key=lambda p: -p['fame'])
        if len(players) > 34:
            players = players[:34]

        # Mevki ataması (önce belirli olanlar, sonra kadro ihtiyacına göre)
        count = {k: 0 for k in TARGET}
        for p in players:
            s = p['spec']
            if s in TARGET:
                p['pos'] = s
                count[s] += 1
            elif p['coarse'] == 'GK':
                p['pos'] = 'GK'
                count['GK'] += 1

        def choose(options, p):
            if 'left' in p['foot'] and 'LB' in options:
                return 'LB'
            if 'left' in p['foot'] and 'LW' in options:
                return 'LW'
            return max(options, key=lambda o: (TARGET[o] - count[o], -options.index(o)))
        for p in players:
            if 'pos' in p:
                continue
            s, c = p['spec'], p['coarse']
            if s == 'FB':
                opts = ['RB', 'LB']
            elif s == 'W':
                opts = ['RW', 'LW']
            elif c == 'DF':
                opts = ['CB', 'RB', 'LB']
            elif c == 'MF':
                opts = ['CM', 'DM', 'AM']
            else:
                opts = ['ST', 'RW', 'LW']
            p['pos'] = choose(opts, p)
            count[p['pos']] += 1

        base = club_base(m)
        lines = []
        ov_vals = sorted((find_override(cid, p['name'])[0] for p in players if find_override(cid, p['name'])), reverse=True)
        cap_auto = ov_vals[min(10, len(ov_vals) - 1)] + 1 if len(ov_vals) >= 8 else 99
        for i, p in enumerate(players):
            off = OFFSETS[i] if i < len(OFFSETS) else OFFSETS[-1] - (i - len(OFFSETS) + 1)
            ovr = base + off - TOP11_MEAN + jitter(p['name'], 1.2)
            if p['pos'] == 'GK' and i > 12:
                ovr -= 1.5
            if p['age'] <= 21:
                ovr = min(ovr, base + 1.5 - (21 - p['age']) * 2.6)
            if p['age'] >= 34:
                ovr -= (p['age'] - 33) * 0.8
            pot = ''
            ov = find_override(cid, p['name'])
            if not ov:
                ovr = min(ovr, cap_auto)
            else:
                OV_USED.add(p['name'])
                ovr = ov[0]
                if len(ov) > 1 and ov[1]:
                    p['pos'] = ov[1]
                if len(ov) > 2:
                    pot = str(ov[2])
            ovr = int(round(max(40, min(94, ovr))))
            e = p['e']
            extra = ''
            if e.get('loanFrom') or e.get('loanFromName'):
                ref = meta[e['loanFrom']]['name'] if e.get('loanFrom') in meta else (sl_teams.get(e.get('loanFrom'), {}).get('name') or e.get('loanFromName'))
                if ref:
                    extra = f"|K:{ref}" + (f"@{e['until']}" if e.get('until') else '')
            name = p['name'].replace('|', ' ')
            lines.append(f"{p['no'] or '-'}|{name}|{p['nat']}|{p['age']}|{p['pos']}|{ovr}" + (f'|{pot}' if pot else '') + extra)
        out[cid] = {'coach': coach, 'capacity': info.get('capacity'), 'players': '\n'.join(lines)}
        ovrs = sorted((int(l.split('|')[5]) for l in lines), reverse=True)
        report.append(f"{cid:5} rep {m['rep']:2} n={len(lines):2} top11={sum(ovrs[:11]) / 11:5.1f} {m['name']}")

    js = ['// Otomatik üretildi: tools/fetch_squads.py + tools/build_squads.py (Wikipedia / Wikidata, Eylül 2026).',
          '// Kadrolar, forma numaraları, uyruklar, yaşlar ve kiralıklar gerçektir; güç değerleri tahmindir.',
          '// Biçim: no|ad|ülke|yaş|mevki|güç[|potansiyel][|K:ana kulüp@kiralık bitiş yılı]', '',
          'export const WORLD_SQUADS = {']
    for cid, d in out.items():
        cap = d['capacity'] if d['capacity'] and d['capacity'] > 1000 else None
        js.append(f"  {json.dumps(cid)}: {{ coach: {json.dumps(d['coach'], ensure_ascii=False)}, capacity: {json.dumps(cap)}, players: " +
                  (('`\n' + d['players'].replace('`', "'") + '\n`') if d['players'] else 'null') + ' },')
    js.append('};')
    open(os.path.join(ROOT, 'js/data/world-squads.js'), 'w').write('\n'.join(js) + '\n')
    print('\n'.join(report))
    unused = sorted({k.split(':', 1)[1] for k in OVERRIDES} - OV_USED)
    print('override kullanılan', len(OV_USED), 'kullanılmayan', len(unused))
    print('Süper Lig top11:', {k: round(v['top11'], 1) for k, v in sl_teams.items()})
    if '--review' in sys.argv:
        for cid, d in out.items():
            if d['players'] and meta[cid]['rep'] >= int(sys.argv[sys.argv.index('--review') + 1]):
                print('==', cid, meta[cid]['name'])
                print('  ' + '; '.join('|'.join(l.split('|')[1:6]) for l in d['players'].splitlines()[:18]))


if __name__ == '__main__':
    main()

# ⚽ Süper Lig Menajer 2026-27

2026-27 Trendyol Süper Lig için yapılmış bir teknik direktörlük oyunu. Telefonda tarayıcıdan oynanır, kurulum gerektirmez. İstersen ana ekrana ekleyip uygulama gibi de kullanabilirsin.

**Oyna:** https://kivancsh.github.io/super-lig-menajer/

## Neler var?

- **18 takım ve gerçek kadrolar:** Ligdeki takımların Eylül 2026 itibarıyla kadroları, forma numaraları ve kiralık oyuncuları. Toplam yaklaşık 490 oyuncu var.
- **Canlı maç motoru:** Maçlar dakika dakika simüle edilir. Canlı anlatımı izleyebilir, oyuncu değiştirebilir, oyun anlayışını (savunma / dengeli / hücum) değiştirebilir ya da sonucu anında görebilirsin.
- **Taktik:** 6 farklı diziliş, sahada ilk 11 düzenleme, yedek kulübesi ve mevki uyumu.
- **Transferler:** Yaz ve ara transfer dönemleri var.
  - Başka kulüplerin oyuncularına bonservis ya da kiralama teklifi yapabilirsin.
  - Kulüpler teklifini kabul edebilir, reddedebilir ya da karşı teklif yapabilir.
  - Kulüple anlaşınca oyuncuyla maaş ve süre pazarlığı yaparsın.
  - Serbest oyuncularla her zaman anlaşabilirsin.
- **Senin oyuncularına gelen teklifler:** Türk ve yabancı kulüpler oyuncuların için teklif gönderir. Kabul edebilir, reddedebilir ya da pazarlık yapabilirsin. Büyük kulübün teklifini reddedersen oyuncunun morali düşer. Genç oyuncuların için kiralama talepleri de gelir.
- **Diğer kulüplerin transferleri:** Yapay zekâ kulüpleri kendi aralarında transfer ve kiralama yapar, yurt dışına oyuncu satar.
- **Sakatlıklar ve cezalar:** Kas yorgunluğundan çapraz bağ kopmasına kadar farklı süreli sakatlıklar var. Dört sarı kart ya da kırmızı kart gören oyuncu ceza alır.
- **Kondisyon, moral ve gelişim:** Genç oyuncular forma şansı buldukça gelişir, yaşlı oyuncular yavaş yavaş düşer.
- **Finans:** Bilet, yayın ve sponsor gelirleri, maaşlar, işletme giderleri ve sezon sonu ödülleri.
- **Yönetim:** Kulübünün itibarına göre bir sezon hedefi konur. Sonuçlar kötü giderse görevden alınabilirsin.
- **Sezon sonu:** Şampiyon, gol kralı, asist kralı ve sezonun oyuncusu belirlenir. Ardından yeni sezon başlar: sözleşmeler biter, oyuncular yaşlanır ya da emekli olur, altyapıdan gençler gelir.
- **Kayıt:** Oyun her adımda telefonundaki tarayıcıya otomatik kaydedilir.

## 👥 Arkadaşlarla ortak kariyer

Aynı ligde her arkadaşın bir takımı yönetir (en fazla 8 kişi).

1. Oyunu aç → **Arkadaşlarla oyna**.
2. Adını yaz, takımını seç, **Yeni lig kur**. 6 haneli bir lig kodu çıkar.
3. **Davet linkini paylaş** ile linki arkadaşlarına gönder. Onlar linke tıklayıp kendi takımlarını seçerek katılır.
4. Herkes lobiye gelince kurucu **Ligi başlat**'a basar.
5. Herkes kadrosunu, taktiğini ve transferlerini ayarlayıp **Hazırım**'a bastığında oyun bir sonraki maç haftasına (en fazla 7 gün) ilerler. Maçlar, her teknik direktörün ayarladığı kadro ve taktikle oynanır.

Bilmen gerekenler:

- Birbirinizin oyuncularına teklif yapabilir, karşı teklif verip pazarlık edebilirsiniz.
- Yanıtlanmayan teklifler 7 oyun gününde düşer; kimse diğerlerini sonsuza kadar bekletemez.
- Ligi o an çevrimiçi olan oyunculardan biri işler. Herkes çıkarsa lig bekler, biri uygulamayı açınca kaldığı yerden devam eder.
- Ortak kariyerde görevden alınma yoktur.
- Lig verisi Firebase'de tutulur; tek oyunculu kariyer ise yine sadece telefonunda kalır.

## Telefonda uygulama olarak kurmak

Oyunun tek ve sabit bir adresi var: **https://kivancsh.github.io/super-lig-menajer/**

1. Linki telefonda aç.
2. **iPhone (Safari):** Paylaş düğmesi → *Ana Ekrana Ekle*
   **Android (Chrome):** Oyundaki *Uygulamayı yükle* düğmesi ya da ⋮ menüsü → *Ana ekrana ekle*
3. Bundan sonra oyunu ana ekrandaki **SL Menajer** simgesinden aç. Tam ekran, adres çubuğu olmadan açılır.

Kayıt ve devam etme:

- Ayrı bir kaydetme düğmesi yok. Oyun her adımda ve uygulamadan çıkıldığı anda otomatik kaydedilir.
- Simgeye her dokunuşta oyun doğrudan kaldığın yerden açılır.
- Canlı maçın ortasında çıkarsan maç aynı dakikada duraklatılmış olarak seni bekler.
- Kayıt yalnızca o telefonda tutulur.
- **iPhone'da** Safari'deki kayıt ile ana ekran uygulamasının kaydı birbirinden ayrıdır. Önce ana ekrana ekle, kariyerine oradan başla.
- Uygulama güncellemeleri bir sonraki açılışta kendiliğinden gelir.

## Veri hakkında

- Takım listesi ve kadrolar Eylül 2026 itibarıyla kamuya açık kaynaklardan derlendi (Wikipedia kadro sayfaları, kulüp ve basın duyuruları).
- **Oyuncu güç değerleri (rating), potansiyeller, bazı yaşlar, maaşlar ve sözleşme süreleri bu oyun için yapılmış tahminlerdir.** Resmî veri değildir.
- Hatalı ya da eksik bir oyuncu görürsen [`js/data/teams.js`](js/data/teams.js) dosyasını düzenleyip pull request açabilirsin. Satır biçimi şöyle:

```
forma no | ad soyad | ülke kodu | yaş | mevki | güç [| potansiyel] [| K:kiralandığı kulüp]
10|Mohamed Salah|EG|34|RW|83
22|Fabio Miretti|IT|22|CM|73|78|K:Juventus
```

Bu proje hayran yapımı, ticari olmayan bir oyundur. Türkiye Futbol Federasyonu, Süper Lig ya da herhangi bir kulüple bağlantısı yoktur. Kulüp logoları ve resmî forma tasarımları lisans gerektirdiği için kullanılmaz; formalar kulüplerin renk düzenleriyle çizilmiştir. Stadyum adları ve kapasiteleri 2026-27 sezonu resmî listesine göredir.

## Bilgisayarda çalıştırmak

Derleme adımı yok, sadece statik dosyalar var. Proje klasöründe basit bir sunucu başlatman yeterli:

```bash
python3 -m http.server 8765
```

Sonra tarayıcıda `http://localhost:8765` adresini aç.

## Proje yapısı

| Dosya | İçerik |
|---|---|
| `js/data/teams.js` | Takımlar, kadrolar, yabancı kulüpler |
| `js/engine/match.js` | Dakika dakika maç motoru |
| `js/engine/game.js` | Takvim, fikstür, finans, yönetim, sezon geçişi |
| `js/engine/transfers.js` | Teklifler, kiralamalar, sözleşmeler, yapay zekâ kulüpleri |
| `js/engine/players.js` | Mevkiler, değer, maaş, sakatlık, gelişim |
| `js/engine/tactics.js` | Dizilişler, otomatik ilk 11, takım gücü |
| `js/main.js` | Mobil arayüz |

Fikir olarak, kendi kendine işleyen futbol dünyası simülatörü [Open Football](https://github.com/ZOXEXIVO/open-football) projesinden ilham alındı. Kod sıfırdan yazıldı.

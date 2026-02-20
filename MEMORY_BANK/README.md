# Memory Bank - Nasıl Kullanılır?

**Amaç:** Claude'un çalışma sürecinde hafızasını korumak ve context kaybını önlemek.

---

## 📚 Dosyalar

| Dosya | Amaç | Güncelleme Sıklığı |
|-------|------|-------------------|
| `activeContext.md` | Şu an ne üzerinde çalışıyorsun | Her 30 dakika |
| `progress.md` | Proje ilerlemesi | Her modül bitiminde |
| `decisions.md` | Önemli kararlar | Her karar sonrası |
| `issues.md` | Sorunlar ve çözümler | Her sorun/çözüm |

---

## 🔄 Kullanım Akışı

### Her Gün Başında:

```
1. activeContext.md'yi oku → Dün ne yapmıştın?
2. progress.md'yi oku → Genel durum ne?
3. issues.md'yi oku → Açık sorun var mı?
```

### Çalışma Sırasında:

```
activeContext.md'yi sürekli güncelle:
- Her dosya yazımında
- Her sorunla karşılaşmada
- Her ara vermede
```

### Her Modül Bitiminde:

```
1. progress.md güncelle → Tamamlanan ekle
2. activeContext.md temizle → Yeni göreve hazır
3. Git commit at
4. Kullanıcıya rapor ver
```

### Önemli Karar Alındığında:

```
decisions.md'ye ekle:
- Neyi seçtik?
- Neden?
- Hangi modüller etkilenir?
```

### Sorun Çıktığında:

```
issues.md'ye ekle:
- Sorun ne?
- Nasıl çözüldü?
- Gelecekte nasıl önlenir?
```

---

## 💡 İpuçları

### Context Kaybını Önle:

1. **Her 30 dakikada** activeContext.md güncelle
2. **Uzun kod bloklarını** özet
3. **Önemli kararları** hemen kaydet

### Etkili Kullanım:

```markdown
# activeContext.md

❌ KÖTÜ:
"Auth modülünü yazıyorum"

✅ İYİ:
"Auth modülü - JWT Strategy
- jwt.strategy.ts yazıyorum
- passport-jwt konfigürasyonu
- Token validation mantığı
- Sonraki: Unit tests"
```

### Progress Tracking:

```markdown
# progress.md

❌ KÖTÜ:
"Auth bitti"

✅ İYİ:
"✅ Auth Module (16 Şub 2026)
- 2.5 saat sürdü
- %85 test coverage
- Commit: feat: add auth module
- Önemli: Rate limiting eklendi"
```

---

## 🎯 Başarı Kriterleri

Memory Bank iyi kullanılıyorsa:

- [ ] Her gün başında 5 dakikada context'e dönüyorsun
- [ ] Dün ne yaptığını hatırlıyorsun
- [ ] Sorunları tekrar yaşamıyorsun
- [ ] Kararların neden alındığını biliyorsun
- [ ] Progress'i takip edebiliyorsun

---

## 🚀 Başlangıç

İlk kez kullanıyorsan:

```bash
1. activeContext.md'yi aç
2. "İlk görev: Auth Module" yaz
3. Başla!
```

Çalışırken:

```bash
1. activeContext.md'yi güncelle
2. Sorun çıktı → issues.md
3. Modül bitti → progress.md
4. Karar aldın → decisions.md
```

---

**Hatırla:** Memory Bank senin **ikinci beynin**. Ne kadar iyi kullanırsan, o kadar hızlı ilerlersin! 🧠

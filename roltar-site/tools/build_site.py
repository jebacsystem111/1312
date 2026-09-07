#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ROLTAR - generator odświeżonego serwisu (wielostronicowego).
Uruchomienie:  python3 tools/build_site.py   (z katalogu roltar-site/)
Wspólny szablon (topbar/nav/stopka) + treść poszczególnych podstron.
Linki "szczegółowe" (głębokie, nieodświeżone strony oryginału) prowadzą
bezwzględnie na serwer www.roltar.in.tarnow.pl.
"""
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ABS = "http://www.roltar.in.tarnow.pl/"
SITE = "http://www.roltar.in.tarnow.pl/"

# ---------------------------------------------------------------- ikony SVG
I = {
"phone": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
"mail": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7L22 6"/></svg>',
"pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
"clock": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
"arrow": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
"chev": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
"check": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12.5 5 5L20 6.5"/></svg>',
"shield": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 3 7v6c0 5 3.8 8.4 9 9 5.2-.6 9-4 9-9V7z"/><path d="m9 12 2 2 4-4"/></svg>',
"wrench": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
"chat": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
"year": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/></svg>',
}

# ---------------------------------------------------------------- nawigacja
NAV = [
    ("index.html", "Strona główna"),
    ("syst.zac.htm", "Osłony okienne"),
    ("rolety.htm", "Rolety-Żaluzje"),
    ("bramy.htm", "Bramy"),
    ("kraty.htm", "Kraty rolowane"),
    ("markizy.htm", "Markizy"),
    ("refleksole.htm", "Refleksole"),
    ("napedy.htm", "Napędy i automatyka"),
    ("moskitiery.htm", "Moskitiery"),
    ("folie.htm", "Folie okienne"),
    ("roltar.htm", "Dojazd"),
    ("kontakt.html", "Kontakt"),
]

def nav_html(active):
    items = []
    for href, label in NAV:
        cur = ' aria-current="page"' if href == active else ""
        items.append(f'<li><a href="{href}"{cur}>{label}</a></li>')
    return '\n      '.join(items)

def logo_img(cls=""):
    return (f'<img src="logo2.jpg" alt="ROLTAR - logo firmy" class="{cls}" '
            'onerror="this.onerror=null;this.src=\'assets/logo2.jpg\'">')

# ---------------------------------------------------------------- szablon
def page(filename, title, desc, active, body, cta=True):
    cta_html = ''
    if cta:
        cta_html = f'''
  <!-- ===== pasek kontaktu ===== -->
  <section class="cta-strip">
    <div class="container">
      <div>
        <h2>Potrzebujesz wyceny lub porady?</h2>
        <p>Zadzwoń lub napisz - doradzimy bezpłatnie i umówimy termin montażu.</p>
      </div>
      <div class="cta-actions">
        <a class="btn btn-primary" href="tel:+48146265385">{I["phone"]}14 626 53 85</a>
        <a class="btn btn-ghost" href="mailto:roltar.tarnow@gmail.com">{I["mail"]}Napisz e-mail</a>
      </div>
    </div>
  </section>'''
    return f'''<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#11151a">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<a class="skip-link" href="#tresc">Przejdź do treści</a>

<!-- ===== nagłówek ===== -->
<header class="topbar">
  <div class="container">
    <a class="brand" href="index.html" aria-label="ROLTAR, strona główna">
      {logo_img()}
    </a>
    <div class="top-contact">
      <div class="tc">
        {I["phone"]}
        <div>
          <div class="phone"><a href="tel:+48146265385">14 626 53 85</a></div>
          <div class="small">tel./fax, zamówienia 8:00-17:00</div>
        </div>
      </div>
      <div class="tc">
        {I["mail"]}
        <div>
          <div class="phone"><a href="mailto:roltar.tarnow@gmail.com">roltar.tarnow@gmail.com</a></div>
          <div class="small">kom. 601 721 094</div>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- ===== nawigacja ===== -->
<nav class="nav" aria-label="Nawigacja główna">
  <div class="container">
    <button class="nav-burger" id="navBurger" aria-expanded="false" aria-controls="navList" aria-label="Rozwiń menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h12"/></svg>
    </button>
    <ul class="nav-list" id="navList">
      {nav_html(active)}
    </ul>
  </div>
</nav>

<main id="tresc">
{body}
</main>
{cta_html}
<!-- ===== stopka ===== -->
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="f-brand">
        {logo_img()}
        <p>Prywatna firma z Tarnowa, działająca na rynku od 1999 roku. Produkcja, sprzedaż i montaż rolet, bram, markiz, krat rolowanych, moskitier i pozostałych osłon okiennych.</p>
      </div>
      <div>
        <h4>Oferta</h4>
        <ul>
          <li><a href="rolety.htm">Rolety i żaluzje</a></li>
          <li><a href="bramy.htm">Bramy garażowe i wjazdowe</a></li>
          <li><a href="kraty.htm">Kraty rolowane</a></li>
          <li><a href="markizy.htm">Markizy</a></li>
          <li><a href="refleksole.htm">Refleksole</a></li>
          <li><a href="moskitiery.htm">Moskitiery</a></li>
          <li><a href="folie.htm">Folie okienne</a></li>
          <li><a href="napedy.htm">Napędy i automatyka</a></li>
          <li><a href="syst.zac.htm">Systemy osłon okiennych</a></li>
        </ul>
      </div>
      <div>
        <h4>Kontakt</h4>
        <ul>
          <li class="f-contact">{I["pin"]} ul. Makuszyńskiego 41, 33-100 Tarnów</li>
          <li class="f-contact">{I["phone"]} <a href="tel:+48146265385">tel./fax 14 626 53 85</a></li>
          <li class="f-contact">{I["phone"]} <a href="tel:+48601721094">kom. 601 721 094</a></li>
          <li class="f-contact">{I["mail"]} <a href="mailto:roltar.tarnow@gmail.com">roltar.tarnow@gmail.com</a></li>
          <li class="f-contact">{I["clock"]} zamówienia: 8:00-17:00</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 ROLTAR, Tarnów. Wszelkie prawa zastrzeżone.</span>
      <span>Firma na rynku od 1999 roku.</span>
    </div>
  </div>
</footer>

<script>
(function(){{
  var burger=document.getElementById('navBurger');
  var list=document.getElementById('navList');
  if(burger&&list){{
    burger.addEventListener('click',function(){{
      var open=list.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    }});
    list.addEventListener('click',function(e){{
      if(e.target.closest('a')){{list.classList.remove('open');burger.setAttribute('aria-expanded','false');}}
    }});
  }}
}})();
</script>
</body>
</html>
'''

def page_hero(crumb, h1, lead=""):
    lead_html = f'<p class="lead">{lead}</p>' if lead else ""
    return f'''
  <section class="page-hero">
    <div class="container">
      <nav class="crumb" aria-label="Okruszki"><a href="index.html">Strona główna</a>{I["chev"]}<span>{crumb}</span></nav>
      <h1>{h1}</h1>
      {lead_html}
    </div>
  </section>'''

def split(img, alt, title, text_html, flip=False, wide=False):
    order = " flip" if flip else ""
    return f'''
      <div class="split{order}">
        <figure class="split-media"><img src="{img}" alt="{alt}" width="1408" height="768" loading="lazy"></figure>
        <div class="split-body">
          <h2>{title}</h2>
          {text_html}
        </div>
      </div>'''

def lbox(head, note, items):
    lis = []
    for href, label, desc in items:
        target = ' target="_blank" rel="noopener"' if href.startswith("http") else ""
        d = f'<span class="desc">{desc}</span>' if desc else ""
        lis.append(f'<li><a href="{href}"{target}><span><span class="row"><strong>{label}</strong>{I["chev"]}</span>{d}</span></a></li>')
    return f'''<div class="linkbox"><div class="lb-head"><h3>{head}</h3><span>{note}</span></div><ul>{''.join(lis)}</ul></div>'''

def trust_row(cells):
    out = []
    for icon, title, text in cells:
        out.append(f'''<div class="cell"><div class="ico">{I[icon]}</div><h3>{title}</h3><p>{text}</p></div>''')
    return f'''<div class="trust">{''.join(out)}</div>'''

# ======================================================================
# STRONA GŁÓWNA
# ======================================================================
CATS = [
    ("rolety.htm", "assets/rolety-zewnetrzne.jpg", "Rolety i żaluzje",
     "Rolety aluminiowe zewnętrzne, tekstylne i żaluzje - na wymiar, do każdego okna."),
    ("bramy.htm", "assets/bramy.jpg", "Bramy",
     "Garażowe segmentowe i rolowane, wjazdowe przesuwne samonośne, przemysłowe i napędy."),
    ("markizy.htm", "assets/markiza.jpg", "Markizy",
     "Tarasowe, balkonowe i koszowe. Rozwijanie korbowe albo silnik elektryczny."),
    ("moskitiery.htm", "assets/moskitiery.jpg", "Moskitiery",
     "Ramkowe na okna, drzwi przeciw owadom i siatki rolowane zwijane do kasety."),
    ("kraty.htm", "assets/kraty.jpg", "Kraty rolowane",
     "Aluminiowe, estetyczne i skuteczne zabezpieczenie okien, drzwi i witryn."),
    ("refleksole.htm", "assets/refleksole.jpg", "Refleksole",
     "Zewnętrzne osłony przeciwsłoneczne do przeszklonych elewacji i biur."),
]

home_body = f'''
  <!-- ===== hero ===== -->
  <section class="hero">
    <div class="container">
      <div class="hero-copy">
        <h1 class="enter enter-1">Rolety, bramy i osłony okienne <span class="accent">od 1999 roku</span></h1>
        <p class="sub enter enter-2">Producent i wykonawca z Tarnowa. Produkujemy, sprzedajemy i montujemy osłony okienne dla klientów indywidualnych i instytucjonalnych, z 24-miesięczną gwarancją.</p>
        <div class="cta-row enter enter-3">
          <a class="btn btn-primary" href="tel:+48146265385">{I["phone"]}Zadzwoń: 14 626 53 85</a>
          <a class="btn btn-ghost" href="#oferta">Zobacz ofertę{I["arrow"]}</a>
        </div>
        <ul class="hero-facts enter enter-4">
          <li>{I["check"]}Gwarancja 24 miesiące</li>
          <li>{I["check"]}Serwis pogwarancyjny</li>
          <li>{I["check"]}Bezpłatne doradztwo techniczne</li>
        </ul>
      </div>
      <figure class="hero-media enter enter-3">
        <img src="assets/hero.jpg" alt="Elewacja domu z zamontowanymi roletami zewnętrznymi" width="1376" height="768">
        <figcaption class="stamp"><small>Produkcja i montaż</small>33-100 Tarnów</figcaption>
      </figure>
    </div>
  </section>

  <!-- ===== oferta ===== -->
  <section class="section" id="oferta">
    <div class="container">
      <div class="section-head">
        <h2>Nasza oferta</h2>
        <p>Od 1999 roku produkujemy, sprzedajemy i montujemy osłony okienne oraz bramy. Za każdą usługę odpowiadamy w 100%, a na produkty i montaż udzielamy <strong>gwarancji na 24 miesiące</strong>.</p>
      </div>
      <div class="cat-grid">
        {''.join(f'<article class="cat-card"><a class="thumb" href="{href}" tabindex="-1" aria-hidden="true"><img src="{img}" alt="" width="1408" height="768" loading="lazy"></a><div class="body"><h3><a href="{href}">{name}</a></h3><p>{desc}</p><a class="more" href="{href}">Zobacz szczegóły{I["arrow"]}</a></div></article>' for href, img, name, desc in CATS)}
      </div>
      <div class="more-strip">
        <strong>Więcej:</strong>
        <a href="syst.zac.htm">Systemy osłon okiennych</a>
        <a href="folie.htm">Folie okienne</a>
        <a href="napedy.htm">Napędy i automatyka</a>
        <a href="roltar.htm">Dojazd do firmy</a>
        <a href="kontakt.html">Kontakt</a>
      </div>
    </div>
  </section>

  <!-- ===== atuty ===== -->
  <section class="section on-dark">
    <div class="container">
      <div class="section-head">
        <h2>Firma, która odpowiada za swoją pracę</h2>
        <p>ROLTAR to prywatna firma działająca na rynku od 1999 roku. Obsługujemy klientów indywidualnych oraz instytucjonalnych - zdanie naszych klientów jest mottem przewodnim rozwoju firmy.</p>
      </div>
      {trust_row([
        ("year", "Od 1999 roku", "Prywatna firma z Tarnowa, obecna na rynku od 1999 roku."),
        ("shield", "Gwarancja 24 miesiące", "Udzielamy gwarancji na okres 24 miesięcy."),
        ("wrench", "Serwis pogwarancyjny", "Zapewniamy serwis pogwarancyjny wykonywanych usług."),
        ("chat", "Bezpłatne doradztwo", "Służymy bezpłatnym doradztwem technicznym w zakresie naszych usług."),
      ])}
    </div>
  </section>

  <!-- ===== kontakt ===== -->
  <section class="section" id="kontakt">
    <div class="container">
      <div class="section-head">
        <h2>Kontakt i dojazd</h2>
        <p>Zamówienia przyjmujemy telefonicznie i mailowo w godzinach 8:00-17:00. Jeżeli mają Państwo jakiekolwiek pytania, z chęcią na nie odpowiemy.</p>
      </div>
      <div class="contact-grid">
        <div class="contact-card">
          <div class="ico">{I["pin"]}</div>
          <div><h3>Adres</h3><div class="val">ul. Makuszyńskiego 41<br>33-100 Tarnów</div></div>
        </div>
        <div class="contact-card">
          <div class="ico">{I["phone"]}</div>
          <div><h3>Telefon / fax</h3><div class="val"><a href="tel:+48146265385">14 626 53 85</a></div></div>
        </div>
        <div class="contact-card">
          <div class="ico">{I["phone"]}</div>
          <div><h3>Telefon komórkowy</h3><div class="val"><a href="tel:+48601721094">601 721 094</a></div></div>
        </div>
        <div class="contact-card">
          <div class="ico">{I["mail"]}</div>
          <div><h3>E-mail</h3><div class="val"><a href="mailto:roltar.tarnow@gmail.com">roltar.tarnow@gmail.com</a></div></div>
        </div>
      </div>
    </div>
  </section>'''

# ======================================================================
# PODSTRONY
# ======================================================================
def deep(href, label, desc=""):
    return (href, label, desc)

pages = {}

pages["index.html"] = page("index.html",
    "ROLTAR Tarnów - rolety okienne, bramy, markizy, moskitiery | Osłony okienne od 1999 roku",
    "Firma ROLTAR z Tarnowa: produkcja, sprzedaż i montaż rolet zewnętrznych i wewnętrznych, bram garażowych, krat rolowanych, markiz, refleksoli, moskitier i folii okiennych. Gwarancja 24 miesiące.",
    "index.html", home_body, cta=False)

pages["syst.zac.htm"] = page("syst.zac.htm",
    "Systemy osłon okiennych - ROLTAR Tarnów",
    "Zewnętrzne i wewnętrzne systemy osłon okiennych przeciwsłonecznych: rolety aluminiowe, żaluzje fasadowe, refleksole, markizy, żaluzje i rolety tekstylne.",
    "syst.zac.htm", page_hero("Osłony okienne", "Systemy osłon okiennych", "Zewnętrzne i wewnętrzne osłony przeciwsłoneczne - od rolet aluminiowych po tekstylne. Doradzimy, który system sprawdzi się w danym budynku, i wykonamy go na wymiar.") + f'''
  <section class="section">
    <div class="container">
      {split("assets/hero.jpg", "Elewacja budynku z roletami zewnętrznymi", "Osłony zewnętrzne",
        '<p>Rolety i żaluzje montowane na zewnątrz okien chronią przed upałem, hałasem i włamaniem, a jednocześnie nie zajmują miejsca we wnętrzu.</p>'
        '<div class="tags"><span class="tag"><a href="rolety.htm">Rolety aluminiowe</a></span><span class="tag"><a href="zaluzjefasadowe.htm">Żaluzje fasadowe</a></span><span class="tag"><a href="refleksole.htm">Refleksole</a></span><span class="tag"><a href="markizy.htm">Markizy</a></span></div>')}
      {split("assets/rolety-wewnetrzne.jpg", "Rolety tekstylne w jasnym wnętrzu", "Osłony wewnętrzne", 
        '<p>Rolety tekstylne i żaluzje wewnętrzne to najczęściej wybierana osłona okienna - ceniona za estetykę, walor dekoracyjny i skuteczną ochronę przeciwsłoneczną.</p>'
        '<div class="tags"><span class="tag"><a href="rolety.htm">Rolety i żaluzje</a></span><span class="tag"><a href="impresja.htm">System dzień-noc</a></span><span class="tag"><a href="moskitiery.htm">Moskitiery</a></span></div>', flip=True)}
    </div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head"><h2>Szczegóły systemów</h2><p>Pełne opisy, warianty i kolory znajdują się na podstronach poszczególnych produktów.</p></div>
      <div class="lb-grid">
        {lbox("Osłony zewnętrzne", "warianty i opisy", [
          deep("rolaluminiowe.htm", "Rolety aluminiowe", "rolety zewnętrzne na wymiar"),
          deep("zaluzjefasadowe.htm", "Żaluzje fasadowe", "duże przeszklenia, elewacje"),
          deep("markizy2.htm", "Markizy tarasowe i balkonowe", "modele Malta, Silver Plus, Australia i inne"),
          deep("refleksole.htm", "Refleksole", "osłony przeciwsłoneczne"),
        ])}
        {lbox("Żaluzje wewnętrzne", "warianty i opisy", [
          deep("pionowe.htm", "Żaluzje pionowe VERTICALE", "duże okna, biura"),
          deep("poziome.htm", "Żaluzje poziome 16 i 25 mm", "aluminiowe, klasyczne"),
          deep("drewniane.htm", "Żaluzje drewniane i drewnopodobne", "naturalny charakter"),
          deep("plisowane.htm", "Żaluzje plisowane", "lekkie, na wymiar"),
        ])}
        {lbox("Rolety tekstylne", "warianty i opisy", [
          deep("wolnowiszace.htm", "Rolety wolnowiszące", "klasyka w każde okno"),
          deep("mini.htm", "System MINI", "kaseta aluminiowa"),
          deep("besta.htm", "W zabudowie - system BESTA", "kaseta zabudowana"),
          deep("luiza.htm", "W zabudowie - system LUIZA", "kaseta z prowadnicami"),
          deep("rzymskie.htm", "Rolety rzymskie", "miękka, dekoracyjna tkanina"),
          deep("dachowe.htm", "Rolety dachowe", "do okien połaciowych"),
          deep("impresja.htm", "System IMPRESJA (dzień/noc)", "tkanina naprzemienna"),
          deep("track.htm", "Panel track - japońska ściana", "szerokie przeszklenia"),
        ])}
      </div>
    </div>
  </section>''')

pages["rolety.htm"] = page("rolety.htm",
    "Rolety i żaluzje - ROLTAR Tarnów",
    "Rolety zewnętrzne aluminiowe, rolety tekstylne wewnętrzne i żaluzje: poziome, pionowe, drewniane, plisowane. Produkcja i montaż w Tarnowie i okolicach.",
    "rolety.htm", page_hero("Rolety-Żaluzje", "Rolety i żaluzje", "Rolety aluminiowe chronią przed upałem, hałasem i włamaniem. Rolety tekstylne i żaluzje dekorują wnętrze i zapewniają komfortowe światło. Wszystko wykonujemy i montujemy na wymiar.") + f'''
  <section class="section">
    <div class="container">
      {split("assets/rolety-zewnetrzne.jpg", "Rolety zewnętrzne aluminiowe na oknie", "Rolety zewnętrzne aluminiowe",
        '<p>Rolety aluminiowe montowane na oknach domów, mieszkań i firm. Chronią przed słońcem, hałasem i włamaniem, a latem ograniczają nagrzewanie pomieszczeń. Sterowanie ręczne lub napędem elektrycznym.</p>'
        '<p>Do wyboru wersje <strong>adaptacyjne</strong> (montowane na istniejące okna), <strong>podtynkowe</strong> oraz <strong>nadprożowe</strong>.</p>')}
    </div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="lb-grid">
        {lbox("Rolety zewnętrzne - warianty", "opisy i szczegóły", [
          deep("rolaluminiowe.htm", "Rolety aluminiowe", "wersje antywłamaniowe i zaciemniające"),
          deep("systadap.htm", "Rolety adaptacyjne", "montaż bez zdejmowania okna"),
          deep("podtynk.htm", "Rolety podtynkowe", "kaseta schowana w tynku"),
          deep("nadpro.htm", "Rolety nadprożowe", "kaseta w nadprożu okna"),
          deep("rolety1234.htm", "Osłony zewnętrzne", "pozostałe systemy osłon"),
        ])}
        {lbox("Napędy do rolet", "sterowanie", [
          deep("ndr.htm", "Silniki i sterowania do rolet okiennych", "elektryczne, radiowe, z pilotem"),
          deep("napedy.htm", "Napędy i automatyka", "pełen zakres napędów"),
        ])}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      {split("assets/rolety-wewnetrzne.jpg", "Rolety tekstylne dzień-noc w salonie", "Rolety tekstylne",
        '<p>Obecnie najczęściej wybierana osłona okienna - ceniona przez klientów za estetykę, walor dekoracyjny oraz skuteczną ochronę przeciwsłoneczną.</p>'
        '<p>Montujemy rolety <strong>wolnowisące</strong>, w <strong>zabudowie kasetowej</strong> oraz systemy <strong>dzień-noc</strong>, a do okien dachowych - rolety połaciowe.</p>')}
    </div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="lb-grid">
        {lbox("Rolety tekstylne - systemy", "warianty i opisy", [
          deep("impresja.htm", "System IMPRESJA (dzień/noc)", "przepuszczające światło paski"),
          deep("wolnowiszace.htm", "Rolety wolnowiszące", "tkanina na wałku, bez prowadnic"),
          deep("mini.htm", "System MINI", "kaseta aluminiowa"),
          deep("besta.htm", "W zabudowie - BESTA", "kaseta w zabudowie"),
          deep("luiza.htm", "W zabudowie - LUIZA", "z prowadnicami przestrzennymi"),
          deep("rzymskie.htm", "Rolety rzymskie", "dekoracyjne fałdy tkaniny"),
          deep("dachowe.htm", "Rolety dachowe", "do okien połaciowych"),
          deep("track.htm", "Panel track - japońska ściana", "szerokie przeszklenia"),
          deep("plisowane.htm", "Rolety plisowane", "lekkie i kompaktowe"),
        ])}
        {lbox("Żaluzje wewnętrzne", "warianty i opisy", [
          deep("pionowe.htm", "Żaluzje pionowe VERTICALE", "do dużych okien i biur"),
          deep("poziome.htm", "Żaluzje poziome 16 i 25 mm", "aluminiowe, klasyczne"),
          deep("drewniane.htm", "Żaluzje drewniane i drewnopodobne", "ciepły, naturalny wygląd"),
          deep("plisowane.htm", "Żaluzje plisowane", "nowoczesne i praktyczne"),
        ])}
      </div>
    </div>
  </section>''')

pages["bramy.htm"] = page("bramy.htm",
    "Bramy garażowe, wjazdowe i przemysłowe - ROLTAR Tarnów",
    "Bramy garażowe segmentowe i rolowane, bramy wjazdowe przesuwne samonośne, bramy przemysłowe oraz napędy do bram. Sprzedaż i montaż w Tarnowie.",
    "bramy.htm", page_hero("Bramy", "Bramy", "Bramy garażowe, wjazdowe i przemysłowe wraz z napędami. Solidne konstrukcje, staranny montaż i 24 miesiące gwarancji.") + f'''
  <section class="section">
    <div class="container">
      {split("assets/bramy.jpg", "Segmentowa brama garażowa w kolorze grafitowym", "Bramy garażowe",
        '<p><strong>Segmentowe</strong> - ciche, ocieplane, z prowadnicami dopasowanymi do nadproża. <strong>Rolowane</strong> - zwijane w kasetę nad otworem, oszczędzające miejsce.</p>'
        '<p>Obie wersje mogą pracować z napędem elektrycznym i automatyka, sterowanym pilotem.</p>')}
    </div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head"><h2>Rodzaje bram</h2><p>Wykonujemy pomiary, doradzamy wybór i montujemy bramy wraz z napędami.</p></div>
      <div class="lb-grid">
        {lbox("Bramy garażowe", "szczegóły", [
          deep("bs.htm", "Bramy segmentowe", "ocieplane, do garaży domowych"),
          deep("brrol.htm", "Bramy rolowane", "zwijane w kasetę"),
        ])}
        {lbox("Bramy wjazdowe i przemysłowe", "szczegóły", [
          deep("bpsp.htm", "Bramy wjazdowe przesuwne samonośne", "wjazdy na posesje i do firm"),
          deep("bp.htm", "Bramy przemysłowe", "hale, magazyny, zakłady"),
          deep("ndbr.htm", "Napędy do bram", "automatyka i akcesoria"),
        ])}
      </div>
    </div>
  </section>''')

pages["kraty.htm"] = page("kraty.htm",
    "Kraty rolowane - ROLTAR Tarnów",
    "Kraty rolowane aluminiowe zabezpieczające okna, drzwi i witryny lokali. Lakierowanie proszkowe na dowolny kolor RAL, możliwość montażu automatyki.",
    "kraty.htm", page_hero("Kraty rolowane", "Kraty rolowane", "Kraty zwijane skutecznie chronią lokal przed intruzami, są estetyczne i zapewniają bezpieczeństwo.") + f'''
  <section class="section">
    <div class="container">
      {split("assets/kraty.jpg", "Krata rolowana zabezpieczająca witrynę", "Bezpieczeństwo, które nie zasłania światła",
        '<p>Kraty rolowane montujemy w oknach, drzwiach i witrynach lokali usługowych. Zwijane do kasety nad otworem, nie ograniczają światła dziennego i można je płynnie regulować.</p>'
        '<p>Profile wykonane są z <strong>aluminium</strong> i mogą być lakierowane proszkowo na <strong>dowolny kolor RAL</strong>.</p>')}
    </div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head"><h2>Obsługa krat</h2></div>
      <div class="trust">
        <div class="cell"><div class="ico">{I["wrench"]}</div><h3>Napęd elektryczny</h3><p>Montaż automatyki umożliwia łatwą i szybką obsługę kraty.</p></div>
        <div class="cell"><div class="ico">{I["clock"]}</div><h3>Korba awaryjna</h3><p>Pozwala podnieść kratę w razie braku prądu.</p></div>
        <div class="cell"><div class="ico">{I["shield"]}</div><h3>Aluminium</h3><p>Lekkie i odporne profile, lakierowane proszkowo.</p></div>
        <div class="cell"><div class="ico">{I["check"]}</div><h3>Dowolny kolor RAL</h3><p>Kratę dopasujemy do elewacji i witryny.</p></div>
      </div>
    </div>
  </section>''')

pages["markizy.htm"] = page("markizy.htm",
    "Markizy tarasowe, balkonowe i koszowe - ROLTAR Tarnów",
    "Markizy tarasowe, balkonowe, koszowe i niestandardowe. Eleganckie zacienienie tarasów, balkonów i witryn. Rozwijanie korbowe lub elektryczne.",
    "markizy.htm", page_hero("Markizy", "Markizy", "Eleganckie i praktyczne markizy pomagają ukryć się przed palącymi promieniami słońca - doskonale zacieniają tarasy, balkony i witryny sklepowe.") + f'''
  <section class="section">
    <div class="container">
      {split("assets/markiza.jpg", "Rozłożona markiza nad letnim tarasem", "Zacienienie na całe lato",
        '<p>Zaletą markiz jest to, że nie są konstrukcją stałą - można je <strong>rozwijać i zwijać</strong> w zależności od potrzeby. Wykonane są z materiałów nieprzemakalnych, a konstrukcja z profili aluminiowych lakierowanych proszkowo, co gwarantuje długoletnie użytkowanie.</p>'
        '<p>Rozwijanie i zwijanie odbywa się za pomocą <strong>przekładni korbowej lub silnika elektrycznego</strong>. Bardzo duży wybór materiałów pozwala dopasować markizę do elewacji budynku.</p>')}
    </div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head"><h2>Rodzaje i modele</h2><p>W ofercie m.in. markizy tarasowe Malta, Silver Plus, Australia, Jamaica, Palladio i Dakar - opisy i zdjęcia na podstronach.</p></div>
      <div class="lb-grid">
        {lbox("Markizy", "rodzaje", [
          deep("mtaras.htm", "Markizy tarasowe", "duże tarasy, ogrody zimowe"),
          deep("mbalkon.htm", "Markizy balkonowe", "balkony i tarasy balkonowe"),
          deep("mkosz.htm", "Markizy koszowe", "hotele, restauracje, puby"),
          deep("mniest.htm", "Markizy niestandardowe", "wymiary i kształty na zamówienie"),
        ])}
        {lbox("Warto zobaczyć", "powiązane strony", [
          deep("markizy2.htm", "Modele markiz tarasowych", "Malta, Silver Plus, Australia, Jamaica, Palladio, Dakar"),
          deep("ndm.htm", "Napędy do markiz", "silniki do markiz i ogrodów zimowych"),
          deep("syst.zac.htm", "Systemy osłon okiennych", "pełna oferta osłon"),
        ])}
      </div>
    </div>
  </section>''')

pages["refleksole.htm"] = page("refleksole.htm",
    "Refleksole - zewnętrzne osłony przeciwsłoneczne | ROLTAR Tarnów",
    "Refleksole - zewnętrzne osłony przeciwsłoneczne do przeszklonych powierzchni pionowych. Naturalna klimatyzacja, komfort optyczny i oszczędność energii.",
    "refleksole.htm", page_hero("Refleksole", "Refleksole", "Zewnętrzna osłona przeciwsłoneczna do przeszklonych powierzchni pionowych - biur, budynków użyteczności publicznej i domów z dużymi oknami.") + f'''
  <section class="section">
    <div class="container">
      {split("assets/refleksole.jpg", "Refleksole na szklanej elewacji biurowca", "Naturalna klimatyzacja i energooszczędność",
        '<p>Refleksol pomaga utrzymać stałą, komfortową temperaturę w pomieszczeniu narażonym na działanie promieni słonecznych. Jednoczesne zastosowanie rolet typu Refleksol pozwala ograniczyć użycie urządzeń klimatyzacyjnych, co zmniejsza koszty eksploatacji budynków.</p>')}
    </div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head"><h2>Dlaczego refleksole?</h2></div>
      <div class="trust">
        <div class="cell"><div class="ico">{I["check"]}</div><h3>Komfort optyczny</h3><p>Tkaniny High-T-Tex, Polyscreen i Screen tłumią kontrasty, zachowując widoczność na zewnątrz.</p></div>
        <div class="cell"><div class="ico">{I["check"]}</div><h3>Estetyka</h3><p>Bogata oferta tkanin i kolorów oraz lakierowanie konstrukcji pozwalają wkomponować rolety w architekturę.</p></div>
        <div class="cell"><div class="ico">{I["check"]}</div><h3>Zaciemnienie wnętrz</h3><p>Refleksole montowane wewnątrz dają efekt pełnego zaciemnienia - np. w salach kinowych i wykładowych.</p></div>
        <div class="cell"><div class="ico">{I["check"]}</div><h3>Trwałość</h3><p>Aluminiowa konstrukcja i tkaniny z włókien poliestrowych pokrywanych PVC gwarantują długie użytkowanie.</p></div>
      </div>
    </div>
  </section>''')

pages["napedy.htm"] = page("napedy.htm",
    "Napędy i automatyka - ROLTAR Tarnów",
    "Napędy i akcesoria do automatyzacji bram wjazdowych, garażowych, rolet okiennych, markiz i osłon wewnętrznych. Marki: Marantec, Nice, FAAC, Came.",
    "napedy.htm", page_hero("Napędy i automatyka", "Napędy i automatyka", "Oferujemy pełen zakres napędów oraz akcesoriów do automatyzacji bram wjazdowych i garażowych, rolet okiennych i markiz oraz osłon wewnętrznych.") + f'''
  <section class="section">
    <div class="container">
      {split("assets/napedy.jpg", "Silnik rurowy do rolety ze sterownikiem", "Automatyka pod klucz",
        '<p>Sterowanie bramą, roletą lub markizą to wygoda na co dzień: <strong>pilot, wyłącznik ścienny lub automatykę pogodową</strong> dobierzemy do istniejącej instalacji albo zaprojektujemy od podstaw.</p>'
        '<p>Montujemy napędy i sterowania renomowanych producentów - <strong>Marantec, Nice, FAAC i Came</strong>.</p>')}
    </div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head"><h2>Zakres automatyki</h2></div>
      <div class="lb-grid">
        {lbox("Napędy i sterowania", "szczegóły", [
          deep("ndbr.htm", "Napędy do bram", "bramy wjazdowe i garażowe"),
          deep("ndr.htm", "Silniki i sterowania do rolet okiennych", "rolety zewnętrzne i wewnętrzne"),
          deep("ndm.htm", "Napędy do markiz", "markizy i ogrody zimowe"),
          deep("szlabany.htm", "Szlabany i zapory drogowe", "wjazdy na posesje i do firm"),
        ])}
        {lbox("Montujemy u klientów", "producenci napędów", [
          deep("ndbr.htm", "Napędy do bram wjazdowych", "siłowniki i automatyka"),
          deep("ndr.htm", "Automatyka do rolet", "silniki rurkowe, sterowniki radiowe"),
          ("bramy.htm", "Bramy z napędem", "segmentowe i rolowane - zobacz ofertę"),
        ])}
      </div>
    </div>
  </section>''')

pages["moskitiery.htm"] = page("moskitiery.htm",
    "Moskitiery ramkowe, drzwi przeciw owadom, siatki rolowane - ROLTAR Tarnów",
    "Moskitiery ramkowe montowane bez wiercenia okna, drzwi przeciw owadom z samozamykającymi zawiasami oraz siatki rolowane zwijane do kasety.",
    "moskitiery.htm", page_hero("Moskitiery", "Moskitiery", "Skuteczna ochrona przed owadami, która nie psuje wyglądu okien. Ramkowe, drzwiowe i rolowane - z montażem na wymiar.") + f'''
  <section class="section">
    <div class="container">
      {split("assets/moskitiery.jpg", "Moskitiera ramkowa w otwartym oknie", "Siatki ramkowe do okien",
        '<p>Ramka aluminiowa z siatką z włókna szklanego w kolorze szarym. <strong>Montaż bez konieczności wiercenia ramy okna</strong> - prosta instalacja za pomocą sprężystych zaczepów zakładanych na profil okna.</p>'
        '<p>Kolory ramek: <strong>biały, brąz, złoty dąb, orzech, mahoniowy</strong>.</p>')}
    </div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head"><h2>Pozostałe rodzaje moskitier</h2></div>
      <div class="split">
        <div class="split-body">
          <h2>Drzwi przeciw owadom</h2>
          <p>Rama ze stabilnego profilu aluminiowego, <strong>zawiasy samozamykające ze sprężynami</strong> i magnesy domykowe. Siatka z włókna szklanego w kolorze szarym, a dolną część drzwi można wypełnić poliwęglanem - z przejściem dla psów i kotów.</p>
          <p>Kolory ramek: biel, brąz, złoty dąb gładki i struktura drewna.</p>
        </div>
        <div class="split-body">
          <h2>Siatki rolowane do kasety</h2>
          <p>Zwój siatki chowa się w kasecie nad oknem lub drzwiami. Wyróżnia je styl, jakość oraz <strong>łatwość montażu i użycia</strong> - montaż wewnątrz albo na zewnątrz ramy.</p>
          <p>Kolory kasetek i prowadnic: biel i brąz (standard) lub lakierowanie proszkowe wg RAL. <strong>Dwuletnia gwarancja.</strong></p>
        </div>
      </div>
    </div>
  </section>''')

pages["folie.htm"] = page("folie.htm",
    "Folie okienne antywłamaniowe i przeciwsłoneczne - ROLTAR Tarnów",
    "Folie okienne antywłamaniowe zwiększające odporność szyb na rozbicie oraz folie zatrzymujące energię słoneczną. Montaż w Tarnowie i okolicach.",
    "folie.htm", page_hero("Folie okienne", "Folie okienne", "Folie antywłamaniowe i zatrzymujące energię słoneczną - dyskretne wzmocnienie okien w domach, biurach i lokalach usługowych.") + f'''
  <section class="section">
    <div class="container">
      {split("assets/folie.jpg", "Szyba okienna z folią ochronną", "Folie antywłamaniowe",
        '<p>Folie antywłamaniowe zwiększają odporność szyby na rozbicie i <strong>utrudniają włamanie</strong> - zbite szkło pozostaje na folii, co chroni też przed odłamkami.</p>'
        '<p>Stosujemy je w witrynach, drzwiach i oknach, również w budynkach użyteczności publicznej.</p>')}
    </div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head"><h2>Folie zatrzymujące energię słoneczną</h2><p>Naklejone na szybę folie ograniczają nagrzewanie wnętrz latem, redukują olśnienie i chronią wyposażenie przed blaknięciem - zimą pomagają zatrzymać ciepło w budynku.</p></div>
    </div>
  </section>''')

pages["roltar.htm"] = page("roltar.htm",
    "Dojazd do firmy - ROLTAR Tarnów",
    "Jak dojechać do firmy ROLTAR: ul. Makuszyńskiego 41, 33-100 Tarnów. Mapa i wskazówki dojazdu, telefon 14 626 53 85.",
    "roltar.htm", page_hero("Dojazd do firmy", "Dojazd do firmy", "Znajdziesz nas w Tarnowie przy ul. Makuszyńskiego 41. Zapraszamy po wcześniejszym kontakcie telefonicznym.") + f'''
  <section class="section">
    <div class="container">
      <div class="contact-grid" style="margin-bottom:24px">
        <div class="contact-card">
          <div class="ico">{I["pin"]}</div>
          <div><h3>Adres firmy</h3><div class="val">ul. Makuszyńskiego 41<br>33-100 Tarnów</div></div>
        </div>
        <div class="contact-card">
          <div class="ico">{I["phone"]}</div>
          <div><h3>Telefon / fax</h3><div class="val"><a href="tel:+48146265385">14 626 53 85</a><span class="hint">kom. <a href="tel:+48601721094">601 721 094</a></span></div></div>
        </div>
      </div>
      <div class="section-head"><h2>Mapa dojazdu</h2></div>
      <div style="border-radius:16px;overflow:hidden;border:1px solid var(--line);box-shadow:0 24px 50px -30px rgba(10,13,17,.35)">
        <iframe title="Mapa dojazdu do firmy ROLTAR, ul. Makuszyńskiego 41, Tarnów" src="https://www.google.com/maps?q=ul.+Makuszy%C5%84skiego+41,+33-100+Tarn%C3%B3w&output=embed" width="100%" height="420" style="border:0;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <div style="margin-top:18px" class="cta-actions">
        <a class="btn btn-dark" href="https://www.google.com/maps/dir/?api=1&amp;destination=ul.+Makuszy%C5%84skiego+41,+33-100+Tarn%C3%B3w" target="_blank" rel="noopener">{I["pin"]}Wyznacz trasę w Google Maps</a>
        <a class="btn btn-dark" href="tel:+48146265385">{I["phone"]}Zadzwoń przed przyjazdem</a>
      </div>
    </div>
  </section>''')

pages["kontakt.html"] = page("kontakt.html",
    "Kontakt - ROLTAR Tarnów | rolety, bramy, markizy",
    "Kontakt z firmą ROLTAR Tarnów: ul. Makuszyńskiego 41, tel./fax 14 626 53 85, kom. 601 721 094, e-mail roltar.tarnow@gmail.com. Zamówienia 8:00-17:00.",
    "kontakt.html", page_hero("Kontakt", "Kontakt", "Jeżeli mają Państwo jakiekolwiek pytania, z chęcią na nie odpowiemy. Prosimy o kontakt telefoniczny lub mailowy - mamy nadzieję, że nasze usługi spełnią Państwa oczekiwania.") + f'''
  <section class="section">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-card">
          <div class="ico">{I["pin"]}</div>
          <div><h3>Adres</h3><div class="val">ul. Makuszyńskiego 41<br>33-100 Tarnów<span class="hint"><a href="roltar.htm">dojazd i mapa</a></span></div></div>
        </div>
        <div class="contact-card">
          <div class="ico">{I["phone"]}</div>
          <div><h3>Telefon / fax</h3><div class="val"><a href="tel:+48146265385">14 626 53 85</a></div></div>
        </div>
        <div class="contact-card">
          <div class="ico">{I["phone"]}</div>
          <div><h3>Telefon komórkowy</h3><div class="val"><a href="tel:+48601721094">601 721 094</a></div></div>
        </div>
        <div class="contact-card">
          <div class="ico">{I["mail"]}</div>
          <div><h3>E-mail</h3><div class="val"><a href="mailto:roltar.tarnow@gmail.com">roltar.tarnow@gmail.com</a></div></div>
        </div>
        <div class="contact-card">
          <div class="ico">{I["clock"]}</div>
          <div><h3>Zamówienia</h3><div class="val">8:00 - 17:00<span class="hint">od poniedziałku do piątku</span></div></div>
        </div>
        <div class="contact-card">
          <div class="ico">{I["mail"]}</div>
          <div><h3>Zapytanie ofertowe</h3><div class="val"><a href="mailto:roltar.tarnow@gmail.com?subject=Zapytanie%20ofertowe">napisz do nas e-mail</a><span class="hint">odpowiadamy zwykle tego samego dnia</span></div></div>
        </div>
      </div>
    </div>
  </section>''', cta=False)

# ---------------------------------------------------------------- strony szczegółowe
# Strony 2. poziomu (nadpisujące oryginalne podstrony serwisu) definiuje
# moduł details.py - wykonujemy go w tej samej przestrzeni nazw.
exec(open(os.path.join(os.path.dirname(__file__), "details.py"), encoding="utf-8").read())

# ---------------------------------------------------------------- zapis
# str.gl.htm zostaje jako przekierowanie na nową stronę główną index.html
# (dla starych odnośników prowadzących bezpośrednio do str.gl.htm)
STUB = """<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=index.html">
<title>ROLTAR - strona główna</title>
</head>
<body>
<p><a href="index.html">Przejdź do strony ROLTAR</a></p>
</body>
</html>
"""

def main():
    for fname, html in pages.items():
        with open(os.path.join(BASE, fname), "w", encoding="utf-8") as f:
            f.write(html)
        print("zapisano", fname, len(html), "B")
    with open(os.path.join(BASE, "str.gl.htm"), "w", encoding="utf-8") as f:
        f.write(STUB)
    print("zapisano str.gl.htm (przekierowanie na index.html)")

if __name__ == "__main__":
    main()

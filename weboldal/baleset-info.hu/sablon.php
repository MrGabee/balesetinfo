<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Balesetinfo – Beküldés</title>
<meta name="description" content="Láttál balesetet? Küldd be a fotót, videót vagy üzenetedet a Balesetinfónak, névtelenül is.">
<meta name="theme-color" content="#173f5f">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap">
<style>
/* Balesetinfo – a TV2-eszközökkel közös alap: mélykék fejléc, világos oldal, narancs kiemelés. */
:root{
  --bg:#f4f6f9; --card:#ffffff; --line:#dde3ea; --text:#14202c; --muted:#566373;
  --band:#173f5f; --band-2:#2a6f9e; --band-text:#ffffff; --band-muted:#d3e1ec;
  --acc:#e8601c; --acc-hover:#cf5212; --acc-text:#ffffff; --acc-soft:#fdebe1; --acc-ink:#b4470c;
  --ok:#1b7f4b; --ok-soft:#e1f3e8; --err:#b3261e; --err-soft:#fbe3e1;
  --f-display:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;
  --f-body:"Figtree",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
  color-scheme:light;
}
@media (prefers-color-scheme:dark){:root{
  --bg:#0f141b; --card:#161d27; --line:#2a3443; --text:#e6ebf2; --muted:#93a0b2;
  --band:#123049; --band-2:#1f5f8b;
  --acc:#ff7a3d; --acc-hover:#ff8f5c; --acc-text:#1a0d05; --acc-soft:#33200f; --acc-ink:#ffab7f;
  --ok:#5cc98d; --ok-soft:#15301f; --err:#f2867f; --err-soft:#3a1a18;
  color-scheme:dark;
}}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.55 var(--f-body)}
a{color:inherit}
.wrap{max-width:880px;margin:0 auto;padding-left:max(18px,env(safe-area-inset-left));padding-right:max(18px,env(safe-area-inset-right))}
h1,h2,h3{font-family:var(--f-display);line-height:1.12;margin:0;text-wrap:balance;letter-spacing:-.015em}

/* fejléc */
.band{background:radial-gradient(90% 120% at 100% 0%,var(--band-2) 0%,transparent 62%),var(--band);color:var(--band-text)}
.bar{display:flex;align-items:center;gap:16px;padding-block:16px;flex-wrap:wrap}
.logo{display:flex;align-items:center;gap:10px;font-family:var(--f-display);font-weight:800;font-size:20px;text-decoration:none}
.tile{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;flex:none;background:linear-gradient(135deg,#ff9a3c,#e8601c);color:#fff}
.tile svg{width:20px;height:20px}
.nav{margin-left:auto;display:flex;gap:18px;font-size:15px;flex-wrap:wrap}
.nav a{color:var(--band-muted);text-decoration:none}
.nav a:hover{color:#fff;text-decoration:underline}
.hero{padding-block:22px 40px;display:grid;gap:14px}
.hero h1{font-size:clamp(32px,6vw,52px);font-weight:800}
.hero h1 em{font-style:normal;color:#ffb27a}
.hero p{margin:0;color:var(--band-muted);font-size:18px;max-width:58ch}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}

.btn{font:600 16px/1 var(--f-body);display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:15px 22px;border-radius:12px;border:1px solid transparent;cursor:pointer;text-decoration:none;transition:background .15s,border-color .15s,transform .1s}
.btn svg{width:18px;height:18px;flex:none}
.btn:active{transform:translateY(1px)}
.btn:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible{outline:3px solid #ffb27a;outline-offset:2px}
.btn-primary{background:var(--acc);color:var(--acc-text)}
.btn-primary:hover{background:var(--acc-hover)}
.btn-ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.45)}
.btn-ghost:hover{background:rgba(255,255,255,.1)}
.btn[disabled]{opacity:.7;cursor:progress}

main{padding-block:28px 48px;display:grid;gap:22px}

/* visszajelzés a PHP-tól */
.alert{padding:14px 16px;border-radius:12px;font-weight:600;border:1px solid}
.alert.success{background:var(--ok-soft);color:var(--ok);border-color:currentColor}
.alert.error{background:var(--err-soft);color:var(--err);border-color:currentColor}

.steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
@media (max-width:640px){.steps{grid-template-columns:1fr}}
.step{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;display:grid;gap:4px}
.step small{font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--acc-ink)}
.step b{font-size:17px}
.step span{color:var(--muted);font-size:15px}

/* űrlapok */
details.panel{background:var(--card);border:1px solid var(--line);border-radius:16px;scroll-margin-top:16px}
details.panel[open]{border-color:var(--acc)}
summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:16px}
summary::-webkit-details-marker{display:none}
summary .ic{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--acc-soft);color:var(--acc-ink);flex:none}
summary .ic svg{width:22px;height:22px}
summary h2{font-size:20px}
summary p{margin:2px 0 0;color:var(--muted);font-size:15px}
summary .chev{margin-left:auto;width:22px;height:22px;color:var(--muted);transition:transform .2s;flex:none}
details[open] summary .chev{transform:rotate(180deg)}
form{display:grid;gap:14px;padding:4px 20px 22px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media (max-width:640px){.row{grid-template-columns:1fr}}
label{display:grid;gap:6px;font-weight:600;font-size:15px}
label .opt{font-weight:400;color:var(--muted)}
input[type=text],input[type=email],input[type=tel],textarea{width:100%;font:16px/1.4 var(--f-body);color:var(--text);background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
textarea{min-height:120px;resize:vertical}
input::placeholder,textarea::placeholder{color:var(--muted);opacity:.8}
.drop{position:relative;display:grid;place-items:center;text-align:center;gap:6px;padding:26px 16px;border:2px dashed var(--line);border-radius:14px;background:var(--bg);cursor:pointer}
.drop:hover,.drop.over{border-color:var(--acc)}
.drop input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%}
.drop b{font-size:16px}
.drop span{color:var(--muted);font-size:14px}
.drop .chosen{color:var(--text);font-weight:600}
.hint{margin:0;color:var(--muted);font-size:14px}
.formerr{margin:0;color:var(--err);font-weight:600;font-size:15px}
.hp{position:absolute;left:-9999px;top:-9999px}

footer{border-top:1px solid var(--line);padding-block:20px 32px;color:var(--muted);font-size:14px}
footer .wrap{display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center}
footer a{text-decoration:none}
footer a:hover{text-decoration:underline}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
</head>
<body>

<header class="band">
  <div class="wrap">
    <div class="bar">
      <a class="logo" href="/"><span class="tile" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3 2 20h20z"/><path d="M12 10v4m0 3v.01" stroke-linecap="round"/></svg></span>Balesetinfo</a>
      <nav class="nav" aria-label="Fő menü">
        <a href="#feltoltes" data-open="feltoltes">Beküldés</a>
        <a href="#hogyan">Hogyan működik</a>
        <a href="https://www.facebook.com/groups/balesetinfo" target="_blank" rel="noopener">Facebook csoport</a>
      </nav>
    </div>
    <div class="hero">
      <h1>Láttál balesetet? <em>Küldd&nbsp;be</em> pár&nbsp;kattintással.</h1>
      <p>Fotót, videót vagy rövid üzenetet várunk. Névtelenül is beküldheted, és a szerkesztők átnézik, mielőtt bármi megjelenik.</p>
      <div class="actions">
        <a class="btn btn-primary" href="#feltoltes" data-open="feltoltes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4m0 0-5 5m5-5 5 5M4 20h16"/></svg>Felvétel beküldése</a>
        <a class="btn btn-ghost" href="#uzenet" data-open="uzenet">Üzenet küldése</a>
      </div>
    </div>
  </div>
</header>

<main class="wrap">
  <?php if ($status_msg) echo '<div id="visszajelzes" tabindex="-1">' . $status_msg . '</div>'; ?>

  <details class="panel" id="feltoltes">
    <summary>
      <span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg></span>
      <span><h2>Felvétel beküldése</h2><p>Kép vagy videó, akár több fájl egyszerre, összesen 2 GB-ig.</p></span>
      <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
    </summary>
    <form id="uploadForm" method="POST" enctype="multipart/form-data">
      <input type="hidden" name="form_ido" value="<?php echo time(); ?>">
      <div class="hp" aria-hidden="true"><label><span>Weboldal (hagyd üresen)</span><input type="text" name="weboldal" tabindex="-1" autocomplete="off"></label></div>
      <div class="row">
        <label><span>Neved</span><input type="text" name="nev" placeholder="Hogyan szólíthatunk?" required autocomplete="name"></label>
        <label><span>Helyszín</span><input type="text" name="helyszin" placeholder="Pl. Budapest, Ráckevei út" required></label>
      </div>
      <label><span>E-mail címed <span class="opt">(ha választ vársz)</span></span><input type="email" name="u_email" placeholder="nev@pelda.hu" autocomplete="email"></label>
      <label><span>Mit látunk a felvételen? <span class="opt">(nem kötelező)</span></span><textarea name="leiras" placeholder="Mikor történt, mi látszik rajta…"></textarea></label>
      <label class="drop" id="drop">
        <input type="file" id="fileInput" name="media_file[]" multiple required accept="image/*,video/*">
        <b>Fájlok kiválasztása</b>
        <span id="fileInfo">Koppints ide, vagy húzd ide a képeket, videókat.</span>
      </label>
      <p class="formerr" id="uploadErr" hidden></p>
      <button type="submit" class="btn btn-primary" id="uploadBtn">Küldés indítása</button>
      <p class="hint">Nagy videónál a feltöltés több percig is tarthat. Ne zárd be az oldalt, amíg a visszajelzés meg nem jelenik.</p>
    </form>
  </details>

  <details class="panel" id="uzenet">
    <summary>
      <span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span>
      <span><h2>Üzenet küldése</h2><p>Tipp, kérdés vagy helyesbítés a szerkesztőknek.</p></span>
      <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
    </summary>
    <form method="POST" id="msgForm">
      <input type="hidden" name="uzenet_kuldes" value="1">
      <input type="hidden" name="form_ido" value="<?php echo time(); ?>">
      <div class="hp" aria-hidden="true"><label><span>Weboldal (hagyd üresen)</span><input type="text" name="weboldal" tabindex="-1" autocomplete="off"></label></div>
      <div class="row">
        <label><span>Neved</span><input type="text" name="u_nev" placeholder="Hogyan szólíthatunk?" required autocomplete="name"></label>
        <label><span>Telefonszám <span class="opt">(nem kötelező)</span></span><input type="tel" name="u_tel" placeholder="+36 …" autocomplete="tel"></label>
      </div>
      <label><span>E-mail címed <span class="opt">(ha választ vársz)</span></span><input type="email" name="u_email" placeholder="nev@pelda.hu" autocomplete="email"></label>
      <label><span>Üzenet</span><textarea name="u_szoveg" placeholder="Írd le, amit tudnunk kell…" required style="min-height:150px"></textarea></label>
      <button type="submit" class="btn btn-primary" id="msgBtn">Üzenet elküldése</button>
    </form>
  </details>

  <section id="hogyan" style="display:grid;gap:12px">
    <h2 style="font-size:24px">Hogyan működik?</h2>
    <div class="steps">
      <div class="step"><small>1 · Feltöltés</small><b>Te elküldöd</b><span>Kép vagy videó, helyszín, pár szó arról, mi történt.</span></div>
      <div class="step"><small>2 · Átnézés</small><b>Mi ellenőrizzük</b><span>A szerkesztők minden beküldést átnéznek, mielőtt bármi megjelenik.</span></div>
      <div class="step"><small>3 · Megjelenés</small><b>Kikerülhet a csoportba</b><span>A Balesetinfo Facebook-csoportjában, névtelenül is.</span></div>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <span>© <?php echo date('Y'); ?> Balesetinfo</span>
    <a href="https://www.facebook.com/groups/balesetinfo" target="_blank" rel="noopener">Facebook csoportunk</a>
    <a href="#uzenet" data-open="uzenet">Kapcsolat</a>
  </div>
</footer>

<script>
(function () {
  var limit = <?php echo $max_file_size_bytes; ?>;
  var form = document.getElementById('uploadForm');
  var input = document.getElementById('fileInput');
  var info = document.getElementById('fileInfo');
  var err = document.getElementById('uploadErr');
  var drop = document.getElementById('drop');

  function meret(b) { return b >= 1073741824 ? (b / 1073741824).toFixed(1) + ' GB' : b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function osszeg() { var t = 0; for (var i = 0; i < input.files.length; i++) t += input.files[i].size; return t; }

  input.addEventListener('change', function () {
    err.hidden = true;
    var n = input.files.length;
    if (!n) { info.textContent = 'Koppints ide, vagy húzd ide a képeket, videókat.'; info.className = ''; return; }
    info.textContent = n + ' fájl kiválasztva, összesen ' + meret(osszeg());
    info.className = 'chosen';
  });
  ['dragenter', 'dragover'].forEach(function (e) { drop.addEventListener(e, function () { drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (e) { drop.addEventListener(e, function () { drop.classList.remove('over'); }); });

  form.addEventListener('submit', function (e) {
    if (osszeg() > limit) {
      e.preventDefault();
      err.textContent = 'A fájlok összesen ' + meret(osszeg()) + ', ez több a megengedett 2 GB-nál. Válassz kevesebb vagy kisebb fájlt.';
      err.hidden = false;
      return;
    }
    var b = document.getElementById('uploadBtn');
    b.disabled = true;
    b.textContent = 'Feltöltés folyamatban: ' + input.files.length + ' fájl…';
  });
  document.getElementById('msgForm').addEventListener('submit', function () {
    var b = document.getElementById('msgBtn'); b.disabled = true; b.textContent = 'Küldés…';
  });

  // A gombok és menüpontok kinyitják a megfelelő panelt.
  function nyit(id) {
    var d = document.getElementById(id);
    if (!d) return;
    document.querySelectorAll('details.panel').forEach(function (x) { if (x !== d) x.open = false; });
    d.open = true;
    d.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.querySelectorAll('[data-open]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); nyit(a.getAttribute('data-open')); history.replaceState(null, '', '#' + a.getAttribute('data-open')); });
  });
  var v = document.getElementById('visszajelzes');
  if (v) { v.scrollIntoView({ block: 'center' }); v.focus({ preventScroll: true }); }
  else if (location.hash === '#feltoltes' || location.hash === '#uzenet') nyit(location.hash.slice(1));
  window.addEventListener('hashchange', function () { if (location.hash === '#feltoltes' || location.hash === '#uzenet') nyit(location.hash.slice(1)); });
})();
</script>
</body>
</html>

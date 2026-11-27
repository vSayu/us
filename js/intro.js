(function () {
  'use strict';

  var ANSWER = 'jair';

  // Imágenes laterales de la intro (cambia las rutas por las que quieras)
  var STICKERS = [
    { src: 'img/deco/deco1.png', side: 'l', top: '4%',  w: 84, out: 18, rot: -10 },
    { src: 'img/deco/deco2.png', side: 'r', top: '12%', w: 92, out: 24, rot: 12 },
    { src: 'img/deco/deco3.png', side: 'l', top: '26%', w: 96, out: 30, rot: 8 },
    { src: 'img/deco/deco4.png', side: 'r', top: '36%', w: 80, out: 20, rot: -8 },
    { src: 'img/deco/deco5.png', side: 'l', top: '50%', w: 90, out: 26, rot: -14 },
    { src: 'img/deco/deco6.png', side: 'r', top: '58%', w: 98, out: 28, rot: 10 },
    { src: 'img/deco/deco7.png', side: 'l', top: '72%', w: 86, out: 22, rot: 12 },
    { src: 'img/deco/deco8.png', side: 'r', top: '82%', w: 94, out: 26, rot: -10 }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  var intro = $('intro');
  var text = $('intro-text');
  var sad = $('sad-cat');
  var btnYes = $('btn-yes');
  var btnNo = $('btn-no');
  var form = $('intro-answer-form');
  var input = $('intro-answer');

  if (!intro) return;

  var TU = '<span class="tu">Tú</span>';
  var T = {
    s1: 'Heyyyyy!!!',
    s2: 'Acaso eres tú¿¿???',
    s3: 'Eres ' + TU + ' el amor de mi vida¿¿??',
    s5: 'Hmmmm... Veamos si eso es cierto :b',
    s6: 'Como se llama tu futuro esposo y el amor de tu vida¿? :3',
    wrong: '.... ok'
  };

  function norm(s) {
    return String(s).trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  }

  /* Misma tipografía que la sección "Quiero decirte algo" */
  function applyFont() {
    var ref = document.querySelector('.apology-copy p') || document.querySelector('.section-copy p');
    if (!ref) return Promise.resolve();
    var cs = getComputedStyle(ref);
    intro.style.setProperty('--intro-font', cs.fontFamily);
    intro.style.setProperty('--intro-weight', cs.fontWeight);
    if (document.fonts && document.fonts.load) {
      return Promise.race([
        document.fonts.load(cs.fontWeight + ' 24px ' + cs.fontFamily),
        wait(1500)
      ]).catch(function () {});
    }
    return Promise.resolve();
  }

  function buildStickers() {
    var wrap = document.createElement('div');
    wrap.className = 'intro-stickers';
    wrap.setAttribute('aria-hidden', 'true');
    STICKERS.forEach(function (s, i) {
      var img = new Image();
      img.className = 'intro-sticker';
      img.alt = '';
      img.src = s.src;
      img.style.top = s.top;
      img.style.width = s.w + 'px';
      img.style[s.side === 'l' ? 'left' : 'right'] = '-' + s.out + 'px';
      img.style.setProperty('--r', s.rot + 'deg');
      img.style.setProperty('--d', (0.3 + i * 0.25) + 's');
      img.addEventListener('error', function () { img.remove(); });
      wrap.appendChild(img);
    });
    intro.insertBefore(wrap, intro.firstChild);
  }

  function buildHearts() {
    var wrap = $('intro-hearts');
    if (!wrap) return;
    for (var i = 0; i < 22; i++) {
      var heart = document.createElement('span');
      heart.className = 'intro-heart';
      heart.style.left = (Math.random() * 100) + '%';
      heart.style.setProperty('--size', (8 + Math.random() * 18) + 'px');
      heart.style.setProperty('--duration', (10 + Math.random() * 13) + 's');
      heart.style.setProperty('--delay', (-Math.random() * 23) + 's');
      heart.style.setProperty('--tint-delay', (-Math.random() * 6) + 's');
      heart.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
      heart.style.setProperty('--heart-opacity', (.22 + Math.random() * .32).toFixed(2));
      wrap.appendChild(heart);
    }
  }

  /* Espera a que termine la escritura letra por letra */
  function typeDone() {
    var chars = text.querySelectorAll('.tw-char');
    var last = chars[chars.length - 1];
    return new Promise(function (resolve) {
      if (!last) { resolve(); return; }
      var done = false;
      function fin() { if (!done) { done = true; resolve(); } }
      last.addEventListener('animationend', fin, { once: true });
      last.addEventListener('transitionend', fin, { once: true });
      setTimeout(fin, chars.length * 90 + 1200);
    });
  }

  async function setText(html, hold) {
    text.classList.remove('in');
    await wait(420);
    text.classList.remove('writing');
    text.removeAttribute('aria-label');
    delete text.dataset.tw;
    text.innerHTML = html;
    text.classList.add('in');
    if (typeof startWriting === 'function') {     // animación de escritura de app.js
      startWriting(text);
      await typeDone();
    }
    if (hold) await wait(hold);
  }

  function panel(mode) {
    intro.classList.remove('show-yesno', 'show-answer');
    if (mode) intro.classList.add('show-' + mode);
  }

  function resetLayout() {
    panel(null);
    intro.classList.remove('up');
  }

  function waitClick(btn) {
    return new Promise(function (resolve) {
      btn.addEventListener('click', function h() {
        btn.removeEventListener('click', h);
        resolve();
      });
    });
  }

  // El botón "No" se escapa (quítalo si prefieres que no haga nada)
  function dodge(e) {
    e.preventDefault();
    var x = (Math.random() * 120 - 60).toFixed(0);
    var y = (Math.random() * 60 - 30).toFixed(0);
    btnNo.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }
  btnNo.addEventListener('pointerdown', dodge);
  btnNo.addEventListener('click', function (e) { e.preventDefault(); });

  function askName() {
    return new Promise(function (resolve) {
      input.value = '';
      function onSubmit(e) {
        e.preventDefault();
        form.removeEventListener('submit', onSubmit);
        resolve(input.value);
      }
      form.addEventListener('submit', onSubmit);
      setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (_) {} }, 1600);
    });
  }

  async function playSadCat() {
    sad.classList.remove('play');
    void sad.offsetWidth;
    sad.classList.add('play');
    await wait(2700);
    sad.classList.remove('play');
  }

  function finish() {
    startGift();
  }

  async function run() {
    await applyFont();
    await wait(400);
    await setText(T.s1, 700);             // Escena 1
    await setText(T.s2, 800);             // Escena 2

    while (true) {
      resetLayout();
      await setText(T.s3, 800);           // Escena 3

      intro.classList.add('up');          // Escena 4: texto sube, aparece gatito + Sí/No
      await wait(1550);
      panel('yesno');
      await waitClick(btnYes);
      panel(null);
      await wait(900);
      intro.classList.remove('up');
      await wait(700);

      await setText(T.s5, 1000);          // Escena 5
      await setText(T.s6, 600);           // Escena 6

      intro.classList.add('up');          // Escena 7: texto sube, gatito + respuesta
      await wait(1550);
      panel('answer');
      var ans = await askName();
      input.blur();

      if (norm(ans) === ANSWER) {
        panel(null);
        await wait(300);
        finish();
        return;
      }

      // Respuesta incorrecta
      panel(null);
      intro.classList.remove('up');
      await wait(500);
      await setText(T.wrong, 900);        // ".... ok"
      await playSadCat();                 // gato triste: aparece, zoom, zoom fuera, desaparece
      // vuelve a la escena 3
    }
  }

  // Si ya abrió el regalo antes, app.js oculta la entrada: no correr la intro
  var entryScreen = $('entry-screen');
  if (entryScreen && entryScreen.hidden) return;

  buildStickers();
  buildHearts();
  run();
})();

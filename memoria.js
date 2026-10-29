var temas = {
  frutas: ["🍎", "🍌", "🍇", "🍓", "🍉", "🍍", "🍒", "🥝"],
  animales: ["🐶", "🐱", "🐸", "🐵", "🐼", "🦁", "🐷", "🐰"],
  musica: ["🎸", "🥁", "🎹", "🎺", "🎻", "🎤", "🎧", "🎷"]
};
var tiposSonido = { frutas: "triangle", animales: "square", musica: "sine" };
var opciones = { facil: [6, 8], medio: [10, 12], dificil: [14, 16] };

var audio = null, volumen = 0.6, sonidoOn = true;
var primera = null, bloqueo = true, parejas = 0, total = 0;
var segundos = 0, limite = 0, reloj = null, tema = "frutas", emojis = [];

var $ = function (id) { return document.getElementById(id); };

// ---- Sonidos (se generan con el navegador, sin archivos) ----
function tono(freq, dur, tipo, retraso) {
  if (!sonidoOn) { return; }
  if (!audio) { audio = new (window.AudioContext || window.webkitAudioContext)(); }
  var o = audio.createOscillator(), g = audio.createGain();
  var t0 = audio.currentTime + (retraso || 0);
  o.type = tipo; o.frequency.value = freq;
  g.gain.setValueAtTime(volumen * 0.3, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  o.connect(g); g.connect(audio.destination);
  o.start(t0); o.stop(t0 + dur);
}

// ---- Menú ----
function llenarCartas() {
  var lista = opciones[$("dificultad").value];
  $("num-cartas").innerHTML = "";
  for (var i = 0; i < lista.length; i++) {
    var op = document.createElement("option");
    op.value = lista[i]; op.textContent = lista[i] + " tarjetas";
    $("num-cartas").appendChild(op);
  }
}
$("dificultad").addEventListener("change", llenarCartas);
$("volumen").addEventListener("input", function () { volumen = this.value / 100; tono(500, 0.15, "sine"); });
llenarCartas();

$("btn-jugar").addEventListener("click", function () {
  if ($("num-cartas").value == "") { $("error").textContent = "Elige el número de tarjetas."; return; }
  $("error").textContent = "";
  sonidoOn = $("sonido").value == "1";
  volumen = $("volumen").value / 100;
  tema = $("tema").value;
  limite = parseInt($("limite").value);
  total = parseInt($("num-cartas").value) / 2;
  var memorizar = parseInt($("t-memorizar").value);

  emojis = temas[tema].slice(0, total);
  var baraja = emojis.concat(emojis);
  baraja.sort(function () { return Math.random() - 0.5; });

  $("tablero").innerHTML = "";
  for (var i = 0; i < baraja.length; i++) {
    var b = document.createElement("button");
    b.className = "tarjeta carta volteada";
    b.dataset.e = baraja[i];
    b.setAttribute("aria-label", "Tarjeta " + (i + 1));
    b.innerHTML = '<div class="interior"><div class="cara frente">?</div><div class="cara reverso">' + baraja[i] + '</div></div>';
    b.addEventListener("click", voltear);
    $("tablero").appendChild(b);
  }
  $("seccion-menu").classList.add("oculto");
  $("seccion-juego").classList.remove("oculto");
  $("aciertos").textContent = "Parejas: 0";
  parejas = 0; primera = null; bloqueo = true; segundos = 0;
  pintarReloj(limite > 0 ? limite : 0);

  var faltan = memorizar;
  $("estado").textContent = "Memoriza: " + faltan + " s";
  var cuenta = setInterval(function () {
    faltan--;
    $("estado").textContent = "Memoriza: " + faltan + " s";
    if (faltan <= 0) {
      clearInterval(cuenta);
      var todas = $("tablero").children;
      for (var i = 0; i < todas.length; i++) { todas[i].classList.remove("volteada"); }
      bloqueo = false;
      $("estado").textContent = "¡Encuentra las parejas!";
      iniciarReloj();
    }
  }, 1000);
});

// ---- Reloj ----
function pintarReloj(s) {
  var m = Math.floor(s / 60), r = s % 60;
  $("reloj").textContent = "⏱ " + (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
}
function iniciarReloj() {
  reloj = setInterval(function () {
    segundos++;
    if (limite > 0) {
      pintarReloj(limite - segundos);
      if (segundos >= limite) { terminar(false); }
    } else { pintarReloj(segundos); }
  }, 1000);
}

// ---- Juego ----
function voltear() {
  if (bloqueo || this.classList.contains("volteada")) { return; }
  this.classList.add("volteada");
  var idx = emojis.indexOf(this.dataset.e);
  tono(300 + idx * 70, 0.25, tiposSonido[tema]);
  if (primera == null) { primera = this; return; }
  var segunda = this, a = primera;
  primera = null;
  if (a.dataset.e == segunda.dataset.e) {
    a.classList.add("acertada"); segunda.classList.add("acertada");
    parejas++;
    $("aciertos").textContent = "Parejas: " + parejas;
    tono(660, 0.15, "sine", 0.1); tono(880, 0.2, "sine", 0.25);
    if (parejas == total) { setTimeout(function () { terminar(true); }, 500); }
  } else {
    bloqueo = true;
    setTimeout(function () {
      a.classList.remove("volteada"); segunda.classList.remove("volteada");
      bloqueo = false;
    }, 800);
  }
}

function terminar(gano) {
  clearInterval(reloj);
  bloqueo = true;
  if (gano) {
    $("fin-titulo").textContent = "🎉 ¡Felicidades!";
    $("fin-texto").textContent = "Encontraste todas las parejas en " + segundos + " segundos.";
    tono(523, 0.15, "square"); tono(659, 0.15, "square", 0.15); tono(784, 0.15, "square", 0.3); tono(1047, 0.4, "square", 0.45);
  } else {
    $("fin-titulo").textContent = "😢 ¡Se acabó el tiempo!";
    $("fin-texto").textContent = "Lograste " + parejas + " de " + total + " parejas. ¡Inténtalo de nuevo!";
    tono(400, 0.2, "sawtooth"); tono(300, 0.2, "sawtooth", 0.2); tono(200, 0.4, "sawtooth", 0.4);
  }
  $("fin").classList.remove("oculto");
  $("btn-seguir").focus();
}

$("btn-seguir").addEventListener("click", function () {
  $("fin").classList.add("oculto");
  $("seccion-juego").classList.add("oculto");
  $("seccion-menu").classList.remove("oculto");
});

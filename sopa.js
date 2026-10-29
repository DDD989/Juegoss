// Palabras con su posicion: fila, columna, direccion fila, direccion columna
var lista = [
  { w: "CEREBRO", f: 0, c: 0, df: 0, dc: 1 },
  { w: "MEMORIA", f: 2, c: 3, df: 0, dc: 1 },
  { w: "RECUERDO", f: 3, c: 2, df: 0, dc: 1 },
  { w: "ATENCION", f: 2, c: 0, df: 1, dc: 0 },
  { w: "LOGICA", f: 4, c: 2, df: 1, dc: 1 },
  { w: "MENTE", f: 4, c: 8, df: 1, dc: 0 }
];
var letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var cuadro, inicio, encontradas;

function crear() {
  cuadro = []; inicio = null; encontradas = 0;
  for (var r = 0; r < 10; r++) { cuadro.push(["", "", "", "", "", "", "", "", "", ""]); }
  for (var i = 0; i < lista.length; i++) {
    for (var k = 0; k < lista[i].w.length; k++) {
      cuadro[lista[i].f + k * lista[i].df][lista[i].c + k * lista[i].dc] = lista[i].w[k];
    }
  }
  var tabla = document.getElementById("tablero-sopa");
  tabla.innerHTML = "";
  for (var r = 0; r < 10; r++) {
    var fila = document.createElement("tr");
    for (var c = 0; c < 10; c++) {
      if (cuadro[r][c] == "") { cuadro[r][c] = letras[Math.floor(Math.random() * 26)]; }
      var td = document.createElement("td");
      td.textContent = cuadro[r][c];
      td.dataset.f = r; td.dataset.c = c;
      td.tabIndex = 0;
      td.setAttribute("role", "button");
      td.setAttribute("aria-label", "Letra " + cuadro[r][c] + " fila " + (r + 1) + " columna " + (c + 1));
      td.addEventListener("click", elegir);
      td.addEventListener("keydown", function (e) { if (e.key == "Enter" || e.key == " ") { e.preventDefault(); elegir.call(this); } });
      fila.appendChild(td);
    }
    tabla.appendChild(fila);
  }
  var ul = document.getElementById("lista");
  ul.innerHTML = "";
  for (var i = 0; i < lista.length; i++) {
    var li = document.createElement("li");
    li.textContent = lista[i].w; li.id = "p-" + lista[i].w;
    ul.appendChild(li);
  }
  document.getElementById("mensaje").textContent = "";
}

function celda(f, c) { return document.getElementById("tablero-sopa").rows[f].cells[c]; }

function elegir() {
  var f = parseInt(this.dataset.f), c = parseInt(this.dataset.c);
  var m = document.getElementById("mensaje");
  if (inicio == null) { inicio = { f: f, c: c }; this.classList.add("inicio"); m.textContent = "Ahora elige la última letra."; return; }
  celda(inicio.f, inicio.c).classList.remove("inicio");
  var df = f - inicio.f, dc = c - inicio.c;
  var largo = Math.max(Math.abs(df), Math.abs(dc)) + 1;
  var recta = (df == 0 || dc == 0 || Math.abs(df) == Math.abs(dc));
  var ini = inicio; inicio = null;
  if (!recta) { m.textContent = "Esa selección no forma una línea recta."; return; }
  var pf = Math.sign(df), pc = Math.sign(dc), texto = "";
  for (var k = 0; k < largo; k++) { texto += cuadro[ini.f + k * pf][ini.c + k * pc]; }
  var reves = texto.split("").reverse().join("");
  for (var i = 0; i < lista.length; i++) {
    var li = document.getElementById("p-" + lista[i].w);
    if ((texto == lista[i].w || reves == lista[i].w) && !li.classList.contains("hallada")) {
      for (var k = 0; k < largo; k++) { celda(ini.f + k * pf, ini.c + k * pc).classList.add("hallada"); }
      li.classList.add("hallada"); encontradas++;
      m.textContent = encontradas == lista.length ? "🎉 ¡Felicidades! Encontraste todas las palabras." : "¡Muy bien! Encontraste " + lista[i].w + ".";
      return;
    }
  }
  m.textContent = "Esa no es una palabra de la lista. ¡Sigue buscando!";
}

document.getElementById("btn-nueva").addEventListener("click", crear);
crear();

// Palabras: numero, direccion, fila, columna, respuesta y pista
var palabras = [
  { n: 1, dir: "v", f: 0, c: 2, w: "SUMA", pista: "Operación matemática de juntar cantidades" },
  { n: 2, dir: "v", f: 0, c: 6, w: "CLASE", pista: "Hora de aprendizaje en el salón" },
  { n: 3, dir: "v", f: 1, c: 4, w: "ARTE", pista: "Pintura, música y escultura" },
  { n: 4, dir: "v", f: 2, c: 0, w: "MENTE", pista: "Lo que usas para pensar" },
  { n: 4, dir: "h", f: 2, c: 0, w: "MEMORIA", pista: "Capacidad de recordar cosas" }
];
var solucion = [];
for (var f = 0; f < 7; f++) { solucion.push(["", "", "", "", "", "", ""]); }

for (var p = 0; p < palabras.length; p++) {
  var pa = palabras[p];
  for (var k = 0; k < pa.w.length; k++) {
    if (pa.dir == "h") { solucion[pa.f][pa.c + k] = pa.w[k]; }
    else { solucion[pa.f + k][pa.c] = pa.w[k]; }
  }
  var li = document.createElement("li");
  li.textContent = pa.n + ". " + pa.pista + " (" + pa.w.length + " letras)";
  document.getElementById(pa.dir == "h" ? "pistas-h" : "pistas-v").appendChild(li);
}

var tabla = document.getElementById("cuadricula");
for (var r = 0; r < 7; r++) {
  var fila = document.createElement("tr");
  for (var c = 0; c < 7; c++) {
    var td = document.createElement("td");
    if (solucion[r][c] == "") { td.className = "vacia"; }
    else {
      var inp = document.createElement("input");
      inp.maxLength = 1;
      inp.setAttribute("aria-label", "Fila " + (r + 1) + " columna " + (c + 1));
      td.appendChild(inp);
      for (var q = 0; q < palabras.length; q++) {
        if (palabras[q].f == r && palabras[q].c == c) {
          var num = document.createElement("span");
          num.className = "num"; num.textContent = palabras[q].n;
          td.appendChild(num); break;
        }
      }
    }
    fila.appendChild(td);
  }
  tabla.appendChild(fila);
}

document.getElementById("btn-revisar").addEventListener("click", function () {
  var celdas = tabla.querySelectorAll("tr");
  var vacias = 0, malas = 0;
  for (var r = 0; r < 7; r++) {
    for (var c = 0; c < 7; c++) {
      if (solucion[r][c] != "") {
        var td = celdas[r].children[c];
        var v = td.querySelector("input").value.toUpperCase();
        td.className = "";
        if (v == "") { vacias++; }
        else if (v == solucion[r][c]) { td.className = "bien"; }
        else { td.className = "mal"; malas++; }
      }
    }
  }
  var m = document.getElementById("mensaje");
  if (vacias > 0) { m.textContent = "Aún te faltan " + vacias + " casillas por llenar."; }
  else if (malas > 0) { m.textContent = "Hay " + malas + " letras incorrectas (en rojo). ¡Inténtalo de nuevo!"; }
  else { m.textContent = "🎉 ¡Felicidades! Completaste el crucigrama."; }
});

document.getElementById("btn-limpiar").addEventListener("click", function () {
  var campos = tabla.querySelectorAll("input");
  for (var i = 0; i < campos.length; i++) { campos[i].value = ""; campos[i].parentNode.className = ""; }
  document.getElementById("mensaje").textContent = "";
});

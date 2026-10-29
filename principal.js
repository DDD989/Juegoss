// Voltear las tarjetas de la página principal (clic o Enter/Espacio)
var tarjetas = document.querySelectorAll(".tarjeta");
for (var i = 0; i < tarjetas.length; i++) {
  tarjetas[i].addEventListener("click", function () {
    this.classList.toggle("volteada");
  });
  tarjetas[i].addEventListener("keydown", function (e) {
    if (e.target == this && (e.key == "Enter" || e.key == " ")) {
      e.preventDefault();
      this.classList.toggle("volteada");
    }
  });
}

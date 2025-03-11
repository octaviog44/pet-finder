// Función para mostrar/ocultar el menú
function toggleMenu() {
  const menu = document.getElementById("menuDesplegable");
  menu.classList.toggle("show");
}

// Cerrar el menú si se hace clic fuera de él
window.onclick = function (event) {
  if (!event.target.matches(".barra-menu")) {
    const menu = document.getElementById("menuDesplegable");
    if (menu.classList.contains("show")) {
      menu.classList.remove("show");
    }
  }
};

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("userEmail");
  window.location.href = "./index.html";
}

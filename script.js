// Función para mostrar la imagen seleccionada
function showImage() {
  const input = document.getElementById("imageInput");
  const container = document.getElementById("image-container");

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      container.innerHTML = `<img src="${e.target.result}" alt="Imagen seleccionada" class="imagen-subida">`;
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    alert("Por favor, selecciona una imagen.");
  }
}

// Agregar evento change al input de archivo
document.getElementById("imageInput").addEventListener("change", function () {
  showImage();
});

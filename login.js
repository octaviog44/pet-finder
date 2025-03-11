document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("btnAcceder") // Aquí se está buscando el botón con id="btnAcceder"
    .addEventListener("click", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const contraseña = document.getElementById("contraseña").value;
      const confirmarContraseña = document.getElementById(
        "confirmarContraseña"
      ).value;

      if (!email || !contraseña || !confirmarContraseña) {
        alert("Por favor ingresa tu email y contraseña.");
        return;
      }

      if (contraseña !== confirmarContraseña) {
        alert("Las contraseñas no coinciden");
        return;
      }

      const response = await fetch("http://localhost:3000/registrarse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contraseña, confirmarContraseña }),
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 200) {
        alert("Usuario registrado con éxito");
        // Redirigir a otra página si lo deseas
      } else {
        alert(data.message || "Error al registrar usuario");
      }
    });
});

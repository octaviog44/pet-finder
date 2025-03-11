document
  .getElementById("registroForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const contraseña = document.getElementById("contraseña").value;
    const confirmarContraseña = document.getElementById(
      "confirmarContraseña"
    ).value;

    if (contraseña !== confirmarContraseña) {
      alert("Las contraseñas no coinciden.");
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
    alert(data.message);
  });

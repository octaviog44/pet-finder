const apiUrl = "http://localhost:3000/api";

// Reportar mascota
document
  .getElementById("report-pet-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const photo_url = document.getElementById("photo").value;
    const location = document.getElementById("location").value;

    try {
      const response = await fetch(`${apiUrl}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, photo_url, location, user_id: 1 }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Mascota reportada exitosamente");
        loadPets();
      } else {
        alert("Error al reportar mascota");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al reportar mascota");
    }
  });

// Cargar mascotas
async function loadPets() {
  try {
    const response = await fetch(`${apiUrl}/pets`);
    const data = await response.json();

    const petList = document.getElementById("pets");
    petList.innerHTML = "";

    data.pets.forEach((pet) => {
      const li = document.createElement("li");
      li.textContent = `${pet.name} - ${pet.location}`;
      petList.appendChild(li);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", loadPets);

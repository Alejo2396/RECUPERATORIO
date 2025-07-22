const loginForm = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const userDisplay = document.getElementById("user-display");
const logoutBtn = document.getElementById("logout");
const regionalSelect = document.getElementById("regional-select");
const centrosTable = document.getElementById("centros-table");

let data = [];

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if (username) {
    showApp(username);
  }

  // 🔄 Corrección del nombre del archivo
  fetch("centros.json")
    .then(res => res.json())
    .then(json => {
      data = json;

      // Usamos el nombre real de la regional para llenar el select
      const regionales = [...new Set(data.map(c => c.codigo_regional))].sort();
      regionales.forEach(regional => {
        const opt = document.createElement("option");
        opt.value = regional;
        opt.textContent = regional;
        regionalSelect.appendChild(opt);
      });
    });
});

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (password === "21072025") {
    localStorage.setItem("username", username);
    showApp(username);
  } else {
    alert("Contraseña incorrecta.");
  }
});

function showApp(username) {
  loginSection.style.display = "none";
  appSection.style.display = "block";
  userDisplay.textContent = username;
}

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

regionalSelect.addEventListener("change", () => {
  const regional = regionalSelect.value;
  if (!regional) return;

  // Filtra por código regional
  const centros = data.filter(c => c.codigo_regional === regional);
  localStorage.setItem("codigoRegional", regional);
  localStorage.setItem("cantidadCentros", centros.length);

  centrosTable.innerHTML = "";
  centros.forEach(c => {
    const row = document.createElement("tr");

    const latClass = c.latitud && parseFloat(c.latitud) < 0 ? "negative" : "";
    const longClass = c.longitud && parseFloat(c.longitud) < 0 ? "negative" : "";

    row.innerHTML = `
      <td>${c.centro_formacion || ""}</td>
      <td>${c.codigo_regional || ""}</td>
      <td>${c.nombre_municipio || ""}</td>
      <td class="${latClass}">${c.latitud || ""}</td>
      <td class="${longClass}">${c.longitud || ""}</td>
    `;
    centrosTable.appendChild(row);
  });
});

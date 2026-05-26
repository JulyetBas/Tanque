const SUPABASE_URL = "https://dtowvglpmnximpqmvsie.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0b3d2Z2xwbW54aW1wcW12c2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzgzNTksImV4cCI6MjA5NTE1NDM1OX0.M0KED_-C-NVameNPSKtRrLjFaORYYa1RHVVk5cqmCfA";

let chart;

// 🚀 ESPERAR A QUE CARGUE TODO EL HTML
window.addEventListener("load", () => {

  // 📊 GRAFICA
  const ctx = document.getElementById("grafica");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Porcentaje del tanque",
        data: [],
        borderColor: "#4ade80",
        fill: false
      }]
    }
  });

  // 🎯 CLICK EN ESTADO
  document.getElementById("estado").addEventListener("click", () => {
    const card = document.getElementById("graficaCard");

    if (card.style.display === "none") {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  // 🔁 LOOP DE DATOS
  setInterval(obtenerDatos, 2000);
});

async function obtenerDatos() {

  const res = await fetch(
    SUPABASE_URL + "/rest/v1/Tanque?select=*&order=id.desc&limit=1",
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: "Bearer " + SUPABASE_KEY
      }
    }
  );

  const data = await res.json();

  if (data.length > 0) {

    const d = data[0];

    // TEXTO
    document.getElementById("estado").innerText = d.estado_tanque;
    document.getElementById("porcentaje").innerText = d.porcentaje + "%";
    document.getElementById("lluvia").innerText = d.lluvia;
    document.getElementById("distancia").innerText = d.distancia + " cm";
    document.getElementById("duracion").innerText = d.duracion + " us";

    // COLOR
    const estadoCard = document.getElementById("estado").parentElement;

    if (d.estado_tanque === "LLENO") {
      estadoCard.style.background = "#dc3545";
      if (!window.alertaMostrada) {
        alert("⚠ EL TANQUE ESTÁ LLENO!");
        window.alertaMostrada = true;
      }
    }

    else if (d.estado_tanque === "MEDIO LLENO") {
      estadoCard.style.background = "#ffc107";
      window.alertaMostrada = false;
    }

    else {
      estadoCard.style.background = "#28a745";
      window.alertaMostrada = false;
    }

    //  GRAFICA
    chart.data.labels.push("");
    chart.data.datasets[0].data.push(d.porcentaje);

    if (chart.data.labels.length > 10) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }

    chart.update();
  }
}
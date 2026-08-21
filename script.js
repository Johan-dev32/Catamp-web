// Mensaje dinámico en el header
const slogan = document.querySelector("header p");
const mensajes = [
  "La ingeniería que transforma tus proyectos en soluciones confiables",
  "6+ años de experiencia en obra civil",
  "Cumplimiento, calidad técnica e innovación"
];
const proyectos = document.querySelectorAll(".proyecto img");

let i = 0;
setInterval(() => {
  slogan.textContent = mensajes[i];
  i = (i + 1) % mensajes.length;
}, 4000);

proyectos.forEach(img => {
  img.addEventListener("click", () => {
    alert("Este proyecto pertenece al portafolio de CATAMP S.A.S");
  });
});
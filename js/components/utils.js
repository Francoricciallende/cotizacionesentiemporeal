// js/components/utils.js

// Generar un color aleatorio para líneas de gráficos
export function randomColor() {
    const r = Math.floor(Math.random() * 155) + 100;
    const g = Math.floor(Math.random() * 155) + 100;
    const b = Math.floor(Math.random() * 155) + 100;
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
  
  // Mostrar loading en un div
  export function showLoading(divId) {
    const div = document.getElementById(divId);
    if (div) {
      div.innerHTML = `<div style="text-align:center; padding: 10px;">Cargando datos...</div>`;
    }
  }
  
  // Ocultar loading de un div
  export function hideLoading(divId) {
    const div = document.getElementById(divId);
    if (div) {
      div.innerHTML = ``;
    }
  }
  
  // Validar si un ticker es razonable
  export function isValidTicker(ticker) {
    return /^[A-Z0-9\.]{1,10}$/.test(ticker.trim());
  }
  
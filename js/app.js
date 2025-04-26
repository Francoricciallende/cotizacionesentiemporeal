// js/app.js

import { fetchDolares, fetchLivePrice, fetchHistorical } from './components/api.js';
import { createBaseChart, updateTechnicalChart } from './components/charts.js';
import { showLoading, hideLoading, isValidTicker } from './components/utils.js';

// Inicializar app cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
  setupDolares();
  setupCategorias();
  setupAnalisisTecnico();
});

// ---- Cotización de Dólar ----
async function setupDolares() {
  const mepDiv = document.getElementById('dolar-mep');
  const cclDiv = document.getElementById('dolar-ccl');
  
  showLoading('dolar-mep');
  showLoading('dolar-ccl');

  try {
    const data = await fetchDolares();

    const mep = data.find(d => d.symbol.includes('MEP'));
    const ccl = data.find(d => d.symbol.includes('CCL'));

    mepDiv.innerHTML = `<strong>MEP:</strong> $${mep.price.toFixed(2)}`;
    cclDiv.innerHTML = `<strong>CCL:</strong> $${ccl.price.toFixed(2)}`;
  } catch (err) {
    mepDiv.innerHTML = 'Error cargando MEP';
    cclDiv.innerHTML = 'Error cargando CCL';
  }

  hideLoading('dolar-mep');
  hideLoading('dolar-ccl');
}

// ---- Apartados dinámicos ----
function setupCategorias() {
  const categorias = [
    { id: 'acciones-argentinas', endpoint: 'arg_stocks' },
    { id: 'cedears', endpoint: 'arg_cedears' },
    { id: 'bonos', endpoint: 'arg_bonds' },
    { id: 'adr-usa', endpoint: 'usa_adrs' },
    { id: 'acciones-usa', endpoint: 'usa_stocks' }
  ];

  categorias.forEach(cat => {
    const container = document.getElementById(cat.id);
    const botones = container.querySelectorAll('.buscar');

    botones.forEach(btn => {
      btn.addEventListener('click', async () => {
        const input = btn.previousElementSibling;
        const symbol = input.value.trim().toUpperCase();
        const canvas = btn.nextElementSibling;

        if (!isValidTicker(symbol)) {
          alert('Ticker inválido.');
          return;
        }

        showLoading(canvas.id);

        try {
          const data = await fetchLivePrice(cat.endpoint, symbol);
          const precios = data.map(d => d.price);

          const ctx = canvas.getContext('2d');
          createBaseChart(ctx, symbol, precios);
        } catch (err) {
          console.error(err);
          alert('Error trayendo datos.');
        }

        hideLoading(canvas.id);
      });
    });
  });
}

// ---- Análisis Técnico ----
function setupAnalisisTecnico() {
  const analizarBtn = document.getElementById('analizar-tecnico');
  const chartCanvas = document.getElementById('grafico-tecnico').getContext('2d');

  analizarBtn.addEventListener('click', async () => {
    const tickers = [
      document.getElementById('input-tecnico-1').value.trim().toUpperCase(),
      document.getElementById('input-tecnico-2').value.trim().toUpperCase(),
      document.getElementById('input-tecnico-3').value.trim().toUpperCase(),
      document.getElementById('input-tecnico-4').value.trim().toUpperCase()
    ].filter(t => t);

    if (tickers.length === 0) {
      alert('Debes ingresar al menos un ticker.');
      return;
    }

    const emaPeriods = [];
    if (document.getElementById('ema4').checked) emaPeriods.push(4);
    if (document.getElementById('ema9').checked) emaPeriods.push(9);
    if (document.getElementById('ema21').checked) emaPeriods.push(21);
    if (document.getElementById('ema30').checked) emaPeriods.push(30);
    if (document.getElementById('ema50').checked) emaPeriods.push(50);
    if (document.getElementById('ema200').checked) emaPeriods.push(200);

    const agregarLSMA = document.getElementById('lsma30').checked;

    const datasets = [];

    for (let ticker of tickers) {
      try {
        const data = await fetchHistorical(ticker, "1M");
        const precios = data.map(d => d.close);

        datasets.push({
          ticker: ticker,
          prices: precios,
          color: randomColor(),
          emaPeriods: emaPeriods,
          lsma: agregarLSMA
        });
      } catch (err) {
        console.error(`Error con ${ticker}`, err);
      }
    }

    updateTechnicalChart(chartCanvas.canvas, datasets);
  });
}

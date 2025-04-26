// js/components/charts.js

import { randomColor } from './utils.js';

// Función para crear un gráfico base
export function createBaseChart(ctx, label, data, color = 'rgba(75, 192, 192, 1)') {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        label: label,
        data: data,
        borderColor: color,
        tension: 0.3,
        fill: false,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true
        },
        y: {
          display: true
        }
      }
    }
  });
}

// Función para calcular una EMA
function calculateEMA(data, period) {
  let k = 2 / (period + 1);
  let emaArray = [data[0]]; // inicia desde el primer valor
  
  for (let i = 1; i < data.length; i++) {
    emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k));
  }
  return emaArray;
}

// Función para calcular LSMA
function calculateLSMA(data, period) {
  let lsmaArray = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      lsmaArray.push(null);
      continue;
    }
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let j = 0; j < period; j++) {
      sumX += j;
      sumY += data[i - j];
      sumXY += j * data[i - j];
      sumX2 += j * j;
    }
    let slope = (period * sumXY - sumX * sumY) / (period * sumX2 - sumX * sumX);
    let intercept = (sumY - slope * sumX) / period;
    lsmaArray.push(intercept + slope * (period - 1));
  }
  return lsmaArray;
}

// Función para actualizar un gráfico con precios + indicadores
export function updateTechnicalChart(ctx, datasets) {
  if (ctx.chartInstance) {
    ctx.chartInstance.destroy();
  }

  ctx.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datasets[0].prices.map((_, i) => i),
      datasets: datasets.flatMap((dataset) => {
        let base = [
          {
            label: dataset.ticker,
            data: dataset.prices,
            borderColor: dataset.color,
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointRadius: 0
          }
        ];

        // Agrega EMAs seleccionadas
        if (dataset.emaPeriods) {
          base = base.concat(dataset.emaPeriods.map(period => ({
            label: `${dataset.ticker} EMA${period}`,
            data: calculateEMA(dataset.prices, period),
            borderColor: randomColor(),
            borderDash: [5, 5],
            fill: false,
            tension: 0.2,
            pointRadius: 0
          })));
        }

        // Agrega LSMA si se pidió
        if (dataset.lsma) {
          base.push({
            label: `${dataset.ticker} LSMA30`,
            data: calculateLSMA(dataset.prices, 30),
            borderColor: randomColor(),
            borderDash: [10, 5],
            fill: false,
            tension: 0.2,
            pointRadius: 0
          });
        }

        return base;
      })
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}
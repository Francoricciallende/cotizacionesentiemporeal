// js/components/api.js

const API_BASE = "https://data912.com/api";

// Fetch genérico
export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error("Error en la API");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

// Fetch de precios en vivo por categoría
export async function fetchLivePrice(categoria, symbol) {
  return await fetchData(`/live_prices/${categoria}?symbols=${symbol}`);
}

// Fetch de histórico de precios para análisis técnico
export async function fetchHistorical(symbol, range = "1M") {
  return await fetchData(`/historical_prices?symbol=${symbol}&range=${range}`);
}

// Fetch de Dólar MEP y CCL
export async function fetchDolares() {
  return await fetchData("/live_prices/arg_currencies");
}

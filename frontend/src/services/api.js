const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(path) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`);
  } catch (error) {
    throw new Error(
      'Nao foi possivel conectar ao backend. Verifique se a API esta rodando em http://localhost:3001.'
    );
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || payload.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getHeroMeta() {
  return request('/heroes/meta');
}

export function refreshHeroMeta() {
  return request('/heroes/meta/refresh');
}

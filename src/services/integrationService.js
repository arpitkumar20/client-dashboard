// API base URL (static for now; can be made configurable via env if needed)
const API_ROOT = 'http://34.238.181.131:5600';
const API_BASE = `${API_ROOT}/integration`;

function getAuthHeader() {
  try {
    // Prefer tokens saved by app; support multiple common keys
    const raw =
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      localStorage.getItem('access_token') ||
      '';

    const token = (raw || '').trim();
    if (!token) {
      console.warn('No auth token found in localStorage');
      return {};
    }

    // Send token exactly as saved in localStorage (no auto-prefix)
    return { Authorization: token };
  } catch (e) {
    // localStorage not available / other error
    return {};
  }
}

async function listIntegrations() {
  const res = await fetch(API_BASE, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`List failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function getIntegration(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Get failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function createIntegration(payload) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Create failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function updateIntegration(id, payload) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Update failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function deleteIntegration(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Delete failed: ${res.status} ${txt}`);
  }
  return res.json();
}

export const integrationService = {
  listIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  deleteIntegration
};

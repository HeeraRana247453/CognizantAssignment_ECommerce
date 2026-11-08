const BASE_URL = 'https://dummyjson.com';

// small helper so we don't repeat the same error handling everywhere
async function request(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function getProducts() {
  // the API returns 30 items by default, 100 gives us a better list to filter
  const data = await request(`${BASE_URL}/products?limit=100`);
  return data.products;
}

export async function getProductById(id) {
  return request(`${BASE_URL}/products/${id}`);
}

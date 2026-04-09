const BASE_URL = "https://your-api-id.execute-api.region.amazonaws.com/dev";

export const addItem = async (url) => {
  const res = await fetch(`${BASE_URL}/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });

  return res.json();
};

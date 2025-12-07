// frontend/src/services/reviews.js

export async function fetchReviews(restaurantId) {
  try {
    const res = await fetch(`/api/reviews/${restaurantId}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    return { success: false, reviews: [] };
  }
}

export async function submitReview(restaurantId, data) {
  const response = await fetch(`http://localhost:3001/reviews/${restaurantId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}


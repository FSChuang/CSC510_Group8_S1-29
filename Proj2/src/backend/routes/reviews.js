const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const reviewsFile = path.join(__dirname, "../data/reviews.json");

// Load reviews safely
function loadReviews() {
    try {
        if (!fs.existsSync(reviewsFile)) {
            fs.writeFileSync(reviewsFile, "[]", "utf-8");
            return [];
        }
        const raw = fs.readFileSync(reviewsFile, "utf-8");
        return JSON.parse(raw);
    } catch (err) {
        console.error("Error loading reviews:", err);
        return [];
    }
}

// Save reviews safely
function saveReviews(reviews) {
    try {
        fs.writeFileSync(
            reviewsFile,
            JSON.stringify(reviews, null, 2),
            "utf-8"
        );
        return true;
    } catch (err) {
        console.error("Error saving reviews:", err);
        return false;
    }
}

/* ============================================================
   GET /reviews/:restaurantId
   Return all reviews for a restaurant
   ============================================================ */
router.get("/:restaurantId", (req, res) => {
    const { restaurantId } = req.params;
    const reviews = loadReviews();

    const filtered = reviews.filter(
        (r) => String(r.restaurantId) === String(restaurantId)
    );

    res.json({
        success: true,
        reviews: filtered,
    });
});

/* ============================================================
   POST /reviews
   Body: { restaurantId, rating, comment, user }
   ============================================================ */
router.post("/", (req, res) => {
    const { restaurantId, rating, comment, user } = req.body || {};

    if (!restaurantId || !rating || !user) {
        return res.json({
            success: false,
            message: "restaurantId, rating, and user are required.",
        });
    }

    const reviews = loadReviews();

    const newReview = {
        id: Date.now(),
        restaurantId,
        rating: Number(rating),
        comment: comment || "",
        user, // <── store clean "user" string provided by frontend
        createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    const ok = saveReviews(reviews);

    if (!ok) {
        return res.json({
            success: false,
            message: "Failed to save review.",
        });
    }

    return res.json({
        success: true,
        review: newReview,
    });
});

module.exports = router;

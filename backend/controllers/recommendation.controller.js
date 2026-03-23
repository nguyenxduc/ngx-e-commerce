import { prisma } from "../lib/db.js";

// Gợi ý sản phẩm cho trang chủ.
// - User mới (chưa có nhiều behavior): trả về best seller / sản phẩm mới nhất.
// - Về sau có thể mở rộng đọc từ RecommendationLog (precompute offline).
export const getHomeRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Nếu sau này có pipeline offline, có thể ưu tiên đọc từ recommendation_log trước.
    // Hiện tại: cold-start logic đơn giản theo góp ý của cô.
    const limit = Number(req.query.limit || 12);

    const [bestSellers, newest] = await Promise.all([
      prisma.product.findMany({
        orderBy: [{ sold: "desc" }, { rating: "desc" }],
        take: Math.ceil(limit / 2),
      }),
      prisma.product.findMany({
        orderBy: { created_at: "desc" },
        take: Math.floor(limit / 2),
      }),
    ]);

    // Gộp và loại trùng id
    const map = new Map();
    [...bestSellers, ...newest].forEach((p) => {
      if (!map.has(p.id.toString())) {
        map.set(p.id.toString(), p);
      }
    });

    const products = Array.from(map.values()).slice(0, limit);

    // Ghi log chiến lược đang dùng (để sau này làm offline CF dễ hơn)
    await prisma.recommendationLog.create({
      data: {
        user_id: userId ? BigInt(userId) : null,
        session_id: req.headers["x-session-id"]
          ? String(req.headers["x-session-id"])
          : null,
        strategy: "cold_start_best_seller_newest",
        product_ids: products.map((p) => BigInt(p.id)),
      },
    });

    return res.json({
      success: true,
      data: {
        products,
        strategy: "cold_start_best_seller_newest",
      },
    });
  } catch (error) {
    console.error("getHomeRecommendations error:", error);
    return res.status(500).json({
      success: false,
      error: "Không thể lấy gợi ý sản phẩm",
    });
  }
};


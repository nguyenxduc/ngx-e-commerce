import { prisma } from "../lib/db.js";

// Tạo feedback cho câu trả lời gần nhất của bot trong 1 ai_chat
// Body: { rating: number (1-5), comment?: string }
export const createAiFeedback = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { rating, comment } = req.body || {};

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating phải từ 1 đến 5",
      });
    }

    const chat = await prisma.aiChat.findUnique({
      where: { id: BigInt(chatId) },
      select: { id: true, user_id: true },
    });

    if (!chat || chat.user_id.toString() !== req.user.id) {
      return res.status(chat ? 403 : 404).json({
        success: false,
        error: chat ? "Không có quyền truy cập" : "Chat không tồn tại",
      });
    }

    // Lấy message assistant gần nhất trong chat này
    const lastAssistantMessage = await prisma.aiMessage.findFirst({
      where: {
        ai_chat_id: BigInt(chatId),
        role: "assistant",
      },
      orderBy: { created_at: "desc" },
    });

    if (!lastAssistantMessage) {
      return res.status(400).json({
        success: false,
        error: "Không tìm thấy câu trả lời của bot để đánh giá",
      });
    }

    const feedback = await prisma.aiFeedback.create({
      data: {
        ai_message_id: lastAssistantMessage.id,
        user_id: BigInt(req.user.id),
        rating,
        comment: comment?.trim() || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Đã ghi nhận feedback",
      data: feedback,
    });
  } catch (error) {
    console.error("createAiFeedback error:", error);
    return res.status(500).json({
      success: false,
      error: "Không thể tạo feedback",
    });
  }
};

// Thống kê feedback đơn giản cho admin xem (VD: đánh giá chất lượng bot theo thời gian)
export const getAiFeedbackStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const [summary, recentBad] = await Promise.all([
      prisma.$queryRawUnsafe(
        `
        SELECT 
          COUNT(*)::int AS total,
          AVG(rating)::float AS avg_rating,
          SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END)::int AS positive,
          SUM(CASE WHEN rating <= 2 THEN 1 ELSE 0 END)::int AS negative
        FROM ai_feedback
        WHERE created_at >= $1
        `,
        since
      ),
      prisma.aiFeedback.findMany({
        where: {
          created_at: { gte: since },
          rating: { lte: 2 },
        },
        orderBy: { created_at: "desc" },
        take: 20,
      }),
    ]);

    return res.json({
      success: true,
      data: {
        summary: summary?.[0] || null,
        recentBad,
      },
    });
  } catch (error) {
    console.error("getAiFeedbackStats error:", error);
    return res.status(500).json({
      success: false,
      error: "Không thể tải thống kê feedback",
    });
  }
};


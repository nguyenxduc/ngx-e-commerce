import { prisma } from "../lib/db.js";

// Helper dùng nội bộ để log hành động
export const writeAuditLog = async ({
  userId,
  action,
  resource,
  resourceId,
  ip,
  userAgent,
  metadata,
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        user_id: userId ? BigInt(userId) : null,
        action,
        resource: resource || null,
        resource_id: resourceId ? BigInt(resourceId) : null,
        ip: ip || null,
        user_agent: userAgent || null,
        metadata: metadata || {},
      },
    });
  } catch (err) {
    console.error("writeAuditLog error:", err);
  }
};

// Admin xem log (lọc đơn giản)
export const listAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, user_id } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {
      ...(action && { action: String(action) }),
      ...(user_id && { user_id: BigInt(user_id) }),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error("listAuditLogs error:", error);
    return res.status(500).json({
      success: false,
      error: "Không thể tải audit log",
    });
  }
};


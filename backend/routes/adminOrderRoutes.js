const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/admin/orders
//@desc Get all orders for admin
//@access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email");
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// @route PUT /api/admin/orders/:id/status
// @desc Update order status
// @access Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Validate status
    const validStatuses = [
      'pending', 'approved', 'baking', 'ready', 
      'shipping', 'delivered', 'cancelled', 'cannot_deliver'
    ];
    
    if (!validStatuses.includes(status?.toLowerCase())) {
      return res.status(400).json({ 
        message: `Trạng thái không hợp lệ. Trạng thái hợp lệ: ${validStatuses.join(', ')}`
      });
    }

    const newStatus = status.toLowerCase();

    // Cập nhật trạng thái
    order.status = newStatus;
    order.updatedAt = Date.now();

    // Cập nhật các trường liên quan
    if (newStatus === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    // Thêm vào lịch sử trạng thái
    order.statusHistory.push({
      status: newStatus,
      updatedBy: req.user._id,
      note: getStatusNote(newStatus),
      updatedAt: Date.now()
    });

    const updatedOrder = await order.save();

    // Emit event thông qua Socket.IO
    const io = req.app.get('io');
    io.emit('orderStatusUpdated', {
      orderId: order._id,
      status: order.status,
      updatedAt: order.updatedAt,
      statusHistory: order.statusHistory
    });

    res.json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái" });
  }
});

//@route DELETE /api/admin/orders/:id
//@desc delete order
//@access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: "Đã xóa đơn hàng" });
        } else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Helper function to get status note
function getStatusNote(status) {
  switch (status) {
    case 'pending':
      return 'Đơn hàng mới, chờ xử lý';
    case 'approved':
      return 'Đơn hàng đã được duyệt';
    case 'baking':
      return 'Đang trong quá trình làm bánh';
    case 'ready':
      return 'Bánh đã làm xong, sẵn sàng giao hàng';
    case 'shipping':
      return 'Đang giao hàng';
    case 'delivered':
      return 'Đã giao hàng thành công';
    case 'cancelled':
      return 'Đơn hàng đã bị hủy';
    case 'cannot_deliver':
      return 'Không thể giao hàng';
    default:
      return '';
  }
}

module.exports = router;
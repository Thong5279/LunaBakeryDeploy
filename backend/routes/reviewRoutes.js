const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');

// @desc    Lấy tất cả đánh giá theo filter (product/order)
// @route   GET /api/reviews
// @access  Public/Private
router.get('/', async (req, res) => {
    try {
        const { product, itemType = 'Product', status = 'approved', order } = req.query;
        console.log('\n=== DEBUG REVIEWS ===');
        console.log('1. Query params:', { product, itemType, status, order });

        // Kiểm tra ObjectId hợp lệ
        let productId;
        try {
            if (product) {
                productId = new mongoose.Types.ObjectId(product);
                console.log('2. ProductId hợp lệ:', productId);
            }
        } catch (err) {
            console.error('2. ProductId không hợp lệ:', err);
            return res.status(400).json({ message: 'ProductId không hợp lệ' });
        }

        // Tìm tất cả review trong DB
        const allReviews = await Review.find({}).lean();
        console.log('3. Tất cả reviews trong DB:', allReviews.length);

        const filter = {};

        // Nếu có order ID, lấy tất cả review của đơn hàng đó
        if (order) {
            filter.order = new mongoose.Types.ObjectId(order);
            console.log('4a. Filter theo order:', filter);
        }
        // Nếu có product ID, lấy review của sản phẩm/nguyên liệu đó
        else if (productId) {
            filter.product = productId;
            filter.itemType = itemType;
            filter.status = status;
            console.log('4b. Filter theo product:', filter);
        }

        // Tìm reviews theo filter
        const filteredReviews = await Review.find(filter).lean();
        console.log('5. Reviews khớp với filter:', filteredReviews.length);

        // Kiểm tra model tồn tại
        let Model;
        try {
            Model = mongoose.model(itemType);
            console.log('6. Model hợp lệ:', itemType);

            // Kiểm tra sản phẩm tồn tại
            if (productId) {
                const product = await Model.findById(productId).lean();
                if (!product) {
                    console.error('7. Không tìm thấy sản phẩm/nguyên liệu');
                    return res.status(404).json({ message: `${itemType} không tồn tại` });
                }
                console.log('7. Sản phẩm/nguyên liệu tồn tại:', product.name);
            }
        } catch (err) {
            console.error('6. Lỗi model:', err);
            return res.status(400).json({ message: `Model ${itemType} không tồn tại` });
        }

        // Populate reviews - Sử dụng refPath thay vì model cố định
        const reviews = await Review.find(filter)
            .populate('user', 'name avatar')
            .populate('product', 'name images')  // Sử dụng refPath trong schema
            .sort({ createdAt: -1 });

        console.log('8. Reviews sau khi populate:', 
            reviews.map(r => ({
                id: r._id,
                user: r.user?.name,
                product: r.product?.name,
                rating: r.rating,
                itemType: r.itemType,
                status: r.status,
                comment: r.comment
            }))
        );
        console.log('=== END DEBUG ===\n');
        
        res.json(reviews);
    } catch (error) {
        console.error('❌ Lỗi khi lấy đánh giá:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// @desc    Tạo đánh giá mới
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { product, rating, comment, itemType = 'Product', order } = req.body;
        console.log('\n=== DEBUG CREATE REVIEW ===');
        console.log('1. Request body:', { product, rating, comment, itemType, order });

        // Kiểm tra model tồn tại
        let Model;
        try {
            Model = mongoose.model(itemType);
            console.log('2. Model hợp lệ:', itemType);

            // Kiểm tra sản phẩm tồn tại
            const productDoc = await Model.findById(product).lean();
            if (!productDoc) {
                console.error('3. Không tìm thấy sản phẩm/nguyên liệu');
                return res.status(404).json({ message: `${itemType} không tồn tại` });
            }
            console.log('3. Sản phẩm/nguyên liệu:', productDoc);
        } catch (err) {
            console.error('2. Lỗi model:', err);
            return res.status(400).json({ message: `Model ${itemType} không tồn tại` });
        }

        // Kiểm tra xem đã đánh giá chưa
        const existingReview = await Review.findOne({
            user: req.user._id,
            product,
            order,
            itemType
        }).lean();

        console.log('4. Review đã tồn tại:', existingReview);

        if (existingReview) {
            console.log('=== END DEBUG ===\n');
            return res.status(400).json({
                message: 'Bạn đã đánh giá sản phẩm này trong đơn hàng'
            });
        }

        // Tạo review mới
        const review = new Review({
            user: req.user._id,
            product,
            rating,
            comment,
            itemType,
            order,
            status: 'approved'
        });

        // Validate trước khi lưu
        await review.validate();
        console.log('5. Review hợp lệ');

        // Lưu review
        const savedReview = await review.save();
        console.log('6. Đã lưu review:', savedReview._id);

        // Populate thông tin user và product
        await savedReview.populate([
            { path: 'user', select: 'name avatar' },
            { path: 'product', select: 'name images' }  // Sử dụng refPath
        ]);

        console.log('7. Review sau khi populate:', {
            id: savedReview._id,
            user: savedReview.user?.name,
            product: savedReview.product?.name,
            rating: savedReview.rating,
            itemType: savedReview.itemType,
            comment: savedReview.comment
        });
        console.log('=== END DEBUG ===\n');

        res.status(201).json(savedReview);
    } catch (error) {
        console.error('❌ Lỗi khi tạo đánh giá:', error);
        
        // Xử lý lỗi duplicate key
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Bạn đã đánh giá sản phẩm này trong đơn hàng'
            });
        }

        // Xử lý lỗi validation
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }

        res.status(500).json({ 
            message: error.message || 'Lỗi server khi tạo đánh giá'
        });
    }
});

// @desc    Cập nhật đánh giá
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        // Chỉ cho phép người tạo đánh giá cập nhật
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Không có quyền cập nhật' });
        }

        const { rating, comment } = req.body;

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        const updatedReview = await review.save();
        await updatedReview.populate([
            { path: 'user', select: 'name avatar' },
            { 
                path: 'product', 
                select: 'name',
                model: review.itemType
            }
        ]);

        res.json(updatedReview);
    } catch (error) {
        console.error('❌ Lỗi khi cập nhật đánh giá:', error);
        
        // Xử lý lỗi validation
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }

        res.status(500).json({ message: 'Lỗi server' });
    }
});

// @desc    Xóa đánh giá
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        // Chỉ cho phép người tạo đánh giá xóa
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Không có quyền xóa' });
        }

        await review.remove();
        res.json({ message: 'Đã xóa đánh giá' });
    } catch (error) {
        console.error('❌ Lỗi khi xóa đánh giá:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router; 
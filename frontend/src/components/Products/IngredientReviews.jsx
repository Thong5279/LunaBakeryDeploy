import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Rating, Avatar, Grid, Divider, Alert } from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const IngredientReviews = ({ ingredientId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/reviews?product=${ingredientId}&itemType=Ingredient&status=approved`);
                if (!response.ok) {
                    throw new Error('Không thể tải đánh giá');
                }
                const data = await response.json();
                setReviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (ingredientId) {
            fetchReviews();
        }
    }, [ingredientId]);

    if (loading) {
        return <Box sx={{ textAlign: 'center', py: 2 }}>Đang tải đánh giá...</Box>;
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                {error}
            </Alert>
        );
    }

    if (reviews.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body1" color="text.secondary">
                    Chưa có đánh giá nào cho nguyên liệu này
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Đánh giá từ khách hàng
            </Typography>
            
            {reviews.map((review, index) => (
                <Box key={review._id} sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Avatar 
                                src={review.user.avatar} 
                                alt={review.user.name}
                                sx={{ width: 40, height: 40 }}
                            />
                        </Grid>
                        <Grid item xs>
                            <Typography variant="subtitle1" component="div">
                                {review.user.name}
                            </Typography>
                            <Rating 
                                value={review.rating} 
                                readOnly 
                                size="small"
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                            </Typography>
                            {review.comment && (
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {review.comment}
                                </Typography>
                            )}
                            {review.images && review.images.length > 0 && (
                                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {review.images.map((image, idx) => (
                                        <Box
                                            key={idx}
                                            component="img"
                                            src={image.url}
                                            alt={image.altText || `Hình ảnh ${idx + 1}`}
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                objectFit: 'cover',
                                                borderRadius: 1
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                    {index < reviews.length - 1 && (
                        <Divider sx={{ my: 2 }} />
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default IngredientReviews; 
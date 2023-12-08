import React, { useState } from 'react';
import StarRatings from './react-star-ratings';

interface StarRatingComponentProps {
    initialRating?: number;
    onRatingChange?: (newRating: number) => void;
}

const StarRatingComponent: React.FC<StarRatingComponentProps> = ({ initialRating = 0, onRatingChange }) => {
    const [rating, setRating] = useState<number>(initialRating);

    const handleChangeRating = (newRating: number) => {
        setRating(newRating);
        if(onRatingChange) {
            onRatingChange(newRating);
        }
    };

    return (
        <StarRatings
            rating={rating}
            starRatedColor="blue"
            changeRating={handleChangeRating}
            numberOfStars={5}
            name='rating'
            starDimension="30px"
            starSpacing="5px"
        />
    );
};

export default StarRatingComponent;
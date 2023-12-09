import React, { useState } from 'react';
import Ratings from 'react-star-ratings';

const StarRating: React.FC = () => {
    const [rating, setRating] = useState<number>(0);

    const changeRating = (newRating: number) => {
        setRating(newRating);
    };

    return (
        <div>
            <Ratings
                rating={rating}
                numberOfStars={5}
                changeRating={changeRating}
                starRatedColor="gold"
                starEmptyColor="grey"
                starHoverColor="lightblue"
                starDimension="30px"
                starSpacing="5px"
                name="rating"
            />
        </div>
    );
};

export default StarRating;

import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useAuthUser } from "react-auth-kit";
import { Button, Icon, Text, useToast, VStack } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import Ratings from "react-star-ratings";

interface ArtistData {
    artist_name: string;
    artist_photo_urls: PhotoURL[];
    popularity: number;
}

interface PhotoURL {
    url: string;
}

const ArtistPage = () => {
    const { artistId } = useParams();
    const artistIdNum = Number(artistId);
    const [artistData, setArtistData] = useState<ArtistData | null>(null);
    const [artistRatings, setArtistRatings] = useState<{ [artistId: number]: number }>({});
    const [ratings, setRatings] = useState<Array<{ rating_type: string, artist_id: number, rating: number }>>([]);
    const toast = useToast();
    const auth = useAuthUser();
    const apiUrl = `http://51.20.128.164/spoti/get_artists_info/${auth()?.username}/${artistId}`;

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const response = await axios.get(apiUrl);
                setArtistData(response.data[0]);
            } catch (error) {
                console.error("Error fetching artist data:", error);
            }
        };

        fetchArtistData();
    }, [artistId]);

    const updateRating = (artistIdNum: number, newRating: number) => {
        setArtistRatings(prevRatings => ({
            ...prevRatings,
            [artistIdNum]: newRating
        }));

        setRatings(prevRatings => [
            ...prevRatings,
            { rating_type: "artist_rate", artist_id: artistIdNum, rating: newRating }
        ]);
    };

    const handleSendRate = async () => {
        const apiUrl = "http://51.20.128.164/api/add_rate_batch";
        try {
            await axios.post(apiUrl, { username: `${auth()?.username}`, ratings: ratings });
            toast({
                title: "Artist was successfully rated!",
                status: "success",
            });
            window.location.reload();
        } catch (error) {
            console.error("Error in sending rating:", error);
        }
    };

    const currentRating = artistRatings[artistIdNum] || 0;

    const changeRating = (newRating: number) => {
        updateRating(artistIdNum, newRating);
    };

    if (!artistData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-[#081730]">
            <Header />
            <div className="artist-info">
                <h1>{artistData.artist_name}</h1>
                {artistData.artist_photo_urls.length > 0 && (
                    <img src={artistData.artist_photo_urls[0].url} alt="Artist Photo" />
                )}
                <p>Popularity: {artistData.popularity}</p>
            </div>
            <VStack className="flex align-center">
                <Text className="font-semibold"><Icon as={FaStar} w={5} h={5} mr={2}/>Rate this artist</Text>
                <Ratings
                    rating={currentRating}
                    numberOfStars={5}
                    changeRating={changeRating}
                    starRatedColor="gold"
                    starEmptyColor="grey"
                    starHoverColor="lightblue"
                    starDimension="20px"
                    starSpacing="5px"
                    name="rating"
                />
                <Button onClick={handleSendRate} colorScheme="green">Send Rating</Button>
            </VStack>
        </div>
    );
};

export default ArtistPage;

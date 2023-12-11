import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import axios from 'axios';
import {useAuthUser} from "react-auth-kit";
import {Button, Icon, Text, useToast, VStack} from "@chakra-ui/react";
import {FaStar} from "react-icons/fa";
import Ratings from "react-star-ratings";

interface AlbumData {
    album_name: string;
    album_photo_url: PhotoURL[]; // Assuming PhotoURL is an existing interface
    album_release_year: string;
    popularity: number;
}

interface PhotoURL {
    photo_url: string;
}

const AlbumPage = () => {
    const { albumId } = useParams();
    const albumIdNum = Number(albumId);
    const [albumData, setAlbumData] = useState<AlbumData | null>(null);
    const [albumRatings, setAlbumRatings] = useState<{ [albumId: number]: number }>({});
    const [ratings, setRatings] = useState<Array<{ rating_type: string, album_id: number, rating: number }>>([]);
    const toast = useToast();
    const auth = useAuthUser();
    const username = `http://51.20.128.164/spoti/get_albums_info/${auth()?.username}/${albumId}`;

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const response = await axios.get(`http://51.20.128.164/spoti/get_albums_info/${username}/${albumId}`);
                setAlbumData(response.data[0]);
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        };

        fetchAlbumData();
    }, [albumId]);

    const updateRating = (albumIdNum: number, newRating: number) => {
        setAlbumRatings(prevRatings => ({
            ...prevRatings,
            [albumIdNum]: newRating
        }));

        setRatings(prevRatings => [
            ...prevRatings,
            { rating_type: "album_rate", album_id: albumIdNum, rating: newRating }
        ]);
    };

    const handleSendRate = async () => {
        const apiUrl = "http://51.20.128.164/api/add_rate_batch";
        try {
            await axios.post(apiUrl, { username: `${auth()?.username}`, ratings: ratings });
            toast({
                title: `Song were successfully rated!`,
                status: "success",
            })
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const currentRating = albumRatings[albumIdNum] || 0;

    const changeRating = (newRating: number) => {
        updateRating(albumIdNum, newRating);
    };

    if (!albumData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-[#081730]">
            <Header />
            <div className="album-info">
                <h1>{albumData.album_name}</h1>
                <img src={albumData.album_photo_url[0].photo_url} alt="Album Cover" />
                <p>Release Year: {albumData.album_release_year}</p>
                <p>Popularity: {albumData.popularity}</p>
            </div>
            <VStack className="flex align-center">
                <Text className="font-semibold"><Icon as={FaStar} w={5} h={5} mr={2}/>Rate this song</Text>
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
                <Button onClick={handleSendRate} colorScheme="green" >Send Rating</Button>
            </VStack>
        </div>
    );
};

export default AlbumPage;
import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import {useLocation, useParams} from "react-router-dom";
import axios from 'axios';
import {useAuthUser} from "react-auth-kit";
import {Button, Icon, Text, useToast, VStack} from "@chakra-ui/react";
import {FaSpotify, FaStar} from "react-icons/fa";
import Ratings from "react-star-ratings";
import {Avatar} from "flowbite-react";
import {MdBuild} from "react-icons/md";

interface Artist {
    artist_photo: string | undefined;
    artist_id: number;
    artist_name: string;
    followers: number | null;
    popularity: number | null;
    genres: string | null;
    release_year: number | null;
}


const ArtistPage = () => {
    const {artistId} = useParams();
    const location = useLocation();
    const artist = location.state?.groupMembers;
    const artistIdNum = Number(artistId);
    const [artistData, setArtistData] = useState<Artist | null>(null);
    const [artistRatings, setArtistRatings] = useState<{ [artistId: number]: number }>({});
    const [ratings, setRatings] = useState<Array<{ rating_type: string, artist_id: number, rating: number }>>([]);
    const toast = useToast();
    const auth = useAuthUser();

    useEffect(() => {
        setArtistData(artist);
    }, []);

    const updateRating = (artistIdNum: number, newRating: number) => {
        setArtistRatings(prevRatings => ({
            ...prevRatings,
            [artistIdNum]: newRating
        }));

        setRatings(prevRatings => [
            ...prevRatings,
            {rating_type: "artist_rate", artist_id: artistIdNum, rating: newRating}
        ]);
    };

    const handleSendRate = async () => {
        const apiUrl = "http://51.20.128.164/api/add_rate_batch";
        try {
            await axios.post(apiUrl, {username: `${auth()?.username}`, ratings: ratings});
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
        <body className="bg-[#081730]">
        <Header/>
        <div className="artist-info">
            <div className="flex flex-col items-center text-center bg-[#081730] overflow-y-auto">
                <div className="flex flex-col items-center justify-center w-full bg-[#081730] text-white p-2.5">
                    <Avatar size="xl" img={artistData.artist_photo} alt="Artist Photo"/>
                    <Text className="font-lalezar">{artistData.artist_name}</Text>
                    <p className="font-lalezar">Popularity: {artistData.popularity}</p>
                    <p className="font-lalezar">Followers: {artistData.followers}</p>
                    <p className="font-lalezar">Genres: {artistData.genres}</p>
                    <div className="py-2"></div>
                    <div className="flex justify-center items-center mx-0 my-2.5">
                        <VStack className="flex align-center">
                            <Text className="font-semibold"><Icon as={FaStar} w={5} h={5} mr={2}/>Rate this
                                artist</Text>
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
                </div>
                <div className="py-5">

                </div>
            </div>
        </div>
        </body>
);
};

export default ArtistPage;
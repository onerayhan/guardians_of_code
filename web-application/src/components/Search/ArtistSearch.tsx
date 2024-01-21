import React, { useState } from 'react';
import {Card, CardBody, Button, Text, CardFooter, HStack, useToast, Icon, VStack} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {Avatar} from "flowbite-react";
import {FaStar} from "react-icons/fa";
import Ratings from "react-star-ratings";
import {useAuthUser} from "react-auth-kit";
import axios from "axios";

interface Artist {
    artist_photo: string | undefined;
    artist_id: number;
    artist_name: string;
    followers: number | null;
    popularity: number | null;
    genres: string | null;
    release_year: number | null;
}

interface ArtistSearchProps {
    artistInfo: Artist;
}

const ArtistSearch: React.FC<ArtistSearchProps> = ({ artistInfo }) => {
    const navigate = useNavigate();
    const [artistRatings, setArtistRatings] = useState<{ [artistName: string]: number }>({});
    const auth = useAuthUser();
    const toast = useToast();

    const navigateArtist = (artistName: string) => {
        navigate(`/artist/${artistName}`, {state: { groupMembers: artistInfo }});
    };

    const handleSendRate = async () => {
        const apiUrl = "http://51.20.128.164/api/add_user_performer_ratings"
        try {
            await axios.post(apiUrl, {username: `${auth()?.username}`, performer_name: artistInfo.artist_name, rating: artistRatings[artistInfo.artist_name]});
            toast({
                title: `${artistInfo.artist_name} was rated ${artistRatings[artistInfo.artist_name]}!`,
                status: "success",
            });
        }
        catch (error) {
            console.error("Error in sending rating:", error);
        }
    }

    const updateRating = (artist_name: string, newRating: number) => {
        setArtistRatings(prevRatings => ({
            ...prevRatings,
            [artist_name]: newRating
        }));
    };

    const currentRating = artistRatings[artistInfo.artist_name] || 0;

    const changeRating = (newRating: number) => {
        updateRating(artistInfo.artist_name, newRating);
    };

    return (
        <Card className="w-[900px]" overflow='hidden' variant='outline'>
            <div className="flex items-center">
                <Avatar img={artistInfo.artist_photo} size="xl" />
                <CardBody>
                    <Button onClick={() => navigateArtist(artistInfo.artist_name)}>{artistInfo.artist_name}</Button>
                    <HStack spacing={4}>
                        <Text py='2'>Genre: {artistInfo.genres || 'N/A'}</Text>
                    </HStack>
                    <HStack spacing={4}>
                        <Text py='2'>Popularity: {artistInfo.popularity || 'N/A'}</Text>
                        <Text py='2'>Followers: {artistInfo.followers || 'N/A'}</Text>
                    </HStack>
                </CardBody>
                <CardFooter>
                    <VStack>
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
                    </VStack>
                    <div className="px-2"></div>
                    <Button onClick={handleSendRate} colorScheme="green">Send Rating</Button>
                </CardFooter>
            </div>
        </Card>

);
};

export default ArtistSearch;
import React, { useState } from 'react';
import {Card, CardBody, Button, Text, CardFooter, HStack, useToast, VStack, Icon} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {Avatar} from "flowbite-react";
import {useAuthUser} from "react-auth-kit";
import axios from "axios";
import {FaStar} from "react-icons/fa";
import Ratings from "react-star-ratings";
interface Album {
    album_photo: string | undefined;
    album_id: number;
    album_name: string;
    artist_names: string[];
    release_year: number | null;
    genre: string | null;
}

interface AlbumSearchProps {
    albumInfo: Album;
}

const AlbumSearch: React.FC<AlbumSearchProps> = ({albumInfo }) => {
    const navigate = useNavigate();
    const [albumRatings, setAlbumRatings] = useState<{ [albumName: string]: number }>({});
    const auth = useAuthUser();
    const toast = useToast();

    const handleSendRate = async () => {
        const apiUrl = "http://51.20.128.164/api/add_user_album_ratings"
        try {
            await axios.post(apiUrl, {username: `${auth()?.username}`, album_name: albumInfo.album_name, rating: albumRatings[albumInfo.album_name]});
            toast({
                title: `${albumInfo.album_name} was rated ${albumRatings[albumInfo.album_name]}!`,
                status: "success",
            });
        }
        catch (error) {
            console.error("Error in sending rating:", error);
        }
    }

    const navigateToAlbum = (albumName: string) => {
        navigate(`/album/${albumName}`);
    };

    const updateRating = (artist_name: string, newRating: number) => {
        setAlbumRatings(prevRatings => ({
            ...prevRatings,
            [artist_name]: newRating
        }));
    };

    const currentRating = albumRatings[albumInfo.album_name] || 0;

    const changeRating = (newRating: number) => {
        updateRating(albumInfo.album_name, newRating);
    };

    return (
        <div>
            <Card className="w-[900px]" overflow="hidden" variant="outline">
                <div className="flex items-center">
                    <CardBody>
                        <HStack spacing={4} className="flex-grow">
                            <Avatar size="xl" img={albumInfo.album_photo}/>
                            <CardBody>
                                <Button
                                    onClick={() => navigateToAlbum(albumInfo.album_name)}>{albumInfo.album_name}</Button>
                                <Text py="2">Artists: {albumInfo.artist_names}</Text>
                                <Text py="2">Release Year: {albumInfo.release_year || 'N/A'}</Text>
                            </CardBody>
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
            <div className="py-2" ></div>
        </div>
    );
};

export default AlbumSearch;
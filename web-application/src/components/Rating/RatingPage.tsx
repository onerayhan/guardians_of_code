import {
    Box,
    SimpleGrid,
    Card,
    CardBody, Heading, CardFooter, Stack, useToast
} from '@chakra-ui/react'
import React, { useEffect, useState} from 'react';
import {useAuthUser} from "react-auth-kit";
import axios from "axios";
import {StarIcon} from "@chakra-ui/icons";
import {Divider} from "antd";
import { Rating } from '@simuratli/rating'

interface Song {
    song_id: number;
    song_name: string;
    artist_name: string;
    album_name: string;
    genre: string;
    duration: string;
    year: number;
}

interface RatingStarsProps {
    song: Song; // Use the Song interface here
    totalStars?: number;
}

function RatingPage() {
    const [RatingSongs, setRatingSongs] = useState<Song[]>([]);
    const auth = useAuthUser();
    const toast = useToast();

    const RatingStars: React.FC<RatingStarsProps> = ({ song, totalStars = 5 }) => {
        const [rating, setRating] = useState(0);
        const apiURL = "http://13.51.167.155/api/";

        const handleRating = async (i: number) => {
            try {
                await axios.post(apiURL, {
                    song_id: song.song_id,
                    username: auth()?.username,
                    rating: i
                });

                toast({
                    title: "Rating submitted",
                    description: `Successfully rated song ${song.song_name}`, // Template literal for dynamic song name
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });

                setRating(i); // Set the rating after successful submission
            } catch (error) {
                console.error("Error submitting rating:", error);
                // Optionally, you can show a toast for error as well
            }
        };

        return (
            <Box display="flex">
                {[...Array(totalStars)].map((_, i) => (
                    <StarIcon
                        key={i}
                        onClick={() => handleRating(i + 1)}
                        color={i < rating ? "yellow.400" : "gray.300"}
                        cursor="pointer"
                    />
                ))}
            </Box>
        );
    };

    const RateDisplaySong = ({ song }: { song: Song }) => {
        return (
            <Card maxW='500px'>
                <CardBody>
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>{song.song_name}</Heading>
                        <span>{song.artist_name}</span>
                        <span>{song.album_name}</span>
                        <span>{song.genre}</span>
                        <span>{song.duration}</span>
                        <span>{song.year}</span>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    <RatingStars key={song.song_name} song={song} />
                </CardFooter>
            </Card>
        );
    };

    useEffect(() => {
        // Directly setting the state with mock data for testing purposes
        const mockSongs: Song[] = [
            {
                song_id: 1,
                song_name: "Mock Song 1",
                artist_name: "Mock Artist 1",
                album_name: "Mock Album 1",
                genre: "Pop",
                duration: "3:45",
                year: 2020,
            },
            {
                song_id: 1,
                song_name: "Mock Song 2",
                artist_name: "Mock Artist 2",
                album_name: "Mock Album 2",
                genre: "Rock",
                duration: "4:05",
                year: 2019,
            },            {
                song_id: 1,
                song_name: "Mock Song 1",
                artist_name: "Mock Artist 1",
                album_name: "Mock Album 1",
                genre: "Pop",
                duration: "3:45",
                year: 2020,
            },
            {
                song_id: 1,
                song_name: "Mock Song 2",
                artist_name: "Mock Artist 2",
                album_name: "Mock Album 2",
                genre: "Rock",
                duration: "4:05",
                year: 2019,
            },
            {
                song_id: 1,
                song_name: "Mock Song 1",
                artist_name: "Mock Artist 1",
                album_name: "Mock Album 1",
                genre: "Pop",
                duration: "3:45",
                year: 2020,
            },
            {
                song_id: 1,
                song_name: "Mock Song 2",
                artist_name: "Mock Artist 2",
                album_name: "Mock Album 2",
                genre: "Rock",
                duration: "4:05",
                year: 2019,
            },
            {
                song_id: 1,
                song_name: "Mock Song 1",
                artist_name: "Mock Artist 1",
                album_name: "Mock Album 1",
                genre: "Pop",
                duration: "3:45",
                year: 2020,
            },
            {
                song_id: 1,
                song_name: "Mock Song 2",
                artist_name: "Mock Artist 2",
                album_name: "Mock Album 2",
                genre: "Rock",
                duration: "4:05",
                year: 2019,
            },            {
                song_id: 1,
                song_name: "Mock Song 1",
                artist_name: "Mock Artist 1",
                album_name: "Mock Album 1",
                genre: "Pop",
                duration: "3:45",
                year: 2020,
            },
            {
                song_id: 1,
                song_name: "Mock Song 2",
                artist_name: "Mock Artist 2",
                album_name: "Mock Album 2",
                genre: "Rock",
                duration: "4:05",
                year: 2019,
            },
        ];

        setRatingSongs(mockSongs);
    }, []);

    return (
        <div>
            <div className="relative w-full flex flex-col items-center top-12 py-12">
                <h1 className="text-6xl font-lalezar text-white">Rate Songs to Get Recommendations.</h1>
            </div>
            <div>
                <SimpleGrid
                    paddingTop="50px"
                    paddingLeft="50px"
                    paddingRight="50px"
                    spacing={4}
                    templateColumns='repeat(5, 1fr)'
                >
                    {RatingSongs.slice(0, 15).map((song, index) => (
                        <RateDisplaySong key={song.song_name} song={song} />
                    ))}
                </SimpleGrid>
            </div>
        </div>
    );
}

export default RatingPage;
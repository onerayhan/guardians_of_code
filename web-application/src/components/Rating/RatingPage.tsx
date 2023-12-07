import {
    Box,
    SimpleGrid,
    Card,
    CardBody, Heading, CardFooter, Stack, useToast, Button, Select, Flex, Tag, TagLabel, TagCloseButton
} from '@chakra-ui/react'
import React, { useEffect, useState} from 'react';
import {useAuthUser} from "react-auth-kit";
import axios from "axios";
import {StarIcon} from "@chakra-ui/icons";
import {Divider} from "antd";
import { AiTwotoneLike } from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import GenreInput from "./GenreInput.tsx";
import AlbumInput from "./AlbumInput.tsx";
import ArtistInput from "./ArtistInput.tsx";

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
    const navigate = useNavigate();
    const [rateType, setRateType] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const addGenre = () => {
        if (genre && !selectedGenres.includes(genre)) {
            setSelectedGenres([...selectedGenres, genre]);
            setGenre('');
        }
    };

    const removeGenre = (genreToRemove: string) => {
        setSelectedGenres(selectedGenres.filter(g => g !== genreToRemove));
    };

    const handleArtistNavigate = (artistName: string) => {
        navigate(`/artist/${artistName}`);
    }

    const handleAlbumNavigate = (albumName: string) => {
        navigate(`/album/${albumName}`);
    }

    const RatingStars: React.FC<RatingStarsProps> = ({ song, totalStars = 5 }) => {
        const [rating, setRating] = useState(0);
        const apiURL = "http://13.51.167.155/api/rate_song";

        const handleRating = async (i: number) => {
            try {
                await axios.post(apiURL, {
                    song_name: song.song_name,
                    username: auth()?.username,
                    rating: i
                });

                toast({
                    title: "Rating submitted",
                    description: `Successfully rated song ${song.song_name}`,
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });

                setRating(i); // Set the rating after successful submission
            } catch (error) {
                console.error("Error submitting rating:", error);
                toast({
                    title: "Error submitting rating!",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        };

        const handleLike = async () => {
            try {

                const apiURL = "http://13.51.167.155/api/like_song";

                await axios.post(apiURL, {
                    song_id: song.song_id,
                    username: auth()?.username,
                });

                toast({
                    title: "Like submitted",
                    description: `Successfully liked song ${song.song_name}`, // Template literal for dynamic song name
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
            }

            catch (error) {
                console.error("Error submitting like:", error);
                toast({
                    title: "Error submitting like!",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        }

        return (
            <div className="flex">
                <Box display="flex" className="pr-12">
                    {[...Array(totalStars)].map((_, i) => (
                        <StarIcon
                            key={i}
                            onClick={() => handleRating(i + 1)}
                            color={i < rating ? "yellow.400" : "gray.300"}
                            cursor="pointer"
                        />
                    ))}
                    <Button onClick={() => handleLike()} leftIcon={<AiTwotoneLike />} className="ml-16">
                    </Button>
                </Box>
            </div>
        );
    };

    const RateDisplaySong = ({ song }: { song: Song }) => {
        return (
            <Card maxW='500px'>
                <CardBody>
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>{song.song_name}</Heading>
                        <Button onClick={() => handleArtistNavigate(song.artist_name)}>
                            <span>{song.artist_name}</span>
                        </Button>
                        <Button onClick={() => handleAlbumNavigate(song.album_name)}>
                            <span>{song.album_name}</span>
                        </Button>
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
        <div className="overflow-y-auto">
            <div className="relative w-full flex flex-col items-center top-12 py-8">
                <h1 className="text-6xl font-lalezar text-white">Rate Songs to Get Recommendations.</h1>
            </div>
            <div>
                <div className="py-8"></div>
                <Flex align="center" justify="center">
                    <Box className="flex flex-col">
                        <GenreInput/>
                    </Box>

                    <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
                        {selectedGenres.map((tag, index) => (
                            <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                                <TagLabel>{tag}</TagLabel>
                                <TagCloseButton onClick={() => removeGenre(tag)}/>
                            </Tag>
                        ))}
                    </Stack>

                    <div className="px-5"></div>

                    <Box className="flex flex-col">
                        <ArtistInput/>
                    </Box>

                    <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
                        {selectedGenres.map((tag, index) => (
                            <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                                <TagLabel>{tag}</TagLabel>
                                <TagCloseButton onClick={() => removeGenre(tag)}/>
                            </Tag>
                        ))}
                    </Stack>

                    <div className="px-5"></div>

                    <Box className="flex flex-col">
                        <AlbumInput/>
                    </Box>

                    <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
                        {selectedGenres.map((tag, index) => (
                            <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                                <TagLabel>{tag}</TagLabel>
                                <TagCloseButton onClick={() => removeGenre(tag)}/>
                            </Tag>
                        ))}
                    </Stack>

                    <div className="px-20"></div>

                    <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
                        <Button colorScheme="facebook">
                            Get Songs to Rate
                        </Button>
                    </Stack>

                </Flex>
                <SimpleGrid
                        paddingTop="50px"
                        paddingLeft="50px"
                        paddingRight="50px"
                        spacing={4}
                        templateColumns='repeat(5, 1fr)'
                    >
                        {RatingSongs.slice(0, 15).map((song, index) => (
                            <RateDisplaySong key={song.song_name} song={song}/>
                        ))}
                    </SimpleGrid>
            </div>
        </div>
);
}

export default RatingPage;
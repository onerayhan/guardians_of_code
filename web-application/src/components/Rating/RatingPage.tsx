import {
    Box,
    SimpleGrid,
    Card,
    CardBody,
    Heading,
    CardFooter,
    Stack,
    useToast,
    Button,
    Select,
    Flex,
    Tag,
    TagLabel,
    TagCloseButton,
    useCheckbox,
    chakra,
    Icon,
    UseCheckboxProps, useCheckboxGroup, HStack, VStack
} from '@chakra-ui/react'
import React, { useEffect, useState} from 'react';
import {useAuthUser} from "react-auth-kit";
import axios from "axios";
import {StarIcon} from "@chakra-ui/icons";
import {Checkbox, Divider} from "antd";
import { AiTwotoneLike } from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import GenreInput from "./GenreInput.tsx";
import AlbumInput from "./AlbumInput.tsx";
import ArtistInput from "./ArtistInput.tsx";
import {FaMusic, FaCalendarAlt, FaClock, FaStar} from 'react-icons/fa';
import { MdAlbum } from 'react-icons/md';
import { IoMdMicrophone } from "react-icons/io";
import {IoRefreshCircleSharp} from "react-icons/io5";
import RefreshButton from "./RefreshButton.tsx";
import {BsFillSendFill} from "react-icons/bs";
import { Text } from '@chakra-ui/react'
import { IoMdOptions } from "react-icons/io";
import StarRating from "./SongStar.tsx";
import Ratings from "react-star-ratings";
import {Avatar} from "flowbite-react";

interface Song {
    song_photo: string | undefined;
    song_id: number;
    song_name: string;
    artist_name: string;
    album_name: string;
    genre: string;
    duration: string;
    year: number;
}

interface RatingStarsProps {
    song: Song;
    rating: number;
    onRatingChange: (songId: number, newRating: number) => void;
}


function RatingPage() {
    const [RatingSongs, setRatingSongs] = useState<Song[]>([]);
    const auth = useAuthUser();
    const toast = useToast();
    const navigate = useNavigate();
    const [rateType, setRateType] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [songRatings, setSongRatings] = useState<{ [songId: number]: number }>({});
    const [selectedSongs, setSelectedSongs] = useState<{ [songId: number]: boolean }>({});
    const [ratings, setRatings] = useState<{ [songId: number]: number }>({});

    const toggleSongSelection = (songId: number, isSelected: boolean) => {
        setSelectedSongs(prevSelections => ({
            ...prevSelections,
            [songId]: isSelected,
        }));
    };

    const updateRating = (songId: number, newRating: number) => {
        setSongRatings(prevRatings => ({
            ...prevRatings,
            [songId]: newRating
        }));

        setRatings(prevRatings => ({
            ...prevRatings,
            [songId]: newRating
        }));
    };

    const RefreshButton = () =>
    {
        const sendRatings = () => {

            for (const songId in ratings) {
                if (ratings.hasOwnProperty(songId)) {
                    console.log(`Song ID: ${songId}, Rating: ${ratings[songId]}`);
                }
            }
        };

        return (
            <div className="bg-[#081730] relative w-full flex flex-col items-center top-12 py-12">
                <h1 className="text-3xl font-lalezar text-white">Are you done? Send your ratings!</h1>
                <Button
                    colorScheme='green'
                    size='lg'
                    onClick={sendRatings}
                    className="flex items-center"
                    leftIcon={<BsFillSendFill size={25}/>}
                >
                    <span className="pl-5">Send Ratings</span>
                </Button>
            </div>
        );

    };


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

    const RateDisplaySong = ({ song }: { song: Song }) => {
        const currentRating = songRatings[song.song_id] || 0;

        const changeRating = (newRating: number) => {
            updateRating(song.song_id, newRating);
        };

        return (
            <Card maxW='500px'>
                <CardBody>
                    <Stack spacing={3}>
                        <Avatar size="xl" className="pl-5" img={song.song_photo}/>
                        <div className="px-2"></div>
                        <Flex alignItems="center">
                            <Icon as={FaMusic} w={5} h={5} mr={2}/>
                            <div className="px-2"></div>
                            <Text className="font-semibold">{song.song_name}</Text>
                        </Flex>
                        <div className="px-2"></div>
                        <Flex alignItems="center">
                            <Icon as={IoMdMicrophone} w={5} h={5} mr={2}/>
                            <Button variant='ghost'
                                    onClick={() => handleArtistNavigate(song.artist_name)}>{song.artist_name}</Button>
                        </Flex>
                        <Flex alignItems="center">
                            <Icon as={MdAlbum} w={5} h={5} mr={2}/>
                            <Button variant='ghost'
                                    onClick={() => handleAlbumNavigate(song.album_name)}>{song.album_name}</Button>
                        </Flex>
                        <div className="px-2"></div>
                        <Flex alignItems="center">
                            <Icon as={IoMdOptions} w={5} h={5} mr={2}/>
                            <div className="px-2"></div>
                            <Text className="font-semibold">{song.genre}</Text>
                        </Flex>
                        <div className="px-2"></div>
                        <Flex alignItems="center">
                            <Icon as={FaClock} w={5} h={5} mr={2}/>
                            <div className="px-2"></div>
                            <Text className="font-semibold">{song.duration}</Text>
                        </Flex>
                        <div className="px-2"></div>
                        <Flex alignItems="center">
                            <Icon as={FaCalendarAlt} w={5} h={5} mr={2}/>
                            <div className="px-2"></div>
                            <Text className="font-semibold">{song.year}</Text>
                        </Flex>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
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
                    </VStack>
                </CardFooter>
            </Card>
        );
    };

    useEffect(() => {
        const mockSongs: Song[] = [
            {
                song_photo: "https://i.scdn.co/image/ab67616d0000b273e3b6b8b6b6b6b6b6b6b6b6b6",
                song_id: 16,
                song_name: "Mock Song 1",
                artist_name: "Mock Artist 1",
                album_name: "Mock Album 1",
                genre: "Pop",
                duration: "3:45",
                year: 2020,
            },
            {
                song_photo: "https://i.scdn.co/image/ab67616d0000b273e3b6b8b6b6b6b6b6b6b6b6b6",
                song_id: 51,
                song_name: "Mock Song 223422",
                artist_name: "Mock Artist 2",
                album_name: "Mock Album 2",
                genre: "Rock",
                duration: "4:05",
                year: 2019,
            },            {
                song_photo: undefined,
                song_id: 11,
                song_name: "Mock Song 12",
                artist_name: "Mock Artist 1",
                album_name: "Mock Album 1",
                genre: "Pop",
                duration: "3:45",
                year: 2020,
            },
            {
                song_photo: undefined,
                song_id: 13,
                song_name: "Mock Song 22",
                artist_name: "Mock Artist 2",
                album_name: "Mock Album 2",
                genre: "Rock",
                duration: "4:05",
                year: 2019,
            },
            {
                song_photo: undefined,
                song_id: 231,
                song_name: "Mock Song 12231",
                artist_name: "Mock Artist 1",
                album_name: "Mock Album 1",
                genre: "Pop",
                duration: "3:45",
                year: 2020,
            },
            {
                song_photo: undefined,
                song_id: 31,
                song_name: "Mock Song 2543",
                artist_name: "Mock Artist 2",
                album_name: "Mock Album 2",
                genre: "Rock",
                duration: "4:05",
                year: 2019,
            },
            {
                song_photo: undefined,
                song_id: 1123,
                song_name: "Mock Song 121",
                artist_name: "Mock Artist 1",
                album_name: "Mock Album 1",
                genre: "Pop",
                duration: "3:45",
                year: 2020,
            },
            {
                song_photo: undefined,
                song_id: 541,
                song_name: "Mock Song 232",
                artist_name: "Mock Artist 2",
                album_name: "Mock Album 2",
                genre: "Rock",
                duration: "4:05",
                year: 2019,
            },            {
                song_photo: undefined,
                song_id: 112,
                song_name: "Mock Song 231",
                artist_name: "Mock Artist 1",
                album_name: "Mock Album 1",
                genre: "Pop",
                duration: "3:45",
                year: 2020,
            },
            {
                song_photo: undefined,
                song_id: 1642,
                song_name: "Mock Song 31232",
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
            <div className="overflow-y-auto">
                <div className="relative w-full flex flex-col items-center top-12 py-8">
                    <h1 className="text-6xl font-lalezar text-white">Rate Songs to Get Recommendations.</h1>
                    <h1 className="text-2xl font-lalezar text-white">Rate Songs Between 1-5, the ones that you did not rate do not count!</h1>
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
            <div className="flex items-center justify-center bg-[#081730]">
                {/* Left Column */}
                <div className="w-1/2 text-center flex flex-col items-center justify-center pr-32">
                    <RefreshButton/>
                </div>
            </div>
        </div>
    );
}

export default RatingPage;
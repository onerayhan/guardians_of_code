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
    UseCheckboxProps, useCheckboxGroup
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
import { FaMusic, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { MdAlbum } from 'react-icons/md';
import { IoMdMicrophone } from "react-icons/io";
import {IoRefreshCircleSharp} from "react-icons/io5";
import RefreshButton from "./RefreshButton.tsx";
import {BsFillSendFill} from "react-icons/bs";
import { Text } from '@chakra-ui/react'
import { IoMdOptions } from "react-icons/io";

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
    const { value: selectedSongIds, getCheckboxProps } = useCheckboxGroup();
    const [songRatings, setSongRatings] = useState<{ [songId: number]: number }>({});
    const [selectedSongs, setSelectedSongs] = useState<{ [songId: number]: boolean }>({});

    const updateSongRating = (songId: number, newRating: number) => {
        setSongRatings(prevRatings => ({
            ...prevRatings,
            [songId]: newRating,
        }));
    };

    const toggleSongSelection = (songId: number, isSelected: boolean) => {
        setSelectedSongs(prevSelections => ({
            ...prevSelections,
            [songId]: isSelected,
        }));
    };

    const RefreshButton = () =>
    {
        const sendRatings = () => {

            // Reload the page after successful send.
            window.location.reload();
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

    interface CustomCheckboxProps {
        value?: string; // Define other props as needed
    }

    interface CustomCheckboxProps extends UseCheckboxProps {
        // Include any additional props you might need
        // For example, a label for the checkbox
        label?: string;
    }

    const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, ...props }) => {
        const { state, getCheckboxProps, getInputProps, htmlProps } = useCheckbox(props);

        return (
            <chakra.label
                display='flex'
                flexDirection='row'
                alignItems='center'
                gridColumnGap={2}
                maxW='36'
                bg='blue.50'
                border='1px solid'
                borderColor='green.500'
                rounded='lg'
                px={3}
                py={1}
                cursor='pointer'
                {...htmlProps}
            >
                <input {...getInputProps()} hidden />
                <Flex
                    alignItems='center'
                    justifyContent='center'
                    border='2px solid'
                    borderColor='green.500'
                    w={4}
                    h={4}
                    {...getCheckboxProps()}
                >
                    {state.isChecked && <Box w={2} h={2} bg='green.500' />}
                </Flex>
                {label}
            </chakra.label>
        );
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

    const RatingStars: React.FC<RatingStarsProps> = ({ song, rating, onRatingChange }) => {
        return (
            <Box display="flex">
                {[...Array(5)].map((_, i) => (
                    <StarIcon
                        key={i}
                        onClick={() => onRatingChange(song.song_id, i + 1)}
                        color={i < rating ? "yellow.400" : "gray.300"}
                        cursor="pointer"
                    />
                ))}
            </Box>
        );
    };

    const RateDisplaySong = ({ song }: { song: Song }) => {
        const currentRating = songRatings[song.song_id] || 0;
        
        return (
            <Card maxW='500px'>
                <CardBody>
                    <Stack spacing={3}>
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
                            <Icon as={FaMusic} w={5} h={5} mr={2}/>
                            <div className="px-2"></div>
                            <Text className="font-semibold">{song.song_name}</Text>
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
                </CardFooter>
            </Card>
        );
    };

    useEffect(() => {
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
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
    UseCheckboxProps, useCheckboxGroup, HStack, VStack, Radio, RadioGroup, Input
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
import {FaMusic, FaCalendarAlt, FaClock, FaStar, FaDatabase} from 'react-icons/fa';
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
    song_id: string;
    song_name: string;
    song_photo: string | undefined;
    length: string;
    tempo: number;
    recording_type: string;
    listens: number;
    release_year: number;
    added_timestamp: string;
    username: string;
    album_name: string;
    performer_name: string;
    mood: string;
    genre: string;
    instrument: string;
}

interface RatingStarsProps {
    song: Song;
    rating: number;
    onRatingChange: (songId: number, newRating: number) => void;
}



function RatingPage() {
    const [RatingSongsRecom, setRatingSongsRecom] = useState<Song[]>([]);
    const [RatingSongsOwn, setRatingSongsOwn] = useState<Song[]>([]);
    const auth = useAuthUser();
    const toast = useToast();
    const navigate = useNavigate();
    const [genre, setGenre] = useState<string>('');
    const [artist, setArtist] = useState<string>('');
    const [album, setAlbum] = useState<string>('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
    const [songRatings, setSongRatings] = useState<{ [songId: number]: number }>({});
    const [ratings, setRatings] = useState<Array<{ rating_type: string, song_id: number, rating: number }>>([]);
    const [rateType, setRateType] = React.useState('2');

    const fetch_recom_songs = async () => {
        const apiUrl = `http://51.20.128.164/spoti/get_recommendations/${auth()?.username}`;
        const response = await axios.post(apiUrl, { seed_genres: selectedGenres, seed_artists: selectedArtists, seed_albums: selectedAlbums });
        const fetchedSongs = response.data.map((song: any) => ({
            song_photo: song.song_photo,
            song_name: song.song_name,
            artist_name: song.artist_name,
            album_name: song.album_name,
            genre: song.genre,
            duration: song.duration,
            year: song.year,
        }));
        setRatingSongsRecom(fetchedSongs);
    }

    useEffect(() => {
        const getSongs = async () => {
            const apiUrl = "http://51.20.128.164/api/user_songs";
            try {
                const response = await axios.post(apiUrl, { username: `${auth()?.username}` });
                const data = response.data;
                setRatingSongsOwn(data);
            } catch (error) {
                console.log(error);
            }
        };

        getSongs();
    }, []);

    const updateRating = (songId: number, newRating: number) => {
        setSongRatings(prevRatings => ({
            ...prevRatings,
            [songId]: newRating
        }));

        setRatings(prevRatings => [
            ...prevRatings,
            { rating_type: "song_rate", song_id: songId, rating: newRating }
        ]);
    };

    const RefreshButton = () =>
    {
        const sendRatings = async () => {
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

    const handleGenreChange = (event) => {
        setGenre(event.target.value);
    };

    const addGenre = () => {
        if (genre && !selectedGenres.includes(genre)) {
            setSelectedGenres([...selectedGenres, genre]);
            setGenre('');
        }
    };

    const handleArtistChange = (event) => {
        setArtist(event.target.value);
    };

    const addArtist = () => {
        if (genre && !selectedGenres.includes(genre)) {
            setSelectedGenres([...selectedArtists, artist]);
            setArtist('');
        }
    };

    const handleAlbumChange = (event) => {
        setAlbum(event.target.value);
    };

    const addAlbum = () => {
        if (genre && !selectedGenres.includes(genre)) {
            setSelectedGenres([...selectedAlbums, album]);
            setAlbum('');
        }
    };

    const removeGenre = (genreToRemove: string) => {
        setSelectedGenres(selectedGenres.filter(g => g !== genreToRemove));
    };

    const removeAlbum = (albumToRemove: string) => {
        setSelectedAlbums(selectedAlbums.filter(g => g !== albumToRemove));
    };

    const removeArtist = (artistToRemove: string) => {
        setSelectedArtists(selectedArtists.filter(g => g !== artistToRemove));
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
                                    onClick={() => handleArtistNavigate(song.performer_name)}>{song.performer_name}</Button>
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
                            <Text className="font-semibold">{song.length}</Text>
                        </Flex>
                        <div className="px-2"></div>
                        <Flex alignItems="center">
                            <Icon as={FaCalendarAlt} w={5} h={5} mr={2}/>
                            <div className="px-2"></div>
                            <Text className="font-semibold">{song.release_year}</Text>
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

    const RateDisplaySongSpoti = ({ song }: { song: Song }) => {

        const addSongToDB = async () => {
            const apiUrl = "http://51.20.128.164/api/add_song";
            try {
                const response = await axios.post(apiUrl, { song_name: `${song.song_name}`, artist_name: `${song.artist_name}`, album_name: `${song.album_name}`, genre: `${song.genre}`, duration: `${song.duration}`, year: `${song.year}` });
                const data = response.data;
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        
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
                        <Button leftIcon={FaDatabase} colorScheme="yellow" onClick={addSongToDB}>Add to Database</Button>
                    </VStack>
                </CardFooter>
            </Card>
        );
    };

    return (
        <div>
            <div className="overflow-y-auto">
                <div className="relative w-full flex flex-col items-center top-12 py-8">
                    <h1 className="text-6xl font-lalezar text-white">Rate Songs to Get Recommendations.</h1>
                    <h1 className="text-2xl font-lalezar text-white">These are also recommendations by Armonify™! </h1>
                </div>
                <div>
                    <div className="py-8"></div>
                    <Flex align="center" justify="center">

                        {/* Genre Section */}
                        <Box className="flex flex-col">
                            <Flex>
                                <Input
                                    placeholder="Type Genre..."
                                    value={genre}
                                    onChange={handleGenreChange}
                                    size="sm"
                                    mr={2}
                                    className="text-white"
                                />
                                <Button onClick={addGenre} size="sm">Add Genre</Button>
                            </Flex>
                            <Stack spacing={4} direction="row" align="center" wrap="wrap">
                                {selectedGenres.map((tag, index) => (
                                    <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                                        <TagLabel>{tag}</TagLabel>
                                        <TagCloseButton onClick={() => removeGenre(tag)}/>
                                    </Tag>
                                ))}
                            </Stack>
                        </Box>
                        <div className="px-5"></div>
                        {/* Artist Section */}
                        <Box className="flex flex-col">
                            <Flex>
                                <Input
                                    placeholder="Type Artist..."
                                    value={artist}
                                    onChange={handleArtistChange}
                                    size="sm"
                                    mr={2}
                                    className="text-white"
                                />
                                <Button onClick={addArtist} size="sm">Add Artist</Button>
                            </Flex>
                            <Stack spacing={4} direction="row" align="center" wrap="wrap">
                                {selectedArtists.map((tag, index) => (
                                    <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                                        <TagLabel>{tag}</TagLabel>
                                        <TagCloseButton onClick={() => removeArtist(tag)}/>
                                    </Tag>
                                ))}
                            </Stack>
                        </Box>
                        <div className="px-5"></div>
                        {/* Album Section */}
                        <Box className="flex flex-col">
                            <Flex>
                                <Input
                                    placeholder="Type Album..."
                                    value={album}
                                    onChange={handleAlbumChange}
                                    size="sm"
                                    mr={2}
                                    className="text-white"
                                />
                                <Button onClick={addAlbum} size="sm">Add Album</Button>
                            </Flex>
                            <Stack spacing={4} direction="row" align="center" wrap="wrap">
                                {selectedAlbums.map((tag, index) => (
                                    <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                                        <TagLabel>{tag}</TagLabel>
                                        <TagCloseButton onClick={() => removeAlbum(tag)}/>
                                    </Tag>
                                ))}
                            </Stack>
                        </Box>
                        <div className="px-5"></div>

                        <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
                            <Box bg="white" maxW='sm' borderWidth='1px' borderRadius='lg' p={1} overflow='hidden'>
                                <div className="px-1"></div>
                                <RadioGroup onChange={setRateType} value={rateType}>
                                    <Stack direction='row'>
                                        <Radio value='1' className="text-white">Armonify</Radio>
                                        <Radio value='2' className="text-white">My Songs</Radio>
                                    </Stack>
                                </RadioGroup>
                            </Box>
                        </Stack>
                        
                        <div className="px-5"></div>

                        {rateType === '1' ? (
                            <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
                                <Button colorScheme="facebook" onClick={fetch_recom_songs}>
                                    Get Songs to Rate
                                </Button>
                            </Stack>
                        ) : (
                            <></>
                        )}

                    </Flex>
                    <SimpleGrid
                        paddingTop="50px"
                        paddingLeft="50px"
                        paddingRight="50px"
                        spacing={4}
                        templateColumns='repeat(5, 1fr)'
                    >
                        {rateType === '1' ? (
                            RatingSongsRecom.slice(0, 15).map((song, index) => (
                                    <RateDisplaySong key={song.song_name} song={song}/>
                                ))
                        ) : (
                            RatingSongsOwn.slice(0, 15).map((song, index) => (
                                    <RateDisplaySong key={song.song_name} song={song}/>
                                ))
                        )}
                    </SimpleGrid>
                </div>
            </div>
            <div className="flex items-center justify-center bg-[#081730]">
                <div className="w-1/2 text-center flex flex-col items-center justify-center pr-32">
                    <RefreshButton/>
                </div>
            </div>
        </div>
    );
};
export default RatingPage;
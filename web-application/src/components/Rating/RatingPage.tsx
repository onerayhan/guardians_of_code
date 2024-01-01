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
    UseCheckboxProps,
    useCheckboxGroup,
    HStack,
    VStack,
    Radio,
    RadioGroup,
    Input,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel, TableContainer, Table, Thead, Tr, Th, Tbody
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
import {FaMusic, FaCalendarAlt, FaClock, FaStar, FaDatabase, FaCompactDisc, FaMicrophone} from 'react-icons/fa';
import { MdAlbum } from 'react-icons/md';
import {IoIosRefreshCircle, IoMdMicrophone} from "react-icons/io";
import {IoRefreshCircleSharp} from "react-icons/io5";
import RefreshButton from "./RefreshButton.tsx";
import {BsFillSendFill} from "react-icons/bs";
import { Text } from '@chakra-ui/react'
import { IoMdOptions } from "react-icons/io";
import StarRating from "./SongStar.tsx";
import Ratings from "react-star-ratings";
import {Avatar, Modal} from "flowbite-react";
import ReactPaginate from 'react-paginate';

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

interface ModalState {
    type: 'artist' | 'album' | null;
    data: string | null;
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
    const [showArtistRateModal, setArtistRateModal] = React.useState(false);
    const [showAlbumRateModal, setAlbumRateModal] = React.useState(false);
    const [currentModal, setCurrentModal] = useState<ModalState>({ type: null, data: null });

    const openArtistModal = (artistName: string) => {
        setCurrentModal({ type: 'artist', data: artistName });
    };

    const openAlbumModal = (albumName: string) => {
        setCurrentModal({ type: 'album', data: albumName });
    };

    const closeModal = () => {
        setCurrentModal({ type: null, data: null });
    };

    const isArtistModalOpen = currentModal.type === 'artist';
    const isAlbumModalOpen = currentModal.type === 'album';

    useEffect(() => {
        setSongRatings({});
    }, [rateType]);

    const ArtistRate = ({ artist_name }: { artist_name: string | null}) => {
        const [artistRatings, setArtistRatings] = useState<{ [artistName: string]: number }>({});

        const updateRating = (artist_name: string, newRating: number) => {
            setArtistRatings(prevRatings => ({
                ...prevRatings,
                [artist_name]: newRating
            }));
        };

        let currentRating = 0;
        artist_name ? currentRating = artistRatings[artist_name] || 0 : currentRating = 0;

        const changeRating = (newRating: number) => {
            artist_name ? updateRating(artist_name, newRating) : updateRating("", 0);
        };

        const handleSendRate = async () => {
            const apiUrl = "http://51.20.128.164/api/add_user_performer_ratings"
            try {
                await axios.post(apiUrl, {username: `${auth()?.username}`, performer_name: artist_name, rating: artistRatings[artist_name]});
                toast({
                    title: `${artist_name} was rated ${artistRatings[artist_name]}!`,
                    status: "success",
                });
                closeModal();
            }
            catch (error) {
                console.error("Error in sending rating:", error);
            }
        }
        return(
            <Box className="rounded-xl bg-gray-100">
                <VStack>
                    <div className="px-2"></div>
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
                    <div className="px-2"></div>
                    <Button onClick={handleSendRate} colorScheme="green">Send Rating</Button>
                    <div className="px-2"></div>
                </VStack>
            </Box>
        );
    }

    const AlbumRate = ({ album_name }: { album_name: string | null}) => {
        const [albumRatings, setAlbumRatings] = useState<{ [albumName: string]: number }>({});
        const auth = useAuthUser();
        const toast = useToast();

        const updateRating = (album_name: string, newRating: number) => {
            setAlbumRatings(prevRatings => ({
                ...prevRatings,
                [album_name]: newRating
            }));
        };

        let currentRating = 0;
        if (album_name) {
            currentRating = albumRatings[album_name] || 0;
        }

        const changeRating = (newRating: number) => {
            if (album_name) {
                updateRating(album_name, newRating);
            }
        };

        const handleSendRate = async () => {
            const apiUrl = "http://51.20.128.164/api/add_user_album_ratings" // Update the API URL
            try {
                await axios.post(apiUrl, {username: `${auth()?.username}`, album_name: album_name, rating: albumRatings[album_name]});
                toast({
                    title: `${album_name} was rated ${albumRatings[album_name]}!`,
                    status: "success",
                });
                closeModal();
            }
            catch (error) {
                console.error("Error in sending rating:", error);
            }
        }

        return (
            <Box className="rounded-xl bg-gray-100">
                <VStack>
                    <div className="px-2"></div>
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
                    <div className="px-2"></div>
                    <Button onClick={handleSendRate} colorScheme="green">Send Rating</Button>
                    <div className="px-2"></div>
                </VStack>
            </Box>
        );
    }

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
            const apiUrl = `http://51.20.128.164/api/user_songs/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
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

        setRatings(prevRatings => {
            const updatedRatings = prevRatings.filter(rating => rating.song_id !== songId);
            return [...updatedRatings, { rating_type: "song_rate", song_id: songId, rating: newRating }];
        });
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

    function SongDisplayComponent({ rateType, RatingSongsRecom, RatingSongsOwn }) {
        const [currentPage, setCurrentPage] = useState(0);
        const songsPerPage = 4;

        const displayedSongs = (rateType === '1' ? RatingSongsRecom : RatingSongsOwn)
            .slice(currentPage * songsPerPage, (currentPage + 1) * songsPerPage);

        const pageCount = Math.ceil((rateType === '1' ? RatingSongsRecom.length : RatingSongsOwn.length) / songsPerPage);

        const handlePageClick = (selectedItem) => {
            setCurrentPage(selectedItem.selected);
        };

        return (
            <>
                <div className="flex flex-col items-center pt-12 px-12">
                    <div className="flex space-x-4">
                        <div className="py-5"></div>
                        {displayedSongs.map((song, index) => (
                            <RateDisplaySong key={song.song_name} song={song}/>
                        ))}
                        <div className="py-5"></div>
                    </div>
                    <ReactPaginate
                        previousLabel={<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">← Previous</button>}
                        nextLabel={<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Next →</button>}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName="pagination flex justify-center mt-4"
                        pageClassName="page-item inline-block"
                        pageLinkClassName="page-link inline-block border border-gray-300 text-gray rounded py-2 px-3 bg-gray-100 hover:bg-gray-200"
                        activeClassName="text-blue rounded"
                        activeLinkClassName="active-link"
                        previousClassName="mr-2"
                        nextClassName="ml-2"
                    />
                </div>
            </>
        );
    }

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
            let idx = Number(song.song_id);
            updateRating(idx, newRating);
        };

        return (
            <Card maxW='500px'>
                <CardBody>
                    <Stack spacing={3}>
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
                                    onClick={() => openArtistModal(song.performer_name)}>{song.performer_name}</Button>
                        </Flex>
                        <Flex alignItems="center">
                            <Icon as={MdAlbum} w={5} h={5} mr={2}/>
                            <Button variant='ghost'
                                    onClick={() => openAlbumModal(song.album_name)}>{song.album_name}</Button>
                        </Flex>

                        <Modal show={isArtistModalOpen} size="sm" onClose={closeModal}>
                            <Modal.Header>Rate Artist: {currentModal.data}</Modal.Header>
                            <Modal.Body>
                                <ArtistRate artist_name={currentModal.data}/>
                            </Modal.Body>
                        </Modal>

                        <Modal show={isAlbumModalOpen} size="sm" onClose={closeModal}>
                            <Modal.Header>Rate Album: {currentModal.data}</Modal.Header>
                            <Modal.Body>
                                <AlbumRate album_name={currentModal.data}/>
                            </Modal.Body>
                        </Modal>

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

    return (
        <div>
            <div className="overflow-y-auto">
                <div className="relative w-full flex flex-col items-center top-12 py-8">
                    <h1 className="text-6xl font-lalezar text-white">Rate Songs to Get Recommendations.</h1>
                    <h1 className="text-2xl font-lalezar text-white">These are also recommendations by Armonify™! </h1>
                    <div className="py-2"></div>
                    <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
                        <Box bg="white" maxW='sm' borderWidth='1px' borderRadius='lg' p={1} overflow='hidden'>
                            <div className="px-1"></div>
                            <RadioGroup onChange={setRateType} value={rateType}>
                                <Stack direction='row' w={60}>
                                    <Radio value='1' className="text-white">Armonify</Radio>
                                    <div className="px-1"></div>
                                    <Radio value='2' className="text-white">My Songs</Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>
                    </Stack>
                </div>

                <div>
                    <div className="py-2"></div>
                    <Flex align="center" justify="center">
                        {
                            rateType === '1' && (
                                <>
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
                                                <Tag size="md" key={index} borderRadius="full" variant="solid"
                                                     colorScheme="blue">
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
                                                <Tag size="md" key={index} borderRadius="full" variant="solid"
                                                     colorScheme="blue">
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
                                                <Tag size="md" key={index} borderRadius="full" variant="solid"
                                                     colorScheme="blue">
                                                    <TagLabel>{tag}</TagLabel>
                                                    <TagCloseButton onClick={() => removeAlbum(tag)}/>
                                                </Tag>
                                            ))}
                                        </Stack>
                                    </Box>
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
                                </>
                            )
                        }
                    </Flex>

                    <div className="px-5"></div>

                </div>
                {rateType === '3' ? (
                    <></>
                ) : (
                    <div className="bg-[#081730]">
                        <div>
                            <SongDisplayComponent rateType={rateType} RatingSongsRecom={RatingSongsRecom}
                                                  RatingSongsOwn={RatingSongsOwn}/>
                        </div>
                    </div>
                )}
            </div>
            {rateType !== '3' ? (
                <div className="bg-[#081730]">
                    <div>
                        <RefreshButton/>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
export default RatingPage;
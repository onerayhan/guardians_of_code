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
    TabPanel,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    createMultiStyleConfigHelpers,
    useRadio,
    useRadioGroup,
    Skeleton
} from '@chakra-ui/react'
import React, {useEffect, useState} from 'react';
import {useAuthUser} from "react-auth-kit";
import axios from "axios";
import {StarIcon} from "@chakra-ui/icons";
import {Checkbox, Divider} from "antd";
import {AiTwotoneLike} from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import GenreInput from "./GenreInput.tsx";
import AlbumInput from "./AlbumInput.tsx";
import ArtistInput from "./ArtistInput.tsx";
import {FaMusic, FaCalendarAlt, FaClock, FaStar, FaDatabase, FaCompactDisc, FaMicrophone} from 'react-icons/fa';
import {MdAlbum} from 'react-icons/md';
import {IoIosRefreshCircle, IoMdMicrophone} from "react-icons/io";
import {IoRefreshCircleSharp} from "react-icons/io5";
import RefreshButton from "./RefreshButton.tsx";
import {BsFillSendFill} from "react-icons/bs";
import {Text} from '@chakra-ui/react'
import {IoMdOptions} from "react-icons/io";
import StarRating from "./SongStar.tsx";
import Ratings from "react-star-ratings";
import {Avatar, Modal} from "flowbite-react";
import ReactPaginate from 'react-paginate';
import {selectAnatomy} from '@chakra-ui/anatomy'
import AwesomeButtonSocial from "react-native-really-awesome-button";
import {useDisclosure} from "@chakra-ui/hooks";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss"

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

interface SongRecom {
    album: string;
    genre: string;
    performer: string;
    song_id: number;
    songs_name: string;
    username: string;
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
    const [RatingSongsRecom, setRatingSongsRecom] = useState<SongRecom[]>([]);
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
    const [rateType, setRateType] = React.useState('Added Songs');
    const [showArtistRateModal, setArtistRateModal] = React.useState(false);
    const [showAlbumRateModal, setAlbumRateModal] = React.useState(false);
    const [currentModal, setCurrentModal] = useState<ModalState>({type: null, data: null});
    const [activeButtons, setActiveButtons] = useState<string[]>([]);
    const [selection, setSelection] = useState('all');
    const [fetching_results, setFetchingResults] = useState(false);

    const handleSelectChange = (event) => {
        setSelection(event.target.value);
    };

    const toggleButtonActive = (buttonId: string) => {
        setActiveButtons(prevActiveButtons =>
            prevActiveButtons.includes(buttonId)
                ? prevActiveButtons.filter(id => id !== buttonId)
                : [...prevActiveButtons, buttonId]
        );
    };

    const {definePartsStyle, defineMultiStyleConfig} =
        createMultiStyleConfigHelpers(selectAnatomy.keys)

    const brandPrimary = definePartsStyle({
        field: {
            border: "1px dashed",
            borderColor: "purple.200",
            borderRadius: "full",
            textColor: "black.100"
        },
        icon: {
            color: "purple.400"
        }
    })

    const selectTheme = defineMultiStyleConfig({
        variants: {brandPrimary},
    })


    const openArtistModal = (artistName: string) => {
        setCurrentModal({type: 'artist', data: artistName});
    };

    const openAlbumModal = (albumName: string) => {
        setCurrentModal({type: 'album', data: albumName});
    };

    const closeModal = () => {
        setCurrentModal({type: null, data: null});
    };

    const isArtistModalOpen = currentModal.type === 'artist';
    const isAlbumModalOpen = currentModal.type === 'album';

    useEffect(() => {
        setSongRatings({});
    }, [rateType]);

    const ArtistRate = ({artist_name}: { artist_name: string | null }) => {
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
                await axios.post(apiUrl, {
                    username: `${auth()?.username}`,
                    performer_name: artist_name,
                    rating: artistRatings[artist_name]
                });
                toast({
                    title: `${artist_name} was rated ${artistRatings[artist_name]}!`,
                    status: "success",
                });
                closeModal();
            } catch (error) {
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

    const AlbumRate = ({album_name}: { album_name: string | null }) => {
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
                await axios.post(apiUrl, {
                    username: `${auth()?.username}`,
                    album_name: album_name,
                    rating: albumRatings[album_name]
                });
                toast({
                    title: `${album_name} was rated ${albumRatings[album_name]}!`,
                    status: "success",
                });
                closeModal();
            } catch (error) {
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
        const apiUrl = `http://51.20.128.164/api/recommendations/${auth()?.username}`;

        // Simplified selection logic
        const criteriaMapping = {
            'Genre': 'genre',
            'Album': 'album',
            'Performer': 'performer'
        };

        let selected = activeButtons.map(button => criteriaMapping[button]).filter(Boolean);

        try {
            const response = await axios.post(apiUrl, {criteria_list: selected, target_audience: selection});
            setRatingSongsRecom(response.data);
        } catch (error) {
            console.error("Error fetching recommended songs:", error);
            toast({
                title: `Error fetching recommended songs: ${error}`,
                status: "error",
            })
        }
    };

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
            return [...updatedRatings, {rating_type: "song_rate", song_id: songId, rating: newRating}];
        });
    };

    const RefreshButton = () => {
        const sendRatings = async () => {
            const apiUrl = "http://51.20.128.164/api/add_rate_batch";
            try {
                await axios.post(apiUrl, {username: `${auth()?.username}`, ratings: ratings});
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

    function RadioCard(props) {
        const {getInputProps, getRadioProps} = useRadio(props)

        const input = getInputProps()
        const checkbox = getRadioProps()

        const activeBgColor = '#215cff'; // Or any color you prefer

        return (
            <Box as='label'>
                <input {...input} />
                <Box
                    {...checkbox}
                    cursor='pointer'
                    borderWidth='1px'
                    borderRadius='md'
                    boxShadow='md'
                    textColor={props.children === rateType ? 'white' : 'black'}
                    bg={props.children === rateType ? activeBgColor : 'transparent'}
                    _checked={{
                        color: 'black',
                        borderColor: 'teal.600',
                    }}
                    _hover={{
                        borderColor: 'black',
                    }}
                    px={5}
                    py={3}
                >
                    {props.children}
                </Box>
            </Box>
        )
    }

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
    function SelectionRadio() {
        const options = ['Armonify', 'Added Songs']

        const {getRootProps, getRadioProps} = useRadioGroup({
            name: 'framework',
            defaultValue: 'react',
            onChange: setRateType,
        })

        const group = getRootProps()

        return (
            <HStack {...group}>
                {options.map((value) => {
                    const radio = getRadioProps({value})
                    return (
                        <RadioCard key={value} {...radio}>
                            {value}
                        </RadioCard>
                    )
                })}
            </HStack>
        )
    }

    function SongDisplayComponent({rateType, RatingSongsRecom, RatingSongsOwn}) {
        const [currentPage, setCurrentPage] = useState(0);
        const songsPerPage = 4;

        const displayedSongs = (rateType === 'Added Songs' ? RatingSongsOwn : RatingSongsRecom)
            .slice(currentPage * songsPerPage, (currentPage + 1) * songsPerPage);

        const pageCount = rateType === 'Added Songs' ? Math.ceil(RatingSongsOwn.length / songsPerPage) : Math.ceil(RatingSongsRecom.length / songsPerPage);

        const handlePageClick = (selectedItem) => {
            setCurrentPage(selectedItem.selected);
        };

        return (
            <>
                <div className="flex flex-col items-center pt-12 px-12">
                    <div className="flex space-x-4">
                        <div className="py-5"></div>
                        {rateType === 'Added Songs' ? (
                            displayedSongs.map((song, index) => (
                                <RateDisplaySong key={song.song_name} song={song}/>
                            ))
                        ) : (
                            displayedSongs.map((song, index) => (
                                <RateDisplayRecomSong key={song.song_id} song={song}/>
                            ))
                        )}

                        <div className="py-5"></div>
                    </div>
                    <ReactPaginate
                        previousLabel={<button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">←
                            Previous</button>}
                        nextLabel={<button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Next
                            →</button>}
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

    const RateDisplayRecomSong = ({song}: { song: SongRecom }) => {
        // You can access song properties using song.album, song.genre, etc.
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
                            <Text className="font-semibold">{song.songs_name}</Text>
                        </Flex>
                        <div className="px-2"></div>
                        <Flex alignItems="center">
                            <Icon as={IoMdMicrophone} w={5} h={5} mr={2}/>
                            <Button variant='ghost' onClick={() => openArtistModal(song.performer)}>
                                {song.performer}
                            </Button>
                        </Flex>
                        <Flex alignItems="center">
                            <Icon as={MdAlbum} w={5} h={5} mr={2}/>
                            <Button variant='ghost' onClick={() => openAlbumModal(song.album)}>
                                {song.album}
                            </Button>
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
                    </Stack>
                </CardBody>
                <Divider/>
                <CardFooter>
                    <VStack className="flex align-center">
                        <Text className="font-semibold">
                            <Icon as={FaStar} w={5} h={5} mr={2}/>
                            Rate this song
                        </Text>
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

    const RateDisplaySong = ({song}: { song: Song }) => {
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
                <Divider/>
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

    const EmptyCard = () => {
        return (
            <Card maxW='500px'>
                <CardBody>
                    <Stack spacing={3}>
                        {/* Skeleton for Song Name, Performer, Album, and Genre */}
                        <Skeleton height='20px' width="200px"/>
                        <div className="px-2"></div>
                        <Skeleton height='20px' width="200px"/>
                        <div className="px-2"></div>
                        <Skeleton height='20px' width="200px"/>
                        <div className="px-2"></div>
                        <Skeleton height='20px' width="200px"/>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    <VStack className="flex align-center">
                        <Text className="font-semibold"><Icon as={FaStar} w={5} h={5} mr={2}/>Rate this song</Text>
                        <div className="px-2"></div>
                        <Skeleton height='20px' width="200px"/>
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
                            <SelectionRadio/>
                        </Box>
                    </Stack>
                </div>

                <div>
                    <div className="py-2"></div>
                    <Flex align="center" justify="center">
                        {
                            rateType === 'Armonify' && (
                                <>

                                    <div className="px-2"></div>
                                    <Select
                                        w={60}
                                        variant="brandPrimary"
                                        className="text-black"
                                        value={selection}
                                        onChange={handleSelectChange}
                                    >
                                        <option value='all'>All</option>
                                        <option value='followings'>Followings</option>
                                        <option value='group'>Group Members</option>
                                    </Select>
                                    <div className="px-2"></div>
                                    <div>
                                        {['Genre', 'Album', 'Performer'].map(buttonId => (
                                            <Button
                                                key={buttonId}
                                                onClick={() => toggleButtonActive(buttonId)}
                                                colorScheme={activeButtons.includes(buttonId) ? 'blue' : 'gray'}
                                                m={2}
                                            >
                                                {buttonId}
                                            </Button>
                                        ))}
                                    </div>
                                    <div className="px-4"></div>
                                    <Button
                                        onClick={() => {
                                            setFetchingResults(true);
                                            fetch_recom_songs().then(() => setFetchingResults(false));
                                        }}
                                        loadingText='Fetching...'
                                        spinnerPlacement='start'
                                        colorScheme="green"
                                        isDisabled={activeButtons.length === 0}
                                        isLoading={fetching_results}
                                    >
                                        Get Recommendations
                                    </Button>

                                </>
                            )
                        }
                    </Flex>

                    <div className="px-5"></div>

                </div>
                {rateType === 'Added Songs' ? (
                    <div className="bg-[#081730]">
                        <div>
                            <SongDisplayComponent rateType={rateType} RatingSongsRecom={RatingSongsRecom}
                                                  RatingSongsOwn={RatingSongsOwn}/>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-[#081730]">
                            <div>
                                {
                                    !fetching_results
                                        ? <SongDisplayComponent rateType={rateType} RatingSongsRecom={RatingSongsRecom} RatingSongsOwn={RatingSongsOwn} />
                                        : <div className="flex flex-col items-center pt-12 px-12">
                                            <div className="flex space-x-4">
                                            {Array.from({ length: 4 }).map((_, index) => <EmptyCard key={index} />)}
                                        </div> </div>
                                }

                            </div>
                        </div>
                    </>
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
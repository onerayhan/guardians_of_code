import RecommendationsTable from './RecommendationsTable';
import FriendRecomsTable from './FriendRecomsTable';
import {
    Box,
    Button,
    Flex,
    Heading, HStack,
    Radio,
    RadioGroup, Select, Spacer,
    Stack,
    Tab, Table, TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs, Tbody, Td, Th, Thead, Tr, useRadio, useRadioGroup, useToast, VStack
} from '@chakra-ui/react'
import React, {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {useAuthUser} from "react-auth-kit";
import {FaDatabase, FaSpotify, FaStar} from "react-icons/fa";
import {IoIosRefreshCircle} from "react-icons/io";
import {Avatar} from "flowbite-react";
import {useNavigate} from "react-router-dom";
import { BsGraphUpArrow } from "react-icons/bs";
import {TbMusicX, TbPlayerTrackNextFilled} from "react-icons/tb";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'
import Timestamp from "react-timestamp";

interface Song {
    song_photo: string | undefined;
    song_id: number;
    song_name: string;
    artist_name: string;
    album_name: string;
    genre: string | null;
    length: number | null
    tempo: number | null
    recording_type: string | null;
    listens: number | null;
    release_year: number | null;
}

interface SongRecom {
    album: string;
    genre: string;
    performer: string;
    song_id: number;
    songs_name: string;
    username: string;
}

function RecommendationsPage() {
    const [spoti_auth, setSpotiAuth] = useState(false);
    const [rateType, setRateType] = React.useState('Armonify');
    const [tabIndex1, setTabIndex1] = useState(0);
    const [tabIndex, setTabIndex] = useState(0);
    const [RecomSongsSpoti, setRecomSongsSpoti] = useState<Song[]>([]);
    const [AddSongsSpoti, setAddSongsSpoti] = useState<Song[]>([]);
    const [RecomSongs, setRecomSongs] = useState<SongRecom[]>([]);
    const [error, setError] = useState("");
    const [activeButtons, setActiveButtons] = useState<string[]>([]);
    const [selection, setSelection] = useState('all');
    const [fetching_results, setFetchingResults] = useState(false);
    const navigate = useNavigate();

    function RadioCard(props) {
        const { getInputProps, getRadioProps } = useRadio(props);
        const input = getInputProps();
        const radio = getRadioProps();

        // Define the background color for the active state
        const activeBgColor = '#215cff'; // Or any color you prefer

        return (
            <Box as='label'>
                <input {...input} />
                <Box
                    {...radio}
                    cursor='pointer'
                    borderWidth='1px'
                    borderRadius='md'
                    boxShadow='md'
                    bg={props.children === rateType ? activeBgColor : 'transparent'}
                    textStyle={"lalezar"}
                    textColor={props.children === rateType ? 'white' : 'black'}
                    _checked={{
                        borderColor: 'green.600', // Or any border color you prefer
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
        );
    }

    function SelectionRadio() {
        const options = ['Armonify', 'Spotify'];

        const { getRootProps, getRadioProps } = useRadioGroup({
            name: 'framework',
            defaultValue: 'react',
            onChange: setRateType,
        });

        const group = getRootProps();

        return (
            <HStack {...group}>
                {options.map((value) => {
                    const radio = getRadioProps({ value });
                    return (
                        <RadioCard key={value} {...radio} value={value}>
                            {value}
                        </RadioCard>
                    );
                })}
            </HStack>
        );
    }


    const auth = useAuthUser();
    const toast = useToast();

    const toggleButtonActive = (buttonId: string) => {
        setActiveButtons(prevActiveButtons =>
            prevActiveButtons.includes(buttonId)
                ? prevActiveButtons.filter(id => id !== buttonId)
                : [...prevActiveButtons, buttonId]
        );
    };

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
            const response = await axios.post(apiUrl, { criteria_list: selected, target_audience: selection });
            const authUsername = auth()?.username?.toLowerCase();
            const filteredSongs = response.data.filter(song => song.username.toLowerCase() !== authUsername);

            setRecomSongs(filteredSongs);

            toast({
                title: `Recommended songs fetched successfully!`,
                status: "success",
            });
        } catch (error) {
            console.error("Error fetching recommended songs:", error);
            toast({
                title: `Error fetching recommended songs: ${error}`,
                status: "error",
            })
        }
    };

    const navigateUser = (user: string) => {
        let og_user = auth()?.username?.toLowerCase();
        let input_user = user.toLowerCase();

        if (og_user === input_user) {
            navigate(`/${og_user}`);
        } else {
            navigate(`/user/${user}`);
        }
    }

    const SongDisplay = ({ song }: { song: SongRecom }) => {

        return (
            <Tr>
                <Td className={"text-black"}>{song.songs_name}</Td>
                <Td className={"text-black"}>{song.genre}</Td>
                <Td className={"text-black"}>{song.performer}</Td>
                <Td className={"text-black"}>{song.album}</Td>
                <Td className={"text-black"}>
                    <Button onClick={() => navigateUser(song.username)} colorScheme="blue">
                        <FaUserFriends size={15}/> <div className="px-1"/>{song.username}
                    </Button>
                </Td>
            </Tr>
        );
    };

    const handleSelectChange = (event) => {
        setSelection(event.target.value);
    };

    const { definePartsStyle, defineMultiStyleConfig } =
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
        variants: { brandPrimary },
    })

    useEffect(() => {
        const fetch_spoti_status = async () => {
            const apiUrl = `http://51.20.128.164/api/check_spoti_connection/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const data = response.data.check;
                setSpotiAuth(data === "true");
            } catch (error) {
                console.log(error);
            }
        }

        fetch_spoti_status();
    }, []);

    useEffect(() => {
    if (spoti_auth) {
        const fetch_top_spoti = async () => {
            const apiUrl = `http://51.20.128.164/spoti/get_user_top_tracks/${auth()?.username}`;
            try
            {
                const response = await axios.get(apiUrl);
                const data = response.data;
                processSongs(data, "tracks").then(songs => setRecomSongsSpoti(songs));
            }
            catch (error)
            {
                console.log(error);
            }
        }

        const fetch_add_spoti = async () => {
            const apiUrl = `http://51.20.128.164/spoti/get_curr_user_tracks/${auth()?.username}`;
            try
            {
                const response = await axios.get(apiUrl);
                const data = response.data;
                processSongs(data, "savedTracks").then(songs => setAddSongsSpoti(songs));
            }
            catch (error)
            {
                console.log(error);
            }
        }

        fetch_add_spoti();
        fetch_top_spoti();
    }
    }, [spoti_auth]);

    async function processSongs(data, dataType) {
        const processTrack = async (track) => {
            try {
                const genre = await get_genre_of_song(track.artists[0].name);
                return {
                    song_photo: track.album.images[0]?.url,
                    song_id: track.id,
                    song_name: track.name,
                    artist_name: track.artists.map(artist => artist.name).join(', '),
                    genre: genre,
                    album_name: track.album.name,
                    length: track.duration_ms,
                    release_year: track.album.release_date ? parseInt(track.album.release_date.split('-')[0], 10) : null,
                };
            } catch (error) {
                console.error(`Error processing track ${track.name}:`, error);
                return null;
            }
        };

        if (dataType === 'tracks') {
            // Processing tracks array
            return Promise.all(data.map(track => processTrack(track)));
        } else if (dataType === 'savedTracks') {
            // Processing savedTracks array
            return Promise.all(data.map(item => processTrack(item.track)));
        } else {
            throw new Error('Invalid data type specified');
        }
    }

    async function get_genre_of_song(song_name : string) {
        try {
            let type = "artist";
            const response = await axios.post(`http://51.20.128.164/spoti/search/${auth()?.username}`, { type, query: song_name });
            return response.data.artists.items[0].genres[0];
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    const formatDuration = (duration: number | null) => {
        if (duration === null) return 'N/A';

        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes % 60).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');

        return `${hh}:${mm}:${ss}`;
    };

    const addSongToDB = async (songInfo : Song) => {
        try {
            // Construct the payload based on what's displayed on the card
            const payload = {
                username: auth()?.username,
                song_name: songInfo.song_name,
                // Only include fields if they have values (not null)
                ...(songInfo.length !== null && { length: formatDuration(songInfo.length) }),
                ...(songInfo.tempo !== null && { tempo: songInfo.tempo }),
                ...(songInfo.recording_type && { recording_type: songInfo.recording_type }),
                ...(songInfo.listens !== null && { listens: songInfo.listens }),
                ...(songInfo.genre !== null && { genre: songInfo.genre }),
                ...(songInfo.release_year !== null && { release_year: songInfo.release_year }),
                ...(songInfo.album_name && { album_name: songInfo.album_name }),
                performer_name: songInfo.artist_name,
            };

            await axios.post("http://51.20.128.164/api/add_song", payload);
            toast({
                description: "Song added successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message);
            else if (err && err instanceof Error) setError(err.message);

            console.log("Error: ", err);
        }
    }

    const navigateArtist = (artistName: string) => {
        navigate(`/artist/${artistName}`);
    }

    const navigateAlbum = (albumName: string) => {
        navigate(`/album/${albumName}`);
    }

  return (
      <div>

            <div className="py-5"></div>
          <div className="relative w-full flex flex-col items-center">
              <Heading as="h1" size="xl" color="white" align="center">
                  Select where you want to get your recommendations from.
              </Heading>
              <Heading as="h1" size="md" color="white" align="center">
                  You can get recommendations from Spotify to add them to your Armonify library and rate them.
              </Heading>
                <div className="py-5"></div>
              <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
                  <Box bg="white" maxW='sm' borderWidth='1px' borderRadius='lg' p={1} overflow='hidden'>
                      <div className="px-1"></div>
                      <RadioGroup onChange={setRateType} value={rateType}>
                          <Stack direction='row' w="50pz">
                            <SelectionRadio />
                          </Stack>
                      </RadioGroup>
                  </Box>
              </Stack>
          </div>

          <div className="flex flex-col items-center justify-center bg-[#081730] text-white">

              {
                  rateType === 'Armonify' ?
                      <>
                          <div className="py-5"></div>
                          <div
                              className="relative flex flex-col items-center bg-[#F3F0F7] rounded-xl mx-20 p-8 overflow-x-auto">
                              <Flex justifyContent="space-between" alignItems="flex-start" w="full">
                                  <VStack spacing={4} align="stretch" w="full">
                                      <Flex alignItems="center" mb={4}>
                                          <div className="px-12"></div>
                                          <Spacer/>
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
                                                          className="aws-btn 4px 2px"
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
                                      </Flex>
                                      <div className="relative w-full flex flex-col items-center top-10 pb-8 max-w-max">
                                          <div className="rounded-xl bg-white">
                                              <TableContainer>
                                                  <Table variant="simple" colorScheme='purple' size="lg">
                                                      <Thead>
                                                          <Tr>
                                                              <Th>Song Name</Th>
                                                              <Th>Artist(s)</Th>
                                                              <Th>Album</Th>
                                                              <Th>Performer</Th>
                                                              <Th>Origin User</Th>
                                                          </Tr>
                                                      </Thead>
                                                      <Tbody>
                                                          {RecomSongs.map(song => <SongDisplay key={song.song_id}
                                                                                               song={song}/>)}
                                                      </Tbody>
                                                  </Table>
                                              </TableContainer>
                                          </div>
                                      </div>
                                  </VStack>
                              </Flex>
                          </div>
                      </>
                      :
                      <>
                          <div className="py-5"></div>
                          <div
                              className="relative flex flex-col max-w-7xl items-center bg-[#F3F0F7] rounded-xl mx-20 p-8 overflow-x-auto">
                              <Flex justifyContent="space-between" alignItems="flex-start" w="full">
                                  <Tabs variant='soft-rounded' colorScheme='blue'
                                        onChange={(index) => setTabIndex1(index)}>
                                      <Flex alignItems="center" mb={4}>
                                          <TabList>
                                              <Tab><BsGraphUpArrow size={20}/>Your Top Spotify Songs</Tab>
                                              <Tab><TbPlayerTrackNextFilled size={20}/> Your Current Spotify
                                                  Tracks</Tab>
                                          </TabList>
                                          <div className="px-80"></div>
                                      </Flex>
                                      <TabPanels>
                                          <TabPanel>
                                              <div className="relative w-full flex flex-col items-center top-10 pb-8">
                                                  <div className="rounded-xl bg-white">
                                                      <TableContainer>
                                                          <Table variant="simple" colorScheme='purple' size="lg">
                                                              <Thead>
                                                                  <Tr>
                                                                  <Th>Song Photos</Th>
                                                                      <Th>Song Name</Th>
                                                                      <Th>Genre</Th>
                                                                      <Th>Artists</Th>
                                                                      <Th>Album</Th>
                                                                      <Th>Length</Th>
                                                                      <Th>Release Year</Th>
                                                                      <Th></Th>
                                                                  </Tr>
                                                              </Thead>
                                                              <Tbody>
                                                                  {RecomSongsSpoti.map((song, index) => (
                                                                      <Tr key={index}>
                                                                          <Td><Avatar img={song.song_photo} size="xl" /></Td>
                                                                          <Td className="text-black">{song.song_name}</Td>
                                                                          <Td className="text-black">{song.genre}</Td>
                                                                          <Td>
                                                                              {
                                                                                  song.artist_name.split(",").map((artist, index) => (
                                                                                      <Button
                                                                                          key={index}
                                                                                          onClick={() => navigateArtist(artist)}
                                                                                      >
                                                                                          {artist}
                                                                                      </Button>
                                                                                  ))
                                                                              }
                                                                          </Td>
                                                                          <Td><Button onClick={() => navigateAlbum(song.album_name)}>{song.album_name}</Button></Td>
                                                                          <Td className="text-black">{formatDuration(song.length)}</Td>
                                                                          <Td className="text-black">{song.release_year}</Td>
                                                                          <Td>
                                                                              <Button
                                                                                  variant='solid'
                                                                                  colorScheme='yellow'
                                                                                  leftIcon={FaDatabase}
                                                                                  onClick={() => addSongToDB(song)}
                                                                              >
                                                                                  Add to Database
                                                                              </Button>
                                                                          </Td>
                                                                      </Tr>
                                                                  ))}
                                                              </Tbody>
                                                          </Table>
                                                      </TableContainer>
                                                  </div>
                                              </div>
                                          </TabPanel>
                                          <TabPanel>
                                              <div className="relative w-full flex flex-col items-center top-10 pb-8">
                                                  <div className="rounded-xl bg-white">
                                                      <TableContainer>
                                                          <Table variant="simple" colorScheme='purple' size="lg">
                                                              <Thead>
                                                                  <Tr>
                                                                      <Th>Song Photos</Th>
                                                                      <Th>Song Name</Th>
                                                                      <Th>Genre</Th>
                                                                      <Th>Artists</Th>
                                                                      <Th>Album</Th>
                                                                      <Th>Length</Th>
                                                                      <Th>Release Year</Th>
                                                                      <Th></Th>
                                                                  </Tr>
                                                              </Thead>
                                                              <Tbody>
                                                                  {AddSongsSpoti.map((song, index) => (
                                                                      <Tr key={index}>
                                                                          <Td><Avatar img={song.song_photo} size="xl" /></Td>
                                                                          <Td className="text-black">{song.song_name}</Td>
                                                                          <Td className="text-black">{song.genre}</Td>
                                                                          <Td>
                                                                              {
                                                                                  song.artist_name.split(",").map((artist, index) => (
                                                                                      <Button
                                                                                          key={index}
                                                                                          onClick={() => navigateArtist(artist)}
                                                                                      >
                                                                                          {artist}
                                                                                      </Button>
                                                                                  ))
                                                                              }
                                                                          </Td>
                                                                          <Td><Button onClick={() => navigateAlbum(song.album_name)}>{song.album_name}</Button></Td>
                                                                          <Td className="text-black">{formatDuration(song.length)}</Td>
                                                                          <Td className="text-black">{song.release_year}</Td>
                                                                          <Td>
                                                                              <Button
                                                                                  variant='solid'
                                                                                  colorScheme='yellow'
                                                                                  leftIcon={FaDatabase}
                                                                                  onClick={() => addSongToDB(song)}
                                                                              >
                                                                                  Add to Database
                                                                              </Button>
                                                                          </Td>
                                                                      </Tr>
                                                                  ))}
                                                              </Tbody>
                                                          </Table>
                                                      </TableContainer>
                                                  </div>
                                              </div>
                                          </TabPanel>
                                      </TabPanels>
                                  </Tabs>
                              </Flex>
                          </div>
                      </>
              }
          </div>

          <div className="py-20"></div>
      </div>
  );
}

export default RecommendationsPage;
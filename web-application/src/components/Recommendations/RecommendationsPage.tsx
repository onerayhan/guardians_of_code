import RecommendationsTable from './RecommendationsTable';
import FriendRecomsTable from './FriendRecomsTable';
import {
    Box,
    Button,
    Flex,
    Heading,
    Radio,
    RadioGroup,
    Stack,
    Tab, Table, TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs, Tbody, Td, Th, Thead, Tr, useToast
} from '@chakra-ui/react'
import React, {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {useAuthUser} from "react-auth-kit";
import {FaDatabase, FaStar} from "react-icons/fa";
import {IoIosRefreshCircle} from "react-icons/io";
import {Avatar} from "flowbite-react";
import {useNavigate} from "react-router-dom";
import { BsGraphUpArrow } from "react-icons/bs";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";



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

function RecommendationsPage() {
    const [rateType, setRateType] = React.useState('1');
    const [spoti_auth, setSpotiAuth] = useState(false);
    const [tabIndex1, setTabIndex1] = useState(0);
    const [tabIndex, setTabIndex] = useState(0);
    const [RecomSongsSpoti, setRecomSongsSpoti] = useState<Song[]>([]);
    const [AddSongsSpoti, setAddSongsSpoti] = useState<Song[]>([]);
    const [error, setError] = useState("");
    const auth = useAuthUser();
    const toast = useToast();
    const navigate = useNavigate();

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
                <div className="py-2"></div>
              <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
                  <Box bg="white" maxW='sm' borderWidth='1px' borderRadius='lg' p={1} overflow='hidden'>
                      <div className="px-1"></div>
                      <RadioGroup onChange={setRateType} value={rateType}>
                          <Stack direction='row' w="50pz">
                              <Radio value='1' className="text-black">
                                  <div>Armonify</div>
                              </Radio>
                              <div className="px-1"></div>
                              <Radio value='2' className="text-black" isDisabled={!spoti_auth}>Spotify</Radio>
                          </Stack>
                      </RadioGroup>
                  </Box>
              </Stack>
          </div>

          <div className="flex flex-col items-center justify-center bg-[#081730] text-white">

              {
                  rateType === '1' ?
                      <>
                          <div className="py-10"></div>
                          <div
                              className="relative flex flex-col items-center bg-[#F3F0F7] rounded-xl mx-20 p-8 overflow-x-auto">
                              <Flex justifyContent="space-between" alignItems="flex-start" w="full">
                                  <Tabs variant='soft-rounded' colorScheme='blue'
                                        onChange={(index) => setTabIndex1(index)}>
                                      <Flex alignItems="center" mb={4}>
                                          <TabList>
                                              <Tab><FaRegThumbsUp size={20}/>Recommended Based on You</Tab>
                                              <Tab><FaUserFriends size={20}/>Friend-Based Recommendations</Tab>
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
                                                                      <Th>Song Name</Th>
                                                                      <Th>Genre</Th>
                                                                      <Th>Artists</Th>
                                                                      <Th>Album</Th>
                                                                      <Th>Length</Th>
                                                                      <Th>Release Year</Th>
                                                                      <Th>Recommendation Basis</Th>
                                                                  </Tr>
                                                              </Thead>
                                                              <Tbody>
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
                                                                      <Th>Song Name</Th>
                                                                      <Th>Genre</Th>
                                                                      <Th>Artists</Th>
                                                                      <Th>Album</Th>
                                                                      <Th>Length</Th>
                                                                      <Th>Release Year</Th>
                                                                      <Th>Origin Friend</Th>
                                                                  </Tr>
                                                              </Thead>
                                                              <Tbody>
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
                      :
                      <>
                          <div className="py-10"></div>
                          <div className="relative flex flex-col max-w-7xl items-center bg-[#F3F0F7] rounded-xl mx-20 p-8 overflow-x-auto">
                              <Flex justifyContent="space-between" alignItems="flex-start" w="full">
                                  <Tabs variant='soft-rounded' colorScheme='blue'
                                        onChange={(index) => setTabIndex1(index)}>
                                      <Flex alignItems="center" mb={4}>
                                          <TabList>
                                              <Tab><BsGraphUpArrow size={20}/>Your Top Spotify Songs</Tab>
                                              <Tab><TbPlayerTrackNextFilled size={20}/> Your Current Spotify Tracks</Tab>
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
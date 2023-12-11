import React, {useEffect, useState} from 'react';
import {Tabs, TabList, TabPanels, Tab, TabPanel, Thead, Th, Td, Flex, Spacer} from '@chakra-ui/react'
import {GoThumbsup} from "react-icons/go";
import {MdOutlineDataset} from "react-icons/md";
import { useAuthUser } from "react-auth-kit";
import { Button } from "@chakra-ui/react";
import { TbMusicX } from "react-icons/tb";
import Timestamp from "react-timestamp";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {
  Table,
  Tbody,
  Tr,
  TableContainer,
} from '@chakra-ui/react'
import { FaDatabase } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { IoIosRemoveCircle } from "react-icons/io";
import Ratings from "react-star-ratings";
import { IoIosRefreshCircle } from "react-icons/io";
import {useNavigate} from "react-router-dom";

interface SongsArray {
    song_id: string;
    song_name: string;
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

interface RatedArray {
    song_id: number;
    song_name: string;
    length: string;
    genre: string;
    release_year: number;
    last_rating: number;
    last_rating_timestamp: string;
}

const SongsComponent:React.FC = () => {

  const navigate = useNavigate();

  const toast = useToast();
  const deleteSong = async (song_id: string) => {
    const apiUrl = "http://51.20.128.164/api/delete_song";
    try {
        console.log(song_id);
      await axios.post(apiUrl, { username: `${auth()?.username}`, song_id: song_id });
      toast({
        title: `Song successfully deleted!`,
        status: "success",
      })

    } catch (error) {
      console.error("Error deleting song:", error);
      toast({
        title: `Something went wrong while deleting the song. Please try again.`,
        status: "error",
      })
    }
  };

  const navigateArtist = async (artist_name: string) => {
    navigate(`/artist/${artist_name}`);
  }

    const navigateAlbum = async (album_name: string) => {
    navigate(`/album/${album_name}`);
    }
    const deleteRate = async (song_id: number) => {
        const apiUrl = "http://51.20.128.164/api/delete_song";
        try {
            console.log(song_id);
            await axios.post(apiUrl, { username: `${auth()?.username}`, song_id: song_id });
            toast({
                title: `Song successfully deleted!`,
                status: "success",
            })

        } catch (error) {
            console.error("Error deleting song:", error);
            toast({
                title: `Something went wrong while deleting the rates of the song. Please try again.`,
                status: "error",
            })
        }
    };

  //const [Liked, setLiked] = useState<SongsArray[]>([]);
  const [Posted, setPosted] = useState<SongsArray[]>([]);
  const [Rated, setRated] = useState<RatedArray[]>([]);
  const [ratings, setRatings] = useState<{ [songId: number]: number }>({});
  const [songRatings, setSongRatings] = useState<{ [songId: number]: number }>({});
  const [tabIndex, setTabIndex] = useState(0);

  const auth = useAuthUser();

  const SongDisplay = ({ song }: { song: SongsArray }) => {

      return (
        <Tr>
          <Td>{song.song_name}</Td>
          <Td>{song.length}</Td>
            <Td>
                {song.performer_name ? (
                    <Button onClick={() => navigateArtist(song.performer_name)}>
                        {song.performer_name}
                    </Button>
                ) : null}
            </Td>
            <Td>
                {song.album_name ? (
                    <Button onClick={() => navigateAlbum(song.album_name)}>
                        {song.album_name}
                    </Button>
                ) : null}
            </Td>
          <Td>{song.genre}</Td>
          <Td>{song.release_year}</Td>
          <Td><Timestamp date={song.added_timestamp} /></Td>
          <Td>
            <Button onClick={() => deleteSong(song.song_id)} colorScheme="red">
              <TbMusicX size={15}/> Delete Song
            </Button>
          </Td>
        </Tr>
    );
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

    const RateDisplay = ({ rated }: { rated: RatedArray }) => {
        const currentRating = songRatings[rated.song_id] || 0;

        const changeRating = (newRating: number) => {
            updateRating(rated.song_id, newRating);
        };

        return (
            <Tr>
                <Td>{rated.song_name}</Td>
                <Td>{rated.length}</Td>
                <Td>{rated.genre}</Td>
                <Td>{rated.release_year}</Td>
                <Td><Timestamp date={rated.last_rating_timestamp} /></Td>
                <Td>{rated.last_rating}/5</Td>
                <Td>
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
                </Td>
                <Td>
                    <Button onClick={() => deleteRate(rated.song_id)} colorScheme="red">
                        <IoIosRemoveCircle size={15}/>
                        Delete Ratings
                    </Button>
                </Td>
            </Tr>
        );
    };

    useEffect(() => {
      const getSongs = async () => {
        const apiUrl = "http://51.20.128.164/api/user_songs";
        try {
          const response = await axios.post(apiUrl, { username: `${auth()?.username}` });
          const data = response.data;
          setPosted(data);
        } catch (error) {
          console.log(error);
        }
      };

      const getRatings = async () => {
          const apiUrl = `http://51.20.128.164/api/user_song_ratings/${auth()?.username}`;
          try {
              const response = await axios.get(apiUrl);
              const data = response.data;
              const songObjects = data[`${auth()?.username}_song_ratings`];
              if (songObjects) {
                  setRated(songObjects);
              } else {
                  console.log("No song ratings found for the user");
              }
              setRated(data);
          } catch (error) {
              console.log(error);
          }
      };

        getSongs();
        getRatings();
    }, []);

    const sendRatings = async () => {

        for (const songId in ratings) {
            if (ratings.hasOwnProperty(songId)) {
                console.log(`Song ID: ${songId}, Rating: ${ratings[songId]}`);
            }
        }
    };

  return (
      <div className="relative flex flex-col items-center bg-[#F3F0F7] rounded-xl mx-20 p-8 overflow-x-auto">
          <Flex justifyContent="space-between" alignItems="flex-start" w="full">
              <Tabs variant='soft-rounded' colorScheme='blue' onChange={(index) => setTabIndex(index)}>
                  <Flex alignItems="center" mb={4}>
                      <TabList>
                          <Tab><FaStar size={20}/>Rated Songs</Tab>
                          <Tab><FaDatabase size={20}/>Added Songs</Tab>
                      </TabList>
                      <div className="px-80"></div>
                      {tabIndex === 0 && (
                          <Button colorScheme="green" onClick={sendRatings}><IoIosRefreshCircle size={20}/>Complete re-rating</Button>
                      )}
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
                                              <Th>Length</Th>
                                              <Th>Genre</Th>
                                              <Th>Release Year</Th>
                                              <Th>Last Rating</Th>
                                              <Th isNumeric>Last Rating Date</Th>
                                              <Th>Re-rate Song</Th>
                                              <Th></Th>
                                          </Tr>
                                      </Thead>
                                      <Tbody>
                                          {Rated.map(rated => <RateDisplay key={rated.song_id} rated={rated}/>)}
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
                                              <Th>Length</Th>
                                              <Th>Artist(s)</Th>
                                              <Th>Album</Th>
                                              <Th>Genre</Th>
                                              <Th isNumeric>Release Year</Th>
                                              <Th isNumeric>Post Date</Th>
                                              <Th></Th>
                                          </Tr>
                                      </Thead>
                                      <Tbody>
                                          {Posted.map(song => <SongDisplay key={song.song_id} song={song}/>)}
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
)
    ;
};


export default SongsComponent;
import React, {useEffect, useState} from 'react';
import {Tabs, TabList, TabPanels, Tab, TabPanel, Thead, Th, Td, Flex} from '@chakra-ui/react'
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

interface SongsArray {
    song_id: number;
    song_name: string;
    length: string;
    tempo: string;
    recording_type: string;
    listens: number;
    release_year: number;
    added_timestamp: string;
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

  const toast = useToast();
  const deleteSong = async (song_id: number) => {
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
                title: `Something went wrong while deleting the song. Please try again.`,
                status: "error",
            })
        }
    };

    const rateSong = async (song_id: number) => {
        const apiUrl = "http://51.20.128.164/api/delete_song";
        try {
            console.log(song_id);
            await axios.post(apiUrl, { username: `${auth()?.username}`, song_id: song_id });
            toast({
                title: `Song successfully re-rated!`,
                status: "success",
            })

        } catch (error) {
            console.error("Error rating song:", error);
            toast({
                title: `Something went wrong while deleting the song. Please try again.`,
                status: "error",
            })
        }
    };

  //const [Liked, setLiked] = useState<SongsArray[]>([]);
  const [Posted, setPosted] = useState<SongsArray[]>([]);
  const [Rated, setRated] = useState<RatedArray[]>([]);
  const [ratings, setRatings] = useState<{ [songId: number]: number }>({});
  const [songRatings, setSongRatings] = useState<{ [songId: number]: number }>({});

    const auth = useAuthUser();

  const SongDisplay = ({ song }: { song: SongsArray }) => {

      return (
        <Tr>
          <Td>{song.song_name}</Td>
          <Td>{song.length}</Td>
          <Td>{song.tempo}</Td>
          <Td>{song.recording_type}</Td>
          <Td isNumeric>{song.listens}</Td>
          <Td isNumeric>{song.release_year}</Td>
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

        getSongs();
    }, []);

    const sendRatings = () => {

        for (const songId in ratings) {
            if (ratings.hasOwnProperty(songId)) {
                console.log(`Song ID: ${songId}, Rating: ${ratings[songId]}`);
            }
        }
    };

  return (
      <div className="relative flex flex-col items-center bg-[#F3F0F7] rounded-xl mx-60 p-8">
          <Tabs variant='soft-rounded' colorScheme='blue'>
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Tabs variant='soft-rounded' colorScheme='blue'>
                      <TabList>
                          <Tab><FaStar size={20}/>Rated Songs</Tab>
                          <Tab><FaDatabase size={20}/>Added Songs</Tab>
                      </TabList>
                  </Tabs>
                  <Button colorScheme="green" onClick={sendRatings}><IoIosRefreshCircle size={20}/>Complete Re-rating</Button>
              </Flex>
              <TabPanels>
                  <TabPanel>
                      <div className="relative w-full flex flex-col items-center top-10 pb-8">
                          <div className="rounded-xl bg-white">
                              <TableContainer maxH="500px">
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
                              <TableContainer maxH="500px">
                                  <Table variant="simple" colorScheme='purple' size="lg">
                                      <Thead>
                                          <Tr>
                                              <Th>Song Name</Th>
                                              <Th>Length</Th>
                                              <Th>Tempo</Th>
                                              <Th>Recording Type</Th>
                                              <Th>Listens</Th>
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

      </div>

  );
};


export default SongsComponent;
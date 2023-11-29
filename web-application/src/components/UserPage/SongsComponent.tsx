import React, {useEffect, useState} from 'react';
import {Tabs, TabList, TabPanels, Tab, TabPanel, Thead, Th, Td} from '@chakra-ui/react'
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

const SongsComponent:React.FC = () => {

  const toast = useToast();
  const deleteSong = async (song_id: number) => {
    const apiUrl = "http://13.51.167.155/api/delete_song";
    try {
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

  //const [Liked, setLiked] = useState<SongsArray[]>([]);
  const [Posted, setPosted] = useState<SongsArray[]>([]);
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

    useEffect(() => {
      const getSongs = async () => {
        const apiUrl = "http://13.51.167.155/api/user_songs";
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

  return (
      <div className="pl-[150px] pr-[150px] pb-5 overflow-y-auto w-auto">
        <Tabs isFitted variant='enclosed'>
          <TabList>
            <Tab backgroundColor={"white"}><GoThumbsup size={20}/>Liked Songs</Tab>
            <Tab backgroundColor={"white"}><MdOutlineDataset size={20}/>Posted Songs</Tab>
          </TabList>
          <TabPanels backgroundColor={"white"}>
            <TabPanel>
                <TableContainer>
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
                            {Posted.map(song => <SongDisplay key={song.song_id} song={song} />)}
                        </Tbody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel>
              <TableContainer>
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
                    {Posted.map(song => <SongDisplay key={song.song_id} song={song} />)}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
  );
};

export default SongsComponent;
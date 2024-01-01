import {TableContainer, Table, Thead, Tr, Th, Tbody, Td, Heading} from '@chakra-ui/react'
import React, {useEffect, useState} from "react";
import {useAuthUser} from "react-auth-kit";
import axios from "axios";

interface Song {
    song_name: number;
    artist_name: string;
    album_name: string;
    genre: string;
    duration: string;
    year: number;
    origin_friend: string;
}

function FriendRecomsTable() {

    const [RecomSongs, setRecomSongs] = useState<Song[]>([]);
    const auth = useAuthUser();

    const RecomDisplaySong = ({song}: { song: Song }) => {
        return (
            <Tr>
                <Td>{song.song_name}</Td>
                <Td>{song.artist_name}</Td>
                <Td>{song.album_name}</Td>
                <Td>{song.genre}</Td>
                <Td>{song.duration}</Td>
                <Td>{song.year}</Td>
                <Td>{song.origin_friend}</Td>
            </Tr>
        );
    };

    useEffect(() => {
        const getRecomSongs = async () => {
            // The song recommendations API will come here.
            const apiUrl = "";
            try {
                const response = await axios.post(apiUrl, {username: `${auth()?.username}`});
                const data = response.data;
                setRecomSongs(data);
            } catch (error) {
                console.log(error);
            }
        };

        getRecomSongs();
    }, []);

    return (
        <div className="relative w-full flex flex-col items-center top-20 pb-8">
            <Heading as="h1" size="xl" color="white" align="center">
                Recommendations based on your Armonify Friends
            </Heading>
            <div className="pt-5"></div>
            <div className="rounded-xl bg-white">
                <TableContainer maxH="500px">
                    <Table variant="simple" colorScheme='purple' size="lg">
                        <Thead>
                            <Tr>
                                <Th>Song Name</Th>
                                <Th>Artist Name</Th>
                                <Th>Album Name</Th>
                                <Th>Genre</Th>
                                <Th>Duration</Th>
                                <Th>Year</Th>
                                <Th>Origin Friend</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {RecomSongs.map(song => <RecomDisplaySong key={song.song_name} song={song}/>)}
                        </Tbody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}


export default FriendRecomsTable;


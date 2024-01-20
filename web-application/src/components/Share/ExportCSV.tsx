import React, { useEffect, useState } from 'react';
import {Box, Button, Select, Tag, TagLabel, TagCloseButton, SimpleGrid, Flex, Center, useToast} from '@chakra-ui/react';
import { useAuthUser } from "react-auth-kit";
import useMemoizedFetch from "../../contexts/useMemoizedFetch";
import { TbFileTypeCsv } from "react-icons/tb";
import axios from "axios";

interface RatedArray {
    artist: string;
    album: string;
    song: string;
    song_rating: number;
    rating_timestamp: string;
}

const ExportCSV = () => {
    const [ratedArray, setRatedArray] = useState<RatedArray[]>([]);
    const [uniqueArtists, setUniqueArtists] = useState<string[]>([]);
    const [uniqueAlbums, setUniqueAlbums] = useState<string[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
    const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
    const auth = useAuthUser();
    const toast = useToast();
    const baseURL = "http://51.20.128.164/api"

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get(`${baseURL}/user_song_ratings/${auth()?.username}`);
                const property = `user_song_ratings`;
                setRatedArray(response.data[property]);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast({
                    title: "Error",
                    description: `${error}`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }

        fetch();
    }, []);

    useEffect(() => {
        const artists = new Set(ratedArray.map(song => song.artist));
        const albums = new Set(ratedArray.map(song => song.album));
        setUniqueArtists(Array.from(artists));
        setUniqueAlbums(Array.from(albums));
    }, [ratedArray]);

    const handleSelectArtist = (artist: string) => {
        if (!selectedArtists.includes(artist)) {
            setSelectedArtists(prev => [...prev, artist]);
        }
    };

    const handleSelectAlbum = (album: string) => {
        if (!selectedAlbums.includes(album)) {
            setSelectedAlbums(prev => [...prev, album]);
        }
    };

    const removeArtist = (artist: string) => {
        setSelectedArtists(prev => prev.filter(a => a !== artist));
    };

    const removeAlbum = (album: string) => {
        setSelectedAlbums(prev => prev.filter(a => a !== album));
    };

    const exportCSV = () => {
        const filteredSongs = ratedArray.filter(song =>
            (selectedArtists.length === 0 || selectedArtists.includes(song.artist)) &&
            (selectedAlbums.length === 0 || selectedAlbums.includes(song.album))
        );

        const headers = 'Song Name,Album Name,Performer Name, Timestamp\n';
        const rows = filteredSongs.map(song =>
            `${song.song},${song.album},${song.artist},${song.song_rating},${song.rating_timestamp}`
        ).join('\n');

        const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'songs.csv');
        document.body.appendChild(link);
        link.click();
    };

    return (
        <Box p={5}>
            <SimpleGrid columns={2} spacing={10}>
                {/* Artist Dropdown and Tags */}
                <Flex direction="column" align="start" gap={2}>
                    <Select
                        placeholder="Select Artist"
                        className="text-[#35517e]"
                        onChange={(e) => handleSelectArtist(e.target.value)}
                        style={{ width: '400px' }}
                    >
                        {uniqueArtists.map(artist => (
                            <option key={artist} value={artist}>{artist}</option>
                        ))}
                    </Select>
                    <Box>
                        {selectedArtists.map(artist => (
                            <Tag key={artist} size="md" borderRadius="full" variant="solid" colorScheme="blue" mr={2} mb={2}>
                                <TagLabel>{artist}</TagLabel>
                                <TagCloseButton onClick={() => removeArtist(artist)} />
                            </Tag>
                        ))}
                    </Box>
                </Flex>

                {/* Album Dropdown and Tags */}
                <Flex direction="column" align="start" gap={2}>
                    <Select
                        placeholder="Select Album"
                        className="text-[#35517e]"
                        onChange={(e) => handleSelectAlbum(e.target.value)}
                        style={{ width: '400px' }}
                    >
                        {uniqueAlbums.map(album => (
                            <option key={album} value={album}>{album}</option>
                        ))}
                    </Select>
                    <Box>
                        {selectedAlbums.map(album => (
                            <Tag key={album} size="md" borderRadius="full" variant="solid" colorScheme="green" mr={2} mb={2}>
                                <TagLabel>{album}</TagLabel>
                                <TagCloseButton onClick={() => removeAlbum(album)} />
                            </Tag>
                        ))}
                    </Box>
                </Flex>
            </SimpleGrid>

            {/* Export Button */}
            <Center mt={6}>
                <Button colorScheme="green" onClick={exportCSV}><TbFileTypeCsv size={20}/><div className="px-1"></div>Export Rating Data as .csv</Button>
            </Center>
        </Box>
    );

};

export default ExportCSV;
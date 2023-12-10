import { useEffect, useState } from 'react';
import {Box, Button, Select, Tag, TagLabel, TagCloseButton, SimpleGrid, Flex, Center} from '@chakra-ui/react';
import { useAuthUser } from "react-auth-kit";
import useMemoizedFetch from "../../contexts/useMemoizedFetch";
import { TbFileTypeCsv } from "react-icons/tb";

interface Song {
    song_photo: string | undefined;
    song_id: number;
    song_name: string;
    artist_name: string;
    album_name: string;
    genre: string;
    duration: string;
    year: number;
}

const RateCSV = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [uniqueArtists, setUniqueArtists] = useState<string[]>([]);
    const [uniqueAlbums, setUniqueAlbums] = useState<string[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
    const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
    const auth = useAuthUser();

    useEffect(() => {
        const fetchSongs = async () => {
            // const response = await axios.get('YOUR_API_ENDPOINT');
            // const fetchedSongs = response.data;
            const data = useMemoizedFetch("");
            // @ts-ignore
            const userSongs = data.filter(song => song.username === auth()?.username);
            setSongs(userSongs);

            // @ts-ignore
            const artists = new Set(fetchedSongs.map(song => song.artist_name));
            // @ts-ignore
            const albums = new Set(fetchedSongs.map(song => song.album_name));
            // @ts-ignore
            setUniqueArtists(Array.from(artists));
            // @ts-ignore
            setUniqueAlbums(Array.from(albums));
        };

        fetchSongs();
    }, [auth]);

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
        const filteredSongs = songs.filter(song =>
            (selectedArtists.length === 0 || selectedArtists.includes(song.artist_name)) &&
            (selectedAlbums.length === 0 || selectedAlbums.includes(song.album_name))
        );

        const headers = 'Song ID,Song Name,Artist Name,Album Name,Genre,Duration,Year\n';
        const rows = filteredSongs.map(song =>
            `${song.song_id},${song.song_name},${song.artist_name},${song.album_name},${song.genre},${song.duration},${song.year}`
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
                    <Select placeholder="Select Artist" className="text-white" onChange={(e) => handleSelectArtist(e.target.value)}>
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
                    <Select placeholder="Select Album" className="text-white" onChange={(e) => handleSelectAlbum(e.target.value)}>
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

export default RateCSV;
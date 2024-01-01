import React, {useState} from 'react';
import {Card, CardBody, Button, Text, CardFooter, HStack, Box, useToast} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { FaDatabase } from "react-icons/fa";
import axios, {AxiosError} from "axios";
import {useAuthUser} from "react-auth-kit";
import {StarIcon} from "@chakra-ui/icons";
import {AiTwotoneLike} from "react-icons/ai";
import {Avatar} from "flowbite-react";

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

interface SongSearchProps {
    songInfo: Song;
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

const SongSearch: React.FC<SongSearchProps> = ({songInfo }) => {
    const navigate = useNavigate();
    const auth = useAuthUser();
    const [error, setError] = useState("");
    const toast = useToast();

    const navigateArtist = (artistName: string) => {
        navigate(`/artist/${artistName}`);
    }

    const navigateAlbum = (albumName: string) => {
        navigate(`/album/${albumName}`);
    }

    const addToDatabase = async () => {
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

    return (
        <div>
            <Card className="w-[900px]" overflow='hidden' variant='outline'>
                <div className="flex items-center">
                    <Avatar img={songInfo.song_photo} size="xl" />
                    <CardBody>
                        <Text fontSize="xl" fontWeight="bold">{songInfo.song_name}</Text>
                        <Button onClick={() => navigateArtist(songInfo.artist_name)}>{songInfo.artist_name}</Button>
                        {songInfo.album_name && <Button onClick={() => navigateAlbum(songInfo.album_name)}>{songInfo.album_name}</Button>}
                        <HStack spacing={4}>
                            <Text py='2'>Length: {formatDuration(songInfo.length)}</Text>
                        </HStack>
                        <HStack spacing={4}>
                            <Text py='2'>Year: {songInfo.release_year || 'N/A'}</Text>
                            <Text py='2'>Genre: {songInfo.genre || 'N/A'}</Text>
                        </HStack>
                    </CardBody>
                    <CardFooter>
                        <Button
                            variant='solid'
                            colorScheme="orange"
                            onClick={addToDatabase}
                        >
                            <FaDatabase />
                            <div className="px-1"></div>
                            Add Song to Database
                        </Button>
                        <div className="px-2"></div>
                    </CardFooter>
                </div>
            </Card>
            <div className="py-2" ></div>
        </div>
    );
};

export default SongSearch;

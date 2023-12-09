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
    album_name: string | null;
    length: number | null
    tempo: number | null
    recording_type: string | null;
    listens: number | null;
    release_year: number | null;
}

interface SongSearchProps {
    songInfo: Song;
}

const SongSearch: React.FC<SongSearchProps> = ({songInfo }) => {
    const navigate = useNavigate();

    const navigateArtist = (artistName: string) => {
        navigate(`/artist/${artistName}`);
    }

    const navigateAlbum = (albumName: string) => {
        navigate(`/album/${albumName}`);
    }

    return (
        <Card className="w-[700px]" overflow='hidden' variant='outline'>
            <div className="flex items-center">
                <HStack spacing={4} className="flex-grow">
                    <CardBody>
                        <Avatar size="xl" img={songInfo.song_photo}/>
                        <Text py='2' className="font-lalezar">Followers: {songInfo.song_name}</Text>
                        <Button onClick={() => navigateArtist(songInfo.artist_name)}>{songInfo.artist_name}</Button>
                        <Button onClick={() => navigateAlbum(songInfo.song_name)} py='2' className="font-lalezar">Album: {songInfo.album_name}</Button>
                    </CardBody>
                </HStack>
            </div>
        </Card>
    );
};

export default SongSearch;

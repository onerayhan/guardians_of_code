import React, { useState } from 'react';
import { Card, CardBody, Button, Text, CardFooter, HStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {Avatar} from "flowbite-react";
interface Album {
    album_photo: string | undefined;
    album_id: number;
    album_name: string;
    artist_names: string[];
    release_year: number | null;
    genre: string | null;
}

interface AlbumSearchProps {
    albumInfo: Album;
}

const AlbumSearch: React.FC<AlbumSearchProps> = ({albumInfo }) => {
    const navigate = useNavigate();

    const navigateToAlbum = (albumName: string) => {
        navigate(`/album/${albumName}`);
    };

    return (
        <Card className="w-[700px]" overflow="hidden" variant="outline">
            <div className="flex items-center">
                <HStack spacing={4} className="flex-grow">
                    <CardBody>
                        <Avatar size="xl" img={albumInfo.album_photo}/>
                        <Button onClick={() => navigateToAlbum(albumInfo.album_name)}>{albumInfo.album_name}</Button>
                        <Text py="2">Artists: {albumInfo.artist_names.join(', ')}</Text>
                    </CardBody>
                </HStack>
            </div>
        </Card>
    );
};

export default AlbumSearch;
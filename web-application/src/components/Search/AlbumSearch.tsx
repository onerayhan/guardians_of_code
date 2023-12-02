import React, { useState } from 'react';
import { Card, CardBody, Button, Text, CardFooter, HStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaDatabase } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';
import { useAuthUser } from 'react-auth-kit';

interface Album {
    album_id: number;
    album_name: string;
    artist_names: string[];
    release_year: number | null;
    genre: string | null;
}

interface AlbumSearchProps {
    isInDb: boolean;
    isFound: boolean;
    albumInfo: Album;
}

const AlbumSearch: React.FC<AlbumSearchProps> = ({ isInDb, isFound, albumInfo }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [error, setError] = useState('');

    const handleAddAlbum = async (album: Album) => {
        const apiURL = 'http://13.51.167.155/api/add_album';
    };

    const navigateToAlbum = (albumName: string) => {
        navigate(`/album/${albumName}`);
    };

    if (!isFound) {
        return <div>Album not found</div>;
    }

    return (
        <Card className="w-[700px]" overflow="hidden" variant="outline">
            <div className="flex items-center">
                <HStack spacing={4} className="flex-grow">
                    <CardBody>
                        <Button onClick={() => navigateToAlbum(albumInfo.album_name)}>{albumInfo.album_name}</Button>
                        <Text py="2">Artists: {albumInfo.artist_names.join(', ')}</Text>
                        {/* Other album details */}
                    </CardBody>

                    <CardFooter>
                        {isInDb ? (
                            <Text>Album exists in the database</Text>
                        ) : (
                            <Button
                                variant="solid"
                                colorScheme="orange"
                                onClick={() => handleAddAlbum(albumInfo)}
                            >
                                <FaDatabase />
                                <div className="px-1"></div>
                                Add Album to the Database
                            </Button>
                        )}
                    </CardFooter>
                </HStack>
            </div>
        </Card>
    );
};

export default AlbumSearch;
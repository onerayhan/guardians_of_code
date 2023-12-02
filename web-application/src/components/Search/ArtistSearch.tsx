import React, { useState } from 'react';
import { Card, CardBody, Button, Text, CardFooter, HStack, Box, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaDatabase } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';
import { useAuthUser } from 'react-auth-kit';

interface ArtistSearchProps {
    isInDb: boolean;
    isFound: boolean;
    artistInfo: Artist;
}

interface Artist {
    artist_id: number;
    artist_name: string;
    genre: string | null;
    bio: string | null;
    followers: number | null;
    added_timestamp: string | null;
}

const getCurrentTimestamp = () => {
    // ... (same function as before)
};

const ArtistSearch: React.FC<ArtistSearchProps> = ({ isInDb, isFound, artistInfo }) => {
    const navigate = useNavigate();
    const auth = useAuthUser();
    const toast = useToast();
    const [error, setError] = useState('');

    const handleAddArtist = async (artist: Artist) => {
        const addedTimestamp = getCurrentTimestamp();

        try {
            await axios.post(
                'http://yourapiendpoint/api/add_artist',
                {
                    username: auth()?.username,
                    artist_name: artist.artist_name,
                    genre: artist.genre,
                    bio: artist.bio,
                    followers: artist.followers,
                    added_timestamp: addedTimestamp
                }
            );

        } catch (err) {
            // Error handling
        }
    };

    const navigateToArtist = (artistName: string) => {
        navigate(`/artist/${artistName}`);
    };

    if (!isFound) {
        return <div>Artist not found</div>;
    }

    return (
        <Card className="w-[700px]" overflow='hidden' variant='outline'>
            <HStack spacing={4} className="flex-grow">
                <CardBody>
                    <Button onClick={() => navigateToArtist(artistInfo.artist_name)}>{artistInfo.artist_name}</Button>
                    <Text py='2'>Genre: {artistInfo.genre}</Text>
                    <Text py='2'>Bio: {artistInfo.bio}</Text>
                    <Text py='2'>Followers: {artistInfo.followers}</Text>
                </CardBody>

                <CardFooter>
                    {isInDb ? (
                        <Text>Artist exists in the database</Text>
                    ) : (
                        <Button
                            variant='solid'
                            colorScheme='orange'
                            onClick={() => handleAddArtist(artistInfo)}
                        >
                            <FaDatabase />
                            <div className="px-1"></div>
                            Add Artist to the Database
                        </Button>
                    )}
                </CardFooter>
            </HStack>
        </Card>
    );
};

export default ArtistSearch;

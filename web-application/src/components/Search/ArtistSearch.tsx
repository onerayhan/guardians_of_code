import React, { useState } from 'react';
import { Card, CardBody, Button, Text, CardFooter, HStack, Box, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {Avatar} from "flowbite-react";

interface Artist {
    artist_photo: string | undefined;
    artist_id: number;
    artist_name: string;
    followers: number | null;
    popularity: number | null;
}

interface ArtistSearchProps {
    artistInfo: Artist;
}

const ArtistSearch: React.FC<ArtistSearchProps> = ({ artistInfo }) => {
    const navigate = useNavigate();

    const navigateToArtist = (artistName: string) => {
        navigate(`/artist/${artistName}`);
    };

    return (
        <Card className="w-[700px]" overflow='hidden' variant='outline'>
            <HStack spacing={4} className="flex-grow">
                <CardBody>
                    <Avatar size="xl" img={artistInfo.artist_photo}/>
                    <Button onClick={() => navigateToArtist(artistInfo.artist_name)}>{artistInfo.artist_name}</Button>
                    <Text py='2'>Popularity: {artistInfo.popularity}</Text>
                    <Text py='2'>Followers: {artistInfo.followers}</Text>
                </CardBody>
            </HStack>
        </Card>
    );
};

export default ArtistSearch;

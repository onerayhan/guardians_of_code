import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Stack, VStack, HStack, Text, Image, Badge, Button, useToast } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import axios from 'axios';

interface Single {
    id: number;
    title: string;
    year: string;
}

interface Album {
    id: number;
    title: string;
    year: string;
    cover: string;
    songs: Single[];
    rating: number; // Added rating field for albums
}

interface ArtistData {
    name: string;
    photoUrl: string; // URL to artist's photo
    albums: Album[];
    singles: Single[];
    artistRating: number; // Added rating field for artist
}

const AlbumCard = ({ album, onRateAlbum }: { album: Album, onRateAlbum: (albumId: number, rating: number) => void }) => {
    const [rating, setRating] = useState(album.rating);

    const handleRating = (newRating: number) => {
        setRating(newRating);
        onRateAlbum(album.id, newRating);
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={3} shadow="md">
            <Image src={album.cover} alt={album.title} borderRadius="md" />
            <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">{album.title}</Text>
            <Text mt={2}>{album.year}</Text>
            <Box display="flex">
                {[...Array(5)].map((_, i) => (
                    <StarIcon
                        key={i}
                        onClick={() => handleRating(i + 1)}
                        color={i < rating ? "yellow.400" : "gray.300"}
                        cursor="pointer"
                    />
                ))}
            </Box>
        </Box>
    );
};

const ArtistProfile = () => {
    const { artistName } = useParams<{ artistName: string }>();
    const [artistData, setArtistData] = useState<ArtistData | null>(null);
    const toast = useToast();

    useEffect(() => {
        // Fetch artist data from API
        axios.get<ArtistData>(`/api/artist/${artistName}`).then(response => {
            setArtistData(response.data);
        }).catch(error => {
            console.error("Error fetching artist data:", error);
        });
    }, [artistName]);

    const handleArtistRating = (rating: number) => {
        if (artistData) {
            // Update artist rating in the backend
            axios.post(`/api/artist/${artistName}/rate`, { rating })
                .then(() => {
                    setArtistData({ ...artistData, artistRating: rating });
                    toast({
                        title: "Artist rated successfully",
                        status: "success",
                        duration: 5000,
                        isClosable: true
                    });
                }).catch(error => {
                console.error("Error rating artist:", error);
                toast({
                    title: "Error rating artist!",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            });
        }
    };

    const handleAlbumRating = (albumId: number, rating: number) => {
        if (artistData) {
            // Update album rating in the backend
            axios.post(`/api/album/${albumId}/rate`, { rating })
                .then(() => {
                    const updatedAlbums = artistData.albums.map(album => {
                        if (album.id === albumId) {
                            return { ...album, rating };
                        }
                        return album;
                    });
                    setArtistData({ ...artistData, albums: updatedAlbums });
                    toast({
                        title: "Album rated successfully",
                        status: "success",
                        duration: 5000,
                        isClosable: true
                    });
                }).catch(error => {
                console.error("Error rating album:", error);
                toast({
                    title: "Error rating album!",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            });
        }
    };

    if (!artistData) {
        return <Text>Loading...</Text>;
    }

    return (
        <VStack spacing={8} align="stretch">
            <HStack spacing={6}>
                <Avatar size="xl" src={artistData.photoUrl} name={artistData.name} />
                <VStack align="start">
                    <Text fontSize="2xl">{artistData.name}</Text>
                    <Box display="flex">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon
                                key={i}
                                onClick={() => handleArtistRating(i + 1)}
                                color={i < artistData.artistRating ? "yellow.400" : "gray.300"}
                                cursor="pointer"
                            />
                        ))}
                    </Box>
                </VStack>
            </HStack>

            <VStack spacing={4}>
                <Text fontSize="2xl">Albums</Text>
                {artistData.albums.map(album => (
                    <AlbumCard key={album.id} album={album} onRateAlbum={handleAlbumRating} />
                ))}
            </VStack>

            <VStack spacing={2}>
                <Text fontSize="2xl">Singles</Text>
                {artistData.singles.map(single => (
                    <HStack key={single.id} spacing={4}>
                        <Text fontSize="lg">{single.title}</Text>
                        <Badge>{single.year}</Badge>
                    </HStack>
                ))}
            </VStack>
        </VStack>
    );
};

export default ArtistProfile;

import React, { useState } from 'react';
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import {
  TableContainer, Table, Thead, Tr, Th, Tbody, Td,
  Select, Button, Stack, Tag, TagLabel, TagCloseButton,
  Box, Flex, Heading
} from '@chakra-ui/react';
import GenreInput from "../Rating/GenreInput.tsx";
import ArtistInput from "../Rating/ArtistInput.tsx";
import AlbumInput from "../Rating/AlbumInput.tsx";

interface Song {
  song_name: string;
  artist_name: string;
  album_name: string;
  genre: string;
  duration: string;
  year: number;
  basis_of_recommendation: string;
}

function RecommendationsTable() {
  const [RecomSongs, setRecomSongs] = useState<Song[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
  const auth = useAuthUser();

  const removeGenre = (genreToRemove: string) => {
    setSelectedGenres(selectedGenres.filter(g => g !== genreToRemove));
  };

  const removeAlbum = (genreToRemove: string) => {
    setSelectedAlbums(selectedGenres.filter(g => g !== genreToRemove));
  };

  const getRecommendations = async () => {
    const apiUrl = "your-api-url"; // Replace with your API endpoint
    try {
      const response = await axios.post(apiUrl, {
        username: `${auth()?.username}`,
        genres: selectedGenres,
        albums: selectedAlbums
      });
      setRecomSongs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <Box>
        <Flex align="center" justify="center">
          <Box className="flex flex-col">
            <GenreInput/>
          </Box>

          <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
            {selectedGenres.map((tag, index) => (
                <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => removeGenre(tag)}/>
                </Tag>
            ))}
          </Stack>

          <div className="px-5"></div>

          <Box className="flex flex-col">
            <AlbumInput/>
          </Box>

          <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
            {selectedAlbums.map((tag, index) => (
                <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => removeAlbum(tag)}/>
                </Tag>
            ))}
          </Stack>

          <div className="px-10"></div>

          <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
            <Button colorScheme="facebook" onClick={getRecommendations}>
              Get Recommendations
            </Button>
          </Stack>

        </Flex>

        <div className="relative w-full flex flex-col items-center top-10 pb-8">
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
                    <Th>Basis of Recommendation</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {RecomSongs.map((song, index) => (
                      <Tr key={index}>
                        <Td>{song.song_name}</Td>
                        <Td>{song.artist_name}</Td>
                        <Td>{song.album_name}</Td>
                        <Td>{song.genre}</Td>
                        <Td>{song.duration}</Td>
                        <Td>{song.year}</Td>
                        <Td>{song.basis_of_recommendation}</Td>
                      </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </Box>
  );
}

export default RecommendationsTable;
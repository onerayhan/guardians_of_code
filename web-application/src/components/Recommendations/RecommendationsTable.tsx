import React, { useState } from 'react';
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import {
  TableContainer, Table, Thead, Tr, Th, Tbody, Td,
  Select, Button, Stack, Tag, TagLabel, TagCloseButton,
  Box, Flex, Heading
} from '@chakra-ui/react';

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
  const [genre, setGenre] = useState<string>('');
  const auth = useAuthUser();

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value);
  };

  const addGenre = () => {
    if (genre && !selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
      setGenre('');
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setSelectedGenres(selectedGenres.filter(g => g !== genreToRemove));
  };

  const getRecommendations = async () => {
    const apiUrl = "your-api-url"; // Replace with your API endpoint
    try {
      const response = await axios.post(apiUrl, {
        username: `${auth()?.username}`,
        genres: selectedGenres
      });
      setRecomSongs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h3" size="lg">Recommendations by Armonify</Heading>
          <Box>
            <Select placeholder="Select genre" value={genre} onChange={handleGenreChange} size="sm" mr={2}>
              {/* Genre options here */}
            </Select>
            <Button onClick={addGenre} size="sm" mr={2}>Add Genre</Button>
            <Button onClick={getRecommendations} size="sm" colorScheme="blue">Get Recommendations</Button>
          </Box>
        </Flex>

        <Stack spacing={4} direction="row" align="center" wrap="wrap" mb={4}>
          {selectedGenres.map((tag, index) => (
              <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => removeGenre(tag)} />
              </Tag>
          ))}
        </Stack>

        <TableContainer maxH="500px" overflowY="auto">
          <Table variant='striped' colorScheme='teal' size='lg'>
            <Thead className="sticky top-0 bg-[#081730]">
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
      </Box>
  );
}

export default RecommendationsTable;
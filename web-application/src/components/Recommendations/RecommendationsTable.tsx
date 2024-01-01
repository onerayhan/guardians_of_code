import React, {useEffect, useState} from 'react';
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import {
  TableContainer, Table, Thead, Tr, Th, Tbody, Td,
  Select, Button, Stack, Tag, TagLabel, TagCloseButton,
  Box, Flex, Heading, Input, RadioGroup, Radio
} from '@chakra-ui/react';
import GenreInput from "../Rating/GenreInput.tsx";
import ArtistInput from "../Rating/ArtistInput.tsx";
import AlbumInput from "../Rating/AlbumInput.tsx";
import {Avatar} from "flowbite-react";
import {FaDatabase} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

interface Track {
  track_name: string;
  album_name: string;
  artist_names: ArtistName[];
  popularity: number;
  track_id: string;
  track_release_year: string;
  track_duration_minutes: number;
  track_photo_urls: PhotoURL[];
  album_id: string;
  artist_ids: ArtistID[];
}

interface ArtistName {
  artist_name: string;
}

interface PhotoURL {
  photo_url: string;
}

interface ArtistID {
  artist_id: string;
}
function RecommendationsTable() {
  const [RecomSongsSpoti, setRecomSongsSpoti] = useState<Track[]>([]);
  const [RecomSongsArmonify, setRecomSongsArmonify] = useState<Track[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [genre, setGenre] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [recomType, setRecomType] = useState('1');
  const [spotiStatus, setSpotiStatus] = useState(false);
  const auth = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch_spoti_status = async () => {
      const apiUrl = `http://51.20.128.164/api/check_spoti_connection/${auth()?.username}`;
      try {
        const response = await axios.get(apiUrl);
        const data = response.data.check;
        setSpotiStatus(data);
      } catch (error) {
        console.log(error);
      }
    }

    const fetch_recom_songs = async () => {
      const apiUrl = `http://51.20.128.164/spoti/get_recommendations/${auth()?.username}`;
      const response = await axios.post(apiUrl, { seed_genres: selectedGenres, seed_artists: selectedArtists, seed_albums: selectedAlbums });
      const fetchedSongs = response.data;
      setRecomSongsSpoti(fetchedSongs);
    }

    fetch_spoti_status();

    switch (spotiStatus)
    {
      case true:
        fetch_recom_songs();
        break;
      case false:
        break;
    }
  }, [selectedArtists, selectedAlbums, selectedGenres]);

  const addSongToDB = async ({ song }: { song: Track }) => {
    const apiUrl = "http://51.20.128.164/api/add_song";
    try {
      const response = await axios.post(apiUrl, { username: `${auth()?.username}`, song_name: `${song.song_name}`, artist_name: `${song.artist_name}`, album_name: `${song.album_name}`, genre: `${song.genre}`, duration: `${song.duration}`, year: `${song.year}` });
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const navigateAlbum = (albumName: string, albumId: string) => {
    navigate(`/spoti/album/${albumName}`, { state: { albumId: albumId } });
  };

  const navigatePerformer = (artistName: string, artistId: string) => {
    navigate(`/spoti/artist/${artistName}`, { state: { artistId: artistId } });
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  const addGenre = () => {
    if (genre && !selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
      setGenre('');
    }
  };

  const handleArtistChange = (event) => {
    setArtist(event.target.value);
  };

  const addArtist = () => {
    if (genre && !selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedArtists, artist]);
      setArtist('');
    }
  };

  const handleAlbumChange = (event) => {
    setAlbum(event.target.value);
  };

  const addAlbum = () => {
    if (genre && !selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedAlbums, album]);
      setAlbum('');
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setSelectedGenres(selectedGenres.filter(g => g !== genreToRemove));
  };

  const removeArtist = (artistToRemove: string) => {
    setSelectedArtists(selectedArtists.filter(g => g !== artistToRemove));
  };

  const removeAlbum = (albumToRemove: string) => {
    setSelectedAlbums(selectedAlbums.filter(g => g !== albumToRemove));
  };

  return (
      <Box>
          <Heading as="h1" size="xl" color="white" align="center">
            Song Recommendations by Armonify
          </Heading>
        <Flex align="center" justify="center">
          {recomType === '2' ? (
              <Flex align="center" justify="center">

                {/* Genre Section */}
                <Box className="flex flex-col">
                  <Flex>
                    <Input
                        placeholder="Type Genre..."
                        value={genre}
                        onChange={handleGenreChange}
                        size="sm"
                        mr={2}
                        className="text-white"
                    />
                    <Button onClick={addGenre} size="sm">Add Genre</Button>
                  </Flex>
                  <Stack spacing={4} direction="row" align="center" wrap="wrap">
                    {selectedGenres.map((tag, index) => (
                        <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton onClick={() => removeGenre(tag)}/>
                        </Tag>
                    ))}
                  </Stack>
                </Box>
                <div className="px-5"></div>
                {/* Artist Section */}
                <Box className="flex flex-col">
                  <Flex>
                    <Input
                        placeholder="Type Artist..."
                        value={artist}
                        onChange={handleArtistChange}
                        size="sm"
                        mr={2}
                        className="text-white"
                    />
                    <Button onClick={addArtist} size="sm">Add Artist</Button>
                  </Flex>
                  <Stack spacing={4} direction="row" align="center" wrap="wrap">
                    {selectedArtists.map((tag, index) => (
                        <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton onClick={() => removeArtist(tag)}/>
                        </Tag>
                    ))}
                  </Stack>
                </Box>
                <div className="px-5"></div>
                {/* Album Section */}
                <Box className="flex flex-col">
                  <Flex>
                    <Input
                        placeholder="Type Album..."
                        value={album}
                        onChange={handleAlbumChange}
                        size="sm"
                        mr={2}
                        className="text-white"
                    />
                    <Button onClick={addAlbum} size="sm">Add Album</Button>
                  </Flex>
                  <Stack spacing={4} direction="row" align="center" wrap="wrap">
                    {selectedAlbums.map((tag, index) => (
                        <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue">
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton onClick={() => removeAlbum(tag)}/>
                        </Tag>
                    ))}
                  </Stack>
                </Box>

              </Flex>
          ) : (
              <></>
          )}

          <div className="px-5"></div>

        </Flex>
        <div className="relative w-full flex flex-col items-center top-10 pb-8">
          <div className="rounded-xl bg-white">
            <TableContainer maxH="500px">
              <Table variant="simple" colorScheme='purple' size="lg">
                <Thead>
                  <Tr>
                    <Th>Photo</Th>
                    <Th>Song Name</Th>
                    <Th>Artist Names</Th>
                    <Th>Album Name</Th>
                    <Th>Popularity</Th>
                    <Th>Duration</Th>
                    <Th>Year</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {RecomSongsSpoti.map((song, index) => (
                  <Tr key={index}>
                    <Td><Avatar img={song.track_photo_urls[0]?.photo_url} size="xl" /></Td>
                    <Td>{song.track_name}</Td>
                    <Td>
                      {
                        song.artist_names.map((artist, index) => (
                            <Button
                                key={index}
                                onClick={() => navigatePerformer(artist.artist_name, song.artist_ids[index].artist_id)}
                                variant="link"
                            >
                              {artist.artist_name}
                            </Button>
                        ))
                      }
                    </Td>
                    <Td><Button onClick={() => navigateAlbum(song.album_name, song.album_id)}>{song.album_name}</Button></Td>
                    <Td>{song.popularity}</Td>
                    <Td>{song.track_duration_minutes} minutes</Td>
                    <Td>{song.track_release_year}</Td>
                    <Td>
                      <Button
                          variant='solid'
                          colorScheme='yellow'
                          leftIcon={FaDatabase}
                          onClick={() => addSongToDB({song})}
                      >
                        Add to Database
                      </Button>
                    </Td>

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
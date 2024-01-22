import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Button,
    TableContainer,
} from '@chakra-ui/react';
import { useAuthUser } from 'react-auth-kit';
import AlbumSearch from './AlbumSearch';
import ArtistSearch from './ArtistSearch';
import SongSearch from './SongSearch';
import {FaSearch} from "react-icons/fa";

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

interface Artist {
    artist_photo: string | undefined;
    artist_id: number;
    artist_name: string;
    followers: number | null;
    popularity: number | null;
    genres: string | null;
    release_year: number | null;
}

interface Album {
    album_photo: string | undefined;
    album_id: number;
    album_name: string;
    artist_names: string[];
    release_year: number | null;
    genre: string | null;
}

const SpotifySearch = () => {
    const [searchType, setSearchType] = useState('track'); // Default search type
    const [searchTerm, setSearchTerm] = useState('');
    const [fetching_results, setFetchingResults] = useState(false);
    const [searchResults, setSearchResults] = useState<Song[] | Album[] | Artist[]>([]);
    const auth = useAuthUser();
    const [spoti_auth, setSpotiAuth] = useState(false);


    useEffect(() => {
        const fetch_spoti_status = async () => {
            const apiUrl = `http://51.20.128.164/api/check_spoti_connection/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const data = response.data.check;
                setSpotiAuth(data === "true");
            } catch (error) {
                console.log(error);
            }
        }

        fetch_spoti_status();
    }, []);

    useEffect(() => {
        setSearchResults([]);
    }, [searchType]);

    const fetchSearchResults = async (type, term) => {
        setFetchingResults(true);
        try {
            const response = await axios.post(`http://51.20.128.164/spoti/search/${auth()?.username}`, { type: [type], query: term });
            await responseParser(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            // Update UI or state to show error to user
        } finally {
            setFetchingResults(false);
        }
    };

    const get_genre_of_song = async (song_name) => {
        try {
            const response = await axios.post(`http://51.20.128.164/spoti/search/${auth()?.username}`, { type: ["artist"], query: song_name });
            return response.data.artists.items[0].genres[0];
        } catch (error) {
            console.error('Error fetching genre:', error);
            return '';
        }
    };

    async function processSongs(data) {
        const promises = data.tracks.items.map(async item => {
            const genre = await get_genre_of_song(item.artists[0].name);
            return {
                song_photo: item.album.images[0]?.url,
                song_id: item.id,
                song_name: item.name,
                artist_name: item.artists.map(artist => artist.name).join(', '),
                genre: genre,
                album_name: item.album.name,
                length: item.duration_ms,
                release_year: item.album.release_date ? parseInt(item.album.release_date.split('-')[0], 10) : null,
            };
        });

        return Promise.all(promises);
    }

    const responseParser = (data) => {
        if (searchType === 'track' && data.tracks) {
            processSongs(data).then(songs => setSearchResults(songs));
        } else if (searchType === 'album' && data.albums) {
            const albums = data.albums.items.map(item => ({
                album_photo: item.images[0]?.url,
                album_id: item.id,
                album_name: item.name,
                artist_names: item.artists.map(artist => artist.name),
                release_year: item.release_date,
            }));
            setSearchResults(albums);
        } else if (searchType === 'artist' && data.artists) {
            const artists = data.artists.items.map(item => ({
                artist_photo: item.images[2]?.url,
                artist_id: item.id,
                artist_name: item.name,
                followers: item.followers.total,
                popularity: item.popularity,
                genres: item.genres[0],
            }));
            setSearchResults(artists);
        }
    };

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="relative w-full flex flex-col items-center top-12">
            <h1 className="text-3xl font-lalezar text-white">Search Stuff to Add Them to the Database, Rate Them
                etc...</h1>
            <div className="flex items-center w-[900px] relative py-5">
                <select
                    name="searchType"
                    className="form-select mr-2 rounded-xl w-1/4 h-12 pl-4 pr-10 text-black text-opacity-80"
                    onChange={handleSearchTypeChange}
                    value={searchType}
                >
                <option value="track">Song</option>
                    <option value="album">Album</option>
                    <option value="artist">Artist</option>
                </select>

                <input
                    type="text"
                    className="w-full h-12 pl-4 pr-10 text-black text-opacity-80 rounded-xl"
                    placeholder="Enter your search..."
                    onChange={handleSearchTermChange}
                />

                <div className="px-1"></div>

                <Button
                    isDisabled={!spoti_auth}
                    isLoading={spoti_auth && fetching_results}
                    borderRadius='10px'
                    colorScheme="blue"
                    h={12}
                    w={32}
                    onClick={() => {
                        setFetchingResults(true);
                        fetchSearchResults(searchType, searchTerm).then(() => setFetchingResults(false));
                    }}
                    leftIcon={<FaSearch />}
                >
                    Search
                </Button>
            </div>

            <TableContainer>
                {fetching_results ? (
                    <></>
                ) : (
                    searchResults.map((item, index) => {
                        if (searchType === 'track') {
                            return <SongSearch key={index} songInfo={item} />;
                        } else if (searchType === 'artist') {
                            return <ArtistSearch key={index} artistInfo={item} />;
                        } else if (searchType === 'album') {
                            return <AlbumSearch key={index} albumInfo={item} />;
                        }
                        return null;
                    })
                )}
            </TableContainer>

        </div>
    );
};

export default SpotifySearch;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TableContainer } from '@chakra-ui/react';
import { useAuthUser } from 'react-auth-kit';
import AlbumSearch from './AlbumSearch';
import ArtistSearch from './ArtistSearch';
import SongSearch from './SongSearch';

interface Song {
    song_photo: string | undefined;
    song_id: number;
    song_name: string;
    artist_name: string;
    album_name: string;
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
    const [searchResults, setSearchResults] = useState<Song[] | Album[] | Artist[]>([]);
    const auth = useAuthUser();

    useEffect(() => {
        if (searchTerm) {
            fetchSearchResults(searchType, searchTerm);
        }
    }, [searchType, searchTerm]);

    async function fetchSearchResults(type, term) {
        try {
            const response = await axios.post(`http://51.20.128.164/spoti/search/${auth()?.username}`, { type, query: term });
            responseParser(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            // Handle error appropriately in your UI
        }
    }

    const responseParser = (data) => {
        if (searchType === 'track' && data.tracks) {
            const songs = data.tracks.items.map(item => ({
                song_photo: item.album.images[0]?.url,
                song_id: item.id,
                song_name: item.name,
                artist_name: item.artists.map(artist => artist.name).join(', '),
                album_name: item.album.name,
                length: item.duration_ms,
                release_year: item.album.release_date ? parseInt(item.album.release_date.split('-')[0], 10) : null,
            }));
            setSearchResults(songs);
        } else if (searchType === 'album' && data.albums) {
            const albums = data.albums.items.map(item => ({
                album_photo: item.images[0]?.url,
                album_id: item.id,
                album_name: item.name,
                artist_names: item.artists.map(artist => artist.name),
                release_year: item.release_date,
                genre: item.genres[0],
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
            <h1 className="text-3xl font-lalezar text-white">Search Stuff to Add Them to the Database, Rate Them etc...</h1>
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
            </div>

            <TableContainer>
                {searchResults.map((item, index) => {
                    if (searchType === 'track') {
                        return <SongSearch key={index} songInfo={item} />;
                    } else if (searchType === 'artist') {
                        return <ArtistSearch key={index} artistInfo={item} />;
                    } else if (searchType === 'album') {
                        return <AlbumSearch key={index} albumInfo={item} />;
                    }
                    return null;
                })}
            </TableContainer>
        </div>
    );
};

export default SpotifySearch;

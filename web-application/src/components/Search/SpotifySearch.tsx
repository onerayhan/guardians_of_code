import React, {useEffect, useState} from 'react';
import { Formik, Form, Field } from 'formik';
import AlbumSearch from "./AlbumSearch";
import ArtistSearch from "./ArtistSearch";
import SongSearch from "./SongSearch";
import axios from "axios";
import {TableContainer} from "@chakra-ui/react";
import {useAuthUser} from "react-auth-kit";

interface Artist {
    artist_photo: string | undefined;
    artist_id: number;
    artist_name: string;
    followers: number | null;
    popularity: number | null;
}

interface Album {
    album_photo: string | undefined;
    album_id: number;
    album_name: string;
    artist_names: string[];
    release_year: number | null;
    genre: string | null;
}

interface Song {
    song_photo: string | undefined;
    song_id: number;
    song_name: string;
    artist_name: string;
    album_name: string | null;
    length: number | null
    tempo: number | null
    recording_type: string | null;
    listens: number | null;
    release_year: number | null;
}

const SpotifySearch: React.FC = () => {
    const [searchType, setSearchType] = useState('tracks'); // Default search type
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Song[] | Artist[] | Album[]>([]);
    const auth = useAuthUser();

    // Listen to the
    useEffect(() => {
        if (searchTerm) {
            fetchSearchResults(searchType, searchTerm);
        }
    }, [searchType, searchTerm]);

    async function fetchSearchResults(type: string, term: string) {
        const response = await axios.post(`http://51.20.128.164/api/display_user_group/${auth()?.username}`, { type: type, query: term });
        responseParser(response.data);
    }

    const handleSearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchType(event.target.value);
    };

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const responseParser = (data: any) => {
        switch (searchType) {
            case 'tracks':
                const songs = data.tracks.items.map((item: any) => ({
                    song_photo: item.album.images[0].url,
                    song_id: item.id,
                    song_name: item.name,
                    artist_name: item.artists.map((artist: any) => artist.name).join(", "),
                    album_name: item.album.name,
                    length: item.duration_ms,
                }));
                setSearchResults(songs)
                break;
            case 'album':
                const albums = data.albums.items.map((item: any) => ({
                    album_photo: item.images[0].url,
                    album_id: item.id,
                    album_name: item.name,
                    artist_names: item.artists.map((artist: any) => artist.name),
                    release_year: item.release_date,
                    genre: item.genres[0]
                }));
                setSearchResults(albums);
                break;
            case 'performer':
                const artists = data.artists.items.map((item: any) => ({
                    artist_photo: item.images[0].url,
                    artist_id: item.id,
                    artist_name: item.name,
                    followers: item.followers.total,
                    popularity: item.popularity
                }));
                setSearchResults(artists);
                break;
            default :
                console.log("Error: Invalid search type");
        }
    }

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
                    <option value="tracks">Song</option>
                    <option value="albums">Album</option>
                    <option value="performer">Performer</option>
                </select>

                <input
                    type="text"
                    className="w-full h-12 pl-4 pr-10 text-black text-opacity-80 rounded-xl"
                    placeholder="Enter your search..."
                    onChange={handleSearchTermChange}
                />
            </div>

            <TableContainer maxH="1000px">
                {searchType === 'song' && Array.isArray(searchResults) && searchResults.map((item, index) => {
                    if (searchType === 'song') {
                        return <SongSearch key={index} songInfo={item as Song} />;
                    }
                    return null;
                })}
                {searchType === 'performer' && Array.isArray(searchResults) && searchResults.map((item, index) => {
                    if (searchType === 'performer') {
                        return <ArtistSearch key={index} artistInfo={item as Artist} />;
                    }
                    return null;
                })}
                {searchType === 'album' && Array.isArray(searchResults) && searchResults.map((item, index) => {
                    if (searchType === 'album') {
                        return <AlbumSearch key={index} albumInfo={item as Album} />;
                    }
                    return null;
                })}
            </TableContainer>
        </div>
    );
};

export default SpotifySearch;

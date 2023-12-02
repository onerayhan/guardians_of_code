import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { FaSearch } from "react-icons/fa";
import AlbumSearch from "./AlbumSearch";
import ArtistSearch from "./ArtistSearch";
import SongSearch from "./SongSearch";

// Interfaces for Song, Artist, Album and their Props
// ... (Define your Song, Artist, Album interfaces here)

interface Song {
    song_id: number;
    song_name: string;
    artist_name: string;
    album_name: string | null;
    length: number | null
    tempo: number | null
    recording_type: string | null;
    listens: number | null;
    release_year: number | null;
    added_timestamp: string | null;
}

interface Artist {
    artist_id: number;
    artist_name: string;
    genre: string | null;
    bio: string | null;
    followers: number | null;
    added_timestamp: string | null;
}

interface Album {
    album_id: number;
    album_name: string;
    artist_names: string[];
    release_year: number | null;
    genre: string | null;
    added_timestamp: string | null;
}

interface SongSearchProps {
    isInDb: boolean;
    isFound: boolean;
    songInfo: Song;
}

interface ArtistSearchProps {
    isInDb: boolean;
    isFound: boolean;
    artistInfo: Artist;
}

interface AlbumSearchProps {
    isInDb: boolean;
    isFound: boolean;
    albumInfo: Album;
}

const SpotifySearch: React.FC = () => {
    const [searchType, setSearchType] = useState('song'); // Default search type

    // Initial states for each search type
    const initialSongState: SongSearchProps = {
        isInDb: false,
        isFound: false,
        songInfo: {
            song_id: 0,
            song_name: "",
            artist_name: "",
            album_name: "",
            length: 0,
            tempo: 0,
            recording_type: "",
            listens: 0,
            release_year: 0,
            added_timestamp: ""
        }
    };
    const initialArtistState: ArtistSearchProps = {
        isInDb: false,
        isFound: false,
        artistInfo: {
            artist_id: 0,
            artist_name: "",
            genre: "",
            bio: "",
            followers: 0,
            added_timestamp: ""
        }
    };
    const initialAlbumState: AlbumSearchProps = {
        isInDb: false,
        isFound: false,
        albumInfo: {
            album_id: 0,
            album_name: "",
            artist_names: [],
            release_year: 0,
            genre: "",
            added_timestamp: ""
        }
    };

    const [songProp, setSongProp] = useState<SongSearchProps>(initialSongState);
    const [artistProp, setArtistProp] = useState<ArtistSearchProps>(initialArtistState);
    const [albumProp, setAlbumProp] = useState<AlbumSearchProps>(initialAlbumState);

    // Example fetch function
    async function fetchSearchResults(type: string, term: string) {
        // Replace with actual fetching logic
        // For example, setSongProp, setArtistProp, or setAlbumProp based on the fetch results
    }

    const handleSearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchType(event.target.value);
    };

    const handleSearchSubmit = async (values: any) => {
        console.log("Searching for a " + searchType + ": " + values.searchTerm);
        await fetchSearchResults(searchType, values.searchTerm);
    };

    return (
        <div className="relative w-full flex flex-col items-center top-12">
            <h1 className="text-3xl font-lalezar text-white">Search Stuff to Add Them to the Database, Rate Them etc...</h1>
            <Formik
                initialValues={{ searchTerm: '' }}
                onSubmit={handleSearchSubmit}
            >
                {({ values, handleChange }) => (
                    <Form className="flex items-center w-[900px] relative py-5">
                        <select
                            name="searchType"
                            className="form-select mr-2 rounded-xl w-1/4 h-12 pl-4 pr-10 text-black text-opacity-80"
                            onChange={handleSearchTypeChange}
                            value={searchType}
                        >
                            <option value="song">Song</option>
                            <option value="album">Album</option>
                            <option value="performer">Performer</option>
                        </select>

                        <Field
                            name="searchTerm"
                            className="w-full h-12 pl-4 pr-10 text-black text-opacity-80 rounded-xl"
                            placeholder="Enter your search..."
                            onChange={handleChange}
                        />

                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white font-bold py-2 px-4 rounded-3xl"
                        >
                            <FaSearch size={25}/>
                        </button>
                    </Form>
                )}
            </Formik>

            {searchType === 'song' && <SongSearch {...songProp} />}
            {searchType === 'performer' && <ArtistSearch {...artistProp} />}
            {searchType === 'album' && <AlbumSearch {...albumProp} />}
        </div>
    );
};

export default SpotifySearch;

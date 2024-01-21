import {useEffect, useState} from 'react';
import {
    Table,
    TableContainer,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Box,
    Flex,
    Select,
    VStack
} from '@chakra-ui/react';
import axios from "axios";
import {useAuthUser} from "react-auth-kit";

interface RatedSongArray {
    artist: string;
    album: string;
    song: string;
    release_year: number;
    song_rating: number;
    rating_timestamp: string;
}

interface RatedAlbumArray {
    album: string;
    rating: number;
    rating_timestamp: string;
}

interface RatedArtistArray {
    performer: string;
    rating: number;
    rating_timestamp: string;
}

interface genrePref {
    genre: string;
    count: string;
}

interface artistPref {
    performer: string;
    count: string;
}

interface albumPref {
    album: string;
    count: string;
}

const MainTable = () => {
    const [mainSelection, setMainSelection] = useState('');
    const [ratedSongs, setRatedSongs] = useState<RatedSongArray[]>([]);
    const [ratedAlbums, setRatedAlbums] = useState<RatedAlbumArray[]>([]);
    const [ratedArtists, setRatedArtists] = useState<RatedArtistArray[]>([]);

    const [genrePrefs, setGenrePrefs] = useState<genrePref[]>([]);
    const [artistPrefs, setArtistPrefs] = useState<artistPref[]>([]);
    const [albumPrefs, setAlbumPrefs] = useState<albumPref[]>([]);

    const [decade, setDecade] = useState("60s");
    const [rateType, setRateType] = useState('');

    const auth = useAuthUser();

    const calculateEra = (song: RatedSongArray) => {
        const year = song.release_year;
        if (year >= 1960 && year < 1970) return '60s';
        if (year >= 1970 && year < 1980) return '70s';
        if (year >= 1980 && year < 1990) return '80s';
        if (year >= 1990 && year < 2000) return '90s';
        if (year >= 2000 && year < 2010) return '2000s';
        if (year >= 2010 && year < 2024) return '2010s';
        return '';
    }

    // filter songs by decade
    const filterSongsByDecade = (songs: any[]) => {
        if (decade === '') return songs;
        return songs.filter(song => calculateEra(song) === decade);
    }

    const calculateAverageSongRatings = (songs) => {
        const songDetails = {}; // Store details for each song

        songs.forEach(({ song, album, artist, song_rating, release_year }) => {
            if (!songDetails[song]) {
                songDetails[song] = { totalRating: 0, count: 0, album, artist, release_year: 0 };
            }
            songDetails[song].totalRating += song_rating;
            songDetails[song].count += 1;
            songDetails[song].release_year = release_year;
        });

        return Object.keys(songDetails).map(song => ({
            song,
            album: songDetails[song].album,
            artist: songDetails[song].artist,
            release_year: songDetails[song].release_year,
            averageRating: songDetails[song].totalRating / songDetails[song].count,
        }));
    };

    const calculateAverageAlbumRatings = (albums) => {
        const albumDetails = {};

        albums.forEach(({ album, rating }) => {
            if (!albumDetails[album]) {
                albumDetails[album] = { totalRating: 0, count: 0 };
            }
            albumDetails[album].totalRating += rating;
            albumDetails[album].count += 1;
        });

        return Object.keys(albumDetails).map(album => ({
            album,
            averageRating: albumDetails[album].totalRating / albumDetails[album].count
        }));
    };

    const calculateAverageArtistRatings = (artists) => {
        const artistDetails = {};

        artists.forEach(({ performer, rating }) => {
            if (!artistDetails[performer]) {
                artistDetails[performer] = { totalRating: 0, count: 0 };
            }
            artistDetails[performer].totalRating += rating;
            artistDetails[performer].count += 1;
        });

        return Object.keys(artistDetails).map(performer => ({
            performer,
            averageRating: artistDetails[performer].totalRating / artistDetails[performer].count
        }));
    };

    const averageAlbumRatings = calculateAverageAlbumRatings(ratedAlbums);
    const averageArtistRatings = calculateAverageArtistRatings(ratedArtists);
    const averageSongRatings = calculateAverageSongRatings(ratedSongs);

    useEffect(() => {
        const fetchGenrePrefs = async () => {
            const apiUrl = `http://51.20.128.164/api/user_genre_preference/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const property = "genres";

                if (response.data[property] === undefined) {
                    setGenrePrefs([]);
                    return;
                }

                setGenrePrefs(response.data[property]);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchAlbumPrefs = async () => {
            const apiUrl = `http://51.20.128.164/api/user_album_preference/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const property = "albums";

                if (response.data[property] === undefined) {
                    setAlbumPrefs([]);
                    return;
                }

                setAlbumPrefs(response.data[property]);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchPerformerPrefs = async () => {
            const apiUrl = `http://51.20.128.164/api/user_performer_preference/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const property = "performers";

                if (response.data[property] === undefined) {
                    setArtistPrefs([]);
                    return;
                }

                setArtistPrefs(response.data[property]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchGenrePrefs();
        fetchAlbumPrefs();
        fetchPerformerPrefs();
    }, []);

    useEffect(() => {
        const songUserRatings = async () => {
            const apiUrl = `http://51.20.128.164/api/user_song_ratings/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const property = "user_song_ratings";

                if (response.data[property] === undefined) {
                    setRatedSongs([]);
                    return;
                }

                setRatedSongs(response.data[property]);
            } catch (error) {
                console.log(error);
            }
        };

        const albumUserRatings = async () => {
            const apiUrl = `http://51.20.128.164/api/user_album_ratings/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const property = "user_album_ratings";

                if (response.data[property] === undefined) {
                    setRatedAlbums([]);
                    return;
                }

                setRatedAlbums(response.data[property]);
            } catch (error) {
                console.log(error);
            }
        };

        const performerUserRatings = async () => {
            const apiUrl = `http://51.20.128.164/api/user_performer_ratings/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const property = "user_performer_ratings";

                if (response.data[property] === undefined) {
                    setRatedArtists([]);
                    return;
                }

                setRatedArtists(response.data[property]);
            } catch (error) {
                console.log(error);
            }
        };

        songUserRatings();
        albumUserRatings();
        performerUserRatings();
    }, []);

    const getTableCaption = () => {
        if (mainSelection === 'era') {
            return `Best Songs of the ${decade}`;
        } else if (mainSelection === 'rating') {
            let type = '';
            switch (rateType) {
                case 'artist': type = 'Artist'; break;
                case 'track': type = 'Song'; break;
                case 'album': type = 'Album'; break;
                default: type = ''; break;
            }
            return `Best Avg. ${type} Ratings`;
        } else if (mainSelection === 'genre-prefs') {
            return `Genre Preferences`;
        }
        else if (mainSelection === 'album-prefs') {
            return `Album Preferences`;
        }
        else if (mainSelection === 'artist-prefs') {
            return `Artist Preferences`;
        }
        return '';
    };

    const getTableHeaders = () => {
        switch (mainSelection) {
            case 'rating':
                switch (rateType) {
                    case 'artist': return (<><Th>Artist</Th><Th isNumeric>Rating Average</Th></>);
                    case 'album': return (<><Th>Album</Th><Th isNumeric>Rating Average</Th></>);
                    case 'track': return (<><Th>Song</Th><Th>Album</Th><Th>Artist</Th><Th isNumeric>Rating Average</Th></>);
                    default: break;
                }
                break;
            case 'era':
                return (<><Th>Song</Th><Th>Album</Th><Th>Artist</Th><Th>Release Year</Th><Th isNumeric>Rating Average</Th></>);
            case 'genre-prefs':
                return (<><Th>Genre</Th><Th isNumeric>Count</Th></>);
            case 'album-prefs':
                return (<><Th>Album</Th><Th isNumeric>Count</Th></>);
            case 'artist-prefs':
                return (<><Th>Artist</Th><Th isNumeric>Count</Th></>);
            default:
                return (<></>);
        }
    };

    const renderAlbumRatingTableRows = () => {
        return averageAlbumRatings.map((album, index) => (
            <Tr key={index}>
                <Td>{album.album}</Td>
                <Td isNumeric>{album.averageRating.toFixed(2)}</Td>
            </Tr>
        ));
    };

    const renderArtistRatingTableRows = () => {
        return averageArtistRatings.map((artist, index) => (
            <Tr key={index}>
                <Td>{artist.performer}</Td>
                <Td isNumeric>{artist.averageRating.toFixed(2)}</Td>
            </Tr>
        ));
    };

    const renderTrackRatingTableRows = () => {
        return averageSongRatings.map((song, index) => (
            <Tr key={index}>
                <Td>{song.song}</Td>
                <Td>{song.album}</Td>
                <Td>{song.artist}</Td>
                <Td isNumeric>{song.averageRating.toFixed(2)}</Td>
            </Tr>
        ));
    };

    const renderEraTableRows = () => {
        return filterSongsByDecade(averageSongRatings).map((song, index) => (
                <Tr key={index}>
                    <Td>{song.song}</Td>
                    <Td>{song.album}</Td>
                    <Td>{song.artist}</Td>
                    <Td isNumeric>{Number(song.release_year)}</Td>
                    <Td isNumeric>{song.averageRating.toFixed(2)}</Td>
                </Tr>
            )
        );
    };

    const renderRatingTableRows = () => {
        switch (rateType) {
            case 'artist': return renderArtistRatingTableRows();
            case 'album': return renderAlbumRatingTableRows();
            case 'track': return renderTrackRatingTableRows();
            default: break;
        }
    }

    const renderGenrePrefRows = () => {
        return genrePrefs.map((pref, index) => (
            <Tr key={index}>
                <Td>{pref.genre}</Td>
                <Td isNumeric>{pref.count}</Td>
            </Tr>
        ));
    };

    const renderAlbumPrefRows = () => {
        return albumPrefs.map((pref, index) => (
            <Tr key={index}>
                <Td>{pref.album}</Td>
                <Td isNumeric>{pref.count}</Td>
            </Tr>
        ));
    };

    const renderArtistPrefRows = () => {
        return artistPrefs.map((pref, index) => (
            <Tr key={index}>
                <Td>{pref.performer}</Td>
                <Td isNumeric>{pref.count}</Td>
            </Tr>
        ));
    };

    const renderTableRows = () => {
        switch (mainSelection) {
            case 'era':
                return renderEraTableRows();
            case 'rating':
                return renderRatingTableRows();
            case 'genre-prefs':
                return renderGenrePrefRows();
            case 'album-prefs':
                return renderAlbumPrefRows();
            case 'artist-prefs':
                return renderArtistPrefRows();
        }
    };

    const handleMainSelectionChange = (e) => {
        setMainSelection(e.target.value);
        setDecade('');
    };

    const handleDecadeChange = (e) => {
        setDecade(e.target.value);
    };

    useEffect(() => {
        console.log("Updated decade:", decade);
        // Any other logic that depends on the updated value of 'decade'
    }, [decade]); // The useEffect hook runs when 'decade' changes

    const handleTypeChange = (e) => {
        setRateType(e.target.value);
    };

    return (
        <>
            <VStack>
                <h1 className="text-5xl font-lalezar text-[#35517e]">Your Tables</h1>
                <h1 className="text-2xl font-lalezar text-[#35517e]">Please select the data that you want to analyze.</h1>
                <Flex direction="row" align="center" justify="center">
                    <Select onChange={handleMainSelectionChange} placeholder="Select Option" mr={2} className="text-[#35517e]">
                        <option value="era">Best Songs By Era</option>
                        <option value="rating">Best Avg. Ratings</option>
                        <option value="genre-prefs">Genre Preferences</option>
                        <option value="album-prefs">Album Preferences</option>
                        <option value="artist-prefs">Artist Preferences</option>
                        {/* Add other main options here */}
                    </Select>

                    {mainSelection === 'era' && (
                        <Select onChange={handleDecadeChange} className="text-[#35517e]">
                            <option value="">All Decades</option>
                            <option value="60s">60s</option>
                            <option value="70s">70s</option>
                            <option value="80s">80s</option>
                            <option value="90s">90s</option>
                            <option value="2000s">2000s</option>
                            <option value="2010s">2010s</option>
                        </Select>
                    )}

                    {mainSelection === 'rating' && (
                        <Select onChange={handleTypeChange} placeholder="Select Option" className="text-[#35517e]">
                            <option value="artist">Artist Ratings</option>
                            <option value="track">Song Ratings</option>
                            <option value="album">Album Ratings</option>
                        </Select>
                    )}

                </Flex>
                <div className="py-5"></div>
            </VStack>
            <Box bg='white' w='900px' p={4} color='black' rounded="xl">
                <TableContainer>
                    <Table variant='simple'>
                        <TableCaption>{getTableCaption()}</TableCaption>
                        <Thead>
                            <Tr>
                                {getTableHeaders()}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {renderTableRows()}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <div className="py-5"></div>
        </>
    );

};

export default MainTable;

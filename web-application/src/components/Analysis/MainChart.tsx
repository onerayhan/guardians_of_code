import React, { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { VStack, Flex, Select } from '@chakra-ui/react';
import { useAuthUser } from 'react-auth-kit';
import axios from 'axios';
import ThreeDPlot from "./3DPlot.tsx";
import { format } from 'date-fns'; // or use moment.js or similar

interface groupProps {
    groupName: string;
    group_members: string[];
    groupID: number;
}

interface SongRating {
    album: string;
    artist: string;
    external_service_id: number | null;
    genre: string | null;
    rating_timestamp: string;
    song: string;
    song_id: number;
    song_rating: number;
    username: string;
}

interface AlbumRating {
    album: string;
    rating_timestamp: string;
    rating: number;
}

interface ArtistRating {
    performer: string;
    rating_timestamp: string;
    rating: number;
}

interface albumRatingGroup {
    album: string;
    rating_timestamp: string;
    album_rating: number;
    username: string;
}

interface artistRatingGroup {
    performer: string;
    rating_timestamp: string;
    performer_rating: number;
    username: string;
}

interface genrePref {
    genre: string;
    count: number;
}

interface albumPref {
    album: string;
    count: number;
}

interface artistPref {
    performer: string;
    count: number;
}

interface ProcessedData {
    [key: string]: {
        x: string[];
        y: number[];
        name: string;
    };
}

const MainChart: React.FC = () => {
    const [selectedChart, setSelectedChart] = useState<string>('default');
    const [selectedSubOption, setSelectedSubOption] = useState<string>('');
    const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>('');
    const [songData, setSongData] = useState<SongRating[]>([]);
    const [albumData, setAlbumData] = useState<AlbumRating[]>([]);
    const [artistData, setArtistData] = useState<ArtistRating[]>([]);
    const [songDataGroup, setSongDataGroup] = useState<SongRating[]>([]);
    const [albumDataGroup, setAlbumDataGroup] = useState<albumRatingGroup[]>([]);
    const [artistDataGroup, setArtistDataGroup] = useState<artistRatingGroup[]>([]);
    const [groups, setGroups] = useState<groupProps[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<number>(0);

    const [genrePref, setGenrePref] = useState<genrePref[]>([]);
    const [albumPref, setAlbumPref] = useState<albumPref[]>([]);
    const [artistPref, setArtistPref] = useState<artistPref[]>([]);

    const auth = useAuthUser();

    const generateColor = (index, total) => {
        const hue = (index * 360) / total;
        return `hsl(${hue}, 100%, 50%)`;
    };

    const handleChartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedChart(e.target.value);
        setSelectedSubOption('');
        setSelectedTimeFrame('');
    };

    const handleSubOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubOption(e.target.value);
    };

    const handleTimeFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimeFrame(e.target.value);
    };

    const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const groupId = Number(e.target.value);
        setSelectedGroup(groupId);
        console.log("here");
    };

    useEffect(() => {
        console.log("Selected Group:", selectedGroup);
    }, [selectedGroup]);

    useEffect(() => {
        const fetchGenrePrefs = async () => {
            const apiUrl = `http://51.20.128.164/api/group_genre_preference/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const property = "genres";

                if (response.data[property] === undefined) {
                    setGenrePref([]);
                    return;
                }

                const filteredGenrePref = response.data[property].filter((genre) => genre.genre !== null);
                setGenrePref(filteredGenrePref);

            } catch (error) {
                console.log(error);
            }
        };

        const fetchAlbumPrefs = async () => {
            const apiUrl = `http://51.20.128.164/api/group_album_preference/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const property = "albums";

                if (response.data[property] === undefined) {
                    setAlbumPref([]);
                    return;
                }

                setAlbumPref(response.data[property]);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchPerformerPrefs = async () => {
            const apiUrl = `http://51.20.128.164/api/group_performer_preference/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const property = "performers";

                if (response.data[property] === undefined) {
                    setArtistPref([]);
                    return;
                }

                setArtistPref(response.data[property]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchGenrePrefs();
        fetchAlbumPrefs();
        fetchPerformerPrefs();
    }, [selectedGroup]);

    useEffect(() => {
        const fetchGroups = async () => {
            const apiUrl = `http://51.20.128.164/api/display_user_group/${auth()?.username}`;
            try {
                const response = await axios.get(apiUrl);
                const data = response.data;

                const groups123: groupProps[] = data.map((group: any) => ({
                    groupName: group.group_name,
                    groupMembers: group.group_members,
                    groupID: group.group_id
                }));

                setGroups(groups123);
            } catch (error) {
                console.log(error);
            }
        };

        fetchGroups();
        console.log(groups)
    }, []);

    useEffect(() => {
        const getTemporalData0 = async () => {
            try {
                const apiUrl = `http://51.20.128.164/api/user_song_ratings/${auth()?.username}`;
                const response = await axios.get(apiUrl);

                // Construct the property name
                const propertyName = `user_song_ratings`;

                if (response.data && Array.isArray(response.data[propertyName])) {
                    setSongData(response.data[propertyName]);
                } else {
                    setSongData([]);
                }
            } catch (e) {
                console.error('Error fetching song data:', e);
                setSongData([]);
            }
        };

        const getTemporalData1 = async () => {
            try {
                const apiUrl = `http://51.20.128.164/api/user_album_ratings/${auth()?.username}`;
                const response = await axios.get(apiUrl);

                const propertyName = `user_album_ratings`;

                if (response.data && Array.isArray(response.data[propertyName])) {
                    setAlbumData(response.data[propertyName]);
                } else {
                    setAlbumData([]);
                }
            } catch (e) {
                console.error('Error fetching song data:', e);
                setAlbumData([]);
            }
        }

        const getTemporalData2 = async () => {
            try {
                const apiUrl = `http://51.20.128.164/api/user_performer_ratings/${auth()?.username}`;
                const response = await axios.get(apiUrl);

                const propertyName = `user_performer_ratings`;

                if (response.data && Array.isArray(response.data[propertyName])) {
                    setArtistData(response.data[propertyName]);
                } else {
                    setArtistData([]);
                }
            } catch (e) {
                console.error('Error fetching song data:', e);
                setArtistData([]);
            }
        }

        getTemporalData0();
        getTemporalData1();
        getTemporalData2();
    }, [selectedChart]);

    useEffect(() => {
        const getGroupSongs = async () => {
            try {
                const apiUrl = `http://51.20.128.164/api/group_song_ratings/${selectedGroup}`;
                const response = await axios.get(apiUrl);

                if (response.data && Array.isArray(response.data)) {
                    setSongDataGroup(response.data);

                } else {
                    setSongDataGroup([]);
                }
            } catch (e) {
                console.error('Error fetching song data:', e);
                setSongDataGroup([]);
            }
        };

        const getGroupArtists = async () => {
            try {
                const apiUrl = `http://51.20.128.164/api/group_album_ratings/${selectedGroup}`;
                const response = await axios.get(apiUrl);

                if (response.data && Array.isArray(response.data)) {
                    setAlbumDataGroup(response.data);
                } else {
                    setAlbumDataGroup([]);
                }
            } catch (e) {
                console.error('Error fetching song data:', e);
                setAlbumDataGroup([]);
            }
        }

        const getGroupAlbums = async () => {
            try {
                const apiUrl = `http://51.20.128.164/api/group_performer_ratings/${selectedGroup}`;
                const response = await axios.get(apiUrl);

                if (response.data && Array.isArray(response.data)) {
                    setArtistDataGroup(response.data);
                } else {
                    setArtistDataGroup([]);
                }
            } catch (e) {
                console.error('Error fetching song data:', e);
                setArtistDataGroup([]);
            }
        }

        getGroupSongs();
        getGroupArtists();
        getGroupAlbums();
    }, [selectedGroup]);

    useEffect(() => {
        console.log("Updated song data group:", songDataGroup);
    }, [songDataGroup]);

    useEffect(() => {
        console.log("Updated album data group:", albumDataGroup);
    }, [albumDataGroup]);

    useEffect(() => {
        console.log("Updated artist data group:", artistDataGroup);
    }, [artistDataGroup]);

    const processedData0 = useMemo(() => {
        let filteredData = songData;

        if (selectedTimeFrame) {
            const endDate = new Date();
            let startDate = new Date();

            switch (selectedTimeFrame) {
                case '1month':
                    startDate.setMonth(endDate.getMonth() - 1);
                    break;
                case '6months':
                    startDate.setMonth(endDate.getMonth() - 6);
                    break;
                case '1year':
                    startDate.setFullYear(endDate.getFullYear() - 1);
                    break;
                default:
                    break;
            }

            filteredData = filteredData.filter(({ rating_timestamp }) => {
                const ratingDate = new Date(rating_timestamp);
                return ratingDate >= startDate && ratingDate <= endDate;
            });
        }

        return filteredData.reduce<ProcessedData>((acc, { song, rating_timestamp, song_rating }) => {
            if (!acc[song]) {
                acc[song] = { x: [], y: [], name: song };
            }
            const formattedTimestamp = format(new Date(rating_timestamp), 'yyyy-MM-dd HH:mm:ss'); // adjust format as needed
            acc[song].x.push(formattedTimestamp);
            acc[song].y.push(song_rating);
            return acc;
        }, {});
    }, [songData, selectedTimeFrame]);

    const processedData1 = useMemo(() => {
        let filteredData = albumData;

        if (selectedTimeFrame) {
            const endDate = new Date();
            let startDate = new Date();

            switch (selectedTimeFrame) {
                case '1month':
                    startDate.setMonth(endDate.getMonth() - 1);
                    break;
                case '6months':
                    startDate.setMonth(endDate.getMonth() - 6);
                    break;
                case '1year':
                    startDate.setFullYear(endDate.getFullYear() - 1);
                    break;
                default:
                    break;
            }

            filteredData = filteredData.filter(({ rating_timestamp }) => {
                const ratingDate = new Date(rating_timestamp);
                return ratingDate >= startDate && ratingDate <= endDate;
            });
        }

        return filteredData.reduce<ProcessedData>((acc, { album, rating_timestamp, rating }) => {
            if (!acc[album]) {
                acc[album] = { x: [], y: [], name: album };
            }
            const formattedTimestamp = format(new Date(rating_timestamp), 'yyyy-MM-dd HH:mm:ss'); // adjust format as needed
            acc[album].x.push(formattedTimestamp);
            acc[album].y.push(rating);
            return acc;
        }, {});
    }, [songData, selectedTimeFrame]);

    const processedData2 = useMemo(() => {
        let filteredData = artistData;

        if (selectedTimeFrame) {
            const endDate = new Date();
            let startDate = new Date();

            switch (selectedTimeFrame) {
                case '1month':
                    startDate.setMonth(endDate.getMonth() - 1);
                    break;
                case '6months':
                    startDate.setMonth(endDate.getMonth() - 6);
                    break;
                case '1year':
                    startDate.setFullYear(endDate.getFullYear() - 1);
                    break;
                default:
                    break;
            }

            filteredData = filteredData.filter(({ rating_timestamp }) => {
                const ratingDate = new Date(rating_timestamp);
                return ratingDate >= startDate && ratingDate <= endDate;
            });
        }

        return filteredData.reduce<ProcessedData>((acc, { performer, rating_timestamp, rating }) => {
            if (!acc[performer]) {
                acc[performer] = { x: [], y: [], name: performer };
            }
            const formattedTimestamp = format(new Date(rating_timestamp), 'yyyy-MM-dd HH:mm:ss'); // adjust format as needed
            acc[performer].x.push(formattedTimestamp);
            acc[performer].y.push(rating);
            return acc;
        }, {});
    }, [songData, selectedTimeFrame]);

    const getColorForUsername = (() => {
        const colors = ['red', 'green', 'blue', 'orange', 'purple', 'yellow']; // Extend this list as needed
        const colorMap = {};
        let colorIndex = 0;

        return (username) => {
            if (!colorMap[username]) {
                colorMap[username] = colors[colorIndex % colors.length];
                colorIndex++;
            }
            return colorMap[username];
        };
    })();

    const songIndexMap = useMemo(() => {
        const uniqueSongs = [...new Set(songDataGroup.map(item => item.song))];
        const songIndexMap = {};
        uniqueSongs.forEach((song, index) => {
            songIndexMap[song] = index;
        });
        return songIndexMap;
    }, [songDataGroup]);

    const albumIndexMap = useMemo(() => {
        const uniqueAlbums = [...new Set(albumDataGroup.map(item => item.album))];
        const albumIndexMap = {};
        uniqueAlbums.forEach((album, index) => {
            albumIndexMap[album] = index;
        });
        return albumIndexMap;
    }, [albumDataGroup]);

    const artistIndexMap = useMemo(() => {
        const uniqueArtists = [...new Set(artistDataGroup.map(item => item.performer))];
        const artistIndexMap = {};
        uniqueArtists.forEach((artist, index) => {
            artistIndexMap[artist] = index;
        });
        return artistIndexMap;
    }, [artistDataGroup]);

    const processedDataGroup0 = useMemo(() => {
        let filteredData = songDataGroup;

        if (!Array.isArray(filteredData)) {
            console.log("here something happens");
            return [];
        }

        const groupedData = {};

        filteredData.forEach(({ song, rating_timestamp, song_rating, username }) => {
            if (!groupedData[username]) {
                groupedData[username] = {
                    x: [],
                    y: [],
                    z: [],
                    mode: 'markers',
                    type: 'scatter3d',
                    name: username,
                    marker: {
                        size: 6,
                        color: getColorForUsername(username)
                    },
                    text: [],
                };
            }

            groupedData[username].x.push(songIndexMap[song]);
            groupedData[username].y.push(format(new Date(rating_timestamp), 'yyyy-MM-dd HH:mm:ss'));
            groupedData[username].z.push(song_rating);
            groupedData[username].text.push(`${username}: ${song}`);
        });

        return Object.values(groupedData);
    }, [songDataGroup, songIndexMap, selectedGroup]);

    const processedDataGroup1 = useMemo(() => {
        let filteredData = albumDataGroup;

        if (!Array.isArray(filteredData)) {
            console.log("here something happens");
            return [];
        }

        const groupedData = {};

        filteredData.forEach(({ album, rating_timestamp, album_rating, username }) => {
            if (!groupedData[username]) {
                groupedData[username] = {
                    x: [],
                    y: [],
                    z: [],
                    mode: 'markers',
                    type: 'scatter3d',
                    name: username,
                    marker: {
                        size: 6,
                        color: getColorForUsername(username)
                    },
                    text: [],
                };
            }

            groupedData[username].x.push(albumIndexMap[album]);
            groupedData[username].y.push(format(new Date(rating_timestamp), 'yyyy-MM-dd HH:mm:ss'));
            groupedData[username].z.push(album_rating);
            groupedData[username].text.push(`${username}: ${album}`);
        });

        return Object.values(groupedData);
    }, [songDataGroup, songIndexMap, selectedGroup]);

    const processedDataGroup2 = useMemo(() => {
        let filteredData = artistDataGroup;

        if (!Array.isArray(filteredData)) {
            console.log("here something happens");
            return [];
        }

        const groupedData = {};

        filteredData.forEach(({ performer, rating_timestamp, performer_rating, username }) => {
            if (!groupedData[username]) {
                groupedData[username] = {
                    x: [],
                    y: [],
                    z: [],
                    mode: 'markers',
                    type: 'scatter3d',
                    name: username,
                    marker: {
                        size: 6,
                        color: getColorForUsername(username)
                    },
                    text: [],
                };
            }

            groupedData[username].x.push(artistIndexMap[performer]);
            groupedData[username].y.push(format(new Date(rating_timestamp), 'yyyy-MM-dd HH:mm:ss'));
            groupedData[username].z.push(performer_rating);
            groupedData[username].text.push(`${username}: ${performer}`);
        });

        return Object.values(groupedData);
    }, [songDataGroup, songIndexMap, selectedGroup]);

    const temporal0 = useMemo(() => {
        return Object.values(processedData0).map((item, index) => ({
            x: item.x,
            y: item.y,
            type: 'line',
            mode: 'lines+markers',
            marker: { color: `hsl(${index * 360 / Object.values(processedData0).length}, 100%, 50%)` },
            name: item.name
        }));
    }, [processedData0]);

    const temporal1 = useMemo(() => {
        return Object.values(processedData1).map((item, index) => ({
            x: item.x,
            y: item.y,
            type: 'line',
            mode: 'lines+markers',
            marker: { color: `hsl(${index * 360 / Object.values(processedData1).length}, 100%, 50%)` },
            name: item.name
        }));
    }, [processedData1]);

    const temporal2 = useMemo(() => {
        return Object.values(processedData2).map((item, index) => ({
            x: item.x,
            y: item.y,
            type: 'line',
            mode: 'lines+markers',
            marker: { color: `hsl(${index * 360 / Object.values(processedData2).length}, 100%, 50%)` },
            name: item.name
        }));
    }, [processedData2]);

    return (
        <>
            <VStack>
                <h1 className="text-5xl font-lalezar text-[#35517e]">Your Charts</h1>
                <h1 className="text-2xl font-lalezar text-[#35517e]">Please select the data that you want to analyze.</h1>
                <Flex direction="row" align="center" justify="center">
                    <Select onChange={handleChartChange} width="auto" mr={2} className="text-[#35517e]">
                        <option value="default">Select Category</option>
                        <option value="temporal" className="text-[#35517e]">Temporal Analysis</option>
                        <option value="group" className="text-[#35517e]">Temporal Group Analysis</option>
                        <option value="pgroup" className="text-[#35517e]">Pie Chart Group Analysis</option>
                        {/* Add other options as necessary */}
                    </Select>

                    {
                        selectedChart === 'group' && (
                            <Select onChange={handleGroupChange} width="auto" mr={2} className="text-[#35517e]">
                                <option value="">Select Group</option>
                                {groups.map(group => (
                                    <option key={group.groupID} value={group.groupID}>{group.groupName}</option>
                                ))}
                            </Select>
                        )
                    }

                    {
                        selectedChart === 'pgroup' && (
                            <Select onChange={handleGroupChange} width="auto" mr={2} className="text-[#35517e]">
                                <option value="">Select Group</option>
                                {groups.map(group => (
                                    <option key={group.groupID} value={group.groupID}>{group.groupName}</option>
                                ))}
                            </Select>
                        )
                    }

                    {selectedGroup && selectedChart === 'group' && (
                        <Select onChange={handleSubOptionChange} width="auto" mr={2} className="text-[#35517e]">
                            <option value="">Select Sub-Category</option>
                            <option value="albumsg" className="text-black">Group Albums</option>
                            <option value="performersg" className="text-black">Group Performers</option>
                            <option value="songsg" className="text-black">Group Songs</option>
                        </Select>
                    )}

                    {selectedGroup && selectedChart === 'pgroup' && (
                        <Select onChange={handleSubOptionChange} width="auto" mr={2} className="text-[#35517e]">
                            <option value="">Select Sub-Category</option>
                            <option value="albumsg2" className="text-black">Album Pref. Dist.</option>
                            <option value="performersg2" className="text-black">Performer Pref. Dist.</option>
                            <option value="genresg2" className="text-black">Genre Pref. Dist.</option>
                        </Select>
                    )}

                    {selectedChart === 'temporal' && (
                        <Select onChange={handleSubOptionChange} width="auto" mr={2} className="text-[#35517e]">
                            <option value="">Select Sub-Category</option>
                            <option value="albums" className="text-black">Your Albums</option>
                            <option value="performers" className="text-black">Your Performers</option>
                            <option value="songs" className="text-black">Your Songs</option>
                        </Select>
                    )}

                    {selectedSubOption && selectedChart === 'temporal' && (
                        <Select onChange={handleTimeFrameChange} width="auto" className="text-[#35517e]">
                            <option value="">Select Time Frame</option>
                            <option value="1month" className="text-black">In 1 Month</option>
                            <option value="6months" className="text-black">In 6 Months</option>
                            <option value="1year" className="text-black">In 1 Year</option>
                        </Select>
                    )}
                </Flex>
                <div className="py-3"></div>
            </VStack>

            {
                selectedChart === 'temporal' && selectedSubOption && selectedTimeFrame && (
                    <>
                        {selectedSubOption === 'songs' && (
                            <Plot
                                className="chart-container"
                                data={temporal0}
                                layout={{
                                    width: 800,
                                    height: 400,
                                    showlegend: true,
                                    xaxis: { title: 'Date' },
                                    yaxis: { title: 'Rating' }
                                }}
                            />
                        )}

                        {selectedSubOption === 'albums' && (
                            <Plot
                                className="chart-container"
                                data={temporal1}
                                layout={{
                                    width: 800,
                                    height: 400,
                                    showlegend: true,
                                    xaxis: { title: 'Date' },
                                    yaxis: { title: 'Rating' }
                                }}
                            />
                        )}

                        {selectedSubOption === 'performers' && (
                            <Plot
                                className="chart-container"
                                data={temporal2}
                                layout={{
                                    width: 800,
                                    height: 400,
                                    showlegend: true,
                                    xaxis: { title: 'Date' },
                                    yaxis: { title: 'Rating' }
                                }}
                            />
                        )}
                    </>
                )
            }
            {
                selectedChart === 'group' && selectedSubOption && (
                    <>
                        {selectedSubOption === 'songsg' && (
                            <Plot
                                data={processedDataGroup0}
                                layout={{
                                    width: 800,
                                    height: 600,
                                    margin: {
                                        l: 0,
                                        r: 0,
                                        b: 0,
                                        t: 0
                                    },
                                    scene: {
                                        xaxis: { title: 'Song' },
                                        yaxis: { title: 'Timestamp' },
                                        zaxis: { title: 'Rating' }
                                    },
                                    legend: {
                                        title: 'Usernames',
                                        x: 1.05,
                                        xanchor: 'left'
                                    }
                                }}
                            />
                        )}

                        {selectedSubOption === 'albumsg' && (
                            <Plot
                                data={processedDataGroup1}
                                layout={{
                                    width: 800,
                                    height: 600,
                                    margin: {
                                        l: 0,
                                        r: 0,
                                        b: 0,
                                        t: 0
                                    },
                                    scene: {
                                        xaxis: { title: 'Album' },
                                        yaxis: { title: 'Timestamp' },
                                        zaxis: { title: 'Rating' }
                                    },
                                    legend: {
                                        title: 'Usernames',
                                        x: 1.05,
                                        xanchor: 'left'
                                    }
                                }}
                            />
                        )}

                        {selectedSubOption === 'performersg' && (
                            <Plot
                                data={processedDataGroup2}
                                layout={{
                                    width: 800,
                                    height: 600,
                                    margin: {
                                        l: 0,
                                        r: 0,
                                        b: 0,
                                        t: 0
                                    },
                                    scene: {
                                        xaxis: { title: 'Performer' },
                                        yaxis: { title: 'Timestamp' },
                                        zaxis: { title: 'Rating' }
                                    },
                                    legend: {
                                        title: 'Usernames',
                                        x: 1.05,
                                        xanchor: 'left'
                                    }
                                }}
                            />
                        )}
                    </>
                )
            }
            {
                selectedChart === 'pgroup' && selectedSubOption && (
                    <>
                        {selectedSubOption === 'albumsg2' && (
                            <Plot
                                className="chart-container"
                                data={[
                                    {
                                        type: 'pie',
                                        labels: albumPref.map(item => item.album),
                                        values: albumPref.map(item => item.count),
                                        marker: {
                                            colors: albumPref.map((_, index) => generateColor(index, albumPref.length)),
                                        },
                                    }
                                ]}
                                layout={{
                                    width: 800,
                                    height: 400,
                                    showlegend: true,
                                    title: 'Album Distribution'
                                }}
                            />
                        )}

                        {selectedSubOption === 'performersg2' && (
                            <Plot
                                className="chart-container"
                                data={[
                                    {
                                        type: 'pie',
                                        labels: artistPref.map(item => item.performer),
                                        values: artistPref.map(item => item.count),
                                        marker: {
                                            colors: artistPref.map((_, index) => generateColor(index, artistPref.length)),
                                        },
                                    }
                                ]}
                                layout={{
                                    width: 800,
                                    height: 400,
                                    showlegend: true,
                                    title: 'Artist Distribution'
                                }}
                            />
                        )}

                        {selectedSubOption === 'genresg2' && (
                            <Plot
                                className="chart-container"
                                data={[
                                    {
                                        type: 'pie',
                                        labels: genrePref.map(item => item.genre),
                                        values: genrePref.map(item => item.count),
                                        marker: {
                                            colors: genrePref.map((_, index) => generateColor(index, genrePref.length)),
                                        },
                                    }
                                ]}
                                layout={{
                                    width: 800,
                                    height: 400,
                                    showlegend: true,
                                    title: 'Genre Distribution'
                                }}
                            />
                        )}
                    </>
                )
            }
            {
                selectedChart === 'default' && (
                    <Plot
                        className="chart-container"
                        data={null}
                        layout={{
                            width: 800,
                            height: 400,
                            showlegend: true,
                            xaxis: { title: 'Date' },
                            yaxis: { title: 'Rating' }
                        }}
                    />
                )
            }
        </>
    );
};

export default MainChart;

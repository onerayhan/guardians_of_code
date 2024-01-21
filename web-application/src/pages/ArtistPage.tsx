import {useEffect, useState} from 'react';
import Header from "../components/Header";
import {useLocation} from "react-router-dom";
import {Text} from "@chakra-ui/react";
import {Avatar} from "flowbite-react";

interface Artist {
    artist_photo: string | undefined;
    artist_id: number;
    artist_name: string;
    followers: number | null;
    popularity: number | null;
    genres: string | null;
    release_year: number | null;
}

const ArtistPage = () => {
    const location = useLocation();
    const artist = location.state?.groupMembers;
    const [artistData, setArtistData] = useState<Artist | null>(null);

    useEffect(() => {
        setArtistData(artist);
    }, []);


    if (!artistData) {
        return <div>Loading...</div>;
    }

    return (
        <body className="bg-[#081730]">
        <Header/>
        <div className="artist-info">
            <div className="flex flex-col items-center text-center bg-[#081730] overflow-y-auto">
                <div className="flex flex-col items-center justify-center w-full bg-[#081730] text-white p-2.5">
                    <Avatar size="xl" img={artistData.artist_photo} alt="Artist Photo"/>
                    <Text className="font-lalezar">{artistData.artist_name}</Text>
                    <p className="font-lalezar">Popularity: {artistData.popularity}</p>
                    <p className="font-lalezar">Followers: {artistData.followers}</p>
                    <p className="font-lalezar">Genres: {artistData.genres}</p>
                    <div className="py-2"></div>
                </div>
                <div className="py-5">

                </div>
            </div>
        </div>
        </body>
);
};

export default ArtistPage;
import { useEffect, useState } from 'react';
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import axios from 'axios';
import {useAuthUser} from "react-auth-kit";

interface AlbumData {
    album_name: string;
    album_photo_url: PhotoURL[]; // Assuming PhotoURL is an existing interface
    album_release_year: string;
    popularity: number;
}

interface PhotoURL {
    photo_url: string;
}

const AlbumPage = () => {
    const { albumId } = useParams();
    const [albumData, setAlbumData] = useState<AlbumData | null>(null);

    const auth = useAuthUser();
    const username = `http://51.20.128.164/spoti/get_albums_info/${auth()?.username}/${albumId}`;

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const response = await axios.get(`http://51.20.128.164/spoti/get_albums_info/${username}/${albumId}`);
                setAlbumData(response.data[0]);
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        };

        fetchAlbumData();
    }, [albumId]);

    if (!albumData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-[#081730]">
            <Header />
            <div className="album-info">
                <h1>{albumData.album_name}</h1>
                <img src={albumData.album_photo_url[0].photo_url} alt="Album Cover" />
                <p>Release Year: {albumData.album_release_year}</p>
                <p>Popularity: {albumData.popularity}</p>
            </div>
        </div>
    );
};

export default AlbumPage;
import React from "react";
import { BsSpotify } from "react-icons/bs";

const Spotify_Entry_Handler: React.FC = () => {
    const handleAuthWindowOpen = (): void => {
        const authUrl: string = 'http://13.51.167.155/spoti_login';
        window.open(authUrl, "_blank")
    };

    return (
        <button onClick={handleAuthWindowOpen} className="w-[200px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold">
            <BsSpotify size={20} className="inline-block mr-2"/>
            Sign Up with Spotify
        </button>
    );
};

export default Spotify_Entry_Handler;


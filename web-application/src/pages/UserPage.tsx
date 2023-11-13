import Header from "../components/Header";
import Followers from "../components/UserPage/Followers";
import Followings from "../components/UserPage/Followings";
import LikedSongsComponent from "../components/UserPage/LikedSongsComponent.tsx";
import Profile from "../components/UserPage/Profile";
import SongsDisplay from "../components/UserPage/SongsDisplay.tsx";
import { FC } from "react";

interface username {
    user: String;
}

const UserPage: FC<username> = () =>
{
    return (
      <div className="bg-[#081730]">
        <Header />
        <Profile/>
        <Followers/>
        <Followings/>
        <LikedSongsComponent/>
        <SongsDisplay/>
      </div>
    );
};
  
export default UserPage;
import Header from "../components/Header";
import Profile from "../components/UserPage/Profile";
import SongsComponent from "../components/UserPage/SongsComponent.tsx";
import { FC } from "react";

interface username {
    user: String;
}

const UserPage: FC<username> = () =>
{
    return (
      <body className="bg-[#081730]">
        <Header />
        <Profile/>
        <SongsComponent />
        <div className="bg-[#081730] py-10">

        </div>
      </body>
    );
};
  
export default UserPage;
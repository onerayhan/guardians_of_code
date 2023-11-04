import Header from "../components/Header";
import UserInfo from "../components/UserPage/UserInfo";
import { FC } from "react";

interface username {
    user: String;
}

const UserPage: FC<username> = ({ user }) => 
{
    return (
      <div className="bg-[#081730]">
        <Header />
        <UserInfo user={user}/>
      </div>
    );
};
  
export default UserPage;
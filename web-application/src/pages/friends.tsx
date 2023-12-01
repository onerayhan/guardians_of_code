import Header from "../components/Header";
import UserSearch from "../components/Friends/UserSearch";
import FriendRecoms from "../components/Friends/FriendRecoms";
import FormFriendGroups from "../components/Friends/FormFriendGroups";

const Friends = () => 
{
    return (
      <body className="bg-[#081730] overflow-y-auto">
        <Header />
        <UserSearch />
        <FriendRecoms />
        <FormFriendGroups />
        <div className="bg-[#081730] py-20"></div>
      </body>
    );
};
  
export default Friends;
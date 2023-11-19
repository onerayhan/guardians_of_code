import { useParams } from 'react-router-dom';
import Header from "../components/Header";

const UserProfile = () => {
    let { userId } = useParams();
    return (
        <div className="bg-[#081730]">
            <Header />
            <div>User Profile Page for User: {userId}</div>
        </div>
    );
}

export default UserProfile;
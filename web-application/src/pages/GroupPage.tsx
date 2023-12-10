import {useLocation, useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Button, HStack, Text} from "@chakra-ui/react";
import {useAuthUser} from "react-auth-kit";
import Header from "../components/Header";
const GroupDetails = () => {
    const location = useLocation();
    const gname = useParams();
    const groupMembers = location.state?.groupMembers;
    const gr = gname.groupName;
    const navigate = useNavigate();
    const auth = useAuthUser();
    const handleNavigate = (user: string) => {
        let og_user = auth()?.username;
        {og_user === user ? navigate(`/${og_user}`) : navigate(`/user/${user}`)}
    }

    return (
        <body className="bg-[#081730]">
            <Header />
            <div className="relative flex flex-col items-center">
                <HStack>
                    <div className="mt-5"></div>
                    <h1><Text className="text-6xl text-white font-semibold">{gr}</Text></h1>
                    <div className="py-5"></div>
                    {groupMembers && groupMembers.map(member => (
                        <Button key={member} onClick={() => handleNavigate(member)}>{member}</Button>
                    ))}
                </HStack>
            </div>
        </body>
    );
};

export default GroupDetails;
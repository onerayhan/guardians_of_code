import React, {useEffect, useState} from 'react';
import { Thead, Th, Td} from '@chakra-ui/react';
import { useAuthUser } from "react-auth-kit";
import axios from "axios";
import {
    Table,
    Tbody,
    Tr,
    TableContainer,
} from '@chakra-ui/react'

interface RecomsArray {
    username: number;
    follower_count: string;
    followed_count: string;
    profile_picture?: string;
}

const FriendRecoms:React.FC = () => {

    const [RecomUsers, setRecomUsers] = useState<RecomsArray[]>([]);
    const auth = useAuthUser();

    const RecomDisplayUser = ({ user }: { user: RecomsArray }) => {
        return (
            <Tr>
                <Td>{user.profile_picture}</Td>
                <Td>{user.username}</Td>
                <Td>{user.follower_count}</Td>
                <Td>{user.followed_count}</Td>
            </Tr>
        );
    };

    useEffect(() => {
        const getRecomUsers = async () => {
            // The friend recommendations API will come here.
            const apiUrl = "";
            try {
                const response = await axios.post(apiUrl, { username: `${auth()?.username}` });
                const data = response.data;
                setRecomUsers(data);
            } catch (error) {
                console.log(error);
            }
        };

        getRecomUsers();
    }, []);

    return (
        <div className="relative w-full flex flex-col items-center top-20 pb-8">
            <h1 className="text-4xl font-lalezar text-white">Friend Recommendations</h1>
                <div className="rounded-xl bg-white">
                        <TableContainer>
                            <Table variant="simple" colorScheme='purple' size="lg">
                                <Thead>
                                    <Tr>
                                        <Th>Profile Picture</Th>
                                        <Th>User Name</Th>
                                        <Th>Follower Count</Th>
                                        <Th>Following Count</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {RecomUsers.map(user => <RecomDisplayUser key={user.username} user={user} />)}
                                </Tbody>
                            </Table>
                        </TableContainer>
                </div>
                </div>
    );
};

export default FriendRecoms;
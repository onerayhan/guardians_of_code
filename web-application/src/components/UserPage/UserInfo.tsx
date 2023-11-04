import { FC } from 'react';
import { useAuthUser } from 'react-auth-kit';

interface UserInfoProps {
    user: String;
  }

const UserInfo: FC<UserInfoProps> = ({ user }) => {

    const auth = useAuthUser();
    const username = auth()?.username;

    return(
        <div>
            this is the user info page for {username}
        </div>
    );
}

export default UserInfo;
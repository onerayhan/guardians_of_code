import { FC } from 'react';
import { useAuthUser } from 'react-auth-kit';

const UserInfo: FC = () => {

    const auth = useAuthUser();
    const username = auth()?.username;

    return(
        <div>
            this is the user info page for {username}
        </div>
    );
}

export default UserInfo;
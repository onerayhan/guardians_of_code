import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import FriendRecoms from "../../src/components/Friends/FriendRecoms";

// Create a mock instance for axios
const mock = new MockAdapter(axios);
jest.mock('react-auth-kit', () => ({
    useAuthUser: () => jest.fn().mockReturnValue({
        username: 'testuser'
    }),
    useIsAuthenticated: () => jest.fn(),
    useSignOut: () => jest.fn()
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('FriendRecoms', () => {

    beforeEach(() => {

        mock.onPost('http://51.20.128.164/api/recommendations/testuser').reply(200, [
            {
                album: "Elephant",
                genre: "Rock",
                performer: "The White Stripes",
                song_id: 82,
                songs_name: "Seven Nation Army",
                username: "123"
            },
            {
                album: "Dead Man's Hand",
                genre: "Rock",
                performer: "Lord Huron",
                song_id: 83,
                songs_name: "The Night We Met",
                username: "asd"
            }]);

        mock.onPost("http://51.20.128.164/api/user_followings").reply(config => {
            const expectedParams = { username: 'testuser' };
            const actualParams = JSON.parse(config.data);

            if (actualParams.username === expectedParams.username) {
                return [200, {
                    [`Followers of ${expectedParams.username}`]: ['follower1', 'follower2'],
                    [`${expectedParams.username} follows`]: ['following1', 'following2']
                }];
            } else {
                return [404];
            }
        });

    });

    it('display friend recommendations', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <FriendRecoms />
                    </ChakraProvider>
                </Router>
            );
        });

        await waitFor(() => screen.getByText('123'));
    });

    it('navigate to users', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <FriendRecoms />
                    </ChakraProvider>
                </Router>
            );
        });

        const userButton = screen.getByText('123');
        fireEvent.click(userButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/user/123');
        });
    });
});
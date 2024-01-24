import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import UserSearch from "../../src/components/Friends/UserSearch";
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

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


describe('User Search', () => {

    it('Successfully fetches user', async () => {

        mock.onPost('http://51.20.128.164/api/user_info').reply(200,
            {birthday:"01-01-2000", email:"test@test.com",followed_count:32743,follower_count:23792,username:"testuser2"}
        );

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

        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <UserSearch />
                    </ChakraProvider>
                </Router>
            );
        });

        const input = screen.getByPlaceholderText('Search for friends...');
        fireEvent.change(input, { target: { value: 'testusername' } });

        const searchButton = screen.getByRole('button');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText('testuser2')).toBeInTheDocument();
        });
    });

    it('Already friends with user', async () => {

        mock.onPost('http://51.20.128.164/api/user_info').reply(200,
            {birthday:"01-01-2000", email:"test@test.com",followed_count:32743,follower_count:23792,username:"following1"}
        );

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

       await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <UserSearch />
                    </ChakraProvider>
                </Router>
            );
        });

       const input = screen.getByPlaceholderText('Search for friends...');
       fireEvent.change(input, { target: { value: 'testusername' } });

       const searchButton = screen.getByRole('button');
       fireEvent.click(searchButton);

       await waitFor(() => {

           const followButton = screen.getByRole('button', { name: 'Follow User' });
           fireEvent.click(followButton);

           waitFor(() => {
               expect(screen.getByText('User is already followed')).toBeInTheDocument();
           });
       });
    });
});
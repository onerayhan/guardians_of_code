import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import Profile from "../../src/components/UserPage/Profile"; // Adjust the import path as necessary
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { act } from '@testing-library/react';

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
describe('Profile', () => {

    beforeEach(() => {
        mock.onPost("http://51.20.128.164/api/profile_picture").reply(config => {
            const expectedParams = { username: 'testuser' };
            const actualParams = JSON.parse(config.data);

            if (actualParams.username === expectedParams.username) {
                const blob = new Blob([''], { type: 'image/jpeg' });
                return [200, blob];
            } else {
                return [404];
            }
        });

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

        mock.onGet(`http://51.20.128.164/api/display_user_group/testuser`).reply(200, [
            {
                group_id: 0,
                group_members: [
                    "testuser",
                    "testuser2"
                ],
                group_name: "testGroup"
            }
        ]);
        mock.onGet(`http://51.20.128.164/api/check_spoti_connection/testuser`).reply(200, {
            check: "true"
        });
    });

    it('renders profile information', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Profile />
                    </ChakraProvider>
                </Router>
            );
        });

        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument();
        });
    });

    it('navigates to settings on button click', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Profile />
                    </ChakraProvider>
                </Router>
            );
        });

        const settingsButton = screen.getByText('Settings');
        fireEvent.click(settingsButton);

        expect(mockNavigate).toHaveBeenCalledWith('/testuser/settings');
    });

    it('renders followers', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Profile />
                    </ChakraProvider>
                </Router>
            );
        });

        const followersButton = screen.getByText('Followers: 2');
        fireEvent.click(followersButton);

        await waitFor(() => {
            expect(screen.getByText('follower1')).toBeInTheDocument();
            expect(screen.getByText('follower2')).toBeInTheDocument();
        });
    });

    it('renders followings', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Profile />
                    </ChakraProvider>
                </Router>
            );
        });

        const followingButton = screen.getByText('Following: 2');
        fireEvent.click(followingButton);

        await waitFor(() => {
            expect(screen.getByText('following1')).toBeInTheDocument();
            expect(screen.getByText('following2')).toBeInTheDocument();
        });
    });

    it('renders groups', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Profile />
                    </ChakraProvider>
                </Router>
            );
        });

        const groupsButton = screen.getByText('Show Groups');
        fireEvent.click(groupsButton);

        await waitFor(() => {
            expect(screen.getByText('testGroup')).toBeInTheDocument();
        });
    });
});

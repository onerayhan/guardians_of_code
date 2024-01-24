import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import FormFriendGroups from "../../src/components/Friends/FormFriendGroups";

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

describe('FormFriendGroups', () => {

    beforeEach(() => {

        mock.onPost("http://51.20.128.164/api/user_followings").reply(config => {
            const expectedParams = { username: 'testuser' };
            const actualParams = JSON.parse(config.data);

            if (actualParams.username === expectedParams.username) {
                return [200, {
                    [`Followers of ${expectedParams.username}`]: ['123', 'asd'],
                    [`${expectedParams.username} follows`]: ['asd', '456']
                }];
            } else {
                return [404];
            }
        });

    });

    it('selected users appear in render', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <FormFriendGroups />
                    </ChakraProvider>
                </Router>
            );
        });

        const userButton = screen.getByText('Select Friends');
        fireEvent.click(userButton);

        await waitFor(() => {
            expect(screen.getByText('asd')).toBeInTheDocument();
        });
    });

    it('form friend groups', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <FormFriendGroups />
                    </ChakraProvider>
                </Router>
            );
        });

        const userButton = screen.getByText('Select Friends');
        fireEvent.click(userButton);

        await waitFor(() => {
            waitFor(() => {
                expect(screen.getByText('asd')).toBeInTheDocument();
            });

            const userButton2 = screen.getByText('asd');
            fireEvent.click(userButton2);

            const textInput = screen.getByPlaceholderText('Group Name');
            fireEvent.change(textInput, { target: { value: 'group1' } });

            const userButton3 = screen.getByText('Form Friend Group');
            fireEvent.click(userButton3);
        });
    });
});
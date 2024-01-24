import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { act } from '@testing-library/react';
import ExportCSV from "../../src/components/Share/ExportCSV";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const mock = new MockAdapter(axios);
jest.mock('react-auth-kit', () => ({
    useAuthUser: () => jest.fn().mockReturnValue({
        username: 'testuser'
    }),
    useIsAuthenticated: () => jest.fn(),
    useSignOut: () => jest.fn()
}));

describe('ExportCSV Component', () => {

    beforeEach(() => {
        mock.onGet(`http://51.20.128.164/api/user_song_ratings/testuser`).reply(200, {
            user_song_ratings: [
                {
                    album: "Belki Alışman Lazım",
                    artist: "Duman",
                    external_service_id: null,
                    genre: null,
                    rating_timestamp: "Fri, 15 Dec 2023 16:48:52 GMT",
                    release_year: 2002,
                    song: "Her Şeyi Yak",
                    song_id: 180,
                    song_rating: 4
                }
            ]
        });
    });

    it('renders correctly', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <ExportCSV />
                    </ChakraProvider>
                </Router>
            );
        });

        expect(screen.getByText('Select Artist')).toBeInTheDocument();
        expect(screen.getByText('Select Album')).toBeInTheDocument();
        expect(screen.getByText('Export Rating Data as .csv')).toBeInTheDocument();
    });

    it('allows selection of an artist and creates a tag', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <ExportCSV />
                    </ChakraProvider>
                </Router>
            );
        });

        const userButton = screen.getByText('Select Artist');
        fireEvent.click(userButton);

        await waitFor(() => {
            expect(screen.getByText('Duman')).toBeInTheDocument();
        });
    });

    it('allows selection of an album and creates a tag', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <ExportCSV />
                    </ChakraProvider>
                </Router>
            );
        });

        const userButton = screen.getByText('Select Album');
        fireEvent.click(userButton);

        await waitFor(() => {
            expect(screen.getByText('Belki Alışman Lazım')).toBeInTheDocument();
        });
    });
});
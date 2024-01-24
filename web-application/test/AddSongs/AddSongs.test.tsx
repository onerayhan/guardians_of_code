import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { act } from '@testing-library/react';
import AddSongs from "../../src/pages/AddSongs";
import userEvent from '@testing-library/user-event';

// Create a mock instance for axios
jest.mock('react-auth-kit', () => ({
    useAuthUser: () => jest.fn().mockReturnValue({
        username: 'testuser'
    }),
    useIsAuthenticated: () => jest.fn(),
    useSignOut: () => jest.fn()
}));

const mockNavigate = jest.fn();

const jsonData = JSON.stringify([{"song_name":"Alejandro","length":"07:11","tempo":80,"recording_type":"LIVE","listens":6000,"release_year":"1968","album_name":"Hey Jude","performer_name":"The Beatles","genre":"Rock","mood":"Melancholic","instrument":"Piano"}, {"song_name":"Goat Music","length":"08:02","tempo":63,"recording_type":"LIVE","listens":7000,"release_year":"1971","album_name":"Led Zeppelin IV","performer_name":"Led Zeppelin","genre":"Rock","mood":"Epic","instrument":"Guitar"}]);
const blob = new Blob([jsonData], { type: 'application/json' });
const mockFile = new File([blob], "mockSongs.json", { type: 'application/json' });

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('AddSongs', () => {

    it('unless song name is entered, submission is disabled.', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <AddSongs />
                    </ChakraProvider>
                </Router>
            );
        });

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('This field is required.')).toBeInTheDocument();
        });
    });

    it('upload file', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <AddSongs />
                    </ChakraProvider>
                </Router>
            );
        });

        const fileButton = screen.getByText('Import Songs from File');
        fireEvent.click(fileButton);

        await waitFor(() => {
            expect(screen.getByText('Accepted Formats Are: .json')).toBeInTheDocument();

            waitFor(() => {
                const dropzone = screen.getByTestId('dropzone');
                userEvent.upload(dropzone, mockFile);
            });
        });
    });
});
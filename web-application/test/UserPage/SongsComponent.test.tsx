import {render, waitFor, screen, fireEvent} from '@testing-library/react';
import SongsComponent from "../../src/components/UserPage/SongsComponent"; // Adjust the import path as necessary
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";

// Create a mock instance for axios
const mock = new MockAdapter(axios);

jest.mock('react-auth-kit', () => ({
    useAuthUser: () => jest.fn().mockReturnValue({
        username: 'testuser'
    })
}));

describe('SongsComponent', () => {

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

        mock.onPost(`http://51.20.128.164/api/delete_song`).reply(config => {
            const expectedParams = {username: 'testuser', song_id: 180};
            const actualParams = config.params;
            if (actualParams.username === expectedParams.username && actualParams.song_id === expectedParams.song_id) {
                return [200, {
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
                }];
            } else {
                return [404];
            }
        });
    });

    mock.onGet(`http://51.20.128.164/api/user_songs/testuser`).reply(200,
        [{added_timestamp:"Thu, 14 Dec 2023 23:02:42 GMT",album_name:"Yıldızlar Ve Yakamoz",genre:null,instrument:null,length:"00:06:54",listens:0, mood:null, performer_name:"Ahmet Kaya",recording_type:null,release_year:1997,song_id:162,song_name:"Şafak Türküsü",tempo:null,username:"homelander"}] );


    it('renders ratings from API', async () => {
        render(
            <Router>
                <ChakraProvider>
                    <SongsComponent />
                </ChakraProvider>
            </Router>
        );

        // Wait for the song to appear
        await waitFor(() => {
            expect(screen.getByText('Her Şeyi Yak')).toBeInTheDocument();
        });
    });

    it('renders songs from API', async () => {
        render(
            <Router>
                <ChakraProvider>
                    <SongsComponent />
                </ChakraProvider>
            </Router>
        );

        const addedSongsTab = screen.getByRole('tab', { name: /Added Songs/i });
        fireEvent.click(addedSongsTab);

        // Wait for the song to appear
        await waitFor(() => {
            expect(screen.getByText('Şafak Türküsü')).toBeInTheDocument();
        });
    });
});
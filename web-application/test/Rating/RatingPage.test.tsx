import {render, waitFor, screen, act, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import RatingPage from "../../src/components/Rating/RatingPage";
import {BrowserRouter as Router} from "react-router-dom";
import {ChakraProvider} from "@chakra-ui/react";

// Create a mock instance for axios
const mock = new MockAdapter(axios);

jest.mock('react-auth-kit', () => ({
    useAuthUser: () => jest.fn().mockReturnValue({
        username: 'testuser'
    })
}));

describe('SongsComponent', () => {

    beforeEach(() => {

        mock.onGet(`http://51.20.128.164/api/user_songs/testuser`).reply(200,
            [{
                added_timestamp: "Thu, 14 Dec 2023 23:02:42 GMT",
                album_name: "Yıldızlar Ve Yakamoz",
                genre: null,
                instrument: null,
                length: "00:06:54",
                listens: 0,
                mood: null,
                performer_name: "Ahmet Kaya",
                recording_type: null,
                release_year: 1997,
                song_id: 162,
                song_name: "Şafak Türküsü",
                tempo: null,
                username: "homelander"
            }]);

        mock.onPost('http://51.20.128.164/api/recommendations/testuser').reply(200, [
            {
                album: "Elephant",
                genre: "Rock",
                performer: "The White Stripes",
                song_id: 82,
                songs_name: "Seven Nation Army",
                username: "123"
            }]);
    });

    it('renders user\'s own ratings', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <RatingPage />
                    </ChakraProvider>
                </Router>
            );
        });

        await waitFor(() => screen.getByText('Şafak Türküsü'));
    });

    it('renders recommendations from API', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <RatingPage />
                    </ChakraProvider>
                </Router>
            );
        });

        const ratingButton = screen.getByText('Armonify');
        fireEvent.click(ratingButton);

        const genreButton = screen.getByText('Genre');
        fireEvent.click(genreButton);

        const getRecommendationsButton = screen.getByText('Get Recommendations');
        fireEvent.click(getRecommendationsButton);

        await waitFor(() => screen.getByText('Elephant'));
    });
});
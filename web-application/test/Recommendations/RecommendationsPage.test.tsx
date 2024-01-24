import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import RecommendationsPage from "../../src/components/Recommendations/RecommendationsPage";

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

describe('RecommendationsPage', () => {

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

        mock.onGet(`http://51.20.128.164/spoti/get_user_top_tracks/testuser`).reply(200,
            {
                album: {
                    images: [
                        {
                            url: "https://i.scdn.co/image/ab67616d0000b2736fc734b5ae124def28a6a68c"
                        }
                    ],
                    name: "TIRED OF PROBLEMS",
                    release_date: "2023-07-21"
                },
                artists: [
                    {
                        name: "NUEKI"
                    },
                    {
                        name: "TOLCHONOV"
                    },
                    {
                        name: "glichery"
                    }
                ],
                id: "5L7h1PCOF5lrX3e3v8sJAx",
                name: "TIRED OF PROBLEMS",
                duration_ms: 109268
            }
        );

        mock.onGet(`http://51.20.128.164/spoti/get_curr_user_tracks/testuser`).reply(200, [
            {
                track: {
                    album: {
                        images: [
                            { url: "https://i.scdn.co/image/ab67616d0000b27368ccd79879821c333d7afe58" }
                        ],
                        name: "YUM YUM",
                        release_date: "2023-06-23"
                    },
                    artists: [
                        { name: "LXNGVX" },
                        { name: "Mc Gw" }
                    ],
                    id: "0R902FnwJO8kBZYvtpQLrL",
                    name: "YUM YUM",
                    duration_ms: 129697
                }
            }
        ]);

        mock.onPost(`http://51.20.128.164/spoti/get_recommendations/testuser`).reply(200, {
                album: {
                    images: [
                        { url: "https://i.scdn.co/image/ab67616d0000b273b9021ad16733196aacf253c1" }
                    ],
                    name: "Frontiers",
                    release_date: "1983-02-22"
                },
                artists: [
                    { name: "Journey" }
                ],
                id: "57ebBLITHpRgRKGrlbxMZS",
                name: "Faithfully",
                duration_ms: 267080
            }
        )
    });

    it('renders recommendations from API', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <RecommendationsPage />
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

    it('renders top tracks from Spotify', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <RecommendationsPage />
                    </ChakraProvider>
                </Router>
            );
        });

        const spotiButton = screen.getByText('Spotify');
        fireEvent.click(spotiButton);

        await waitFor(() => {
            waitFor(() => {
                expect(screen.getByText('Your Top Spotify Songs')).toBeInTheDocument();
            });

            const topTracksButton = screen.getByText('Your Top Spotify Songs');
            fireEvent.click(topTracksButton);

            waitFor(() => {
                expect(screen.getByText('TIRED OF PROBLEMS')).toBeInTheDocument();
            });
        });
    });

    it('renders current tracks from Spotify', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <RecommendationsPage />
                    </ChakraProvider>
                </Router>
            );
        });


        const spotiButton = screen.getByText('Spotify');
        fireEvent.click(spotiButton);

        await waitFor(() => {
            waitFor(() => {
                expect(screen.getByText('Your Current Spotify Tracks')).toBeInTheDocument();
            });

            const topTracksButton = screen.getByText('Your Current Spotify Tracks');
            fireEvent.click(topTracksButton);

            waitFor(() => {
                expect(screen.getByText('YUM YUM')).toBeInTheDocument();
            });
        });
    });

    it('renders genre-based recommendations from Spotify', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <RecommendationsPage />
                    </ChakraProvider>
                </Router>
            );
        });

        const spotiButton = screen.getByText('Spotify');
        fireEvent.click(spotiButton);

        await waitFor(() => {
            waitFor(() => {
                expect(screen.getByText('Spotify Recommendations')).toBeInTheDocument();
            });

            const topTracksButton = screen.getByText('Spotify Recommendations');
            fireEvent.click(topTracksButton);

            const genreButton = screen.getByText('Genre-based');
            fireEvent.click(genreButton);

            waitFor(() => {
                expect(screen.getByText('Faithfully')).toBeInTheDocument();
            });
        });
    });
});
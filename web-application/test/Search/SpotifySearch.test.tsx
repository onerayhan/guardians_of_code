import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { act } from '@testing-library/react';
import SpotifySearch from "../../src/components/Search/SpotifySearch";

// Create a mock instance for axios
const mock = new MockAdapter(axios);

jest.mock('react-auth-kit', () => ({
    useAuthUser: () => jest.fn().mockReturnValue({
        username: 'testuser'
    })
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Search', () => {

    beforeEach(() => {
        // Mock for fetchSearchResults
        mock.onPost("http://51.20.128.164/spoti/search/testuser").reply(config => {
            const requestData = JSON.parse(config.data);
            if (requestData.type && requestData.query) {
                if (requestData.type.includes("track")) {
                    return [200, {
                        tracks: {
                            items: [
                                {
                                    album: {
                                        images: [
                                            {
                                                url: "https://i.scdn.co/image/ab67616d0000b2734121faee8df82c526cbab2be"
                                            }
                                        ],
                                        name: "Thriller 25 Super Deluxe Edition",
                                        release_date: "2008-02-08"
                                    },
                                    artists: [
                                        {
                                            name: "Michael Jackson"
                                        }
                                    ],
                                    id: "3S2R0EVwBSAVMd5UMgKTL0",
                                    name: "Thriller",
                                    duration_ms: 357266
                                }
                            ]
                        }
                    }
                ];
                } else if (requestData.type.includes("album")) {
                    return [200, {
                        albums: {
                            items: [
                                {
                                    images: [
                                        {
                                            url: "https://i.scdn.co/image/ab67616d0000b273e421d19097d64baf9563a144"
                                        }
                                    ],
                                    name: "Weather Systems",
                                    release_date: "2012-04-16",
                                    artists: [
                                        {
                                            name: "Anathema"
                                        }
                                    ],
                                    id: "6Cg7XeUp13Zk5W2kHIVP2f"
                                }
                            ]
                        }
                    }];
                } else if (requestData.type.includes("artist")) {
                    return [200, {
                        artists: {
                            items: [
                                {
                                    name: "Anathema",
                                    followers: {
                                        total: 352226
                                    },
                                    genres: [
                                        "gothic metal",
                                        "progressive doom",
                                        "progressive metal"
                                    ],
                                    images: [
                                        {
                                            url: "https://i.scdn.co/image/ab6761610000e5eb3b2f51bb865ea1d25c236789"
                                        }
                                    ],
                                    id: "0ZXKT0FCsLWkSLCjoBJgBX",
                                    popularity: 47
                                }
                            ]
                        }
                    }
                    ];
                }
            }
            return [404];
        });

        // Mock for get_genre_of_song
        mock.onPost("http://51.20.128.164/spoti/search/testuser", { type: ["artist"] }).reply(config => {
            const requestData = JSON.parse(config.data);
            if (requestData.query) {
                return [200, {
                    artists: {
                        items: [{
                            genres: ["testgenre"]
                        }]
                    }
                }];
            }
            return [404];
        });
    });


    it('searches albums on spotify', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <SpotifySearch />
                    </ChakraProvider>
                </Router>
            );
        });

        const songButton = screen.getByText('Song');
        fireEvent.click(songButton);

        await waitFor(() => {
            waitFor(() => {
                expect(screen.getByText('Album')).toBeInTheDocument();
            });

            const albumButton = screen.getByText('Album');
            fireEvent.click(albumButton);

            const textInput = screen.getByPlaceholderText('Enter your search...');
            fireEvent.change(textInput, {target: {value: 'Song Name'}});

            const settingsButton = screen.getByText('Search');
            fireEvent.click(settingsButton);

            waitFor(() => {
                expect(screen.getByText('Weather Systems')).toBeInTheDocument();
            });
        });
    });

    it('searches performers on spotify', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <SpotifySearch />
                    </ChakraProvider>
                </Router>
            );
        });

        const songButton = screen.getByText('Song');
        fireEvent.click(songButton);

        await waitFor(() => {
            waitFor(() => {
                expect(screen.getByText('Artist')).toBeInTheDocument();
            });

            const albumButton = screen.getByText('Artist');
            fireEvent.click(albumButton);

            const textInput = screen.getByPlaceholderText('Enter your search...');
            fireEvent.change(textInput, {target: {value: 'Song Name'}});

            const settingsButton = screen.getByText('Search');
            fireEvent.click(settingsButton);

            waitFor(() => {
                expect(screen.getByText('Anathema')).toBeInTheDocument();
            });
        });
    });

    it('searches songs on spotify', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <SpotifySearch/>
                    </ChakraProvider>
                </Router>
            );
        });

        const songButton = screen.getByText('Song');
        fireEvent.click(songButton);

        await waitFor(() => {
            waitFor(() => {
                expect(screen.getByText('Song')).toBeInTheDocument();
            });

            const textInput = screen.getByPlaceholderText('Enter your search...');
            fireEvent.change(textInput, {target: {value: 'Song Name'}});

            const settingsButton = screen.getByText('Search');
            fireEvent.click(settingsButton);

            waitFor(() => {
                expect(screen.getByText('Thriller')).toBeInTheDocument();
            });
        });
    });
});
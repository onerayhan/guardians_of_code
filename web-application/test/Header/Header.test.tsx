import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import Header from "../../src/components/Header";
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { act } from '@testing-library/react';

// Create a mock instance for axios
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

describe('Header', () => {

    it('navigates to Analysis', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Header />
                    </ChakraProvider>
                </Router>
            );
        });

        const analysisButton = screen.getByText('Analysis');
        fireEvent.click(analysisButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/testuser/analysis');
        });
    });

    it('navigates to Friends', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Header />
                    </ChakraProvider>
                </Router>
            );
        });

        const friendsButton = screen.getByText('Friends');
        fireEvent.click(friendsButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/testuser/friends');
        });
    });

    it('navigates to Rating', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Header />
                    </ChakraProvider>
                </Router>
            );
        });

        const ratingButton = screen.getByText('Rating');
        fireEvent.click(ratingButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/testuser/rating');
        });
    });

    it('navigates to Recommendations', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Header />
                    </ChakraProvider>
                </Router>
            );
        });

        const recomButton = screen.getByText('Recommendations');
        fireEvent.click(recomButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/testuser/recommendations');
        });
    });

    it('navigates to Search', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Header />
                    </ChakraProvider>
                </Router>
            );
        });

        const searchButton = screen.getByText('Search');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/testuser/search');
        });
    });
});
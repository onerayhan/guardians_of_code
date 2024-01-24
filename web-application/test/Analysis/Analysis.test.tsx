import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { act } from '@testing-library/react';
import Analysis from "../../src/pages/Analysis";

jest.mock('react-auth-kit', () => ({
    useAuthUser: () => jest.fn().mockReturnValue({
        username: 'testuser'
    }),
    useIsAuthenticated: () => jest.fn(),
    useSignOut: () => jest.fn()
}));

describe('Analysis Component', () => {

    it('displays Dropdown elements when is clicked', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Analysis />
                    </ChakraProvider>
                </Router>
            );
        });

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: 'Best Songs by Era' } });
    });

    it('displays MainChart when Chart tab is clicked', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Analysis />
                    </ChakraProvider>
                </Router>
            );
        });

        fireEvent.click(screen.getByText('Chart'));

        await waitFor(() => {
           expect(screen.getByText('Your Charts')).toBeInTheDocument()
        });
    });

    it('displays Share screen when tab is clicked', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Analysis />
                    </ChakraProvider>
                </Router>
            );
        });

        fireEvent.click(screen.getByText('Share Analysis'));

        await waitFor(() => {
            expect(screen.getByText('Share Your Analysis')).toBeInTheDocument()
        });
    });

    it('displays Export data screen when tab is clicked', async () => {
        await act(async () => {
            render(
                <Router>
                    <ChakraProvider>
                        <Analysis />
                    </ChakraProvider>
                </Router>
            );
        });

        fireEvent.click(screen.getByText('Export Data'));

        await waitFor(() => {
            expect(screen.getByText('Export your Rating Data')).toBeInTheDocument()
        });
    });
});
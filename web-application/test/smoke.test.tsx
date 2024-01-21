// Import necessary libraries
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {AuthProvider} from "react-auth-kit";
import App from '../src/App';
import {ChakraProvider} from "@chakra-ui/react";
import {SpotifyProvider} from "../src/contexts/SpotifyContext";

// Mock useUserEntry
jest.mock('../src/contexts/UserEntryContext', () => ({
    useUserEntry: () => ({
        isUserEntryVisible: false,
        formType: null,
        hideUserEntry: jest.fn()
    })
}));

describe('App Component', () => {
    it('renders without crashing', () => {
        render(
            <ChakraProvider>
                <AuthProvider
                    authType={"cookie"}
                    authName={"_auth"}
                    cookieDomain={window.location.hostname}
                    cookieSecure={false}
                >
                    <SpotifyProvider>
                        <App />
                    </SpotifyProvider>
                </AuthProvider>
            </ChakraProvider>
        );
    });
});
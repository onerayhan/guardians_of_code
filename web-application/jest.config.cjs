module.exports = {
    preset: 'ts-jest',
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.jsx?$": "babel-jest"
    },
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        "\\.(gif|ttf|eot|svg|png)$": "identity-obj-proxy"
    },
    transformIgnorePatterns: [
        "/node_modules/(?!react-auth-kit).+\\.(js|jsx|ts|tsx)$"
    ],
    testEnvironment: 'jsdom',
    setupFiles: ['./jest.stubs.cjs']
};

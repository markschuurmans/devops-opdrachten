/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',

    coveragePathIgnorePatterns: [
        '/node_modules/'
    ],

    preset: '@shelf/jest-mongodb',

    coverageThreshold: {
        global: {
            lines: 80
        }
    }
};

module.exports = config;
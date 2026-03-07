/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',

    coveragePathIgnorePatterns: [
        '/node_modules/'
    ],

    preset: '@shelf/jest-mongodb',
};

module.exports = config;
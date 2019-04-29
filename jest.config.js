module.exports = {
    preset: 'ts-jest',
    verbose: true,
    transformIgnorePatterns: [],
    transform: {
        ".*(?:ts|tsx|js|xml|glsl)$": "ts-jest",
    },
    globals: {
        "ts-jest": {
            tsConfig: {
                experimentalDecorators: true,
            }
        }
    }
};
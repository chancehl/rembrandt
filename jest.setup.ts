import { mswServer } from './src/mocks/server'

// Establish API mocking before all tests.
beforeAll(() => mswServer.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => mswServer.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => mswServer.close())

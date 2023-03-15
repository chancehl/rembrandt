import { createClient } from 'redis'

type RedisClient = ReturnType<typeof createClient>

/**
 * A singleton for managing the connection to the redis cache
 */
export class RedisClientManager {
    private static instance: RedisClient

    /** Private constructor so this class can't get accidentally newed up */
    private constructor() {}

    /**
     * Creates an instance of the redis client based on stage
     *
     * @returns redis client
     */
    private static createClientInstance() {
        if (process.env.NODE_ENV !== 'development') {
            return createClient({ url: 'redis://redis:6379' })
        } else {
            return createClient()
        }
    }

    /**
     * Gets the instance if one exists, otherwise creates one
     *
     * @returns redis client
     */
    public static getInstance(): RedisClient {
        if (RedisClientManager.instance == null) {
            this.instance = this.createClientInstance()
        }

        return this.instance
    }
}

import { createClient } from 'redis'

type RedisClient = ReturnType<typeof createClient>

export class RedisClientManager {
    private static instance: RedisClient

    private constructor() {}

    private static createClientInstance() {
        if (process.env.NODE_ENV !== 'development') {
            return createClient({ url: 'redis://redis:6379' })
        } else {
            return createClient()
        }
    }

    public static getInstance(): RedisClient {
        if (RedisClientManager.instance == null) {
            this.instance = this.createClientInstance()
        }

        return this.instance
    }
}

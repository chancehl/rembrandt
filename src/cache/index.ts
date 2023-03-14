import { createClient } from 'redis'

type RedisClient = ReturnType<typeof createClient>

export class RedisClientManager {
    private static instance: RedisClient

    private constructor() {}

    public static getInstance(): RedisClient {
        if (RedisClientManager.instance == null) {
            this.instance = createClient()
        }

        return this.instance
    }
}

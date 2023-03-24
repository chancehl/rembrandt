import { PrismaClient } from '@prisma/client'

export class DbManager {
    private static instance: PrismaClient

    private constructor() {}

    public static async connect(): Promise<PrismaClient> {
        if (!DbManager.instance) {
            const dbInstance = new PrismaClient()
            await dbInstance.$connect()

            DbManager.instance = dbInstance
        }

        return DbManager.instance
    }
}

import { PrismaClient } from '@prisma/client'

import { EmbedService } from './embedService'
import { MetCollectionService } from './metCollectionService'
import { PushService } from './pushService'
import { SummaryService } from './summaryService'

export type InjectableServices = {
    metCollectionService: MetCollectionService
    embedService: EmbedService
    summaryService: SummaryService
    pushService: PushService
    dbClient: PrismaClient
}

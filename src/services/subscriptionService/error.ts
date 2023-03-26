export class SubscriptionDoesNotExistError extends Error {
    constructor(guildId: string) {
        super(`Guild ${guildId} does not have an existing subscription`)
    }
}

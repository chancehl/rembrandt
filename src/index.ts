import dotenv from 'dotenv'

// init .env vars
dotenv.config()

console.log('hello world!', process.env.DISCORD_BOT_TOKEN)

import { botCommands } from "../bot-service/command/getData.js"

export async function BadRequest(error: Error) {
    botCommands.errors++    
}


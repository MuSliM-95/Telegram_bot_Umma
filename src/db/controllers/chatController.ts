import { ChatTypes } from "../../types/global.js"
import Chat from "../models/Chat.js"


export const chatController = {

    getChat: async (): Promise<string[] | undefined> => {
        try {
            const chatId = await Chat.findAll({
                attributes: ['chatId']
            })
            const id = chatId?.map(el => el.chatId)
            return id
        } catch (error) {
            console.log((error as Error).message);
        }
    },

    addChat: async ({ first_name, chatId, chat }: ChatTypes): Promise<ChatTypes | undefined> => {
        try {
            const getChat = await Chat.findOne({ where: { chatId } })
            if (!getChat) {
                const data = await Chat.create({
                    first_name,
                    chatId,
                    chat,
                    block: false
                })

                return data
            }
            if (getChat.block) {
                getChat?.update({ chat: false })
                await getChat.save()
                return
            }
            getChat?.update({ chat })

            await getChat.save()

            if (getChat) {
                return getChat
            }

        } catch (error) {
            console.log((error as Error).message);
        }
    },

    getChatId: async (chatId: number): Promise<ChatTypes | void> => {
        try {
            const data = await Chat.findOne({ where: { chatId } })
            if (data) {
                return data
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    },

    getChatFirst_name: async (first_name: string): Promise<ChatTypes | void> => {
        try {
            const data = await Chat.findOne({ where: { first_name } })
            if (data) {
                return data
            }

        } catch (error) {
            console.log((error as Error).message.toString());
        }
    },


    updateChat: async ({ chatId, block }: ChatTypes): Promise<boolean | void> => {
        try {
            const data = await Chat.findOne({ where: { chatId } })

            data?.update({ block, chat: false })

            await data?.save()

            if (data) {
                return data?.block
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    },

}
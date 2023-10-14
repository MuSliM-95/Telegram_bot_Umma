import { DataModel } from "../models/dataModel.js";
import { Request } from "express";
import { Response } from 'express';
import { addressInfoAdminChat } from "../../options.js";
import { Bot, ChatTypes, UpdateAddress } from "../../types/global.js";
import { Chat } from "../models/chatModel.js";
import { updatePhoto } from "../middleWares/upload.js";
import dotenv from 'dotenv'

dotenv.config()

export const dataController = {
    postData: async (req: Request, res: Response): Promise<void> => {
    
        const {name, region, place, city, prayer, address, location, time } = req.body
        const coordinates = location.split(",")
        const photo = req.file 
        try {
            const data = await DataModel.create({
                title: name,
                region,
                city,
                place,
                prayer,
                photo: { 
                    image: photo?.filename || "",
                },
                address, 
                location: coordinates,
                time,
            })
    
            res.json(data)
        } catch (error) {
            console.log((error as Error).message);

        }
    },

    getAddresses: async (req:Request, res:Response) => { 
      const location = JSON.parse(req.params.jsonLocation)
      const { topLeft, bottomRight } = location
    
      try {
       const data = await DataModel.find()

       const filterAddresses = data.filter(address => {
        if(address.location[0] >= topLeft[0] && address.location[0] <= bottomRight[0]
           && address.location[1] >= topLeft[1] &&  address.location[1] <= bottomRight[1] ) {
            return address
          }
       })
             
        res.json(filterAddresses)

     } catch (error) {
        console.log((error as Error).message);
     }
    },
    
    getAdminInfo: async (req: Request, res: Response) => {
      try {
       const data = {
        token: process.env.TOKEN,
        chatId: process.env.CHAT_ID
       }

        res.json(data)
      } catch (error) {
        console.log((error as Error).message);
      }
    },

     getAddressId: async (id: string, bot:Bot) => {
        try {
          const data = await DataModel.findById(id)
          if(data) {
             await addressInfoAdminChat(data, bot)
          }
      
        } catch (error) {
          console.log((error as Error).message);
        }
     },

      deleteAddress: async (addressId:string, obj:Bot) => {
        const {id, bot} = obj
        try {
       const data = await DataModel.findByIdAndDelete(addressId) 
       
        
       if(data) {
       await bot.telegram.sendMessage(id, "Адрес удален")
       }
        
       } catch (error) {
        console.log((error as Error).message);
       }
      },

      addChat: async ({first_name, chatId, chat }: ChatTypes) => {
        try {
        const getChat = await Chat.findOne({chatId})
        if(!getChat) {
        const data = await Chat.create({
            first_name,
            chatId,
            chat
           })  

        return data
        } 
       
        const data = await Chat.findOneAndUpdate({chatId}, {
          chat
         },{new: true})

         if(data) {
           return data
         }
        
        } catch (error) {
          console.log((error as Error).message);
        }
      },

      getChatId: async (chatId:number) => {
        try {
          const data = await Chat.findOne({chatId})
          if(data) {
            return data
          }
        } catch (error) {
          console.log((error as Error).message);
        }
      },

      getChatFirst_name: async (first_name:string) => {
        try {
          const data = await Chat.findOne({first_name})
          if(data) {           
            return data
          }

        } catch (error) {
          console.log((error as Error).message.toString());
        }
      },

      updateChat: async ({chatId, block }:ChatTypes) => {
       try {
        const data = await Chat.findOneAndUpdate({chatId}, {
          block
        }, {new: true})
        if(data) {
          return data?.block
        }
       } catch (error) {
        console.log((error as Error).message);
       }
      },

      updateAddress: async (params : UpdateAddress) => {
        const { chatId, photo, botObj } = params
        const addressId = chatId.split(": ")[1]  
        await  updatePhoto(params)
        
        try {
          const data = await DataModel.findOneAndUpdate({_id: addressId}, {
            photo: {
              image: `${photo[0].file_id}.png` || "",
            }
          }, {new: true})
          if(data) {
          await  addressInfoAdminChat(data, botObj)
          }
        } catch (error) {
          console.log((error as Error).message);
        }
      }
}
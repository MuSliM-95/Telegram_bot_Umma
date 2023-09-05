import { DataModel } from "../models/dataModel.js";
import { Request } from "express";
import { Response } from 'express';
import { AdminInfo } from "../models/adminInfoModel.js";
import { addressInfoAdminChat } from "../../options.js";
import { Bot } from "../../types/global.js";

export const dataController = {
    postData: async (req: Request, res: Response): Promise<void> => {
    
        const {name, region, place, city, prayer, address, location   } = req.body
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
                location: coordinates
            })
    
            res.json(data)
        } catch (error) {
            console.log((error as Error).message);

        }
    },

    getAddressesAll: async (req:Request, res:Response) => {
     try {
       const data = await DataModel.find()

       res.json(data)

     } catch (error) {
      console.log((error as Error).message);
     }
    },

    getRegion: async () => {
        try {
            const data = await DataModel.find()

            return data 
 
        } catch (error) {
            console.log((error as Error).message);
        }

    },
    
    postAdminInfo: async (req: Request, res: Response) => {
        const {token, botToken, chatId} = req.body
        try {
             await AdminInfo.create({
             token,
             botToken,
             chatId 
            })
        } catch (error) {
             console.log((error as Error).message);
        }
    },

    getAdminInfo: async (req: Request, res: Response) => {
      try {
        const data = await AdminInfo.find()

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
      }

}
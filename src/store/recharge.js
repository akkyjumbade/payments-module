import { http } from "../config"

const recharge = async (inputs) => {
   return new Promise(async (resolve, reject) => {
      try {

         const {data} = await http.post('/wp-json/app/recharge/do_recharge', inputs)
         if(data.ok) {
            resolve(data.data)
         } else {
            reject(data.errors)
         }
      } catch (error) {
         reject(error)
      }
   })
}

export default recharge

import axios from 'axios';


export default async function handler(req, res) {
   try {
      console.log("req", req);
      const { pid } = req.query
      console.log("pid", pid);
      
      const response = await axios.get(`http://www.ghibli.jp/gallery/${pid}`, {
         responseType: 'arraybuffer'  /* or responseType: 'arraybuffer'  */
      })
      //res.set('Content-Type', 'image/jpeg')
      res.status(200).send(response.data);
   } catch (error) {
      console.error(error)
      return res.status(error.status || 500).end(error.message)
   }
}
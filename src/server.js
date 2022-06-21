import dotenv  from 'dotenv';
import app from "./app.js";
// import { databaseConn } from './config/database.js';

import apiErrorHandler from "./error/api-error-handler.js"
import { mongoConnection } from './new-config/new-databaseConn.js';




dotenv.config()  


// databaseConn()
mongoConnection()



app.get("/", (req, res) =>{
 res.send("index")
})


app.use(apiErrorHandler) 
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
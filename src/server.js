import dotenv  from 'dotenv';
import app from "./app.js";
import databaseConnection from './config/database.js'
import apiErrorHandler from "./error/api-error-handler.js"




dotenv.config()  


databaseConnection()

app.get("/", (req, res) =>{
 res.send("index")
})


app.use(apiErrorHandler) 
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
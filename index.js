import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import moment from "moment"; //for formatting unix timestamp

const app = express();
const port= 3000;
const API_URL ="https://api.openweathermap.org/data/2.5/forecast?";
const API_key = "77485aee81b89727125f4bdab00dfc30"
var time = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res) =>{
    console.log(req.body);
    res.render("index.ejs");
})

app.post("/get-weather", async(req,res) =>{
    try{
        console.log(`geostationary coordinates latitude${req.body.lat} longitude${req.body.lon}`);
        console.log(`${API_URL}lat=${req.body.lat}&lon=${req.body.lon}&appid=${API_key}`)
        
        const response = await axios.post(`${API_URL}lat=${req.body.lat}&lon=${req.body.lon}&cnt=8&appid=${API_key}&units=metric`);
        const timezone = response.data.city['timezone'];
        console.log(moment.utc(response.data.list.dt_txt).add(timezone,'s').format("DD-MM HH:MM"));
        response.data.list.forEach(element => {
            time.push(moment.utc(element.dt_txt).add(timezone,'s').format("DD-MMM HH:MM"));
            
        });
        console.log(response.data.cnt);
        console.log(time);
        res.render("index.ejs",{
            weathers: response.data.list,
            cityName: response.data.city.name,
            country: response.data.city.country,
            sunrise: moment.unix(response.data.city.sunrise).utc().add(timezone,'s').format("HH:MM"),
            sunset: moment.unix(response.data.city.sunset).utc().add(timezone,'s').format("HH:MM"),
            timestamp: time,
        })
    }catch (error) {
        console.error("Failed to make request:", error.message);
        console.log(error.request);
        res.render("index.ejs", {
          error: error.message,
        });
    }
})

app.listen(port,() =>{
    console.log(`the server is listening on the port ${port}`);
})
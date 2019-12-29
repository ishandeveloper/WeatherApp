const express = require('express');
const path = require('path');
const app = express();

const request = require('request');

const publicDirectoryPath = path.join(__dirname, './public');
const port = 8080;

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/weather",function(req,res){
    //API CALL or any xml request is an async task therefore we need to make a call back or promise
    let temp = tellWeather(req.query.city,function(temp){
        console.log(temp);
        if(temp == undefined)
        {
            res.status(400).send({
                error:"Error"
            });
        }else{
            //by default if we don't set any status it is 200
            res.status(200).send({
                result:temp
            });
        }
    });
})

app.listen(8080,function(){
    console.log("Server Up At " + port);
})

function tellWeather(cityName,callback){
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=3d4aceabae5e50851a4db466c7b89542&units=metric
    `;
    request({url:url,json:true},(error,response)=>{
        if(error)
        {
            return ;
        }
        const temp = response.body.main.temp;
        callback(temp);
    })
}
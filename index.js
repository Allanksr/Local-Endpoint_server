const express = require('express')  
const fs = require('fs')
const app = express()


class Server {
    static start(){
      
        app.listen(3000)
        console.log(`server running:  http://localhost:3000/exec?code_promo=aday`)
    }
}


let jsonDataOut = require('./output/fileOut.json')
let jsonDataIn = './input/fileIn.json'
app.get('/exec', async(req, res) => {
    const {code_promo} = req.query
    if(code_promo != undefined){  
        if(code_promo.length > 0) {
            await readFile().then(data => {
                var size = jsonDataOut.promo.length - 1
                var json = `${data}`;
                var parsedJson = JSON.parse(json)
                if(hasPromotionKey(parsedJson, code_promo)){
                    if(parsedJson[`${code_promo}`].used_times < parsedJson[`${code_promo}`].may_use_times){
                        jsonDataOut.promo[size].promo_found = true
                        jsonDataOut.promo[size].promo_type = code_promo
                        jsonDataOut.promo[size].promo_data = parsedJson[`${code_promo}`].promo_response
                        comsumePromotion(parsedJson, code_promo)
                    }else{
                        jsonDataOut.promo[size].promo_found = false
                        jsonDataOut.promo[size].promo_type = code_promo
                        jsonDataOut.promo[size].promo_data = 0   
                    }           
                }
            })
            res.write(JSON.stringify(jsonDataOut, null, 4))  
        }  
    }
  res.end()
})

async function readFile(){
    return fs.readFileSync(`${jsonDataIn}`)
}

function hasPromotionKey(parsedJson, promotionKey){
    return Object.prototype.hasOwnProperty.call(parsedJson, promotionKey)
}

function comsumePromotion(parsedJson, code_promo){
    parsedJson[`${code_promo}`].used_times += 1
    fs.writeFile(`${jsonDataIn}`, JSON.stringify(parsedJson, null, 4), ()=> {})
}

module.exports = Server
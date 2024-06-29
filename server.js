const puppeteer = require('puppeteer');
const express = require('express'); 
const serverless = require('serverless-http')
require('dotenv').config();
const url = process.env.url;  
var port = 2000 || process.env.PORT; 
const app = express(); 
const router = express.Router(); 


// app.use(express.bodyParser());
app.use('/public', express.static('public'));;
app.use(express.urlencoded({extended:true}))
app.use(express.json()); 
app.set('view engine' , 'ejs'); 


function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    })
}

app.get('/' , (req,res) => {
    res.render('index' , {data:[]}); 
})

app.get('/error' , (req,res) => {
    res.render('error',{data:[]}); 
})



app.post('/ID' , async (req,res) => {
    const browser = await puppeteer.launch({headless:true , defaultViewport:null ,  ignoreDefaultArgs: ['--disable-extensions']});
    const page = await browser.newPage();
    await page.goto(url); 
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")
    const check = await page.$('input[type="checkbox"]')
        await check.click()
        const submit1 = await page.$('input[type="submit"]')
        await submit1.click()
        await delay(2000)
        const Alhoyh = await page.$('input[type="text"]')
        await Alhoyh.type(req.body.ID)
        const submit2 = await page.$('input[type="submit"]')
        await submit2.click();
        await delay(2000)
        try {
            const qudrat =  await page.$eval('#myForm > fieldset:nth-child(11) > table > tbody > tr:nth-child(5) > td > div', el => el.innerText) ;
            const tahsile = await page.$eval('#myForm > fieldset:nth-child(11) > table > tbody > tr:nth-child(6) > td > div', el => el.innerText);
            const HighSchool = await page.$eval('#myForm > fieldset:nth-child(11) > table > tbody > tr:nth-child(2) > td > div', el => el.innerText); 
            const first = await page.$eval('#myForm > fieldset:nth-child(5) > table:nth-child(1) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > label', el => el.innerText) 
            const mid = await page.$eval('#myForm > fieldset:nth-child(5) > table:nth-child(1) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(4) > td:nth-child(3) > div > label', el => el.innerText) 
            const last = await page.$eval('#myForm > fieldset:nth-child(5) > table:nth-child(1) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(4) > td:nth-child(5) > div > label', el => el.innerText); 
            const dateofbirth = await page.$eval('#myForm > fieldset:nth-child(5) > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(3)', el => el.innerText); 
                let data = {
                    'Name':`${first}  ${mid}  ${last}`,
                    'Date' : dateofbirth, 
                    'Qudrat' : qudrat, 
                    'Tahsile': tahsile,
                    'Highschool':HighSchool
                }
               
                console.log(data)
                
                res.render('index', {data})
                // await page.close(); 
        } catch{
            // res.render('index');
            
            res.redirect('/error'); 
            
        }


}); 


app.use(function  (req, res) {
    res.status(404).render('error404');
});


app.listen(port)
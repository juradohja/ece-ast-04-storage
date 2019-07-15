import express = require('express');
import bodyparser = require('body-parser');
import { MetricsHandler, Metric } from './metrics'

const app = express();
const port: string = process.env.PORT || '8083';

const path = require('path');
app.use(express.static(path.join(__dirname, '/../public')));

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.get('/metrics', (req: any, res: any) => {
    MetricsHandler.get((err: Error | null, result?: any) => {
        if (err) {
            throw err
        }
        res.json(result)
    })
});

app.get('/', (req: any, res: any) => {
    res.write('Hello world');
    res.end()
});

app.get(
    '/hello',
    (req: any, res: any) => {
        process.stdout.write("Hello");
        const name : string = req.query.name;
        res.status(200).render('hello.ejs', {name: name});
    }
);

//POST
app.post('/metrics', (req: any, res: any) => {


    if(req.body.value){
        console.log("something recieved");
      const metric = new Metric(new Date().getTime().toString(), parseInt(req.body.value));
      new MetricsHandler().save(metric, (err: any, result: any) => {
        if (err)
          return res.status(500).json({error: err, result: result});
        res.status(201).json({error: err, result: true})
      })
    }else{
      return res.status(400).json({error: 'Wrong request parameter',});
    }
  })

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log(`server is listening on port ${port}`)
});
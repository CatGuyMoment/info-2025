const express = require('express');

const app = express();
const fs = require('fs');
const { type } = require('os');
const path = require('path');

const sqlite3 = require('sqlite3');

const pagesPath = path.join(__dirname, 'pages');


const mainDB = new sqlite3.Database('main.db',sqlite3.OPEN_READWRITE,(err) => {
    if (err) {
        console.log('database init failed', err)
        return
    }
})

mainDB.exec(`
    create table if not exists feedback (
        email text,
        feedback text
)
    
`)


//input:  search unigrams (array of strings)
//output: array of href urls, along with their occurrences

function search_pages(query,max_results) {
    const urls = [];
    const files =  fs.readdirSync(pagesPath)

        
    files.forEach(function (fileName) {
            const relativeExpressPath = path.join('/pages',fileName);
            const absolutePath = path.join(pagesPath,fileName,'keywords.txt');
            const content = fs.readFileSync(absolutePath).toString();

            const dataEntry = [relativeExpressPath,0];


            for (const wordToTestAgainst of query) {
                if (wordToTestAgainst === '') {
                    continue
                }
                let wordAmount = 0
                content.split(',').forEach((wordInPage) => {
                    if (wordInPage === wordToTestAgainst) {
                        wordAmount += 1
                    }
                });
                
                dataEntry[1] += wordAmount;
            }
            if (dataEntry[1] !== 0) {
                urls.push(dataEntry);
            }
    
        });

    return urls.sort((a,b) => {
        b[1] - a[1]
    })
    .slice(0,max_results)
}




app.get('/', (req, res) => {

   res.redirect('/pages/home')
});

app.get('/search',(req,res) => {
    const queries = req.query;
    
    const search_query = queries.q || 'NOQUERY'
    const max_results = queries.max_results || 10



    res.send(
        JSON.stringify(
            search_pages(search_query.split(' '),max_results)
        )

    );
})

// i really dont like doing this because csrf attack
app.get('/store-feedback',(req,res) => {
    const queries = req.query;
    
    const feedback = queries.feedback 
    const email = queries.email

    if (!!email && !!feedback && typeof(email) ==='string' && typeof(feedback) === 'string') {
        mainDB.prepare(`
                insert into feedback (email, feedback) values (?, ?)
                `)
                .run(email,feedback)
                .finalize();

        res.redirect('/pages/feedback?success=1')
    } else {
        res.redirect('/pages/feedback?success=0')
    }

    
})



app.get('/globalcss',(req,res) =>{
    res.sendFile(path.join(__dirname,'index.css'));
})



app.get('/pages/:pageName',(req,res) => {
    const page = `pages/${req.params.pageName}/index.html`;
    if (fs.existsSync(page)) {
         res.sendFile(path.join(__dirname,page )); 
    } else {
         res.sendStatus(404);
    }
})

app.get('/js/:pageName',(req,res) => {
    const page = `pages/${req.params.pageName}/index.js`;
    if (fs.existsSync(page)) {
         res.sendFile(path.join(__dirname,page )); 
    } else {
         res.sendStatus(404);
    }
})

app.get('/css/:pageName',(req,res) => {
    const page = `pages/${req.params.pageName}/index.css`;
    if (fs.existsSync(page)) {
         res.sendFile(path.join(__dirname,page )); 
    } else {
         res.sendStatus(404);
    }
})






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

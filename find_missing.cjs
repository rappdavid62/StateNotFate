const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const js=fs.readFileSync('app.js','utf8');
let match;
const re=/document\.getElementById\(['"]([^'"]+)['"]\)\.addEventListener/g;
while((match=re.exec(js))!==null){
    if(!html.includes('id="'+match[1]+'"')) {
        console.log(match[1]+' is missing!');
    }
}

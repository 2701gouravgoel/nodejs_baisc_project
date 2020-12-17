var express = require('express');
var app = express();

const bodyParser = require('body-parser');

const mongojs= require('mongojs');
const uri = "mongodb+srv://2701gouravgoel:<password>@cluster0-a6n1c.mongodb.net/test?retryWrites=true&w=majority";
var db=mongojs(uri,['student','progress']);

var addStudent = function(data){
    db.student.insert({name:data.name,email:data.email,semester:data.sem,cg:data.cg})
}

var editStudent = function(data){
    db.student.updateOne(
        { name:data.name,email:data.email,semester:data.sem },
        {
          $set: { "cg": data.cg, status: "P" },
          $currentDate: { lastModified: true }
        }
     )
}

var deleteStudent = function(data){
    db.student.remove( { name:data.name,email:data.email,semester:data.sem } )
}


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true })); 
app.get('/enter',function(req,res){
    res.send('Hello World')
})
app.get('/edit',function(req,res){
    res.send("data saved")
})
app.post('/readaction',function(req,res){
    var data = {
        name:req.body.name ,
        email:req.body.Email,
        sem:req.body.Sem
    }
    db.student.findOne({name:data.name,email:data.email,semester:data.sem},function(err,doc)
    {
        if(doc)
        {
            var info ={
				cg:doc.cg
            }
             res.send("cg "+ info.cg)   
        }
        else
            res.send("no user found for this sem")
    })
})
app.post('/myaction', function(req, res) {
    var data = {
        name:req.body.name ,
        email:req.body.Email,
        sem:req.body.Sem,
        cg:req.body.cg
    }
    addStudent(data);
    res.writeHead(301, { "Location": "http://127.0.0.1:8081/success.html"  });
        return res.end();
});
app.post('/deleteaction',function(req,res){
    var data = {
        name:req.body.name ,
        email:req.body.Email,
        sem:req.body.Sem
    }
    console.log("delete")
    deleteStudent(data);
    res.writeHead(301,{"Location": "http://127.0.0.1:8081/success.html"})
    return res.end();
})
app.post('/editaction', function(req, res) {
    var data = {
        name:req.body.name ,
        email:req.body.Email,
        sem:req.body.Sem,
        cg:req.body.cg
    }
    console.log("edit")
    editStudent(data);
    res.writeHead(301, { "Location": "http://127.0.0.1:8081/success.html"  });
        return res.end();
});
app.listen(8081, function() {
    console.log('Server running at http://127.0.0.1:8081/');
});

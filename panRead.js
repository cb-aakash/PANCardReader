var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var Tesseract = require('tesseract.js')

var server = http.createServer(function (req,res) {
  if (req.url === '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = '/Users/cb-aakash/Documents/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;

        var resu = Tesseract.recognize(files.filetoupload.name)
          .progress(function  (p) { console.log('progress', p)  })
          .catch(err => console.error(err))
          .then(function (result) {
            console.log(result.text)
            var myString = result.text;
            //var patt1 = /[a-zA-Z]+[0-9]+[a-zA-Z]+/;
            var patt1 = /[A-Z]{5}[0-9]{2}[A-Z0-9]{3}/;
            resu = myString.match(patt1);
            console.log('PAN number : ' +resu);

            process.exit(0)
            return resu;
          })
          res.write('File uploaded and moved!');
          res.write('PAN number : ' +resu);
        res.end();
      });
 });
  }
  else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('index2.html','utf-8').pipe(res);
  }
});

server.listen(3005,'127.0.0.1');

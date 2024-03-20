import express from "express";
import bodyParser from "body-parser";
import qr from "qr-image";
import fs from "fs";
const app=express();
const port=3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.render("index.ejs");
})
app.post("/submit", (req, res) => {
  const url = req.body.url;

  // Function to generate QR code
  const generateQRCode = () => {
      return new Promise((resolve, reject) => {
          let qr_svg = qr.image(url);

          qr_svg.on('error', function(err) {
              reject(err);
          });

          const outputPath = "c:/Users/JEEVITH/OneDrive/Documents/Web Dev/qr2/public/qr3.jpg";
          const outputStream = fs.createWriteStream(outputPath);

          outputStream.on('error', function(err) {
              reject(err);
          });

          qr_svg.pipe(outputStream);

          outputStream.on('finish', function() {
              console.log('QR code image generated successfully!');
              resolve(outputPath); // Resolve with the output path
          });
      });
  };

  // Function to write URL to file
  const writeURLToFile = () => {
      return new Promise((resolve, reject) => {
          fs.writeFile("URL.txt", url, (err) => {
              if (err) {
                  reject(err);
              } else {
                  console.log("File has been created");
                  resolve(); // Resolve without any value
              }
          });
      });
  };

  // Execute the functions sequentially using Promise.all
  Promise.all([generateQRCode(), writeURLToFile()])
      .then(([outputPath, _]) => {
          // Both operations completed successfully
          res.render("result.ejs");
      })
      .catch(err => {
          // An error occurred during QR code generation or file writing
          console.error(err);
          res.status(500).send("An error occurred.");
      });
});
app.post("/home",(req,res)=>{
  res.redirect("/");
})
app.listen(port,()=>{
    console.log("listening on port 3000");
})
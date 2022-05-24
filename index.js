const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  console.log(req);
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write(`
    <html>
    <head>
        <title>First Page</title>
    </head>
    <body>
    <h1>Hello Node!</h1>
    <a href='http://localhost:8000/read-message'>read from file</a>
    </br>
    <a href='http://localhost:8000/write-message'>write to file</a>
    </body>
    </html>
    `);
    res.end();
  }
  if (url === "/read-message") {
    fs.readFile("message.txt", "utf8", (err, data) => {
      if (err) throw err;
      res.statusCode = 303;
      res.write(`<h1>${data}</h1>`);
      return res.end();
    });
  }
  if (url === "/write-message") {
    res.write(`
    <html>
    <head>
        <title>First Page</title>
    </head>
    <body>
    <form  action= '/write-message' method='POST'>
      <input type="text" name="message" />
      <button type="submit">Submit</button>
    </form>
      </body>
      </html>
      `);
    res.end();
  }
  if (url === "/write-message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        if (err) throw err;
        res.statusCode = 302;
        return res.end();
      });
    });
  }
});
server.listen("8000");

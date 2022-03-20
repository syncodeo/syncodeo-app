// Packages
let Express = require('express');
let http = require('http');
let path = require('path');
let fs = require('fs');
const axios = require('axios');

// Création de l'app Express
let app = Express();

// Envoi des fichiers des dossiers build && static
app.use(Express.static(__dirname + '/build'));
app.use(Express.static(__dirname + '/static'));

// Pour le reste, renvoi sur l'application React
app.get('/*', function (req, res) {
    const filePath = path.resolve(__dirname, './build', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', async function (err, data) {
        if (err) {
            return console.log(err);
        }

        // Initialiser les valeurs par défaut des variables
        let title = 'Syncodeo';
        let description = 'Syncodeo is an online platform that synchronize videos and codes at the same place. Learn faster. Share better. Increase accessibility together. Through a unique platform.';
        let image = 'https://syncodeo.io/assets/logo.png';

        if (req.query.v) {
            try {
                const result = await axios({
                    method: 'GET',
                    url: 'http://localhost:3001/v1/videos/' + req.query.v,
                });
                title = result.data.title + " - Syncodeo";
                description = result.data.description;
                image = 'https://img.youtube.com/vi/' + req.query.v + '/maxresdefault.jpg';
            } catch(error){ }
        }

        // replace the special strings with server generated strings
        data = data.replace(/\$OG_TITLE/g, title);
        data = data.replace(/\$OG_DESCRIPTION/g, description);
        result = data.replace(/\$OG_IMAGE/g, image);
        res.send(result);
    });
});

// Création du serveur HTTP
let httpServer = http.createServer(app);

// Démarrage du serveur HTTP
let port = 3000;
let host = '0.0.0.0';
httpServer.listen(port, host, () => console.log(`Server started at http://${host}:${port}`));
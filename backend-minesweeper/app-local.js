const app = require('./app');
const port = 3000;
console.log(require('dotenv').config())
app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});
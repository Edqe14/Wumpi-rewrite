const express = require('express');
const app = express();

const Captcha = new (require('../../src/lib/captcha.js'))();

app.get('/', (req, res) => {
    const {buffer, text} = Captcha.generateImage();

    res.cookie('answer', text);
    console.log("[LO] Random ", text);

    res.end(buffer);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[LO] Captcha test server up on port ${PORT}`));
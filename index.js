const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    if (type === 'COMMENT' && data.status === 'pending') {
        const status = data.content.includes('sex') ? 'rejected' : 'approved';

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'COMMENT_MODERATED',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        }).catch(err => {
            console.log(err.message);
        });
    }

    res.status(201).send('CREATED');
});

app.listen(4003, () => {
    console.log("Listening on port 4003");
})
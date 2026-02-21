const fs = require('fs');
const https = require('https');

const apiKey = 'AIzaSyARa1AKOXXZAfmkFZ8aDV5Z7s6ddEMeLjg';
const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;

const payload = {
    "instances": [
        {
            "prompt": "Modern, stylish dashboard UI for a vehicle management app called CarVault, featuring a sleek digital twin concept. Style: Premium minimal fintech style, glassmorphism. Lighting: Cinematic soft glow. Colour palette: Dark mode, deep blacks, subtle neon blue and purple accents. Composition: Wide 16:9, centered dynamic web app layout. Mood: High-end, futuristic, professional. Level of detail: Photorealistic 4K, precise UI elements. Platform: Web app hero backdrop. Aspect ratio 16:9."
        }
    ],
    "parameters": {
        "sampleCount": 1,
        "aspectRatio": "16:9"
    }
};

const req = https.request(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}, res => {
    let body = [];
    res.on('data', chunk => { body.push(chunk); });
    res.on('end', () => {
        try {
            const dataStr = Buffer.concat(body).toString();
            const data = JSON.parse(dataStr);
            let base64 = data.predictions?.[0]?.bytesBase64;
            if (base64) {
                fs.writeFileSync('assets/images/hero-home.png', Buffer.from(base64, 'base64'));
                console.log('SUCCESS: Image saved to assets/images/hero-home.png');
            } else {
                console.log("No image data found. Response:", dataStr.substring(0, 500));
            }
        } catch (e) {
            console.error(e);
        }
    });
});

req.on('error', e => console.error(e));
req.write(JSON.stringify(payload));
req.end();

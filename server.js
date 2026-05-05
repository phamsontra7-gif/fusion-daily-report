const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load config
const configPath = path.join(__dirname, 'email_config.json');
let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

app.post('/send-email', async (req, res) => {
    const { markdown, html } = req.body;

    // Refresh config in case it changed
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const transporter = nodemailer.createTransport({
        service: config.smtp.service,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.pass
        }
    });

    const mailOptions = {
        from: config.smtp.user,
        to: config.recipients.join(', '),
        subject: `${config.subject} - ${new Date().toLocaleDateString('vi-VN')}`,
        text: markdown,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #1e3a8a;">FusionGroup Daily Report</h2>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
                    ${html}
                </div>
                <p style="font-size: 0.8em; color: #666; margin-top: 20px;">
                    This is an automated report from the FusionGroup Daily Dashboard.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send email', error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Email server running at http://localhost:${PORT}`);
});

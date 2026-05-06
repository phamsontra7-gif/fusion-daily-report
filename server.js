const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load config
const configPath = path.join(__dirname, 'email_config.json');

app.post('/send-email', async (req, res) => {
    const { markdown } = req.body;

    if (!markdown) {
        return res.status(400).send({ message: 'Markdown content is required' });
    }

    try {
        // Refresh config in case it changed
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        if (!config.smtp || config.smtp.user === 'your-email@gmail.com') {
            return res.status(400).send({ message: 'SMTP settings not configured in email_config.json' });
        }

        const transporter = nodemailer.createTransport({
            service: config.smtp.service,
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.secure,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.pass
            }
        });

        // Convert markdown to HTML
        const htmlContent = marked.parse(markdown);

        const mailOptions = {
            from: `"FusionGroup Reports" <${config.smtp.user}>`,
            to: config.recipients.join(', '),
            subject: `${config.subject} - ${new Date().toLocaleDateString('vi-VN')}`,
            text: markdown,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto;">
                    <div style="background: #1e3a8a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h2 style="color: white; margin: 0;">FusionGroup Daily Report</h2>
                    </div>
                    <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                        ${htmlContent}
                    </div>
                    <p style="font-size: 0.8em; color: #666; margin-top: 20px; text-align: center;">
                        This is an automated report from the FusionGroup Daily Dashboard.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', config.recipients.join(', '));
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


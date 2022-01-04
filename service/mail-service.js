const nodeMailer = require('nodemailer')

class MailService {

    constructor() {
        this.transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Account activation at ' + process.env.CLIENT_URL,
            text: '',
            html:
                `
                <div>
                    <h1>To activate your account please follow the link below:</h1>
                       <a href="${link}">Activation link: ${link}</a>
                </div>
                `
        })
    }
}

module.exports = new MailService()

const nodeMailer = require('nodemailer')
const axios = require('axios')
const {json} = require("express");

class MailService {
    //First version send email, using SMTP and nodemailer


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

    async sendAxiosMail(to, link) {
        const mailSubject = `Account activation at ${process.env.CLIENT_URL}`
        const mailHtml = `
        <div>   
            <h4>You got this email because you've registered at ${process.env.CLIENT_URL}</h4>
            <hr />
            <p>To activate your account please follow the link below:</p>
            <a href="${link}">Activation link: ${link}</a>
            <hr />
            <p>If you didn't register at ${process.env.CLIENT_URL}, please ignore this email.</p>
        </div>
        `
       await axios.post(process.env.TRUSTIFI_URL+'/api/i/v1/email', {
               "recipients":[{"email":to}],
               "title":mailSubject,
               "html": mailHtml
       }, {
           headers: {
               'x-trustifi-key': process.env.TRUSTIFI_KEY,
               'x-trustifi-secret': process.env.TRUSTIFI_SECRET
           }
       }).catch(err => {
           console.log(err.response.data)
       })
    }
}

module.exports = new MailService()

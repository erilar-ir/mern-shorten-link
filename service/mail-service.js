const nodeMailer = require('nodemailer')
const axios = require('axios')
const {json} = require("express");

const axiosTrustifyMailer = async (to, mailSubject, mailHtml) => {
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


    async sendSMTPActivationMail(to, link) {
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

    async sendActivationMail(to, link) {
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
        await axiosTrustifyMailer(to, mailSubject, mailHtml)
    }
    async sendResetMail(to, link) {
        const mailSubject = `Password reset request for your account at ${process.env.CLIENT_URL}`
        const mailHtml = `
        <div>   
            <h4>You got this email because you've asked for password reset at ${process.env.CLIENT_URL}</h4>
            <hr />
            <p>To reset your account password, please follow the link below:</p>
            <a style="font-size:1.5rem" href="${link}">Reset Password</a>
            <hr />
            <p>If you didn't ask for password reset at ${process.env.CLIENT_URL}, please ignore this email.</p>
        </div>
        `
        await axiosTrustifyMailer(to, mailSubject, mailHtml)
    }
    async sendResetConfirmationMail(to) {
        const mailSubject = `Password changing confirmation from ${process.env.CLIENT_URL}`
        const mailHtml = `
        <div>   
            <p>Just informing that your password had been changed successfully</p>  
        </div>
        `
        await axiosTrustifyMailer(to, mailSubject, mailHtml)
    }
}

module.exports = new MailService()

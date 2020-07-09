const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

module.exports = class Email {
    constructor(emailId, userName, password, senderId) {
        this.emailId = emailId;
        this.userName = userName;
        this.password = password;
        this.senderId = senderId;
    }

    async sendMail(name, to, subject, body, cc, bcc, attachments, subtitle, buttonText) {
        try {
            var mailGenerator = new Mailgen({
                theme: "default",
                product: {
                    name: "Onboardify",
                    link: "https://emproto.com/",
                    logo: "https://dbg9iyfq9bvr1.cloudfront.net/H1F0OcbsQJSCp1Ehep1g_Emproto%20Logo.png"
                }
            });
            var email = {
                body: {
                    name,
                    intro: subject,
                    action: {
                        instructions: subtitle,
                        button: {
                            color: '#ff8636', // Optional action button color
                            text: buttonText,
                            link: body
                        }
                    },
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
                }
            };

            let transporter = nodemailer.createTransport({
                host: "email-smtp.eu-west-1.amazonaws.com",
                port: 465,
                secure: true,
                rejectUnauthorized: false,
                auth: {
                    user: this.userName,
                    pass: this.password
                }
            });
            let mailOptions = {
                from: `"${this.senderId}" <${this.emailId}>`, // sender address
                to: to,
                cc: cc,
                subject: subject,
                text: mailGenerator.generatePlaintext(email),
                html: mailGenerator.generate(email),
                attachments: attachments
            };
            // send mail with defined transport object
            await transporter.sendMail(mailOptions);

        } catch (error) {
            console.log("Unable to send Email", error);
        }
    }
};

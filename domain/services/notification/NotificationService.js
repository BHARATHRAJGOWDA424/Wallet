const EmailService = require('../../../core/email/Email');
const SmsService = require('../../../core/sms/Sms');
const NotificationsRepository = require('../../../repositories/NotificationRepository');


module.exports = class NotificationService {


    constructor() {
        this.emailService = new EmailService(process.env.kAdminEmailId, process.env.kEmailUserName, process.env.kEmailPassword, process.env.kEmailSenderId)
        this.smsService = SmsService.create()
        this.notificationsRepository = new NotificationsRepository()
    }


    async sendEmail(name, email, title, body, attachments, subtitle, buttonText) {

        try {

            await this.emailService.sendMail(name, email, title, body, null, null, attachments, subtitle, buttonText)

        } catch (error) {

            throw error
        }
    }


    // async broadcast(users, notificationTypes, category, subject, body, smsMessageBody) {

    //     try {


    //         let phNumbers = []
    //         let pushTokens = []

    //         for (let user of users) {

    //             await this.notificationsRepository.add({
    //                 title: subject,
    //                 message: body,
    //                 user: user._id,
    //                 category: category,
    //                 isRead: false
    //             })


    //             if (notificationTypes.indexOf(NotificationType.SMS) != -1) {
    //                 let ph = user.ph
    //                 if (ph) {
    //                     phNumbers.push(ph)
    //                 }
    //             }

    //             if (notificationTypes.indexOf(NotificationType.Push) != -1) {
    //                 let devices = await this.loginDeviceRepository.find({ user: user._id }, { messagingToken: 1, platform: 1 })
    //                 for (let device of devices) {
    //                     let token = device.messagingToken
    //                     let platform = device.platform

    //                     if (token != undefined && platform != undefined) {
    //                         pushTokens.push({ token: token, platform: platform })
    //                     }
    //                 }
    //             }
    //         }

    //         if (pushTokens.length > 0) {
    //             if (this.pushNotificationService) {
    //                 this.push(pushTokens, {
    //                     title: subject,
    //                     body: body,
    //                     sound: "default",
    //                     id: "0",
    //                     action: ""
    //                 })
    //             }
    //         }

    //         if (phNumbers.length > 0) {
    //             this.smsService.sendSMS(phNumbers, smsMessageBody)
    //         }
    //     } catch (error) {

    //         throw error
    //     }

    // }

    // async broadcastWithEachOwnMessage(usersList, body) {
    //     try {

    //         if (Array.isArray(usersList)) {
    //             if (usersList.length > 0) {
    //                 usersList.map(({ name, ph }) => {
    //                     this.smsService.sendSMS(ph, `Hi ${name},\n${body}`)
    //                 })
    //             }
    //         } else {
    //             this.smsService.sendSMS(usersList.ph, `Hi ${usersList.name},\n${body}`)
    //         }


    //     } catch (error) {
    //         throw error
    //     }
    // }

    // async push(pushTokens, payload) {

    //     try {

    //         let iOSTokens = pushTokens.filter(t => t.platform === PlatformType.iOS)
    //         iOSTokens = iOSTokens.map(t => t.token)
    //         if (iOSTokens.length > 0) {

    //             await this.pushNotificationService.send(iOSTokens, {
    //                 notification: payload,
    //             })
    //         }

    //         let androidTokens = pushTokens.filter(t => t.platform === PlatformType.Android)
    //         androidTokens = androidTokens.map(t => t.token)
    //         if (androidTokens.length > 0) {
    //             await this.pushNotificationService.send(androidTokens, {
    //                 notification: payload,
    //             })
    //         }


    //     } catch (error) {

    //         throw error
    //     }
    // }

    // async deinit() {
    //     this.pushNotificationService.deinit()
    // }
}
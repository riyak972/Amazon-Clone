import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendEmail = async (to: string, subject: string, html: string) => {
    const msg = {
        to,
        from: process.env.FROM_EMAIL as string,
        subject,
        html,
    };
    try {
        await sgMail.send(msg);
        // console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(error);
    }
};

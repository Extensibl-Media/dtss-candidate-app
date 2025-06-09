import { APP_NAME, BASE_URL } from '$lib/config/constants';
import { env } from '$env/dynamic/private';

export const EMAIL_TEMPLATES: Record<
	string,
	(...args: any[]) => { textEmail: string; htmlEmail: string; subject: string }
> = {
	welcomeEmail: () => {
		const textEmail = `
            Thanks for verifying your account with ${APP_NAME}.
            You can now sign in to your account at the link below:
            ${BASE_URL}/auth/sign-in
        `.trim();

		const htmlEmail = `
            <p>Thanks for verifying your account with ${APP_NAME}.</p>
            <p>You can now <a href="${BASE_URL}/auth/sign-in">sign in</a> to your account.</p>
        `.trim();

		const subject = `Welcome to ${APP_NAME}`;

		return { textEmail, htmlEmail, subject };
	},
	verificationEmail: (token: string) => {
		const verifyEmailURL = `${BASE_URL}/auth/verify/email-${token}`;
		const textEmail = `Please visit the link below to verify your email address for your ${APP_NAME} account.\n\n
            ${verifyEmailURL} \n\nIf you did not create this account, you can disregard this email.`;
		const htmlEmail = `<p>Please click this <a href="${verifyEmailURL}">link</a> to verify your email address for your ${APP_NAME} account.</p>  <p>You can also visit the link below.</p><p>${verifyEmailURL}</p><p>If you did not create this account, you can disregard this email.</p>`;
		const subject = `Please confirm your email address for ${APP_NAME}`;

		return { textEmail, htmlEmail, subject };
	},
	passwordResetEmail: (token: string) => {
		const updatePasswordURL = `${BASE_URL}/auth/password/update-${token}`;

		const textEmail = `
            Please visit the link below to change your password for ${APP_NAME}:
            ${updatePasswordURL}
            
            If you did not request to change your password, you can disregard this email.
        `.trim();

		const htmlEmail = `
            <p>Please click this <a href="${updatePasswordURL}">link</a> to change your password for ${APP_NAME}.</p>
            <p>You can also visit the link below:</p>
            <p>${updatePasswordURL}</p>
            <p>If you did not request to change your password, you can disregard this email.</p>
        `.trim();

		const subject = `Change your password for ${APP_NAME}`;

		return { textEmail, htmlEmail, subject };
	},
	updateEmailAddressSuccessEmail: (token: string) => {
		const verifyEmailURL = `${BASE_URL}/auth/verify/email-${token}`;

		const textEmail = `
            Please visit the link below to verify your email address for your ${APP_NAME} account:
            ${verifyEmailURL}
        `.trim();

		const htmlEmail = `
            <p>Please click this <a href="${verifyEmailURL}">link</a> to verify your email address for your ${APP_NAME} account.</p>
            <p>You can also visit the link below:</p>
            <p>${verifyEmailURL}</p>
        `.trim();

		const subject = `Please confirm your email address for ${APP_NAME}`;

		return { textEmail, htmlEmail, subject };
	},
	possibleHijackAttemptEmail: (email: string, oldEmail: string) => {
		const textEmail = `
            Your ${APP_NAME} account email has been updated from ${oldEmail} to ${email}.
            If you DID NOT request this change, please contact support at: ${env.COMPANY_REPLY_TO_EMAIL} to revert the changes.
        `.trim();

		const htmlEmail = `
            <p>Your ${APP_NAME} account email has been updated from ${oldEmail} to ${email}.</p>
            <p>If you DID NOT request this change, please contact support at: ${env.COMPANY_REPLY_TO_EMAIL} to revert the changes.</p>
        `.trim();

		const subject = `Your email address for ${APP_NAME} has changed.`;

		return { textEmail, htmlEmail, subject };
	},
	clientStaffInviteEmail: (token: string, companyName: string) => {
		const verifyEmailURL = `${BASE_URL}/auth/invite/${token}`;

		const textEmail = `
            You have been invited by your employer to join ${companyName}'s workspace in ${APP_NAME}.
            
            Click the link below to accept the invitation and set up your account:
            ${verifyEmailURL}
            
            This invitation will expire in 7 days.
            
            If you weren't expecting this invitation, you can safely ignore this email.
            
            Best regards,
            The ${APP_NAME} Team
        `.trim();

		const htmlEmail = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to ${APP_NAME}</h2>
                    <p>You have been invited by your employer to join ${companyName}'s workspace in ${APP_NAME}.</p>
                    
                    <p style="margin: 24px 0;">
                            <a href="${verifyEmailURL}" 
                                 style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                                                text-decoration: none; border-radius: 4px; display: inline-block;">
                                    Accept Invitation
                            </a>
                    </p>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="background-color: #F3F4F6; padding: 12px; border-radius: 4px; word-break: break-all;">
                            ${verifyEmailURL}
                    </p>
                    
                    <p style="color: #6B7280; font-size: 14px;">This invitation will expire in 7 days.</p>
                    
                    <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">
                            If you weren't expecting this invitation, you can safely ignore this email.
                    </p>
            </div>
        `.trim();

		const subject = `You're invited to join ${companyName} on ${APP_NAME}`;

		return { textEmail, htmlEmail, subject };
	},
	adminUserInviteEmail: (token: string) => {
		const verifyEmailURL = `${BASE_URL}/auth/invite/${token}`;
		const textEmail = `
            You have been invited to join ${APP_NAME} as an admin user.
            Click the link below to accept the invitation and set up your account:
            ${verifyEmailURL}
            
            This invitation will expire in 7 days.
            
            If you weren't expecting this invitation, you can safely ignore this email.
        `.trim();
		const htmlEmail = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to ${APP_NAME}</h2>
                <p>You have been invited to join ${APP_NAME} as an admin user.</p>
                <p style="margin: 24px 0;">
                    <a href="${verifyEmailURL}"
                        style="background-color: #4F46E5; color: white; padding: 12px 24px;
                        text-decoration: none; border-radius: 4px; display: inline-block;">
                        Accept Invitation
                    </a>
                </p>
                <p>Or copy and paste this link into your browser:</p>
                <p style="background-color: #F3F4F6; padding: 12px; border-radius: 4px; word-break: break-all;">
                    ${verifyEmailURL}
                </p>
                <p style="color: #6B7280; font-size: 14px;">This invitation will expire in 7 days.</p>
                <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">
                    If you weren't expecting this invitation, you can safely ignore this email.
                </p>
            </div>
        `.trim();
		const subject = `You're invited to join ${APP_NAME} as an admin user`;
		return { textEmail, htmlEmail, subject };
	},
	workdayReminderEmail: (workdayDetails: {
		companyName: string;
		location: {
			address: string;
			city: string;
			state: string;
			zip: string;
		};
		date: string;
		workdayStart: string;
		workdayEnd: string;
	}) => {
		const { companyName, location, date, workdayStart, workdayEnd } = workdayDetails;
		const textEmail = `
            Reminder: Your shift at ${companyName} is scheduled for ${date}.
            Location: ${location.address}, ${location.city}, ${location.state} ${location.zip}
            Shift Start: ${workdayStart}
            Shift End: ${workdayEnd}
        `.trim();

		const htmlEmail = `
            <p>Reminder: Your shift at <strong>${companyName}</strong> is scheduled for <strong>${date}</strong>.</p>
            <p>Location: <strong>${location.address}, ${location.city}, ${location.state} ${location.zip}</strong></p>
            <p>Shift Start: <strong>${workdayStart}</strong></p>
            <p>Shift End: <strong>${workdayEnd}</strong></p>
        `.trim();

		const subject = `Workday Reminder for ${companyName} on ${date} | ${APP_NAME}`;

		return { textEmail, htmlEmail, subject };
	},
	invoiceReminderEmail: (invoiceLink: string, dueDate: string) => {
		const textEmail = `
            This is a reminder that your invoice is due on ${dueDate}.
            Please visit the link below to view and pay your invoice:
            ${invoiceLink}
            
            If you have any questions, please contact us.
        `.trim();
		const htmlEmail = `
            <p>This is a reminder that your invoice is due on <strong>${dueDate}</strong>.</p>
            <p>Please visit the link below to view and pay your invoice:</p>
            <p><a href="${invoiceLink}">${invoiceLink}</a></p>
            <p>If you have any questions, please contact us.</p>
        `.trim();
		const subject = `Invoice Reminder - Due on ${dueDate} | ${APP_NAME}`;
		return { textEmail, htmlEmail, subject };
	},
	invoicePaymentSuccessEmail: (invoiceLink: string, paymentDate: string) => {
		const textEmail = `
            Thank you for your payment! Your invoice has been successfully paid on ${paymentDate}.
            You can view your invoice at the link below:
            ${invoiceLink}
            
            If you have any questions, please contact us.
        `.trim();
		const htmlEmail = `
            <p>Thank you for your payment! Your invoice has been successfully paid on <strong>${paymentDate}</strong>.</p>
            <p>You can view your invoice at the link below:</p>
            <p><a href="${invoiceLink}">${invoiceLink}</a></p>
            <p>If you have any questions, please contact us.</p>
        `.trim();
		const subject = `Payment Confirmation - Invoice Paid on ${paymentDate} | ${APP_NAME}`;
		return { textEmail, htmlEmail, subject };
	},

	workdayCancelledEmail: (workdayDetails: {
		companyName: string;
		location: {
			address: string;
			city: string;
			state: string;
			zip: string;
		};
		date: string;
		workdayStart: string;
		workdayEnd: string;
	}) => {
		return {
			textEmail: `
            Your workday at ${workdayDetails.companyName} scheduled for ${workdayDetails.date} has been cancelled.\n
            Location: ${workdayDetails.location.address}, ${workdayDetails.location.city}, ${workdayDetails.location.state} ${workdayDetails.location.zip}\n
            Shift Start: ${workdayDetails.workdayStart}\n
            Shift End: ${workdayDetails.workdayEnd}\n
            If you have any questions, please contact us.
        `.trim(),
			htmlEmail: `
            <p>Your workday at <strong>${workdayDetails.companyName}</strong> scheduled for <strong>${workdayDetails.date}</strong> has been cancelled.</p>
            <p>Location: <strong>${workdayDetails.location.address}, ${workdayDetails.location.city}, ${workdayDetails.location.state} ${workdayDetails.location.zip}</strong></p>
            <p>Shift Start: <strong>${workdayDetails.workdayStart}</strong></p>
            <p>Shift End: <strong>${workdayDetails.workdayEnd}</strong></p>
            <p>If you have any questions, please contact us.</p>
        `.trim(),
			subject: `Workday Shift Cancelled | ${APP_NAME}`
		};
	}
};

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API)

sendTemplate = (to, from, templateId, templateData) => {
	const msg = {
		to,
		from: { name: 'Messenger ChatBot', email: from },
		templateId,
		dynamic_template_data: templateData
	};
	sgMail.send(msg)
		.then((response) => {
			console.log('mail-sent-successfully', { templateId, templateData });
			console.log('response', response);
		})
		.catch((error) => {
			/* log friendly error */
			console.error('send-grid-error: ', error.toString());
		});
};

module.exports = {
	sendTemplate,
};
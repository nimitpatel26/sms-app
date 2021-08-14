const handler = async (event) => {
    try {

        let num = event.queryStringParameters.num
        let language = event.queryStringParameters.language || 'en'
        let message = event.queryStringParameters.message || 'SMS APP Body'


        console.log('Number: ' + num)
        console.log('Message: ' + message)


        if (num.length !== 10) {
            return {statusCode: 400, body: "Invalid number!"}
        }

        if (message.length === 0) {
            return {statusCode: 400, body: "Invalid message!"}
        }


        const accountSid = process.env.TWILIO_ACCOUNT_ID
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const msgSvcId = process.env.TWILIO_MSG_SVC_ID;

        const credentials = JSON.parse(process.env.GOOGLE_TRANSLATE_API);
        const projectId = process.env.GOOGLE_PROJECT_ID;


        const isoCode = getLangIsoCode(language)
        if (isoCode.length === 0) {
            return {statusCode: 400, body: "Unable to detect language!"}
        }


        const {Translate} = require('@google-cloud/translate').v2;
        const translate = new Translate({projectId, credentials});

        message = await translateText(translate, message, isoCode);

        if (message.length === 0) {
            return {statusCode: 400, body: "Translation failed!"}
        }

        console.log('Message: ' + message);

        const client = require('twilio')(accountSid, authToken);
        let msg = await client.messages.create({
            to: num,
            body: message,
            messagingServiceSid: msgSvcId,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({message: `Success`}),
        };


    } catch (error) {
        console.log('ERROR:  ' + error + '\n' + JSON.stringify(error) + '\n');
        return {statusCode: 500, body: 'Unable to process request!'}
    }
}

async function translateText(translate, text, target) {
    let [translations] = await translate.translate(text, target);

    translations = Array.isArray(translations) ? translations : [translations];

    if (translations && translations.length > 0) {
        return translations[0];
    }
    return '';
}


function getLangIsoCode(language) {

    const mapping = {
        'english': 'en',
        'arabic': 'ar',
        'bengali': 'bn',
        'chinese': 'zh',
        'french': 'fr',
        'greek': 'el',
        'hindi': 'hi',
        'japanese': 'ja',
        'korean': 'ko',
        'portuguese': 'pt',
        'spanish': 'es',
    };

    if (mapping[language] !== undefined) {
        return mapping[language];
    }
    return '';
}

module.exports = {handler}

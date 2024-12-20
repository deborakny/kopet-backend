import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';


@Injectable()
export class NotificacaoService {


    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
    ) { }

    //emails para quais o mailgun permite enviar 
    emailsPermitidos: string[] = [
        'deborakuniy@gmail.com',
        'debora.n_@hotmail.com',
        'nicolas.jg.njg@gmail.com',
        'petplanet060@gmail.com'
    ]

    twilioAccountSID = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    twilioAuthToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    twilioPhoneNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    private _client = new Twilio(this.twilioAccountSID, this.twilioAuthToken)

    async enviarSMS(fone: string, msg: string) {
        try {
            const smsResponse = await this._client.messages.create({
                from: this.twilioPhoneNumber,
                to: `+55${fone}`,
                body: msg
            });
        } catch (e) {
            throw new NotAcceptableException(e);
        }
    }

    async enviarEmail(emails: string[], assunto: string, msg: string) {
        if (this.emailsValidos(emails).length>0) {
            try {
                console.log('ola: ', emails)
                const emailEnviado = await this.mailerService.sendMail({
                    to: emails,
                    from: this.configService.get<string>('FROM_EMAIL'),
                    subject: assunto,
                    text: msg,
                });
                console.log('email enviado: ', emailEnviado)
            } catch (e){
                throw new NotAcceptableException(e);
            }
        }
    }

    //Devido ao limite de e-mails autorizados pelo Mailgun (evitar try/catch)
    emailValido(email: string) {
        const valido = this.emailsPermitidos.filter(emailPermitido => emailPermitido.includes(email))[0]; //Devolve primeiro (e único) elemento
        return valido;
    }

    emailsValidos(emails: string[]) {
        const validos = emails.filter(email => {
            return this.emailsPermitidos.includes(email)
        }
        ); //Devolve primeiro (e único) elemento
        return validos;
    }
}

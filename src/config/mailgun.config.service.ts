import { MailerOptions, MailerOptionsFactory } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailgunConfigService implements MailerOptionsFactory {
    constructor(
        private configService: ConfigService
    ) { }
    createMailerOptions(): MailerOptions | Promise<MailerOptions> {
        return {
            transport: {
                host: 'smtp.mailgun.org', //host smtp
                secure: false, //regras de segurança do serviço smtp
                port: 587, // porta
                auth: { //dados do usuário e senha
                  user: this.configService.get<string>('MAILGUN_USERNAME'),
                  pass: this.configService.get<string>('MAILGUN_PASSWORD'),
                },
                ignoreTLS: true,
              },
              defaults: { // configurações que podem ser padrões
                from: '"',
              },
        }
    }

}
import type { LegalDocument, Locale } from './types';

/** Политика обработки персональных данных (шаблон). */
export const privacyPolicy: Record<Locale, LegalDocument> = {
  ru: {
    title: 'Политика обработки персональных данных',
    updatedAt: '2026-10-01',
    intro:
      'Настоящая Политика описывает, как оператор обрабатывает персональные данные пользователей сайта livewalls.app и приложения LiveWalls.',
    sections: [
      {
        id: 'operator',
        title: '1. Оператор персональных данных',
        paragraphs: [
          'Оператором персональных данных является ИП Иванов Иван Иванович (далее — Оператор). Контактные данные: hello@livewalls.app.',
          'Оператор обеспечивает обработку персональных данных в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».',
        ],
      },
      {
        id: 'data',
        title: '2. Какие данные обрабатываются',
        list: [
          'Email пользователя — для входа в личный кабинет, отправки ссылки-подтверждения и чека;',
          'Имя пользователя — для обращения в поддержку и персонализации письма;',
          'Данные о покупках — идентификатор заказа, сумма, дата и статус оплаты;',
          'Технические данные — IP-адрес, тип браузера и устройства, журнал посещений.',
        ],
      },
      {
        id: 'goals',
        title: '3. Цели обработки',
        list: [
          'предоставление доступа к оплаченным обоям и функции синхронизации;',
          'обработка платежей и предоставление чеков;',
          'ответы на обращения пользователей;',
          'улучшение качества каталога и сервиса.',
        ],
      },
      {
        id: 'basis',
        title: '4. Правовые основания',
        paragraphs: [
          'Обработка осуществляется на основании согласия пользователя, договора (оферты) и требований законодательства Российской Федерации.',
          'Согласие может быть отозвано в любой момент письменным обращением на hello@livewalls.app.',
        ],
      },
      {
        id: 'transfer',
        title: '5. Передача третьим лицам',
        paragraphs: [
          'Оператор не продаёт персональные данные. Данные могут передаваться: платёжному провайдеру (для проведения оплаты), хостинг-провайдеру (для работы сайта) и государственным органам в случаях, предусмотренных законом.',
        ],
      },
      {
        id: 'storage',
        title: '6. Сроки хранения и защита',
        paragraphs: [
          'Данные хранятся не дольше, чем этого требуют цели обработки, но не более 3 лет с момента последнего обращения пользователя, если иной срок не установлен законом.',
          'Оператор принимает правовые, организационные и технические меры для защиты данных от неправомерного доступа, уничтожения, изменения и распространения.',
        ],
      },
      {
        id: 'rights',
        title: '7. Права пользователя',
        paragraphs: [
          'Пользователь вправе получить сведения об обработке своих персональных данных, требовать их уточнения, блокирования или уничтожения, а также отозвать согласие на обработку.',
          'Обращения направляются на hello@livewalls.app. Ответ предоставляется в срок не более 30 дней.',
        ],
      },
    ],
  },
  en: {
    title: 'Personal data processing policy',
    updatedAt: '2026-10-01',
    intro:
      'This policy explains how the operator processes personal data of users of livewalls.app and the LiveWalls application.',
    sections: [
      {
        id: 'operator',
        title: '1. Data operator',
        paragraphs: [
          'The data operator is Ivanov Ivan Ivanovich (individual entrepreneur). Contact: hello@livewalls.app.',
          'The operator processes personal data in compliance with Federal Law No. 152-FZ "On Personal Data".',
        ],
      },
      {
        id: 'data',
        title: '2. Data we process',
        list: [
          'Email address — to sign in, send the confirmation link and issue receipts;',
          'Name — to handle support requests and personalize emails;',
          'Purchase data — order identifier, amount, date and payment status;',
          'Technical data — IP address, browser and device type, request logs.',
        ],
      },
      {
        id: 'goals',
        title: '3. Purposes',
        list: [
          'granting access to purchased wallpapers and sync features;',
          'processing payments and issuing receipts;',
          'replying to user requests;',
          'improving the catalog and the service.',
        ],
      },
      {
        id: 'basis',
        title: '4. Legal grounds',
        paragraphs: [
          'Processing is based on the user consent, the agreement (public offer) and the requirements of Russian law.',
          'Consent can be withdrawn at any time by writing to hello@livewalls.app.',
        ],
      },
      {
        id: 'transfer',
        title: '5. Third-party transfers',
        paragraphs: [
          'The operator does not sell personal data. Data may be shared with the payment provider, the hosting provider and government authorities where required by law.',
        ],
      },
      {
        id: 'storage',
        title: '6. Retention and protection',
        paragraphs: [
          'Data is kept no longer than the purposes require, and no longer than 3 years after the last contact, unless a longer period is set by law.',
          'The operator applies legal, organizational and technical measures to protect data from unauthorized access, destruction, modification and distribution.',
        ],
      },
      {
        id: 'rights',
        title: '7. User rights',
        paragraphs: [
          'The user may request information about the processing of their personal data, request correction, blocking or deletion, and withdraw consent.',
          'Requests are sent to hello@livewalls.app. The response is provided within 30 days.',
        ],
      },
    ],
  },
};

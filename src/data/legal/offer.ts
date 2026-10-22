import type { LegalDocument, Locale } from './types';

/** Публичная оферта (шаблон). */
export const publicOffer: Record<Locale, LegalDocument> = {
  ru: {
    title: 'Публичная оферта',
    updatedAt: '2026-10-01',
    intro:
      'Настоящий документ является официальным предложением Исполнителя заключить договор на предоставление доступа к материалам каталога LiveWalls.',
    sections: [
      {
        id: 'parties',
        title: '1. Стороны',
        paragraphs: [
          'Исполнитель: ИП Иванов Иван Иванович, ИНН 000000000000, ОГРНИП 000000000000000, адрес: г. Москва, ул. Примерная, д. 1, e-mail: hello@livewalls.app.',
          'Заказчик: физическое лицо, оформившее заказ и оплатившее его.',
        ],
      },
      {
        id: 'subject',
        title: '2. Предмет оферты',
        paragraphs: [
          'Исполнитель предоставляет Заказчику право использования каталога LiveWalls и входящих в него файлов обоев на условиях, указанных на сайте.',
          'Полный перечень приобретаемых прав указывается в заказе и подтверждается чеком.',
        ],
      },
      {
        id: 'price',
        title: '3. Цена и порядок оплаты',
        paragraphs: [
          'Цены указаны в рублях на странице «Цены» и включают все применимые налоги. Оплата производится в рублях через платёжного провайдера.',
          'Стоимость не облагается НДС (ИП применяет упрощённую систему налогообложения).',
        ],
      },
      {
        id: 'delivery',
        title: '4. Предоставление доступа',
        paragraphs: [
          'Доступ к приобретённым материалам предоставляется в личном кабинете сразу после успешной оплаты и сохраняется бессрочно для лицензии «Premium навсегда».',
          'Для лицензии «Premium на год» доступ действует 12 месяцев с даты покупки.',
        ],
      },
      {
        id: 'responsibility',
        title: '5. Ответственность сторон',
        paragraphs: [
          'Исполнитель не несёт ответственности за невозможность использования Материалов по причинам, связанным с оборудованием, программным обеспечением или операционной системой Заказчика.',
          'Стороны несут ответственность в пределах, установленных законодательством Российской Федерации.',
        ],
      },
      {
        id: 'personal-data',
        title: '6. Персональные данные',
        paragraphs: [
          'Обработка персональных данных Заказчика осуществляется в соответствии с Политикой обработки персональных данных и Федеральным законом № 152-ФЗ.',
        ],
      },
      {
        id: 'final',
        title: '7. Заключительные положения',
        paragraphs: [
          'Договор считается заключённым с момента оплаты. Все уведомления направляются по адресам электронной почты сторон.',
          'Оферта действует с момента публикации до её отзыва. Актуальная редакция всегда размещена на этой странице.',
        ],
      },
    ],
  },
  en: {
    title: 'Public offer',
    updatedAt: '2026-10-01',
    intro:
      'This document is the official offer of the Service Provider to conclude an agreement granting access to the LiveWalls catalog materials.',
    sections: [
      {
        id: 'parties',
        title: '1. Parties',
        paragraphs: [
          'Service Provider: Ivanov Ivan Ivanovich (individual entrepreneur), INN 000000000000, OGRNIP 000000000000000, address: Moscow, 1 Example Street, email: hello@livewalls.app.',
          'Customer: an individual who placed and paid for the order.',
        ],
      },
      {
        id: 'subject',
        title: '2. Subject of the offer',
        paragraphs: [
          'The Service Provider grants the Customer the right to use the LiveWalls catalog and the wallpaper files included in it under the terms stated on the website.',
          'The full list of acquired rights is specified in the order and confirmed by the receipt.',
        ],
      },
      {
        id: 'price',
        title: '3. Price and payment',
        paragraphs: [
          'Prices are shown in roubles on the Pricing page and include all applicable taxes. Payment is made in roubles through a payment provider.',
          'The price is not subject to VAT (the operator uses the simplified tax system).',
        ],
      },
      {
        id: 'delivery',
        title: '4. Access',
        paragraphs: [
          'Access to the purchased materials is granted in the personal cabinet right after a successful payment and is kept indefinitely for the "Premium forever" license.',
          'For the "Premium for a year" license, access lasts 12 months from the purchase date.',
        ],
      },
      {
        id: 'responsibility',
        title: '5. Liability',
        paragraphs: [
          'The Service Provider is not liable for the impossibility of using the materials due to the Customer hardware, software or operating system.',
          'The parties are liable within the limits set by the applicable law.',
        ],
      },
      {
        id: 'personal-data',
        title: '6. Personal data',
        paragraphs: [
          'Customer personal data is processed in accordance with the Personal Data Processing Policy and Federal Law No. 152-FZ.',
        ],
      },
      {
        id: 'final',
        title: '7. Final provisions',
        paragraphs: [
          'The agreement is considered concluded upon payment. All notifications are sent to the email addresses of the parties.',
          'This offer is valid from the moment of publication until withdrawn. The current version is always published on this page.',
        ],
      },
    ],
  },
};

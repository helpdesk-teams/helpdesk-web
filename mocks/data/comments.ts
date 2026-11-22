import type { CommentDto } from '@/api/dto'
import { ago } from './time'
import { ticketId } from './tickets'
import { USER_IDS } from './users'

type Author = Pick<CommentDto, 'authorId' | 'authorName'>

const ANNA: Author = { authorId: USER_IDS.anna, authorName: 'Анна Смирнова' }
const IVAN: Author = { authorId: USER_IDS.ivan, authorName: 'Иван Петров' }
const OLGA: Author = { authorId: USER_IDS.olga, authorName: 'Ольга Кузнецова' }

let counter = 0
function comment(
  ticket: number,
  author: Author,
  body: string,
  createdAt: string,
  isInternal = false,
): CommentDto {
  counter += 1
  return {
    id: `c4a1f2b0-8e3d-4b6a-9f70-${String(counter).padStart(12, '0')}`,
    ticketId: ticketId(ticket),
    ...author,
    body,
    isInternal,
    createdAt,
  }
}

// Internal comments (isInternal = true) are notes between operators: clients never see them
export const seedComments: CommentDto[] = [
  comment(
    7,
    OLGA,
    'Похоже на блокировку после 5 неудачных попыток, проверяю логи.',
    ago({ hours: 1 }),
    true,
  ),

  comment(
    8,
    OLGA,
    'Здравствуйте! Уточните, пожалуйста, ИНН организации для акта.',
    ago({ hours: 20 }),
  ),
  comment(8, IVAN, 'ИНН 7701234567.', ago({ hours: 6 })),

  comment(
    11,
    OLGA,
    'Уточните, пожалуйста, первые 6 цифр карты и время попытки оплаты.',
    ago({ days: 1, hours: 20 }),
  ),
  comment(
    11,
    OLGA,
    'Банк-эквайер жалуется на 3-D Secure, ждём ответа клиента.',
    ago({ days: 1, hours: 19 }),
    true,
  ),

  comment(
    12,
    OLGA,
    'Попробуйте переподключить календарь в настройках интеграций и сообщите, помогло ли.',
    ago({ days: 3 }),
  ),

  comment(
    13,
    OLGA,
    'Документация доступна в разделе «Разработчикам». Какой язык вы используете?',
    ago({ days: 4 }),
  ),

  comment(
    14,
    OLGA,
    'Аккаунт разблокирован. Рекомендуем включить двухфакторную аутентификацию.',
    ago({ days: 5 }),
  ),
  comment(14, IVAN, 'Спасибо, всё работает!', ago({ days: 5 })),

  comment(15, OLGA, 'Реквизиты обновлены, новый счёт отправлен на почту.', ago({ days: 6 })),

  comment(
    16,
    OLGA,
    'Передала разработчикам, это баг в экспорте.',
    ago({ days: 8, hours: 12 }),
    true,
  ),
  comment(16, OLGA, 'Ошибка исправлена, экспорт снова работает.', ago({ days: 8 })),

  comment(17, ANNA, 'Подтверждаю удаление.', ago({ days: 13 })),
  comment(17, OLGA, 'Аккаунт удалён.', ago({ days: 12 })),

  comment(18, OLGA, 'Спасибо за тёплые слова! Будем рады помочь снова.', ago({ days: 19 })),
]

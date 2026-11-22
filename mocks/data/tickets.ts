import type { TicketDto } from '@/api/dto'
import { ago } from './time'
import { USER_IDS } from './users'

const { anna, ivan, olga } = USER_IDS

/** Stable ids, so links like /tickets/<id> keep working after a page reload */
export const ticketId = (n: number) => `9b3d7e10-5c2a-4f8e-b1d4-${String(n).padStart(12, '0')}`

type Seed = Omit<TicketDto, 'id' | 'aiConfidence' | 'aiDraft' | 'updatedAt'> & {
  aiConfidence?: number
  aiDraft?: string
  updatedAt?: string
}

/** Fills the boring fields, so each seed below shows only what matters */
function ticket(n: number, seed: Seed): TicketDto {
  return {
    aiConfidence: null,
    aiDraft: null,
    ...seed,
    id: ticketId(n),
    updatedAt: seed.updatedAt ?? seed.createdAt,
  }
}

const draft = (text: string) => `Здравствуйте!\n\n${text}\n\nС уважением, служба поддержки`

// 18 tickets: every status, category and priority, two clients, one operator
export const seedTickets: TicketDto[] = [
  /* ---------- classifying: the AI hasn't processed them yet ---------- */
  ticket(1, {
    authorId: anna,
    assigneeId: null,
    status: 'classifying',
    category: null,
    priority: null,
    title: 'Не приходит письмо для сброса пароля',
    description: 'Нажимаю «Забыли пароль», но письмо так и не приходит, папку «Спам» проверила.',
    createdAt: ago({ minutes: 2 }),
  }),
  ticket(2, {
    authorId: ivan,
    assigneeId: null,
    status: 'classifying',
    category: null,
    priority: null,
    title: 'Вопрос по тарифам для команды',
    description: 'Есть ли скидка, если подключить сразу 15 сотрудников?',
    createdAt: ago({ minutes: 5 }),
  }),

  /* ---------- open: classified, waiting for an operator ---------- */
  ticket(3, {
    authorId: anna,
    assigneeId: null,
    status: 'open',
    category: 'billing',
    priority: 'urgent',
    title: 'Списали деньги дважды',
    description: 'Сегодня с карты дважды списали 990 ₽ за один и тот же месяц подписки.',
    aiConfidence: 0.94,
    aiDraft: draft(
      'Приносим извинения за двойное списание. Мы проверили платёж и вернём лишние 990 ₽ в течение 3–5 рабочих дней.',
    ),
    createdAt: ago({ hours: 1 }),
  }),
  ticket(4, {
    authorId: ivan,
    assigneeId: null,
    status: 'open',
    category: 'technical',
    priority: 'high',
    title: 'Приложение вылетает при загрузке файла',
    description:
      'При загрузке PDF больше 10 МБ приложение закрывается. iPhone 15, последняя версия.',
    aiConfidence: 0.88,
    aiDraft: draft(
      'Спасибо, что сообщили. Мы воспроизвели проблему с крупными PDF и уже готовим исправление. Пока можно загрузить файл через веб-версию.',
    ),
    createdAt: ago({ hours: 3 }),
  }),
  ticket(5, {
    authorId: anna,
    assigneeId: null,
    status: 'open',
    category: 'account',
    priority: 'medium',
    title: 'Как сменить email в профиле?',
    description: 'Хочу привязать аккаунт к рабочей почте вместо личной.',
    aiConfidence: 0.71,
    aiDraft: draft(
      'Сменить email можно в разделе «Профиль → Безопасность». На новый адрес придёт письмо для подтверждения.',
    ),
    createdAt: ago({ hours: 6 }),
  }),
  ticket(6, {
    authorId: ivan,
    assigneeId: null,
    status: 'open',
    category: 'other',
    priority: 'low',
    title: 'Предложение: добавить тёмную тему',
    description: 'Было бы удобно работать вечером с тёмным оформлением.',
    aiConfidence: 0.42,
    aiDraft: draft('Спасибо за идею! Мы передали её команде продукта.'),
    createdAt: ago({ days: 1 }),
  }),

  /* ---------- in_progress: an operator is working on them ---------- */
  ticket(7, {
    authorId: anna,
    assigneeId: olga,
    status: 'in_progress',
    category: 'technical',
    priority: 'urgent',
    title: 'Не могу войти в аккаунт',
    description: 'После обновления пишет «Неверный пароль», хотя пароль точно правильный.',
    aiConfidence: 0.67,
    aiDraft: draft(
      'Мы проверили ваш аккаунт: вход был временно заблокирован после нескольких неудачных попыток. Блокировка снята, попробуйте войти снова.',
    ),
    createdAt: ago({ hours: 2 }),
    updatedAt: ago({ hours: 1 }),
  }),
  ticket(8, {
    authorId: ivan,
    assigneeId: olga,
    status: 'in_progress',
    category: 'billing',
    priority: 'high',
    title: 'Нужен закрывающий документ за октябрь',
    description: 'Бухгалтерия просит акт за октябрь, в личном кабинете его нет.',
    aiConfidence: 0.9,
    aiDraft: draft('Акт за октябрь сформирован и отправлен на вашу почту.'),
    createdAt: ago({ days: 1, hours: 2 }),
    updatedAt: ago({ hours: 5 }),
  }),
  ticket(9, {
    authorId: anna,
    assigneeId: olga,
    status: 'in_progress',
    category: 'technical',
    priority: 'medium',
    title: 'Медленно открываются отчёты',
    description: 'Раздел «Отчёты» грузится больше минуты.',
    aiConfidence: 0.83,
    aiDraft: draft('Мы нашли причину замедления и оптимизируем загрузку отчётов.'),
    createdAt: ago({ days: 2 }),
    updatedAt: ago({ days: 1 }),
  }),
  ticket(10, {
    authorId: ivan,
    assigneeId: olga,
    status: 'in_progress',
    category: 'account',
    priority: 'low',
    title: 'Добавить второго администратора',
    description: 'Как дать права администратора коллеге?',
    aiConfidence: 0.76,
    aiDraft: draft(
      'Права выдаются в разделе «Команда»: выберите сотрудника и роль «Администратор».',
    ),
    createdAt: ago({ days: 3 }),
    updatedAt: ago({ days: 2 }),
  }),

  /* ---------- waiting_for_client: the operator asked a question ---------- */
  ticket(11, {
    authorId: anna,
    assigneeId: olga,
    status: 'waiting_for_client',
    category: 'billing',
    priority: 'high',
    title: 'Не проходит оплата картой',
    description: 'Пишет «Платёж отклонён», хотя деньги на карте есть.',
    aiConfidence: 0.86,
    aiDraft: draft('Уточните, пожалуйста, первые 6 цифр карты и время попытки оплаты.'),
    createdAt: ago({ days: 2, hours: 4 }),
    updatedAt: ago({ days: 1, hours: 20 }),
  }),
  ticket(12, {
    authorId: ivan,
    assigneeId: olga,
    status: 'waiting_for_client',
    category: 'technical',
    priority: 'medium',
    title: 'Не работает интеграция с календарём',
    description: 'События из CRM перестали появляться в Google Календаре.',
    aiConfidence: 0.79,
    aiDraft: draft(
      'Попробуйте переподключить календарь в настройках интеграций и сообщите, помогло ли.',
    ),
    createdAt: ago({ days: 4 }),
    updatedAt: ago({ days: 3 }),
  }),
  ticket(13, {
    authorId: anna,
    assigneeId: olga,
    status: 'waiting_for_client',
    category: 'other',
    priority: 'low',
    title: 'Где найти инструкцию по API?',
    description: 'Хотим подключить свою систему, нужна документация.',
    aiConfidence: 0.58,
    aiDraft: draft(
      'Документация доступна по ссылке в разделе «Разработчикам». Какой язык программирования вы используете?',
    ),
    createdAt: ago({ days: 5 }),
    updatedAt: ago({ days: 4 }),
  }),

  /* ---------- resolved: answered, the client may still reopen ---------- */
  ticket(14, {
    authorId: ivan,
    assigneeId: olga,
    status: 'resolved',
    category: 'account',
    priority: 'medium',
    title: 'Заблокировали аккаунт',
    description: 'Не могу войти, пишет «Аккаунт заблокирован».',
    aiConfidence: 0.92,
    aiDraft: draft('Аккаунт разблокирован. Рекомендуем включить двухфакторную аутентификацию.'),
    createdAt: ago({ days: 6 }),
    updatedAt: ago({ days: 5 }),
  }),
  ticket(15, {
    authorId: anna,
    assigneeId: olga,
    status: 'resolved',
    category: 'billing',
    priority: 'low',
    title: 'Изменить реквизиты в счёте',
    description: 'В счёте указан старый адрес компании.',
    aiConfidence: 0.81,
    aiDraft: draft('Реквизиты обновлены, новый счёт отправлен на почту.'),
    createdAt: ago({ days: 7 }),
    updatedAt: ago({ days: 6 }),
  }),
  ticket(16, {
    authorId: ivan,
    assigneeId: olga,
    status: 'resolved',
    category: 'technical',
    priority: 'high',
    title: 'Ошибка 500 при экспорте в Excel',
    description: 'При экспорте клиентов в Excel появляется ошибка 500.',
    aiConfidence: 0.95,
    aiDraft: draft('Ошибка исправлена, экспорт снова работает.'),
    createdAt: ago({ days: 9 }),
    updatedAt: ago({ days: 8 }),
  }),

  /* ---------- closed ---------- */
  ticket(17, {
    authorId: anna,
    assigneeId: olga,
    status: 'closed',
    category: 'account',
    priority: 'low',
    title: 'Удалить старый аккаунт',
    description: 'Прошу удалить аккаунт, зарегистрированный на старую почту.',
    aiConfidence: 0.89,
    aiDraft: draft('Аккаунт удалён.'),
    createdAt: ago({ days: 14 }),
    updatedAt: ago({ days: 12 }),
  }),
  ticket(18, {
    authorId: ivan,
    assigneeId: olga,
    status: 'closed',
    category: 'other',
    priority: 'medium',
    title: 'Спасибо за быструю помощь',
    description: 'Хотел поблагодарить оператора за помощь с настройкой.',
    aiConfidence: 0.64,
    aiDraft: draft('Спасибо за тёплые слова! Будем рады помочь снова.'),
    createdAt: ago({ days: 20 }),
    updatedAt: ago({ days: 19 }),
  }),
]

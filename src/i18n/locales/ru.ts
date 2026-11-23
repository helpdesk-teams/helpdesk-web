/**
 * Russian texts: the main locale and the source of truth for keys.
 * en.ts must have exactly the same keys (TypeScript checks it).
 * Keys are grouped by where they are used; more groups come with each stage.
 */
const ru = {
  app: {
    name: 'Smart Helpdesk',
  },
  locale: {
    switchLabel: 'Язык интерфейса',
    ru: 'Русский',
    en: 'English',
  },

  /** Header, navigation, mobile menu */
  layout: {
    mainNavigation: 'Основная навигация',
    openMenu: 'Открыть меню',
    myTickets: 'Мои обращения',
    queue: 'Очередь',
    notifications: 'Уведомления',
    notificationsUnread: 'Уведомления, непрочитанных: {count}',
    guest: 'Гость',
    logout: 'Выйти',
  },

  common: {
    comingAtStage: 'Страница появится на этапе {stage}.',
  },

  tickets: {
    newTicket: 'Новое обращение',
    idLabel: 'ID: {id}',
  },

  notFound: {
    hint: 'Возможно, адрес набран с ошибкой или страница была удалена.',
    goHome: 'На главную',
  },

  /** API errors, shown by `code` in the UI language (see api/errors.ts) */
  errors: {
    code: {
      VALIDATION_ERROR: 'Проверьте поля формы',
      INVALID_CREDENTIALS: 'Неверный email или пароль',
      EMAIL_TAKEN: 'Пользователь с таким email уже зарегистрирован',
      UNAUTHORIZED: 'Нужно войти в систему',
      TOKEN_EXPIRED: 'Сессия истекла, войдите снова',
      INVALID_REFRESH_TOKEN: 'Сессия истекла, войдите снова',
      SESSION_EXPIRED: 'Сессия истекла, войдите снова',
      FORBIDDEN: 'Недостаточно прав для этого действия',
      NOT_FOUND: 'Не найдено',
      INVALID_TRANSITION: 'Нельзя перевести обращение в этот статус',
      TICKET_CLOSED: 'Обращение закрыто, ответить нельзя',
      NETWORK_ERROR: 'Сервер недоступен. Проверьте подключение к интернету',
      TIMEOUT: 'Сервер долго не отвечает, попробуйте ещё раз',
    },
    /** When the server sent no known code: a text by HTTP status */
    status: {
      http400: 'Проверьте введённые данные',
      http401: 'Нужно войти в систему',
      http403: 'Недостаточно прав для этого действия',
      http404: 'Не найдено',
      http409: 'Действие сейчас невозможно, обновите страницу',
      http429: 'Слишком много запросов, попробуйте чуть позже',
    },
    server: 'Ошибка на сервере, попробуйте позже',
  },

  /** Page titles: the browser tab and the page heading */
  pages: {
    login: 'Вход',
    register: 'Регистрация',
    clientTickets: 'Мои обращения',
    clientTicketNew: 'Новое обращение',
    ticket: 'Обращение',
    operatorQueue: 'Очередь обращений',
    notFound: 'Страница не найдена',
  },

  /* ---------- Domain values (keys match the values in utils/constants) ---------- */
  role: {
    client: 'Клиент',
    operator: 'Оператор',
    admin: 'Администратор',
  },
  status: {
    classifying: 'Анализируется…',
    open: 'Открыто',
    in_progress: 'В работе',
    waiting_for_client: 'Ждём клиента',
    resolved: 'Решено',
    closed: 'Закрыто',
  },
  category: {
    billing: 'Оплата',
    technical: 'Техническая проблема',
    account: 'Аккаунт',
    other: 'Другое',
  },
  priority: {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    urgent: 'Срочный',
  },
}

export default ru

/** The shape every locale must follow */
export type MessageSchema = typeof ru

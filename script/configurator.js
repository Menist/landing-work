(function () {
  'use strict';

  const RESULTS = {
    'services-yes-yes': {
      title: 'Сайт услуг с CMS и SEO',
      desc: 'Оптимальное решение для компании сферы услуг. Клиенты найдут вас через Google и Яндекс, а вы сами будете управлять контентом.',
      items: ['Многостраничный сайт (о нас, услуги, контакты)', 'Управление контентом через CMS', 'SEO-оптимизация с первого дня', 'Google Analytics и Яндекс.Метрика']
    },
    'services-yes-no': {
      title: 'Сайт услуг с CMS',
      desc: 'Красивый и удобный сайт с возможностью самостоятельно менять контент. SEO можно подключить позже.',
      items: ['Многостраничный сайт', 'Управление контентом через CMS', 'Адаптивный дизайн', 'Готов к последующему SEO-продвижению (опционально)']
    },
    'services-no-yes': {
      title: 'Сайт услуг с SEO',
      desc: 'Профессиональный сайт компании, оптимизированный для поисковиков.',
      items: ['Многостраничный сайт', 'SEO-оптимизация с первого дня', 'Schema.org разметка', 'Google Analytics и Яндекс.Метрика']
    },
    'services-no-no': {
      title: 'Сайт услуг',
      desc: 'Чистый и современный сайт для вашей компании.',
      items: ['Многостраничный сайт', 'Адаптивный дизайн', 'Быстрая загрузка', 'HTTPS и защита']
    },
    'landing-yes-yes': {
      title: 'Лендинг с CMS и SEO',
      desc: 'Мощный одностраничник для продвижения вашей услуги.',
      items: ['Одностраничный сайт с высокой конверсией', 'Управление контентом через CMS', 'SEO-оптимизация', 'Подключение аналитики']
    },
    'landing-yes-no': {
      title: 'Лендинг с CMS',
      desc: 'Продающий одностраничник с удобным управлением контентом.',
      items: ['Одностраничный сайт', 'Управление контентом через CMS', 'Быстрая загрузка', 'Адаптивный дизайн']
    },
    'landing-no-yes': {
      title: 'Лендинг с SEO',
      desc: 'Продающий одностраничник, который находят в Google и Яндекс.',
      items: ['Одностраничный сайт', 'SEO-оптимизация с первого дня', 'Высокая скорость загрузки', 'Аналитика и отслеживание заявок']
    },
    'landing-no-no': {
      title: 'Лендинг',
      desc: 'Быстрый и чёткий одностраничник для продвижения вашей услуги.',
      items: ['Одностраничный сайт', 'Современный дизайн', 'Быстрая загрузка', 'Адаптивный под все устройства']
    },
    'card-yes-yes': {
      title: 'Сайт-визитка с CMS и SEO',
      desc: 'Простое и эффективное онлайн-присутствие.',
      items: ['Контакты, адрес, часы работы', 'Управление контентом', 'SEO-оптимизация', 'Карта и ссылки на соцсети']
    },
    'card-yes-no': {
      title: 'Сайт-визитка с CMS',
      desc: 'Минимальное онлайн-присутствие с возможностью самому обновлять контакты.',
      items: ['Контакты, адрес, часы работы', 'Управление контентом', 'Ссылки на соцсети', 'Адаптивный дизайн']
    },
    'card-no-yes': {
      title: 'Сайт-визитка с SEO',
      desc: 'Простой сайт с вашими контактами, который легко найти в поиске.',
      items: ['Контакты, адрес, часы работы', 'SEO-оптимизация', 'Быстрая загрузка', 'Карта и соцсети']
    },
    'card-no-no': {
      title: 'Сайт-визитка',
      desc: 'Простое и быстрое решение: ваши контакты онлайн.',
      items: ['Контакты, адрес, часы работы', 'Современный дизайн', 'Быстрая загрузка', 'Ссылки на соцсети']
    },
    'services-static-yes': {
      title: 'Сайт услуг с SEO',
      desc: 'Профессиональный сайт компании с технической SEO-настройкой. Контент фиксированный — редактирование через нас по запросу.',
      items: ['Многостраничный сайт', 'Фиксированный контент без CMS', 'Техническая SEO-настройка', 'Google Analytics и Яндекс.Метрика']
    },
    'services-static-no': {
      title: 'Сайт услуг',
      desc: 'Чистый и быстрый сайт компании с фиксированным контентом. Правки вносим мы по вашему запросу.',
      items: ['Многостраничный сайт', 'Фиксированный контент без CMS', 'Адаптивный дизайн', 'HTTPS и защита']
    },
    'landing-static-yes': {
      title: 'Лендинг с SEO-настройкой',
      desc: 'Одностраничник с фиксированным контентом и базовой SEO-настройкой при запуске.',
      items: ['Одностраничный сайт', 'Фиксированный контент без CMS', 'Техническая SEO-настройка', 'Форма заявки или кнопка звонка']
    },
    'landing-static-no': {
      title: 'Лендинг',
      desc: 'Быстрый одностраничник с фиксированным контентом. Идеально для акций и промо-страниц.',
      items: ['Одностраничный сайт', 'Фиксированный контент без CMS', 'Быстрая загрузка', 'Форма заявки или кнопка звонка']
    },
    'card-static-yes': {
      title: 'Сайт-визитка с SEO-настройкой',
      desc: 'Простое онлайн-присутствие с фиксированными контактами и базовой SEO-настройкой.',
      items: ['Контакты, адрес, часы работы', 'Фиксированный контент без CMS', 'Техническая SEO-настройка', 'Карта и соцсети']
    },
    'card-static-no': {
      title: 'Сайт-визитка',
      desc: 'Минимальное онлайн-присутствие с фиксированным контентом. Быстро и без лишнего.',
      items: ['Контакты, адрес, часы работы', 'Фиксированный контент без CMS', 'Адаптивный дизайн', 'Быстрая загрузка']
    },
  };

  let currentStep = 1;
  let answers = {step1: null, step2: null, step3: null};

  const steps = document.querySelectorAll('.configurator__step[data-step]');
  const nextBtn = document.getElementById('cfgNext');
  const backBtn = document.getElementById('cfgBack');
  const nav = document.getElementById('cfgNav');
  const progressBar = document.getElementById('cfgProgressBar');
  const progressLbl = document.getElementById('cfgProgressLabel');
  const result = document.getElementById('cfgResult');
  const resetBtn = document.getElementById('cfgReset');

  if (!nextBtn) return;

  function showStep(n) {
    steps.forEach(s => s.classList.remove('is-active'));

    if (n === 'result') {
      result.classList.add('is-active');
      nav.style.display = 'none';
      showResult();
      return;
    }

    const target = document.querySelector(`.configurator__step[data-step="${n}"]`);
    if (target) target.classList.add('is-active');

    progressBar.style.width = (n / 3 * 100) + '%';
    progressLbl.textContent = `Шаг ${n} из 3`;
    // 🔹 ИЗМЕНЕНИЕ ЗДЕСЬ: кнопка "Назад" видна всегда (на 1 шаге скрываем, но визуально оставляем)
    backBtn.style.opacity = n > 1 ? '1' : '0.5'; // на 1 шаге полупрозрачная
    backBtn.style.pointerEvents = n > 1 ? 'auto' : 'none'; // на 1 шаге неактивна
    nextBtn.disabled = !answers['step' + n];
    nextBtn.textContent = n === 3 ? 'Показать результат →' : 'Далее →';
    nav.style.display = 'flex';
  }

  function showResult() {
    const key = `${answers.step1}-${answers.step2}-${answers.step3}`;
    const data = RESULTS[key] || RESULTS['services-yes-yes'];

    document.getElementById('cfgResultTitle').textContent = data.title;
    document.getElementById('cfgResultDesc').textContent = data.desc;
    document.getElementById('cfgResultList').innerHTML = data.items
      .map(i => `<li>${i}</li>`)
      .join('');

    progressBar.style.width = '100%';
    progressLbl.textContent = 'Готово!';
  }

  /* ── Выбор карточек ── */
  document.querySelectorAll('.cfg-option__input').forEach(input => {
    input.addEventListener('change', function () {
      answers['step' + currentStep] = this.value;
      nextBtn.disabled = false;
    });
  });

  /* ── Передача результата в форму ── */
  /* ── Кнопка "Оставить заявку" — открывает модалку ── */
  document.getElementById('cfgResultBtn').addEventListener('click', () => {
    const title = document.getElementById('cfgResultTitle').textContent;
    const items = Array.from(document.querySelectorAll('#cfgResultList li'))
      .map(li => li.textContent);

    // Заполняем скрытое поле модалки
    const hiddenField = document.getElementById('modal-cfg-result');
    if (hiddenField) {
      hiddenField.value = title + '\n' + items.map(i => '• ' + i).join('\n');
    }

    // Показываем итог конфигуратора над формой
    const summary = document.getElementById('cfgModalSummary');
    if (summary) {
      summary.innerHTML = `<strong>${title}</strong>` +
        items.map(i => `• ${i}`).join('<br>');
      summary.classList.add('is-visible');
    }

    // Открываем модалку
    document.getElementById('cfgModal').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  nextBtn.addEventListener('click', () => {
    if (!answers['step' + currentStep]) return;
    currentStep++;
    showStep(currentStep > 3 ? 'result' : currentStep);
  });

  backBtn.addEventListener('click', () => {
    if (currentStep <= 1) return;
    currentStep--;
    showStep(currentStep);
  });

  resetBtn.addEventListener('click', () => {
    currentStep = 1;
    answers = {step1: null, step2: null, step3: null};
    document.querySelectorAll('.cfg-option__input').forEach(i => {
      i.checked = false;
    });
    result.classList.remove('is-active');
    showStep(1);
  });

  showStep(1);

})();

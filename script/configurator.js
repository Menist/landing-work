(() => {
  'use strict';

  const card = document.querySelector('[data-question-card]');

  if (!card) return;

  const state = {
    siteType: null,
    design: null,
    services: []
  };

  function getSelectedTagsHtml() {

    const tags = [];

    if (state.siteType) {
      tags.push(state.siteType);
    }

    if (state.design) {
      tags.push(state.design);
    }

    state.services.forEach(item => {
      tags.push(item);
    });

    if (!tags.length) {
      return '';
    }

    return `
    <div class="configurator__progress">

      ${tags.map(tag => `
        <span class="configurator__progress-tag">
          ${tag}
        </span>
      `).join('')}

    </div>
  `;
  }
  function getStepProgressHtml(stepIndex) {

    return `
    <div class="configurator__progressbar">

      <div class="configurator__progress-track">

        <span class="configurator__progress-segment ${stepIndex >= 0 ? 'is-active' : ''}"></span>

        <span class="configurator__progress-segment ${stepIndex >= 1 ? 'is-active' : ''}"></span>

        <span class="configurator__progress-segment ${stepIndex >= 2 ? 'is-active' : ''}"></span>

      </div>

      <span class="configurator__step">
        Шаг ${stepIndex + 1} из 3
      </span>

    </div>
  `;
  }

  const questions = [
    {
      key: 'siteType',
      step: 'Шаг 1 из 3',
      title: 'Какой сайт нужен?',
      multiple: false,
      options: [
        {
          value: 'Лендинг',
          description: 'Одностраничный сайт'
        },
        {
          value: 'Сайт услуг',
          description: 'Для компании или специалиста'
        },
        {
          value: 'Многостраничный сайт',
          description: 'Корпоративный сайт'
        },
        {
          value: 'Не уверен',
          description: ''
        }
      ]
    },


    {
      key: 'design',
      step: 'Шаг 2 из 3',
      title: 'Есть ли готовый дизайн?',
      multiple: false,
      options: [
        {
          value: 'Да, дизайн готов',
          description: ''
        },
        {
          value: 'Дизайн в разработке',
          description: ''
        },
        {
          value: 'Нужен дизайнер',
          description: ''
        },
        {
          value: 'Не уверен',
          description: ''
        }
      ]
    },

    {
      key: 'services',
      step: 'Шаг 3 из 3',
      title: 'Дополнительные задачи',
      subTitle: 'Можно выбрать несколько вариантов',
      multiple: true,
      options: [
        {
          value: 'SEO',
          description: 'Подготовка к продвижению'
        },
        {
          value: 'Аналитика',
          description: 'Google и Яндекс'
        },
        {
          value: 'Редактирование контента',
          description: 'Без программиста'
        },
        {
          value: 'Пока не решил',
          description: ''
        }
      ]
    }


  ];

  function getCurrentStep() {
    if (!state.siteType) return 0;
    if (!state.design) return 1;
    if (!state.services.length) return 2;


    return 'finish';


  }


  function removeTag(key, value) {


    if (key === 'siteType') {
      state.siteType = null;
      state.design = null;
      state.services = [];
    }

    if (key === 'design') {
      state.design = null;
      state.services = [];
    }

    if (key === 'service') {
      state.services = state.services.filter(
        item => item !== value
      );
    }
    renderQuestion();

  }

  function animateCard(callback) {


    card.classList.add('is-leaving');

    setTimeout(() => {

      callback();

      card.classList.remove('is-leaving');

      card.classList.add('is-entering');

      requestAnimationFrame(() => {
        card.classList.add('is-entering-active');
      });

      setTimeout(() => {
        card.classList.remove(
          'is-entering',
          'is-entering-active'
        );
      }, 350);

    }, 350);


  }

  function openModal() {

    const tags = [];

    if (state.siteType) {
      tags.push(state.siteType);
    }

    if (state.design) {
      tags.push(state.design);
    }

    state.services.forEach(item => {
      tags.push(item);
    });

    const summary = tags.join(' • ');

    const hiddenField =
      document.getElementById('modal-cfg-result');

    const summaryBlock =
      document.getElementById('cfgModalSummary');

    if (hiddenField) {
      hiddenField.value = summary;
    }

    if (summaryBlock) {
      summaryBlock.innerHTML = `
    <strong>${summary}</strong>
    `;
    }

    const modal =
      document.getElementById('cfgModal');

    if (modal) {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }


  }

  function showSuccessScreen() {

    card.innerHTML = `
    <div class="configurator__card-content">

      <span class="configurator__step">
        Готово
      </span>

      <h3 class="configurator__card-title">
        Заявка отправлена
      </h3>

      <p class="configurator__helper">
        Мы получили информацию о вашем проекте и свяжемся с вами в ближайшее время.
      </p>

    </div>
  `;

  }

  function renderFinishScreen() {

    const tags = [];

    if (state.siteType) {
      tags.push(state.siteType);
    }

    if (state.design) {
      tags.push(state.design);
    }

    state.services.forEach(item => {
      tags.push(item);
    });

    const tagsHtml = tags.map(tag => `
  <span class="configurator__progress-tag">
    ${tag}
  </span>
`).join('');

    card.innerHTML = `
    <div class="configurator__card-content">

      <span class="configurator__step">
      Готово
      </span>

    <h3 class="configurator__card-title">
      Проверим, всё ли верно?
    </h3>
    <div class="configurator__progress">
  ${tagsHtml}
</div>
<button
  type="button"
  class="configurator__edit"
  data-edit-configurator
>
  Изменить ответы
</button>
    <p class="configurator__helper">
      Мы собрали параметры вашего проекта.
      Нажмите кнопку ниже и оставьте контакты.
    </p>

    <div class="configurator__actions">
      <button
        type="button"
        class="configurator__next"
        data-open-configurator-modal
      >
        Отправить заявку 
      </button>
    </div>

  </div>
    `;

    const button = card.querySelector(
      '[data-open-configurator-modal]'
    );

    button.addEventListener('click', openModal);
    const editButton = card.querySelector(
      '[data-edit-configurator]'
    );

    editButton.addEventListener('click', () => {

      state.siteType = null;
      state.design = null;
      state.services = [];

      renderQuestion();

    });
  }

  function renderQuestion() {
    const stepIndex = getCurrentStep();

    if (stepIndex === 'finish') {
      renderFinishScreen();
      return;
    }

    const question = questions[stepIndex];

    let optionsHtml = '';

    question.options.forEach(option => {
      optionsHtml += `
      <button
        type="button"
        class="configurator__option"
        data-question="${question.key}"
        data-value="${option.value}"
      >
        ${option.value}
        ${
        option.description
          ? `<small>${option.description}</small>`
          : ''
      }
      </button>
    `;
    });

    let actionButton = '';

    if (question.multiple) {
      actionButton = `
      <div class="configurator__actions">
        <button
          type="button"
          class="configurator__next"
          id="continueServices"
        >
          Продолжить
        </button>
      </div>
    `;
    }

    // Добавляем отображение subTitle, если он есть
    const subTitleHtml = question.subTitle
      ? `<p class="configurator__subtitle">${question.subTitle}</p>`
      : '';

card.innerHTML = `
      <div class="configurator__card-content">

      ${getStepProgressHtml(stepIndex)}

    ${getSelectedTagsHtml()}

    <h3 class="configurator__card-title">
      ${question.title}
    </h3>

    ${subTitleHtml}

    <div class="configurator__options">
      ${optionsHtml}
    </div>

    ${actionButton}

  </div>
    `;
    bindQuestionEvents(question);
  }

  function bindQuestionEvents(question) {


    const buttons = card.querySelectorAll(
      '.configurator__option'
    );

    buttons.forEach(button => {

      button.addEventListener('click', () => {

        const value = button.dataset.value;

        if (!question.multiple) {

          state[question.key] = value;

          animateCard(() => {
            renderQuestion();
          });

          return;
        }

        const exists =
          state.services.includes(value);

        if (exists) {

          state.services =
            state.services.filter(
              item => item !== value
            );

          button.classList.remove(
            'is-selected'
          );

        } else {

          state.services.push(value);

          button.classList.add(
            'is-selected'
          );
        }
      });
    });

    const continueBtn =
      document.getElementById(
        'continueServices'
      );

    if (!continueBtn) return;

    continueBtn.addEventListener(
      'click',
      () => {

        if (!state.services.length) {
          return;
        }

        animateCard(() => {
          renderQuestion();
        });
      }
    );

  }


  renderQuestion();
  window.showConfiguratorSuccessScreen = showSuccessScreen;
})();

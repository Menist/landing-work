window.EmailJSConfig = {
  serviceId: 'service_iu0rgwg',
  templateId: 'template_w94w5fm',
  publicKey: 'a-CKITT6LHGwybHzj'
};

emailjs.init({
  publicKey: window.EmailJSConfig.publicKey
});

(function () {
  'use strict';

  const { serviceId, templateId } =
    window.EmailJSConfig;

  const modal =
    document.getElementById('cfgModal');

  const overlay =
    document.getElementById('cfgModalOverlay');

  const closeBtn =
    document.getElementById('cfgModalClose');

  const form =
    document.getElementById('modalContactForm');

  const submitBtn =
    document.getElementById('modalSubmit');

  const statusEl =
    document.getElementById('modalStatus');

  if (!modal || !form) return;

  const DEFAULT_BUTTON_TEXT =
    submitBtn.textContent;

  function closeModal() {

    modal.classList.remove('is-open');

    document.body.style.overflow = '';

    form.reset();

    showStatus('', '');

    form
      .querySelectorAll('.is-error')
      .forEach(el => {
        el.classList.remove('is-error');
      });

    const hidden =
      document.getElementById(
        'modal-cfg-result'
      );

    if (hidden) {
      hidden.value = '';
    }

  }

  overlay?.addEventListener(
    'click',
    closeModal
  );

  closeBtn?.addEventListener(
    'click',
    closeModal
  );

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    }
  );

  function validate() {
    let valid = true;

    const name =
      form.querySelector(
        '[name="from_name"]'
      );

    const phone =
      form.querySelector(
        '[name="from_phone"]'
      );

    [name, phone].forEach(el => {
      el.classList.remove('is-error');
    });

    if (!name.value.trim()) {
      name.classList.add('is-error');
      valid = false;
    }

    if (!phone.value.trim()) {
      phone.classList.add('is-error');
      valid = false;
    }

    return valid;
  }

  function showStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className =
      `contacts__status ${
        type ? 'is-' + type : ''
      }`;
  }

  form.addEventListener(
    'submit',
    async (e) => {

      e.preventDefault();

      if (!validate()) {
        showStatus(
          'Пожалуйста, заполните обязательные поля.',
          'error'
        );
        return;
      }

      submitBtn.disabled = true;

      submitBtn.textContent =
        'Отправляем...';

      showStatus('', '');

      try {

        if (
          typeof emailjs ===
          'undefined'
        ) {

          showStatus(
            'Ошибка отправки. Обновите страницу и попробуйте ещё раз.',
            'error'
          );

          return;
        }

        await emailjs.sendForm(
          serviceId,
          templateId,
          form
        );

        showStatus(
          'Заявка отправлена! Свяжемся с вами в ближайшее время.',
          'success'
        );

        form.reset();

        const hidden =
          document.getElementById(
            'modal-cfg-result'
          );

        if (hidden) {
          hidden.value = '';
        }

        setTimeout(() => {

          closeModal();

          window.__configurator
            ?.showSuccessScreen?.();

        }, 1500);

      } catch (err) {

        console.error(
          'EmailJS error:',
          err
        );

        showStatus(
          'Ошибка отправки. Напишите напрямую на hello@ai2b.by',
          'error'
        );

      } finally {

        submitBtn.disabled =
          false;

        submitBtn.textContent =
          DEFAULT_BUTTON_TEXT;

      }

    }
  );

  form
    .querySelectorAll(
      '.contacts__input'
    )
    .forEach(el => {

      el.addEventListener(
        'input',
        () => {

          el.classList.remove(
            'is-error'
          );

          if (
            statusEl.classList.contains(
              'is-error'
            )
          ) {
            showStatus('', '');
          }

        }
      );

    });

})();
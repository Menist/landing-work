(function () {
  'use strict';

  /* =========================
     LAZY MAP
  ========================= */

  document.addEventListener('DOMContentLoaded', () => {

    const iframe =
      document.querySelector('.js-lazy-iframe');

    if (iframe) {

      const observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(entry => {

              if (!entry.isIntersecting) {
                return;
              }

              iframe.src =
                iframe.dataset.src;

              observer.disconnect();

            });

          },
          {
            rootMargin: '200px'
          }
        );

      observer.observe(iframe);

    }

    initForm();

  });


  /* =========================
     CONTACT FORM
  ========================= */

  function initForm() {

    const {
      serviceId,
      templateId
    } = window.EmailJSConfig;

    const form =
      document.getElementById(
        'contactForm'
      );

    if (!form) {
      return;
    }

    const submitBtn =
      document.getElementById(
        'formSubmit'
      );

    const statusEl =
      document.getElementById(
        'formStatus'
      );


    function showStatus(text, type = '') {

      statusEl.textContent =
        text;

      statusEl.className =
        type
          ? `contacts__status is-${type}`
          : 'contacts__status';

    }


    function validate() {

      let valid = true;

      const fields = [

        form.querySelector(
          '[name="from_name"]'
        ),

        form.querySelector(
          '[name="from_phone"]'
        )

      ];

      fields.forEach(el => {

        el.classList.remove(
          'is-error'
        );

        if (!el.value.trim()) {

          el.classList.add(
            'is-error'
          );

          valid = false;

        }

      });

      return valid;

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

        showStatus('');

        try {

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
              'cfg-result-hidden'
            );

          if (hidden) {
            hidden.value = '';
          }

        } catch (err) {

          console.error(
            'EmailJS error:',
            err
          );

          showStatus(
            'Ошибка отправки. Напишите напрямую на hello@site2u.by',
            'error'
          );

        } finally {

          submitBtn.disabled =
            false;

          submitBtn.textContent =
            'Отправить заявку';

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
              showStatus('');
            }

          }
        );

      });

  }

})();
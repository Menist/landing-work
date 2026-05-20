  (function () {
  'use strict';

  const SERVICE_ID  = 'service_iu0rgwg';
  const TEMPLATE_ID = 'template_w94w5fm';
  const PUBLIC_KEY  = 'a-CKITT6LHGwybHzj';

  const modal     = document.getElementById('cfgModal');
  const overlay   = document.getElementById('cfgModalOverlay');
  const closeBtn  = document.getElementById('cfgModalClose');
  const form      = document.getElementById('modalContactForm');
  const submitBtn = document.getElementById('modalSubmit');
  const statusEl  = document.getElementById('modalStatus');

  if (!modal) return;

  /* ── Закрыть модалку ── */
  function closeModal() {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  document.getElementById('cfgReset').click();
}

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

  /* ── Валидация ── */
  function validate() {
  let valid = true;
  const name  = form.querySelector('[name="from_name"]');
  const phone = form.querySelector('[name="from_phone"]');

  [name, phone].forEach(el => el.classList.remove('is-error'));

  if (!name.value.trim())  { name.classList.add('is-error');  valid = false; }
  if (!phone.value.trim()) { phone.classList.add('is-error'); valid = false; }

  return valid;
}

  /* ── Показать статус ── */
  function showStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className   = 'contacts__status is-' + type;
}

  /* ── Отправка ── */
  form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validate()) {
  showStatus('Пожалуйста, заполните обязательные поля.', 'error');
  return;
}

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Отправляем...';
  showStatus('', '');

  try {
  await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
  showStatus('Заявка отправлена! Свяжемся с вами в ближайшее время.', 'success');
  form.reset();
  document.getElementById('modal-cfg-result').value = '';
  /* Закрываем модалку через 2 секунды после успеха */
  setTimeout(closeModal, 5000);
} catch (err) {
  console.error('EmailJS error:', err);
  showStatus('Ошибка отправки. Напишите напрямую на hello@ai2b.by', 'error');
} finally {
  submitBtn.disabled    = false;
  submitBtn.textContent = 'Отправить заявку';
}
});

  /* ── Убираем ошибку при вводе ── */
  form.querySelectorAll('.contacts__input').forEach(el => {
  el.addEventListener('input', () => {
  el.classList.remove('is-error');
  if (statusEl.classList.contains('is-error')) showStatus('', '');
});
});

})();

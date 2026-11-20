// Четвёртая версия. Форма демонстрирует выбор без передачи контактов.
(() => {
  const S = window.SC;
  const branches = ['severnaya', '1-maya', 'trudovoy-slavy'];
  const branchUrl = id => 'studio-' + id + '.html';
  const branch = document.body.dataset.branch || new URLSearchParams(location.search).get('branch');
  const branchIndex = branches.indexOf(branch);
  const locations = document.querySelector('#locations');
  if (locations) {
    locations.innerHTML = S.studios.map((studio, i) =>
      `<a href="${branchUrl(branches[i])}"><strong>${studio.addr}</strong><small>О студии →</small></a>`
    ).join('');
  }
  document.querySelectorAll('.st-card h2').forEach((title, i) => {
    const link = document.createElement('a');
    link.href = branchUrl(branches[i]);
    link.textContent = title.textContent;
    title.replaceChildren(link);
  });
  document.querySelectorAll('a[data-booking], .item a[href="#cta"]').forEach(link => link.href = '#booking');
  const dialog = document.createElement('dialog');
  dialog.className = 'club-booking';
  dialog.id = 'booking';
  dialog.setAttribute('aria-labelledby', 'booking-title');
  dialog.innerHTML = `<button type="button" class="dismiss" aria-label="Закрыть">×</button>
    <h2 id="booking-title">Подобрать пробное занятие</h2>
    <p>Администратор поможет выбрать группу и время.</p>
    <form>
      <label>Студия<select name="branch"><option value="">Помогите выбрать</option></select></label>
      <label>Направление<select name="direction"><option value="">Помогите выбрать</option></select></label>
      <label>Телефон<input type="tel" name="phone" autocomplete="tel" required placeholder="+7 (___) ___-__-__"></label>
      <label class="booking-consent"><input type="checkbox" name="consent" required><span>Я даю согласие на обработку номера телефона и данных заявки для связи со мной по поводу пробного занятия.</span></label>
      <small><a href="https://s-class-fitness-krd.ru/privacy-policy-krd" target="_blank" rel="noopener">Политика обработки персональных данных</a></small>
      <button class="btn" type="submit">Отправить заявку</button>
    </form><p class="confirmation" tabindex="-1" hidden>Форма заполнена. В демонстрационной версии контакты не передаются.</p>`;
  document.body.appendChild(dialog);
  const form = dialog.querySelector('form');
  const fields = form.elements;
  S.studios.forEach((s, i) => fields.branch.add(new Option(s.addr, branches[i])));
  S.directions.forEach(d => fields.direction.add(new Option(d.name, d.slug)));
  const confirmation = dialog.querySelector('.confirmation');
  const close = dialog.querySelector('.dismiss');
  close.onclick = () => dialog.close();
  dialog.addEventListener('close', () => { form.reset(); fields.phone.setCustomValidity(''); });
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href="#booking"]');
    if (!link) return;
    e.preventDefault();
    fields.branch.value = branchIndex >= 0 ? branch : '';
    fields.direction.value = link.closest('.item')?.id || '';
    confirmation.hidden = true;
    form.hidden = false;
    dialog.showModal();
    fields.phone.focus();
  });
  fields.phone.oninput = () => fields.phone.setCustomValidity('');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!/^[+\d\s()-]+$/.test(fields.phone.value) || !/^([78]\d{10}|\d{10})$/.test(fields.phone.value.replace(/\D/g, ''))) {
      fields.phone.setCustomValidity('Введите номер с кодом города или оператора.');
      fields.phone.reportValidity();
      return;
    }
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
  });
})();

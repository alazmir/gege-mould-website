/**
 * Quick Message Widget — lightweight lead-capture popup
 * Separate from full RFQ form. Name + email + short message only.
 * Submits to /api/quick-message, tagged as quick_message in reporting.
 */
(function(){
  'use strict';

  // Create DOM elements
  function buildWidget() {
    var container = document.createElement('div');
    container.className = 'qm-widget';

    // Floating trigger button
    var trigger = document.createElement('button');
    trigger.className = 'qm-widget__trigger';
    trigger.setAttribute('aria-label', 'Quick message');
    trigger.title = 'Send us a quick message';
    trigger.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';
    container.appendChild(trigger);

    // Popup
    var popup = document.createElement('div');
    popup.className = 'qm-widget__popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Quick message form');
    popup.innerHTML =
      '<div class="qm-widget__popup-header">' +
        '<span class="qm-widget__popup-title" data-i18n-qm="title">Quick Message</span>' +
        '<button class="qm-widget__popup-close" aria-label="Close">&times;</button>' +
      '</div>' +
      '<form class="qm-widget__form" autocomplete="on">' +
        '<div class="qm-widget__field">' +
          '<input type="text" name="name" required placeholder="" data-i18n-qm-placeholder="name">' +
          '<label data-i18n-qm="name_label">Your Name</label>' +
        '</div>' +
        '<div class="qm-widget__field">' +
          '<input type="email" name="email" required placeholder="" data-i18n-qm-placeholder="email">' +
          '<label data-i18n-qm="email_label">Your Email</label>' +
        '</div>' +
        '<div class="qm-widget__field">' +
          '<textarea name="message" rows="3" placeholder="" data-i18n-qm-placeholder="message"></textarea>' +
          '<label data-i18n-qm="message_label">Message (optional)</label>' +
        '</div>' +
        '<button type="submit" class="qm-widget__submit" data-i18n-qm="send">Send Message</button>' +
      '</form>' +
      '<div class="qm-widget__success" style="display:none">' +
        '<div class="qm-widget__success-icon">&#10003;</div>' +
        '<p data-i18n-qm="success">Thanks! We\'ll get back to you within one business day.</p>' +
      '</div>';
    container.appendChild(popup);

    document.body.appendChild(container);
    return { container: container, trigger: trigger, popup: popup };
  }

  // Wait for DOM + i18n
  function init() {
    var els = buildWidget();
    var trigger = els.trigger;
    var popup = els.popup;
    var form = popup.querySelector('.qm-widget__form');
    var success = popup.querySelector('.qm-widget__success');
    var closeBtn = popup.querySelector('.qm-widget__popup-close');

    // Toggle popup
    trigger.addEventListener('click', function(){
      var isOpen = popup.classList.contains('qm-widget__popup--open');
      if (isOpen) {
        popup.classList.remove('qm-widget__popup--open');
      } else {
        popup.classList.add('qm-widget__popup--open');
        popup.querySelector('input[name="name"]').focus();
      }
    });

    closeBtn.addEventListener('click', function(){
      popup.classList.remove('qm-widget__popup--open');
    });

    // Close on Escape
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') popup.classList.remove('qm-widget__popup--open');
    });

    // Close on click outside
    document.addEventListener('click', function(e){
      if (popup.classList.contains('qm-widget__popup--open') &&
          !popup.contains(e.target) &&
          !trigger.contains(e.target)) {
        popup.classList.remove('qm-widget__popup--open');
      }
    });

    // Submit
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.querySelector('input[name="name"]').value.trim();
      var email = form.querySelector('input[name="email"]').value.trim();
      var message = form.querySelector('textarea[name="message"]').value.trim();

      if (!name || !email) {
        if (!name) form.querySelector('input[name="name"]').classList.add('qm-widget__input--error');
        if (!email) form.querySelector('input[name="email"]').classList.add('qm-widget__input--error');
        return;
      }

      var submitBtn = form.querySelector('.qm-widget__submit');
      submitBtn.disabled = true;
      submitBtn.textContent = (window.GEGE_I18N && window.GEGE_I18N.t('qm.sending')) || 'Sending...';

      var lang = (window.GEGE_I18N && window.GEGE_I18N.getLang()) || 'en';

      var apiBase = window.GEGE_API_BASE || '/api';
      fetch(apiBase + '/quick-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: message, language: lang })
      }).then(function(r){ return r.json(); })
        .then(function(data){
          if (data.success) {
            form.style.display = 'none';
            success.style.display = 'block';
            setTimeout(function(){
              popup.classList.remove('qm-widget__popup--open');
              setTimeout(function(){
                form.style.display = 'block';
                success.style.display = 'none';
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = (window.GEGE_I18N && window.GEGE_I18N.t('qm.send')) || 'Send Message';
              }, 500);
            }, 3000);
          } else {
            submitBtn.disabled = false;
            submitBtn.textContent = (window.GEGE_I18N && window.GEGE_I18N.t('qm.error')) || 'Error — try again';
          }
        }).catch(function(){
          submitBtn.disabled = false;
          submitBtn.textContent = (window.GEGE_I18N && window.GEGE_I18N.t('qm.error')) || 'Error — try again';
        });
    });

    // Clear error state on input
    form.querySelectorAll('input').forEach(function(inp){
      inp.addEventListener('input', function(){ inp.classList.remove('qm-widget__input--error'); });
    });

    // Apply i18n if available
    if (window.GEGE_I18N) {
      applyQmI18n();
    }

    // Expose re-apply for language switches
    window.QM_WIDGET = { applyI18n: applyQmI18n };
  }

  function applyQmI18n() {
    var t = window.GEGE_I18N && window.GEGE_I18N.t || function(k){ return k; };
    document.querySelectorAll('[data-i18n-qm]').forEach(function(el){
      var key = 'qm.' + el.getAttribute('data-i18n-qm');
      var translated = t(key);
      if (translated && translated !== key) el.textContent = translated;
    });
    document.querySelectorAll('[data-i18n-qm-placeholder]').forEach(function(el){
      var key = 'qm.' + el.getAttribute('data-i18n-qm-placeholder');
      var translated = t(key);
      if (translated && translated !== key) el.setAttribute('placeholder', translated);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

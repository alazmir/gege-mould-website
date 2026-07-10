/**
 * Gege Mould — Main JavaScript
 * Plastic Injection Mold & Injection Molding Specialists
 */
(function(){'use strict';
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}

  function init(){
    utmCapture();
    mobileNav();
    headerScroll();
    scrollAnimations();
    smoothScroll();
    counterAnimation();
    formValidation();
    initWhatsAppWidget();
    initAnalytics();
  }

  // ── UTM Parameter Capture ──
  function utmCapture(){
    var params=new URLSearchParams(window.location.search);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(k){
      if(params.has(k)){try{sessionStorage.setItem(k,params.get(k))}catch(e){}}
    });
  }

  // ── Mobile Navigation ──
  function mobileNav(){
    var toggle=document.querySelector('.nav__toggle');
    var body=document.body;
    if(!toggle)return;
    toggle.addEventListener('click',function(){
      body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded',body.classList.contains('nav-open')?'true':'false');
    });
    var links=document.querySelectorAll('.nav__link');
    links.forEach(function(l){l.addEventListener('click',function(){body.classList.remove('nav-open');toggle.setAttribute('aria-expanded','false')})});

    // ── Mega Menu & Dropdown Keyboard + Touch Support ──
    initDropdownAccessibility();
  }

  function initDropdownAccessibility(){
    var dropdowns = document.querySelectorAll('.nav__dropdown');
    dropdowns.forEach(function(dd){
      var toggle = dd.querySelector('.nav__dropdown-toggle');
      var menu = dd.querySelector('.nav__mega') || dd.querySelector('.nav__dropdown-menu');
      if (!toggle || !menu) return;

      // Keyboard: Enter/Space toggles, Escape closes
      toggle.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var isOpen = dd.classList.contains('nav__dropdown--open');
          closeAllDropdowns();
          if (!isOpen) {
            dd.classList.add('nav__dropdown--open');
            toggle.setAttribute('aria-expanded', 'true');
            // Focus first link in the dropdown
            var firstLink = menu.querySelector('.nav__link');
            if (firstLink) firstLink.focus();
          }
        }
      });

      // Touch: tap toggles dropdown (prevents navigation on mobile)
      toggle.addEventListener('click', function(e){
        // On mobile/tablet: tap toggles the dropdown menu instead of navigating
        if (window.innerWidth <= 1024) {
          var isOpen = dd.classList.contains('nav__dropdown--open');
          closeAllDropdowns();
          if (!isOpen) {
            e.preventDefault();
            dd.classList.add('nav__dropdown--open');
            toggle.setAttribute('aria-expanded', 'true');
          }
          // If already open, let the click navigate to the href (e.g. about.html, news.html)
        }
        // On desktop: hover opens the dropdown; click navigates to the href
      });

      // Escape key closes dropdown
      menu.addEventListener('keydown', function(e){
        if (e.key === 'Escape') {
          closeAllDropdowns();
          toggle.focus();
        }
      });

      // Close on focus leaving the dropdown entirely
      menu.addEventListener('focusout', function(e){
        // Small delay to check where focus went
        setTimeout(function(){
          if (!dd.contains(document.activeElement)) {
            dd.classList.remove('nav__dropdown--open');
            toggle.setAttribute('aria-expanded', 'false');
          }
        }, 10);
      });
    });

    // Close all dropdowns on outside click
    document.addEventListener('click', function(e){
      if (!e.target.closest('.nav__dropdown')) {
        closeAllDropdowns();
      }
    });

    function closeAllDropdowns(){
      document.querySelectorAll('.nav__dropdown--open').forEach(function(dd){
        dd.classList.remove('nav__dropdown--open');
        var t = dd.querySelector('.nav__dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // ── Header Hide/Show on Scroll ──
  function headerScroll(){
    var header=document.querySelector('.header');
    if(!header)return;
    var lastScroll=0;
    var ticking=false;
    window.addEventListener('scroll',function(){
      if(!ticking){requestAnimationFrame(function(){
        var scrollY=window.pageYOffset;
        if(scrollY>lastScroll&&scrollY>header.offsetHeight){header.style.transform='translateY(-100%)'}
        else{header.style.transform='translateY(0)'}
        lastScroll=scrollY;
        ticking=false;
      });ticking=true}
    },{passive:true});
  }

  // ── Scroll Animations ──
  function scrollAnimations(){
    var els=document.querySelectorAll('.animate-in');
    if(!els.length)return;
    if('IntersectionObserver' in window){
      var observer=new IntersectionObserver(function(entries){
        entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}});
      },{threshold:0.15});
      els.forEach(function(el){observer.observe(el)});
    }else{els.forEach(function(el){el.classList.add('is-visible')})}
  }

  // ── Smooth Scroll ──
  function smoothScroll(){
    document.addEventListener('click',function(e){
      var link=e.target.closest('a[href^="#"]');
      if(!link)return;
      var id=link.getAttribute('href');if(id==='#')return;
      var target=document.querySelector(id);
      if(!target)return;
      e.preventDefault();
      window.scrollTo({top:target.getBoundingClientRect().top+window.pageYOffset-80,behavior:'smooth'});
    });
  }

  // ── Counter Animation ──
  function counterAnimation(){
    var counters=document.querySelectorAll('.stat__number[data-count]');
    if(!counters.length)return;
    if('IntersectionObserver' in window){
      var observer=new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            var el=e.target;
            var target=parseInt(el.getAttribute('data-count'));
            var duration=2000;
            var start=performance.now();
            function update(ts){
              var progress=Math.min((ts-start)/duration,1);
              var eased=1-Math.pow(1-progress,3);
              el.textContent=Math.floor(eased*target).toLocaleString();
              if(progress<1)requestAnimationFrame(update);
              else el.textContent=target.toLocaleString();
            }
            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },{threshold:0.5});
      counters.forEach(function(c){observer.observe(c)});
    }
  }

  // ── WhatsApp Chat Widget ──
  function initWhatsAppWidget(){
    var btn=document.querySelector('.whatsapp-widget');
    var widget=document.querySelector('.chat-widget');
    var isOpen=false;
    var currentReply='';

    if(!btn||!widget)return;

    // Ensure widget DOM exists
    ensureWidgetDOM(widget);

    btn.addEventListener('click',function(e){
      e.preventDefault();
      if(isOpen){closeWidget()}else{openWidget()}
    });

    function openWidget(){
      widget.classList.add('chat-widget--open');
      isOpen=true;
      btn.setAttribute('aria-expanded','true');
      // If first open, show greeting
      var body=widget.querySelector('.chat-widget__body');
      if(!body.querySelector('.chat-widget__msg')){
        showGreeting(body);
      }
      trackInteraction('open');
    }

    function closeWidget(){
      widget.classList.remove('chat-widget--open');
      isOpen=false;
      btn.setAttribute('aria-expanded','false');
    }

    function ensureWidgetDOM(w){
      if(!w.querySelector('.chat-widget__header')){
        var h=document.createElement('div');h.className='chat-widget__header';
        h.innerHTML='<span class="chat-widget__title">Gege Mould</span><button class="chat-widget__close" aria-label="Close chat">&times;</button>';
        w.appendChild(h);
        w.querySelector('.chat-widget__close').addEventListener('click',closeWidget);
      }
      if(!w.querySelector('.chat-widget__body')){
        var b=document.createElement('div');b.className='chat-widget__body';w.appendChild(b);
      }
      if(!w.querySelector('.chat-widget__quick-replies')){
        var q=document.createElement('div');q.className='chat-widget__quick-replies';w.appendChild(q);
      }
      if(!w.querySelector('.chat-widget__footer')){
        var f=document.createElement('div');f.className='chat-widget__footer';w.appendChild(f);
      }
    }

    function showGreeting(body){
      var lang=(window.GEGE_I18N&&window.GEGE_I18N.getLang())||'en';
      var msgs={
        greeting:{en:'Hi, thanks for reaching out to Gege Mould! What can we help with?',pt:'Olá, obrigado por contactar a Gege Mould! Como podemos ajudar?',es:'Hola, gracias por contactar con Gege Mould. ¿En qué podemos ayudarle?',ar:'مرحباً، شكراً لتواصلك مع Gege Mould! كيف يمكننا مساعدتك؟',id:'Hai, terima kasih telah menghubungi Gege Mould! Ada yang bisa kami bantu?'},
        quick_quote:{en:'Get a Quote',pt:'Solicitar Orçamento',es:'Solicitar Presupuesto',ar:'طلب عرض سعر',id:'Minta Penawaran'},
        quick_cap:{en:'Ask About Capabilities',pt:'Perguntar Sobre Capacidades',es:'Consultar Capacidades',ar:'استفسار عن القدرات',id:'Tanya Tentang Kemampuan'},
        quick_gen:{en:'General Question',pt:'Pergunta Geral',es:'Pregunta General',ar:'سؤال عام',id:'Pertanyaan Umum'},
        reply_quote:{en:'Great! You can fill out our RFQ form or tell me what kind of mould you need and I will connect you with our engineering team.',pt:'Ótimo! Pode preencher o nosso formulário RFQ ou dizer-me que tipo de molde precisa e eu conecto-o com a nossa equipa de engenharia.',es:'¡Excelente! Puede completar nuestro formulario RFQ o decirme qué tipo de molde necesita y lo conectaré con nuestro equipo de ingeniería.',ar:'رائع! يمكنك ملء نموذج طلب عرض السعر أو إخباري بنوع القالب الذي تحتاجه وسأوصلك بفريقنا الهندسي.',id:'Bagus! Anda dapat mengisi formulir RFQ kami atau beri tahu jenis mould yang Anda butuhkan dan saya akan menghubungkan Anda dengan tim teknik kami.'},
        reply_cap:{en:'We specialise in automotive injection mould design, precision tooling, and high-volume moulding production. Would you like to discuss a specific project?',pt:'Especializamo-nos em design de moldes de injeção automotiva, ferramentas de precisão e produção de alto volume. Gostaria de discutir um projeto específico?',es:'Nos especializamos en diseño de moldes de inyección automotriz, herramientas de precisión y producción de alto volumen. ¿Le gustaría discutir un proyecto específico?',ar:'نحن متخصصون في تصميم قوالب حقن السيارات والأدوات الدقيقة والإنتاج عالي الحجم. هل ترغب في مناقشة مشروع محدد؟',id:'Kami mengkhususkan diri dalam desain mould injeksi otomotif, perkakas presisi, dan produksi volume tinggi. Apakah Anda ingin mendiskusikan proyek tertentu?'},
        reply_gen:{en:'Happy to help! What would you like to know about Gege Mould?',pt:'Feliz em ajudar! O que gostaria de saber sobre a Gege Mould?',es:'¡Encantados de ayudar! ¿Qué le gustaría saber sobre Gege Mould?',ar:'سعداء بمساعدتك! ماذا تود معرفته عن Gege Mould؟',id:'Senang membantu! Apa yang ingin Anda ketahui tentang Gege Mould?'},
        continue_btn:{en:'Continue on WhatsApp',pt:'Continuar no WhatsApp',es:'Continuar en WhatsApp',ar:'المتابعة على واتساب',id:'Lanjutkan di WhatsApp'}
      };

      function t(cat,key){return msgs[cat]&&msgs[cat][lang]?msgs[cat][lang]:msgs[cat]['en']}

      addMsg(body,'bot',t('greeting'));

      var replies=widget.querySelector('.chat-widget__quick-replies');
      replies.innerHTML='';
      var btns=[
        {key:'quote',txt:t('quick_quote'),reply:t('reply_quote'),waText:'Hi, I would like to get a quote for an injection mould.'},
        {key:'capabilities',txt:t('quick_cap'),reply:t('reply_cap'),waText:'Hi, I would like to ask about Gege Mould capabilities.'},
        {key:'general',txt:t('quick_gen'),reply:t('reply_gen'),waText:'Hi, I have a question about Gege Mould.'}
      ];
      btns.forEach(function(b){
        var qb=document.createElement('button');
        qb.className='chat-widget__quick-btn';qb.textContent=b.txt;
        qb.addEventListener('click',function(){
          currentReply=b.key;
          addMsg(body,'user',b.txt);
          replies.querySelectorAll('.chat-widget__quick-btn').forEach(function(bb){bb.disabled=true});
          setTimeout(function(){
            addMsg(body,'bot',b.reply);
            showWhatsAppButton(b.waText);
          },400);
          trackInteraction('quick_reply',b.key);
        });
        replies.appendChild(qb);
      });
    }

    function addMsg(body,type,text){
      var m=document.createElement('div');
      m.className='chat-widget__msg chat-widget__msg--'+type;m.textContent=text;
      body.appendChild(m);
      body.scrollTop=body.scrollHeight;
    }

    function showWhatsAppButton(waText){
      var footer=widget.querySelector('.chat-widget__footer');
      var lang=(window.GEGE_I18N&&window.GEGE_I18N.getLang())||'en';
      var labels={en:'Continue on WhatsApp',pt:'Continuar no WhatsApp',es:'Continuar en WhatsApp',ar:'المتابعة على واتساب',id:'Lanjutkan di WhatsApp'};
      var label=labels[lang]||labels.en;

      var wa='https://wa.me/8613634093666?text='+encodeURIComponent(waText);
      footer.innerHTML='<a href="'+wa+'" class="chat-widget__wa-btn" target="_blank" rel="noopener">'+
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>'+
        label+'</a>';
    }

    function trackInteraction(action,detail){
      try{
        var payload={action:action,detail:detail||'',language:(window.GEGE_I18N&&window.GEGE_I18N.getLang())||'en'};
        ['utm_source','utm_medium','utm_campaign'].forEach(function(k){try{var v=sessionStorage.getItem(k);if(v)payload[k]=v}catch(e){}});
        payload.referrer=document.referrer||'';
        var xhr=new XMLHttpRequest();
        xhr.open('POST','/api/widget-interaction',true);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify(payload));
      }catch(e){}
    }
  }

  // ── Contact Form Validation + Submission ──
  function formValidation(){
    var form=document.querySelector('#contact-form');
    if(!form)return;
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var valid=true;
      var name=form.querySelector('[name="name"]');
      var email=form.querySelector('[name="email"]');
      var message=form.querySelector('[name="message"]');
      form.querySelectorAll('.form__error').forEach(function(el){el.textContent=''});
      form.querySelectorAll('.form-group--error').forEach(function(el){el.classList.remove('form-group--error')});
      if(name&&!name.value.trim()){showError(name,'Please enter your name');valid=false}
      if(email&&!email.value.trim()){showError(email,'Please enter your email');valid=false}
      else if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){showError(email,'Please enter a valid email');valid=false}
      if(message&&!message.value.trim()){showError(message,'Please enter your message');valid=false}
      if(!valid)return;

      // Build submission payload
      var submitBtn = form.querySelector('[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.textContent = 'Sending…'; submitBtn.disabled = true; }

      var payload = {
        name: (name ? name.value.trim() : ''),
        company: (form.querySelector('[name="company"]') ? form.querySelector('[name="company"]').value.trim() : ''),
        email: (email ? email.value.trim() : ''),
        phone: (form.querySelector('[name="phone"]') ? form.querySelector('[name="phone"]').value.trim() : ''),
        inquiry: (form.querySelector('[name="inquiry"]') ? form.querySelector('[name="inquiry"]').value : ''),
        message: (message ? message.value.trim() : ''),
        _website: (form.querySelector('[name="_website"]') ? form.querySelector('[name="_website"]').value : ''),
        language: (window.GEGE_I18N && window.GEGE_I18N.getLang()) || 'en'
      };

      var apiBase = window.GEGE_API_BASE || '/api';

      // Retry-enabled fetch — handles Render cold starts by retrying once after 5 seconds
      function fetchWithRetry(url, options, retriesLeft, onRetry) {
        onRetry = onRetry || 0;
        return fetch(url, options).catch(function(err) {
          if (retriesLeft > 0) {
            if (onRetry === 0 && submitBtn) {
              submitBtn.textContent = 'Waking server…';
            }
            return new Promise(function(resolve) {
              setTimeout(function() {
                resolve(fetchWithRetry(url, options, retriesLeft - 1, 1));
              }, 5000);
            });
          }
          throw err;
        });
      }

      fetchWithRetry(apiBase + '/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, 1)
      .then(function(res){ return res.json(); })
      .then(function(data){
        if (submitBtn) { submitBtn.textContent = originalText; submitBtn.disabled = false; }
        if (data.success) {
          form.reset();
          showSuccess(form, data.message || 'Thank you! Your inquiry has been submitted successfully.');
        } else if (data.errors) {
          data.errors.forEach(function(err){ showServerError(form, err); });
        } else {
          showServerError(form, {message: 'Something went wrong. Please try again or contact us directly by email.'});
        }
      })
      .catch(function(){
        if (submitBtn) { submitBtn.textContent = originalText; submitBtn.disabled = false; }
        showServerError(form, {message: 'Network error. Please check your connection and try again.'});
      });
    });
    function showError(field,msg){
      var group = field.closest('.form-group');
      if (group) group.classList.add('form-group--error');
      var errorEl=field.parentNode.querySelector('.form__error');
      if(errorEl)errorEl.textContent=msg;
    }
    function showSuccess(form, msg){
      var existing = form.querySelector('.form__success');
      if (existing) existing.remove();
      var el = document.createElement('div');
      el.className = 'form__success';
      el.style.cssText = 'background:#e8f5e9;color:#2e7d32;padding:1rem;border-radius:6px;margin-bottom:1rem;font-weight:500;text-align:center;';
      el.textContent = msg;
      form.insertBefore(el, form.firstChild);
    }
    function showServerError(form, err){
      var existing = form.querySelector('.form__server-error');
      if (existing) existing.remove();
      var el = document.createElement('div');
      el.className = 'form__server-error';
      el.style.cssText = 'background:#fbe9e7;color:#c62828;padding:1rem;border-radius:6px;margin-bottom:1rem;font-weight:500;text-align:center;';
      el.textContent = err.message || 'Submission failed. Please try again.';
      form.insertBefore(el, form.firstChild);
      setTimeout(function(){ if (el.parentNode) el.remove(); }, 8000);
    }
  }
  // ── Analytics Event Tracking ──
  function initAnalytics(){
    // Helper: push event to GA4 dataLayer + gtag
    function trackEvent(eventName, params){
      params = params || {};
      params.event_category = params.event_category || 'engagement';
      // GA4 gtag
      if (typeof gtag === 'function') {
        gtag('event', eventName, params);
      }
      // Also push to dataLayer for GTM compatibility
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...params });
    }

    // 1. CTA clicks — "Get a Free Quote" buttons
    document.addEventListener('click', function(e){
      var cta = e.target.closest('a[href="contact.html"], a[href="rfq.html"], .btn--primary');
      if (!cta) return;
      var label = (cta.textContent || '').trim() || cta.getAttribute('aria-label') || 'CTA';
      var location = cta.closest('header') ? 'header' : cta.closest('footer') ? 'footer' : cta.closest('.hero') ? 'hero' : cta.closest('.cta-band') ? 'cta_band' : 'body';
      trackEvent('cta_click', {
        event_category: 'conversion',
        cta_label: label,
        cta_location: location,
        cta_url: cta.getAttribute('href') || ''
      });
    });

    // 2. Phone call clicks (tel: links)
    document.addEventListener('click', function(e){
      var tel = e.target.closest('a[href^="tel:"]');
      if (!tel) return;
      trackEvent('phone_call_click', {
        event_category: 'conversion',
        phone_number: tel.getAttribute('href') || ''
      });
    });

    // 3. Language switcher clicks
    document.addEventListener('click', function(e){
      var langBtn = e.target.closest('.lang-switcher__btn');
      if (!langBtn) return;
      var lang = (langBtn.getAttribute('aria-label') || langBtn.textContent || '').trim();
      trackEvent('language_switch', {
        event_category: 'engagement',
        language: lang
      });
    });

    // 4. WhatsApp widget opens
    document.addEventListener('click', function(e){
      var wa = e.target.closest('.whatsapp-widget');
      if (!wa) return;
      trackEvent('whatsapp_open', { event_category: 'conversion' });
    });

    // 5. Product segment clicks (What We Make grid)
    document.addEventListener('click', function(e){
      var item = e.target.closest('.what-we-make__item');
      if (!item) return;
      var caption = item.querySelector('.what-we-make__caption');
      var label = caption ? caption.textContent.trim() : 'Unknown';
      trackEvent('product_segment_click', {
        event_category: 'engagement',
        segment_name: label,
        segment_url: item.getAttribute('href') || ''
      });
    });

    // 6. Market card flip clicks
    document.addEventListener('click', function(e){
      var card = e.target.closest('.market-card--flip');
      if (!card) return;
      var h3 = card.querySelector('h3');
      var label = h3 ? h3.textContent.trim() : 'Unknown';
      trackEvent('market_card_click', {
        event_category: 'engagement',
        card_name: label
      });
    });

    // 7. Blog post / resource link clicks
    document.addEventListener('click', function(e){
      var link = e.target.closest('a[href*="blog-"], a[href*="case-stud"], a[href*="news."]');
      if (!link) return;
      trackEvent('resource_link_click', {
        event_category: 'engagement',
        link_url: link.getAttribute('href') || '',
        link_text: (link.textContent || '').trim()
      });
    });

    // 8. Form submissions — hook into existing form success
    // Contact form success is handled by formValidation() → showSuccess()
    // We monkey-patch to track
    var origShowSuccess = window._formShowSuccess;
    document.addEventListener('DOMContentLoaded', function(){
      // Listen for form success indicators
      var observer = new MutationObserver(function(mutations){
        mutations.forEach(function(m){
          m.addedNodes.forEach(function(node){
            if (node.classList && node.classList.contains('form__success')){
              trackEvent('form_submission', {
                event_category: 'conversion',
                form_type: 'contact'
              });
            }
          });
        });
      });
      var contactForm = document.querySelector('#contact-form');
      if (contactForm) {
        observer.observe(contactForm, { childList: true, subtree: true });
      }
    });

    // 9. RFQ form success — watch for success box display
    document.addEventListener('DOMContentLoaded', function(){
      var rfqSuccess = document.getElementById('rfq-success');
      if (!rfqSuccess) return;
      var rfqObserver = new MutationObserver(function(mutations){
        mutations.forEach(function(m){
          if (m.target.style.display === 'block'){
            trackEvent('form_submission', {
              event_category: 'conversion',
              form_type: 'rfq'
            });
          }
        });
      });
      rfqObserver.observe(rfqSuccess, { attributes: true, attributeFilter: ['style'] });
    });

    // 10. Capability table interaction
    document.addEventListener('click', function(e){
      var row = e.target.closest('.capability-table tr[data-href]');
      if (!row) return;
      trackEvent('capability_table_click', {
        event_category: 'engagement',
        row_href: row.getAttribute('data-href') || ''
      });
    });

    // 11. External link clicks
    document.addEventListener('click', function(e){
      var ext = e.target.closest('a[href^="http"]:not([href*="gegemould.com"]):not([href*="localhost"])');
      if (!ext) return;
      trackEvent('external_link_click', {
        event_category: 'engagement',
        link_url: ext.getAttribute('href') || ''
      });
    });

    console.log('[Analytics] Event tracking initialized — GA4 events: cta_click, phone_call_click, language_switch, whatsapp_open, product_segment_click, market_card_click, resource_link_click, form_submission, capability_table_click, external_link_click');
  }

  // ── Case Study Expand/Collapse ──
  function initCaseStudyExpand() {
    var btns = document.querySelectorAll('.case-detail-btn');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var caseId = btn.getAttribute('data-case');
        if (!caseId) return; // It's a link, let it navigate
        e.preventDefault();
        var card = btn.closest('.case-card');
        var expanded = card ? card.querySelector('.case-card__expanded[data-case="' + caseId + '"]') : null;
        if (!expanded) return;
        var isOpen = expanded.classList.contains('is-open');
        if (isOpen) {
          expanded.classList.remove('is-open');
          btn.querySelector('.arrow').textContent = '→';
          btn.setAttribute('aria-expanded', 'false');
        } else {
          expanded.classList.add('is-open');
          btn.querySelector('.arrow').textContent = '↓';
          btn.setAttribute('aria-expanded', 'true');
          // Smooth scroll to keep expanded content in view
          setTimeout(function() {
            expanded.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCaseStudyExpand);
  } else {
    initCaseStudyExpand();
  }
})();

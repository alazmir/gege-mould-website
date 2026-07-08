/**
 * Gege Mould — Multi-Step RFQ Form Logic
 */
(function () {
  'use strict';

  const form = document.getElementById('rfq-form');
  if (!form) return;

  const panels = form.querySelectorAll('.rfq-panel');
  const steps = document.querySelectorAll('.rfq-step');
  const successBox = document.getElementById('rfq-success');
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('files');
  const fileList = document.getElementById('file-list');
  const uploadError = document.getElementById('upload-error');
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
  const MAX_FILES = 5;
  const ALLOWED_EXTENSIONS = ['.step','.stp','.igs','.iges','.pdf','.dwg','.dxf','.zip'];
  let selectedFiles = [];

  // ── Step Navigation ──
  form.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('.rfq-next');
    const prevBtn = e.target.closest('.rfq-prev');

    if (nextBtn) {
      const currentPanel = form.querySelector('.rfq-panel--active');
      const nextStep = nextBtn.dataset.next;
      if (validateStep(currentPanel)) {
        goToStep(nextStep);
        window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
      }
    }
    if (prevBtn) {
      goToStep(prevBtn.dataset.prev);
      window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    }
  });

  function goToStep(n) {
    panels.forEach(p => p.classList.remove('rfq-panel--active'));
    steps.forEach(s => s.classList.remove('rfq-step--active', 'rfq-step--done'));
    const panel = document.getElementById('rfq-step-' + n);
    if (panel) panel.classList.add('rfq-panel--active');
    steps.forEach(s => {
      const sn = parseInt(s.dataset.step, 10);
      if (sn === n) s.classList.add('rfq-step--active');
      if (sn < n) s.classList.add('rfq-step--done');
    });
  }

  function validateStep(panel) {
    const reqs = panel.querySelectorAll('[required]');
    let valid = true;
    reqs.forEach(f => {
      if (!f.value.trim()) {
        f.style.borderColor = 'var(--error)';
        f.style.background = '#fff5f5';
        valid = false;
        setTimeout(() => { f.style.borderColor = ''; f.style.background = ''; }, 2000);
      }
    });
    if (!valid) {
      const first = panel.querySelector('[required]:invalid, [style*="var(--error)"]');
      if (first) first.focus();
    }
    return valid;
  }

  // ── File Upload ──
  uploadZone.addEventListener('click', (e) => {
    if (e.target.closest('.rfq-file-item__remove')) return;
    fileInput.click();
  });
  uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('rfq-upload--drag'); });
  uploadZone.addEventListener('dragleave', () => { uploadZone.classList.remove('rfq-upload--drag'); });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('rfq-upload--drag');
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', () => handleFiles(fileInput.files));

  function handleFiles(files) {
    uploadError.style.display = 'none';
    for (const f of files) {
      if (selectedFiles.length >= MAX_FILES) { showUploadError('Maximum 5 files allowed.'); return; }
      const ext = '.' + f.name.split('.').pop().toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) { showUploadError(`"${f.name}" is not an accepted file type. Accepted: ${ALLOWED_EXTENSIONS.join(', ')}`); continue; }
      if (f.size > MAX_FILE_SIZE) { showUploadError(`"${f.name}" exceeds the 25 MB file size limit.`); continue; }
      if (selectedFiles.some(sf => sf.name === f.name && sf.size === f.size)) continue;
      selectedFiles.push(f);
    }
    renderFileList();
  }

  function renderFileList() {
    fileList.innerHTML = '';
    selectedFiles.forEach((f, i) => {
      const li = document.createElement('li');
      li.className = 'rfq-file-item';
      li.innerHTML = `<span class="rfq-file-item__name">${escapeHtml(f.name)}</span><span class="rfq-file-item__size">${formatSize(f.size)}</span><button type="button" class="rfq-file-item__remove" data-idx="${i}" aria-label="Remove ${escapeHtml(f.name)}">✕</button>`;
      fileList.appendChild(li);
    });
    // Click handler delegated
  }

  fileList.addEventListener('click', (e) => {
    const btn = e.target.closest('.rfq-file-item__remove');
    if (btn) {
      const idx = parseInt(btn.dataset.idx, 10);
      selectedFiles.splice(idx, 1);
      renderFileList();
    }
  });

  function showUploadError(msg) {
    uploadError.textContent = msg;
    uploadError.style.display = 'block';
    setTimeout(() => { uploadError.style.display = 'none'; }, 5000);
  }

  // ── Form Submission ──
  let isSubmitting = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateStep(form.querySelector('#rfq-step-3'))) return;

    isSubmitting = true;
    const btn = document.getElementById('rfq-submit');
    const origText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    try {
      const fd = new FormData(form);
      selectedFiles.forEach(f => fd.append('files', f));

      const API_BASE = window.GEGE_API_BASE || '/api';
      const res = await fetch(`${API_BASE}/rfq`, {
        method: 'POST',
        body: fd,
      });
      const result = await res.json();

      if (res.ok && result.success) {
        document.getElementById('rfq-ref').textContent = result.reference || '—';
        form.querySelectorAll('.rfq-panel').forEach(p => p.style.display = 'none');
        document.querySelector('.rfq-steps').style.display = 'none';
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const errs = result.errors || [];
        if (errs.length) {
          alert(errs.map(e => e.message).join('\n'));
        } else {
          alert(result.message || 'Submission failed. Please try again or email us directly.');
        }
      }
    } catch (err) {
      console.error('[RFQ]', err);
      alert('Unable to reach the server. Please check your connection and try again.');
    } finally {
      isSubmitting = false;
      btn.textContent = origText;
      btn.disabled = false;
    }
  });

  function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function formatSize(bytes) { return bytes < 1024*1024 ? (bytes/1024).toFixed(0)+' KB' : (bytes/(1024*1024)).toFixed(1)+' MB'; }
})();

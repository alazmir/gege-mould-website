/**
 * Gege Mould — Capability Table Filtering
 */
(function () {
  'use strict';
  const tbody = document.querySelector('#specs-table tbody');
  if (!tbody) return;
  const rows = tbody.querySelectorAll('tr');
  const filterIndustry = document.getElementById('filter-industry');
  const filterMaterial = document.getElementById('filter-material');
  const filterSearch = document.getElementById('filter-search');

  function applyFilters() {
    const industry = filterIndustry?.value || 'all';
    const material = filterMaterial?.value || 'all';
    const search = (filterSearch?.value || '').toLowerCase().trim();

    rows.forEach(row => {
      const rowIndustry = row.dataset.industry || '';
      const rowMaterial = row.dataset.material || '';
      const rowText = row.textContent.toLowerCase();

      const matchIndustry = industry === 'all' || rowIndustry.includes(industry);
      const matchMaterial = material === 'all' || rowMaterial.includes(material);
      const matchSearch = !search || rowText.includes(search);

      row.style.display = (matchIndustry && matchMaterial && matchSearch) ? '' : 'none';
    });
  }

  filterIndustry?.addEventListener('change', applyFilters);
  filterMaterial?.addEventListener('change', applyFilters);
  filterSearch?.addEventListener('input', applyFilters);
})();

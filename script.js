
// assets/script.js

// NAV TOGGLE (mobile)
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
if(navToggle){
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('show');
  });
}

// CATEGORY FILTER (desktop buttons)
const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
const cards = Array.from(document.querySelectorAll('.item-card'));
const select = document.getElementById('filter-select');
const searchInput = document.getElementById('search');

function showCategory(cat){
  cards.forEach(card => {
    if(cat === 'all' || card.dataset.cat === cat){
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// desktop buttons click
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.cat;
    // active state
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // sync mobile select if present
    if(select) select.value = category;

    // apply filter
    applyFilters();
  });
});

// mobile select change -> sync buttons
if(select){
  select.addEventListener('change', (e) => {
    const cat = e.target.value;
    // update desktop buttons active state
    tabButtons.forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
    applyFilters();
  });
}

// SEARCH + combined filters
function applyFilters(){
  const activeBtn = tabButtons.find(b => b.classList.contains('active'));
  const cat = activeBtn ? activeBtn.dataset.cat : (select ? select.value : 'all');
  const term = searchInput ? searchInput.value.trim().toLowerCase() : '';

  cards.forEach(card => {
    const matchesCat = (cat === 'all' || card.dataset.cat === cat);
    const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
    const desc = (card.querySelector('.muted')?.textContent || '').toLowerCase();
    const matchesSearch = term === '' || title.includes(term) || desc.includes(term) || (card.dataset.id || '').toLowerCase().includes(term);

    card.style.display = (matchesCat && matchesSearch) ? '' : 'none';
  });
}

// search input (live)
if(searchInput){
  searchInput.addEventListener('input', () => {
    applyFilters();
  });
}

// keyboard accessibility: allow Enter on focused tab-btn to trigger it
tabButtons.forEach(btn => {
  btn.addEventListener('keyup', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      btn.click();
    }
  });
});

// Initialize (ensure correct initial filter)
document.addEventListener('DOMContentLoaded', () => {
  // ensure a default active exists
  if(!tabButtons.some(b=>b.classList.contains('active')) && tabButtons.length) tabButtons[0].classList.add('active');
  if(select && !select.value) select.value = tabButtons.find(b=>b.classList.contains('active'))?.dataset.cat || 'all';
  applyFilters();
});

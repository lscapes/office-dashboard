// ============================================================
//  App Controller — routing, init, nav
// ============================================================

const PAGES = {
  kpi:      { render: renderKPI,      title: 'KPI Overview'    },
  photos:   { render: renderPhotoPage, title: 'Photo Tracker'  },
  pipeline: { render: renderPipeline,  title: 'Lead Pipeline'  },
};

let currentPage = 'kpi';

function navigate(pageId) {
  if (!PAGES[pageId]) return;
  currentPage = pageId;

  // Update nav
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });

  // Hide/show pages
  document.querySelectorAll('.page').forEach(el => {
    el.classList.toggle('active', el.id === `page-${pageId}`);
  });

  // Render
  PAGES[pageId].render();
}

function init() {
  // Set date
  const now = new Date();
  document.getElementById('lastUpdated').textContent =
    now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Nav click handlers
  document.querySelectorAll('.nav-link').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.dataset.page);
    });
  });

  // Initial render
  navigate('kpi');
}

document.addEventListener('DOMContentLoaded', init);

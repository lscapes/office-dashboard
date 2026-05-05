// ============================================================
//  App Controller
// ============================================================

function init() {
  const now = new Date();
  document.getElementById('lastUpdated').textContent =
    now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  document.querySelectorAll('.nav-link').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      el.classList.add('active');
    });
  });

  renderPhotoPage();
}

document.addEventListener('DOMContentLoaded', init);

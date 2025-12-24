document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabButtons.length === 0) return; // Exit if no tabs on page

  function switchTab(targetTab) {
    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked button and corresponding content
    const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
    const targetContent = document.getElementById(targetTab + '-tab');

    if (targetButton && targetContent) {
      targetButton.classList.add('active');
      targetContent.classList.add('active');
    }
  }

  // Handle tab clicks
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      switchTab(targetTab);

      // Update URL hash without scrolling
      history.pushState(null, null, '#' + targetTab);
    });
  });

  // Handle initial load with hash
  const hash = window.location.hash.slice(1); // Remove the # symbol

  if (hash && (hash === 'talks' || hash === 'livestreams' || hash === 'podcasts')) {
    switchTab(hash);
  } else if (window.location.href.includes('#')) {
    // Handle cases where URL might be /speaking#livestreams without the slash
    const urlHash = window.location.href.split('#')[1];
    if (urlHash && (urlHash === 'talks' || urlHash === 'livestreams' || urlHash === 'podcasts')) {
      switchTab(urlHash);
    }
  }

  // Handle hash changes (back/forward browser buttons)
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.slice(1);
    if (hash && (hash === 'talks' || hash === 'livestreams' || hash === 'podcasts')) {
      switchTab(hash);
    }
  });
});
(function () {
  var allowedThemes = { dark: true, light: true, cool: true };
  var themeOrder = ['dark', 'light', 'cool'];

  function getSavedTheme() {
    try {
      return window.localStorage.getItem('bwdotcom-theme');
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem('bwdotcom-theme', theme);
    } catch (e) {
      // Ignore storage failures.
    }
  }

  function applyTheme(theme) {
    var nextTheme = allowedThemes[theme] ? theme : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    saveTheme(nextTheme);
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', 'Theme: ' + nextTheme + '. Click to switch theme.');
      toggle.title = 'Theme: ' + nextTheme;
    }
  }

  function nextTheme(currentTheme) {
    var idx = themeOrder.indexOf(currentTheme);
    if (idx === -1) {
      return 'dark';
    }
    return themeOrder[(idx + 1) % themeOrder.length];
  }

  function setupThemeToggle() {
    var toggle = document.querySelector('.theme-toggle');

    if (!toggle) {
      return;
    }

    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(nextTheme(current));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getSavedTheme() || 'dark');
    setupThemeToggle();
  });
})();

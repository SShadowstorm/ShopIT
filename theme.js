(() => {
  const storageKey = 'ntit_theme';
  const root = document.documentElement;

  function savedTheme() {
    try {
      return localStorage.getItem(storageKey) === 'light' ? 'light' : 'dark';
    } catch {
      return root.dataset.theme || 'dark';
    }
  }

  // Apply the theme in the head, before the styles render.
  root.dataset.theme = savedTheme();

  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header-actions');
    const settings = header && document.createElement('details');
    if (settings) {
      settings.className = 'theme-settings';
      settings.innerHTML = `
        <summary class="settings-btn" aria-label="Inställningar" title="Inställningar">
          <i class="fa-solid fa-gear" aria-hidden="true"></i>
        </summary>
        <div class="theme-panel">
          <h2>Inställningar</h2>
          <fieldset aria-describedby="theme-note">
            <legend>Utseende</legend>
            <div class="theme-options">
              <label>
                <input type="radio" name="shop-theme" value="light">
                <span><i class="fa-regular fa-sun" aria-hidden="true"></i> Ljust</span>
              </label>
              <label>
                <input type="radio" name="shop-theme" value="dark">
                <span><i class="fa-regular fa-moon" aria-hidden="true"></i> Mörkt</span>
              </label>
            </div>
          </fieldset>
          <p id="theme-note">Sparas i den här webbläsaren.</p>
        </div>`;
      header.append(settings);

      settings.addEventListener('change', event => {
        const theme = event.target.value;
        root.dataset.theme = theme;
        try {
          localStorage.setItem(storageKey, theme);
        } catch {
          // The current page can still switch themes when storage is unavailable.
        }
      });

      document.addEventListener('click', event => {
        if (settings.open && !settings.contains(event.target)) settings.open = false;
      });
      settings.addEventListener('focusout', event => {
        if (event.relatedTarget && !settings.contains(event.relatedTarget)) settings.open = false;
      });
      settings.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !settings.open) return;
        event.stopPropagation();
        settings.open = false;
        settings.querySelector('summary').focus();
      });
    }

    function syncTheme() {
      root.dataset.theme = savedTheme();
      const selected = settings?.querySelector(`input[value="${root.dataset.theme}"]`);
      if (selected) selected.checked = true;
    }

    syncTheme();
    window.addEventListener('storage', event => {
      if (event.key === storageKey || event.key === null) syncTheme();
    });
    window.addEventListener('pageshow', event => {
      if (event.persisted) syncTheme();
    });
  });
})();

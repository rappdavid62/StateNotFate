/* Non-clinical support routing. No assessment, scoring, or disclosure logging. */
(function (root) {
  'use strict';
  const STORAGE_KEY = 'snf_support_session_v1';
  const HELP_SCRIPT = 'I am having a difficult time and need support. Can you call me or stay with me while I reach someone who can help?';
  const DIRECTORY = { label: 'Find a helpline in your country', href: 'https://findahelpline.com/', sourceId: 'find-a-helpline' };
  const REGIONS = {
    US: { emergency: { label: 'Immediate danger: call 911', href: 'tel:911' }, links: [
      { label: 'Call 988 — United States', href: 'tel:988', sourceId: '988-lifeline' },
      { label: 'Text 988 — United States', href: 'sms:988', sourceId: '988-lifeline' },
      { label: '988 Lifeline chat', href: 'https://988lifeline.org/chat/', sourceId: '988-lifeline' }
    ] },
    CA: { emergency: { label: 'Immediate danger: call 911', href: 'tel:911' }, links: [
      { label: 'Call 988 — Canada', href: 'tel:988', sourceId: '988-canada' },
      { label: 'Text 988 — Canada', href: 'sms:988', sourceId: '988-canada' },
      { label: 'Canada 9-8-8 information', href: 'https://988.ca/', sourceId: '988-canada' }
    ] },
    OTHER: { emergency: { label: 'Immediate danger: call your local emergency number or go to the nearest emergency department.', href: null }, links: [DIRECTORY] }
  };

  function resourcesFor(region) {
    // Return a copy so callers cannot change the approved resource configuration.
    return JSON.parse(JSON.stringify(Object.hasOwn(REGIONS, region) ? REGIONS[region] : REGIONS.OTHER));
  }

  function isSupportRequest(text) {
    // A small deterministic route trigger, never a clinical assessment or prediction.
    // Crisis Help is always available because this cannot recognize every disclosure.
    return /\b(suicid(?:e|al)|kill myself|end my life|hurt myself|harm myself|want to die|cannot stay safe|can['’]?t stay safe|not safe|feel unsafe|need (?:crisis|urgent) help)\b/i.test(String(text || ''));
  }

  function createRouter(storage) {
    let active = false;
    let generation = 0;
    let persistent = Boolean(storage?.getItem);
    function refresh() {
      if (persistent) {
        try {
          const restored = JSON.parse(storage.getItem(STORAGE_KEY) || 'null')?.event === 'safety-routing-opened';
          if (restored && !active) generation += 1;
          active = restored;
        } catch { persistent = false; }
      }
      return active;
    }
    refresh();
    return {
      isActive: refresh,
      generation: () => generation,
      open() {
        if (!active) generation += 1;
        active = true;
        try { storage?.setItem(STORAGE_KEY, JSON.stringify({ event: 'safety-routing-opened' })); } catch { persistent = false; }
      },
      close() {
        active = false;
        try { storage?.removeItem(STORAGE_KEY); } catch { persistent = false; }
      },
      routeMessage(text) {
        if (refresh() || isSupportRequest(text)) { this.open(); return true; }
        return false;
      }
    };
  }

  const api = { createRouter, isSupportRequest, resourcesFor, HELP_SCRIPT };
  root.SNFSafety = api;
  if (!root.document) return;
  let storage;
  try { storage = root.sessionStorage; } catch { /* Disabled storage. */ }
  const router = createRouter(storage);
  let contactsProvider = () => {
    // Private PIN-protected contacts require the ordinary app unlock flow.
    // Public crisis help itself never depends on a PIN or a successful read.
    const saved = JSON.parse(root.localStorage.getItem('state_not_fate_state') || 'null');
    return saved && !saved.securityPin ? saved.safeContacts : '';
  };
  const dialog = document.createElement('dialog');
  dialog.id = 'crisis-modal';
  dialog.className = 'snf-support-dialog';
  dialog.setAttribute('aria-labelledby', 'snf-support-title');
  dialog.innerHTML = `
    <h2 id="snf-support-title">Support is available now</h2>
    <p>Ordinary coaching, quests, and proof rewards are paused while this is open. No assessment is required.</p>
    <label for="snf-support-region">Your region</label>
    <select id="snf-support-region"><option value="OTHER">Choose region / Other country</option><option value="US">United States</option><option value="CA">Canada</option></select>
    <div id="snf-support-resources"></div>
    <h3>Saved trusted contacts</h3><p id="snf-support-contacts"></p>
    <h3>A message you can use</h3><p id="snf-support-script"></p>
    <button type="button" id="snf-copy-support-script">Copy help request</button>
    <p id="snf-copy-support-status" role="status"></p>
    <p><a href="/crisis">Public crisis resources</a> · No PIN, account, or intake required.</p>
    <button type="button" id="btn-crisis-dismiss">Return to my plan</button>`;
  document.body.appendChild(dialog);
  dialog.querySelector('#snf-support-script').textContent = HELP_SCRIPT;

  function renderResources() {
    const resources = resourcesFor(dialog.querySelector('select').value);
    const container = dialog.querySelector('#snf-support-resources');
    container.replaceChildren();
    for (const resource of [resources.emergency, ...resources.links]) {
      const p = document.createElement('p');
      const element = document.createElement(resource.href ? 'a' : 'span');
      element.textContent = resource.label;
      if (resource.href) element.href = resource.href;
      if (resource.sourceId) element.dataset.sourceId = resource.sourceId;
      p.appendChild(element);
      container.appendChild(p);
    }
  }
  function show() {
    renderResources();
    let contacts = '';
    try { contacts = contactsProvider(); } catch { /* Public resources remain available. */ }
    dialog.querySelector('#snf-support-contacts').textContent = typeof contacts === 'string' && contacts.trim()
      ? contacts : 'No unlocked contacts available. You can use the public resources above.';
    dialog.classList.add('active');
    if (!dialog.open) dialog.showModal();
  }
  api.isActive = router.isActive;
  api.generation = router.generation;
  api.setContactsProvider = provider => { contactsProvider = provider; if (router.isActive()) show(); };
  api.open = () => {
    router.open();
    show();
    root.dispatchEvent(new Event('snf:support-opened'));
  };
  api.close = () => {
    router.close();
    dialog.close();
    dialog.classList.remove('active');
    root.dispatchEvent(new Event('snf:support-closed'));
  };
  api.routeMessage = text => {
    if (router.routeMessage(text)) { api.open(); return true; }
    return false;
  };
  dialog.querySelector('select').addEventListener('change', renderResources);
  dialog.querySelector('#btn-crisis-dismiss').addEventListener('click', api.close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); api.close(); });
  dialog.querySelector('#snf-copy-support-script').addEventListener('click', async () => {
    const status = dialog.querySelector('#snf-copy-support-status');
    try { await navigator.clipboard.writeText(HELP_SCRIPT); status.textContent = 'Help request copied.'; }
    catch { status.textContent = 'Select and copy the message above.'; }
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-open-support]')) { event.preventDefault(); api.open(); }
  });
  // A tab is the session boundary. Reload and same-tab navigation retain the mode;
  // closing it is a user choice, never inferred from a link launch or neutral text.
  const publicCrisisPage = /^\/(crisis(?:\.html)?|help)\/?$/.test(root.location.pathname);
  if (publicCrisisPage) router.open();
  else if (router.isActive()) show();
  document.querySelector('[data-return-to-plan]')?.addEventListener('click', () => api.close());
  root.addEventListener('pageshow', () => {
    // Back/Forward can restore an older JS heap. The tab marker is authoritative.
    if (publicCrisisPage) router.open();
    else if (router.isActive()) show();
    else if (dialog.open) api.close();
  });
})(globalThis);

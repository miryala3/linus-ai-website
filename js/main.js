/**
 * LINUS-AI Marketing Website — main.js
 * Production-quality vanilla JavaScript
 */

'use strict';

/* ── Utility helpers ─────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function debounce(fn, ms = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/* ── Mobile Navigation ───────────────────────────────────── */
function initMobileNav() {
  const hamburger = $('.hamburger');
  const mobileMenu = $('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on nav link click
  $$('a', mobileMenu).forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── FAQ Accordion ───────────────────────────────────────── */
function initFAQ() {
  $$('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;

    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      $$('.faq-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      item.classList.toggle('open', !isOpen);
    });
  });
}

/* ── Generic Accordion ───────────────────────────────────── */
function initAccordions() {
  $$('.accordion-item').forEach(item => {
    const q = item.querySelector('.accordion-q');
    if (!q) return;

    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      $$('.accordion-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });
}

/* ── Tabs ────────────────────────────────────────────────── */
function initTabs() {
  $$('.tabs').forEach(tabGroup => {
    const buttons = $$('.tab-btn', tabGroup);
    const panelsId = tabGroup.dataset.tabGroup;

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Find the associated panels container
        const container = document.querySelector(btn.dataset.target || `#panels-${panelsId}`);
        const allPanels = container
          ? $$('.tab-panel', container)
          : $$('.tab-panel');

        allPanels.forEach(p => p.classList.remove('active'));
        const target = btn.dataset.panel
          ? document.getElementById(btn.dataset.panel)
          : allPanels[i];
        if (target) target.classList.add('active');
      });
    });
  });
}

/* ── Smooth Scroll ───────────────────────────────────────── */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = 64;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ── Active Nav Link on Scroll ───────────────────────────── */
function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a, .mobile-menu a');
  if (!sections.length || !navLinks.length) return;

  const onScroll = debounce(() => {
    const scrollY = window.scrollY + 80;

    let current = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollY) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, 50);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Plan Switcher (Annual / Perpetual) ──────────────────── */
const PRICES = {
  annual: {
    community:    { price: '0',   period: 'free forever',  annual: '' },
    professional: { price: '99',  period: 'per year',       annual: 'Save $150 vs perpetual' },
    team:         { price: '299', period: 'per year',       annual: 'Save $500 vs perpetual' },
  },
  perpetual: {
    community:    { price: '0',   period: 'one-time',       annual: '' },
    professional: { price: '249', period: 'one-time license', annual: '' },
    team:         { price: '799', period: 'one-time license', annual: '' },
  },
};

function initPlanSwitcher() {
  const switcher = $('.plan-switcher');
  if (!switcher) return;

  const buttons = $$('button', switcher);
  let activeBilling = 'annual';

  function updatePrices(billing) {
    activeBilling = billing;
    const data = PRICES[billing];

    Object.entries(data).forEach(([plan, info]) => {
      const card = document.querySelector(`[data-plan="${plan}"]`);
      if (!card) return;

      const priceEl  = card.querySelector('.plan-price');
      const periodEl = card.querySelector('.plan-period');
      const annualEl = card.querySelector('.plan-annual');

      if (priceEl) {
        priceEl.innerHTML = info.price === '0'
          ? 'Free'
          : `<sup>$</sup>${info.price}`;
      }
      if (periodEl) periodEl.textContent = info.period;
      if (annualEl) {
        annualEl.textContent = info.annual;
        annualEl.style.display = info.annual ? '' : 'none';
      }
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updatePrices(btn.dataset.billing || btn.textContent.toLowerCase().trim());
    });
  });

  // Initialize
  updatePrices(activeBilling);
}

/* ── GitHub Releases Fetch ───────────────────────────────── */
async function fetchLatestRelease() {
  const REPO = 'LINUS-AI-PRO/linus-ai';
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const release = await res.json();
    const version = release.tag_name?.replace(/^v/, '') || '1.4.0';

    // Update version display elements
    $$('[data-gh-version]').forEach(el => {
      el.textContent = `v${version}`;
    });

    // Map assets to download links
    const assetMap = {};
    (release.assets || []).forEach(asset => {
      assetMap[asset.name] = {
        url:  asset.browser_download_url,
        size: formatBytes(asset.size),
      };
    });

    // Update download cards
    $$('[data-dl-asset]').forEach(card => {
      const assetName = card.dataset.dlAsset;
      const asset = assetMap[assetName];
      if (!asset) return;

      const btn = card.querySelector('.dl-btn, a.btn');
      if (btn) btn.href = asset.url;

      const sizeEl = card.querySelector('.dl-size');
      if (sizeEl && asset.size) sizeEl.textContent = asset.size;
    });

  } catch (err) {
    console.warn('GitHub release fetch failed (graceful degradation):', err.message);
    // Fallback: links remain pointing to /releases/latest
  }
}

function formatBytes(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
}

/* ── License Key Formatter ───────────────────────────────── */
function initLicenseFormatter() {
  $$('input[data-license-input], #license_key, input.license-input').forEach(input => {
    input.addEventListener('keyup', (e) => {
      // Allow navigation keys without formatting
      const navigationKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
      if (navigationKeys.includes(e.key)) return;

      let val = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

      // Strip leading LNAI prefix if user typed it
      if (val.startsWith('LNAI')) val = val.slice(4);

      // Chunk into groups of 4
      const chunks = val.match(/.{1,4}/g) || [];
      const formatted = chunks.slice(0, 4).join('-');

      input.value = formatted ? `LNAI-${formatted}` : '';
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text');
      let val = pasted.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (val.startsWith('LNAI')) val = val.slice(4);
      const chunks = val.match(/.{1,4}/g) || [];
      const formatted = chunks.slice(0, 4).join('-');
      input.value = formatted ? `LNAI-${formatted}` : '';
    });
  });
}

/* ── Machine ID Fingerprint ──────────────────────────────── */
function computeMachineId() {
  const raw = [
    navigator.userAgent,
    screen.width,
    screen.height,
    screen.colorDepth,
    navigator.language,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency || 0,
  ].join('|');

  // Simple djb2 hash → hex string
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) ^ raw.charCodeAt(i);
    hash = hash >>> 0; // Keep unsigned 32-bit
  }
  return `WEB-${hash.toString(16).toUpperCase().padStart(8, '0')}`;
}

function initMachineId() {
  $$('[data-machine-id], #machine_id').forEach(el => {
    el.value = computeMachineId();
  });
}

/* ── Activation Form ─────────────────────────────────────── */
function initActivationForm() {
  const form = $('#activation-form');
  if (!form) return;

  const alertEl      = form.querySelector('.form-alert') || document.createElement('div');
  const submitBtn    = form.querySelector('[type="submit"]');
  const successState = $('#activation-success');

  async function showAlert(type, msg) {
    alertEl.className = `alert alert-${type} mt-16`;
    alertEl.textContent = msg;
    if (!alertEl.parentNode) form.prepend(alertEl);
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading
      ? '<span class="spinner"></span> Activating…'
      : 'Activate License';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const licenseKey = (form.querySelector('#license_key')?.value || '').trim();
    const email      = (form.querySelector('#email')?.value || '').trim();
    const machineId  = computeMachineId();

    if (!licenseKey || !email) {
      showAlert('error', 'Please enter your license key and email address.');
      return;
    }

    const keyPattern = /^LNAI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!keyPattern.test(licenseKey)) {
      showAlert('error', 'Invalid license key format. Expected: LNAI-XXXX-XXXX-XXXX-XXXX');
      return;
    }

    setLoading(true);
    alertEl.className = 'alert';
    alertEl.textContent = '';

    try {
      const res = await fetch('/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: licenseKey, email, machine_id: machineId }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        // Show success state
        const lic = data.license || {};
        if (successState) {
          form.style.display = 'none';
          successState.style.display = '';

          const fill = (sel, val) => {
            const el = successState.querySelector(sel);
            if (el) el.textContent = val || '—';
          };

          fill('[data-plan]',     lic.plan);
          fill('[data-licensee]', lic.licensee || email);
          fill('[data-seats]',    lic.seats);
          fill('[data-expires]',  lic.expires_at || 'Never');
          fill('[data-key]',      licenseKey);
        } else {
          showAlert('success', 'License activated successfully! Your installation is now licensed.');
        }
      } else {
        const msg = data.detail || data.error || data.message || 'Activation failed. Please check your license key and try again.';
        showAlert('error', msg);
      }
    } catch (err) {
      showAlert('error', 'Unable to reach the activation server. Please check your internet connection and try again.');
      console.error('Activation error:', err);
    } finally {
      setLoading(false);
    }
  });
}

/* ── Copy to Clipboard (Terminal blocks) ─────────────────── */
function initCopyButtons() {
  $$('.terminal').forEach(terminal => {
    // Skip if already has a copy button
    if (terminal.querySelector('.terminal-copy')) return;

    const btn = document.createElement('button');
    btn.className = 'terminal-copy';
    btn.textContent = 'Copy';

    btn.addEventListener('click', async () => {
      const text = terminal.innerText
        .replace(/^Copy\n?/, '')   // strip our button text
        .replace(/\$ /g, '')        // strip prompts
        .split('\n')
        .filter(line => !line.startsWith('#') && line.trim())
        .join('\n')
        .trim();

      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        (/** @type {any} */ (document)).execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }
    });

    terminal.style.position = 'relative';
    terminal.appendChild(btn);
  });
}

/* ── Scroll Reveal ───────────────────────────────────────── */
function initScrollReveal() {
  const elements = $$('.reveal, .feature-card, .plan-card, .dl-card, .doc-card');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger children in grids
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    observer.observe(el);
  });
}

/* ── OS Detection ────────────────────────────────────────── */
function detectOS() {
  const ua  = navigator.userAgent.toLowerCase();
  const platform = (navigator.userAgentData?.platform || (/** @type {any} */ (navigator)).platform || '').toLowerCase();

  if (/mac/.test(platform) || /mac/.test(ua)) {
    // ARM vs x86
    return /arm|apple m/.test(ua) ? 'macos-arm64' : 'macos-x86';
  }
  if (/win/.test(platform) || /win/.test(ua)) return 'windows-x86';
  if (/linux/.test(platform) || /linux/.test(ua)) {
    return /arm/.test(ua) ? 'linux-arm64' : 'linux-x86';
  }
  return null;
}

function initOSDetection() {
  const os = detectOS();
  if (!os) return;

  $$('[data-os]').forEach(card => {
    if (card.dataset.os === os) {
      card.classList.add('highlighted');

      // Add "Recommended for your system" badge
      const badge = document.createElement('div');
      badge.className = 'tag tag-green mt-8';
      badge.style.marginTop = '10px';
      badge.textContent = 'Your Platform';
      card.appendChild(badge);

      // Scroll into view softly if on download page
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 600);
    }
  });
}

/* ── Stripe Checkout ─────────────────────────────────────── */
function initStripeButtons() {
  $$('[data-stripe-plan]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();

      const plan    = btn.dataset.stripePlan;
      const billing = btn.dataset.stripeBilling || 'annual';

      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Redirecting…';
      btn.disabled = true;

      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, billing }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL returned');
        }
      } catch (err) {
        console.error('Stripe checkout error:', err);
        btn.innerHTML = originalHTML;
        btn.disabled = false;

        // Show inline error
        const errEl = document.createElement('div');
        errEl.className = 'alert alert-error mt-8';
        errEl.textContent = 'Checkout unavailable. Please contact sales@linus-ai.com.';
        btn.parentNode.insertBefore(errEl, btn.nextSibling);
        setTimeout(() => errEl.remove(), 5000);
      }
    });
  });
}

/* ── Nav Scroll Shadow ───────────────────────────────────── */
function initNavShadow() {
  const nav = $('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(0,0,0,0.3)'
      : '';
  }, { passive: true });
}

/* ── SHA256 Checksum Display ─────────────────────────────── */
function initChecksumToggle() {
  $$('[data-checksum-toggle]').forEach(btn => {
    const target = document.getElementById(btn.dataset.checksumToggle);
    if (!target) return;

    btn.addEventListener('click', () => {
      const hidden = target.style.display === 'none' || !target.style.display;
      target.style.display = hidden ? 'block' : 'none';
      btn.textContent = hidden ? 'Hide SHA256' : 'Show SHA256';
    });
  });
}

/* ── Docs Search (UI only) ───────────────────────────────── */
function initDocsSearch() {
  const searchInput = $('#docs-search');
  if (!searchInput) return;

  const cards = $$('.doc-card, .quick-link');

  searchInput.addEventListener('input', debounce(() => {
    const q = searchInput.value.toLowerCase().trim();

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  }, 150));
}

/* ── Page-specific init ──────────────────────────────────── */
function initPage() {
  const page = document.body.dataset.page;

  switch (page) {
    case 'download':
      fetchLatestRelease();
      initOSDetection();
      initChecksumToggle();
      break;

    case 'activate':
      initLicenseFormatter();
      initMachineId();
      initActivationForm();
      break;

    case 'docs':
      initDocsSearch();
      break;

    case 'home':
    case 'index':
    default:
      fetchLatestRelease();
      break;
  }
}

/* ── DOMContentLoaded ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFAQ();
  initAccordions();
  initTabs();
  initSmoothScroll();
  initActiveNav();
  initPlanSwitcher();
  initCopyButtons();
  initScrollReveal();
  initStripeButtons();
  initNavShadow();
  initPage();
});

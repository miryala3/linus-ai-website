(function () {
  'use strict';

  var DRAWER_HTML = [
    '<div id="mm-overlay"></div>',
    '<aside id="mm-drawer" role="dialog" aria-modal="true" aria-label="Site navigation">',
    '  <div class="mm-header">',
    '    <a href="/" class="mm-logo">LINUS&#8209;AI&#8482;</a>',
    '    <button class="mm-close" id="mm-close" aria-label="Close menu">&#x2715;</button>',
    '  </div>',

    '  <div class="mm-section-label">Products</div>',

    '  <a href="/" class="mm-product">',
    '    <div class="mm-product-icon" style="background:rgba(56,189,248,.12);color:#38bdf8">&#9672;</div>',
    '    <div><div class="mm-product-name">LINUS-AI</div><div class="mm-product-desc">Private AI inference on your hardware</div></div>',
    '  </a>',

    '  <a href="/products/bizcore.html" class="mm-product">',
    '    <div class="mm-product-icon" style="background:rgba(56,189,248,.12);color:#38bdf8">&#x2B21;</div>',
    '    <div><div class="mm-product-name">BizCore</div><div class="mm-product-desc">Local-first business OS &mdash; CRM, HR, finance</div></div>',
    '  </a>',

    '  <a href="/products/day.html" class="mm-product">',
    '    <div class="mm-product-icon" style="background:rgba(251,191,36,.12);color:#f59e0b">&#x2600;</div>',
    '    <div><div class="mm-product-name">LINUS-Day</div><div class="mm-product-desc">AI daily planner that learns your work style</div></div>',
    '  </a>',

    '  <a href="/products/med.html" class="mm-product">',
    '    <div class="mm-product-icon" style="background:rgba(52,211,153,.12);color:#34d399">&#x2695;</div>',
    '    <div><div class="mm-product-name">aiMED</div><div class="mm-product-desc">HIPAA-ready clinical AI for healthcare</div></div>',
    '  </a>',

    '  <hr class="mm-divider">',
    '  <div class="mm-section-label">Navigation</div>',

    '  <a href="/pricing.html" class="mm-link">Pricing</a>',
    '  <a href="/download.html" class="mm-link">Download</a>',
    '  <a href="/store/" class="mm-link">Store</a>',
    '  <a href="/docs/index.html" class="mm-link">Documentation</a>',
    '  <a href="/support.html" class="mm-link">Support</a>',
    '  <a href="/activate.html" class="mm-link">Activate License</a>',
    '  <a href="/enterprise.html" class="mm-link">Enterprise</a>',
    '</aside>'
  ].join('\n');

  function open() {
    document.getElementById('mm-drawer').classList.add('open');
    document.getElementById('mm-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    document.getElementById('mm-drawer').classList.remove('open');
    document.getElementById('mm-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    // Inject drawer + overlay
    document.body.insertAdjacentHTML('beforeend', DRAWER_HTML);

    // Inject hamburger button into the nav
    var nav = document.querySelector('.nav-inner') ||
              document.querySelector('nav .container') ||
              document.querySelector('nav');
    if (nav) {
      var btn = document.createElement('button');
      btn.id = 'mm-btn';
      btn.setAttribute('aria-label', 'Open navigation menu');
      btn.innerHTML = '<span></span><span></span><span></span>';
      nav.insertBefore(btn, nav.firstChild);
      btn.addEventListener('click', open);
    }

    document.getElementById('mm-close').addEventListener('click', close);
    document.getElementById('mm-overlay').addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

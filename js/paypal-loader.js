/**
 * paypal-loader.js — LINUS-AI
 * Fetches PayPal client-id from the license server (/api/config),
 * then dynamically injects the PayPal SDK. Never hardcodes credentials.
 *
 * Usage: <script src="/js/paypal-loader.js" data-query="currency=USD"></script>
 * After SDK loads, window.__paypal_ready() is called if defined.
 */
(function () {
  var me = document.currentScript;
  var query = (me && me.getAttribute('data-query')) || 'currency=USD';

  fetch('/api/config')
    .then(function (r) { return r.json(); })
    .then(function (cfg) {
      if (!cfg.paypal_client_id) throw new Error('paypal_client_id missing from /api/config');
      var s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js?client-id=' + cfg.paypal_client_id + '&' + query;
      s.onload = function () {
        if (typeof window.__paypal_ready === 'function') window.__paypal_ready();
      };
      s.onerror = function () {
        console.error('[LINUS-AI] PayPal SDK failed to load.');
        document.querySelectorAll('.pp-loading').forEach(function (el) {
          el.textContent = 'Checkout unavailable — email support@linus-ai.com';
        });
      };
      document.head.appendChild(s);
    })
    .catch(function (e) {
      console.error('[LINUS-AI] PayPal config unavailable:', e);
    });
})();

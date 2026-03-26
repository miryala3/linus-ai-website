/**
 * pp-checkout.js — inline PayPal redirect checkout
 * Usage: ppPay('plan_key', 'email-input-id', buttonElement)
 */
async function ppPay(planKey, emailId, btnEl) {
  var inp = document.getElementById(emailId);
  var email = inp.value.trim();
  if (!email || email.indexOf('@') < 1 || email.indexOf('.') < 0) {
    inp.classList.add('error');
    inp.focus();
    setTimeout(function () { inp.classList.remove('error'); }, 2500);
    return;
  }
  var orig = btnEl.textContent;
  btnEl.textContent = 'Redirecting…';
  btnEl.disabled = true;
  try {
    var r = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey, email: email })
    });
    var d = await r.json();
    if (d.url) { window.location.href = d.url; }
    else { throw d.detail || 'Checkout failed'; }
  } catch (e) {
    btnEl.textContent = orig;
    btnEl.disabled = false;
    alert(typeof e === 'string' ? e : 'Checkout unavailable — email support@linus-ai.com');
  }
}

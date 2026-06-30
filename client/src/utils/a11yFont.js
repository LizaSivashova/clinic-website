// Browser-agnostic text scaling.
//
// The site sizes text with inline `px` and `clamp(min, Xvw, max)` values.
// CSS `zoom` is unreliable for this: WebKit (Safari / all iOS browsers)
// computes `vw` against the visual viewport, which `zoom` doesn't shrink, so
// vw-based text doesn't grow — "many places don't update".
//
// Instead we read each element's *resolved* font size (getComputedStyle already
// flattens px/clamp/vw to a px value) and rewrite it as `factor * base` px with
// `!important`. This behaves identically on every engine. A MutationObserver
// re-applies the scale after React re-renders that would otherwise reset inline
// styles (navbar on scroll, the contact form while typing, drawer open/close…).

const SKIP_SELECTOR = '[data-a11y-skip]';

let currentFactor = 1;
let observer = null;

function excluded(el) {
  return el.nodeType !== 1 || (el.closest && el.closest(SKIP_SELECTOR));
}

function elements() {
  return [document.documentElement, ...document.querySelectorAll('body *')];
}

// Cache every element's unscaled base size BEFORE touching any styles, so a
// child that inherits from an already-scaled parent never caches a scaled base.
function cacheBases(els) {
  for (const el of els) {
    if (excluded(el)) continue;
    if (el.dataset.a11yBase == null) {
      el.dataset.a11yInline = el.style.fontSize || '';
      el.dataset.a11yBase = String(parseFloat(getComputedStyle(el).fontSize) || 0);
    }
  }
}

function applyOne(el) {
  if (excluded(el)) return;
  if (currentFactor === 1) {
    if (el.dataset.a11yBase != null) {
      el.style.fontSize = el.dataset.a11yInline || '';
      if (!el.style.fontSize) el.style.removeProperty('font-size');
      delete el.dataset.a11yBase;
      delete el.dataset.a11yInline;
    }
    return;
  }
  if (el.dataset.a11yBase == null) {
    el.dataset.a11yInline = el.style.fontSize || '';
    el.dataset.a11yBase = String(parseFloat(getComputedStyle(el).fontSize) || 0);
  }
  const base = parseFloat(el.dataset.a11yBase);
  if (base > 0) el.style.setProperty('font-size', `${(base * currentFactor).toFixed(2)}px`, 'important');
}

function applyAll() {
  const els = elements();
  if (currentFactor !== 1) cacheBases(els);
  for (const el of els) applyOne(el);
}

function ensureObserver() {
  if (observer) return;
  observer = new MutationObserver(records => {
    if (currentFactor === 1) return;
    observer.disconnect(); // avoid reacting to our own style writes
    for (const r of records) {
      if (r.type === 'attributes' && r.target.nodeType === 1) applyOne(r.target);
      if (r.type === 'childList') {
        for (const node of r.addedNodes) {
          if (node.nodeType !== 1 || excluded(node)) continue;
          cacheBases([node, ...node.querySelectorAll('*')]);
          applyOne(node);
          node.querySelectorAll('*').forEach(applyOne);
        }
      }
    }
    reconnect();
  });
  reconnect();
}

function reconnect() {
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['style'],
  });
}

export function applyFontScale(factor) {
  currentFactor = factor;
  // Marker class so layout rules (e.g. hero one-liners) can relax when text is
  // enlarged, letting it reflow instead of overflowing the viewport.
  document.documentElement.classList.toggle('a11y-scaled', factor !== 1);
  applyAll();
  if (factor === 1) {
    observer?.disconnect();
    observer = null;
  } else {
    ensureObserver();
  }
}

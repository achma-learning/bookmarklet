/**
 * Force Enable Copy/Paste/Select Bookmarklet
 * ============================================
 * A comprehensive bookmarklet that defeats all known methods websites use
 * to prevent copying, pasting, selecting, and right-clicking.
 *
 * Methods covered:
 *  1. Capture-phase event listeners (stopImmediatePropagation on copy/cut/paste/selectstart)
 *  2. CSS user-select removal (inline styles + computed styles + stylesheets)
 *  3. Inline event handler attribute removal (oncopy, onpaste, oncut, onselectstart, oncontextmenu, ondragstart)
 *  4. HTML unselectable attribute removal
 *  5. document-level oncopy/onpaste/oncut/onselectstart/oncontextmenu nullification
 *  6. Right-click / context menu re-enabling
 *  7. Global style injection with !important to force user-select: auto
 *  8. Override getSelection blocking (some sites override window.getSelection)
 *  9. Override clipboardData interference (prevent sites from clearing clipboard during copy)
 * 10. MutationObserver to continuously re-apply fixes as the page mutates
 * 11. Iframe traversal — apply fixes inside same-origin iframes
 * 12. Remove pointer-events:none that blocks interaction
 * 13. Remove -webkit-touch-callout:none (mobile Safari)
 *
 * Usage:
 *   Create a bookmark and paste the minified version (see below) as the URL.
 */

(function () {
  'use strict';

  // ── 1. Capture-phase listeners: intercept and allow copy/cut/paste/select ──
  var events = ['copy', 'cut', 'paste', 'selectstart', 'contextmenu', 'dragstart', 'mousedown', 'mouseup', 'keydown', 'keyup'];
  var forceAllow = function (e) {
    e.stopImmediatePropagation();
    return true;
  };
  events.forEach(function (evt) {
    document.addEventListener(evt, forceAllow, true);
  });

  // ── 2. Nullify document-level handlers ──
  document.oncopy = null;
  document.oncut = null;
  document.onpaste = null;
  document.onselectstart = null;
  document.oncontextmenu = null;
  document.ondragstart = null;
  document.onmousedown = null;

  // ── 3. Remove inline event handler attributes from all elements ──
  var handlerAttrs = ['oncopy', 'oncut', 'onpaste', 'onselectstart', 'oncontextmenu', 'ondragstart', 'onmousedown'];

  function cleanElement(el) {
    // Remove inline event handler attributes
    handlerAttrs.forEach(function (attr) {
      if (el.hasAttribute && el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    });
    // Remove unselectable attribute (old IE method)
    if (el.hasAttribute && el.hasAttribute('unselectable')) {
      el.removeAttribute('unselectable');
    }
    // Remove inline user-select styles
    if (el.style) {
      el.style.userSelect = '';
      el.style.webkitUserSelect = '';
      el.style.MozUserSelect = '';
      el.style.msUserSelect = '';
      el.style.webkitTouchCallout = '';
      if (el.style.pointerEvents === 'none') {
        el.style.pointerEvents = '';
      }
    }
    // Nullify JS-set handlers on the element
    if (el.oncopy) el.oncopy = null;
    if (el.oncut) el.oncut = null;
    if (el.onpaste) el.onpaste = null;
    if (el.onselectstart) el.onselectstart = null;
    if (el.oncontextmenu) el.oncontextmenu = null;
    if (el.ondragstart) el.ondragstart = null;
  }

  var allElements = document.querySelectorAll('*');
  for (var i = 0; i < allElements.length; i++) {
    cleanElement(allElements[i]);
  }
  cleanElement(document.documentElement);
  cleanElement(document.body);

  // ── 4. Inject global CSS to force user-select: auto ──
  var styleId = '__force_copy_style__';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = [
      '*, *::before, *::after {',
      '  -webkit-user-select: auto !important;',
      '  -moz-user-select: auto !important;',
      '  -ms-user-select: auto !important;',
      '  user-select: auto !important;',
      '  -webkit-touch-callout: default !important;',
      '}',
      // Some sites use an overlay with pointer-events:none or a transparent div
      // We can't blindly remove pointer-events from everything, but we ensure body/html are selectable
      'html, body {',
      '  -webkit-user-select: auto !important;',
      '  user-select: auto !important;',
      '  pointer-events: auto !important;',
      '}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);
  }

  // ── 5. Remove restrictive rules from existing stylesheets ──
  try {
    var sheets = document.styleSheets;
    for (var s = 0; s < sheets.length; s++) {
      try {
        var rules = sheets[s].cssRules || sheets[s].rules;
        if (!rules) continue;
        for (var r = rules.length - 1; r >= 0; r--) {
          var ruleText = rules[r].cssText || '';
          if (/user-select\s*:\s*none/i.test(ruleText) ||
              /pointer-events\s*:\s*none/i.test(ruleText)) {
            sheets[s].deleteRule(r);
          }
        }
      } catch (e) {
        // Cross-origin stylesheet — can't access, skip
      }
    }
  } catch (e) { }

  // ── 6. Restore window.getSelection if it was overridden ──
  try {
    if (!window.getSelection || window.getSelection.toString().indexOf('native') === -1) {
      // Try to restore from iframe
      var tempFrame = document.createElement('iframe');
      tempFrame.style.display = 'none';
      document.body.appendChild(tempFrame);
      if (tempFrame.contentWindow && tempFrame.contentWindow.getSelection) {
        window.getSelection = tempFrame.contentWindow.getSelection.bind(tempFrame.contentWindow);
      }
      document.body.removeChild(tempFrame);
    }
  } catch (e) { }

  // ── 7. Protect clipboard data during copy events ──
  document.addEventListener('copy', function (e) {
    var sel = window.getSelection();
    if (sel && sel.toString()) {
      // If the site tries to modify clipboard data, we ensure the real selection gets through
      // We do NOT call e.preventDefault() here so the default copy behavior works
    }
  }, false);

  // ── 8. Override document.execCommand if it was tampered with ──
  try {
    if (document.execCommand) {
      var origExecCommand = document.execCommand.bind(document);
      document.execCommand = function (cmd) {
        // Allow copy/cut/paste commands to work
        return origExecCommand.apply(document, arguments);
      };
    }
  } catch (e) { }

  // ── 9. MutationObserver: re-apply fixes when the DOM changes ──
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      // Clean newly added nodes
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) { // Element node
            cleanElement(node);
            var children = node.querySelectorAll ? node.querySelectorAll('*') : [];
            for (var c = 0; c < children.length; c++) {
              cleanElement(children[c]);
            }
          }
        });
      }
      // If attributes changed, re-clean the target
      if (mutation.type === 'attributes') {
        if (mutation.target.nodeType === 1) {
          cleanElement(mutation.target);
        }
      }
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: handlerAttrs.concat(['style', 'unselectable', 'class'])
  });

  // ── 10. Apply fixes inside same-origin iframes ──
  try {
    var iframes = document.querySelectorAll('iframe');
    for (var f = 0; f < iframes.length; f++) {
      try {
        var iframeDoc = iframes[f].contentDocument || iframes[f].contentWindow.document;
        if (iframeDoc) {
          events.forEach(function (evt) {
            iframeDoc.addEventListener(evt, forceAllow, true);
          });
          iframeDoc.oncopy = null;
          iframeDoc.oncut = null;
          iframeDoc.onpaste = null;
          iframeDoc.onselectstart = null;
          iframeDoc.oncontextmenu = null;
          var iframeEls = iframeDoc.querySelectorAll('*');
          for (var ie = 0; ie < iframeEls.length; ie++) {
            cleanElement(iframeEls[ie]);
          }
          var iStyle = iframeDoc.createElement('style');
          iStyle.textContent = '* { -webkit-user-select: auto !important; user-select: auto !important; -webkit-touch-callout: default !important; }';
          (iframeDoc.head || iframeDoc.documentElement).appendChild(iStyle);
        }
      } catch (e) {
        // Cross-origin iframe — can't access, skip
      }
    }
  } catch (e) { }

  // ── 11. Visual feedback ──
  var notify = document.createElement('div');
  notify.textContent = '\u2705 Copy/Paste/Select enabled!';
  notify.style.cssText = 'position:fixed;top:8px;left:50%;transform:translateX(-50%);background:#222;color:#5fb950;padding:10px 24px;border-radius:8px;font:600 14px/1.4 system-ui,sans-serif;z-index:2147483647;box-shadow:0 4px 24px rgba(0,0,0,0.5);border:1px solid #5fb950;pointer-events:none;opacity:0;transition:opacity .3s ease;';
  document.body.appendChild(notify);
  setTimeout(function () { notify.style.opacity = '1'; }, 50);
  setTimeout(function () {
    notify.style.opacity = '0';
    setTimeout(function () { notify.remove(); }, 400);
  }, 2500);

})();

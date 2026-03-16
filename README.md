# how about a bookmarklet that let you copy prompt into clipboard, (either have a website that have all prompt or use one prompt per bookmarklet)

# Personal Bookmarklets Collection

A curated collection of **bookmarklets** that I find useful.  

This repository demonstrates how to **organize and use bookmarklets** efficiently. Users can:

- Drag and drop bookmarklets into the browser bookmarks bar.  
- Add a new bookmark manually and paste JavaScript code.  
- Group multiple bookmarklets inside a folder for easy access.  

---

## 1. What is a Bookmarklet?

A **bookmarklet** is a small JavaScript program stored as a browser bookmark. When clicked, it executes on the current webpage, performing useful actions **without installing extensions or software**.

---

## 2. Why Use Bookmarklets

- Automate repetitive tasks on websites.  
- Enhance browsing experience quickly.  
- Extract or manipulate content from pages.  
- Experiment with page styling or developer tools easily.  

---

## 3. Types of Bookmarklets

1. **Page Styling** – Change fonts, background colors, hide ads.  
2. **Content Extraction** – Extract links, text, or images.  
3. **Navigation & Search** – Quickly search highlighted text or navigate websites.  
4. **Developer Helper** – Inspect code, debug layout, check colors.  
5. **Fun or Utility** – Mini games, timers, calculators, or animations.  

---

## 4. How to Add a Bookmarklet to Your Browser

### Option 1: Drag & Drop

1. Select a bookmarklet link below.  
2. Drag it directly into your browser bookmarks bar.  

Example:

- [Change Background to Yellow](javascript:(function(){document.body.style.backgroundColor='yellow';})())  
- [Highlight All Links](javascript:(function(){var a=document.getElementsByTagName('a');for(var i=0;i<a.length;i++){a[i].style.backgroundColor='yellow';}})())  

---

### Option 2: Create a New Bookmark Manually

1. Open your **Bookmarks Manager** (Ctrl+Shift+B or Cmd+Shift+B).  
2. Click **Add New Bookmark** (or **Add Page**).  
3. Give it a **name**, e.g., `bk-TipsOverlay`.  
4. Copy the bookmarklet JavaScript code into the **URL/Location** field.  
5. Save the bookmark.  
6. Click the bookmark anytime to run the bookmarklet on the current page.  

---

### Option 3: Organize in a Folder

1. Create a folder in your bookmarks bar (e.g., `Bookmarklets` or `JS Tools`).  
2. Drag multiple bookmarklets into that folder.  
3. Access them from the folder for clean organization.  

---

## 5. Example Bookmarklet: Browser & Bookmarklet Tips

This bookmarklet creates a floating overlay with **tips for using and organizing bookmarklets**.

**Instructions:** copy it manually into a new bookmark, create a new page, and in page url paste this.

```javascript
javascript:(function(){const d=document.createElement('div');d.style.cssText='position:fixed;top:2vh;right:2vw;max-width:max(420px,min(98vw,980px));max-height:85vh;overflow-y:auto;padding:clamp(14px,2vw,22px) clamp(20px,3vw,32px);background:rgba(8,8,18,0.97);color:#f5f5fc;box-shadow:0 16px 64px rgba(0,0,0,0.75);border-radius:18px;font:400 clamp(13px,0.95vw,14.5px)/1.5 system-ui,-apple-system,BlinkMacSystemFont,sans-serif;z-index:99999999;pointer-events:auto;user-select:text;border:1px solid #35355c;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);opacity:0;transform:translateY(-20px);transition:all .5s ease-out';d.innerHTML=`<div style="position:relative;"><button id="closeBtn" style="position:absolute;top:0;right:0;background:none;border:none;color:#aaa;font-size:20px;cursor:pointer;padding:8px 12px;line-height:1;">✕</button><div style="font-weight:700;font-size:clamp(16px,1.3vw,18px);margin-bottom:12px;color:#60a8ff;letter-spacing:-0.3px;padding-right:36px;">🚀 Browser & Bookmarklet Tips (2026)</div></div><label style="display:flex;align-items:center;gap:10px;font-size:clamp(12.5px,0.9vw,13.5px);color:#e0e0f5;cursor:pointer;user-select:none;margin-bottom:12px;"><input type="checkbox" id="keep" style="margin:0;transform:scale(1.2);">Keep open</label><strong>① Focus Address bar:</strong><br>• Ctrl+L (universal) | Cmd+L (macOS)<br>• Alt+D (Windows/Edge) | F6 / Fn+F6 (cycle)<br>• Why? → to search for bookmarklet inside current tab<br><br><strong>② Search bookmarks (inside current tab), type in Address bar:</strong><br>• <strong>@b+[Tab]</strong> (quick) or <strong>@bookmarks</strong> - (Chrome)<br>• <strong>*</strong> - (Firefox)<br><br><strong>③ Organize and name bookmarklets:</strong><br>1. Group all bookmarklets inside a folder: “Bookmarklets” / “JS Tools” / “⚡”<br>2. Add a prefix: (bk-name) / (js-...) / (⚡-...) / (bkt-)<br>3. Use: bk / js / ⚡ + {folder name} / {bookmarklet name}<br><small id="timer" style="opacity:0.85;color:#c0c0e0;display:block;margin:10px 0 8px;">Auto-hide in 18s • Esc to close</small><div style="margin-top:12px;font-size:13.5px;line-height:1.5;"><strong>More keyboard shortcuts for Chrome</strong><br><a href="https://support.google.com/chrome/answer/157179" style="color:#88ccff;text-decoration:underline;" target="_blank">Chrome keyboard shortcuts (Google Support)</a><br><a href="https://www.dca.ca.gov/about_us/kbs_chrome.shtml" style="color:#88ccff;text-decoration:underline;" target="_blank">Chrome Keyboard Shortcuts (dca.ca.gov)</a></div>`;document.body.appendChild(d);let seconds=18;const timerEl=d.querySelector('#timer');const updateTimer=()=>{if(seconds>0){seconds--;timerEl.textContent=`Auto-hide in ${seconds}s • Esc to close`}};let tId=setInterval(()=>{updateTimer();if(seconds<=0){clearInterval(tId);d.style.opacity='0';d.style.transform='translateY(-20px)';setTimeout(()=>d.remove(),700)}},1000);updateTimer();setTimeout(()=>{d.style.opacity='1';d.style.transform='translateY(0)'},80);d.querySelector('#closeBtn').onclick=()=>{d.style.opacity='0';d.style.transform='translateY(-20px)';setTimeout(()=>d.remove(),700)};const c=d.querySelector('#keep');if(c){c.addEventListener('change',()=>{if(c.checked){clearInterval(tId);timerEl.textContent='Auto-hide paused • Esc or close button'}else{seconds=18;updateTimer();tId=setInterval(()=>{updateTimer();if(seconds<=0){clearInterval(tId);d.style.opacity='0';d.style.transform='translateY(-20px)';setTimeout(()=>d.remove(),700)}},1000)}})}document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.repeat){d.style.opacity='0';d.style.transform='translateY(-20px)';setTimeout(()=>d.remove(),700)}},{once:true})})();
```

---

## 6. Force Enable Copy/Paste/Select Bookmarklet

A comprehensive bookmarklet that defeats **all known methods** websites use to prevent copying, pasting, selecting text, and right-clicking. One click re-enables everything.

### Methods covered (13 techniques):

| # | Technique | What it defeats |
|---|-----------|-----------------|
| 1 | Capture-phase event listeners | `copy`, `cut`, `paste`, `selectstart`, `contextmenu`, `dragstart`, `mousedown/up`, `keydown/up` — intercepts and allows all |
| 2 | Document-level handler nullification | `document.oncopy = function(){return false}` and similar |
| 3 | Inline handler attribute removal | `<div oncopy="return false">` on every element |
| 4 | CSS `user-select: none` injection | Injects `!important` stylesheet forcing `user-select: auto` on all elements |
| 5 | Stylesheet rule deletion | Removes `user-select:none` and `pointer-events:none` rules from existing stylesheets |
| 6 | Inline style cleanup | Strips `user-select`, `pointer-events`, `-webkit-touch-callout` from inline styles |
| 7 | `unselectable` attribute removal | Old IE-era attribute still used by some sites |
| 8 | `window.getSelection` restoration | Restores if the site overrode it to break copy |
| 9 | Right-click / context menu re-enabling | Intercepts `contextmenu` event blocking |
| 10 | `pointer-events: none` removal | Removes invisible overlays that block interaction |
| 11 | MutationObserver persistence | Continuously re-applies fixes as the page dynamically changes |
| 12 | Same-origin iframe traversal | Applies all fixes inside iframes too |
| 13 | Mobile `-webkit-touch-callout` fix | Re-enables long-press copy on mobile Safari |

### How to use

Create a new bookmark and paste this as the URL:

```javascript
javascript:!function(){"use strict";var t=["copy","cut","paste","selectstart","contextmenu","dragstart","mousedown","mouseup","keydown","keyup"],e=function(t){return t.stopImmediatePropagation(),!0};t.forEach(function(t){document.addEventListener(t,e,!0)}),document.oncopy=null,document.oncut=null,document.onpaste=null,document.onselectstart=null,document.oncontextmenu=null,document.ondragstart=null,document.onmousedown=null;var n=["oncopy","oncut","onpaste","onselectstart","oncontextmenu","ondragstart","onmousedown"];function o(t){n.forEach(function(e){t.hasAttribute&&t.hasAttribute(e)&&t.removeAttribute(e)}),t.hasAttribute&&t.hasAttribute("unselectable")&&t.removeAttribute("unselectable"),t.style&&(t.style.userSelect="",t.style.webkitUserSelect="",t.style.MozUserSelect="",t.style.msUserSelect="",t.style.webkitTouchCallout="","none"===t.style.pointerEvents&&(t.style.pointerEvents="")),t.oncopy&&(t.oncopy=null),t.oncut&&(t.oncut=null),t.onpaste&&(t.onpaste=null),t.onselectstart&&(t.onselectstart=null),t.oncontextmenu&&(t.oncontextmenu=null),t.ondragstart&&(t.ondragstart=null)}for(var c=document.querySelectorAll("*"),r=0;r<c.length;r++)o(c[r]);o(document.documentElement),o(document.body);var u="__force_copy_style__";if(!document.getElementById(u)){var l=document.createElement("style");l.id=u,l.textContent=["*, *::before, *::after {","  -webkit-user-select: auto !important;","  -moz-user-select: auto !important;","  -ms-user-select: auto !important;","  user-select: auto !important;","  -webkit-touch-callout: default !important;","}","html, body {","  -webkit-user-select: auto !important;","  user-select: auto !important;","  pointer-events: auto !important;","}"].join("\n"),(document.head||document.documentElement).appendChild(l)}try{for(var a=document.styleSheets,s=0;s<a.length;s++)try{var i=a[s].cssRules||a[s].rules;if(!i)continue;for(var d=i.length-1;d>=0;d--){var m=i[d].cssText||"";(/user-select\s*:\s*none/i.test(m)||/pointer-events\s*:\s*none/i.test(m))&&a[s].deleteRule(d)}}catch(t){}}catch(t){}try{if(!window.getSelection||-1===window.getSelection.toString().indexOf("native")){var p=document.createElement("iframe");p.style.display="none",document.body.appendChild(p),p.contentWindow&&p.contentWindow.getSelection&&(window.getSelection=p.contentWindow.getSelection.bind(p.contentWindow)),document.body.removeChild(p)}}catch(t){}document.addEventListener("copy",function(t){var e=window.getSelection();e&&e.toString()},!1);try{if(document.execCommand){var y=document.execCommand.bind(document);document.execCommand=function(t){return y.apply(document,arguments)}}}catch(t){}new MutationObserver(function(t){t.forEach(function(t){t.addedNodes&&t.addedNodes.forEach(function(t){if(1===t.nodeType){o(t);for(var e=t.querySelectorAll?t.querySelectorAll("*"):[],n=0;n<e.length;n++)o(e[n])}}),"attributes"===t.type&&1===t.target.nodeType&&o(t.target)})}).observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0,attributeFilter:n.concat(["style","unselectable","class"])});try{for(var f=document.querySelectorAll("iframe"),b=0;b<f.length;b++)try{var h=f[b].contentDocument||f[b].contentWindow.document;if(h){t.forEach(function(t){h.addEventListener(t,e,!0)}),h.oncopy=null,h.oncut=null,h.onpaste=null,h.onselectstart=null,h.oncontextmenu=null;for(var v=h.querySelectorAll("*"),g=0;g<v.length;g++)o(v[g]);var w=h.createElement("style");w.textContent="* { -webkit-user-select: auto !important; user-select: auto !important; -webkit-touch-callout: default !important; }",(h.head||h.documentElement).appendChild(w)}}catch(t){}}catch(t){}var x=document.createElement("div");x.textContent="\u2705 Copy/Paste/Select enabled!",x.style.cssText="position:fixed;top:8px;left:50%;transform:translateX(-50%);background:#222;color:#5fb950;padding:10px 24px;border-radius:8px;font:600 14px/1.4 system-ui,sans-serif;z-index:2147483647;box-shadow:0 4px 24px rgba(0,0,0,0.5);border:1px solid #5fb950;pointer-events:none;opacity:0;transition:opacity .3s ease;",document.body.appendChild(x),setTimeout(function(){x.style.opacity="1"},50),setTimeout(function(){x.style.opacity="0",setTimeout(function(){x.remove()},400)},2500)}();
```

The readable/documented source is in [`force-copy.js`](force-copy.js).

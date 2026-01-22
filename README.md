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

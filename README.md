# a personal Bookmarklets Collection

A curated collection of **bookmarklets** that I find useful.  

This repository also aims to **create a website with bookmarklets (prefixed `bk-`)** where users can:  
- Drag and drop bookmarklets directly into the browser bookmarks bar.  
- Import a folder containing multiple bookmarklets into the bookmarks bar for easy access.  

---

## 1. Definition

A **bookmarklet** is a small JavaScript program stored as a browser bookmark. When clicked, it performs a specific action on the current webpage without installing additional software.  

---

## 2. Why Use Bookmarklets

- Automate repetitive tasks on websites.  
- Enhance browsing experience without extensions.  
- Extract or manipulate content quickly.  
- Experiment with web page styling or developer tools easily.  

---

## 3. Types of Bookmarklets

1. **Page Styling Bookmarklets** – Change fonts, background colors, or hide ads.  
2. **Content Extraction Bookmarklets** – Extract links, text, or images from a webpage.  
3. **Navigation and Search Bookmarklets** – Quickly search highlighted text or navigate to specific websites.  
4. **Developer Helper Bookmarklets** – Inspect source code, debug layout, or check colors.  
5. **Fun or Utility Bookmarklets** – Simple games, countdown timers, or calculator tools.  

---

## 4. How to Use

### 1. Drag & Drop
Drag the bookmarklet link directly into your browser bookmarks bar:  

- [Change Background to Yellow](javascript:(function(){document.body.style.backgroundColor='yellow';})())  
- [Highlight All Links](javascript:(function(){var a=document.getElementsByTagName('a');for(var i=0;i<a.length;i++){a[i].style.backgroundColor='yellow';}})())  

### 2. Folder Import
- Create a folder in your bookmarks bar.  
- Drag multiple bookmarklets into that folder for organized access.  

### 3. Click to Execute
Simply click the bookmarklet from your bookmarks bar while on any webpage to activate its function.  

---

## 5. Contribution

Feel free to submit your favorite bookmarklets as pull requests. Please prefix them with `bk-` for consistency.

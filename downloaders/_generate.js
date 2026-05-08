#!/usr/bin/env node
/**
 * Generator for per-site download bookmarklets.
 *
 * One declarative config per supported site → one self-contained `.js` file
 * containing a drag-and-drop-ready `javascript:` payload.
 *
 *   Usage:  node _generate.js
 *
 * Each output is single-line, shadow-DOM isolated, keyboard-driven, and
 * strips known tracking parameters before opening the chosen downloader.
 */
'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Service tuple shape:  [name, tag, url, idType|null, autofillSelector|null]
//   url       : may contain {URL} (full link, encoded) and/or {ID} (extracted)
//   idType    : key into ID_RX in the runtime template
//   autofill  : best-effort selector to populate after window.open
// ---------------------------------------------------------------------------

const SITES = {
  youtube: {
    label: 'YouTube',
    hosts: ['youtube.com', 'youtu.be', 'm.youtube.com', 'music.youtube.com'],
    strip: ['si', 'feature', 'pp', 't', 'ab_channel', 'utm_source',
            'utm_medium', 'utm_campaign', 'utm_content'],
    id_extractor: 'ytId',
    services: [
      ['Cobalt',       'open-source • MP4/MP3/4K • no ads',
        'https://cobalt.tools/?u={URL}',                         null,    null],
      ['SSYouTube',    'classic URL trick • redirects',
        'https://ssyoutube.com/watch?v={ID}',                    'ytId',  null],
      ['Y2Mate',       'MP3 + MP4 + playlists',
        'https://www.y2mate.com/youtube/{ID}',                   'ytId',  null],
      ['SnapSave',     'HD/4K • mobile-friendly',
        'https://snapsave.app/en?url={URL}',                     null,    "input[type='text'],input[type='url']"],
      ['SaveFrom',     'veteran multi-platform',
        'https://en.savefrom.net/?url={URL}',                    null,    "input[name='sf_url']"],
      ['9Convert',     'unlimited free • playlists',
        'https://9convert.com/en1/youtube/{ID}',                 'ytId',  null],
      ['YT5s',         'HD/4K • simple',
        'https://yt5s.io/en1/youtube-to-mp4/{ID}',               'ytId',  null],
      ['ClipConverter','flexible formats • ad-light',
        'https://www.clipconverter.cc/3/?url={URL}',             null,    null],
    ],
  },

  instagram: {
    label: 'Instagram',
    hosts: ['instagram.com', 'www.instagram.com'],
    strip: ['igshid', 'igsh', 'utm_source', 'utm_medium', 'hl'],
    id_extractor: 'igId',
    services: [
      ['FastDL',     'top 2026 • Reels/Stories/HD • clean',
        'https://fastdl.app/?url={URL}',                         null, "input[type='text']"],
      ['SnapInsta',  'popular • HD • no watermark',
        'https://snapinsta.app/?url={URL}',                      null, "input[type='text']"],
      ['iGram',      'quick • mobile-friendly',
        'https://igram.world/?url={URL}',                        null, "input[type='text']"],
      ['Inflact',    'reliable HD • multi-format',
        'https://inflact.com/downloader/instagram/?url={URL}',   null, "input[type='text']"],
      ['Publer',     'no ads • no login • trusted',
        'https://publer.com/tools/instagram-video-downloader?url={URL}', null, "input[type='text']"],
      ['Toolzu',     'fast • all content',
        'https://toolzu.com/downloader/instagram/?url={URL}',    null, "input[type='text']"],
      ['SaveFrom',   'veteran multi-platform',
        'https://en.savefrom.net/?url={URL}',                    null, "input[name='sf_url']"],
    ],
  },

  facebook: {
    label: 'Facebook',
    hosts: ['facebook.com', 'www.facebook.com', 'm.facebook.com',
            'web.facebook.com', 'fb.watch', 'business.facebook.com'],
    strip: ['fbclid', 'mibextid', '_rdr', 'ref', 'comment_id',
            'utm_source', 'utm_medium', 'utm_campaign'],
    rewrite: { 'm.facebook.com': 'www.facebook.com',
               'web.facebook.com': 'www.facebook.com' },
    id_extractor: 'fbId',
    services: [
      ['FDown',     'top-rated • HD/4K • Reels • private posts',
        'https://fdown.net/?url={URL}',                          null, "input#URLz,input[type='text']"],
      ['SnapSave',  'best for Reels • HD/4K • mobile',
        'https://snapsave.app/facebook-reels-download?url={URL}', null, "input[type='text']"],
      ['Publer',    'ad-free • no login • clean',
        'https://publer.com/tools/facebook-video-downloader?url={URL}', null, "input[type='text']"],
      ['GetfVid',   'simple • public + private',
        'https://www.getfvid.com/downloader?url={URL}',          null, "input[name='url']"],
      ['Toolzu',    'free • all content • all devices',
        'https://toolzu.com/downloader/facebook/?url={URL}',     null, "input[type='text']"],
      ['FBDown',    'veteran • reliable',
        'https://fbdown.net/download.php?URLz={URL}',            null, "input[name='URLz']"],
      ['SaveFrom',  'multi-platform fallback',
        'https://en.savefrom.net/?url={URL}',                    null, "input[name='sf_url']"],
    ],
  },

  'x-twitter': {
    label: 'X / Twitter',
    hosts: ['x.com', 'twitter.com', 'mobile.twitter.com', 'mobile.x.com'],
    strip: ['s', 't', 'ref_src', 'ref_url', 'cxt', 'twclid',
            'utm_source', 'utm_medium'],
    rewrite: { 'twitter.com': 'x.com', 'mobile.twitter.com': 'x.com',
               'mobile.x.com': 'x.com' },
    id_extractor: 'xId',
    services: [
      ['ssstwitter', 'fastest • HD/4K • minimal ads',
        'https://ssstwitter.com/?url={URL}',                     null, "input[type='text']"],
      ['Cobalt',     'open-source • clean',
        'https://cobalt.tools/?u={URL}',                         null, null],
      ['Publer',     'no ads • no login • HD',
        'https://publer.com/tools/twitter-video-downloader?url={URL}', null, "input[type='text']"],
      ['xdownload',  'ad-free • super quick',
        'https://xdownload.org/?url={URL}',                      null, "input[type='text']"],
      ['Twitsave',   'great on phones',
        'https://twitsave.com/info?url={URL}',                   null, "input[name='url']"],
      ['SnapTwitter','quick reliable fallback',
        'https://snaptwitter.com/?url={URL}',                    null, "input[type='text']"],
      ['KeepOffline','simple • mobile',
        'https://keepoffline.com/?url={URL}',                    null, "input[type='text']"],
    ],
  },

  tiktok: {
    label: 'TikTok',
    hosts: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com',
            'vt.tiktok.com', 'm.tiktok.com'],
    strip: ['is_from_webapp', 'sender_device', '_r', '_t',
            'checksum', 'share_app_id', 'share_link_id',
            'social_share_type', 'utm_source', 'utm_medium'],
    id_extractor: 'ttId',
    services: [
      ['SnapTik',     'best 2026 • no watermark • HD',
        'https://snaptik.app/?url={URL}',                        null, "input[type='text']"],
      ['SSSTik',      'fast • no watermark',
        'https://ssstik.io/?url={URL}',                          null, "input[type='text']"],
      ['TikMate',     'HD/4K • mp3 extract',
        'https://tikmate.online/download?url={URL}',             null, "input[type='text']"],
      ['Tikwm',       'API-based • bulk',
        'https://www.tikwm.com/?url={URL}',                      null, "input[type='text']"],
      ['MusicallyDown','no watermark • mp3',
        'https://musicallydown.com/?url={URL}',                  null, "input[type='text']"],
      ['TTDownloader','veteran • simple',
        'https://ttdownloader.com/?url={URL}',                   null, "input#url"],
      ['Cobalt',      'open-source fallback',
        'https://cobalt.tools/?u={URL}',                         null, null],
    ],
  },

  reddit: {
    label: 'Reddit',
    hosts: ['reddit.com', 'www.reddit.com', 'old.reddit.com',
            'new.reddit.com', 'i.redd.it', 'v.redd.it'],
    strip: ['share_id', 'utm_source', 'utm_medium', 'utm_name',
            'context', 'ref', 'ref_source', 'rdt'],
    rewrite: { 'old.reddit.com': 'www.reddit.com',
               'new.reddit.com': 'www.reddit.com' },
    id_extractor: 'rdId',
    services: [
      ['RedditSave', 'top 2026 • video+audio merged • HD',
        'https://redditsave.com/info?url={URL}',                 null, "input[type='text']"],
      ['Viddit',     'clean • no ads',
        'https://viddit.red/?url={URL}',                         null, "input[type='text']"],
      ['Cobalt',     'open-source • merges A/V',
        'https://cobalt.tools/?u={URL}',                         null, null],
      ['RedditDL',   'simple direct downloader',
        'https://reddit.tube/parser?url={URL}',                  null, "input[type='text']"],
      ['RedV',       'fast • merges audio',
        'https://redv.co/?url={URL}',                            null, "input[type='text']"],
      ['SaveMP4',    'video-only fallback',
        'https://savemp4.red/?url={URL}',                        null, "input[type='text']"],
    ],
  },

  pinterest: {
    label: 'Pinterest',
    hosts: ['pinterest.com', 'www.pinterest.com', 'pin.it',
            'pinterest.fr', 'pinterest.co.uk', 'pinterest.de'],
    strip: ['epik', 'utm_source', 'utm_medium', 'utm_campaign',
            'rs', 'amp_client_id'],
    services: [
      ['PinDown',           'video + img + GIF • HD',
        'https://www.pindown.app/?url={URL}',                    null, "input[type='text']"],
      ['ExpertsTool',       'video/image • original quality',
        'https://expertstool.com/pinterest-video-downloader/?url={URL}', null, "input[type='text']"],
      ['PinterestDownloader','veteran',
        'https://pinterestdownloader.com/?url={URL}',            null, "input[type='text']"],
      ['SavePin',           'fast • clean',
        'https://savepin.app/?url={URL}',                        null, "input[type='text']"],
      ['PinClick',          'image-focused • HD',
        'https://pinclick.com/?url={URL}',                       null, "input[type='text']"],
    ],
  },

  linkedin: {
    label: 'LinkedIn',
    hosts: ['linkedin.com', 'www.linkedin.com'],
    strip: ['utm_source', 'utm_medium', 'utm_campaign',
            'trk', 'trackingId', 'lipi'],
    services: [
      ['ExpertsTool', 'reliable • clean • free',
        'https://expertstool.com/linkedin-video-downloader/?url={URL}', null, "input[type='text']"],
      ['PublerLI',    'no ads • no login',
        'https://publer.com/tools/linkedin-video-downloader?url={URL}', null, "input[type='text']"],
      ['LinkedinDL',  'veteran • HD',
        'https://linkedindownload.com/?url={URL}',               null, "input[type='text']"],
      ['SocialPlus',  'multi-platform • LinkedIn aware',
        'https://socialplus.com/linkedin-downloader/?url={URL}', null, "input[type='text']"],
      ['SaveFrom',    'fallback',
        'https://en.savefrom.net/?url={URL}',                    null, "input[name='sf_url']"],
    ],
  },

  vimeo: {
    label: 'Vimeo',
    hosts: ['vimeo.com', 'player.vimeo.com'],
    strip: ['utm_source', 'utm_medium', 'utm_campaign', 'share', 'h'],
    id_extractor: 'vmId',
    services: [
      ['Cobalt',       'open-source • best Vimeo support',
        'https://cobalt.tools/?u={URL}',                         null, null],
      ['SaveFrom',     'veteran multi-platform',
        'https://en.savefrom.net/?url={URL}',                    null, "input[name='sf_url']"],
      ['SaveVideo',    'direct • original quality',
        'https://www.savevideo.me/?url={URL}',                   null, "input[name='url']"],
      ['KeepVid',      'old reliable',
        'https://keepvid.works/?url={URL}',                      null, "input[type='text']"],
      ['9xBuddy',      'broad format support',
        'https://9xbuddy.com/process?url={URL}',                 null, "input[type='text']"],
    ],
  },

  soundcloud: {
    label: 'SoundCloud',
    hosts: ['soundcloud.com', 'on.soundcloud.com', 'm.soundcloud.com'],
    strip: ['si', 'utm_source', 'utm_medium', 'utm_campaign', 'in'],
    services: [
      ['Cobalt',         'open-source • mp3 • lossless',
        'https://cobalt.tools/?u={URL}',                         null, null],
      ['SCDLer',         'simple • mp3 320kbps',
        'https://scdler.com/?url={URL}',                         null, "input[type='text']"],
      ['KlickAud',       'fast • mp3',
        'https://klickaud.co/?url={URL}',                        null, "input[type='text']"],
      ['SoundCloudMP3',  'veteran • playlists',
        'https://soundcloudmp3.org/?url={URL}',                  null, "input[type='text']"],
      ['SCDownloader',   'track + cover art',
        'https://scdownloader.io/?url={URL}',                    null, "input[type='text']"],
    ],
  },

  twitch: {
    label: 'Twitch',
    hosts: ['twitch.tv', 'www.twitch.tv', 'clips.twitch.tv', 'm.twitch.tv'],
    strip: ['t', 'tt_content', 'tt_medium', 'filter',
            'utm_source', 'utm_medium'],
    services: [
      ['TwitchClipDL',     'clip-focused • HD • fast',
        'https://twitchclipdownloader.com/?url={URL}',           null, "input[type='text']"],
      ['Untwitch',         'VOD + clips • simple',
        'https://untwitch.com/?url={URL}',                       null, "input[type='text']"],
      ['Cobalt',           'open-source fallback',
        'https://cobalt.tools/?u={URL}',                         null, null],
      ['ClipsDownloader',  'clean • HD',
        'https://clipsdownloader.com/?url={URL}',                null, "input[type='text']"],
      ['9xBuddy',          'VOD support',
        'https://9xbuddy.com/process?url={URL}',                 null, "input[type='text']"],
    ],
  },

  snapchat: {
    label: 'Snapchat',
    hosts: ['snapchat.com', 'www.snapchat.com', 'story.snapchat.com',
            't.snapchat.com'],
    strip: ['share_id', 'sid', 'lng', 'utm_source'],
    services: [
      ['SnapSpot',        'Spotlight • Stories • HD',
        'https://snapspot.app/?url={URL}',                       null, "input[type='text']"],
      ['SnapchatDL',      'clean • fast',
        'https://snapchatdownloader.com/?url={URL}',             null, "input[type='text']"],
      ['ExpertsTool',     'Spotlight + Stories',
        'https://expertstool.com/snapchat-video-downloader/?url={URL}', null, "input[type='text']"],
      ['SaveFrom',        'fallback',
        'https://en.savefrom.net/?url={URL}',                    null, "input[name='sf_url']"],
    ],
  },

  universal: {
    label: 'Universal (any site)',
    hosts: [],
    strip: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term',
            'utm_content', 'fbclid', 'gclid', 'yclid', 'mc_cid',
            'mc_eid', '_ga', 'igshid', 'si', 'share_id'],
    services: [
      ['Cobalt',     'open-source • 50+ sites • best default',
        'https://cobalt.tools/?u={URL}',                         null, null],
      ['SaveFrom',   '1000+ sites • veteran',
        'https://en.savefrom.net/?url={URL}',                    null, "input[name='sf_url']"],
      ['9xBuddy',    'broad format support',
        'https://9xbuddy.com/process?url={URL}',                 null, "input[type='text']"],
      ['KeepVid',    'old reliable',
        'https://keepvid.works/?url={URL}',                      null, "input[type='text']"],
      ['Y2Mate',     'if YouTube-like',
        'https://www.y2mate.com/?url={URL}',                     null, "input[type='text']"],
      ['Yt-dlp.org', 'self-host docs (advanced)',
        'https://github.com/yt-dlp/yt-dlp',                      null, null],
    ],
  },
};

// ---------------------------------------------------------------------------
// Runtime template — emitted as a single line `javascript:` payload.
// `__CFG__` placeholder is replaced with a JSON literal for each site.
// ---------------------------------------------------------------------------

const JS_TEMPLATE =
`javascript:(()=>{'use strict';const CFG=__CFG__;const KEY='bk-dl:last:'+CFG.id;` +
`const ID_RX={ytId:/(?:v=|youtu\\.be\\/|\\/shorts\\/|\\/embed\\/|\\/v\\/)([\\w-]{11})/,` +
`igId:/\\/(?:p|reel|reels|tv)\\/([\\w-]+)/,` +
`fbId:/(?:\\/videos\\/|\\/watch\\/?\\?v=|\\/reel\\/|fb\\.watch\\/)([\\w-]+)/,` +
`xId:/\\/status(?:es)?\\/(\\d+)/,` +
`ttId:/\\/video\\/(\\d+)|vm\\.tiktok\\.com\\/(\\w+)|vt\\.tiktok\\.com\\/(\\w+)/,` +
`rdId:/\\/comments\\/(\\w+)/,` +
`vmId:/vimeo\\.com\\/(\\d+)/};` +
`function extractId(u,t){const m=u.match(ID_RX[t]||/$^/);return m?(m[1]||m[2]||m[3]||''):''}` +
`function clean(u){try{const x=new URL(u);if(CFG.rewrite&&CFG.rewrite[x.hostname])x.hostname=CFG.rewrite[x.hostname];` +
`(CFG.strip||[]).forEach(p=>x.searchParams.delete(p));` +
`[...x.searchParams.keys()].filter(k=>/^utm_/i.test(k)).forEach(k=>x.searchParams.delete(k));` +
`return x.toString()}catch(e){return u}}` +
`function looksValid(u){try{const h=new URL(u).hostname.replace(/^www\\./,'');if(!CFG.hosts||!CFG.hosts.length)return true;` +
`return CFG.hosts.some(d=>h===d||h.endsWith('.'+d))}catch(e){return false}}` +
`const raw=location.href;const url=clean(raw);` +
`if(!looksValid(raw)){if(!confirm(CFG.label+' downloader\\n\\nThis page does not look like '+CFG.label+'.\\nProceed anyway?'))return}` +
`navigator.clipboard.writeText(url).catch(()=>{});` +
`const last=(()=>{try{return localStorage.getItem(KEY)||''}catch(e){return ''}})();` +
`const host_el=document.createElement('div');host_el.style.cssText='all:initial;position:fixed;inset:0;z-index:2147483647;';` +
`const sh=host_el.attachShadow({mode:'closed'});` +
'sh.innerHTML=`<style>:host{all:initial}*{box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
'.bg{position:fixed;inset:0;background:rgba(8,8,16,.78);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;animation:f .18s ease-out}' +
'@keyframes f{from{opacity:0}to{opacity:1}}' +
'.box{background:#13131a;color:#f0f0f5;border:1px solid #2c2c3a;border-radius:14px;padding:18px 20px 16px;width:min(94vw,460px);max-height:90vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.6)}' +
'.h{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}' +
'h2{font:700 17px/1.2 system-ui;margin:0;color:#fff}' +
'.x{background:none;border:0;color:#888;font-size:22px;cursor:pointer;line-height:1;padding:0 4px}.x:hover{color:#fff}' +
'.u{font:11px/1.4 ui-monospace,Menlo,monospace;color:#7ad;background:#0c0c14;border:1px solid #1f1f2a;border-radius:6px;padding:6px 8px;word-break:break-all;margin-bottom:10px;max-height:60px;overflow:auto}' +
'.row{display:flex;gap:8px;margin-bottom:12px}' +
'.row button{flex:1;background:#1f2230;color:#cfd;border:1px solid #2c3142;border-radius:7px;padding:7px 10px;font:600 12px system-ui;cursor:pointer}' +
'.row button:hover{background:#262a3a;border-color:#3a4360}' +
'.list{display:grid;gap:6px}' +
'.s{display:flex;align-items:center;gap:10px;background:#1a1a24;border:1px solid #262635;border-radius:9px;padding:10px 12px;cursor:pointer;text-align:left;color:#eaeaf2;transition:transform .06s,border-color .12s,background .12s;width:100%;font:inherit}' +
'.s:hover,.s:focus{outline:none;background:#22243a;border-color:#4a4dff}.s:active{transform:scale(.985)}' +
'.s.last{border-color:#5b5cf0;box-shadow:0 0 0 1px rgba(91,92,240,.35) inset}' +
'.k{display:inline-flex;width:22px;height:22px;align-items:center;justify-content:center;background:#2c2c3a;color:#8a8aa0;border-radius:5px;font:600 11px ui-monospace,monospace}' +
'.n{font:700 14px system-ui;color:#fff}' +
'.t{font:400 12px system-ui;color:#9a9ab0;margin-top:1px}' +
'.c{display:flex;flex-direction:column;flex:1;min-width:0}' +
'.f{font:500 11px system-ui;color:#666;margin-top:10px;text-align:center}</style>' +
'<div class="bg" part="bg"><div class="box" role="dialog" aria-label="Downloader">' +
'<div class="h"><h2>${CFG.label} downloader</h2><button class="x" aria-label="Close">×</button></div>' +
'<div class="u" id="u">${url.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</div>' +
'<div class="row"><button id="copy">Copy URL</button><button id="raw">Open raw</button></div>' +
'<div class="list"></div>' +
'<div class="f">Press 1-9 to pick · Esc to close · Enter on focus</div>' +
'</div></div>`;' +
`const list=sh.querySelector('.list');` +
`CFG.services.forEach((s,i)=>{const b=document.createElement('button');b.className='s'+(s.name===last?' last':'');b.dataset.idx=i;` +
"b.innerHTML=`<span class=\"k\">${i+1}</span><span class=\"c\"><span class=\"n\">${s.name}</span><span class=\"t\">${s.tag}</span></span>`;" +
`list.appendChild(b)});` +
`const close=()=>{document.removeEventListener('keydown',onKey,true);host_el.remove()};` +
`const open=(i)=>{const s=CFG.services[i];if(!s)return;let target=s.url;` +
`if(target.includes('{ID}')){const id=extractId(url,s.idType||CFG.id_extractor);` +
`if(!id){alert('Could not extract '+CFG.label+' ID from URL.');return}` +
`target=target.replace('{ID}',encodeURIComponent(id))}` +
`target=target.replace('{URL}',encodeURIComponent(url));` +
`try{localStorage.setItem(KEY,s.name)}catch(e){}` +
`const w=window.open(target,'_blank','noopener,noreferrer');` +
`if(s.autofill&&w){const t0=Date.now();const iv=setInterval(()=>{` +
`if(Date.now()-t0>15000){clearInterval(iv);return}` +
`try{const d=w.document;const inp=d.querySelector(s.autofill);` +
`if(inp){clearInterval(iv);inp.value=url;inp.dispatchEvent(new Event('input',{bubbles:true}));` +
`inp.dispatchEvent(new Event('change',{bubbles:true}));inp.focus();` +
`const btn=d.querySelector('button[type=submit],input[type=submit],.download-btn,.btn-download,button.submit,#sf_submit');` +
`if(btn)setTimeout(()=>btn.click(),250)}}catch(e){clearInterval(iv)}},400)}close()};` +
`sh.querySelector('.x').onclick=close;` +
`sh.querySelector('.bg').addEventListener('click',e=>{if(e.target.classList.contains('bg'))close()});` +
`sh.querySelector('#copy').onclick=()=>{navigator.clipboard.writeText(url).then(()=>{const b=sh.querySelector('#copy');const t=b.textContent;b.textContent='Copied ✓';setTimeout(()=>b.textContent=t,1200)})};` +
`sh.querySelector('#raw').onclick=()=>{window.open(url,'_blank','noopener,noreferrer');close()};` +
`list.querySelectorAll('.s').forEach(b=>{b.onclick=()=>open(+b.dataset.idx)});` +
`function onKey(e){if(e.key==='Escape'){e.preventDefault();close()}` +
`else if(/^[1-9]$/.test(e.key)){const i=+e.key-1;if(i<CFG.services.length){e.preventDefault();open(i)}}}` +
`document.addEventListener('keydown',onKey,true);` +
`document.body.appendChild(host_el);` +
`const first=sh.querySelector('.s.last')||sh.querySelector('.s');if(first)first.focus()})();`;

// ---------------------------------------------------------------------------

function buildCfg(id, site) {
  const services = site.services.map(([name, tag, url, idType, autofill]) => {
    const s = { name, tag, url };
    if (idType) s.idType = idType;
    if (autofill) s.autofill = autofill;
    return s;
  });
  const cfg = {
    id,
    label: site.label,
    hosts: site.hosts,
    strip: site.strip || [],
    id_extractor: site.id_extractor || null,
    services,
  };
  if (site.rewrite) cfg.rewrite = site.rewrite;
  return cfg;
}

const OUT = __dirname;
let total = 0;
for (const [id, site] of Object.entries(SITES)) {
  const cfg = buildCfg(id, site);
  const cfgJson = JSON.stringify(cfg);
  const payload = JS_TEMPLATE.replace('__CFG__', cfgJson).replace(/\n/g, '');
  const file = path.join(OUT, `${id}.js`);
  fs.writeFileSync(file, payload + '\n', 'utf8');
  console.log(`  wrote ${file} (${payload.length} chars)`);
  total++;
}
console.log(`\n${total} bookmarklet(s) generated.`);

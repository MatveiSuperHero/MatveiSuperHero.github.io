// ==================== МОБИЛЬНОЕ МЕНЮ И ПОИСК ПО РАЗДЕЛУ ====================
(function () {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    const burgerBtn = document.getElementById('burgerBtn');
    const searchInput = document.getElementById('toolSearch');
    const searchClear = document.getElementById('searchClear');
    const searchStatus = document.getElementById('searchStatus');
    const searchCount = document.getElementById('searchCount');

    if (burgerBtn) burgerBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        backdrop.classList.add('open');
    });
    if (backdrop) backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
    });

    window.resetSearch = function () {
        if (!searchInput) return;
        searchInput.value = '';
        if (searchClear) searchClear.classList.remove('visible');
        if (searchStatus) searchStatus.classList.remove('visible');
        document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('search-hidden'));
    };

    if (searchClear) searchClear.addEventListener('click', window.resetSearch);

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            if (searchClear) searchClear.classList.toggle('visible', query.length > 0);
            if (!query) { window.resetSearch(); return; }

            let matches = 0;
            document.querySelectorAll('.tool-card').forEach(card => {
                const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
                const ok = title.includes(query);
                card.classList.toggle('search-hidden', !ok);
                if (ok) matches++;
            });
            if (searchCount) searchCount.textContent = matches;
            if (searchStatus) searchStatus.classList.add('visible');
        });
    }
})();

// ==================== ИНСТРУМЕНТЫ ====================
(function () {
    const $ = id => document.getElementById(id);

    // ТЕКСТ
    const txtCountEl = $('txtCount');
    if (txtCountEl) txtCountEl.addEventListener('input', () => {
        const t = txtCountEl.value;
        $('sChars').textContent = t.length;
        $('sWords').textContent = (t.trim().match(/\S+/g) || []).length;
        $('sSents').textContent = (t.match(/[.!?…]+/g) || []).length;
    });

    window.changeCase = function (type) { $('txtCaseOut').textContent = type === 'up' ? $('txtCase').value.toUpperCase() : $('txtCase').value.toLowerCase(); };
    window.cleanSpaces = function () { $('txtCaseOut').textContent = $('txtCase').value.replace(/\s+/g, ' ').trim(); };
    window.reverseText = function () { $('txtRevOut').textContent = [...$('txtRev').value].reverse().join(''); };
    window.sortLines = function () { const l = $('lineInput').value.split('\n').filter(x => x.trim()); $('lineOut').textContent = l.sort((a, b) => a.localeCompare(b)).join('\n'); };
    window.dedupLines = function () { const l = $('lineInput').value.split('\n').filter(x => x.trim()); $('lineOut').textContent = [...new Set(l)].join('\n'); };
    window.reverseLines = function () { const l = $('lineInput').value.split('\n').filter(x => x.trim()); $('lineOut').textContent = l.reverse().join('\n'); };
    window.makeSlug = function () { const s = $('slugInput').value.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); $('slugOut').textContent = s || '—'; };
    window.runDiff = function () {
        const a = $('diff1').value.split('\n'), b = $('diff2').value.split('\n');
        let html = ''; const max = Math.max(a.length, b.length);
        for (let i = 0; i < max; i++) {
            if (a[i] === b[i]) html += (a[i] || '') + '\n';
            else {
                if (a[i] !== undefined) html += '<span class="diff-del">- ' + escapeHtml(a[i]) + '</span>\n';
                if (b[i] !== undefined) html += '<span class="diff-add">+ ' + escapeHtml(b[i]) + '</span>\n';
            }
        }
        $('diffOut').innerHTML = html || 'Нет различий';
    };
    function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    window.previewMarkdown = function () { if (typeof marked === 'undefined') { $('mdOut').textContent = 'Markdown не загружен'; return; } $('mdOut').innerHTML = marked.parse($('mdInput').value); };
    window.toNato = function () {
        const map = { A:'Alpha',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliett',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu','0':'Zero','1':'One','2':'Two','3':'Three','4':'Four','5':'Five','6':'Six','7':'Seven','8':'Eight','9':'Nine',' ':'(space)' };
        $('natoOut').textContent = [...$('natoIn').value.toUpperCase()].map(c => map[c] || c).join(' ');
    };
    window.unicodeInfo = function () {
        const s = $('unicodeIn').value; if (!s) { $('unicodeOut').textContent = '—'; return; }
        $('unicodeOut').textContent = [...s].map(c => c + '  →  U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join('\n');
    };
    window.extractNumbers = function () { $('extractNumbersOut').textContent = ($('extractNumbersIn').value.match(/-?\d+(\.\d+)?/g) || []).join('\n') || '—'; };
    window.extractEmails = function () { $('extractEmailsOut').textContent = ($('extractEmailsIn').value.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []).join('\n') || '—'; };
    window.extractUrls = function () { $('extractUrlsOut').textContent = ($('extractUrlsIn').value.match(/https?:\/\/[^\s]+/g) || []).join('\n') || '—'; };
    window.doReplace = function () { $('replaceOut').textContent = $('replaceIn').value.split($('replaceFind').value).join($('replaceWith').value); };
    window.charFrequency = function () {
        const t = $('charFreqIn').value, map = {};
        for (const c of t) map[c] = (map[c] || 0) + 1;
        $('charFreqOut').textContent = Object.entries(map).sort((a, b) => b[1] - a[1]).map(([c, n]) => `'${c}': ${n}`).join('\n') || '—';
    };
    window.genPin = function () {
        const len = parseInt($('pinLength').value, 10) || 4;
        $('pinOut').textContent = Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
    };
    window.textToBinary = function () {
        $('toBinaryOut').textContent = [...$('toBinaryIn').value].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    };
    window.textToHex = function () {
        $('toHexOut').textContent = [...$('toHexIn').value].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    };
    window.countLines = function () {
        const lines = $('countLinesIn').value.split('\n');
        $('countLinesOut').textContent = 'Строк: ' + lines.length + '\nСимволов: ' + $('countLinesIn').value.length;
    };
    window.textStatistics = function () {
        const t = $('textStatsIn').value;
        $('textStatsOut').textContent = 'Символов: ' + t.length + '\nСлов: ' + (t.trim().match(/\S+/g) || []).length + '\nСтрок: ' + t.split('\n').length;
    };
    window.sortNumbers = function () {
        const nums = ($('sortNumbersIn').value.match(/-?\d+(\.\d+)?/g) || []).map(Number).sort((a, b) => a - b);
        $('sortNumbersOut').textContent = nums.join(', ');
    };
    window.removeEmptyLines = function () {
        $('removeEmptyOut').textContent = $('removeEmptyIn').value.split('\n').filter(l => l.trim()).join('\n');
    };
    window.stringLength = function () { $('strLenOut').textContent = $('strLenIn').value.length; };
    window.genLoremCode = function () {
        const n = parseInt($('loremCodeCount').value, 10) || 3;
        const words = ['function', 'const', 'return', 'if', 'else', 'for', 'while', 'let', 'var', 'async', 'await', 'try', 'catch'];
        $('loremCodeOut').textContent = Array.from({ length: n }, () => Array.from({ length: 8 }, () => words[Math.floor(Math.random() * words.length)]).join(' ') + ';').join('\n');
    };

    // КОДИРОВАНИЕ
    window.b64enc = function () { try { const b = new TextEncoder().encode($('b64in').value); let s = ''; b.forEach(x => s += String.fromCharCode(x)); $('b64out').textContent = btoa(s); } catch (e) { $('b64out').textContent = 'Ошибка'; } };
    window.b64dec = function () { try { const b = atob($('b64in').value.trim()); const a = Uint8Array.from(b, c => c.charCodeAt(0)); $('b64out').textContent = new TextDecoder().decode(a); } catch (e) { $('b64out').textContent = 'Ошибка: некорректная Base64'; } };
    window.urlEncode = function () { $('urlout').textContent = encodeURIComponent($('urlin').value); };
    window.urlDecode = function () { try { $('urlout').textContent = decodeURIComponent($('urlin').value); } catch (e) { $('urlout').textContent = 'Ошибка'; } };
    window.htmlEncode = function () { $('htmlout').textContent = $('htmlin').value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); };
    window.htmlDecode = function () { const t = document.createElement('textarea'); t.innerHTML = $('htmlin').value; $('htmlout').textContent = t.value; };
    window.fmtJson = function (p) { try { $('jsonout').textContent = JSON.stringify(JSON.parse($('jsonin').value), null, p ? 2 : 0); } catch (e) { $('jsonout').textContent = 'Ошибка: ' + e.message; } };
    window.hexToBin = function () { const h = $('hexBin').value.replace(/\s+/g, ''); if (!/^[0-9a-f]+$/i.test(h)) { $('hexBinOut').textContent = 'Ошибка: не hex'; return; } $('hexBinOut').textContent = [...h].map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join(''); };
    window.binToHex = function () { let b = $('hexBin').value.replace(/\s+/g, ''); if (!/^[01]+$/.test(b)) { $('hexBinOut').textContent = 'Ошибка: не binary'; return; } if (b.length % 4) b = b.padStart(Math.ceil(b.length / 4) * 4, '0'); $('hexBinOut').textContent = b.match(/.{4}/g).map(x => parseInt(x, 2).toString(16)).join('').toUpperCase(); };

    // ХЕШИ И ПАРОЛИ
    const pwrangeEl = $('pwrange'); if (pwrangeEl) pwrangeEl.addEventListener('input', () => { $('pwLenLabel').textContent = pwrangeEl.value; });
    window.genPw = function () {
        let cs = '';
        if ($('pwUp').checked) cs += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if ($('pwLow').checked) cs += 'abcdefghijklmnopqrstuvwxyz';
        if ($('pwNum').checked) cs += '0123456789';
        if ($('pwSpec').checked) cs += '!@#$%^&*()-_=+[]{};:,.<>?';
        if (!cs) { $('pwout').textContent = 'Выберите параметры'; return; }
        const len = parseInt($('pwrange').value, 10); const max = 0xFFFFFFFF, limit = max - (max % cs.length); const out = []; const buf = new Uint32Array(1);
        while (out.length < len) { crypto.getRandomValues(buf); if (buf[0] < limit) out.push(cs[buf[0] % cs.length]); }
        const res = out.join(''); $('pwout').textContent = res;
        let sc = 0; if (res.length > 12) sc++; if (/[A-Z]/.test(res)) sc++; if (/[a-z]/.test(res)) sc++; if (/[0-9]/.test(res)) sc++; if (/[^A-Za-z0-9]/.test(res)) sc++;
        $('pwStrength').textContent = sc <= 2 ? '❌ Слабый' : sc <= 4 ? '⚠️ Средний' : '✅ Надёжный';
    };
    window.makeAllHashes = function () {
        const t = $('hashin').value; if (!t) { $('hashout').textContent = 'Введите текст'; return; }
        if (typeof CryptoJS === 'undefined') { $('hashout').textContent = 'CryptoJS не загружен'; return; }
        $('hashout').textContent = ['MD5:    ' + CryptoJS.MD5(t), 'SHA1:   ' + CryptoJS.SHA1(t), 'SHA256: ' + CryptoJS.SHA256(t), 'SHA512: ' + CryptoJS.SHA512(t), 'CRC32:  ' + crc32(t).toString(16).padStart(8, '0').toUpperCase()].join('\n');
    };
    function crc32(s) { let c = 0xFFFFFFFF; for (let i = 0; i < s.length; i++) { c ^= s.charCodeAt(i); for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (c & 1 ? 0xEDB88320 : 0); } return (c ^ 0xFFFFFFFF) >>> 0; }
    const bcryptRoundsEl = $('bcryptRounds'); if (bcryptRoundsEl) bcryptRoundsEl.addEventListener('input', () => { $('bcryptRoundsLabel').textContent = bcryptRoundsEl.value; });
    window.bcryptHash = function () { if (typeof bcrypt === 'undefined') { $('bcryptOut').textContent = 'bcryptjs не загружен'; return; } try { $('bcryptOut').textContent = bcrypt.hashSync($('bcryptIn').value, parseInt($('bcryptRounds').value, 10)); } catch (e) { $('bcryptOut').textContent = 'Ошибка'; } };
    window.bcryptVerify = function () { if (typeof bcrypt === 'undefined') { $('bcryptVerifyOut').textContent = 'bcryptjs не загружен'; return; } try { $('bcryptVerifyOut').textContent = bcrypt.compareSync($('bcryptIn').value, $('bcryptVerifyHash').value.trim()) ? '✅ Совпадает' : '❌ Не совпадает'; } catch (e) { $('bcryptVerifyOut').textContent = 'Ошибка'; } };
    window.genHmac = async function () { try { const enc = new TextEncoder(); const k = await crypto.subtle.importKey('raw', enc.encode($('hmacKey').value), { name: 'HMAC', hash: $('hmacAlgo').value }, false, ['sign']); const s = await crypto.subtle.sign('HMAC', k, enc.encode($('hmacText').value)); $('hmacOut').textContent = [...new Uint8Array(s)].map(b => b.toString(16).padStart(2, '0')).join(''); } catch (e) { $('hmacOut').textContent = 'Ошибка'; } };
    window.aesEncrypt = async function () { try { const t = $('aesIn').value, p = $('aesKey').value; if (!t || !p) { $('aesOut').textContent = 'Введите текст и пароль'; return; } const enc = new TextEncoder(); const km = await crypto.subtle.importKey('raw', enc.encode(p), 'PBKDF2', false, ['deriveKey']); const salt = crypto.getRandomValues(new Uint8Array(16)); const iv = crypto.getRandomValues(new Uint8Array(12)); const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['encrypt']); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(t)); const combined = new Uint8Array(salt.length + iv.length + ct.byteLength); combined.set(salt, 0); combined.set(iv, salt.length); combined.set(new Uint8Array(ct), salt.length + iv.length); let bin = ''; combined.forEach(b => bin += String.fromCharCode(b)); $('aesOut').textContent = btoa(bin); } catch (e) { $('aesOut').textContent = 'Ошибка'; } };
    window.aesDecrypt = async function () { try { const inp = $('aesIn').value.trim(), p = $('aesKey').value; if (!inp || !p) { $('aesOut').textContent = 'Введите текст и пароль'; return; } const bin = atob(inp); const bytes = Uint8Array.from(bin, c => c.charCodeAt(0)); const salt = bytes.slice(0, 16), iv = bytes.slice(16, 28), ct = bytes.slice(28); const enc = new TextEncoder(); const km = await crypto.subtle.importKey('raw', enc.encode(p), 'PBKDF2', false, ['deriveKey']); const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['decrypt']); const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct); $('aesOut').textContent = new TextDecoder().decode(pt); } catch (e) { $('aesOut').textContent = 'Ошибка (неверный пароль)'; } };
    window.genBasicAuth = function () { const u = $('basicUser').value, p = $('basicPass').value; if (!u || !p) { $('basicOut').textContent = 'Введите логин и пароль'; return; } $('basicOut').textContent = 'Authorization: Basic ' + btoa(u + ':' + p); };
    window.analyzePassword = function () {
        const p = $('pwaIn').value; if (!p) { $('pwaOut').textContent = '—'; return; }
        const lo = /[a-z]/.test(p), up = /[A-Z]/.test(p), di = /[0-9]/.test(p), sp = /[^A-Za-z0-9]/.test(p);
        let pool = 0; if (lo) pool += 26; if (up) pool += 26; if (di) pool += 10; if (sp) pool += 32;
        const ent = p.length * Math.log2(pool || 1);
        let v = '❌ Очень слабый'; if (ent >= 80) v = '✅ Очень надёжный'; else if (ent >= 60) v = '✅ Надёжный'; else if (ent >= 40) v = '⚠️ Средний'; else if (ent >= 28) v = '⚠️ Слабый';
        $('pwaOut').textContent = `Длина: ${p.length}\nСтрочные: ${lo?'да':'нет'}\nЗаглавные: ${up?'да':'нет'}\nЦифры: ${di?'да':'нет'}\nСпецсимволы: ${sp?'да':'нет'}\nЭнтропия: ${ent.toFixed(1)} бит\nОценка: ${v}`;
    };

    // РАЗРАБОТЧИК
    window.decodeJwt = function () { try { const p = $('jwtIn').value.trim().split('.'); if (p.length !== 3) throw 0; const d = s => JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/'))); $('jwtOut').textContent = 'Header:\n' + JSON.stringify(d(p[0]), null, 2) + '\n\nPayload:\n' + JSON.stringify(d(p[1]), null, 2); } catch (e) { $('jwtOut').textContent = 'Ошибка: неверный JWT'; } };
    window.testRegex = function () { try { const re = new RegExp($('regexPattern').value, $('regexFlags').value); const m = [...$('regexText').value.matchAll(re)]; $('regexOut').textContent = m.length ? m.map((x, i) => `#${i+1}: "${x[0]}" (позиция ${x.index})`).join('\n') : 'Совпадений нет'; } catch (e) { $('regexOut').textContent = 'Ошибка: ' + e.message; } };
    window.beautifyJs = function () { let code = $('jsIn').value, out = '', ind = 0; for (const ch of code) { if (ch === '{') out += ' {\n' + '  '.repeat(++ind); else if (ch === '}') out += '\n' + '  '.repeat(--ind) + '}'; else if (ch === ';') out += ';\n' + '  '.repeat(ind); else out += ch; } $('jsOut').textContent = out.replace(/\n\s*\n/g, '\n').trim(); };
    window.minifyJs = function () { let c = $('jsIn').value; c = c.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};:,=+\-*/<>!&|?])\s*/g, '$1'); $('jsOut').textContent = c.trim(); };
    window.convertData = function (type) { const inp = $('dataConv').value; if (!inp) { $('dataConvOut').textContent = '—'; return; } try { if (type === 'jsonToCsv') { const o = JSON.parse(inp); const a = Array.isArray(o) ? o : [o]; const h = Object.keys(a[0]); $('dataConvOut').textContent = [h.join(',')].concat(a.map(r => h.map(x => `"${String(r[x]).replace(/"/g, '""')}"`).join(','))).join('\n'); } else { const l = inp.trim().split('\n'); const h = l[0].split(','); $('dataConvOut').textContent = JSON.stringify(l.slice(1).map(x => { const v = x.split(','); const o = {}; h.forEach((k, i) => o[k.trim()] = (v[i]||'').trim().replace(/^"|"$/g, '')); return o; }), null, 2); } } catch (e) { $('dataConvOut').textContent = 'Ошибка'; } };
    window.fmtSql = function () { if (typeof sqlFormatter === 'undefined') { $('sqlOut').textContent = 'SQL formatter не загружен'; return; } try { $('sqlOut').textContent = sqlFormatter.format($('sqlIn').value, { language: 'sql' }); } catch (e) { $('sqlOut').textContent = 'Ошибка'; } };
    window.fmtXml = function () { try { const d = new DOMParser().parseFromString($('xmlIn').value, 'text/xml'); if (d.querySelector('parsererror')) { $('xmlOut').textContent = 'Ошибка XML'; return; } let s = new XMLSerializer().serializeToString(d), out = '', ind = 0; s = s.replace(/>\s*</g, '><').replace(/(<\/)/g, '\n$1').replace(/(<[^/!])/g, '\n$1'); s.split('\n').forEach(l => { if (!l.trim()) return; if (l.startsWith('</')) ind--; out += '  '.repeat(Math.max(0, ind)) + l + '\n'; if (l.startsWith('<') && !l.startsWith('</') && !l.endsWith('/>') && !l.includes('</')) ind++; }); $('xmlOut').textContent = out.trim(); } catch (e) { $('xmlOut').textContent = 'Ошибка'; } };
    window.yamlToJson = function () { if (typeof jsyaml === 'undefined') { $('yamlOut').textContent = 'YAML не загружен'; return; } try { $('yamlOut').textContent = JSON.stringify(jsyaml.load($('yamlIn').value), null, 2); } catch (e) { $('yamlOut').textContent = 'Ошибка'; } };
    window.jsonToYaml = function () { if (typeof jsyaml === 'undefined') { $('yamlOut').textContent = 'YAML не загружен'; return; } try { $('yamlOut').textContent = jsyaml.dump(JSON.parse($('yamlIn').value)); } catch (e) { $('yamlOut').textContent = 'Ошибка'; } };
    window.listToJson = function () { $('listOut').textContent = JSON.stringify($('listIn').value.split('\n').map(s => s.trim()).filter(Boolean), null, 2); };
    window.listToCsv = function () { $('listOut').textContent = $('listIn').value.split('\n').map(s => s.trim()).filter(Boolean).map(s => `"${s.replace(/"/g, '""')}"`).join('\n'); };
    window.listToLines = function () { const v = $('listIn').value.trim(); try { const a = JSON.parse(v); if (Array.isArray(a)) { $('listOut').textContent = a.join('\n'); return; } } catch (e) {} $('listOut').textContent = v.split(/[,\n]+/).map(s => s.trim()).filter(Boolean).join('\n'); };
    window.validateJson = function () { try { JSON.parse($('jsonValidateIn').value); $('jsonValidateOut').textContent = '✅ Валидный JSON'; } catch (e) { $('jsonValidateOut').textContent = '❌ Ошибка: ' + e.message; } };
    window.genUuid = function () { $('uuidOut').textContent = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); }); };
    window.hexToRgb = function () { let h = ($('hexRgbIn')?.value || $('colorHex')?.value || '').trim().replace('#', ''); if (!/^[0-9a-f]{3,6}$/i.test(h)) { if ($('hexRgbOut')) $('hexRgbOut').textContent = 'Ошибка: неверный HEX'; if ($('colorOut')) $('colorOut').textContent = 'Ошибка: неверный HEX'; return; } if (h.length === 3) h = h.split('').map(c => c + c).join(''); const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16); if ($('hexRgbOut')) { $('hexRgbOut').textContent = `rgb(${r}, ${g}, ${b})`; $('hexRgbPreview').style.background = `rgb(${r},${g},${b})`; } if ($('colorOut')) { $('colorOut').textContent = `rgb(${r}, ${g}, ${b})`; $('colorPreview').style.background = `rgb(${r},${g},${b})`; } };
    window.convertBase = function () { try { const v = $('baseConvertIn').value.trim(); const f = parseInt($('baseConvertFrom').value, 10), t = parseInt($('baseConvertTo').value, 10); $('baseConvertOut').textContent = parseInt(v, f).toString(t).toUpperCase(); } catch (e) { $('baseConvertOut').textContent = 'Ошибка'; } };
    window.parseUrl = function () { try { const u = new URL($('urlParseIn').value); $('urlParseOut').textContent = `Protocol: ${u.protocol}\nHost: ${u.host}\nPath: ${u.pathname}\nQuery: ${u.search}\nHash: ${u.hash}`; } catch (e) { $('urlParseOut').textContent = 'Ошибка: неверный URL'; } };
    window.parseQueryString = function () { const p = new URLSearchParams($('queryStringIn').value); const o = {}; p.forEach((v, k) => o[k] = v); $('queryStringOut').textContent = JSON.stringify(o, null, 2); };
    window.genCronDev = function () { $('cronDevOut').textContent = ['cronMinDev', 'cronHourDev', 'cronDayDev', 'cronMonthDev', 'cronDowDev'].map(id => $(id).value.trim() || '*').join(' '); };
    window.checkContrast = function () { const f = $('contrastFg').value, b = $('contrastBg').value; $('contrastOut').textContent = `Контраст: ${f} на ${b} — проверьте визуально`; };
    window.textToJson = function () { const lines = $('textToJsonIn').value.split('\n').filter(l => l.trim()); const o = {}; lines.forEach(l => { const [k, ...v] = l.split(':'); if (k) o[k.trim()] = v.join(':').trim(); }); $('textToJsonOut').textContent = JSON.stringify(o, null, 2); };
    window.genHtmlTable = function () { const rows = $('htmlTableIn').value.trim().split('\n').map(r => r.split(',')); $('htmlTableOut').textContent = '<table>\n' + rows.map(r => '  <tr>' + r.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>').join('\n') + '\n</table>'; };
    window.genBoxShadow = function () { $('boxShadowOut').textContent = `box-shadow: ${$('shadowX').value}px ${$('shadowY').value}px ${$('shadowBlur').value}px ${$('shadowColor').value};`; };
    window.genGradient = function () { $('gradientOut').textContent = `background: linear-gradient(${$('gradientDir').value}, ${$('gradientColor1').value}, ${$('gradientColor2').value});`; };

    // КОНВЕРТЕРЫ
    window.convertLength = function () { const f = { m: 1, km: 1000, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048, mi: 1609.34 }; $('unitLengthOut').textContent = (parseFloat($('unitLengthIn').value) * f[$('unitLengthFrom').value] / f[$('unitLengthTo').value]).toPrecision(6); };
    window.convertTemp = function () { let v = parseFloat($('tempIn').value); const fr = $('tempFrom').value, to = $('tempTo').value; if (fr === 'F') v = (v - 32) * 5 / 9; else if (fr === 'K') v = v - 273.15; if (to === 'F') v = v * 9 / 5 + 32; else if (to === 'K') v = v + 273.15; $('tempOut').textContent = v.toFixed(2); };
    window.tsToDate = function () { const n = parseInt($('tsIn').value, 10); $('tsOut').textContent = isNaN(n) ? 'Ошибка' : new Date(n * (String(n).length <= 10 ? 1000 : 1)).toISOString(); };
    window.dateToTs = function () { const d = new Date($('tsIn').value); $('tsOut').textContent = isNaN(d) ? 'Ошибка' : Math.floor(d.getTime() / 1000); };
    window.toRoman = function () { let n = parseInt($('romanIn').value, 10); if (!n || n < 1 || n > 3999) { $('romanOut').textContent = '1–3999'; return; } const map = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]; let r = ''; for (const [v, s] of map) while (n >= v) { r += s; n -= v; } $('romanOut').textContent = r; };
    window.fromRoman = function () { const s = $('romanIn').value.toUpperCase().trim(); const m = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 }; let res = 0; for (let i = 0; i < s.length; i++) res += m[s[i]] < m[s[i+1]] ? -m[s[i]] : m[s[i]]; $('romanOut').textContent = res || 'Ошибка'; };
    window.convertWeight = function () { const f = { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 }; $('weightOut').textContent = (parseFloat($('weightIn').value) * f[$('weightFrom').value] / f[$('weightTo').value]).toPrecision(6); };
    window.convertArea = function () { const f = { m2: 1, km2: 1e6, cm2: 0.0001, ha: 10000, acre: 4046.86 }; $('areaOut').textContent = (parseFloat($('areaIn').value) * f[$('areaFrom').value] / f[$('areaTo').value]).toPrecision(6); };
    window.convertVolume = function () { const f = { l: 1, ml: 0.001, m3: 1000, gal: 3.78541 }; $('volumeOut').textContent = (parseFloat($('volumeIn').value) * f[$('volumeFrom').value] / f[$('volumeTo').value]).toPrecision(6); };
    window.convertSpeed = function () { const f = { kmh: 1, ms: 3.6, mph: 1.60934 }; $('speedOut').textContent = (parseFloat($('speedIn').value) * f[$('speedFrom').value] / f[$('speedTo').value]).toPrecision(6); };
    window.convertTime = function () { const f = { s: 1, min: 60, h: 3600, d: 86400 }; $('timeOut').textContent = (parseFloat($('timeIn').value) * f[$('timeFrom').value] / f[$('timeTo').value]).toPrecision(6); };
    window.convertDataSize = function () { const f = { b: 1, kb: 1024, mb: 1048576, gb: 1073741824 }; $('dataOut').textContent = (parseFloat($('dataIn').value) * f[$('dataFrom').value] / f[$('dataTo').value]).toPrecision(6); };
    window.convertPressure = function () { const f = { pa: 1, kpa: 1000, bar: 100000, atm: 101325 }; $('pressureOut').textContent = (parseFloat($('pressureIn').value) * f[$('pressureFrom').value] / f[$('pressureTo').value]).toPrecision(6); };
    window.convertEnergy = function () { const f = { j: 1, kj: 1000, cal: 4.184, kcal: 4184 }; $('energyOut').textContent = (parseFloat($('energyIn').value) * f[$('energyFrom').value] / f[$('energyTo').value]).toPrecision(6); };
    window.convertPower = function () { const f = { w: 1, kw: 1000, hp: 735.5 }; $('powerOut').textContent = (parseFloat($('powerIn').value) * f[$('powerFrom').value] / f[$('powerTo').value]).toPrecision(6); };
    window.minutesToHours = function () { $('minHoursOut').textContent = (parseFloat($('minHoursIn').value) / 60).toFixed(2) + ' ч'; };
    window.hoursToMinutes = function () { $('minHoursOut').textContent = (parseFloat($('minHoursIn').value) * 60).toFixed(0) + ' мин'; };
    window.secondsToTime = function () { const s = parseInt($('secTimeIn').value, 10); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60; $('secTimeOut').textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; };
    window.timeToSeconds = function () { const p = $('secTimeIn').value.split(':'); $('secTimeOut').textContent = (parseInt(p[0], 10) * 3600 + parseInt(p[1] || 0, 10) * 60 + parseInt(p[2] || 0, 10)).toString(); };
    window.bytesToBits = function () { $('bytesBitsOut').textContent = (parseFloat($('bytesBitsIn').value) * 8).toString(); };
    window.bitsToBytes = function () { $('bytesBitsOut').textContent = (parseFloat($('bytesBitsIn').value) / 8).toString(); };
    window.decimalToPercent = function () { $('decPctOut').textContent = (parseFloat($('decPctIn').value) * 100).toFixed(2) + '%'; };
    window.percentToDecimal = function () { $('decPctOut').textContent = (parseFloat($('decPctIn').value) / 100).toFixed(4); };
    window.fractionToDecimal = function () { const p = $('fracDecIn').value.split('/'); $('fracDecOut').textContent = (parseFloat(p[0]) / parseFloat(p[1])).toFixed(4); };
    window.decimalToFraction = function () { const v = parseFloat($('fracDecIn').value); const prec = 10000; const gcd = (a, b) => b ? gcd(b, a % b) : a; const d = gcd(Math.round(v * prec), prec); $('fracDecOut').textContent = `${Math.round(v * prec) / d}/${prec / d}`; };

    // ВЕБ И СЕТЬ
    window.genQr = function () { const el = $('qrcode'); el.innerHTML = ''; const t = $('qrText').value.trim(); if (!t) return; new QRCode(el, { text: t, width: 180, height: 180 }); $('qrOut').textContent = t; };
    window.genWifiQr = function () { const el = $('wifiQr'); el.innerHTML = ''; const s = $('wifiSsid').value, p = $('wifiPass').value, e = $('wifiEnc').value; const str = `WIFI:T:${e};S:${s};P:${p};;`; new QRCode(el, { text: str, width: 180, height: 180 }); $('wifiQrOut').textContent = str; };
    window.lookupHttp = function () { const c = {200:'OK',201:'Created',204:'No Content',301:'Moved Permanently',302:'Found',400:'Bad Request',401:'Unauthorized',403:'Forbidden',404:'Not Found',429:'Too Many Requests',500:'Internal Server Error',502:'Bad Gateway',503:'Service Unavailable'}; const k = $('httpCode').value.trim(); $('httpOut').textContent = c[k] ? `${k} ${c[k]}` : 'Код не найден'; };
    window.escapeStr = function () { $('escapeOut').textContent = JSON.stringify($('escapeIn').value); };
    window.unescapeStr = function () { try { $('escapeOut').textContent = JSON.parse($('escapeIn').value); } catch (e) { $('escapeOut').textContent = 'Ошибка'; } };
    window.lookupMime = function () { const m = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf','.zip':'application/zip'}; const v = $('mimeIn').value.trim().toLowerCase(); $('mimeOut').textContent = m[v] || Object.entries(m).find(([,val]) => val === v)?.[0] || 'Не найдено'; };
    window.calcSubnet = function () { try { const [ip, mask] = $('ipCidr').value.trim().split('/'); const m = parseInt(mask, 10); const parts = ip.split('.').map(Number); const num = ((parts[0]<<24)|(parts[1]<<16)|(parts[2]<<8)|parts[3])>>>0; const sm = m === 0 ? 0 : (~0 << (32 - m)) >>> 0; const net = (num & sm) >>> 0; const bc = (net | ~sm) >>> 0; const toIp = n => [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.'); $('ipOut').textContent = `Network: ${toIp(net)}\nBroadcast: ${toIp(bc)}\nMask: ${toIp(sm)}\nHosts: ${m >= 31 ? 0 : Math.pow(2, 32 - m) - 2}`; } catch (e) { $('ipOut').textContent = 'Ошибка CIDR'; } };
    window.genCron = function () { $('cronOut').textContent = ['cronMin','cronHour','cronDay','cronMonth','cronDow'].map(id => $(id).value.trim() || '*').join(' '); };
    window.calcChmod = function () { const v = $('chmodIn').value.trim(); if (/^[0-7]{3}$/.test(v)) { const map = ['---','--x','-w-','-wx','r--','r-x','rw-','rwx']; $('chmodOut').textContent = [...v].map(d => map[Number(d)]).join(''); } else $('chmodOut').textContent = 'Введите 3 цифры (например, 755)'; };
    window.genRandomPort = function () { $('portOut').textContent = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024; };
    window.evalMath = function () { try { const expr = $('mathExpr').value.replace(/[^0-9+\-*/().%\s]/g, ''); $('mathOut').textContent = Function('"use strict";return (' + expr + ')')(); } catch (e) { $('mathOut').textContent = 'Ошибка'; } };
    window.genRandom = function () { const min = parseInt($('randMin').value, 10), max = parseInt($('randMax').value, 10); $('randOut').textContent = Math.floor(Math.random() * (max - min + 1)) + min; };

    // КАЛЬКУЛЯТОРЫ
    window.calcPercent = function () { $('percentOut').textContent = (parseFloat($('percentA').value) * parseFloat($('percentB').value) / 100).toFixed(2); };
    window.calcLoan = function () { const P = parseFloat($('loanAmount').value), r = parseFloat($('loanRate').value) / 100 / 12, n = parseInt($('loanTerm').value, 10); if (!P || !r || !n) { $('loanOut').textContent = 'Заполните все поля'; return; } const pay = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1); $('loanOut').textContent = `Ежемесячный платёж: ${pay.toFixed(2)}\nОбщая выплата: ${(pay * n).toFixed(2)}`; };
    window.calcBmi = function () { const w = parseFloat($('bmiWeight').value), h = parseFloat($('bmiHeight').value) / 100; if (!w || !h) { $('bmiOut').textContent = 'Введите вес и рост'; return; } const bmi = w / (h * h); let cat = 'Норма'; if (bmi < 18.5) cat = 'Недостаточный вес'; else if (bmi < 25) cat = 'Норма'; else if (bmi < 30) cat = 'Избыточный вес'; else cat = 'Ожирение'; $('bmiOut').textContent = `BMI: ${bmi.toFixed(1)} (${cat})`; };
    window.calcAge = function () { const b = new Date($('ageBirth').value), n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--; $('ageOut').textContent = `Возраст: ${a} лет`; };
    window.calcArea = function () { $('areaCalcOut').textContent = (parseFloat($('areaCalcW').value) * parseFloat($('areaCalcH').value)).toFixed(2); };
    window.calcVolume = function () { $('volCalcOut').textContent = (parseFloat($('volCalcL').value) * parseFloat($('volCalcW').value) * parseFloat($('volCalcH').value)).toFixed(2); };
    window.calcAverage = function () { const a = $('avgIn').value.split(',').map(Number); $('avgOut').textContent = (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2); };
    window.calcSum = function () { $('sumOut').textContent = $('sumIn').value.split(',').map(Number).reduce((x, y) => x + y, 0).toFixed(2); };
    window.calcRatio = function () { const A = parseFloat($('ratioA').value), B = parseFloat($('ratioB').value), C = parseFloat($('ratioC').value); $('ratioOut').textContent = 'D = ' + (B * C / A).toFixed(4); };
    window.calcFraction = function () { const a = parseInt($('fracA').value), b = parseInt($('fracB').value), c = parseInt($('fracC').value), d = parseInt($('fracD').value); $('fracOut').textContent = `${a * d + c * b}/${b * d} (можно сократить)`; };
    window.calcGcdLcm = function () { const a = parseInt($('gcdA').value), b = parseInt($('gcdB').value); const gcd = (x, y) => y ? gcd(y, x % y) : x; const g = gcd(a, b); $('gcdOut').textContent = `НОД: ${g}\nНОК: ${a * b / g}`; };
    window.calcPower = function () { $('powerOut').textContent = Math.pow(parseFloat($('powerBase').value), parseFloat($('powerExp').value)).toFixed(4); };
    window.calcRoot = function () { $('powerOut').textContent = Math.pow(parseFloat($('powerBase').value), 1 / parseFloat($('powerExp').value)).toFixed(4); };
    window.calcTip = function () { const b = parseFloat($('tipBill').value), p = parseFloat($('tipPercent').value); $('tipOut').textContent = `Чаевые: ${(b * p / 100).toFixed(2)}\nИтого: ${(b + b * p / 100).toFixed(2)}`; };
    window.calcSplit = function () { const t = parseFloat($('splitTotal').value), n = parseInt($('splitPeople').value, 10); $('splitOut').textContent = 'Каждый платит: ' + (t / n).toFixed(2); };
    window.calcCompound = function () { const P = parseFloat($('compoundPrincipal').value), r = parseFloat($('compoundRate').value) / 100, n = parseFloat($('compoundYears').value); $('compoundOut').textContent = 'Итог: ' + (P * Math.pow(1 + r, n)).toFixed(2); };
    window.calcSimpleInterest = function () { const P = parseFloat($('simplePrincipal').value), r = parseFloat($('simpleRate').value) / 100, n = parseFloat($('simpleYears').value); $('simpleInterestOut').textContent = 'Проценты: ' + (P * r * n).toFixed(2) + '\nИтог: ' + (P + P * r * n).toFixed(2); };

    // SEO
    window.genMeta = function () { $('metaOut').textContent = `<title>${$('metaTitle').value}</title>\n<meta name="description" content="${$('metaDescription').value}">`; };
    window.genRobots = function () { $('robotsOut').textContent = $('robotsIn').value; };
    window.genSitemap = function () { const urls = $('sitemapIn').value.split('\n').filter(u => u.trim()); $('sitemapOut').textContent = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(u => `  <url><loc>${u.trim()}</loc></url>`).join('\n') + '\n</urlset>'; };
    window.genSeoSlug = function () { $('seoSlugOut').textContent = $('seoSlugIn').value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); };
    window.countTitle = function () { const l = $('titleCounterIn').value.length; $('titleCounterOut').textContent = `Длина: ${l} символов (рекомендуется 50-60)`; };
    window.countDescription = function () { const l = $('descCounterIn').value.length; $('descCounterOut').textContent = `Длина: ${l} символов (рекомендуется 150-160)`; };
    window.calcKeywordDensity = function () { const t = $('keywordDensityIn').value.toLowerCase(); const w = t.match(/\S+/g) || []; const m = {}; w.forEach(x => m[x] = (m[x] || 0) + 1); $('keywordDensityOut').textContent = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `${k}: ${(v / w.length * 100).toFixed(2)}%`).join('\n'); };
    window.genCanonical = function () { $('canonicalOut').textContent = `<link rel="canonical" href="${$('canonicalIn').value}">`; };
    window.genSchema = function () { $('schemaOut').textContent = `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "${$('schemaType').value}"\n}\n<\/script>`; };
    window.genOpenGraph = function () { $('ogOut').textContent = `<meta property="og:title" content="${$('ogTitle').value}">\n<meta property="og:description" content="${$('ogDesc').value}">\n<meta property="og:url" content="${$('ogUrl').value}">`; };
    window.genTwitterCard = function () { $('twitterOut').textContent = `<meta name="twitter:title" content="${$('twitterTitle').value}">\n<meta name="twitter:description" content="${$('twitterDesc').value}">`; };
    window.genHreflang = function () { $('hreflangOut').textContent = `<link rel="alternate" hreflang="x-default" href="${$('hreflangUrl').value}">`; };
    window.checkUrl = function () { $('urlCheckOut').textContent = 'Проверьте URL вручную: ' + $('urlCheckIn').value; };

    // ФИНАНСЫ
    window.usdToUzs = function () { const a = parseFloat($('usdAmount').value), r = parseFloat($('usdRate').value); $('usdUzsOut').textContent = (a * r).toFixed(2) + ' UZS'; };
    window.calcRoi = function () { const i = parseFloat($('roiInvest').value), r = parseFloat($('roiReturn').value); $('roiOut').textContent = 'ROI: ' + ((r - i) / i * 100).toFixed(2) + '%'; };
    window.calcProfit = function () { const r = parseFloat($('profitRevenue').value), c = parseFloat($('profitCost').value); $('profitOut').textContent = `Прибыль: ${(r - c).toFixed(2)}\nМаржа: ${((r - c) / r * 100).toFixed(2)}%`; };
    window.calcCommission = function () { const p = parseFloat($('commPrice').value), c = parseFloat($('commPercent').value); $('commOut').textContent = `Комиссия: ${(p * c / 100).toFixed(2)}\nК получению: ${(p - p * c / 100).toFixed(2)}`; };
    window.calcInstallment = function () { const t = parseFloat($('installmentTotal').value), m = parseInt($('installmentMonths').value, 10); $('installmentOut').textContent = 'Ежемесячно: ' + (t / m).toFixed(2); };
    window.calcBudget = function () { const i = parseFloat($('budgetIncome').value), e = parseFloat($('budgetExpenses').value); $('budgetOut').textContent = `Остаток: ${(i - e).toFixed(2)}\nНакопления: ${((i - e) / i * 100).toFixed(1)}%`; };

    // ДАТА И ВРЕМЯ
    window.calcDateDiff = function () { const s = new Date($('dateCalcStart').value), e = new Date($('dateCalcEnd').value); const d = Math.round((e - s) / 86400000); $('dateCalcOut').textContent = `Разница: ${d} дней`; };
    window.startTimer = function () { let s = parseInt($('timerSeconds').value, 10); if (isNaN(s) || s <= 0) { $('timerOut').textContent = 'Введите секунды'; return; } const iv = setInterval(() => { s--; $('timerOut').textContent = `Осталось: ${s} с`; if (s <= 0) { clearInterval(iv); $('timerOut').textContent = 'Время вышло!'; } }, 1000); };
    let swInterval = null, swSeconds = 0;
    window.startStopwatch = function () { if (swInterval) { clearInterval(swInterval); swInterval = null; } else { swInterval = setInterval(() => { swSeconds++; const h = Math.floor(swSeconds / 3600), m = Math.floor((swSeconds % 3600) / 60), s = swSeconds % 60; $('stopwatchOut').textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }, 1000); } };
    window.showWorldClock = function () { const now = new Date(); $('worldClockOut').textContent = `UTC: ${now.toISOString().slice(11, 19)}\nЛокальное: ${now.toLocaleTimeString()}`; };
    window.getWeekNumber = function () { const d = new Date($('weekNumDate').value); const start = new Date(d.getFullYear(), 0, 1); const w = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7); $('weekNumOut').textContent = `Неделя: ${w}`; };
    window.getDayOfWeek = function () { const d = new Date($('dayOfWeekDate').value); $('dayOfWeekOut').textContent = d.toLocaleDateString('ru-RU', { weekday: 'long' }); };
    window.showUnixNow = function () { $('unixNowOut').textContent = Math.floor(Date.now() / 1000); };
    window.calcDetailedAge = function () { const b = new Date($('detailAgeBirth').value), n = new Date(); let y = n.getFullYear() - b.getFullYear(); let m = n.getMonth() - b.getMonth(); let d = n.getDate() - b.getDate(); if (d < 0) { m--; d += 30; } if (m < 0) { y--; m += 12; } $('detailAgeOut').textContent = `${y} лет, ${m} мес., ${d} дн.`; };

    // СЖАТИЕ / PDF / ИЗОБРАЖЕНИЯ
    window.createZip = async function () { const f = $('zipFiles').files; if (!f.length) { $('zipOut').textContent = 'Выберите файлы'; return; } if (typeof JSZip === 'undefined') { $('zipOut').textContent = 'JSZip не загружен'; return; } const z = new JSZip(); for (let x of f) z.file(x.name, await x.arrayBuffer()); const b = await z.generateAsync({ type: 'blob' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'archive.zip'; a.click(); $('zipOut').textContent = 'ZIP создан'; };
    window.unzipFile = async function () { const f = $('unzipFile').files[0]; if (!f) { $('unzipOut').textContent = 'Выберите ZIP'; return; } if (typeof JSZip === 'undefined') { $('unzipOut').textContent = 'JSZip не загружен'; return; } const z = await JSZip.loadAsync(f); $('unzipOut').textContent = Object.keys(z.files).join('\n'); };
    window.imagesToPdf = async function () { const f = $('pdfImages').files; if (!f.length) { $('pdfOut').textContent = 'Выберите изображения'; return; } if (typeof PDFLib === 'undefined') { $('pdfOut').textContent = 'PDF-lib не загружен'; return; } const { PDFDocument } = PDFLib; const doc = await PDFDocument.create(); for (let x of f) { const b = await x.arrayBuffer(); const i = x.type === 'image/png' ? await doc.embedPng(b) : await doc.embedJpg(b); const p = doc.addPage([i.width, i.height]); p.drawImage(i, { x: 0, y: 0, width: i.width, height: i.height }); } const bytes = await doc.save(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })); a.download = 'images.pdf'; a.click(); $('pdfOut').textContent = 'PDF создан'; };
    window.mergePdfs = async function () { const f = $('mergePdfs').files; if (f.length < 2) { $('mergeOut').textContent = 'Выберите минимум 2 PDF'; return; } if (typeof PDFLib === 'undefined') { $('mergeOut').textContent = 'PDF-lib не загружен'; return; } const { PDFDocument } = PDFLib; const m = await PDFDocument.create(); for (let x of f) { const d = await PDFDocument.load(await x.arrayBuffer()); (await m.copyPages(d, d.getPageIndices())).forEach(p => m.addPage(p)); } const bytes = await m.save(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })); a.download = 'merged.pdf'; a.click(); $('mergeOut').textContent = 'PDF объединён'; };
    window.convertImage = function () { const f = $('imgConvertFile').files[0]; if (!f) { $('imgConvertOut').textContent = 'Выберите изображение'; return; } const fmt = $('imgFormat').value; const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'converted.' + fmt.split('/')[1]; a.click(); $('imgConvertOut').textContent = 'Готово'; }, fmt); }; img.src = URL.createObjectURL(f); };
    window.compressImage = function () { const f = $('imgCompressFile').files[0]; if (!f) { $('imgCompressOut').textContent = 'Выберите изображение'; return; } const q = parseFloat($('imgQuality').value); const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'compressed.jpg'; a.click(); $('imgCompressOut').textContent = 'Сжато'; }, 'image/jpeg', q); }; img.src = URL.createObjectURL(f); };
    const imgQualityEl = $('imgQuality'); if (imgQualityEl) imgQualityEl.addEventListener('input', () => { $('qualityLabel').textContent = imgQualityEl.value; });

    // ==================== РЕКЛАМА ====================
    window.closeStickyAd = function () {
        const el = $('adStickyWrap');
        if (el) el.classList.add('closed');
        document.body.style.paddingBottom = '20px';
        try { sessionStorage.setItem('adStickyClosed', '1'); } catch (e) {}
    };

    const adSlots = [
        { id: 'R-A-20456192-1', container: 'yandex_rtb_R-A-20456192-1', wrap: 'adStickyWrap', active: true },
        { id: 'R-A-20456192-2', container: 'yandex_rtb_R-A-20456192-2', wrap: 'adInlineWrap', active: true },
        { id: 'R-A-20456192-3', container: 'yandex_rtb_R-A-20456192-3', wrap: 'adLeftWrap',   active: window.innerWidth > 820 },
        { id: 'R-A-20456192-4', container: 'yandex_rtb_R-A-20456192-4', wrap: 'adRightWrap',  active: window.innerWidth >= 1280 }
    ];

    try {
        if (sessionStorage.getItem('adStickyClosed') === '1') {
            const st = $('adStickyWrap');
            if (st) st.classList.add('closed');
            document.body.style.paddingBottom = '20px';
            adSlots[0].active = false;
        }
    } catch (e) {}

    adSlots.forEach((slot, index) => {
        if (!slot.active) return;
        setTimeout(() => {
            window.yaContextCb.push(() => {
                if (window.Ya && Ya.Context && Ya.Context.AdvManager) {
                    Ya.Context.AdvManager.render({
                        blockId: slot.id,
                        renderTo: slot.container,
                        onError: () => {
                            const w = $(slot.wrap);
                            if (w) w.classList.add('ad-error');
                        }
                    });
                }
            });
        }, index * 350);
    });

    try { if (typeof genPw === 'function') genPw(); } catch (e) {}
})();

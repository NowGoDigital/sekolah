/* cms-public.js — menyuntikkan konten CMS (dashboard) ke halaman publik */
(function () {
    const get = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };

    /* 1) Pengaturan situs → topbar index.html */
    const site = get('siteSettings');
    if (site) {
        const tb = document.getElementById('topbar');
        if (tb && site.topbarVisible === false) tb.classList.add('max-h-0', 'opacity-0', 'border-b-0');
        const msg = document.getElementById('topbarMsg');
        if (msg && site.topbarText) msg.textContent = site.topbarText;
        const cta = document.getElementById('topbarCta');
        if (cta && site.waClaim) cta.href = site.waClaim;
    }

    /* 2) Berita CMS → berita.html */
    const news = get('newsData') || [];
    const mn = document.getElementById('cmsNewsMount');
    if (mn) news.slice().reverse().forEach(n => mn.insertAdjacentHTML('beforeend', `
        <article class="news-item group bg-slate-800/50 border border-gold-400/20 hover:border-gold-400/40 rounded-2xl overflow-hidden transition duration-300 hover:-translate-y-2" data-cat="${n.cat || 'kegiatan'}">
            <div class="relative h-48 bg-emerald-900/40 flex items-center justify-center">
                <i class="fas fa-newspaper text-4xl text-white/10"></i>
                <span class="absolute top-3 left-3 bg-gold-400 text-slate-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">${n.cat || 'Berita'}</span>
            </div>
            <div class="p-6">
                <p class="text-xs text-gray-500 mb-2"><i class="far fa-calendar mr-1"></i> ${n.date}</p>
                <h3 class="font-serif text-lg font-bold text-white mb-3 group-hover:text-gold-400 transition leading-snug">${n.title}</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">${(n.content || '').slice(0, 130)}${(n.content || '').length > 130 ? '…' : ''}</p>
                <span class="text-sm font-bold text-gold-400"><i class="fas fa-bullhorn mr-1"></i> Rilis Resmi Pesantren</span>
            </div>
        </article>`));

    /* 3) Agenda CMS → agenda.html */
    const agenda = get('agendaData') || [];
    const ma = document.getElementById('cmsAgendaMount');
    if (ma) agenda.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach(a => ma.insertAdjacentHTML('beforeend', `
        <div class="group flex flex-col sm:flex-row gap-5 bg-slate-800/50 border border-gold-400/20 hover:border-gold-400/40 rounded-2xl p-6 transition hover:-translate-y-1">
            <div class="flex sm:flex-col items-center justify-center sm:w-24 shrink-0 bg-gradient-to-br from-gold-400 to-gold-500 rounded-xl py-3 px-5 sm:px-0 text-slate-900">
                <span class="font-serif text-3xl font-bold leading-none">${a.date.slice(8, 10)}</span>
                <span class="text-[10px] font-bold uppercase tracking-widest ml-2 sm:ml-0">${new Date(a.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
            </div>
            <div class="flex-1">
                <div class="flex flex-wrap items-center gap-3 mb-1">
                    <h4 class="font-serif text-lg font-bold text-white group-hover:text-gold-400 transition">${a.title}</h4>
                    <span class="text-[10px] bg-emerald-900/60 border border-emerald-700 text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-widest">${a.category}</span>
                    <span class="text-[10px] bg-gold-400/10 border border-gold-400/40 text-gold-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Terbaru</span>
                </div>
                <p class="text-xs text-gray-500"><i class="far fa-clock text-gold-400 mr-1"></i> ${a.time || '-'} <span class="mx-2">•</span> <i class="fas fa-location-dot text-gold-400 mr-1"></i> ${a.location || '-'}</p>
            </div>
        </div>`));

    /* 4) Galeri CMS → galeri.html (grid #galleryGrid sudah ada) */
    const gal = get('galeriData') || [];
    const gg = document.getElementById('galleryGrid');
    if (gg) gal.forEach(g => gg.insertAdjacentHTML('beforeend', `
        <figure class="gallery-item group relative overflow-hidden rounded-xl cursor-pointer bg-emerald-900/40 flex items-center justify-center" data-cat="${g.category}" data-caption="${g.caption}" onclick="openLightbox(this)">
            <img src="${g.img}" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="${g.caption}">
            <figcaption class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                <p class="text-white text-sm font-semibold">${g.caption}</p>
                <p class="text-gold-400 text-[10px] uppercase tracking-widest">${g.category}</p>
            </figcaption>
            <span class="absolute top-3 right-3 w-8 h-8 rounded-full bg-gold-400/90 text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><i class="fas fa-magnifying-glass-plus text-xs"></i></span>
        </figure>`));

    /* 5) Prestasi CMS → prestasi.html */
    const pr = get('prestasiData') || [];
    const mp = document.getElementById('cmsPrestasiMount');
    if (mp) pr.forEach(p => mp.insertAdjacentHTML('beforeend', `
        <div class="group bg-slate-800/40 border border-gold-400/20 hover:border-gold-400/30 rounded-2xl p-6 transition hover:-translate-y-1">
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-yellow-900/30 border border-yellow-600/30 flex items-center justify-center shrink-0">
                    <i class="fas fa-medal text-yellow-400 text-xl"></i>
                </div>
                <div>
                    <h4 class="font-serif font-bold text-white mb-1 group-hover:text-gold-400 transition">${p.title}</h4>
                    <p class="text-xs text-gray-500 mb-2">${p.medal} • ${p.level} • ${p.year}</p>
                    <p class="text-sm text-gray-400 leading-relaxed">${p.desc || ''}</p>
                </div>
            </div>
        </div>`));

    /* 6) Profil CMS → profil.html (jika id tersedia) */
    const prof = get('profilData');
    if (prof) {
        [['cmsVisi', prof.visi], ['cmsSambutan', prof.sambutan], ['cmsSejarah', prof.sejarah]].forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el && val) el.textContent = val;
        });
    }
})();

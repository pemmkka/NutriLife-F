document.addEventListener('DOMContentLoaded', () => {
        // Pastikan kode ini berada di dalam document.addEventListener('DOMContentLoaded', ...)

    const modal = document.getElementById('nutritionModal');
    const closeBtn = document.querySelector('.close-modal');

    // Fungsi Tutup dengan Animasi Zoom Out
    function closeModal() {
        console.log("Menutup modal..."); // Untuk cek di console browser
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400); // Harus sama dengan durasi transisi di CSS
    }

    // 1. Klik tombol X
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation(); // Mencegah event bubbling
            closeModal();
        };
    }

    // 2. Klik di area hitam (luar modal) untuk menutup
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    // 3. Tambahkan fungsi tekan tombol 'Esc' di keyboard untuk menutup
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal.style.display === 'flex') {
            closeModal();
        }
    });

    const searchInput = document.getElementById('fullSearchInput');
    const resultsGrid = document.getElementById('fullResultsGrid');
    const resultsCount = document.getElementById('resultsCount');
    let allData = [];

    // Ambil data dari JSON
    fetch('rekomendasi_pemenuhan_nutrisi.json')
        .then(res => res.json())
        .then(data => {
            allData = data;
        });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            resultsGrid.innerHTML = '';
            resultsCount.innerText = 'Ketik minimal 2 karakter...';
            return;
        }

        const filtered = allData.filter(item => {
            return (
                item.name.toLowerCase().includes(query) ||
                (item.healing && item.healing.toLowerCase().includes(query)) ||
                (item.type && item.type.toLowerCase().includes(query))
            );
        });

        renderResults(filtered);
    });

    function renderResults(data) {
        resultsGrid.innerHTML = '';
        resultsCount.innerText = `Ditemukan ${data.length} hasil`;

        if (data.length === 0) {
            resultsGrid.innerHTML = '<p style="text-align:center; padding: 50px; opacity: 0.5;">Data tidak ditemukan 😕</p>';
            return;
        }

        data.forEach(item => {
            const icon = getIcon(item.type || item.jenis);
            const card = document.createElement('div');
            card.className = 'search-card';
            card.innerHTML = `
                <div class="search-card-content">
                    <div class="search-card-icon">${icon}</div>
                    <div>
                        <span class="search-card-title">${item.name}</span>
                        <span class="search-card-desc">${item.jenis} • ${item.type || 'Umum'}</span>
                    </div>
                </div>
                <span style="opacity: 0.3;">➡️</span>
            `;

            card.onclick = () => {
                // Jika bahan makanan, arahkan ke nutrisi.html dengan parameter nama
                const targetPage = item.jenis.includes("bahan") ? "nutrisi.html" : "makanan.html";
                window.location.href = `${targetPage}?target=${encodeURIComponent(item.name)}`;
            };

            resultsGrid.appendChild(card);
        });
    }

    function getIcon(type) {
        const icons = {
            'Protein': '🍗', 'Karbohidrat': '🍞', 'Lemak': '🥑', 
            'Mineral': '💎', 'Vitamin': '💊', 'Air': '💧', 'bahan makanan': '🌿'
        };
        return icons[type] || '🍲';
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('fullSearchInput');
    const resultsGrid = document.getElementById('fullResultsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const modal = document.getElementById('nutritionModal');
    let allData = [];

    // 1. Muat Data
    fetch('rekomendasi_pemenuhan_nutrisi.json')
        .then(res => res.json())
        .then(data => { allData = data; });

    // 2. Input Event
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            resultsGrid.innerHTML = '';
            resultsCount.innerText = 'Ketik minimal 2 karakter...';
            return;
        }

        const filtered = allData.filter(item => 
            item.name.toLowerCase().includes(query) || 
            (item.healing && item.healing.toLowerCase().includes(query))
        );

        renderResults(filtered);
    });

    function renderResults(data) {
        resultsGrid.innerHTML = '';
        resultsCount.innerText = `Ditemukan ${data.length} hasil`;

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'search-card';
            card.innerHTML = `
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="font-size:1.5rem;">🔍</div>
                    <div>
                        <b class="search-card-title">${item.name}</b>
                        <p style="font-size:0.7rem; opacity:0.6;">${item.jenis}</p>
                    </div>
                </div>
                <span>➡️</span>
            `;
            card.onclick = () => openModal(item);
            resultsGrid.appendChild(card);
        });
    }

    // 3. Modal Logic
    function openModal(item) {
        // Set Gambar & Fallback jika gambar kosong
        const imgElement = document.getElementById('m-img');
        imgElement.src = item.image || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400';
        
        // Set Nama Makanan & Jenis
        document.getElementById('m-title').innerText = item.name;
        document.getElementById('m-badge').innerText = item.jenis || item.type;
        
        // Set Nutrisi (seperti sebelumnya)
        document.getElementById('m-mineral').innerText = item.nutrition.mineral;
        document.getElementById('m-protein').innerText = item.nutrition.protein;
        document.getElementById('m-karbo').innerText = item.nutrition.karbo;
        document.getElementById('m-lemak').innerText = item.nutrition.lemak;
        document.getElementById('m-vitamin').innerText = item.nutrition.vitamin;
        document.getElementById('m-air').innerText = item.nutrition.air;
        
        document.getElementById('m-summary').innerText = item.healing;
        document.getElementById('m-menu').innerText = item.menu_rekomendasi || "-";

        // Tampilkan Modal dengan Animasi Zoom In
        const modal = document.getElementById('nutritionModal');
        modal.style.display = 'flex';
        
        // Reset Scroll Modal ke atas
        document.querySelector('.modal-content').scrollTop = 0;
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
});
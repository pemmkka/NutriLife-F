const foodSelect = document.getElementById('foodSelect');
const previewImg = document.getElementById('preview-img');
const placeholder = document.getElementById('preview-placeholder');
const resultSection = document.getElementById('nutrition-result-section');

/**
 * Inisialisasi picker makanan yang menggantikan fungsi kamera.
 * Mengambil data dari JSON dan memfilter kategori "bahan makanan".
 */
async function initFoodPicker() {
    try {
        const res = await fetch('rekomendasi_pemenuhan_nutrisi.json');
        if (!res.ok) throw new Error("Gagal mengambil data dari rekomendasi_pemenuhan_nutrisi.json");

        const data = await res.json();

        // Filter hanya untuk item yang berjenis "bahan makanan"
        const bahanMakanan = data.filter(item => 
            item.jenis && item.jenis.trim().toLowerCase() === "bahan makanan"
        );

        const foodSelect = document.getElementById('foodSelect');
        if (foodSelect && bahanMakanan.length > 0) {
            // Bersihkan dropdown dan tambahkan opsi default
            foodSelect.innerHTML = '<option value="" disabled selected>🥗 Foto Bahan Makanan.....</option>';

            bahanMakanan.forEach(item => {
                const option = document.createElement('option');
                option.value = item.name;
                option.textContent = item.name;
                foodSelect.appendChild(option);
            });

            // Event listener saat pengguna memilih bahan makanan
            foodSelect.addEventListener('change', (e) => {
                const selectedName = e.target.value;
                const selectedItem = bahanMakanan.find(item => item.name === selectedName);

                if (selectedItem) {
                    updateNutritionUI(selectedItem);
                }
            });
        }
    } catch (error) {
        console.error("Error loading nutrition data:", error);
    }
}

/**
 * Memperbarui UI dengan data bahan makanan yang dipilih
 */
function updateNutritionUI(item) {
    // Update gambar pratinjau
    if (previewImg) {
        previewImg.src = item.image || 'https://via.placeholder.com/500';
        previewImg.classList.remove('hidden-section');
        if (placeholder) placeholder.classList.add('hidden-section');
    }

    // Menghapus tampilan dinamis dan scroll ke bagian hasil nutrisi.
    // Data akan langsung mengisi elemen-elemen yang sudah ada.
    // Pastikan 'nutrition-result-section' tidak memiliki kelas 'hidden-section' di HTML.

    displayNutritionResult(item);
}

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = text || "-";
    }
}


function displayNutritionResult(item) {
    // 1. Isi data teks (seperti sebelumnya)
    safeSetText('food-name', item.name);
    safeSetText('res-mineral', item.nutrition.mineral);
    safeSetText('res-protein', item.nutrition.protein);
    safeSetText('res-karbo', item.nutrition.karbo);
    safeSetText('res-lemak', item.nutrition.lemak);
    safeSetText('res-vitamin', item.nutrition.vitamin);
    safeSetText('res-air', item.nutrition.air);
    safeSetText('res-summary-text', item.healing);
    safeSetText('res-risk', item.risiko);
    safeSetText('res-menu', item.menu_rekomendasi);

    // 2. Tambahkan class 'active' ke semua bingkai agar warnanya berubah
    const nutriItems = document.querySelectorAll('.nutri-item');
    nutriItems.forEach(box => {
        box.classList.add('active');
        
        // Opsional: Tambahkan sedikit animasi pop-up
        box.style.animation = 'none';
        box.offsetHeight; // trigger reflow
        box.style.animation = 'popIn 0.3s ease-out forwards';
    });
    // Isi ringkasan/healing
    safeSetText('res-summary-text', item.healing || "Bermanfaat bagi kesehatan tubuh.");
    
    // Isi resiko/peringatan
    safeSetText('res-risk', item.risiko || "Tidak ada risiko khusus.");

    // Isi rekomendasi menu
    safeSetText('res-menu', item.menu_rekomendasi || "-");

    // Tambahan: Memberikan class 'active' agar bingkai lebih terlihat menyala saat ada data
    document.querySelectorAll('.nutri-item').forEach(el => {
        const val = el.querySelector('.value').innerText;
        if (val !== "-") {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

initFoodPicker();


// Di dalam nutrisi.js, tambahkan logika untuk membaca parameter URL
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetFood = urlParams.get('target');

    if (targetFood) {
        // Tunggu dropdown terisi data, lalu pilih otomatis
        setTimeout(() => {
            const select = document.getElementById('foodSelect');
            if (select) {
                select.value = targetFood;
                // Picu event change secara manual
                select.dispatchEvent(new Event('change'));
            }
        }, 500);
    }
});

const dataVila = [
    {
        id: "v1",
        nama: "Vila Permai 1 (Tipe Anggrek)",
        tipe: "2 Kamar Tidur",
        lokasi: "Cisarua, Puncak",
        harga: 800000,
        fasilitas: ["Kolam Renang", "Wifi", "Dapur", "TV", "Karaoke"],
        tersedia: true
    },
    {
        id: "v2",
        nama: "Vila Permai 2 (Tipe Tulip)",
        tipe: "3 Kamar Tidur",
        lokasi: "Megamendung, Puncak",
        harga: 1200000,
        fasilitas: ["Kolam Renang", "Karaoke", "Dapur", "BBQ","Biliard"],
        tersedia: true
    },
    {
      id: "v3",
        nama: "Vila Permai 3 (Tipe Lily)",
        tipe: "2 Kamar Tidur",
        lokasi: "Cisarua, Puncak",
        harga: 2000000,
        fasilitas: ["Private Pool", "View Gunung", "Lapangan Basket", "Dapur", "Kolam Renang Anak dan Dewasa"],
        tersedia: true
    },
];
const villaContainer = document.getElementById("villa-container");
const villaSelect = document.getElementById("villa-select");
const searchInput = document.getElementById("villa-search");
const bookingForm = document.getElementById("booking-form");
const inputNama = document.getElementById("nama");
const inputCheckIn = document.getElementById("check-in");
const inputCheckOut = document.getElementById("villa-out");
const inputJumlahTamu = document.getElementById("jumlah-tamu");
const btnCek = document.getElementById("btn-cek");
const errorMessage = document.getElementById("error-message");
const summaryCard = document.getElementById("summary-card");
const summaryMalam = document.getElementById("summary-malam");
const summaryHarga = document.getElementById("summary-harga");
const summaryTotal = document.getElementById("summary-total");
const bookingResult = document.getElementById("booking-result");

function renderVila(daftarVila) {
    if (!villaContainer) return;

    villaContainer.innerHTML ="";

    if(daftarVila.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent =" Vila yang di cari tidak ditemukan.";
        emptyMsg.style.padding="1rem";
        villaContainer.appendChild(emptyMsg);
        return;
    }
    daftarVila.forEach(vila=> {
        const article = document.createElement("article");
        article.className = "villa-card";

        const h3 = document.createElement("h3");
        h3.className = "villa-card__title";
        h3.textContent = vila.nama;
        
        const spanStatus = document.createElement("span");
        spanStatus.className = "villa-card__badge villa-card__badge--available";
        spanStatus.textContent= vila.tersedia ? "Tersedia" : "Penuh";

        const pHarga = document.createElement("p");
        pHarga.className = "villa-card__price";
        pHarga.textContent = `Rp ${vila.harga.toLocaleString("id-ID")} / malam`;
        
        const pLokasi = document.createElement("p");
        pLokasi.className = "villa-card__details";
        pLokasi.textContent = `Lokasi: ${vila.lokasi} (${vila.tipe})`;

        const pFasilitas = document.createElement("p");
        pFasilitas.className = "villa-card__facilities";
        pFasilitas.textContent = `Fasilitas: ${vila.fasilitas.join(", ")}`;

        article.appendChild(h3);
        article.appendChild(spanStatus);
        article.appendChild(pHarga);
        article.appendChild(pLokasi);
        article.appendChild(pFasilitas);

        villaContainer.appendChild(article);
    });
}

function populateSelect() {
    if (!villaSelect) return;

        villaSelect.innerHTML = '<option value="">-- Pilih Vila --</option>';
        dataVila.forEach(vila => {
            const option=document.createElement("option");
            option.value = vila.id;
            option.textContent = `${vila.nama}  Rp ${vila.harga.toLocaleString("id-ID")}/malam`;
            villaSelect.appendChild(option);
        });
    
}

function validasiForm() {
    const nama = inputNama ? inputNama.value.trim() : "";
    const selectedVila = villaSelect ? villaSelect.value : "";
    const checkInStr = inputCheckIn ? inputCheckIn.value : "";
    const checkOutStr = inputCheckOut ? inputCheckOut.value : "";
    const jumlahTamu = inputJumlahTamu ? parseInt(inputJumlahTamu.value, 10) : 0;

    const [yearIn, monthIn, dayIn] = checkInStr.split('-').map(Number);
    const [yearOut, monthOut, dayOut] = checkOutStr.split('-').map(Number);
    const checkInDate = new Date(yearIn, monthIn - 1, dayIn);
    const checkOutDate = new Date(yearOut, monthOut -1, dayOut);

    const today = new Date();
    today.setHours(0, 0, 0, 0,);
    if (!nama) {
        return "Nama lengkap wajib diisi.";

    }
    if (!selectedVila) {
        return "Silahkan pilih unit dahulu.";

    }
    
    
    if (checkInDate < today) {
        return "Tanggal check-in tidak boleh masa lalu";
    }

    if (checkOutDate <= checkInDate) {
        return "Tanggal check-out setelah tanggal check-in (minimal 1 malam)";
    }
    if (isNaN(jumlahTamu) || jumlahTamu < 1 || jumlahTamu> 10) {
        return "Jumlah tamu antara 1-10 orang.";
    }

    return null;

}
function hitungTotalHarga() {
    const errorText = validasiForm();

    if (errorText) {
        if (errorMessage) {
            errorMessage.textContent = errorText;
            errorMessage.classList.remove("hidden");
        }
        if (summaryCard) summaryCard.classList.add("hidden");
        return null;
    }
    if (errorMessage) errorMessage.classList.add("hidden");

    const checkInDate =  new Date(inputCheckIn.value);
    const checkOutDate = new Date(inputCheckOut.value);
    const selisihWaktu = checkOutDate.getTime() - checkInDate.getTime();
    const lamaMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));

    const selectedVilaId = villaSelect.value;
    const vilaDipilih = dataVila.find(v => v.id === selectedVilaId);
    const totalBiaya =lamaMalam * vilaDipilih.harga;

    if(summaryMalam) summaryMalam.textContent = lamaMalam;
    if (summaryHarga) summaryHarga.textContent = `Rp ${vilaDipilih.harga.toLocaleString("id-ID")}`;
    if (summaryTotal) summaryTotal.textContent = `Rp${totalBiaya.toLocaleString("id-ID")}`;
    if (summaryCard) summaryCard.classList.remove("hidden");

    return {vilaDipilih, lamaMalam, totalBiaya};
}

document.addEventListener("DOMContentLoaded", () =>{
    try {
        renderVila(dataVila);
        populateSelect();

        const savedNama = localStorage.getItem("lastGuestName");
        if (savedNama && inputNama) {
            inputNama.value = savedNama;
        }
    } catch (err) {
        console.error("Gagal Menjalan script aplikasi:", err);
    }
});

if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const keyword = e.target.value.toLowerCase(). trim();
        const filtered = dataVila.filter(vila =>
            vila.nama.toLowerCase(). includes(keyword) ||
            vila.fasilitas.some(f => f.toLowerCase().includes(keyword)) ||
            vila.lokasi.toLowerCase().includes(keyword)
            
        );
        renderVila(filtered);
    });
}

if (btnCek) {
    btnCek.addEventListener("click", () => {
        hitungTotalHarga();
    });
}

if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const hasil = hitungTotalHarga();

        if (hasil && bookingResult) {
            localStorage.setItem("lastGuestName", inputNama.value.trim());

            bookingResult.innerHTML = 
            `<div style="background-color: #d1fae5; border: 1px solid #ff2ea1; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
                <h3 style="color: #920055; margin-bottom: 0.5rem;">Pemesanan Berhasil Dibuat!</h3>
                <p><strong>Nama Pemesan:</strong> ${inputNama.value.trim()}</p>
                <p><strong>Unit Vila:</strong> ${hasil.vilaDipilih.nama}</p>
                <p><strong>Durasi:</strong> ${hasil.lamaMalam} Malam (${inputCheckIn.value} s/d ${inputCheckOut.value})</p>
                <p><strong>Jumlah Tamu:</strong> ${inputJumlahTamu.value} orang</p>
                <p><strong>Total Pembayaran:</strong> Rp ${hasil.totalBiaya.toLocaleString("id-ID")}</p>
                <hr style= "margin: 0.75rem 0; border: 0; border-top: 1px solid #a7f3d0;">
                <p style="font-size: 0.85rem; color: #ff2ea1;">Silahkan Konfirmasi pesanan ini ke Pak Hendra via WhatsApp (0812-8976-2456).</p>
                </div>    
            
            `;
            bookingResult.classList.remove("hidden");
        }
    }
    )
}

        
    
    

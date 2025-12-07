/* Merged script.js (customer + admin features) */
console.log("Script JS terbaca (merged)");

// ---------- Helpers ----------
const $ = (sel, scope = document) => (scope || document).querySelector(sel);
const $$ = (sel, scope = document) => Array.from((scope || document).querySelectorAll(sel));
const safeGet = id => document.getElementById(id) || null;

// ---------- Global data stores ----------
let pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

/* =========================
   CUSTOMER: popup + order
   ========================= */

// Open product popup and populate fields
function pesanProduk(nama, harga) {
    const popup = safeGet("popup");
    if (!popup) return;
    popup.style.display = "flex";
    popup.setAttribute("aria-hidden", "false");
    const prodEl = $("#Produk", popup);
    const priceEl = $("#Harga", popup);
    if (prodEl) prodEl.value = nama;
    if (priceEl) priceEl.value = harga;
}

// Close standard popup
function tutupPopup() {
    const popup = safeGet("popup");
    if (!popup) return;
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
}

// Open/close custom popup
function openCustomPopup() {
    const pop = safeGet("popupCustom");
    if (!pop) return;
    pop.style.display = "flex";
    pop.setAttribute("aria-hidden", "false");
}
function closeCustomPopup() {
    const pop = safeGet("popupCustom");
    if (!pop) return;
    pop.style.display = "none";
    pop.setAttribute("aria-hidden", "true");
}

// Send custom order
function kirimCustomOrder() {
    const pop = safeGet("popupCustom");
    if (!pop) return;

    const nameEl = $("#custName", pop);
    const waEl = $("#custWhatsApp", pop);
    const flowerEl = $("#custFlower", pop);
    const budgetEl = $("#custBudget", pop);
    const noteEl = $("#custNote", pop);
    const dueEl = $("#custDue", pop);
    const notif = $("#notifCustom", pop);

    const name = nameEl?.value.trim() || "";
    const wa = waEl?.value.trim() || "";
    const flower = flowerEl?.value.trim() || "-";
    const budget = budgetEl?.value.trim() || "";
    const note = noteEl?.value.trim() || "-";
    const due = dueEl?.value || "";

    if (!name || !wa || !budget || !due) {
        if (notif) notif.style.display = "block";
        return;
    }

    const order = {
        id: Date.now(),
        nama: name,
        wa: wa,
        jumlah: 1,
        produk: `Custom Bouquet`,
        harga: Number(budget),
        catatan: `Bunga: ${flower}. ${note}`,
        bunga: flower,
        dueDate: due,
        status: "menunggu",
        tanggal: new Date().toISOString().split("T")[0],
        kategori: "custom"
    };

    pesanan.push(order);
    localStorage.setItem("pesanan", JSON.stringify(pesanan));

    alert("Pesanan custom berhasil dikirim!");
    // reset
    if (nameEl) nameEl.value = "";
    if (waEl) waEl.value = "";
    if (flowerEl) flowerEl.value = "";
    if (budgetEl) budgetEl.value = "";
    if (noteEl) noteEl.value = "";
    if (dueEl) dueEl.value = "";
    if (notif) notif.style.display = "none";
    closeCustomPopup();
}

// Standard product order submission
function kirimPesanan() {
    const pop = safeGet("popup");
    if (!pop) return;
    const nameEl = $("#Nama", pop);
    const waEl = $("#NoWhatsApp", pop);
    const jumlahEl = $("#Jumlah", pop);
    const produkEl = $("#Produk", pop);
    const hargaEl = $("#Harga", pop);
    const dueEl = $("#DueDate", pop);

    const name = nameEl?.value.trim() || "";
    const wa = waEl?.value.trim() || "";
    const jumlah = Number(jumlahEl?.value || 0);
    const produk = produkEl?.value || "";
    const harga = Number(hargaEl?.value || 0);
    const due = dueEl?.value || "";

    if (!name || !wa || !produk || jumlah <= 0 || harga <= 0 || !due) {
        alert("Lengkapi semua field pesanan sebelum mengirim.");
        return;
    }

    const order = {
        id: Date.now(),
        nama: name,
        wa: wa,
        jumlah,
        produk,
        harga,
        catatan: "-",
        dueDate: due,
        status: "menunggu",
        tanggal: new Date().toISOString().split("T")[0],
        kategori: "produk"
    };

    pesanan.push(order);
    localStorage.setItem("pesanan", JSON.stringify(pesanan));

    alert("Pesanan berhasil dikirim! Kami akan segera menghubungi Anda.");
    // close and reset
    tutupPopup();
    if (nameEl) nameEl.value = "";
    if (waEl) waEl.value = "";
    if (jumlahEl) jumlahEl.value = "";
    if (produkEl) produkEl.value = "";
    if (hargaEl) hargaEl.value = "";
    if (dueEl) dueEl.value = "";
}

/* Close popups when clicking outside content */
document.addEventListener("click", (e) => {
    if (e.target === safeGet("popup")) tutupPopup();
    if (e.target === safeGet("popupCustom")) closeCustomPopup();
});

/* =========================
   LOGIN / REGISTER / NAV
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    // LOGIN FORM (if exists)
    const loginForm = safeGet("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (ev) {
            ev.preventDefault();
            const user = safeGet("username")?.value || "";
            const pass = safeGet("password")?.value || "";
            let users = JSON.parse(localStorage.getItem("users")) || [];

            const found = users.find(u => u.username === user && u.password === pass);
            if (!found) {
                alert("Username atau password salah!");
                return;
            }
            sessionStorage.setItem("role", found.role);
            sessionStorage.setItem("username", found.username);
            alert("Login berhasil!");
            window.location.href = "dashboard.html";
        });
    }

    // REGISTER FORM (if exists)
    const regForm = safeGet("registerForm");
    if (regForm) {
        regForm.addEventListener("submit", function(e){
            e.preventDefault();
            const user = safeGet("regUsername")?.value || "";
            const pass = safeGet("regPassword")?.value || "";
            const role = safeGet("regRole")?.value || "pegawai";

            if (!user || !pass) {
                alert("Semua field wajib diisi!");
                return;
            }

            let users = JSON.parse(localStorage.getItem("users")) || [];
            // prevent duplicate username
            if (users.find(u => u.username === user)) {
                alert("Username sudah terdaftar, silakan pilih username lain!");
                return;
            }
            users.push({ username: user, password: pass, role: role });
            localStorage.setItem("users", JSON.stringify(users));
            alert("Registrasi berhasil! Silakan login.");
            window.location.href = "login.html";
        });
    }

    // protect dashboard (if on admin/dashboard page)
    if (document.body.classList.contains("dashboard-body") && !sessionStorage.getItem("role")) {
        alert("Anda harus login terlebih dahulu!");
        window.location.href = "login.html";
    }
});

/* Logout */
function logout() {
    sessionStorage.clear();
    alert("Logout berhasil!");
    window.location.href = "login.html";
}
function goTo(page) {
    window.location.href = page;
}

/* =========================
   TRANSAKSI / INVENTORY / PESANAN modules
   (These modules run only if their pages contain expected elements)
   ========================= */

// TRANSAKSI module (if transaksi page present)
(function initTransaksi() {
    const transForm = safeGet("transForm");
    const tbody = safeGet("dataTransaksi");
    const chartCanvas = safeGet("chartPenjualan");
    let chart = null;

    function loadTransaksi() {
        if (!tbody) return;
        tbody.innerHTML = "";
        transaksi.forEach((t, index) => {
            if (!t || !t.nama) return;
            tbody.innerHTML += `
                <tr>
                    <td>${t.nama}</td>
                    <td>${t.produk}</td>
                    <td>${t.jumlah}</td>
                    <td>Rp ${t.total.toLocaleString()}</td>
                    <td>${t.metode}</td>
                    <td><button class="btn-hapus" onclick="hapusTransaksi(${index})">Hapus</button></td>
                </tr>
            `;
        });
    }

    window.hapusTransaksi = function(i) {
        if (!confirm("Yakin ingin menghapus transaksi ini?")) return;
        transaksi.splice(i, 1);
        localStorage.setItem("transaksi", JSON.stringify(transaksi));
        loadTransaksi();
        updateChart();
    };

    function updateChart() {
        if (!chartCanvas) return;
        const grouped = {};
        transaksi.forEach(t => {
            const key = `${t.produk} | ${t.metode}`;
            if (!grouped[key]) grouped[key] = 0;
            grouped[key] += t.total;
        });
        const labels = Object.keys(grouped);
        const data = Object.values(grouped);
        if (chart) chart.destroy();
        try {
            chart = new Chart(chartCanvas.getContext("2d"), {
                type: "bar",
                data: { labels, datasets: [{ label: "Total Pendapatan", data }] }
            });
        } catch (err) { console.warn("Chart.js error:", err); }
    }

    if (transForm) {
        transForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nama = safeGet("nama")?.value || "";
            const produk = safeGet("produk")?.value || "";
            const jumlah = parseInt(safeGet("jumlah")?.value || 0);
            const harga = parseInt(safeGet("harga")?.value || 0);
            const metode = safeGet("metode")?.value || "";
            const total = jumlah * harga;

            if (!nama || !produk || jumlah <= 0 || harga <= 0 || !metode) {
                alert("Lengkapi data transaksi dengan benar.");
                return;
            }

            transaksi.push({ nama, produk, jumlah, total, metode });
            localStorage.setItem("transaksi", JSON.stringify(transaksi));
            alert("Transaksi berhasil disimpan!");
            this.reset();
            loadTransaksi();
            updateChart();
        });

        loadTransaksi();
        updateChart();
    }
})();

// INVENTORY module
(function initInventory() {
    const invForm = safeGet("invForm");
    const tbodyInv = safeGet("dataInventory");
    const chartEl = safeGet("chartStok");
    let invChart = null;

    function loadInventory() {
        if (!tbodyInv) return;
        tbodyInv.innerHTML = "";
        inventory.forEach((p, i) => {
            tbodyInv.innerHTML += `
                <tr>
                    <td>${p.nama}</td>
                    <td>${p.stok}</td>
                    <td><button class="btn-delete" onclick="hapusProduk(${i})">Hapus</button></td>
                </tr>
            `;
        });
    }

    window.hapusProduk = function(index) {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;
        inventory.splice(index, 1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        loadInventory();
        updateStokChart();
    };

    function updateStokChart() {
        if (!chartEl) return;
        const labels = inventory.map(p => p.nama);
        const data = inventory.map(p => p.stok);
        if (invChart) invChart.destroy();
        try {
            invChart = new Chart(chartEl.getContext("2d"), {
                type: "bar",
                data: { labels, datasets: [{ label: "Jumlah Stok", data }] }
            });
        } catch (err) { console.warn("Chart.js error:", err); }
    }

    if (invForm) {
        invForm.addEventListener("submit", function(e){
            e.preventDefault();
            const nama = safeGet("produkNama")?.value || "";
            const stok = parseInt(safeGet("stokProduk")?.value || 0);
            if (!nama || isNaN(stok) || stok < 0) {
                alert("Masukkan nama produk dan stok valid.");
                return;
            }
            const existing = inventory.findIndex(p => p.nama === nama);
            if (existing >= 0) {
                inventory[existing].stok = stok;
                alert("Stok produk berhasil diperbarui!");
            } else {
                inventory.push({ nama, stok });
                alert("Produk baru berhasil ditambahkan!");
            }
            localStorage.setItem("inventory", JSON.stringify(inventory));
            this.reset();
            loadInventory();
            updateStokChart();
        });

        loadInventory();
        updateStokChart();
    }
})();

// PESANAN (admin) module
(function initPesanan() {
    const tbody = safeGet("listPesanan");
    if (!tbody) return;

    function priorityFromDue(dueStr) {
        if (!dueStr) return "low";
        const due = new Date(dueStr);
        const today = new Date();
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        if (diff <= 1) return "high";
        if (diff <= 3) return "medium";
        return "low";
    }

    function loadPesanan() {
        pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
        pesanan.sort((a,b) => {
            const da = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
            const db = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
            return da - db;
        });
        tbody.innerHTML = "";
        pesanan.forEach((p, i) => {
            const priorityLabel = priorityFromDue(p.dueDate);
            let prClass = priorityLabel === 'high' ? 'prio-tinggi' : (priorityLabel === 'medium' ? 'prio-sedang' : 'prio-rendah');
            tbody.innerHTML += `
                <tr class="${priorityLabel === 'high' ? 'prioritas-tinggi' : ''}">
                    <td>${p.nama}</td>
                    <td>${p.wa || "-"}</td>
                    <td>${p.produk}</td>
                    <td>${p.jumlah}</td>
                    <td>${p.status || 'menunggu'}</td>
                    <td>${p.dueDate || '-'}</td>
                    <td><span class="prioritas ${prClass}">P${i+1}</span></td>
                    <td>
                        <button class="aksi-btn acc" onclick="setStatus(${i}, 'proses')">Proses</button>
                        <button class="aksi-btn acc" onclick="setStatus(${i}, 'selesai')">Selesai</button>
                        <button class="aksi-btn reject" onclick="setStatus(${i}, 'tolak')">Tolak</button>
                        <button class="aksi-btn delete" onclick="hapusPesanan(${i})">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    window.setStatus = function(index, status) {
        pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
        if (!pesanan[index]) return;
        pesanan[index].status = status;
        localStorage.setItem("pesanan", JSON.stringify(pesanan));
        loadPesanan();
    };

    window.hapusPesanan = function(index) {
        if (!confirm("Hapus pesanan ini?")) return;
        pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
        pesanan.splice(index, 1);
        localStorage.setItem("pesanan", JSON.stringify(pesanan));
        loadPesanan();
    };

    loadPesanan();
})();

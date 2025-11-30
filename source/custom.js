// Ambil seluruh query string tanpa '?'
let query = window.location.search.substring(1);

// Ambil teks setelah "to=" sampai akhir (biar gak kepecah gara2 '&')
let rawNama = '';
if (query.includes('to=')) {
  rawNama = query.split('to=')[1]; // ambil dari 'to=' sampai akhir
}

// Decode URL encoding (kalau ada)
try {
  rawNama = decodeURIComponent(rawNama);
} catch (e) {
  // kalau decode error (jarang banget), biarin raw aja
}

// Bersihkan karakter tak penting
rawNama = rawNama.trim().replace(/-/g, ' ');

// Fallback nama default
let nama = rawNama === '' ? 'Tamu Undangan' : rawNama;

// Tampilkan ke elemen HTML
document.getElementById('nama-tamu').innerText = nama;



function pad(n){ return String(n).padStart(2,'0'); }

 const TARGET_ISO = "2025-11-30T08:00:00+07:00";

  // Fungsi buat padding angka (misal 7 jadi 07)
  function pad(n) {
    return n.toString().padStart(2, "0");
  }

  function updateCountdown() {
    // console.log('mantap')
    const target = new Date(TARGET_ISO).getTime();
    const now    = Date.now();
    let diff     = target - now;

    const elDays  = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins  = document.getElementById('cd-mins');
    const elSecs  = document.getElementById('cd-secs');
    const elLabel = document.getElementById('cd-label');

    if (diff <= 0) {
      elDays.textContent  = "00";
      elHours.textContent = "00";
      elMins.textContent  = "00";
      elSecs.textContent  = "00";
      elLabel.textContent = "Acara sedang berlangsung atau telah selesai.";
      // clearInterval(cdTimer); // stop timer biar ga minus
      return;
    }

    const sec  = Math.floor(diff / 1000);
    const days = Math.floor(sec / (3600*24));
    const hrs  = Math.floor((sec % (3600*24)) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    elDays.textContent  = pad(days);
    elHours.textContent = pad(hrs);
    elMins.textContent  = pad(mins);
    elSecs.textContent  = pad(secs);
  }

  updateCountdown(); // jalanin sekali langsung
  const cdTimer = setInterval(updateCountdown, 1000); // update tiap detik

$(document).ready(function() {
    const API_URL = "https://script.google.com/macros/s/AKfycbwzOx6d6xAbuBcjDOvoksi7vY1oyPgPIUF6-s4N99gkv3xWj8valFprNcEVRiBYkqJOVg/exec"; // ganti
  
  $(document).on("click", "#btnKirim", function () {
    // taruh kode Ajax lo di sini
      let $btn = $(this); // simpen button
    $btn.prop("disabled", true).text("Mengirim..."); // disable + kasih indikator
      let formData = {
        nama: $("#nama").val(),
        hadir: $("#hadir").val(),
        pesan: $("#pesan").val()
      };

      if (!formData.nama) {
        alert("Nama wajib diisi!");
        $btn.prop("disabled", false).text("Kirim"); // enable lagi kalau gagal validasi
      return;
      }

      $.ajax({
        url: API_URL,
        method: "POST",
        data: formData,
        success: function(res) {
          $("#formPesan")[0].reset(); // reset form
          loadPesan()
        },
        error: function(err) {
          alert("Gagal mengirim pesan.");
          console.error(err);
        },
        complete: function () {
          // complete selalu jalan, baik success/error
          $btn.prop("disabled", false).text("Kirim");
        }
      });
  });
  // Load awal
  function loadPesan() {
    $.getJSON(API_URL, function(data) {
        let html = "";
        let countHadir = 0;
        let countTidak = 0;
        data.reverse()
        data.forEach(row => {
            if (row.hadir === "Hadir") countHadir++;
            if (row.hadir === "Tidak Hadir") countTidak++;

            html += `
            <div class="card mb-2">
                <div class="card-body">
                <b class="card-title">${row.nama}</b><br>
                <span class="card-text">${row.pesan}</span><br>
                <span style="font-size: 11px;"><em>`+timeAgo(row.waktu)+`<em></span>
                </div>
            </div>
            `;
        });

        $("#listPesan").html(html || "<p class='text-muted'>Belum ada pesan...</p>");
        $("#countPesan").text(data.length);
        });
    }

     loadPesan();
});

function timeAgo(isoString) {
  const now   = new Date();
  const date  = new Date(isoString);
  const diff  = Math.floor((now - date) / 1000); // selisih dalam detik

  if (diff < 60) {
    return `${diff} detik yang lalu`;
  } else if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} menit yang lalu`;
  } else if (diff < 86400) {
    const hrs = Math.floor(diff / 3600);
    return `${hrs} jam yang lalu`;
  } else {
    const days = Math.floor(diff / 86400);
    return `${days} hari yang lalu`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('toggleBtn');
  const collapsible = document.getElementById('collapsible');

  btn.addEventListener('click', () => {
    collapsible.classList.toggle('open');

    if (collapsible.classList.contains('open')) {
      collapsible.style.maxHeight = collapsible.scrollHeight + "px";
    } else {
      collapsible.style.maxHeight = "0px";
    }
  });
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("No. Rekening berhasil disalin: " + text);
  });
}

function copyToClipboard2(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Alamat berhasil disalin: " + text);
  });
}

window.addEventListener("load", function() {
  const music = document.getElementById("music");
  music.play().catch(e => console.log("Autoplay gagal:", e));
});

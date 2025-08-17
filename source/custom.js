const audio = document.getElementById('lagu');
const btnMusic = document.getElementById('btn-music');
// Fungsi toggle musik
function toggleMusic() {
    if (audio.paused) {
        audio.play();
        btnMusic.innerText = '🔊';
    } else {
        audio.pause();
        btnMusic.innerText = '🔇';
    }
}

function tutupFlayer() {
    const flayer = document.getElementById('flayer');
    const audio = document.getElementById('lagu');

    // Play lagu
    audio.play().catch(err => {
        console.log("Lagu tidak bisa diputar otomatis:", err);
    });

    // Animasi tutup flayer
    flayer.style.animation = "fadeOut 0.5s forwards";
    setTimeout(() => {
        flayer.style.display = "none";
    }, 500);
}

// Ambil parameter ?to=
const params = new URLSearchParams(window.location.search);
let rawNama = params.get('to') || '';
let nama = rawNama.trim() === '' ? 'Tamu Undangan' : rawNama.replace(/-/g, ' ');
document.getElementById('nama-tamu').innerText = nama;

function pad(n){ return String(n).padStart(2,'0'); }

 const TARGET_ISO = "2025-11-30T08:00:00+07:00";

  // Fungsi buat padding angka (misal 7 jadi 07)
  function pad(n) {
    return n.toString().padStart(2, "0");
  }

  function updateCountdown() {
    console.log('mantap')
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
      clearInterval(cdTimer); // stop timer biar ga minus
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
  
  // klik tombol, bukan submit bawaan
  $("#btnKirim").on("click", function() {
    let formData = {
      nama: $("#nama").val(),
      hadir: $("#hadir").val(),
      pesan: $("#pesan").val()
    };

    if (!formData.nama) {
      alert("Nama wajib diisi!");
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
                <b class="card-title">${row.nama}</b>
                <span><em>`+timeAgo(row.waktu)+`<em></span>
                <p class="card-text">${row.pesan}</p>
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

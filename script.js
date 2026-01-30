window.addEventListener('load', function() {
  const loadingScreen = document.getElementById('loading-screen');
  

  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    
    
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 1500); 
});

const upBtn = document.getElementById("upBtn");

function backToTop() {
  window.scrollTo({ top: 0 });
}

function showUpBtn() {
  if (window.scrollY !== 0) {
    upBtn.style.display = "block";
  } else {
    upBtn.style.display = "none";
  }
}

const slides = document.querySelectorAll(".slide");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
let currentSlide = 0;

const menuBtn = document.getElementById("menuBtn"); 
const navList = document.getElementById("navList"); 
menuBtn.addEventListener("click", () => { 
  navList.classList.toggle("show"); 
});

function whatsapp() {
  let fUserName = document.getElementById("input-email").value;
  const Realnow = new Date();
const hourNow = Realnow.getHours();

let greeting = "";

if (hourNow >= 3 && hourNow < 12) {
  greeting = "Selamat pagi! 🌅";
} else if (hourNow >= 12 && hourNow < 16) {
  greeting = "Selamat siang! ☀️";
} else if (hourNow >= 16 && hourNow < 19) {
  greeting = "Selamat sore! 🌇";
} else {
  greeting = "Selamat malam! 🌙";
}
let rlMsg = `${greeting}, Saya, ${fUserName.trim()} dari Web TerraPulse, ingin lebih mengetahui terkait Eco-Friendly dan update berita atau informasi terbaru, terima kasih. 🙏`;
  window.open(`https://wa.me/6281996275318?text=${rlMsg}`);
}

document.querySelectorAll("#navList a").forEach(link => {
  link.addEventListener("click", () => {
    navList.classList.remove("show");
  });
});

 const manualNav = function (manual) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[manual].classList.add("active");
};

const nextSlide = function () {
  currentSlide = (currentSlide + 1) % slides.length;
  manualNav(currentSlide);
};

const prevSlide = function () {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  manualNav(currentSlide);
};

rightArrow.addEventListener("click", nextSlide);
leftArrow.addEventListener("click", prevSlide);

document.getElementById("carbon-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const milesDriven = parseFloat(document.getElementById("miles-driven").value);
  const electricityConsumption = parseFloat(
    document.getElementById("electricity-consumption").value
  );
  const waste = parseFloat(document.getElementById("waste").value);

  const carEmissionFactor = 0.256;
  const electricityEmissionFactor = 0.92;
  const wasteEmissionFactor = 0.5;

  const carEmissions = milesDriven * carEmissionFactor * 52;
  const electricityEmissions =
    electricityConsumption * electricityEmissionFactor * 12;
  const wasteEmissions = waste * wasteEmissionFactor * 52;

  const totalCarbonFootprint =
    carEmissions + electricityEmissions + wasteEmissions;

  document.getElementById("carbon-output").textContent =
    totalCarbonFootprint.toFixed(2);
});


function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16)
  let current = start;
  
  element.classList.add('counting');
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current.toFixed(1);
  }, 16);
}

const carbonStatsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.carbon-stat-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          const percentageElement = card.querySelector('.percentage-number');
          const target = parseFloat(percentageElement.getAttribute('data-target'));
          animateCounter(percentageElement, target, 2000);
        }, index * 200); 
      });
      carbonStatsObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3
});

document.addEventListener('DOMContentLoaded', () => {
  const carbonStatsSection = document.getElementById('carbon-stats');
  if (carbonStatsSection) {
    carbonStatsObserver.observe(carbonStatsSection);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      
      button.classList.add('active');

    
      const tabId = button.getAttribute('data-tab');
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add('active');
        
        if (tabId === 'aqi-monitor') {
          loadAQIData();
        }
      }
    });
  });
});

function getAQICategory(aqi) {
  if (aqi <= 50) return { category: 'good', text: 'Baik', description: 'Kualitas udara sangat baik. Tidak ada risiko kesehatan.' };
  if (aqi <= 100) return { category: 'moderate', text: 'Sedang', description: 'Kualitas udara dapat diterima untuk sebagian besar orang.' };
  if (aqi <= 150) return { category: 'unhealthy-sensitive', text: 'Tidak Sehat untuk Sensitif', description: 'Kelompok sensitif mungkin mengalami efek kesehatan.' };
  if (aqi <= 200) return { category: 'unhealthy', text: 'Tidak Sehat', description: 'Semua orang mungkin mulai mengalami efek kesehatan.' };
  if (aqi <= 300) return { category: 'very-unhealthy', text: 'Sangat Tidak Sehat', description: 'Peringatan kesehatan untuk kondisi darurat.' };
  return { category: 'hazardous', text: 'Berbahaya', description: 'Peringatan kesehatan: semua orang mungkin mengalami efek kesehatan serius.' };
}

async function loadAQIData() {
  try {
    const response = await fetch("https://api.airvisual.com/v2/city?city=Jakarta&state=Jakarta&country=Indonesia&key=5267b64c-dbad-4216-acae-6f379f967b38");
    const data = await response.json();
    
    if (data.status === "success") {
      const aqiValue = data.data.current.pollution.aqius;
      const category = getAQICategory(aqiValue);
      
      const aqiNumber = document.getElementById('aqi-number');
      aqiNumber.textContent = aqiValue;
      
      const aqiCircle = document.getElementById('aqi-circle');
      aqiCircle.className = 'aqi-circle ' + category.category;
      
      const statusBadge = document.querySelector('.status-badge');
      const statusText = document.getElementById('status-text');
      statusBadge.className = 'status-badge ' + category.category;
      statusText.textContent = category.text;
      
      const statusDescription = document.getElementById('status-description');
      statusDescription.textContent = category.description;
      
      const weather = data.data.current.weather;
      
      if (weather.tp !== undefined) {
        document.getElementById('temp-value').textContent = weather.tp + '°C';
      }
      
      if (weather.hu !== undefined) {
        document.getElementById('humidity-value').textContent = weather.hu + '%';
      }
      
      if (weather.ws !== undefined) {
        document.getElementById('wind-value').textContent = weather.ws + ' m/s';
      }
      
      const pollution = data.data.current.pollution;
      
      if (pollution.ts) {
        const updateTime = new Date(pollution.ts);
        const formattedTime = updateTime.toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        document.getElementById('update-time').textContent = 'Terakhir diperbarui: ' + formattedTime;
      }
      
    } else {
      throw new Error('Failed to fetch AQI data from IQAir');
    }
  } catch (error) {
    console.error('Error loading AQI data:', error);
    document.getElementById('aqi-number').innerHTML = '<span style="font-size: 1.5rem;">Error</span>';
    document.getElementById('status-text').textContent = 'Gagal memuat data';
    document.getElementById('status-description').textContent = 'Silakan coba lagi nanti';
  }
}

const MAX_POINTS = 300;

let celebrationSound = null;

function initCelebrationSound() {
  celebrationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3');
  celebrationSound.volume = 0.5;
}

function playCelebrationSound() {
  if (celebrationSound) {
    celebrationSound.currentTime = 0;
    celebrationSound.play().catch(err => {
      console.log('Audio play failed:', err);
    });
  }
}

function initGameState() {
  const savedState = localStorage.getItem('ecoHeroState');
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    totalPoints: 0,
    completedMissions: 0,
    completedMissionsList: []
  };
}

function saveGameState(state) {
  localStorage.setItem('ecoHeroState', JSON.stringify(state));
}

function calculateProgress(points) {
  return Math.min((points / MAX_POINTS) * 100, 100);
}

function updateUI(state) {
  document.getElementById('total-points').textContent = state.totalPoints;
  
  document.getElementById('completed-missions').textContent = state.completedMissions + ' / 6';
  
  const progress = calculateProgress(state.totalPoints);
  const progressFill = document.getElementById('progress-fill');
  
  if (progress > 0) {
    progressFill.style.width = progress + '%';
    progressFill.classList.add('has-progress');
  } else {
    progressFill.style.width = '0%';
    progressFill.classList.remove('has-progress');
  }
  
  document.getElementById('progress-percentage').textContent = Math.round(progress) + '%';
  
  document.getElementById('current-progress').textContent = state.totalPoints;
  document.getElementById('next-level-points').textContent = MAX_POINTS;
  
  const missionButtons = document.querySelectorAll('.mission-btn');
  missionButtons.forEach(btn => {
    const missionName = btn.getAttribute('data-mission');
    if (state.completedMissionsList.includes(missionName)) {
      btn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Selesai';
      btn.classList.add('completed');
      btn.disabled = true;
      btn.closest('.mission-card').classList.add('completed');
    }
  });
}

function showCelebration(points, missionName) {
  const celebration = document.createElement('div');
  celebration.className = 'celebration-popup';
  celebration.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, rgba(77, 158, 0, 0.85) 0%, rgba(110, 199, 30, 0.85) 100%);
    color: white;
    padding: 40px 60px;
    border-radius: 20px;
    font-size: 1.5rem;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 15px 50px rgba(77, 158, 0, 0.5);
    animation: celebrationPop 0.5s ease-out;
  `;
  celebration.innerHTML = `
    <button class="close-celebration-btn" style="
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      line-height: 1;
    " onmouseover="this.style.background='rgba(255, 255, 255, 0.4)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
      <i class="fa-solid fa-times"></i>
    </button>
    <div style="text-align: center;">
      <i class="fa-solid fa-trophy" style="font-size: 4rem; margin-bottom: 20px; animation: bounce 1s infinite;"></i>
      <div style="font-size: 1.8rem;">Misi Selesai!</div>
      <div style="font-size: 2.5rem; margin-top: 15px; color: #fff;">+${points} Poin</div>
      <div style="font-size: 1.1rem; margin-top: 15px; opacity: 0.95;">${missionName}</div>
    </div>
  `;
  
  if (!document.getElementById('celebration-style')) {
    const style = document.createElement('style');
    style.id = 'celebration-style';
    style.textContent = `
      @keyframes celebrationPop {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(celebration);
  
  const closeBtn = celebration.querySelector('.close-celebration-btn');
  closeBtn.addEventListener('click', () => {
    celebration.style.animation = 'celebrationPop 0.3s ease-in reverse';
    setTimeout(() => {
      celebration.remove();
    }, 300);
  });
  
  setTimeout(() => {
    if (document.body.contains(celebration)) {
      celebration.style.animation = 'celebrationPop 0.3s ease-in reverse';
      setTimeout(() => {
        if (document.body.contains(celebration)) {
          celebration.remove();
        }
      }, 300);
    }
  }, 3000);
}

function showCompletionMessage() {
  playCelebrationSound();
  
  const notification = document.createElement('div');
  notification.className = 'completion-notification';
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #FFF4B5 0%, #FFE88A 100%);
    color: #5A4A00;
    padding: 50px 70px;
    border-radius: 25px;
    font-size: 1.8rem;
    font-weight: bold;
    z-index: 10001;
    box-shadow: 0 20px 60px rgba(77, 158, 0, 0.6);
    animation: celebrationPop 0.6s ease-out;
    text-align: center;
  `;
  notification.innerHTML = `
  <button class="close-notification-btn" style="
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    line-height: 1;
  " onmouseover="this.style.background='rgba(255, 255, 255, 0.4)'"
     onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
    <i class="fa-solid fa-times"></i>
  </button>

  <center>
    <i class="fa-solid fa-star" style="
      font-size: 5rem;
      color: #FFD700;
      margin-bottom: 25px;
      display: block;
      animation: bounce 1s infinite;
    "></i>
  </center>

  <div style="font-size: 3rem; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
    SELAMAT!
  </div>

  <div style="font-size: 1.5rem; opacity: 0.95;">
    Semua Misi Harian Selesai!
  </div>

  <div style="font-size: 1.2rem; opacity: 0.9; margin-top: 15px;">
    Anda telah mencapai ${MAX_POINTS} poin!
  </div>

  <button onclick="window.open('https://twb.nz/terrapulse', '_blank')" style="
    margin-top: 25px;
    padding: 15px 35px;
    font-size: 1.3rem;
    font-weight: bold;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  "
  onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.4)'"
  onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.3)'">
    🎁 Claim Hadiah
  </button>
`;

  
  document.body.appendChild(notification);
  
  const closeBtn = notification.querySelector('.close-notification-btn');
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'celebrationPop 0.4s ease-in reverse';
    setTimeout(() => {
      notification.remove();
    }, 400);
  });
  
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation = 'celebrationPop 0.4s ease-in reverse';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.remove();
        }
      }, 400);
    }
  }, 6000);
}

function completeMission(button) {
  const points = parseInt(button.getAttribute('data-points'));
  const missionName = button.getAttribute('data-mission');
  
  const state = initGameState();
  
  if (state.completedMissionsList.includes(missionName)) {
    return;
  }
  
  if (state.totalPoints >= MAX_POINTS) {
    alert('Anda sudah mencapai maksimum poin (300)!');
    return;
  }
  
  const newPoints = Math.min(state.totalPoints + points, MAX_POINTS);
  state.totalPoints = newPoints;
  state.completedMissions += 1;
  state.completedMissionsList.push(missionName);
  
  saveGameState(state);
  
  updateUI(state);
  
  showCelebration(points, missionName);
  
  if (state.completedMissions === 6 && state.totalPoints >= MAX_POINTS) {
    setTimeout(() => {
      showCompletionMessage();
    }, 500);
  }
}

function resetProgress() {
  if (confirm('Apakah Anda yakin ingin mereset semua progress? Tindakan ini tidak dapat dibatalkan.')) {
    localStorage.removeItem('ecoHeroState');
    location.reload();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initCelebrationSound();
  
  const state = initGameState();
  updateUI(state);
  
  const missionButtons = document.querySelectorAll('.mission-btn');
  missionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      completeMission(this);
    });
  });
  
  const resetBtn = document.getElementById('reset-progress');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetProgress);
  }
});



const tipsFacts = [
  { emoji: "🌿", text: "Hutan Mangrove adalah Superhero: Mangrove dapat menyerap karbon hingga 4 kali lebih banyak daripada hutan hujan tropis biasa." },
  { emoji: "🌳", text: "Kekuatan Satu Pohon: Satu pohon dewasa dapat menyerap sekitar 22 kg CO2 per tahun dan menghasilkan oksigen yang cukup untuk dua orang bernapas." },
  { emoji: "♻️", text: "Aluminium Abadi: Aluminium dapat didaur ulang terus-menerus tanpa batas waktu. Mendaur ulang satu kaleng soda menghemat energi yang cukup untuk menyalakan TV selama 3 jam." },
  { emoji: "📧", text: "Internet Punya Jejak Karbon: Setiap email yang kamu kirim menghasilkan sekitar 4 gram CO2. Jika kita berhenti mengirim email 'Terima kasih' yang tidak perlu, kita bisa menghemat ribuan ton karbon per tahun." },
  { emoji: "🍄", text: "Jamur Bisa Menghancurkan Plastik: Ada jenis jamur (Aspergillus tubingensis) yang ditemukan bisa memakan dan menguraikan plastik jenis poliuretan dalam hitungan minggu." },
  { emoji: "👕", text: "Pakaian dari Sampah: Sekitar 70% pakaian kita mengandung plastik (seperti poliester). Saat dicuci, mereka melepaskan mikroplastik ke lautan." },
  { emoji: "☀️", text: "Energi Matahari Berlimpah: Energi matahari yang mencapai bumi dalam satu jam sudah cukup untuk memenuhi kebutuhan energi seluruh dunia selama satu tahun penuh." },
  { emoji: "💡", text: "Cabut Colokan Idle: Peralatan elektronik yang tetap tercolok meski dalam keadaan mati (vampire power) menyumbang sekitar 10% dari tagihan listrik rumah tangga." },
  { emoji: "🥦", text: 'Kurangi Konsumsi Daging: Mencoba "Meatless Monday" atau satu hari tanpa daging seminggu dapat mengurangi jejak karbon individu secara signifikan karena produksi daging (terutama sapi) sangat boros air dan lahan.' },
  { emoji: "🚰", text: "Bawa Botol Minum Sendiri: Satu botol plastik membutuhkan waktu 450 tahun untuk terurai. Menggunakan botol reusable adalah cara termudah mengurangi sampah plastik." },
  { emoji: "👚", text: "Cuci Baju dengan Air Dingin: Sekitar 90% energi yang digunakan mesin cuci habis hanya untuk memanaskan air. Air dingin sudah cukup untuk membersihkan baju sehari-hari." },
  { emoji: "📱", text: "Gunakan Mode Hemat pada Gadget: Menurunkan kecerahan layar dan menggunakan dark mode pada layar OLED bisa menghemat baterai dan memperpanjang umur perangkatmu." },
  { emoji: "🍽️", text: "Kompos Sisa Makanan: Sampah organik di TPA menghasilkan gas metana yang 25 kali lebih kuat dari CO2 dalam memerangkap panas di atmosfer. Mengompos di rumah sangat membantu!" },
  { emoji: "🛒", text: "Pilih Produk Lokal: Membeli sayur atau barang lokal mengurangi emisi dari transportasi jarak jauh (food miles)." },
  { emoji: "🧵", text: "Perbaiki Sebelum Membeli: Budaya repair lebih baik daripada recycle. Coba jahit baju yang robek sedikit atau servis elektronik yang rusak sebelum memutuskan beli baru." },
  { emoji: "🚲", text: "Gunakan Transportasi Publik atau Sepeda: Jika jaraknya memungkinkan, jalan kaki atau bersepeda adalah cara nol-emisi yang paling sehat." },
  { emoji: "👗", text: "Hindari Fast Fashion: Belilah pakaian berkualitas yang tahan lama atau coba belanja di toko barang bekas (thrifting)." },
  { emoji: "🌱", text: "Gunakan Mesin Pencari Ekologis: Coba gunakan mesin pencari seperti Ecosia, yang menyumbangkan keuntungan iklannya untuk menanam pohon." },
  { emoji: "💡", text: "Matikan Lampu Saat Keluar Ruangan: Terdengar klise, tapi jika dilakukan jutaan orang, dampaknya masif bagi beban pembangkit listrik." },
  { emoji: "👜", text: "Gunakan Tas Belanja Kain: Simpan satu di tas atau kendaraanmu agar tidak perlu menggunakan plastik sekali pakai saat belanja mendadak." },
  { emoji: "🚿", text: "Gunakan Air Secukupnya: Matikan kran saat sedang menggosok gigi atau menyabuni tangan. Kebocoran kran yang kecil sekalipun bisa membuang ribuan liter air dalam setahun." },
  { emoji: "🚗", text: "Berbagi Kendaraan (Carpooling): Jika memiliki tujuan yang sama dengan teman atau rekan kerja, cobalah pergi bersama dalam satu kendaraan untuk mengurangi emisi di jalan raya." },
  { emoji: "📄", text: "Tahukah kamu bahwa memproduksi kertas dari hasil daur ulang menggunakan energi 40% lebih sedikit dibandingkan memproduksinya dari serat kayu asli? Jadi, menggunakan kertas bekas untuk coretan sangatlah berarti!" },
  { emoji: "🐋", text: "Paus adalah Penyerap Karbon Raksasa: Seekor paus besar mampu menyerap rata-rata 33 ton CO2 selama masa hidupnya. Ketika mereka mati dan tenggelam ke dasar laut, karbon tersebut tersimpan di sana selama berabad-abad." },
  { emoji: "🍾", text: "Kaca Tidak Pernah 'Lelah': Sama seperti aluminium, kaca bisa didaur ulang 100% secara berulang-ulang tanpa kehilangan kualitas atau kemurniannya. Botol kaca yang kamu daur ulang hari ini bisa kembali ke rak toko dalam waktu kurang dari 30 hari." },
  { emoji: "🧼", text: "Gunakan Deterjen Ramah Lingkungan: Pilih pembersih rumah tangga yang bebas fosfat agar limbah air dari rumah tidak merusak ekosistem sungai." },
  { emoji: "👣", text: "Energi dari Langkah Kaki: Beberapa kota di dunia sudah mulai memasang ubin khusus (trotoar kinetik) yang bisa mengubah tekanan dari langkah kaki orang yang berjalan di atasnya menjadi energi listrik. Satu langkah kaki saja bisa menghasilkan daya yang cukup untuk menyalakan lampu LED selama beberapa detik. Bayangkan jika ini dipasang di stasiun kereta yang sangat ramai!" },
  { emoji: "🌊", text: "Hutan Hujan di Bawah Laut: Rumput laut (seagrass) sebenarnya adalah pahlawan tanpa tanda jasa. Meskipun hanya mencakup kurang dari 0,2% dasar laut dunia, padang rumput laut mampu menyimpan sekitar 10% dari total karbon yang terkubur di lautan setiap tahunnya." },
  { emoji: "💧", text: "Membuang sampah makanan itu ibarat membiarkan kran air menyala tanpa henti. Mengapa? Karena untuk menghasilkan satu buah apel saja, dibutuhkan sekitar 125 liter air. Jadi, saat kita membuang satu apel yang membusuk, kita sebenarnya juga 'membuang' 125 liter air yang digunakan untuk menumbuhkannya." }
];

let lastTips = [];
let isAnimating = false;

function getRandomTip() {
  let availableTips = tipsFacts.filter(t => !lastTips.includes(t));
  if (availableTips.length === 0) {
    lastTips = [];
    availableTips = tipsFacts;
  }

  const randomTip = availableTips[Math.floor(Math.random() * availableTips.length)];

  lastTips.push(randomTip);
  if (lastTips.length > 3) lastTips.shift();

  return randomTip;
}

function updateTipContent(tip) {
  const tipContent = document.getElementById("tips-content");
  
  tipContent.innerHTML = `
    <span class="emoji-icon">${tip.emoji}</span>
    <p class="tips-text">${tip.text}</p>
  `;
}

function createConfetti() {
  const colors = ['#4d9e00', '#6ec71e', '#8bc34a', '#a5d6a7', '#FFD700'];
  const confettiCount = 30;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      opacity: ${Math.random() * 0.7 + 0.3};
      transform: rotate(${Math.random() * 360}deg);
      pointer-events: none;
      z-index: 9999;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    `;
    
    document.body.appendChild(confetti);
    
    const duration = Math.random() * 3000 + 2000;
    const xMovement = (Math.random() - 0.5) * 200;
    
    confetti.animate([
      { 
        transform: `translate(0, 0) rotate(0deg)`,
        opacity: confetti.style.opacity
      },
      { 
        transform: `translate(${xMovement}px, 100vh) rotate(${Math.random() * 720}deg)`,
        opacity: 0
      }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    setTimeout(() => {
      confetti.remove();
    }, duration);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tipContent = document.getElementById("tips-content");
  const newTipBtn = document.getElementById("new-tip-btn");

  if (newTipBtn && tipContent) {
    newTipBtn.addEventListener("click", () => {
      if (isAnimating) return;
      
      isAnimating = true;
      
      
      createConfetti();
      
      tipContent.classList.add('fade-out');
      
      const btnIcon = newTipBtn.querySelector('i');
      if (btnIcon) {
        btnIcon.style.animation = 'iconSpinOnce 0.8s ease-in-out';
      }
      
      setTimeout(() => {
        const newTip = getRandomTip();
        updateTipContent(newTip);
        
        tipContent.classList.remove('fade-out');
        tipContent.classList.add('fade-in');
        
        setTimeout(() => {
          tipContent.classList.remove('fade-in');
          isAnimating = false;
          
          if (btnIcon) {
            btnIcon.style.animation = '';
          }
        }, 600);
      }, 400);
    });
  }
});



function sharetowa() {
  const url = window.location.href;
  const text = "Yuk, cek jejak karbonmu dan pelajari cara hidup lebih ramah lingkungan di TerraPulse: " + url;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
}

function sharetox() {
  const url = window.location.href;
  const text = "Yuk, cek jejak karbonmu dan pelajari cara hidup lebih ramah lingkungan di TerraPulse!";
  const xUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

window.open(xUrl, '_blank');
}

function sharetofb() {
  const url = window.location.href;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

window.open(facebookUrl, '_blank');
}

function sharetolinkedin() {
  const url = window.location.href;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

window.open(linkedInUrl, '_blank');
}



const quizData = [
  {
    question: "Apa yang dimaksud dengan 'Jejak Karbon' (Carbon Footprint)?",
    options: [
      "Bekas tapak kaki manusia di tanah yang mengandung karbon.",
      "Total emisi gas rumah kaca yang dihasilkan oleh aktivitas manusia.",
      "Jumlah pohon yang ditebang untuk kebutuhan industri.",
      "Proses pembersihan polusi udara menggunakan teknologi filter."
    ],
    correct: 1
  },
  {
    question: "Manakah dari berikut ini yang merupakan contoh sumber energi terbarukan?",
    options: [
      "Batubara dan Gas Alam.",
      "Minyak Bumi dan Nuklir.",
      "Matahari, Angin, dan Air.",
      "Bensin dan Diesel."
    ],
    correct: 2
  },
  {
    question: "Prinsip '3R' dalam pengelolaan limbah adalah singkatan dari...",
    options: [
      "Release, Recover, Reuse",
      "Reduce, Reuse, Recycle",
      "Remove, Repair, Replace",
      "Rethink, Recharge, Relax" 
    ],
    correct: 1
  },
  {
    question: "Gas rumah kaca yang paling banyak dihasilkan dari aktivitas manusia (terutama pembakaran bahan bakar fosil) adalah",
    options: [
      "Metana (CH₄)",
      "Nitrogen Oksida (N₂O)",
      "Karbondioksida (CO₂)",
      "Ozon (O₃)"
    ],
    correct: 2
  },
  {
    question: "Apa dampak utama dari mencairnya es di kutub akibat pemanasan global?",
    options: [
      "Penurunan curah hujan secara global.",
      "Kenaikan permukaan air laut.",
      "Berkurangnya jumlah garam di seluruh samudera.",
      "Terbentuknya daratan baru di tengah laut."
    ],
    correct: 1
  },
  {
    question: 'Konsep "Sustainability" atau Keberlanjutan berarti...',
    options: [
      "Menggunakan semua sumber daya alam secepat mungkin untuk kemajuan ekonomi.",
      "Menghentikan seluruh aktivitas industri di dunia.",
      "Memenuhi kebutuhan saat ini tanpa mengorbankan kemampuan generasi mendatang untuk memenuhi kebutuhan mereka.",
      "Membuang sampah pada tempatnya hanya jika ada petugas kebersihan."
    ],
    correct: 2
  },
  {
    question: "Fenomena di mana panas matahari terperangkap di atmosfer bumi disebut",
    options: [
      "Efek Rumah Kaca",
      "El Nino",
      "Fotosintesis",
      "Deforestasi"
    ],
    correct: 0
  },
  {
    question: "Manakah tindakan berikut yang paling mendukung gaya hidup eco-friendly?",
    options: [
      "Menggunakan kantong plastik sekali pakai setiap belanja.",
      "Membiarkan lampu tetap menyala saat meninggalkan ruangan.",
      "Membawa botol minum sendiri (tumbler) untuk mengurangi sampah plastik.",
      "Membakar sampah di halaman belakang rumah."
    ],
    correct: 2
  },
  {
    question: "Apa yang dimaksud dengan 'Deforestasi'?",
    options: [
      "Penanaman kembali hutan yang gundul.",
      "Penebangan hutan secara besar-besaran untuk dialihfungsikan.",
      "Proses pembersihan sungai dari sampah plastik.",
      "Perlindungan hewan langka di habitat aslinya."
    ],
    correct: 1
  },
  {
    question: "Apa tujuan utama dari Kesepakatan Paris (Paris Agreement)?",
    options: [
      "Menghapus penggunaan kendaraan bermotor di seluruh dunia.",
      "Menahan laju kenaikan suhu global di bawah 2°C.",
      "Membagi wilayah kutub untuk industri pariwisata.",
      "Mewajibkan setiap rumah menanam minimal 100 pohon."
    ],
    correct: 1
  }
];

const introSection = document.getElementById("quiz-intro");
const quizBox = document.getElementById("quiz-box");
const resultSection = document.getElementById("quiz-result");

const startBtn = document.getElementById("start-quiz");
const playAgainBtn = document.getElementById("play-again-btn");

const questionEl = document.getElementById("question-text");
const optionsEl = document.querySelector(".options");
const progressBar = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const questionNumberEl = document.getElementById("question-number");

const finalScoreEl = document.getElementById("final-score");
const scoreMessageEl = document.getElementById("score-message");

let correctSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
let wrongSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
correctSound.volume = 0.5;
wrongSound.volume = 0.5;

let currentIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval = null;
let answered = false;


startBtn.addEventListener("click", () => {
  introSection.classList.remove("active");
  quizBox.classList.add("active");
  loadQuestion();
});


function loadQuestion() {
  clearInterval(timerInterval);
  answered = false;

  const q = quizData[currentIndex];

  questionEl.textContent = q.question;
  questionNumberEl.textContent = `Soal ${currentIndex + 1}/${quizData.length}`;
  optionsEl.innerHTML = "";

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;

    btn.addEventListener("click", () => selectAnswer(index));
    optionsEl.appendChild(btn);
  });

  updateProgress();
  startTimer();
}


function selectAnswer(index) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);

  const correctIndex = quizData[currentIndex].correct;
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) {
      btn.classList.add("correct");
    }
    if (i === index && i !== correctIndex) {
      btn.classList.add("wrong");
    }
  });

 
  if (index === correctIndex) {
    score += 10;
    correctSound.play().catch(err => console.log('Sound play failed:', err));
  } else {
    wrongSound.play().catch(err => console.log('Sound play failed:', err));
  }


  setTimeout(() => {
    if (currentIndex < quizData.length - 1) {
      currentIndex++;
      loadQuestion();
    } else {
      finishQuiz();
    }
  }, 1500);
}

function startTimer() {
  timeLeft = 30;
  timerEl.textContent = `⏱ ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱ ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      revealAnswer();
    }
  }, 1000);
}

function revealAnswer() {
  if (answered) return;
  answered = true;

  const correctIndex = quizData[currentIndex].correct;
  document.querySelectorAll(".option-btn").forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add("correct");
  });

  wrongSound.play().catch(err => console.log('Sound play failed:', err));

  setTimeout(() => {
    if (currentIndex < quizData.length - 1) {
      currentIndex++;
      loadQuestion();
    } else {
      finishQuiz();
    }
  }, 1500);
}


function updateProgress() {
  progressBar.style.width =
    ((currentIndex + 1) / quizData.length) * 100 + "%";
}


function finishQuiz() {
  clearInterval(timerInterval);
  quizBox.classList.remove("active");
  resultSection.classList.add("active");

  finalScoreEl.textContent = `Skor: ${score / 10}/10`;

  scoreMessageEl.textContent =
    score >= 80
      ? "🌟 Luar biasa! Kamu Eco Hero sejati!"
      : score >= 50
      ? "💚 Bagus! Terus tingkatkan kepedulianmu."
      : "🌱 Yuk belajar lagi, perubahan dimulai dari kecil!";
}


playAgainBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  currentIndex = 0;
  score = 0;

  resultSection.classList.remove("active");
  introSection.classList.add("active");
  progressBar.style.width = "0%";
});
function updateUcapan() {
      const sekarang = new Date();
      const jam = sekarang.getHours();
      let ucapan = "";

      if (jam >= 3 && jam < 12) {
        ucapan = "Selamat Pagi!";
      } else if (jam >= 12 && jam < 16) {
        ucapan = "Selamat Siang!";
      } else if (jam >= 15 && jam < 19) {
        ucapan = "Selamat Sore!";
      } else {
        ucapan = "Selamat Malam!";
      }

      document.getElementById("greet1").textContent = `${ucapan} Welcome to Terrapulse`;
    }

    
    updateUcapan();

  
    setInterval(updateUcapan, 1000);

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }
});

function buyProduct(productName, price) {
  const phoneNumber = "6281996275318";
  const message = `Halo, saya ingin membeli:\n\nProduk: ${productName}\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nMohon informasi lebih lanjut. Terima kasih!`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

/* =========================================
   ⚙️ НАСТРОЙКИ
   ========================================= */
const CONFIG = {
  TG_BOT_TOKEN: '8698697175:AAH1BPfdwKIjnvopE0USkF2sr0nMvozDTJs',
  TG_CHAT_ID: '26425660',
  CARD_NUMBER: '2202 2069 5439 4065',
  UPLOAD_URL: 'php/upload.php' // Путь к скрипту загрузки
};

/* =========================================
   🎨 FLOATING BACKGROUND
   ========================================= */
function createFloatingBg() {
  const bg = document.getElementById('floatingBg');
  const emojis = ['🌸', '✨', '🫧', '💛', '🌼', '🌺', '💕', '🦋'];
  for (let i = 0; i < 30; i++) {
    const span = document.createElement('span');
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = Math.random() * 100 + '%';
    span.style.top = Math.random() * 100 + '%';
    span.style.animationDelay = Math.random() * 8 + 's';
    span.style.animationDuration = (Math.random() * 6 + 8) + 's';
    bg.appendChild(span);
  }
}
createFloatingBg();

/* =========================================
   ⏰ COUNTDOWN
   ========================================= */
const weddingDate = new Date('2026-07-31T15:00:00').getTime();

function updateTimer() {
  const now = new Date().getTime();
  const dist = weddingDate - now;
  if (dist < 0) {
    document.getElementById('cd-days').innerText = "00";
    return;
  }
  const d = Math.floor(dist / (1000 * 60 * 60 * 24));
  const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((dist % (1000 * 60)) / 1000);
  document.getElementById('cd-days').innerText = d < 10 ? '0'+d : d;
  document.getElementById('cd-hours').innerText = h < 10 ? '0'+h : h;
  document.getElementById('cd-mins').innerText = m < 10 ? '0'+m : m;
  document.getElementById('cd-secs').innerText = s < 10 ? '0'+s : s;
}
setInterval(updateTimer, 1000);
updateTimer();

/* =========================================
   📜 SCROLL ANIMATION
   ========================================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));

/* =========================================
   🧭 NAVIGATION
   ========================================= */
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      const navHeight = document.querySelector('nav').offsetHeight;
      const targetPosition = target.offsetTop - navHeight - 10;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

/* =========================================
   💳 COPY CARD NUMBER
   ========================================= */
function copyCardNumber() {
  navigator.clipboard.writeText(CONFIG.CARD_NUMBER).then(() => {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }).catch(err => {
    alert('Номер карты: ' + CONFIG.CARD_NUMBER);
  });
}

/* =========================================
   🎨 DRESS CODE
   ========================================= */
document.querySelectorAll('.color-circle').forEach(circle => {
  circle.addEventListener('click', function() {
    document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    const matches = this.getAttribute('data-matches').split(',');
    const matchContainer = document.getElementById('matchColors');
    matchContainer.innerHTML = matches.map(color => 
      `<div class="match-dot" style="background:${color}"></div>`
    ).join('');
    document.getElementById('colorMatch').classList.add('active');
  });
});

/* =========================================
   📸 PHOTO UPLOAD
   ========================================= */
let selectedFiles = [];

// Drag & Drop
const dropArea = document.getElementById('dropArea');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'), false);
});

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

document.getElementById('upload-files').addEventListener('change', function() {
  handleFiles(this.files);
});

function handleFiles(files) {
  const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
  for (let file of files) {
    if (validTypes.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|heic|heif)$/i)) {
      if (!selectedFiles.find(f => f.name === file.name)) {
        selectedFiles.push(file);
      }
    }
  }
  updateFileList();
}

function updateFileList() {
  const list = document.getElementById('file-list');
  list.innerHTML = selectedFiles.map((file, index) => `
    <div class="file-item">
      📷 ${file.name}
      <span class="remove" onclick="removeFile(${index})">×</span>
    </div>
  `).join('');
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  updateFileList();
}

async function uploadPhotos() {
  const name = document.getElementById('upload-name').value.trim();
  
  if (!name) {
    alert('Пожалуйста, введите ваше имя!');
    return;
  }
  
  if (selectedFiles.length === 0) {
    alert('Пожалуйста, выберите фото!');
    return;
  }

  const formData = new FormData();
  formData.append('guest_name', name);
  selectedFiles.forEach(file => {
    formData.append('photos[]', file);
  });

  const toast = document.getElementById('upload-toast');
  toast.classList.add('show');

  try {
    const response = await fetch(CONFIG.UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      document.getElementById('upload-form-container').style.display = 'none';
      document.getElementById('upload-success').style.display = 'block';
      fireConfetti();
    } else {
      throw new Error(result.message || 'Ошибка загрузки');
    }
  } catch (error) {
    document.getElementById('upload-error').textContent = 'Ошибка: ' + error.message;
    document.getElementById('upload-error').style.display = 'block';
  } finally {
    toast.classList.remove('show');
  }
}

/* =========================================
   🍷 RSVP - SWEETNESS
   ========================================= */
function toggleSweetness() {
  const drinks = document.getElementById('rsvp-drinks').value;
  const sweetnessBlock = document.getElementById('sweetness-block');
  if (drinks === 'wine' || drinks === 'sparkling' || drinks === 'both') {
    sweetnessBlock.style.display = 'block';
  } else {
    sweetnessBlock.style.display = 'none';
  }
}

/* =========================================
   ✅ RSVP - FORM
   ========================================= */
function selectAtt(val, btn) {
  event.preventDefault();
  event.stopPropagation();
  const scrollPos = window.scrollY;
  document.querySelectorAll('.radio-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('rsvp-att').value = val;
  document.getElementById('guests-block').style.display = val === 'yes' ? 'block' : 'none';
  document.getElementById('drinks-block').style.display = val === 'yes' ? 'block' : 'none';
  if (val === 'no') {
    document.getElementById('sweetness-block').style.display = 'none';
  }
  setTimeout(() => { window.scrollTo(0, scrollPos); }, 50);
}

document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('rsvp-name').value;
  const att = document.getElementById('rsvp-att').value;
  const guests = document.getElementById('rsvp-guests').value;
  const drinks = document.getElementById('rsvp-drinks').value;
  const sweetness = document.getElementById('rsvp-sweetness').value;
  const food = document.getElementById('rsvp-food').value;

  if(!att) { alert('Выберите вариант участия!'); return; }

  const btn = this.querySelector('button');
  btn.innerText = 'Отправка...';
  btn.disabled = true;

  const status = att === 'yes' ? '✅ Придет' : '❌ Не придет';
  
  let drinksText = '';
  if (drinks === 'wine') drinksText = '🍷 Вино';
  else if (drinks === 'sparkling') drinksText = '🥂 Игристое';
  else if (drinks === 'both') drinksText = '🍷🥂 И то, и другое';
  else drinksText = '📝 Другое';

  let sweetnessText = '';
  if (sweetness === 'dry') sweetnessText = 'Сухое';
  else if (sweetness === 'semi-dry') sweetnessText = 'Полусухое';
  else if (sweetness === 'semi-sweet') sweetnessText = 'Полусладкое';
  else if (sweetness === 'sweet') sweetnessText = 'Сладкое';

  const message = `
🎉 <b>Новый ответ RSVP!</b>
👤 <b>Гость:</b> ${name}
📝 <b>Статус:</b> ${status}
👥 <b>Гостей:</b> ${att === 'yes' ? guests : 0}
🍷 <b>Напитки:</b> ${att === 'yes' ? drinksText : '-'}
🍇 <b>Сладость:</b> ${att === 'yes' && sweetnessText ? sweetnessText : '-'}
🍽 <b>Еда:</b> ${food || 'Нет'}
  `.trim();

  if (CONFIG.TG_BOT_TOKEN && CONFIG.TG_CHAT_ID) {
    try {
      await fetch(`https://api.telegram.org/bot${CONFIG.TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          chat_id: CONFIG.TG_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
    } catch (err) {
      console.error('Ошибка Telegram:', err);
    }
  }

  const localData = JSON.parse(localStorage.getItem('rsvp') || '[]');
  localData.push({ name, att, guests, drinks, sweetness, food, date: new Date() });
  localStorage.setItem('rsvp', JSON.stringify(localData));

  document.getElementById('rsvpForm').style.display = 'none';
  document.getElementById('success-msg').style.display = 'block';
  fireConfetti();
});

/* =========================================
   🎊 CONFETTI
   ========================================= */
function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const pieces = [];
  const colors = ['#F4A4C0', '#7BB8E8', '#F2C84B', '#8BBF5A', '#F4733A'];
  
  for(let i=0; i<100; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      speed: Math.random() * 5 + 2
    });
  }
  
  function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    pieces.forEach((p, index) => {
      p.y += p.speed;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      if(p.y > canvas.height) pieces.splice(index, 1);
    });
    if(pieces.length > 0) requestAnimationFrame(draw);
  }
  draw();
}

document.querySelectorAll('.hero-dopamine span').forEach(span => {
  span.addEventListener('click', fireConfetti);
});

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('focus', function() {
    const scrollPos = window.scrollY;
    setTimeout(() => { window.scrollTo(0, scrollPos); }, 50);
  });
});

/* ========================================
   Свадебное приглашение - JavaScript
   Рита & Денис
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Таймер обратного отсчёта
    // ========================================
    
    const weddingDate = new Date('2026-07-27T15:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            // Если дата прошла
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // ========================================
    // Обработка RSVP формы
    // ========================================
    
    const rsvpForm = document.getElementById('rsvpForm');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Сбор данных формы
            const formData = new FormData(rsvpForm);
            const data = {
                name: formData.get('name'),
                guests: formData.get('guests'),
                attendance: formData.get('attendance'),
                message: formData.get('message')
            };
            
            // Здесь можно добавить отправку данных на сервер
            // Например, через fetch API или отправка в Telegram бот
            console.log('RSVP данные:', data);
            
            // Для демонстрации - сохраняем в localStorage
            const submissions = JSON.parse(localStorage.getItem('rsvpSubmissions') || '[]');
            submissions.push({
                ...data,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('rsvpSubmissions', JSON.stringify(submissions));
            
            // Показываем модальное окно подтверждения
            modal.classList.add('active');
            
            // Очищаем форму
            rsvpForm.reset();
        });
    }
    
    // Закрытие модального окна
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Закрытие по клику вне окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // ========================================
    // Кнопка загрузки фото на NAS
    // ========================================
    
    const nasLink = document.getElementById('nasLink');
    
    if (nasLink) {
        nasLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Здесь нужно указать вашу ссылку на Synology File Station
            // Пример: https://ваш-synology-address:5001/filename
            const nasUrl = prompt(
                'Перейдите в Synology File Station и откройте общую папку для загрузки фото.\n\n' +
                'Вставьте ссылку на вашу папку NAS:'
            );
            
            if (nasUrl) {
                window.open(nasUrl, '_blank');
            }
        });
    }
    
    // ========================================
    // Плавная прокрутка для якорных ссылок
    // ========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ========================================
    // Анимация при скролле (Intersection Observer)
    // ========================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами
    document.querySelectorAll('.info-card, .timeline-item, .color-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ========================================
    // Параллакс эффект для hero секции
    // ========================================
    
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }
    
});

// ========================================
// Функция для отправки данных в Telegram (опционально)
// ========================================

function sendToTelegram(message) {
    // Замените на ваши данные
    const BOT_TOKEN = 'YOUR_BOT_TOKEN';
    const CHAT_ID = 'YOUR_CHAT_ID';
    
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Отправлено в Telegram:', data);
    })
    .catch(error => {
        console.error('Ошибка отправки:', error);
    });
}

// ========================================
// Функция для экспорта данных RSVP в CSV
// ========================================

function exportRSVPToCSV() {
    const submissions = JSON.parse(localStorage.getItem('rsvpSubmissions') || '[]');
    
    if (submissions.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }
    
    let csv = 'Имя,Количество гостей,Присутствие,Сообщение,Дата отправки\n';
    
    submissions.forEach(sub => {
        const row = [
            `"${sub.name}"`,
            sub.guests,
            sub.attendance === 'yes' ? 'Приду' : 'Не приду',
            `"${sub.message || ''}"`,
            sub.timestamp
        ];
        csv += row.join(',') + '\n';
    });
    
    // Скачивание файла
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rsvp_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Для доступа из консоли
window.exportRSVP = exportRSVPToCSV;

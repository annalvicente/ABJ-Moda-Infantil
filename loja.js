// --- CONTROLE DO CARROSSEL --- // 
function moverCarrossel(direcao) {
    const track = document.getElementById('track');
    if (!track) return;
    
    const cards = track.querySelectorAll('.card');
    if (cards.length === 0) return;

    if (direcao === 1) {
        track.appendChild(cards[0]);
    } else if (direcao === -1) {
        track.insertBefore(cards[cards.length - 1], cards[0]);
    }
}

// --- MODAL DE LOGOUT --- //
function confirmarSair(urlLogout = 'logout.php') {
    const modal = document.getElementById('modalSair');
    const btnConfirmar = document.getElementById('btnConfirmarSair');
    const dropdown = document.querySelector('.dropdown-menu');
    
    if (dropdown) dropdown.style.display = 'none';
    if (btnConfirmar) btnConfirmar.href = urlLogout;
    
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('aberto');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }
}

function fecharModalSair() {
    const modal = document.getElementById('modalSair');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('aberto');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }
}

window.addEventListener('click', function(event) {
    const modalSair = document.getElementById('modalSair');
    if (event.target === modalSair) {
        fecharModalSair();
    }
});

// --- MENU HAMBÚRGUER RESPONSIVO --- //
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu') || document.querySelector('.menu-links');
    const icon = document.querySelector('.mobile-menu-btn i');
    if (!menu) return;

    menu.classList.toggle('active');
    
    if (icon) {
        if (menu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.menu-links a').forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('mobileMenu') || document.querySelector('.menu-links');
            const icon = document.querySelector('.mobile-menu-btn i');
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
});
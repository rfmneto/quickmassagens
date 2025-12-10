// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scroll
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Scroll Effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
    
    lastScroll = currentScroll;
});

// Animação de Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observar elementos
const observeElements = () => {
    const elements = document.querySelectorAll('.funciona-card, .depoimento-card, .diferencial-categoria, .info-card');
    elements.forEach(el => observer.observe(el));
};

// Formulário de Contato
const contatoForm = document.getElementById('contatoForm');
const submitBtn = contatoForm.querySelector('button[type="submit"]');

contatoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Obter dados do formulário
    const formData = new FormData(contatoForm);
    const data = Object.fromEntries(formData);
    
    // Desabilitar botão e mostrar loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        // Enviar dados para a API RESTful
        const response = await fetch('tables/contatos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: data.nome,
                telefone: data.telefone,
                email: data.email,
                servico: data.servico,
                mensagem: data.mensagem,
                data_contato: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar formulário');
        }
        
        // Mostrar mensagem de sucesso
        showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        contatoForm.reset();
        
    } catch (error) {
        // Mostrar mensagem de erro
        showMessage('Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
    } finally {
        // Reabilitar botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Enviar Mensagem';
    }
});

// Função para mostrar mensagens
function showMessage(message, type) {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.message-alert');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Criar elemento de mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-alert message-${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
        <button class="message-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar estilos
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-color)' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    messageDiv.querySelector('.message-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 5px;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(messageDiv);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

// Validação de formulário em tempo real
const inputs = contatoForm.querySelectorAll('input, select, textarea');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateField(input);
    });
    
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            validateField(input);
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remover mensagem de erro anterior
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    field.classList.remove('error', 'success');
    
    if (!value) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    // Validações específicas
    switch (fieldName) {
        case 'nome':
            if (value.length < 3) {
                showFieldError(field, 'Nome deve ter pelo menos 3 caracteres');
                return false;
            }
            break;
            
        case 'telefone':
            const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Formato de telefone inválido');
                return false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'E-mail inválido');
                return false;
            }
            break;
    }
    
    field.classList.add('success');
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.9rem;
        margin-top: 5px;
        display: block;
    `;
    
    field.parentElement.appendChild(errorDiv);
}

// Formatação de telefone
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
        value = `(${value}`;
    }
    
    e.target.value = value;
});

// Scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: var(--shadow);
    transition: var(--transition);
    opacity: 0;
    visibility: hidden;
    z-index: 1000;
`;

document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

// Carregar depoimentos dinamicamente
async function loadDepoimentos() {
    try {
        const response = await fetch('tables/depoimentos?limit=5&sort=data:desc');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            const depoimentosGrid = document.querySelector('.depoimentos-grid');
            depoimentosGrid.innerHTML = '';
            
            data.data.forEach(depoimento => {
                const depoimentoCard = createDepoimentoCard(depoimento);
                depoimentosGrid.appendChild(depoimentoCard);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar depoimentos:', error);
    }
}

function createDepoimentoCard(depoimento) {
    const card = document.createElement('div');
    card.className = 'depoimento-card fade-in-up';
    
    const dataFormatada = new Date(depoimento.data).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });
    
    card.innerHTML = `
        <div class="depoimento-header">
            <div class="cliente-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="cliente-info">
                <h4>${depoimento.nome}</h4>
                <div class="avaliacao">
                    ${generateStars(depoimento.avaliacao)}
                </div>
            </div>
        </div>
        <p class="depoimento-texto">"${depoimento.depoimento}"</p>
        <span class="depoimento-data">${dataFormatada}</span>
    `;
    
    return card;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? '' : 'text-muted'}"></i>`;
    }
    return stars;
}

// Inicializar tooltips para os ícones sociais
function initTooltips() {
    const socialLinks = document.querySelectorAll('.info-icon a[href*="instagram.com"]');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Criar tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'social-tooltip';
            tooltip.textContent = 'Siga-nos no Instagram';
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            // Posicionar tooltip
            const rect = link.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            // Mostrar tooltip com animação
            setTimeout(() => tooltip.style.opacity = '1', 10);
            
            // Remover tooltip após sair
            link.addEventListener('mouseleave', function removeTooltip() {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 300);
                link.removeEventListener('mouseleave', removeTooltip);
            });
        });
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    loadDepoimentos();
    initTooltips();
    
    // Adicionar animação de entrada nos elementos principais
    const mainElements = document.querySelectorAll('.hero-title, .hero-subtitle, .section-title');
    mainElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
        el.classList.add('fade-in-up');
    });
});

// Animação de slide para mensagens
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .scroll-top-btn:hover {
        background: var(--dark-color) !important;
        transform: translateY(-2px) !important;
    }
    
    .form-group input.success,
    .form-group select.success,
    .form-group textarea.success {
        border-color: var(--accent-color) !important;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c !important;
    }
    
    .text-muted {
        color: #ccc !important;
    }
`;
document.head.appendChild(style);
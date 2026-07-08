document.addEventListener('DOMContentLoaded', function () {

    /* MENU HAMBURGUER */
    const menuHamburguer = document.getElementById('menu-hamburguer');
    const navMenu = document.getElementById('nav-menu');

    function adicionarBotaoMobile() {
        if (!navMenu) return;
        const btnExistente = navMenu.querySelector('.btn-topo-mobile');
        if (!btnExistente) {
            const btnMobile = document.createElement('a');
            btnMobile.href = '#';
            btnMobile.className = 'btn-topo-mobile';
            btnMobile.textContent = 'AGENDAR HORÁRIO';
            btnMobile.addEventListener('click', (e) => {
                e.preventDefault();
                abrirModalAgendamento();
                fecharMenu();
            });
            navMenu.appendChild(btnMobile);
        }
    }

    if (window.innerWidth <= 768) adicionarBotaoMobile();

    if (menuHamburguer) {
        menuHamburguer.addEventListener('click', () => {
            menuHamburguer.classList.toggle('ativo');
            if (navMenu) navMenu.classList.toggle('ativo');
        });
    }

    function fecharMenu() {
        if (menuHamburguer) menuHamburguer.classList.remove('ativo');
        if (navMenu) navMenu.classList.remove('ativo');
    }

    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', fecharMenu));
    }

    document.addEventListener('click', (e) => {
        if (navMenu && menuHamburguer) {
            if (!navMenu.contains(e.target) && !menuHamburguer.contains(e.target)) fecharMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (!navMenu) return;
        const btnMobile = navMenu.querySelector('.btn-topo-mobile');
        if (window.innerWidth <= 768) {
            if (!btnMobile) adicionarBotaoMobile();
        } else {
            if (btnMobile) btnMobile.remove();
            if (navMenu.classList.contains('ativo')) fecharMenu();
        }
    });

    if (navMenu) {
        navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    /* MODAL DE AGENDAMENTO */
    const modal = document.getElementById('modal-agendamento');
    const btnFecharModal = document.getElementById('fechar-modal');
    const formAgendamento = document.getElementById('form-agendamento');
    const btnWhatsApp = document.getElementById('btn-enviar-whatsapp');
    const NUMERO_WHATSAPP = '5551993811732';

    function abrirModalAgendamento() {
        if (!modal) return;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        const hoje = new Date();
        const dataFormatada = hoje.toISOString().split('T')[0];
        const inputData = document.getElementById('data-agendamento');
        if (inputData) inputData.min = dataFormatada;
    }

    function fecharModalAgendamento() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (formAgendamento) formAgendamento.reset();
        const badge = document.getElementById('badge-confirmacao');
        if (badge) badge.style.display = 'none';
        if (btnWhatsApp) {
            btnWhatsApp.style.display = 'flex';
            btnWhatsApp.disabled = false;
            const span = btnWhatsApp.querySelector('span');
            if (span) span.textContent = 'Agendar via WhatsApp';
            const spinner = btnWhatsApp.querySelector('.spinner');
            if (spinner) spinner.style.display = 'none';
        }
    }

    document.querySelectorAll('.btn-topo, .btn-central').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault(); abrirModalAgendamento(); });
    });

    if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModalAgendamento);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) fecharModalAgendamento(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.style.display === 'flex') fecharModalAgendamento(); });

    /* MÁSCARA TELEFONE */
    const telefoneCliente = document.getElementById('telefone-cliente');
    if (telefoneCliente) {
        telefoneCliente.addEventListener('input', function () {
            let valor = this.value.replace(/\D/g, '');
            if (valor.length > 11) valor = valor.slice(0, 11);
            let formatado = '';
            if (valor.length > 0) {
                formatado = '(' + valor.substring(0, 2);
                if (valor.length > 2) formatado += ') ' + valor.substring(2, 7);
                if (valor.length > 7) formatado += '-' + valor.substring(7, 11);
            }
            this.value = formatado;
        });
    }

    /* ENVIO AGENDAMENTO */
    if (formAgendamento && btnWhatsApp) {
        formAgendamento.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome = document.getElementById('nome-cliente').value.trim();
            const telefone = document.getElementById('telefone-cliente').value.trim();
            const servico = document.getElementById('servico-agendamento').value;
            const data = document.getElementById('data-agendamento').value;
            const hora = document.getElementById('hora-agendamento').value;
            const obs = document.getElementById('obs-agendamento').value.trim();

            let temErro = false;

            if (!nome) {
                document.getElementById('nome-cliente').classList.add('erro-input');
                temErro = true;
            } else {
                document.getElementById('nome-cliente').classList.remove('erro-input');
            }

            if (!telefone || telefone.replace(/\D/g, '').length < 10) {
                document.getElementById('telefone-cliente').classList.add('erro-input');
                temErro = true;
            } else {
                document.getElementById('telefone-cliente').classList.remove('erro-input');
            }

            if (!servico) {
                document.getElementById('servico-agendamento').classList.add('erro-input');
                temErro = true;
            } else {
                document.getElementById('servico-agendamento').classList.remove('erro-input');
            }

            if (!data) {
                document.getElementById('data-agendamento').classList.add('erro-input');
                temErro = true;
            } else {
                document.getElementById('data-agendamento').classList.remove('erro-input');
            }

            if (!hora) {
                document.getElementById('hora-agendamento').classList.add('erro-input');
                temErro = true;
            } else {
                document.getElementById('hora-agendamento').classList.remove('erro-input');
            }

            if (temErro) {
                alert('⚠️ Por favor, preencha todos os campos obrigatórios corretamente.');
                return;
            }

            const dataObj = new Date(data + 'T' + hora);
            const dataFormatadaExibicao = dataObj.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            const horaFormatada = hora.substring(0, 5);

            let mensagem = `NOVO AGENDAMENTO - ALFA BRILHO ESTÉTICA%0A%0A`;
            mensagem += `Cliente: ${nome}%0A`;
            mensagem += `Telefone: ${telefone}%0A`;
            mensagem += `Serviço: ${servico}%0A`;
            mensagem += `Data: ${dataFormatadaExibicao}%0A`;
            mensagem += `Horário: ${horaFormatada}%0A`;

            if (obs) {
                mensagem += `Observações: ${obs}%0A`;
            }

            mensagem += `%0ACliente aguarda confirmação!`;

            const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensagem}`;

            btnWhatsApp.disabled = true;
            const span = btnWhatsApp.querySelector('span');
            if (span) span.textContent = 'Abrindo WhatsApp...';
            const spinner = btnWhatsApp.querySelector('.spinner');
            if (spinner) spinner.style.display = 'block';

            setTimeout(() => {
                window.open(urlWhatsApp, '_blank');
                const badge = document.getElementById('badge-confirmacao');
                if (badge) badge.style.display = 'block';
                btnWhatsApp.style.display = 'none';

                setTimeout(() => {
                    btnWhatsApp.disabled = false;
                    if (span) span.textContent = 'Agendar via WhatsApp';
                    if (spinner) spinner.style.display = 'none';
                }, 3000);
            }, 1500);
        });
    }

    /* FORMULÁRIO DE CONTATO */
    const formContato = document.getElementById('form-contato');
    const btnEnviarContato = document.getElementById('btn-enviar-contato');
    const loadingContato = document.querySelector('.loading-contato');
    const sucessoContato = document.querySelector('.sucesso-contato');

    if (formContato && btnEnviarContato) {
        formContato.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome = document.getElementById('contato-nome').value.trim();
            const email = document.getElementById('contato-email').value.trim();
            const telefone = document.getElementById('contato-telefone').value.trim();
            const mensagem = document.getElementById('contato-mensagem').value.trim();

            if (!nome) {
                alert('⚠️ Por favor, digite seu nome.');
                document.getElementById('contato-nome').focus();
                return;
            }

            if (!email) {
                alert('⚠️ Por favor, digite seu e-mail.');
                document.getElementById('contato-email').focus();
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                alert('⚠️ Por favor, digite um e-mail válido.');
                document.getElementById('contato-email').focus();
                return;
            }

            if (!mensagem) {
                alert('⚠️ Por favor, digite sua mensagem.');
                document.getElementById('contato-mensagem').focus();
                return;
            }

            if (loadingContato) {
                loadingContato.style.display = 'block';
            }
            if (sucessoContato) {
                sucessoContato.style.display = 'none';
            }
            btnEnviarContato.disabled = true;
            btnEnviarContato.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            let msgWhats = `Nova mensagem do site - ALFA BRILHO ESTÉTICA%0A%0A`;
            msgWhats += `Nome: ${nome}%0A`;
            msgWhats += `E-mail: ${email}%0A`;
            if (telefone) {
                msgWhats += `Telefone: ${telefone}%0A`;
            }
            msgWhats += `Mensagem: ${mensagem}%0A%0A`;
            msgWhats += `Enviado em: ${new Date().toLocaleString('pt-BR')}`;

            const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${msgWhats}`;

            setTimeout(() => {
                window.open(urlWhatsApp, '_blank');
                if (loadingContato) {
                    loadingContato.style.display = 'none';
                }
                if (sucessoContato) {
                    sucessoContato.style.display = 'block';
                }

                btnEnviarContato.disabled = false;
                btnEnviarContato.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar via WhatsApp';
                formContato.reset();

                setTimeout(() => {
                    if (sucessoContato) {
                        sucessoContato.style.display = 'none';
                    }
                }, 6000);
            }, 1000);
        });
    }

    /* MÁSCARA TELEFONE */
    const contatoTelefone = document.getElementById('contato-telefone');
    if (contatoTelefone) {
        contatoTelefone.addEventListener('input', function () {
            let valor = this.value.replace(/\D/g, '');
            if (valor.length > 11) valor = valor.slice(0, 11);
            let formatado = '';
            if (valor.length > 0) {
                formatado = '(' + valor.substring(0, 2);
                if (valor.length > 2) formatado += ') ' + valor.substring(2, 7);
                if (valor.length > 7) formatado += '-' + valor.substring(7, 11);
            }
            this.value = formatado;
        });
    }

    /* CLICK NO WHATSAPP DA SEÇÃO CONTATO */
    document.querySelectorAll('.info p i.fa-whatsapp').forEach(icon => {
        icon.parentElement.addEventListener('click', function (e) {
            const numero = this.textContent.trim().replace(/\D/g, '');
            if (numero) {
                window.open(`https://wa.me/55${numero}`, '_blank');
            }
        });
    });

    /* LIGHTBOX */
    const lightbox = document.getElementById('lightbox');
    const lightboxImagem = document.getElementById('lightbox-imagem');
    const lightboxLegenda = document.getElementById('lightbox-legenda');
    const lightboxFechar = document.getElementById('lightbox-fechar');

    const imagensGaleria = document.querySelectorAll('.galeria-grid img');
    imagensGaleria.forEach(img => {
        img.addEventListener('click', function () {
            if (!lightbox || !lightboxImagem) return;
            lightbox.classList.add('ativo');
            lightbox.style.display = 'flex';
            lightboxImagem.src = this.src;
            lightboxLegenda.textContent = this.getAttribute('alt') || 'Imagem';
            document.body.style.overflow = 'hidden';
        });
    });

    function fecharLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('ativo');
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (lightboxFechar) lightboxFechar.addEventListener('click', fecharLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) fecharLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('ativo')) fecharLightbox();
    });

    /* CARROSSEL */
    const carContainer = document.querySelector('.carrossel-container');
    const slidesWrapper = document.getElementById('carrossel-slides');
    const slides = Array.from(document.querySelectorAll('.carrossel-slide'));
    const indicadores = Array.from(document.querySelectorAll('.carrossel-indicadores .indicador'));
    const btnPrev = document.getElementById('carrossel-prev');
    const btnNext = document.getElementById('carrossel-next');

    if (carContainer && slidesWrapper && slides.length > 0) {
        let index = 0;
        const total = slides.length;
        let intervalMs = 5000;
        let timer = null;
        let direction = 1;

        function atualizar() {
            slidesWrapper.style.transform = `translateX(-${index * 100}%)`;
            indicadores.forEach((d, i) => d.classList.toggle('ativo', i === index));
        }

        function goTo(i) { index = (i + total) % total; atualizar(); }
        function next() { goTo(index + 1); }
        function prev() { goTo(index - 1); }

        function startAutoplay() { stopAutoplay(); timer = setInterval(() => { if (direction === 1) next(); else prev(); }, intervalMs); }
        function stopAutoplay() { if (timer) { clearInterval(timer); timer = null; } }
        function restartAutoplay() { stopAutoplay(); startAutoplay(); }

        if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); restartAutoplay(); });
        if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); restartAutoplay(); });

        indicadores.forEach(dot => {
            dot.addEventListener('click', function () {
                const idx = parseInt(this.dataset.index, 10);
                if (!isNaN(idx)) { goTo(idx); restartAutoplay(); }
            });
        });

        carContainer.addEventListener('mouseenter', stopAutoplay);
        carContainer.addEventListener('mouseleave', startAutoplay);

        let startX = 0, endX = 0, threshold = 40;
        carContainer.addEventListener('touchstart', (e) => { stopAutoplay(); startX = e.touches[0].clientX; }, { passive: true });
        carContainer.addEventListener('touchmove', (e) => { endX = e.touches[0].clientX; }, { passive: true });
        carContainer.addEventListener('touchend', () => {
            const dx = endX - startX;
            if (dx > threshold) prev();
            else if (dx < -threshold) next();
            restartAutoplay();
            startX = endX = 0;
        });

        document.querySelectorAll('.carrossel-slide img').forEach(img => {
            img.addEventListener('click', function () {
                if (!lightbox || !lightboxImagem) return;
                lightbox.classList.add('ativo');
                lightbox.style.display = 'flex';
                lightboxImagem.src = this.src;
                lightboxLegenda.textContent = this.alt || '';
                document.body.style.overflow = 'hidden';
                stopAutoplay();
            });
        });

        goTo(0);
        startAutoplay();
    }

    console.log('🚀 Site Alfa Brilho carregado com sucesso!');
});
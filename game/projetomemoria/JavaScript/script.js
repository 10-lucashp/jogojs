const params = new URLSearchParams(window.location.search);

const nome = params.get('nome') || 'Jogador';

document.getElementById('usuario').textContent = nome;

alert("Bem-vindo, " + nome + "!");

const imagens = [
    'img1.jpg',
    'img2.jpg',
    'img3.jpg',
    'img4.jpg',
    'img5.jpg',
    'img6.jpg',
    'img7.jpg',
    'img8.jpg'
];

// ÁUDIOS ORIGINAIS
const audiosOriginais = [
    '../AUDIOS/ai1.mp3',
    '../AUDIOS/ai2.mp3',
    '../AUDIOS/faaah.mp3',
    '../AUDIOS/67.mp3',
    '../AUDIOS/zap.mp3',
    '../AUDIOS/tun.mp3',
    '../AUDIOS/mibombo.mp3',
    '../AUDIOS/ronaldo.mp3'
];

// LISTA TEMPORÁRIA
let audiosDisponiveis = [...audiosOriginais];

let cartas = [...imagens, ...imagens]
.sort(() => Math.random() - 0.5);

const board = document.getElementById('gameBoard');

let primeira = null;
let segunda = null;
let bloqueio = false;

let jogadas = 0;
let acertos = 0;
let segundos = 0;

let audioTocado = false;

const cronometro = setInterval(() => {

    segundos++;

    let min = Math.floor(segundos / 60);

    let seg = segundos % 60;

    min = String(min).padStart(2, '0');

    seg = String(seg).padStart(2, '0');

    document.getElementById('timer').textContent =
    `${min}:${seg}`;

    // RISADA COM 1 MINUTO
    if (segundos >= 60 && !audioTocado) {

        audioTocado = true;

        const audioTempo = document.getElementById('somTempo');

        audioTempo.currentTime = 0;

        audioTempo.play().catch(error => {
            console.log("Erro ao tocar áudio");
        });

        const mensagem = document.createElement('div');

        mensagem.innerText = 'lento demais betinha 🤣🫵🫵';

        mensagem.style.position = 'fixed';

        mensagem.style.top = '50%';

        mensagem.style.left = '50%';

        mensagem.style.transform = 'translate(-50%, -50%)';

        mensagem.style.background = 'black';

        mensagem.style.color = 'white';

        mensagem.style.padding = '20px 30px';

        mensagem.style.fontSize = '32px';

        mensagem.style.fontWeight = 'bold';

        mensagem.style.borderRadius = '15px';

        mensagem.style.zIndex = '9999';

        mensagem.style.textAlign = 'center';

        document.body.appendChild(mensagem);

        setTimeout(() => {

            mensagem.remove();

        }, 4000);
    }

}, 1000);

cartas.forEach(img => {

    let carta = document.createElement('div');

    carta.className = 'card';

    carta.dataset.img = img;

    carta.innerHTML = `
        <div class="back">?</div>

        <div class="front">
            <img src="../IMG/${img}">
        </div>
    `;

    carta.onclick = () => virar(carta);

    board.appendChild(carta);

});

function virar(carta) {

    if (
        bloqueio ||
        carta === primeira ||
        carta.classList.contains('flip')
    ) return;

    carta.classList.add('flip');

    if (!primeira) {

        primeira = carta;

        return;
    }

    segunda = carta;

    bloqueio = true;

    jogadas++;

    document.getElementById('jogadas').textContent = jogadas;

    if (primeira.dataset.img === segunda.dataset.img) {

        // RECARREGA ÁUDIOS
        if (audiosDisponiveis.length === 0) {

            audiosDisponiveis = [...audiosOriginais];
        }

        // ESCOLHE ÁUDIO ALEATÓRIO
        const indiceAleatorio =
        Math.floor(Math.random() * audiosDisponiveis.length);

        const audioAleatorio =
        audiosDisponiveis[indiceAleatorio];

        // REMOVE O ÁUDIO UTILIZADO
        audiosDisponiveis.splice(indiceAleatorio, 1);

        // TOCA O ÁUDIO
        const som = document.getElementById('somAcerto');

        som.src = audioAleatorio;

        som.currentTime = 0;

        som.play().catch(error => {
            console.log("Erro ao tocar áudio");
        });

        acertos++;

        primeira = null;

        segunda = null;

        bloqueio = false;

        verificarVitoria();

    } else {

        setTimeout(() => {

            primeira.classList.remove('flip');

            segunda.classList.remove('flip');

            primeira = null;

            segunda = null;

            bloqueio = false;

        }, 1000);
    }
}

function verificarVitoria() {

    if (acertos === 8) {

        clearInterval(cronometro);

        // TOCA ÁUDIO DE VITÓRIA
        const somVitoria = document.getElementById('somVitoria');

        somVitoria.currentTime = 0;

        somVitoria.play().catch(error => {
            console.log("Erro ao tocar áudio");
        });

        let min = Math.floor(segundos / 60);

        let seg = segundos % 60;

        min = String(min).padStart(2, '0');

        seg = String(seg).padStart(2, '0');

        setTimeout(() => {

            alert(
`PARABÉNS ${nome}!!

Você venceu!

Tempo: ${min}:${seg}

Jogadas: ${jogadas}`
            );

        }, 1000);
    }
}

function reiniciar() {

    location.reload();

}
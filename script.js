fetch('Img/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        setTimeout(() => {
          showDedicationText();
          startFloatingObjects();
          showCountdown();
          playBackgroundMusic(); // Aquí se inicia el audio desde el video
        }, 1200);
      }, totalDuration);
    }, 50);

    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() {
  let text = getURLParam('text');
  if (!text) {
    text = `Para ti mi amor:\n\nDesde el primer momento supe que eras tú. Tu sonrisa, tu voz, tu forma de ser… todo en ti me hace sentir que lo tengo todo.\n\nGracias por acompañarme en cada paso, por entenderme incluso en silencio, y por llenar mis días de amor.\n\nTe amo más de lo que mis palabras pueden expresar.`;
  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      setTimeout(showSignature, 600);
    }
  }
  type();
}

function showSignature() {
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con amor, Tu Cochinito";
  signature.classList.add('visible');
}

function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

function showCountdown() {
  const container = document.getElementById('countdown');
  const startDate = new Date('2025-05-15T00:00:00');

  function getNextAnniversary() {
    const now = new Date();
    let next = new Date(now.getFullYear(), now.getMonth(), 15);
    if (now > next) {
      next = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    }
    next.setHours(0, 0, 0, 0);
    return next;
  }

  function update() {
    const now = new Date();
    const diff = now - startDate;
    const daysTogether = Math.floor(diff / (1000 * 60 * 60 * 24));
    const nextAnniversary = getNextAnniversary();
    const eventDiff = nextAnniversary - now;

    const eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    const eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    const eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    const eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `Llevamos juntos: <b>${daysTogether}</b> días<br>` +
      `Próximo mesario: <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;
    container.classList.add('visible');
  }

  update();
  setInterval(update, 1000);
}

function playBackgroundMusic() {
  let video = document.getElementById('bg-video');
  if (!video) {
    video = document.createElement('video');
    video.id = 'bg-video';
    video.src = 'Music/amorcito.mp4';
    video.loop = true;
    video.volume = 0.7;
    video.muted = true; // Autoplay permitido
    video.setAttribute('playsinline', '');
    video.style.display = 'none';
    document.body.appendChild(video);
  }

  const tryPlay = () => {
    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('🎵 Música reproduciéndose automáticamente desde amorcito.mp4');
      }).catch((error) => {
        console.warn('⚠️ Autoplay falló:', error);
      });
    }
  };

  tryPlay();
}

window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});

// Mostrar u ocultar panel al hacer clic en la carta
document.getElementById('note-trigger').addEventListener('click', () => {
  const panel = document.getElementById('note-panel');
  panel.classList.toggle('show');
  if (panel.classList.contains('show')) {
    showDailyNote(); // Cargar nota del día cuando se abre
  }
});

// Función que muestra el mensaje del día
function showDailyNote() {
  const content = document.getElementById('note-content');
  const today = new Date();
  const dateKey = today.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // Mensajes por fecha
  const dailyNotes = {
    '2025-06-19': 'Quiero que recuerdes siempre que no estás sola. Estoy contigo en cada paso, en cada meta, en cada caída también. Si en algún momento el mundo se vuelve oscuro, yo seré tu luz. Si sientes frío, yo seré tu abrigo. Si sientes que todo pesa, deja que lo cargue contigo.No me importan las distancias, los tiempos o los miedos. Me importas tú, y mientras tú estés, yo estaré. Mi amor no conoce condiciones ni límites, solo sabe acompañarte y abrazarte en todo momento.Eres mi razón de lucha, de risa, de ternura… y por sobre todo, de amor.',

    '2025-06-20': 'Quiero que sepas que cada día que pasa, mi amor por ti crece de formas que ni yo mismo comprendo. Desde que llegaste a mi vida, todo tiene más sentido, más luz, más color. En ti encontré no solo a la mujer que amo, sino a mi compañera, mi amiga, mi complice. Si algún día dudas de algo, por favor que nunca sea de cuánto te amo. Estoy aquí para ti en cada alegría y en cada tormenta, porque amarte no es una decisión, es mi naturaleza. Gracias por existir y por dejarme caminar contigo. Te amo más de lo que mis palabras pueden expresar',

    '2025-06-21': 'Hay cosas en la vida que simplemente llegan sin avisar, y tú fuiste lo más maravilloso que me pasó sin buscarlo. Desde que entraste a mi vida, me enseñaste lo que significa el verdadero amor. Con tus gestos, con tus palabras, con tu esencia.A tu lado aprendí a ser más paciente, más tierno, más feliz. Eres mi lugar seguro, ese al que quiero volver siempre. No importa lo que venga, lo enfrentaré todo mientras estés conmigo.Te amo tanto, que ni mil palabras alcanzarían para explicarlo. Eres lo mejor que me ha pasado y lo único que quiero cuidar con todo mi corazón.',

    '2025-06-22': 'Hoy quiero hacerte una promesa: voy a estar contigo en cada amanecer, en cada logro, en cada tristeza, en cada sueño que quieras alcanzar. No solo soy tu pareja, soy tu admirador silencioso, tu apoyo constante y tu refugio.Tú mereces amor sin medidas, respeto sin condiciones y compañía sin tiempos. Y eso es lo que te daré, porque amar es acompañar incluso cuando no se dice nada.Gracias por tu dulzura, por tu entrega, por dejarme formar parte de tu mundo. No sé qué hice para merecerte, pero sí sé que no quiero perderte nunca. Te amo con todo lo que soy y con todo lo que aún me falta ser.',
    
    // Puedes seguir agregando más días con frases personalizadas
  };

  // Mostrar mensaje si existe para hoy
  if (dailyNotes[dateKey]) {
    content.innerHTML = `
      <p>${dailyNotes[dateKey]}</p>
      <small style="display:block;margin-top:10px;text-align:right;">📅 ${dateKey}</small>
    `;
  } else {
    content.innerHTML = `<p>No hay nota especial para hoy. Vuelve mañana ✨</p>`;
  }
}


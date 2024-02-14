document.addEventListener('DOMContentLoaded', () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  let backgroundMusic;
  let audioPlayed = false;

  function startAudio() {
    if (!audioPlayed && audioContext.state === 'suspended') {
      audioContext.resume();
    }

    if (!backgroundMusic) {
      fetch('Starry Night (Piano).mp3') 
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          backgroundMusic = audioContext.createBufferSource();
          backgroundMusic.buffer = audioBuffer;
          backgroundMusic.loop = true; 
          backgroundMusic.connect(audioContext.destination);
          backgroundMusic.start(0);
          audioPlayed = true;
        }).catch(e => console.error("Error with decoding audio data", e));
    }
  }

  ['click', 'keydown', 'touchstart', 'mouseover'].forEach(eventType => {
    window.addEventListener(eventType, startAudio, { once: true });
  });

  const noButton = document.querySelector('.no-btn');
  const notification = document.querySelector('#notification');
  const messages = [
    "Ooh sorry!",
    "Nope, pick again",
    "Wrong button",
    "Almost had it!",
    "Too slow!",
    "Really?"
  ];

  let hideTimeout = null;

  function teleportButton() {
    shootHeartsFromButton();
    
    setTimeout(() => {
      const maxX = window.innerWidth - noButton.offsetWidth;
      const maxY = window.innerHeight - noButton.offsetHeight;
      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;
      noButton.style.position = 'absolute';
      noButton.style.left = randomX + 'px';
      noButton.style.top = randomY + 'px';
  
      const originalText = noButton.textContent; 
  
      setTimeout(() => {
        noButton.textContent = originalText; 
      }, 1000);
  
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      notification.textContent = randomMessage;
      notification.style.visibility = 'visible';
  
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
  
      hideTimeout = setTimeout(() => {
        notification.style.visibility = 'hidden';
      }, 2000);
    }, 200); 
  }
  
function shootHeartsFromButton() {
  const numberOfHearts = 10; 

  for (let i = 0; i < numberOfHearts; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    document.body.appendChild(heart);

    const rect = noButton.getBoundingClientRect();
    const heartX = rect.left + noButton.offsetWidth / 2;
    const heartY = rect.top + noButton.offsetHeight / 2;

    heart.style.left = `${heartX}px`;
    heart.style.top = `${heartY}px`;

    const angle = Math.random() * Math.PI * 2; 

    const velocity = 100 + Math.random() * 100; 
    const velocityX = Math.cos(angle) * velocity;
    const velocityY = Math.sin(angle) * velocity;

    const rotation = 40 + Math.random() * 100;
    heart.style.transform = `rotate(${rotation}deg)`;

    requestAnimationFrame(function moveHeart(time) {
      heart.style.left = `${heartX + velocityX}px`;
      heart.style.top = `${heartY + velocityY}px`;
    });
  }
}
  
  
  function isHeartInView(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  
  
  

  noButton.addEventListener('mouseenter', teleportButton);
  noButton.addEventListener('click', teleportButton);
  noButton.addEventListener('touchstart', teleportButton); 


  onload = () => {
    const c = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(c);
    }, 1000);
};
});
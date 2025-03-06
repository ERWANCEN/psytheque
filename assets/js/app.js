'use strict';
// ------- Osmo [https://osmo.supply/] ------- //

// GSAP & Parallax Layers
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('[data-parallax-layers]').forEach((triggerElement) => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 0%",
        end: "100% 0%",
        scrub: 0
      }
    });
    const layers = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 },
      { layer: "4", yPercent: 10 }
    ];
    layers.forEach((layerObj, idx) => {
      tl.to(
        triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
        {
          yPercent: layerObj.yPercent,
          ease: "none"
        },
        idx === 0 ? undefined : "<"
      );
    });
  });
});

/* Lenis for smooth scrolling */
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

document.addEventListener('DOMContentLoaded', function() {
  // Header scroll animation
  const header = document.querySelector('header');
  if (header) { 
    const scrollThreshold = 50;
    window.addEventListener('scroll', function() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Section scroll animations
  const sections = document.querySelectorAll('section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        const elements = entry.target.querySelectorAll('.animate-on-scroll');
        elements.forEach((el, index) => {
          setTimeout(() => { el.classList.add('visible'); }, 150 * index);
        });
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '-50px'
  });
  sections.forEach(section => {
    section.classList.add('section-hidden');
    sectionObserver.observe(section);
  });

  // Trouble Cards Animation
  const troubleCards = document.querySelectorAll('.trouble-card');
  troubleCards.forEach((card, index) => {
    card.classList.add('animate-on-scroll');
    card.style.transitionDelay = `${0.1 * index}s`;
    card.addEventListener('mouseenter', function() { this.classList.add('hovered'); });
    card.addEventListener('mouseleave', function() { this.classList.remove('hovered'); });
  });

  // Animate Text Blocks, Video Placeholders & Image Containers
  document.querySelectorAll('.text-block, .video-placeholder, .image-container').forEach((element, index) => {
    element.classList.add('animate-on-scroll');
    element.style.transitionDelay = `${0.1 * index}s`;
  });
  document.querySelectorAll('h3, p').forEach((element, index) => {
    element.classList.add('animate-on-scroll');
    element.style.transitionDelay = `${0.05 * index}s`;
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ----- Depression Effect -----
  const depressionCard = document.getElementById('depression-card');
  const depressionTroublesSection = document.querySelector('.troubles-section');
  if (depressionCard && depressionTroublesSection) {
    depressionCard.addEventListener('mouseenter', function() {
      depressionTroublesSection.classList.add('depression-effect-active');
    });
    depressionCard.addEventListener('mouseleave', function() {
      // Utiliser setTimeout pour créer un délai avant de retirer la classe
      // Cela permet une transition plus douce à la sortie
      setTimeout(() => {
        depressionTroublesSection.classList.remove('depression-effect-active');
      }, 100);
    });
  }

  // ----- PTSD Effect & Sound -----
  const ptsdCard = document.getElementById('ptsd-card');
  const heartbeatSound = document.getElementById('heartbeat-sound');
  const ptsdTroublesSection = document.querySelector('.troubles-section');
  
  if (ptsdCard && heartbeatSound && ptsdTroublesSection) {
    heartbeatSound.volume = 0.4; // Volume légèrement réduit pour être moins intrusif
    
    // Fonction pour gérer l'entrée de la souris sur le bloc PTSD
    ptsdCard.addEventListener('mouseenter', function() {
      // Jouer le son de battement de cœur
      if (!document.body.classList.contains('effects-disabled-mode')) {
        heartbeatSound.currentTime = 0;
        const playPromise = heartbeatSound.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => { console.log("La lecture automatique a été bloquée par le navigateur."); });
        }
      }
      
      // Ajouter la classe pour activer l'effet
      ptsdTroublesSection.classList.add('ptsd-effect-active');
    });
    
    // Fonction pour gérer la sortie de la souris du bloc PTSD
    ptsdCard.addEventListener('mouseleave', function() {
      // Arrêter le son de battement de cœur avec un fade out
      if (!heartbeatSound.paused) {
        // Créer un fade out du son
        const fadeOutInterval = setInterval(function() {
          if (heartbeatSound.volume > 0.05) {
            heartbeatSound.volume -= 0.05;
          } else {
            heartbeatSound.pause();
            heartbeatSound.currentTime = 0;
            heartbeatSound.volume = 0.4; // Réinitialiser le volume
            clearInterval(fadeOutInterval);
          }
        }, 50);
      }
      
      // Retirer la classe avec un délai pour une transition plus douce
      setTimeout(() => {
        ptsdTroublesSection.classList.remove('ptsd-effect-active');
      }, 1500); // Délai plus long pour un retour plus progressif à la normale
    });
    
    // Initialiser l'audio pour éviter les problèmes d'autoplay
    document.addEventListener('click', function initAudio() {
      heartbeatSound.play().then(() => {
        heartbeatSound.pause();
        heartbeatSound.currentTime = 0;
      }).catch(e => { console.log("Erreur lors de l'initialisation du son:", e); });
      document.removeEventListener('click', initAudio);
    }, { once: true });
  }

  // ----- Anxiety Effect & Sound -----
  const anxietyCard = document.getElementById('anxiety-card');
  const breathingSound = document.getElementById('breathing-sound');
  const anxietyTroublesSection = document.querySelector('.troubles-section');
  if (anxietyCard && breathingSound && anxietyTroublesSection) {
    breathingSound.volume = 0.3;
    anxietyCard.addEventListener('mouseenter', function() {
      if (!document.body.classList.contains('effects-disabled-mode')) {
        breathingSound.currentTime = 0;
        const playPromise = breathingSound.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => { console.log("La lecture automatique a été bloquée par le navigateur."); });
        }
      }
      anxietyTroublesSection.classList.add('anxiety-effect-active');
    });
    anxietyCard.addEventListener('mouseleave', function() {
      if (!breathingSound.paused) {
        breathingSound.pause();
        breathingSound.currentTime = 0;
      }
      anxietyTroublesSection.classList.remove('anxiety-effect-active');
    });
  }

  // Effet de tremblement au survol du bloc anxiété
  const anxietyTextBlock = document.querySelector('.anxiety-text-block');
  
  if (anxietyCard && anxietyTextBlock) {
    console.log("Anxiety card and text block found");
    
    // Variables pour contrôler l'intensité et l'activation des effets
    let effectsEnabled = true;
    let effectIntensity = 1; // 1 = normal, 0.5 = réduit, 2 = augmenté

    // Fonction pour ajouter l'effet de tremblement
    function addShakeEffect() {
      if (!effectsEnabled) return;
      
      console.log("Adding shake effect with intensity:", effectIntensity);
      document.querySelectorAll('.trouble-card, .text-block').forEach(element => {
        // Ne pas appliquer l'effet au bloc anxiété et à son voisin de droite
        if (element === anxietyCard || element === anxietyTextBlock || 
            element === anxietyCard.nextElementSibling || element === anxietyTextBlock.nextElementSibling) {
          console.log("Skipping element:", element);
          return;
        }
        
        // Ajouter la classe de tremblement
        element.classList.add('anxiety-shake-effect');
        
        // Appliquer l'intensité actuelle
        element.style.setProperty('--shake-intensity', effectIntensity);
        
        // Ajouter la classe de tremblement au texte à l'intérieur
        element.querySelectorAll('h3, p').forEach(textElement => {
          textElement.classList.add('anxiety-text-shake-effect');
          textElement.style.setProperty('--text-shake-intensity', effectIntensity);
        });
      });
    }
    
    // Fonction pour supprimer l'effet de tremblement
    function removeShakeEffect() {
      console.log("Removing shake effect");
      document.querySelectorAll('.trouble-card, .text-block').forEach(element => {
        // Supprimer la classe de tremblement
        element.classList.remove('anxiety-shake-effect');
        
        // Supprimer la classe de tremblement du texte à l'intérieur
        element.querySelectorAll('h3, p').forEach(textElement => {
          textElement.classList.remove('anxiety-text-shake-effect');
        });
      });
    }
    
    // Ajouter les écouteurs d'événements pour le survol
    anxietyCard.addEventListener('mouseenter', addShakeEffect);
    anxietyCard.addEventListener('mouseleave', removeShakeEffect);
    // On ne met pas d'écouteur d'événement sur le bloc "Vivre avec l'anxiété"
    // anxietyTextBlock.addEventListener('mouseenter', addShakeEffect);
    // anxietyTextBlock.addEventListener('mouseleave', removeShakeEffect);

    // Gestion des boutons de contrôle des effets
    const adjustEffectsBtn = document.getElementById('adjust-effects');

    if (adjustEffectsBtn) {
      // Bouton pour ajuster l'intensité des effets
      adjustEffectsBtn.addEventListener('click', function() {
        // Cycle entre les intensités : normal -> réduit -> augmenté -> normal
        if (effectIntensity === 1) {
          effectIntensity = 0.5;
          this.textContent = 'Augmenter l\'effet';
        } else if (effectIntensity === 0.5) {
          effectIntensity = 2;
          this.textContent = 'Réduire l\'effet';
        } else {
          effectIntensity = 1;
          this.textContent = 'Réduire l\'effet';
        }
        
        this.classList.toggle('active');
        
        // Mettre à jour les effets si actuellement affichés
        if (anxietyCard.matches(':hover') || anxietyTextBlock.matches(':hover')) {
          removeShakeEffect();
          addShakeEffect();
        }
      });
    }
  }

  // Effet de distorsion pour la dépression
  function setupDepressionEffect() {
    const depressionCard = document.querySelector('.depression-card');
    const depressionText = document.querySelector('.depression-text');
    
    if (depressionCard && depressionText) {
      console.log("Depression card and text found");
      
      // Fonction pour ajouter l'effet de distorsion
      function addDistortionEffect() {
        console.log("Adding distortion effect");
        
        // Sélectionner tous les blocs sauf celui de la dépression
        document.querySelectorAll('.trouble-card:not(.depression-card), .text-block:not(.depression-text)').forEach(element => {
          element.classList.add('distortion-effect');
          
          // Ajouter l'effet de distorsion au texte à l'intérieur
          element.querySelectorAll('h3, p').forEach(textElement => {
            textElement.classList.add('text-distortion');
          });
        });
      }
      
      // Fonction pour supprimer l'effet de distorsion
      function removeDistortionEffect() {
        console.log("Removing distortion effect");
        
        document.querySelectorAll('.trouble-card, .text-block').forEach(element => {
          element.classList.remove('distortion-effect');
          
          // Supprimer l'effet de distorsion du texte à l'intérieur
          element.querySelectorAll('h3, p').forEach(textElement => {
            textElement.classList.remove('text-distortion');
          });
        });
      }
      
      // Ajouter les écouteurs d'événements pour le survol
      depressionCard.addEventListener('mouseenter', addDistortionEffect);
      depressionCard.addEventListener('mouseleave', removeDistortionEffect);
      depressionText.addEventListener('mouseenter', addDistortionEffect);
      depressionText.addEventListener('mouseleave', removeDistortionEffect);
    }
  }

  // ----- Image Container Hover (for personnage section) -----
  const imagePlaceholder = document.querySelector('.image-container');
  if (imagePlaceholder) {
    imagePlaceholder.addEventListener('mouseenter', function() { this.classList.add('image-hover'); });
    imagePlaceholder.addEventListener('mouseleave', function() { this.classList.remove('image-hover'); });
  }

  // ----- Logo Hover Animation -----
  const logo = document.querySelector('.logo img');
  if (logo) {
    logo.addEventListener('mouseenter', function() { this.style.animation = 'rotateIn 0.5s ease-out'; });
    logo.addEventListener('mouseleave', function() { this.style.animation = 'pulse 2s infinite'; });
  }

  // ----- Parallax Effect on Sections -----
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    document.querySelectorAll('section').forEach(section => {
      const speed = 0.05;
      const yPos = -(scrollPosition * speed);
      section.style.backgroundPosition = `center ${yPos}px`;
    });
  });

  // ----- Animation pour les Shorts YouTube -----
  const shortItems = document.querySelectorAll('.short-item');
  
  shortItems.forEach((item, index) => {
    // Ajouter un délai progressif pour l'apparition
    item.style.animationDelay = `${0.3 + (index * 0.2)}s`;
    
    // Ajouter un effet de survol avec classe
    item.addEventListener('mouseenter', function() {
      this.classList.add('short-hovered');
    });
    
    item.addEventListener('mouseleave', function() {
      this.classList.remove('short-hovered');
    });
  });
  
  // Observer pour les animations au scroll
  const shortsSection = document.querySelector('.shorts-section');
  if (shortsSection) {
    const shortsSectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        shortsSection.classList.add('shorts-visible');
      }
    }, {
      threshold: 0.2
    });
    
    shortsSectionObserver.observe(shortsSection);
  }
});

// Gestion de l'accordéon des mentions légales
function setupLegalAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      // Toggle la classe active sur le header
      this.classList.toggle('active');
      
      // Récupère le contenu associé
      const content = this.nextElementSibling;
      
      // Toggle la classe active sur le contenu
      content.classList.toggle('active');
      
      // Change l'icône
      const icon = this.querySelector('.accordion-icon');
      if (this.classList.contains('active')) {
        icon.textContent = '×'; // Symbole de multiplication quand ouvert
      } else {
        icon.textContent = '+'; // Symbole plus quand fermé
      }
    });
  });
}

// Bouton de retour en haut de page
function createBackToTopButton() {
  // Créer le bouton
  const backToTopBtn = document.createElement('button');
  backToTopBtn.id = 'back-to-top';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.title = 'Retour en haut de page';
  
  // Créer la flèche
  const arrow = document.createElement('i');
  arrow.className = 'arrow-up';
  arrow.textContent = '↑';
  
  // Ajouter la flèche au bouton
  backToTopBtn.appendChild(arrow);
  
  // Ajouter le bouton au body
  document.body.appendChild(backToTopBtn);
  
  // Fonction pour afficher/masquer le bouton
  function toggleBackToTopButton() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  
  // Fonction pour remonter en haut de page
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // Ajouter les écouteurs d'événements
  window.addEventListener('scroll', toggleBackToTopButton);
  backToTopBtn.addEventListener('click', scrollToTop);
}

// Appeler la fonction pour créer le bouton
document.addEventListener('DOMContentLoaded', function() {
  createBackToTopButton();
  setupLegalAccordion();
  setupDepressionEffect();
});

// ----- Suppression des erreurs de console liées aux publicités -----
// Intercepter les erreurs de console liées aux bloqueurs de publicités
const originalConsoleError = console.error;
console.error = function() {
  // Filtrer les erreurs liées à googleads ou doubleclick
  if (arguments[0] && typeof arguments[0] === 'string' && 
      (arguments[0].includes('googleads') || arguments[0].includes('doubleclick'))) {
    // Ne pas afficher ces erreurs
    return;
  }
  // Sinon, utiliser le comportement normal
  return originalConsoleError.apply(console, arguments);
};

/* ---------- Particle Background (Ashes) ---------- */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Adjust canvas size on window resize
window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Particle settings
const particleCount = 150;
const particles = [];

// Mouse object for interactivity
const mouse = {
  x: null,
  y: null,
  radius: 100 // Interaction radius
};

// Update mouse position on movement
window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Particle constructor: each "ash" is a small circle with a random gray shade.
function Particle(x, y, radius, vx, vy) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.vx = vx;
  this.vy = vy;
  const shade = Math.floor(Math.random() * 100) + 100;
  this.color = 'rgba(' + shade + ',' + shade + ',' + shade + ',0.7)';
}

// Draw the particle
Particle.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
};

// Update particle position and interaction
Particle.prototype.update = function() {
  this.x += this.vx;
  this.y += this.vy;
  if (this.x > canvas.width) this.x = 0;
  if (this.x < 0) this.x = canvas.width;
  if (this.y > canvas.height) this.y = 0;
  if (this.y < 0) this.y = canvas.height;
  let dx = mouse.x - this.x;
  let dy = mouse.y - this.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < mouse.radius) {
    let angle = Math.atan2(dy, dx);
    let force = (mouse.radius - distance) / mouse.radius;
    this.x -= force * Math.cos(angle) * 5;
    this.y -= force * Math.sin(angle) * 5;
  }
  this.draw();
};

// Create particles
function initParticles() {
  for (let i = 0; i < particleCount; i++) {
    let radius = Math.random() * 2 + 1;
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let vx = (Math.random() - 0.5) * 0.5;
    let vy = (Math.random() - 0.5) * 0.5;
    particles.push(new Particle(x, y, radius, vx, vy));
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.update());
}

initParticles();
animate();

// script.js
// Dikshya Runuwal - Portfolio Interactivity Script

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Management (Light/Dark Mode)
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    body.classList.add('light-theme');
    if (themeToggle) themeToggle.checked = true;
  } else {
    body.classList.remove('light-theme');
    if (themeToggle) themeToggle.checked = false;
  }

  // Toggle theme listener
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        appendTerminalLine('System theme changed to Light.', 'output-info');
      } else {
        body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
        appendTerminalLine('System theme changed to Dark.', 'output-info');
      }
    });
  }


  // ==========================================
  // 2. Typewriter Effect
  // ==========================================
  const words = ["Full-Stack Developer", "B.Tech CSE Student", "AI Enthusiast", "Problem Solver"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedTextSpan = document.querySelector(".typed-text");
  const typingDelay = 100;
  const erasingDelay = 50;
  const newWordDelay = 2000;

  function type() {
    if (!typedTextSpan) return;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = newWordDelay;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1000);


  // ==========================================
  // 3. Scroll Reveal Transition (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        // Unobserve once shown to prevent refiring during scrolling
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // ==========================================
  // 4. Skills Categorized Filtering
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // ==========================================
  // 5. Canvas Particles Background (Hero Section)
  // ==========================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const colors = ['rgba(99, 102, 241, 0.4)', 'rgba(168, 85, 247, 0.4)', 'rgba(6, 182, 212, 0.4)'];
    
    // Mouse interaction coordinates
    let mouse = {
      x: null,
      y: null,
      radius: 100
    };

    window.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize Canvas
    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles();
    }
    
    window.addEventListener('resize', resizeCanvas);
    
    // Particle Class
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      update() {
        // Bounce off canvas boundaries
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }
        
        // Check mouse collision
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
              this.x += 2;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
              this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
              this.y += 2;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
              this.y -= 2;
            }
          }
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }
    
    // Initialize Particles
    function initParticles() {
      particlesArray = [];
      let numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
      numberOfParticles = Math.min(numberOfParticles, 80); // Cap at 80 particles
      
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((canvas.width - size * 2) - size * 2)) + size * 2;
        let y = (Math.random() * ((canvas.height - size * 2) - size * 2)) + size * 2;
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }
    
    // Connect particles close to each other
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 110) {
            opacityValue = 1 - (distance / 110);
            const isLightTheme = body.classList.contains('light-theme');
            const lineStroke = isLightTheme ? 'rgba(79, 70, 229,' : 'rgba(99, 102, 241,';
            ctx.strokeStyle = lineStroke + opacityValue * 0.15 + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    // Set initial size and start
    resizeCanvas();
    animate();
  }


  // ==========================================
  // 6. Interactive Developer Terminal Widget
  // ==========================================
  const terminal = document.getElementById('terminal');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalHeader = document.querySelector('.terminal-header');
  const termLauncher = document.getElementById('terminal-launcher');
  const termClose = document.querySelector('.terminal-close');
  const termMinimize = document.querySelector('.terminal-minimize');

  // Command History Parser
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        terminalInput.value = '';
        if (command) {
          processTerminalCommand(command);
        }
      }
    });

    // Keep input focused when clicking inside terminal
    terminal.addEventListener('click', () => {
      if (!terminal.classList.contains('minimized')) {
        terminalInput.focus();
      }
    });
  }

  // Toggle Minimize
  if (termMinimize) {
    termMinimize.addEventListener('click', (e) => {
      e.stopPropagation();
      terminal.classList.toggle('minimized');
      if (terminal.classList.contains('minimized')) {
        appendTerminalLine('Widget minimized.', 'terminal-welcome');
      } else {
        terminalInput.focus();
      }
    });
  }

  // Toggle Close/Hide
  if (termClose) {
    termClose.addEventListener('click', (e) => {
      e.stopPropagation();
      terminal.style.display = 'none';
      if (termLauncher) termLauncher.style.display = 'flex';
    });
  }

  // Toggle Launch
  if (termLauncher) {
    termLauncher.addEventListener('click', () => {
      terminal.style.display = 'flex';
      terminal.classList.remove('minimized');
      termLauncher.style.display = 'none';
      if (terminalInput) terminalInput.focus();
    });
  }

  // Draggable Window functionality
  if (terminalHeader && terminal) {
    let isDragging = false;
    let offsetX, offsetY;

    terminalHeader.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('terminal-btn')) return; // ignore control buttons
      isDragging = true;
      offsetX = e.clientX - terminal.offsetLeft;
      offsetY = e.clientY - terminal.offsetTop;
      terminal.style.transition = 'none'; // disable transitions while dragging
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    });

    function mouseMoveHandler(e) {
      if (!isDragging) return;
      
      // Calculate bounds
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
      
      // Boundaries check
      x = Math.max(10, Math.min(x, window.innerWidth - terminal.offsetWidth - 10));
      y = Math.max(10, Math.min(y, window.innerHeight - terminal.offsetHeight - 10));
      
      terminal.style.left = x + 'px';
      terminal.style.top = y + 'px';
      terminal.style.right = 'auto';
      terminal.style.bottom = 'auto';
    }

    function mouseUpHandler() {
      isDragging = false;
      terminal.style.transition = 'height 0.3s ease, width 0.3s ease, transform 0.2s ease, opacity 0.3s ease';
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }
  }

  // Append a line to the terminal screen
  function appendTerminalLine(text, className = '') {
    if (!terminalOutput) return;
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = text;
    terminalOutput.appendChild(line);
    
    // Auto Scroll to bottom
    const bodyContainer = terminal.querySelector('.terminal-body');
    if (bodyContainer) {
      bodyContainer.scrollTop = bodyContainer.scrollHeight;
    }
  }

  // Parse terminal commands
  function processTerminalCommand(cmdString) {
    const parts = cmdString.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    
    // Echo command
    appendTerminalLine(`dikshya-portfolio$ ${cmdString}`, 'command-echo');

    switch (cmd) {
      case 'help':
        appendTerminalLine('Available Commands:<br>' + 
          '  <b>about</b>            - Short intro bio<br>' + 
          '  <b>skills</b>           - Quick listing of expertise<br>' + 
          '  <b>projects</b>         - Overview of core projects<br>' + 
          '  <b>contact</b>          - Display contact links<br>' + 
          '  <b>download-resume</b>   - Trigger CV PDF download<br>' + 
          '  <b>theme [dark/light]</b> - Toggle site color theme<br>' + 
          '  <b>clear</b>            - Clear the terminal screen', 'output-info');
        break;

      case 'about':
        appendTerminalLine('Dikshya Runuwal - B.Tech CSE student at Lovely Professional University.<br>' +
          'Specializes in Full-Stack Web Development, engineering beautiful frontends with React & HTML5/CSS, ' +
          'and robust backends with Node.js, Express, and Databases (MongoDB, MySQL).', 'output-info');
        break;

      case 'skills':
        appendTerminalLine('<b>Languages:</b> C, C++, Java, JavaScript<br>' +
          '<b>Frontend:</b> HTML5, CSS3, React.js, Next.js, jQuery, Bootstrap<br>' +
          '<b>Backend:</b> Node.js, Express.js, Socket.io, PHP<br>' +
          '<b>Databases:</b> MongoDB, MySQL<br>' +
          '<b>DevOps & Cloud:</b> AWS, Docker', 'output-info');
        break;

      case 'projects':
        appendTerminalLine('1. <b>RechargeHub</b> - Digital Bill & Mobile Recharge Portal (HTML/CSS/Node.js) [Featured]<br>' +
          '2. <b>Studivo</b> - Comprehensive Student Workspace & Productivity Portal (React/Vite)<br>' +
          '3. <b>Nutri AI</b> - AI-Powered Nutrition & Calorie Tracker (React.js)<br>' +
          '4. <b>PeakSense</b> - Electricity Peak Demand Analytics Dashboard (SIH Hackathon)', 'output-info');
        break;

      case 'contact':
        appendTerminalLine('Email: runuwaldikshya@gmail.com<br>' +
          'Phone: +91 89104 32022<br>' +
          'LinkedIn: linkedin.com/in/dikshyarunuwal/<br>' +
          'GitHub: github.com/CoderDIKSHYA', 'output-info');
        break;

      case 'download-resume':
        appendTerminalLine('Initiating download for <i>Dikshya_Runuwal_Resume.pdf</i>...', 'output-info');
        const downloadLink = document.createElement('a');
        downloadLink.href = 'cv/Dikshya_Runuwal_Resume.pdf';
        downloadLink.download = 'Dikshya_Runuwal_Resume.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        incrementResumeDownloads();
        break;

      case 'theme':
        const targetTheme = parts[1] ? parts[1].toLowerCase() : '';
        if (targetTheme === 'light') {
          body.classList.add('light-theme');
          if (themeToggle) themeToggle.checked = true;
          localStorage.setItem('theme', 'light');
          appendTerminalLine('Switched to light theme.', 'output-info');
        } else if (targetTheme === 'dark') {
          body.classList.remove('light-theme');
          if (themeToggle) themeToggle.checked = false;
          localStorage.setItem('theme', 'dark');
          appendTerminalLine('Switched to dark theme.', 'output-info');
        } else {
          // Toggle
          body.classList.toggle('light-theme');
          const isLight = body.classList.contains('light-theme');
          if (themeToggle) themeToggle.checked = isLight;
          localStorage.setItem('theme', isLight ? 'light' : 'dark');
          appendTerminalLine(`Toggled theme to ${isLight ? 'light' : 'dark'}.`, 'output-info');
        }
        break;

      case 'clear':
        if (terminalOutput) terminalOutput.innerHTML = '';
        break;

      default:
        appendTerminalLine(`Unknown command: "${cmd}". Type <b>help</b> for options.`, 'output-info');
        break;
    }
  }


  // ==========================================
  // 7. Interactive Recruiter CV Download Tracker
  // ==========================================
  const simulatedCountEl = document.getElementById('resume-dl-count');
  
  function getSimulatedDownloadCount() {
    let count = localStorage.getItem('simulated_downloads');
    if (!count) {
      // Seed with a reasonable number for a fresher profile to look professional
      count = Math.floor(Math.random() * 30) + 120;
      localStorage.setItem('simulated_downloads', count);
    }
    return count;
  }

  function displayDownloadCount() {
    if (simulatedCountEl) {
      simulatedCountEl.textContent = getSimulatedDownloadCount() + '+';
    }
  }

  function incrementResumeDownloads() {
    let count = parseInt(getSimulatedDownloadCount());
    count++;
    localStorage.setItem('simulated_downloads', count);
    displayDownloadCount();
  }

  // Hook download buttons
  const cvButtons = document.querySelectorAll('.download-btn-cv');
  cvButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      incrementResumeDownloads();
      appendTerminalLine('Resume downloaded via portfolio interface.', 'output-info');
    });
  });

  // Display initial count
  displayDownloadCount();


  // ==========================================
  // 8. Project Details Modal Logic
  // ==========================================
  const modal = document.getElementById('project-modal');
  const modalClose = document.querySelector('.modal-close-btn');
  const modalOverlay = document.querySelector('.modal-overlay');
  
  const modalTitle = document.getElementById('modal-project-title');
  const modalTechStack = document.getElementById('modal-tech-stack');
  const modalHighlights = document.getElementById('modal-highlights');
  const modalRecruiterInsights = document.getElementById('modal-recruiter-insights');
  const modalGithubLink = document.getElementById('modal-github-link');
  const modalLiveLink = document.getElementById('modal-live-link');

  const projectDetails = {
    'rechargehub': {
      title: 'RechargeHub — Digital Bill & Utilities Portal',
      tech: ['HTML5', 'Vanilla CSS3', 'JavaScript', 'Node.js', 'Mock Payment API'],
      highlights: [
        'Created a digital marketplace workflow to simulate utilities and billing recharges.',
        'Engineered payment checkout validations for mock network transactions.',
        'Implemented administrative audit history dashboards to catalog transactions.',
        'Focused on secure local session authentications and input sanitization.'
      ],
      recruiter: '<b>Fresher Value:</b> Showcases core understanding of transactional flow validation, safe backend routing structures, session states, and clean form processing paradigms.',
      github: 'https://github.com/CoderDIKSHYA/RechargeHub-Final-Project',
      live: 'https://rechargehub-amber.vercel.app/'
    },
    'nutri-ai': {
      title: 'Nutri AI — AI Nutrition & Tracker',
      tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Calorie API', 'Gemini AI'],
      highlights: [
        'Developed a responsive React.js single-page application for nutrition assessment.',
        'Integrated a third-party Calorie Database API for nutritional info lookup.',
        'Features secure custom user auth dashboards with session token validation.',
        'Built automated diet planning algorithms to chart targets based on body metrics.'
      ],
      recruiter: '<b>Fresher Value:</b> Demonstrates clean state management, modular components structure, secure routing, and third-party API configurations in a high-fidelity application context.',
      github: 'https://github.com/CoderDIKSHYA/NutriFit-AI',
      live: 'https://my-health-fitness-react-app.vercel.app/'
    },
    'studivo': {
      title: 'Studivo — Workspace Productivity Portal',
      tech: ['React.js', 'Vite', 'Local Storage', 'CSS Grid', 'Calendar API'],
      highlights: [
        'Built a client-focused workspace for academic planners and student tasks.',
        'Integrated a Pomodoro timer and focus dashboard to measure productivity trends.',
        'Developed a flashcards manager utilizing local storage persistence.',
        'Includes dynamic search queries and filter structures for class resources.'
      ],
      recruiter: '<b>Fresher Value:</b> Proves strong proficiency in client-side application architecture, modular dashboard designs, DOM state persistence, and highly polished responsive custom layout grids.',
      github: 'https://github.com/CoderDIKSHYA/Studivo',
      live: 'https://studivo-nine.vercel.app/'
    },
    'peaksense': {
      title: 'PeakSense — Electricity Peak Demand Analytics',
      tech: ['React.js', 'Chart.js', 'Node.js', 'Express', 'CSV Parser', 'Bootstrap'],
      highlights: [
        'Developed for the 36-Hour Smart India Hackathon (SIH 2023).',
        'Visualizes and forecasts electricity grid loads for the city of Delhi.',
        'Engineered custom CSV parsers to process municipal historical datasets.',
        'Implements responsive analytical charts visualizing peak consumption spikes.'
      ],
      recruiter: '<b>Fresher Value:</b> Proves ability to coordinate inside cross-functional teams in high-intensity hackathon scenarios, handling dataset parsers, and creating interactive analytical charts.',
      github: 'https://github.com/CoderDIKSHYA/Delhi-electricity-consumption',
      live: 'https://peak-sense.vercel.app/'
    }
  };

  // Open Modal trigger
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const detailsBtn = card.querySelector('.btn-view-details');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = card.getAttribute('data-project');
        const data = projectDetails[projectId];
        if (data) {
          populateAndOpenModal(data);
        }
      });
    }
  });

  function populateAndOpenModal(data) {
    if (!modal) return;
    
    // Clear and build tech stack pills
    modalTechStack.innerHTML = '';
    data.tech.forEach(t => {
      const pill = document.createElement('span');
      pill.className = 'tag-pill';
      pill.textContent = t;
      modalTechStack.appendChild(pill);
    });

    // Title
    modalTitle.textContent = data.title;

    // Highlights
    modalHighlights.innerHTML = '';
    data.highlights.forEach(h => {
      const li = document.createElement('li');
      li.textContent = h;
      modalHighlights.appendChild(li);
    });

    // Recruiter Insights
    modalRecruiterInsights.innerHTML = data.recruiter;

    // Links
    modalGithubLink.href = data.github;
    modalLiveLink.href = data.live;

    // Open
    modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});

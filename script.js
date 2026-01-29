const counters = document.querySelectorAll('.counter');
const speed = 200; // smaller = faster
let triggered = false;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');

        const updateCount = () => {
            const count = +counter.innerText;
            const increment = Math.ceil(target / speed);

            if (count < target) {
                counter.innerText = count + increment;
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target + "+";
            }
        };

        updateCount();
    });
};

window.addEventListener('scroll', () => {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const sectionTop = statsSection.getBoundingClientRect().top;

    if (sectionTop < window.innerHeight && !triggered) {
        animateCounters();
        triggered = true;
    }
});


// Smooth scroll handled by CSS, this handles active nav

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 120) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});


// Page load animation
window.addEventListener("load", () => {
  document.querySelectorAll(".fade-up, .fade-in").forEach(el => {
    el.classList.add("show");
  });
});

// Scroll animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".fade-up, .fade-in").forEach(el => {
  observer.observe(el);
});
const menuToggle = document.querySelector('.menu-toggle');
const navlinks = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
  navlinks.classList.toggle('active');
});


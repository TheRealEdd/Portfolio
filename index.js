
// Loading Bar

document.addEventListener("DOMContentLoaded", () => {
    const loadingOverlay = document.getElementById("loadingOverlay");
    const loadingBar = document.getElementById("loadingBar");

    // Simulate loading progress
    let progress = 0;
    let speed = 1;
    setTimeout(() => {
        const loadingInterval = setInterval(() => {
            progress += speed; // Increment progress
            speed += 1;
            loadingBar.style.width = `${progress}%`; // Update progress bar
    
            if (progress >= 100) {
                clearInterval(loadingInterval); // Stop the interval
    
                // Wait for half a second before starting the slide-up animation
                setTimeout(() => {
                    loadingOverlay.style.transform = "translateY(-100%)"; // Slide overlay up
                    setTimeout(() => {
                        loadingOverlay.style.display = "none"; // Hide overlay after animation
                    }, 300); // Match the CSS transition duration
                }, 1000); // Second delay
            }
        }, 1); // Adjust for realistic load simulation
    }, 500); // pre-animation delay: 500
});




// Nav Overlay

function toggleMenu() {
    const hamburger = document.getElementById('hamburger');
    const navOverlay = document.getElementById('navOverlay');
    const body = document.body;

    // Toggle the 'show' class for the overlay
    navOverlay.classList.toggle('show');

    // Toggle the 'close' class for the hamburger icon
    hamburger.classList.toggle('close');

    // Toggle the 'no-scroll' class on the body to disable/enable scrolling
    body.classList.toggle('no-scroll');
}

// Automatically close the menu when a link is clicked
document.querySelectorAll('#mobileNavBar a').forEach(link => {
    link.addEventListener('click', () => {
        // Close the menu by toggling the hamburger
        toggleMenu();
    });
});



// Interactive Cursor

const easing = 15;
let curX = 0, curY = 0;
let tgX = 0, tgY = 0;

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('heroSection');
    const interBubbles = document.querySelectorAll('.interactive');

    function move() {
        curX += (tgX - curX) / easing;
        curY += (tgY - curY) / easing;

        interBubbles.forEach((bubble) => {
            bubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        });

        requestAnimationFrame(move);
    }

    heroSection.addEventListener('mousemove', (event) => {
        const rect = heroSection.getBoundingClientRect(); // Get the section's position
        tgX = event.clientX - rect.left; // Adjust to section bounds
        tgY = event.clientY - rect.top;  // Adjust to section bounds
    });

    move();
});

// Skillbox Expand

document.addEventListener('DOMContentLoaded', () => {
    const skillboxes = document.querySelectorAll('.skillbox');

    skillboxes.forEach((box) => {
        box.addEventListener('click', () => {
            const hiddenContent = box.querySelector('.hiddenContent');
            if (hiddenContent) {
                if (hiddenContent.style.maxHeight) {
                    // Collapse
                    hiddenContent.style.maxHeight = null;

                    // Scroll back to the top of the skillbox with an offset
                    const offset = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.5; // 1.5em
                    const boxTop = box.getBoundingClientRect().top + window.scrollY - offset;

                    window.scrollTo({
                        top: boxTop,
                        behavior: 'smooth'
                    });
                } else {
                    // Expand
                    hiddenContent.style.maxHeight = hiddenContent.scrollHeight + "px";
                }
            }
        });

        // Prevent skillbox toggle when clicking links inside it
        const links = box.querySelectorAll('a');
        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent the click from reaching the .skillbox
            });
        });
    });
});

// Email Obfuscation

const a = "RUhSb2NjYQ==";
const b = "b3V0bG9vay5jb20=";
const c = atob(a) + atob("QA==") + atob(b);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("emailButton").addEventListener("click", function(e) {
        e.preventDefault(); // Prevent the default link action
        window.location.href = "mailto:" + c; // Set the mailto link dynamically
    });
});
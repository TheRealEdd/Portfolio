// Sticky Nav Bar
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');

    if (window.scrollY > 10) { // Adjust value for when you want to change the background
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
        
    }
});

// ----------------------- Carousel Scrolling --------------------------

    class Carousel {
        constructor(carouselElement) {
            this.carouselElement = carouselElement;
            this.gallery = carouselElement.querySelector('.sectionGallery');
            this.prevButton = carouselElement.querySelector('.carouselButton.left');
            this.nextButton = carouselElement.querySelector('.carouselButton.right');
            this.currentScroll = 0;
            this.itemWidth = parseInt(getComputedStyle(carouselElement.querySelector('.galleryItem')).width, 10);
            this.gap = 10; // Adjust as necessary for margin-right in .galleryItem
            this.updateItemsVisible();

            // Attach event listeners to buttons
            this.prevButton.addEventListener('click', () => this.scrollCarousel('prev'));
            this.nextButton.addEventListener('click', () => this.scrollCarousel('next'));
            this.updateButtonVisibility();

            // Handle window resize
            window.addEventListener('resize', () => {
                this.updateItemsVisible();
                this.updateButtonVisibility();
            });
        }

        updateItemsVisible() {
            this.itemsVisible = Math.floor((window.innerWidth - 130) / (this.itemWidth + this.gap));
        }

        scrollCarousel(direction) {
            const totalWidth = window.innerWidth - 85; // Account for the total margin (40px on each side)
            const translateX = direction === 'next' 
                ? -(this.currentScroll + 1) * totalWidth 
                : -(this.currentScroll - 1) * totalWidth;

            const totalItems = this.gallery.children.length;
            const maxScroll = Math.ceil(totalItems * (this.itemWidth + this.gap) / totalWidth) - 1; // Calculate max scroll based on visible items

            if (direction === 'next' && this.currentScroll < maxScroll) {
                this.currentScroll++;
            } else if (direction === 'prev' && this.currentScroll > 0) {
                this.currentScroll--;
            }

            this.gallery.style.transform = `translateX(${translateX}px)`;
            this.updateButtonVisibility();
        }


        updateButtonVisibility() {
            if (this.currentScroll === 0) {
                this.prevButton.style.display = 'none'; // Hide left button
            } else {
                this.prevButton.style.display = 'flex'; // Show left button
            }

            const totalItems = this.gallery.children.length;
            const maxScroll = totalItems - this.itemsVisible;
            
            if (this.currentScroll >= maxScroll) {
                this.nextButton.style.display = 'none'; // Hide right button
            } else {
                this.nextButton.style.display = 'flex'; // Show right button
            }
        }
    }

// Fetch the project data from the JSON file
fetch('data/projects.json')
    .then((response) => response.json())
    .then((projects) => {

        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('prj'); // Get project ID from URL

        // If a project ID exists in the query, find the corresponding project
        if (projectId) {
            const selectedProject = projects.find(project => project.id === projectId);
            if (selectedProject) {
                console.log("Loading info from project: ", selectedProject.title);
                
                showInfo(selectedProject); // Show the specific project info card
            }
        } else {
            console.log("Homepage loading as normal");
        }
        
        // Select a random project
        const randomIndex = Math.floor(Math.random() * projects.length);
        const selectedProject = projects[randomIndex];

        // Populate the hero section
        const heroBackground = document.querySelector('.heroBackground img');
        const heroLogoImg = document.querySelector('.heroLogo .logoImage');
        const heroLogoText = document.querySelector('.heroLogo .logoText');
        const heroTagline = document.querySelector('.heroTagline');
        const heroDescription = document.querySelector('.heroDescription');

        // Set values in the hero section
        heroBackground.src = selectedProject.heroImage;
        heroTagline.textContent = selectedProject.tagLine;
        heroDescription.textContent = selectedProject.shortDescription;

        // Check if the project has a titleLogo
        if (selectedProject.titleLogo) {
            heroLogoImg.src = selectedProject.titleLogo;
            heroLogoImg.style.display = 'block'; // Show the logo
            heroLogoText.style.display = 'none'; // Hide the text
        } else {
            heroLogoText.textContent = selectedProject.title;
            heroLogoText.style.display = 'block'; // Show the text
            heroLogoImg.style.display = 'none'; // Hide the logo
        }


        // Full article button functionality
        const fullArticleButton = document.querySelector('.projectCTAButton');
        fullArticleButton.onclick = () => {
          window.location.href = `blog.html?id=${encodeURIComponent(selectedProject.id)}`; // Link to blog URL
        };

        // More info button functionality
        const moreInfoButton = document.querySelector('.projectInfoButton');
        moreInfoButton.onclick = () => {
          showInfo(selectedProject); // Call showInfo with the correct project
        };


        // ==============  Create Project Sections  ================

        const projectContainer = document.getElementById('projectContainer');
        const projectsByField = {};


        // Categorize projects by fieldOfWork and prepare for most recent section
        projects.forEach(project => {
        project.fieldOfWork.forEach(field => {
            if (!projectsByField[field]) {
            projectsByField[field] = [];
            }
            projectsByField[field].push(project);
        });
        });

        // Create an array of fields and their counts
        const fieldsWithCounts = Object.keys(projectsByField).map(field => {
        return {
            field: field,
            count: projectsByField[field].length // Count the number of projects
        };
        });

        // Sort fields by count in descending order
        fieldsWithCounts.sort((a, b) => b.count - a.count);
        
        // Helper function to convert dd-mm-yyyy to yyyy-mm-dd
        function convertDateFormat(dateStr) {
            const parts = dateStr.split('-');
            return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to yyyy-mm-dd
        }

        // Create "Most Recent" section
        const recentProjects = projects
            .filter(project => project.startDate !== null) // Exclude projects with no starting dates
            .sort((a, b) => {
                const startDateA = new Date(convertDateFormat(a.startDate));
                const endDateA = a.endDate ? new Date(convertDateFormat(a.endDate)) : null;

                const startDateB = new Date(convertDateFormat(b.startDate));
                const endDateB = b.endDate ? new Date(convertDateFormat(b.endDate)) : null;

                // Check if both projects are ongoing
                const isAOngoing = endDateA === null;
                const isBOngoing = endDateB === null;

                // If both are ongoing, sort by start date
                if (isAOngoing && isBOngoing) {
                    return startDateB - startDateA; // Sort by startDate (newest first)
                }

                // Ongoing projects come first
                if (isAOngoing) {
                    return -1; // a comes first
                }
                if (isBOngoing) {
                    return 1; // b comes first
                }

                // If both projects are completed, sort by end date
                return endDateB - endDateA; // Sort by endDate (completed projects newest first)
            })
            .slice(0, 10); // Get the 10 most recent projects

                    // Create "Most Recent" section
            const recentSection = document.createElement('section');
            recentSection.className = 'projectSection';

            const recentTitle = document.createElement('h2');
            recentTitle.className = 'sectionTitle';
            recentTitle.innerText = 'Most Recent'; // Set the section title
            recentSection.appendChild(recentTitle);

            const recentCarouselContainer = document.createElement('div');
            recentCarouselContainer.className = 'carouselContainer';

            const recentGallery = document.createElement('div');
            recentGallery.className = 'sectionGallery';

            recentProjects.forEach(project => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'galleryItem';

                const img = document.createElement('img');
                img.src = project.thumbnailImage; // Use thumbnailImage for gallery
                img.alt = project.title; // Set alt attribute for accessibility
                img.className = 'itemBackground';

                // Add click event to each gallery item
                galleryItem.addEventListener('click', () => {
                    showInfo(project); // Call showInfo with the project
                });

                galleryItem.appendChild(img); // Append img to galleryItem
                recentGallery.appendChild(galleryItem); // Append galleryItem to recentGallery
            });

            recentCarouselContainer.appendChild(recentGallery); // Append recentGallery to carousel container

            // Create navigation buttons for the "Most Recent" section
            const recentPrevButton = document.createElement('div');
            recentPrevButton.className = 'carouselButton left';
            recentPrevButton.textContent = '◀'; // Left arrow icon
            recentCarouselContainer.appendChild(recentPrevButton);

            const recentNextButton = document.createElement('div');
            recentNextButton.className = 'carouselButton right';
            recentNextButton.textContent = '▶'; // Right arrow icon
            recentCarouselContainer.appendChild(recentNextButton);

            recentSection.appendChild(recentCarouselContainer); // Append carousel container to section
            projectContainer.appendChild(recentSection); // Append recent section to container

            // Create sections for each field of work based on sorted order
            fieldsWithCounts.forEach(fieldWithCount => {
                const field = fieldWithCount.field;
                const section = document.createElement('section');
                section.className = 'projectSection';

                const title = document.createElement('h2');
                title.className = 'sectionTitle';
                title.innerText = field; // Set the section title
                section.appendChild(title);

                const carouselContainer = document.createElement('div');
                carouselContainer.className = 'carouselContainer';

                const gallery = document.createElement('div');
                gallery.className = 'sectionGallery';

                // Sort projects within this field before creating gallery items
                const sortedProjects = projectsByField[field].sort((a, b) => {
                    const endDateA = a.endDate ? new Date(convertDateFormat(a.endDate)) : null;
                    const endDateB = b.endDate ? new Date(convertDateFormat(b.endDate)) : null;

                    // Handle ongoing projects
                    const isAOngoing = endDateA === null;
                    const isBOngoing = endDateB === null;

                    if (isAOngoing && isBOngoing) {
                        // Both are ongoing, sort by startDate
                        return new Date(convertDateFormat(b.startDate)) - new Date(convertDateFormat(a.startDate));
                    }
                    if (isAOngoing) return -1; // ongoing project comes first
                    if (isBOngoing) return 1; // ongoing project comes second

                    // Sort by endDate if both are completed
                    return endDateB - endDateA; 
                });

                sortedProjects.forEach(project => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'galleryItem';

                    const img = document.createElement('img');
                    img.src = project.thumbnailImage; // Use thumbnailImage for gallery
                    img.alt = project.title; // Set alt attribute for accessibility
                    img.className = 'itemBackground';

                    // Add click event to each gallery item
                    galleryItem.addEventListener('click', () => {
                        showInfo(project); // Call showInfo with the project
                    });

                    galleryItem.appendChild(img); // Append img to galleryItem
                    gallery.appendChild(galleryItem); // Append galleryItem to gallery
                });

                carouselContainer.appendChild(gallery); // Append gallery to carousel container

                // Create navigation buttons for the field section
                const prevButton = document.createElement('div');
                prevButton.className = 'carouselButton left';
                prevButton.textContent = '◀'; // Left arrow icon
                carouselContainer.appendChild(prevButton);

                const nextButton = document.createElement('div');
                nextButton.className = 'carouselButton right';
                nextButton.textContent = '▶'; // Right arrow icon
                carouselContainer.appendChild(nextButton);

                section.appendChild(carouselContainer); // Append carousel container to section
                projectContainer.appendChild(section); // Append section to container
            });

        // Initialize all carousels on the page
        document.querySelectorAll('.carouselContainer').forEach(carouselElement => {
            new Carousel(carouselElement);
        });


    })
    .catch((error) => {
    console.error('Error fetching project data:', error);
    });



    //   =========================  showInfo  =================================


    const infoOverlay = document.getElementById('infoOverlay');
    const infoCard = document.getElementById('infoCard');
    const closeButton = document.getElementById('closeButton');

    // Function to show more info overlay
    function showInfo(selectedProject) {
        
        const endDateParts = selectedProject.endDate ? selectedProject.endDate.split('-') : null;
        const year = endDateParts ? endDateParts[2] : "Ongoing"; // Use "Ongoing" if endDate is null
        document.querySelector('.projectEndDate').textContent = year;
        document.querySelector('.infoBackgroundImage').src = selectedProject.heroImage;
        document.querySelector('.projectTitle').textContent = selectedProject.title;
        const projectId = selectedProject.id;

        const articleButton = document.querySelector('.projectArticleButton');
        const projectWritingDate = selectedProject.blogWritingDate;

        // Show Full Article Button if writing date exists
        if (projectWritingDate != null) {
            articleButton.style.display = 'inline-block';
            articleButton.onclick = () => {
                window.location.href = `blog.html?id=${encodeURIComponent(selectedProject.id)}`; // Link to blog URL
            };
            
        } else {
            articleButton.style.display = 'none';
        }

        // Calculate the duration in days, weeks, months, or years
        const startDate = new Date(selectedProject.startDate.split('-').reverse().join('-'));
        const endDate = selectedProject.endDate ? new Date(selectedProject.endDate.split('-').reverse().join('-')) : new Date(); // Use today's date if endDate is null
        
        const durationInDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

        let durationText = '';

        if (durationInDays < 31) {
            const dayText = durationInDays === 1 ? "day" : "days";
            durationText = `${durationInDays} ${dayText}`;
        } else if (durationInDays < 240) { // less than 8 months
            const weeks = Math.floor(durationInDays / 7);
            const weekText = weeks === 1 ? "week" : "weeks";
            durationText = `${weeks} ${weekText}`;
        } else if (durationInDays < 365) { // less than a year
            const months = Math.floor(durationInDays / 30);
            const monthText = months === 1 ? "month" : "months";
            durationText = `${months} ${monthText}`;
        } else {
            const years = Math.floor(durationInDays / 365);
            const yearText = years === 1 ? "year" : "years";
            durationText = `${years} ${yearText}`;
        }

        document.querySelector('.projectDuration').textContent = selectedProject.startDate ? `${durationText}` : "Unknown Start Date";

        document.querySelector('.projectLongDescription').innerHTML = selectedProject.longDescription;

        document.querySelector('.projectClient').innerHTML = `<span class="rightColumnDetails">Client:</span> ${selectedProject.client}`;
        document.querySelector('.projectRole').innerHTML = `<span class="rightColumnDetails">Role:</span> ${selectedProject.role}`;
        document.querySelector('.projectMethods').innerHTML = `<span class="rightColumnDetails">Methods Used:</span> ${selectedProject.methodsUsed.join(', ')}`;

        // Handle the image gallery (initially keep it empty)
        const imageGallery = document.getElementById('imageGallery');
        imageGallery.innerHTML = ''; // Clear any previous images

        // Dynamically load images for the gallery when the overlay is shown
        selectedProject.images.forEach(imageSrc => {
            const imgElement = document.createElement('img');
            imgElement.src = imageSrc;
            imgElement.alt = selectedProject.title;
            imgElement.classList.add('galleryImage'); // You can style this class in CSS
            imageGallery.appendChild(imgElement);
        });

        // Drag-To-Scroll implementation on gallery
        let isDown = false;
        let startX;
        let scrollLeft;

        imageGallery.addEventListener('mousedown', (e) => {
            isDown = true;
            imageGallery.style.cursor = 'grabbing';
            startX = e.pageX - imageGallery.offsetLeft;
            scrollLeft = imageGallery.scrollLeft;
        });

        imageGallery.addEventListener('mouseleave', () => {
            isDown = false;
            imageGallery.style.cursor = 'grab';
        });

        imageGallery.addEventListener('mouseup', () => {
            isDown = false;
            imageGallery.style.cursor = 'grab';
        });

        imageGallery.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - imageGallery.offsetLeft;
            const walk = (x - startX) * 2; // Adjust scrolling speed
            imageGallery.scrollLeft = scrollLeft - walk;
        });

        // Prevent default drag behavior on images
        const images = imageGallery.querySelectorAll('img'); // Select images within the gallery
        images.forEach((img) => {
            img.addEventListener('dragstart', (e) => {
                e.preventDefault(); // Prevent the image from being dragged
            });
        });


        // Show the overlay
        document.body.classList.add('body-scroll-lock'); //hide main scroll bar of webpage
        infoOverlay.style.display = 'block'; // Show overlay immediately
        setTimeout(() => {
            infoOverlay.classList.add('visible'); // Trigger fade-in for overlay
            infoCard.classList.add('visible');    // Trigger fade-in for card

            // Update the URL with the project ID (e.g., ?jbv=82640993)
            const newUrl = `${window.location.pathname}?prj=${projectId}`;
            window.history.pushState({ projectId }, '', newUrl); // Update the URL

        }, 10); // Small timeout to ensure display is set before CSS transition
    }



    // Function to close the overlay
    function closeOverlay() {
        document.body.classList.remove('body-scroll-lock');
        infoCard.classList.remove('visible'); // Remove the class to transition out
        infoOverlay.classList.remove('visible'); // Remove the class to transition out
        window.history.replaceState(null, '', window.location.pathname); // Reset URL to original state
        setTimeout(() => {
            infoOverlay.scrollTop = 0; // Scroll to the top of the overlay
            infoOverlay.style.display = 'none'; // Hide after the animation is complete
        }, 500); // Match this timeout with your animation duration
    }

    // Event listeners for closing the overlay
    closeButton.addEventListener('click', closeOverlay);
    infoOverlay.addEventListener('click', (event) => {
        // Close when clicking outside the info card
        if (event.target === infoOverlay) {
            closeOverlay();
        }

    

    

});
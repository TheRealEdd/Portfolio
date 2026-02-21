// Sticky Nav Bar
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');

    if (window.scrollY > 10) { // Adjust value for when you want to change the background
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
        
    }
});

// Fetch the JSON data
fetch('data/projects.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((projects) => {
        // Check if there is no query string in the URL
        let params;
        let projectId
        if (!window.location.search) {
            window.location.href = 'index.html'; // Redirect to homepage
        } else {
            params = new URLSearchParams(window.location.search);
            projectId = params.get('id'); // Get project ID from URL
            
            // You can add more logic here to handle the project ID if needed
    
            if (projectId) {
                // Find the project with the corresponding ID
                const project = projects.find(p => p.id === projectId);
            if (project) {
                renderBlogPost(project);
            } else {
                console.error('Project not found');
            }
            } else {
                console.error('No project ID found in URL');
            }
        }

        // Function to recommend projects
        function recommendProjects() {
            const currentProjectId = projectId;
            const currentProject = projects.find(project => project.id === currentProjectId);

            if (!currentProject) return;

            const sameFieldProjects = [];
            const secondFieldProjects = [];
            const unrelatedProjects = [];
            const usedFields = new Set(currentProject.fieldOfWork);

            // Filter projects based on blogWritingDate and current project ID
            projects.forEach(project => {
                if (project.id === currentProjectId || !project.blogWritingDate) return;

                // Check for the first field of the currentProject
                if (project.fieldOfWork[0] === currentProject.fieldOfWork[0]) {
                    sameFieldProjects.push(project);
                } 
                // Check for the second field of the currentProject
                else if (project.fieldOfWork.length > 1 && project.fieldOfWork[0] === currentProject.fieldOfWork[1]) {
                    secondFieldProjects.push(project);
                } 
                // Check for unrelated projects
                else {
                    unrelatedProjects.push(project);
                }
            });

            // Prepare recommendations
            const recommendations = [];

            // First recommendation: Same field as currentProject.fieldOfWork[0]
            if (sameFieldProjects.length > 0) {
                recommendations.push(sameFieldProjects[0]);
            } else if (projects.length > 1) { // If there's no match, pick one at random
                const randomProject = projects
                    .filter(project => project.blogWritingDate && project.id !== currentProjectId)
                    .sort(() => 0.5 - Math.random())[0]; // Random selection
                if (randomProject) recommendations.push(randomProject);
            }

            // Second recommendation: Same field as currentProject.fieldOfWork[1]
            if (secondFieldProjects.length > 0) {
                recommendations.push(secondFieldProjects[0]);
            } else if (projects.length > 1) { // If there's no match, pick one at random
                const randomProject = projects
                    .filter(project => project.blogWritingDate && project.id !== currentProjectId && !recommendations.includes(project))
                    .sort(() => 0.5 - Math.random())[0]; // Random selection
                if (randomProject) recommendations.push(randomProject);
            }

            // Third recommendation: Unrelated project
            if (unrelatedProjects.length > 0) {
                const unrelatedProject = unrelatedProjects
                    .filter(project => project.blogWritingDate && !recommendations.includes(project))
                    .sort(() => 0.5 - Math.random())[0]; // Random selection
                if (unrelatedProject) {
                    recommendations.push(unrelatedProject);
                }
            }

            // Populate the readMoreGallery
            const readMoreGallery = document.querySelector('.readMoreGallery');
            readMoreGallery.innerHTML = ''; // Clear previous content

            recommendations.forEach(project => {
                const moreItem = document.createElement('div');
                moreItem.className = 'moreItem';

                const img = document.createElement('img');
                img.src = project.thumbnailImage;
                img.alt = project.title; // You can set this to any meaningful alt text
                img.className = 'moreThumb';
                moreItem.onclick = () => {
                window.location.href = `blog.html?id=${encodeURIComponent(project.id)}`; // Link to blog URL
            };

                moreItem.appendChild(img);
                readMoreGallery.appendChild(moreItem);
            });
        }



        // Call the recommendProjects function
        recommendProjects();
    })
    .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });


function formatDate(dateString) {
    // Split the date string into parts
    const [day, month, year] = dateString.split(/[-.]/);
    
    // Month names array
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // Function to get the correct ordinal suffix for a given day
    function getOrdinalSuffix(num) {
        if (num >= 11 && num <= 13) {
            return 'th'; // Special case for 11th, 12th, 13th
        }
        switch (num % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    // Convert month number to month name
    const monthName = monthNames[parseInt(month) - 1]; // months are 0-indexed
    
    // Remove leading zero from day and add ordinal suffix
    const dayWithoutLeadingZero = parseInt(day, 10); // Convert to integer to remove leading zero
    const dayWithSuffix = `${dayWithoutLeadingZero}${getOrdinalSuffix(dayWithoutLeadingZero)}`;
    
    return `${monthName} ${dayWithSuffix} ${year}`;
}

function renderBlogPost(data) {
    // Populate Header Contents
    const blogHeadContents = document.querySelector('.blogHeadContents');

    // Title
    const titleElement = blogHeadContents.querySelector('.blogTitle');
    titleElement.textContent = data.title;

    // Subtitle
    const subtitleElement = blogHeadContents.querySelector('.blogSubTitle');
    subtitleElement.textContent = data.subtitle;

    // Reading Time
    const readingTimeElement = blogHeadContents.querySelector('.readingTime');
    readingTimeElement.textContent = `${data.estimatedReadTime} minute read`;

    // Author Name
    const authorElement = blogHeadContents.querySelector('.author');
    authorElement.textContent = `Edward Rocca`;

    // Blog Written Date
    const dateWrittenElement = blogHeadContents.querySelector('.dateWritten');
    const formattedDateWritten = formatDate(data.blogWritingDate);
    
    const formattedDateUpdated = data.blogUpdateDate ? ` (Updated: ${formatDate(data.blogUpdateDate)})` : '';
    dateWrittenElement.innerHTML = `${formattedDateWritten}<span class="dateUpdated">${formattedDateUpdated}</span>`;

    // Hero Image
    const heroImageElement = document.querySelector('.heroImage');
    heroImageElement.src = data.heroImage;
    heroImageElement.alt = "background image"; // Customize this as needed

    // Populate Blog Content
    const blogContainer = document.querySelector('.blogMain');

    data.blogContent.forEach(item => {
        switch (item.type) {
            case 'section':
                if (item.title != null && item.title.length > 0 ) {
                    const headingElement = document.createElement('h4');
                    headingElement.className = 'blogHeadings';
                    headingElement.textContent = item.title;
                    blogContainer.appendChild(headingElement);
                }
                
                
                // Create paragraphs
                item.paragraphs.forEach(paragraphText => {
                    const paragraphElement = document.createElement('p');
                    paragraphElement.className = 'blogParagraph';
                    paragraphElement.innerHTML = paragraphText;
                    blogContainer.appendChild(paragraphElement);
                });
                break;
            case 'images':
                const imageData = {
                    mediaUrls: item.mediaUrls,
                    captions: item.captions
                };

                if (imageData) {
                    // Check the number of mediaUrls to determine how to display them
                    if (imageData.mediaUrls.length === 1) {
                        console.log("1 image found.");
                        
                        const imageBlock = document.createElement('div');
                        imageBlock.className = 'blogImageBlock';

                        const img = document.createElement('img');
                        img.src = imageData.mediaUrls[0];
                        img.alt = 'image description'; // Customize as needed
                        img.className = 'blogImage';
                            // const flexGrowValue = img.width / img.height;
                            // img.style.flexGrow = flexGrowValue;

                        const caption = document.createElement('p');
                        caption.className = 'blogImageCaption';
                        caption.textContent = imageData.captions[0];

                        imageBlock.appendChild(img);
                        imageBlock.appendChild(caption);
                        blogContainer.appendChild(imageBlock);
                    } else if (imageData.mediaUrls.length > 1) {
                        const duetBlock = document.createElement('div');
                        duetBlock.className = 'blogImageDuet';
                        const dualImages = document.createElement('div');
                        dualImages.className = 'dualImages';

                        // Initialize variables for image elements
                        let duetImg1, duetImg2;

                        // Load images to their respective variables
                        imageData.mediaUrls.forEach((url, index) => {
                            const duetImg = document.createElement('img');
                            duetImg.src = url;
                            duetImg.alt = 'image description'; // Customize as needed
                            duetImg.className = 'blogImageDouble';

                            duetImg.onload = function() {
                                const flexGrowValue = duetImg.width / duetImg.height;
                                duetImg.style.flexGrow = flexGrowValue;

                                // Store the image into the respective variable
                                if (index === 0) {
                                    duetImg1 = duetImg;
                                } else if (index === 1) {
                                    duetImg2 = duetImg;
                                }

                                // Append images in order after both are loaded
                                if (duetImg1 && duetImg2) {
                                    dualImages.appendChild(duetImg1);
                                    dualImages.appendChild(duetImg2);
                                }
                            };
                        });

                        duetBlock.appendChild(dualImages);
                        imageData.captions.forEach((caption) => {
                                const captionElement = document.createElement('p');
                                captionElement.className = 'blogImageCaption';
                                captionElement.textContent = caption;
                                duetBlock.appendChild(captionElement);
                            });
                        blogContainer.appendChild(duetBlock); // Or wherever you want to append duetBlock
                    }

                }
                break;


        }
    });
}

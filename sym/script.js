document.addEventListener('DOMContentLoaded', () => {
    const homepage = document.getElementById('homepage');
    const employerSection = document.getElementById('employer-section');
    const jobDetailsPage = document.getElementById('job-details-page');

    const vacanciesBtn = document.getElementById('vacancies-btn');
    const addjobsBtn = document.getElementById('addjobs-btn');
    
    const backToMainBtnEmployer = document.getElementById('back-to-main-employer');
    const backToVacanciesBtn = document.getElementById('back-to-vacancies');
    
    const jobPostForm = document.getElementById('job-post-form');
    const logoFileInput = document.getElementById('logoFile'); 
    const jobListingsContainer = document.getElementById('job-listings-container');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const jobDetailsContainer = document.getElementById('job-details-container');

    const DEFAULT_LOGO = 'https://via.placeholder.com/60/E0E0E0/7F8C8D?text=Logo';

    // Initial job data with added postDate for proper sorting
    let jobs = [
        { company: 'Creative Corp', title: 'Senior UX Designer', category: 'Graphic Design', type: 'Full-Time', description: 'We are looking for a talented UX Designer to create amazing user experiences, focusing on usability and accessibility, ensuring our products are intuitive and delightful for users. You will work closely with product managers and engineers.', email: 'hr@creativecorp.com', phone: '123-456-7890', deadline: '2025-11-25', postDate: '2025-09-20', logoUrl: 'https://via.placeholder.com/60/FF7043/FFFFFF?text=CC' },
        { company: 'Digital Solutions', title: 'Digital Marketing Specialist', category: 'Marketing', type: 'Full-Time', description: 'Join our dynamic marketing team to manage digital campaigns, SEO, SEM, and social media presence. You\'ll be responsible for developing, implementing, and managing marketing campaigns that promote our company and its products/services.', email: 'hr@digital-solutions.com', phone: '123-456-7891', deadline: '2025-10-30', postDate: '2025-09-28', logoUrl: 'https://via.placeholder.com/60/3C6EE6/FFFFFF?text=DS' },
        { company: 'Innovate Tech', title: 'Frontend Developer (React)', category: 'IT & Software', type: 'Contract', description: 'Build beautiful and responsive web applications with our team of skilled engineers using React, HTML, CSS, and JavaScript. We are looking for someone passionate about creating excellent user interfaces and experiences.', email: 'tech@innovate.com', phone: '123-456-7892', deadline: '2025-12-15', postDate: '2025-09-30', logoUrl: 'https://via.placeholder.com/60/28A745/FFFFFF?text=IT' },
        { company: 'Capital Finance', title: 'Financial Analyst', category: 'Finance', type: 'Full-Time', description: 'Analyze financial data, prepare reports, and provide insights to support business decision-making. This role requires strong analytical skills and a solid understanding of financial principles.', email: 'finance@capital.com', phone: '123-456-7893', deadline: '2025-12-01', postDate: '2025-09-15', logoUrl: 'https://via.placeholder.com/60/6C757D/FFFFFF?text=CF' },
        { company: 'Art Studio', title: 'Graphic Designer', category: 'Graphic Design', type: 'Part-Time', description: 'Create stunning visuals for web and print, working on branding, marketing materials, and digital content. You should have a keen eye for aesthetics and a strong portfolio demonstrating your design skills.', email: 'design@artstudio.com', phone: '123-456-7894', deadline: '2025-11-20', postDate: '2025-09-25', logoUrl: 'https://via.placeholder.com/60/FFC107/FFFFFF?text=AS' }
    ];

    /**
     * Controls which single view is active (homepage, employer form, or job details).
     * @param {HTMLElement} viewToShow The element to make active.
     */
    const showView = (viewToShow) => {
        homepage.classList.remove('active');
        employerSection.classList.remove('active');
        jobDetailsPage.classList.remove('active');
        viewToShow.classList.add('active');
    };
    
    const showJobCardsView = () => {
        // Ensure jobs are filtered before showing the cards
        checkAndRemoveExpiredJobs();
        renderJobs();
        showView(homepage);
    }

    const viewJobDetails = (job) => {
        jobDetailsContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 2rem;">
                <img src="${job.logoUrl || DEFAULT_LOGO}" alt="${job.company} logo" class="company-logo" style="width: 80px; height: 80px; border-radius: 50%;">
                <div>
                    <h2 style="font-family: 'Montserrat', sans-serif; font-size: 2.2rem; color: var(--text-primary); margin-bottom: 0.2rem;">${job.title}</h2>
                    <p style="font-size: 1.1rem; color: var(--text-secondary); margin: 0;">${job.company}</p>
                    <div style="display: flex; gap: 10px; margin-top: 0.5rem;">
                        <span class="job-tag tag-category">${job.category}</span>
                        <span class="job-tag tag-type">${job.type}</span>
                    </div>
                </div>
            </div>
            
            <p style="margin-bottom: 1.5rem;"><strong>Application Deadline:</strong> ${new Date(job.deadline).toLocaleDateString()}</p>
            <p style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.8rem;">Job Description:</p>
            <div class="description-box">
                <p>${job.description}</p>
            </div>
            <div class="contact-info" style="margin-top: 2rem; margin-bottom: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                <p><strong>Contact Email:</strong> <a href="mailto:${job.email}" style="color: var(--primary-color); text-decoration: none;">${job.email}</a></p>
                <p><strong>Contact Phone:</strong> ${job.phone || 'Not provided'}</p>
            </div>
            <a href="mailto:${job.email}" class="apply-btn-details" style="display: inline-block; background-color: var(--accent-color); color: white; padding: 1rem 2.5rem; border-radius: 50px; text-decoration: none; font-weight: 600; transition: background-color 0.3s ease, transform 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">Apply Now</a>
        `;
        showView(jobDetailsPage); 
    };

    const checkAndRemoveExpiredJobs = () => {
        const now = new Date();
        // Keep jobs where the deadline date is greater than or equal to today
        jobs = jobs.filter(job => new Date(job.deadline) >= now);
    };

    const getUniqueCategories = () => {
        // Ensure we filter out expired jobs before generating categories
        checkAndRemoveExpiredJobs();
        
        const categories = new Set(jobs.map(job => job.category));
        
        // Save the current filter selection before updating the options
        const currentCategory = categoryFilter.value;
        
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        // Restore the previous filter selection if it still exists
        if (currentCategory === 'all' || categories.has(currentCategory)) {
            categoryFilter.value = currentCategory;
        }
    }

    const filterAndSortJobs = () => {
        checkAndRemoveExpiredJobs(); // Filter out expired jobs
        const selectedCategory = categoryFilter.value;
        const selectedSort = sortBy.value;
        
        let filteredJobs = [...jobs];

        // 1. Filter by Category
        if (selectedCategory !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.category === selectedCategory);
        }

        // 2. Sort
        if (selectedSort === 'latest') {
            // Sort by latest post date (newest first)
            filteredJobs.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
        } else if (selectedSort === 'oldest') {
            // Sort by oldest post date (oldest first)
            filteredJobs.sort((a, b) => new Date(a.postDate) - new Date(b.postDate));
        }
        
        return filteredJobs;
    }
    
    // Renders the list of jobs based on current filters and sorting
    const renderJobs = () => {
        getUniqueCategories();
        const jobsToRender = filterAndSortJobs();
        jobListingsContainer.innerHTML = '';
        
        if (jobsToRender.length === 0) {
            jobListingsContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 2rem; font-size: 1.1rem;">No jobs found matching your current filters. Try adjusting your selections.</p>';
        } else {
            jobsToRender.forEach((job) => {
                const jobCard = document.createElement('div');
                jobCard.className = 'job-card';
                
                jobCard.innerHTML = `
                    <div class="job-header-details">
                        <img src="${job.logoUrl || DEFAULT_LOGO}" alt="${job.company} logo" class="company-logo">
                        <div class="job-title-info">
                            <h3>${job.title}</h3>
                            <p class="company-name">${job.company}</p>
                        </div>
                    </div>
                    <div class="job-tags">
                        <span class="job-tag tag-category">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                            ${job.category}
                        </span>
                        <span class="job-tag tag-type">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-briefcase"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            ${job.type}
                        </span>
                    </div>
                    <p class="description-text">${job.description.substring(0, 150)}...</p>
                    <button class="view-btn">View Details</button>
                `;
                
                // Attach the event listener directly to the button
                const viewBtn = jobCard.querySelector('.view-btn');
                viewBtn.addEventListener('click', () => {
                    viewJobDetails(job);
                });
                
                jobListingsContainer.appendChild(jobCard);
            });
        }
    };

    // --- Form Submission Logic ---
    const submitNewJob = (logoDataUrl) => {
        const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        
        const newJob = {
            company: document.getElementById('companyName').value,
            title: document.getElementById('jobTitle').value,
            email: document.getElementById('contactEmail').value,
            logoUrl: logoDataUrl,
            category: document.getElementById('category').value,
            type: document.getElementById('jobType').value,
            deadline: document.getElementById('deadline').value,
            description: document.getElementById('jobDescription').value,
            phone: document.getElementById('contactPhone').value,
            postDate: today // Set the post date to today
        };

        jobs.push(newJob);
        jobPostForm.reset();
        alert('Job has been posted successfully!');
        
        // Show the job cards view with the new job included
        showJobCardsView();
    }

    // --- Event Listeners ---

    // Navigation Buttons
    vacanciesBtn.addEventListener('click', showJobCardsView); 
    addjobsBtn.addEventListener('click', () => {
        showView(employerSection);
    });
    
    backToMainBtnEmployer.addEventListener('click', showJobCardsView);
    backToVacanciesBtn.addEventListener('click', showJobCardsView);
    
    // Filtering and Sorting
    categoryFilter.addEventListener('change', renderJobs);
    sortBy.addEventListener('change', renderJobs);

    // Job Posting Form Submission
    jobPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const file = logoFileInput.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const base64Logo = event.target.result;
                submitNewJob(base64Logo);
            };
            
            reader.onerror = function() {
                alert('Error reading file. Please try again.');
            };

            reader.readAsDataURL(file);

        } else {
            submitNewJob(DEFAULT_LOGO);
        }
    });

    // Initial load of jobs
    renderJobs();
});
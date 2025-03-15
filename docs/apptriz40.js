/**
 * TRIZ Principles Explorer Application
 * 
 * This application allows users to search for and explore the 40 TRIZ principles
 * and their examples across different industries.
 */

// Global variables
let trizPrinciples = [];
let industryExamples = {};
let industryPrinciples = {};
let selectedPrinciple = null;
let currentIndustry = 'general';
let comparisonPrinciples = [];

// Principle relationships data
const principleRelationships = {
    1: [2, 3, 15, 17], // Segmentation related to Taking Out, Local Quality, Dynamism, Another Dimension
    2: [1, 3, 25, 29], // Taking Out related to Segmentation, Local Quality, Self-service, Pneumatics/Hydraulics
    3: [1, 2, 35, 40], // Local Quality related to Segmentation, Taking Out, Parameter Changes, Composite Materials
    4: [14, 17, 7, 35], // Asymmetry related to Spheroidality, Another Dimension, Nested Doll, Parameter Changes
    5: [6, 9, 34, 40], // Merging related to Universality, Preliminary Counteraction, Discarding, Composite Materials
    6: [5, 36, 25, 1], // Universality related to Merging, Phase Transitions, Self-service, Segmentation
    7: [4, 14, 17, 35], // Nested Doll related to Asymmetry, Spheroidality, Another Dimension, Parameter Changes
    8: [2, 15, 19, 29], // Anti-weight related to Taking Out, Dynamism, Periodic Action, Pneumatics/Hydraulics
    9: [5, 10, 25, 37], // Preliminary Counteraction related to Merging, Preliminary Action, Self-service, Thermal Expansion
    10: [9, 11, 25, 28], // Preliminary Action related to Preliminary Counteraction, Beforehand Cushioning, Self-service, Mechanics Substitution
    11: [10, 16, 27, 40], // Beforehand Cushioning related to Preliminary Action, Partial or Excessive Actions, Cheap Short-Living, Composite Materials
    12: [8, 15, 34, 35], // Equipotentiality related to Anti-weight, Dynamism, Discarding, Parameter Changes
    13: [4, 7, 14, 17], // The Other Way Round related to Asymmetry, Nested Doll, Spheroidality, Another Dimension
    14: [4, 13, 7, 17], // Spheroidality related to Asymmetry, The Other Way Round, Nested Doll, Another Dimension
    15: [1, 8, 12, 19], // Dynamism related to Segmentation, Anti-weight, Equipotentiality, Periodic Action
    16: [11, 19, 20, 40], // Partial or Excessive Actions related to Beforehand Cushioning, Periodic Action, Continuity of Useful Action, Composite Materials
    17: [1, 4, 7, 13], // Another Dimension related to Segmentation, Asymmetry, Nested Doll, The Other Way Round
    18: [19, 24, 31, 36], // Mechanical Vibration related to Periodic Action, Intermediary, Porous Materials, Phase Transitions
    19: [15, 16, 18, 31], // Periodic Action related to Dynamism, Partial or Excessive Actions, Mechanical Vibration, Porous Materials
    20: [16, 21, 29, 38], // Continuity of Useful Action related to Partial or Excessive Actions, Skipping, Pneumatics/Hydraulics, Strong Oxidants
    // Add more relationships as needed for principles 21-40
    21: [20, 22, 35, 38], // Skipping related to Continuity of Useful Action, Blessing in Disguise, Parameter Changes, Strong Oxidants
    22: [21, 23, 25, 37], // Blessing in Disguise related to Skipping, Feedback, Self-service, Thermal Expansion
    23: [22, 24, 35, 40], // Feedback related to Blessing in Disguise, Intermediary, Parameter Changes, Composite Materials
    24: [18, 23, 31, 36], // Intermediary related to Mechanical Vibration, Feedback, Porous Materials, Phase Transitions
    25: [2, 6, 9, 10], // Self-service related to Taking Out, Universality, Preliminary Counteraction, Preliminary Action
    26: [25, 27, 28, 40], // Copying related to Self-service, Cheap Short-Living, Mechanics Substitution, Composite Materials
    27: [11, 26, 28, 40], // Cheap Short-Living related to Beforehand Cushioning, Copying, Mechanics Substitution, Composite Materials
    28: [10, 26, 27, 32], // Mechanics Substitution related to Preliminary Action, Copying, Cheap Short-Living, Color Changes
    29: [2, 8, 20, 36], // Pneumatics/Hydraulics related to Taking Out, Anti-weight, Continuity of Useful Action, Phase Transitions
    30: [14, 29, 31, 39], // Flexible Shells/Thin Films related to Spheroidality, Pneumatics/Hydraulics, Porous Materials, Inert Atmosphere
    31: [18, 19, 24, 30], // Porous Materials related to Mechanical Vibration, Periodic Action, Intermediary, Flexible Shells/Thin Films
    32: [3, 28, 35, 40], // Color Changes related to Local Quality, Mechanics Substitution, Parameter Changes, Composite Materials
    33: [25, 28, 35, 40], // Homogeneity related to Self-service, Mechanics Substitution, Parameter Changes, Composite Materials
    34: [5, 12, 35, 40], // Discarding related to Merging, Equipotentiality, Parameter Changes, Composite Materials
    35: [3, 4, 7, 32], // Parameter Changes related to Local Quality, Asymmetry, Nested Doll, Color Changes
    36: [6, 18, 24, 29], // Phase Transitions related to Universality, Mechanical Vibration, Intermediary, Pneumatics/Hydraulics
    37: [9, 22, 35, 39], // Thermal Expansion related to Preliminary Counteraction, Blessing in Disguise, Parameter Changes, Inert Atmosphere
    38: [20, 21, 35, 39], // Strong Oxidants related to Continuity of Useful Action, Skipping, Parameter Changes, Inert Atmosphere
    39: [30, 37, 38, 40], // Inert Atmosphere related to Flexible Shells/Thin Films, Thermal Expansion, Strong Oxidants, Composite Materials
    40: [3, 5, 11, 16]  // Composite Materials related to Local Quality, Merging, Beforehand Cushioning, Partial or Excessive Actions
};

// Available industries
const INDUSTRIES = [
    { id: 'general', name: 'General' },
    { id: 'software', name: 'Software Engineering' },
    { id: 'education', name: 'Education' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' }, // Fixed typo
    { id: 'finance', name: 'Finance' },
    { id: 'chemical', name: 'Chemical Engineering' },
    { id: 'social', name: 'Social' },
    { id: 'human', name: 'Human Factors and Ergonomics' },
    { id: 'microelectronics', name: 'Microelectronics' },
    { id: 'customer', name: 'Customer Satisfaction Enhancement' }
    // Add more industries as they become available
];

// DOM Elements
const principleSelect = document.getElementById('principle-select');
const industrySelect = document.getElementById('industry-select');
const principleContainer = document.getElementById('principle-container');
const principleTitle = document.getElementById('principle-title');
const principleContent = document.getElementById('principle-content');
const currentIndustrySpan = document.getElementById('current-industry');
const loadingSpinner = document.getElementById('loading-spinner');
const noResults = document.getElementById('no-results');
const introductionText = document.getElementById('introduction-text');
const backToTop = document.getElementById('back-to-top');

// Load data when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initImproved();
});

/**
 * Initialize the application with improvements
 */
async function initImproved() {
    // Show loading spinner during initialization
    loadingSpinner.style.display = 'block';
    
    try {
        // Set up event listeners
        setupEventListenersImproved();
        
        // Fix industry typos
        fixIndustriesTypos();
        
        // Load data in parallel
        await Promise.all([
            loadPrinciplesDataImproved(),
            // No need to load all industry data at once - will use lazy loading instead
        ]);
        
        // Populate principle select dropdown
        populatePrincipleSelect();
        
        // Populate industry select dropdown
        populateIndustrySelect();
        
        // Set up search, filter, comparison
        setupSearchFunctionality();
        setupCategoryFilters();
        setupComparisonFunctionality();
        
        // Enhance accessibility
        enhanceAccessibility();
        
        // Register service worker
        registerServiceWorker();
        
        // Load URL parameters if any
        handleURLParameters();
        
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
        
    } catch (error) {
        console.error('Error initializing application:', error);
        showErrorNotification('Could not load TRIZ principles data. Please refresh the page and try again.');
        loadingSpinner.style.display = 'none';
    }
}

/**
 * Fix "Bussiness" typo in industries list
 */
function fixIndustriesTypos() {
    // Already fixed in the INDUSTRIES constant initialization
    console.log('Industry names checked for typos');
}

/**
 * Set up event listeners for UI elements with improvements
 */
function setupEventListenersImproved() {
    // Principle select change - use improved function
    principleSelect.addEventListener('change', (e) => {
        const principleId = parseInt(e.target.value);
        
        if (principleId) {
            console.log('Principle changed to:', principleId);
            selectPrincipleImproved(principleId);
        }
    });
    
    // Industry select change
    industrySelect.addEventListener('change', (e) => {
        console.log('Industry changed to:', e.target.value);
        
        if (selectedPrinciple) {
            changeIndustry(e.target.value);
        } else {
            console.log('No principle selected yet');
        }
    });
    
    // Back to top button
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Show/hide back to top button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        // Previous principle with left arrow
        if (e.key === 'ArrowLeft' && e.altKey && selectedPrinciple) {
            e.preventDefault();
            const currentIndex = trizPrinciples.findIndex(p => p.id === selectedPrinciple.id);
            if (currentIndex > 0) {
                const prevPrinciple = trizPrinciples[currentIndex - 1];
                principleSelect.value = prevPrinciple.id;
                selectPrincipleImproved(prevPrinciple.id);
            }
        }
        
        // Next principle with right arrow
        if (e.key === 'ArrowRight' && e.altKey && selectedPrinciple) {
            e.preventDefault();
            const currentIndex = trizPrinciples.findIndex(p => p.id === selectedPrinciple.id);
            if (currentIndex < trizPrinciples.length - 1) {
                const nextPrinciple = trizPrinciples[currentIndex + 1];
                principleSelect.value = nextPrinciple.id;
                selectPrincipleImproved(nextPrinciple.id);
            }
        }
    });
    
    // Add responsive behavior
    window.addEventListener('resize', () => {
        // Adjust UI based on screen size if needed
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Mobile-specific adjustments
            document.querySelectorAll('.step-card').forEach(card => {
                card.style.height = 'auto';
            });
        }
    });
}

/**
 * Load principles data from the JSON file with improved error handling
 */
async function loadPrinciplesDataImproved() {
    try {
        console.log('Loading principles data...');
        loadingSpinner.style.display = 'block';
        
        const response = await fetch('data/principles.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load principles: ${response.status}`);
        }
        
        trizPrinciples = await response.json();
        console.log('Principles data loaded successfully:', trizPrinciples.length, 'principles');
        loadingSpinner.style.display = 'none';
    } catch (error) {
        console.error('Error loading principles data:', error);
        loadingSpinner.style.display = 'none';
        
        // Show error notification
        showErrorNotification('Failed to load TRIZ principles. Using fallback data.');
        
        // Fallback to minimal data to allow app to function
        trizPrinciples = [
            {
                id: 1,
                name: "Segmentation",
                descriptions: [
                    {
                        text: "Divide an object into independent parts.",
                        examples: ["Example 1", "Example 2"]
                    }
                ]
            },
            {
                id: 2,
                name: "Taking Out",
                descriptions: [
                    {
                        text: "Separate an interfering part or property from an object.",
                        examples: ["Example 1", "Example 2"]
                    }
                ]
            }
        ];
    }
}

/**
 * Implement lazy loading for industry data
 */
async function lazyLoadIndustryData(industryId) {
    if (industryPrinciples[industryId]) {
        console.log(`Industry data for ${industryId} already loaded`);
        return industryPrinciples[industryId];
    }
    
    console.log(`Lazy loading industry data for ${industryId}...`);
    loadingSpinner.style.display = 'block';
    
    try {
        const response = await fetch(`data/principles_${industryId}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${industryId} principles: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store the industry principles data
        industryPrinciples[industryId] = data;
        
        // Process for the examples format we need
        if (data.principles) {
            industryExamples[industryId] = {};
            data.principles.forEach(principle => {
                industryExamples[industryId][principle.id] = principle.examples;
            });
        }
        
        loadingSpinner.style.display = 'none';
        return data;
    } catch (error) {
        console.error(`Error loading ${industryId} principles:`, error);
        showErrorNotification(`Failed to load ${getIndustryName(industryId)} industry data. Please try again.`);
        loadingSpinner.style.display = 'none';
        
        // Set empty to avoid errors later
        industryPrinciples[industryId] = { principles: [] };
        return industryPrinciples[industryId];
    }
}

/**
 * Populate the principle select dropdown with all 40 principles
 */
function populatePrincipleSelect() {
    // Sort principles by ID to ensure they appear in correct order
    const sortedPrinciples = [...trizPrinciples].sort((a, b) => a.id - b.id);
    
    console.log('Populating principle select with', sortedPrinciples.length, 'principles');
    
    // Clear current options
    principleSelect.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Select a principle (1-40)";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    principleSelect.appendChild(defaultOption);
    
    // Generate options for each principle
    sortedPrinciples.forEach(principle => {
        const option = document.createElement('option');
        option.value = principle.id;
        option.textContent = `${principle.id}. ${principle.name}`;
        principleSelect.appendChild(option);
    });
    
    console.log('Principle select populated');
}

/**
 * Populate the industry select dropdown with available industries
 */
function populateIndustrySelect() {
    // Clear current options
    industrySelect.innerHTML = '';
    
    console.log('Populating industry select...');
    
    // Add each industry as an option
    INDUSTRIES.forEach(industry => {
        const option = document.createElement('option');
        option.value = industry.id;
        option.textContent = industry.name;
        
        // Set the general option as default
        if (industry.id === 'general') {
            option.selected = true;
        }
        
        industrySelect.appendChild(option);
    });
    
    // Initially disable the industry select until a principle is chosen
    industrySelect.disabled = true;
    
    console.log('Industry select populated');
}

/**
 * Get the human-readable name for an industry
 */
function getIndustryName(industryId) {
    const industry = INDUSTRIES.find(i => i.id === industryId);
    return industry ? industry.name : industryId.charAt(0).toUpperCase() + industryId.slice(1);
}

/**
 * Change the current industry and update the display
 */
function changeIndustry(industryId) {
    currentIndustry = industryId;
    
    // Update the displayed industry name
    currentIndustrySpan.textContent = getIndustryName(currentIndustry);
    
    // Load industry data if needed
    if (industryId !== 'general' && !industryPrinciples[industryId]) {
        lazyLoadIndustryData(industryId).then(() => {
            // Update the displayed content with the new industry
            displayPrincipleContent();
        });
    } else {
        // Update the displayed content with the new industry
        displayPrincipleContent();
    }
    
    // Update URL with current principle and industry
    if (selectedPrinciple) {
        updateURL(selectedPrinciple.id, industryId);
    }
    
    console.log('Changed to industry:', industryId);
}

/**
 * Select a principle and display its details with improvements
 */
function selectPrincipleImproved(principleId) {
    // Find the principle by ID
    selectedPrinciple = trizPrinciples.find(p => p.id === principleId);
    
    if (!selectedPrinciple) {
        noResults.style.display = 'block';
        principleContainer.style.display = 'none';
        return;
    }
    
    // Reset to general industry
    currentIndustry = 'general';
    industrySelect.value = 'general';
    currentIndustrySpan.textContent = getIndustryName('general');
    
    // Enable industry select
    industrySelect.disabled = false;
    
    // Hide introduction and no results
    introductionText.style.display = 'none';
    noResults.style.display = 'none';
    
    // Show loading spinner
    loadingSpinner.style.display = 'block';
    principleContainer.style.display = 'none';
    
    // No artificial delay - just process and display
    loadingSpinner.style.display = 'none';
    
    // Update principle title
    principleTitle.textContent = `Principle ${selectedPrinciple.id}: ${selectedPrinciple.name}`;
    
    // Display principle content
    displayPrincipleContent();
    
    // Add related principles section
    displayRelatedPrinciples();
    
    // Show principle container
    principleContainer.style.display = 'block';
    
    // Scroll to principle container
    principleContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Update URL with current principle
    updateURL(principleId, currentIndustry);
    
    // Update compare checkbox state
    updateCompareButtonState();
}

/**
 * Display principle content based on selected principle and industry
 */
function displayPrincipleContent() {
    if (!selectedPrinciple) return;
    
    let html = '';
    
    // Display principle descriptions (general examples)
    if (currentIndustry === 'general') {
        selectedPrinciple.descriptions.forEach((description, index) => {
            html += `
                <div class="principle-description">
                    <p>${description.text}</p>
                </div>
                <div class="principle-examples">
                    <h5>Examples</h5>
                    <ul>
            `;
            
            description.examples.forEach(example => {
                html += `<li>${example}</li>`;
            });
            
            html += `
                    </ul>
                </div>
            `;
            
            // Add separator if not the last description
            if (index < selectedPrinciple.descriptions.length - 1) {
                html += `<hr class="my-4">`;
            }
        });
    }
    // Display industry-specific examples
    else {
        // Check if industry examples exist for this principle
        const industryPrincipleExamples = industryExamples[currentIndustry] && 
                                        industryExamples[currentIndustry][selectedPrinciple.id];
        
        if (industryPrincipleExamples && industryPrincipleExamples.length > 0) {
            // Add principle description first
            if (selectedPrinciple.descriptions && selectedPrinciple.descriptions.length > 0) {
                html += `
                    <div class="principle-description">
                        <p>${selectedPrinciple.descriptions[0].text}</p>
                    </div>
                `;
            }
            
            // Add industry examples
            industryPrincipleExamples.forEach((exampleGroup, groupIndex) => {
                html += `
                    <div class="principle-examples">
                        <h5>${getIndustryName(currentIndustry)} Examples</h5>
                        <ul>
                `;
                
                exampleGroup.forEach(example => {
                    html += `<li>${example}</li>`;
                });
                
                html += `
                        </ul>
                    </div>
                `;
                
                // Add separator if not the last example group
                if (groupIndex < industryPrincipleExamples.length - 1) {
                    html += `<hr class="my-3">`;
                }
            });
        } else {
            // If no industry examples, show message and general examples
            html += `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No specific examples available for ${getIndustryName(currentIndustry)} industry.
                    Showing general examples instead.
                </div>
            `;
            
            // Show general examples
            selectedPrinciple.descriptions.forEach((description, index) => {
                html += `
                    <div class="principle-description">
                        <p>${description.text}</p>
                    </div>
                    <div class="principle-examples">
                        <h5>General Examples</h5>
                        <ul>
                `;
                
                description.examples.forEach(example => {
                    html += `<li>${example}</li>`;
                });
                
                html += `
                        </ul>
                    </div>
                `;
                
                // Add separator if not the last description
                if (index < selectedPrinciple.descriptions.length - 1) {
                    html += `<hr class="my-4">`;
                }
            });
        }
    }
    
    // Add "change industry" prompt if viewing general examples
    if (currentIndustry === 'general') {
        html += `
            <div class="mt-4 text-center">
                <p class="text-muted">
                    <i class="fas fa-lightbulb me-2"></i>
                    Select an industry from the dropdown to see industry-specific examples.
                </p>
            </div>
        `;
    }
    
    principleContent.innerHTML = html;
}

/**
 * Display related principles based on the principleRelationships data
 */
function displayRelatedPrinciples() {
    if (!selectedPrinciple) return;
    
    // Get related principles for the current principle
    const relatedIds = principleRelationships[selectedPrinciple.id] || [];
    
    if (relatedIds.length === 0) return;
    
    // Get related principle objects
    const relatedPrinciples = trizPrinciples.filter(p => relatedIds.includes(p.id));
    
    if (relatedPrinciples.length === 0) return;
    
    // Create HTML for related principles section
    let html = `
        <div class="mt-4 related-principles">
            <h5>Related Principles</h5>
            <div class="row g-3">
    `;
    
    relatedPrinciples.forEach(principle => {
        html += `
            <div class="col-md-6 col-lg-6 mb-3">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h6 class="card-title">${principle.id}. ${principle.name}</h6>
                        <p class="card-text small">${principle.descriptions[0].text.substring(0, 100)}...</p>
                        <button class="btn btn-sm btn-outline-primary select-related" 
                                data-principle-id="${principle.id}">
                            View Principle
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Append related principles section to principle content
    principleContent.innerHTML += html;
    
    // Add event listeners to related principle buttons
    document.querySelectorAll('.select-related').forEach(button => {
        button.addEventListener('click', () => {
            const principleId = parseInt(button.getAttribute('data-principle-id'));
            principleSelect.value = principleId;
            selectPrincipleImproved(principleId);
        });
    });
}

/**
 * Setup search functionality
 */
function setupSearchFunctionality() {
    const searchInput = document.getElementById('principle-search');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    // Add event listener for search input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length < 1) {
            searchResults.style.display = 'none';
            return;
        }
        
        // Search in principles
        const matchingPrinciples = trizPrinciples.filter(principle => {
            // Match by principle ID - fix for single-digit searches
            if (principle.id.toString() === searchTerm || 
                principle.id.toString().includes(searchTerm)) {
                return true;
            }
            
            // Match by principle name
            if (principle.name.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Match in descriptions
            if (principle.descriptions && principle.descriptions.length > 0) {
                return principle.descriptions.some(desc => 
                    desc.text.toLowerCase().includes(searchTerm) ||
                    (desc.examples && desc.examples.some(ex => ex.toLowerCase().includes(searchTerm)))
                );
            }
            
            return false;
        });
        
        // Display search results
        displaySearchResults(matchingPrinciples, searchTerm);
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
    
    // Search input keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const items = searchResults.querySelectorAll('.suggestion-item');
        const activeItem = searchResults.querySelector('.suggestion-item.active');
        let activeIndex = -1;
        
        // Find the index of the active item
        if (activeItem) {
            activeIndex = Array.from(items).indexOf(activeItem);
        }
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (items.length > 0) {
                    const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
                    items.forEach(item => item.classList.remove('active'));
                    items[nextIndex].classList.add('active');
                    items[nextIndex].scrollIntoView({ block: 'nearest' });
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (items.length > 0) {
                    const prevIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
                    items.forEach(item => item.classList.remove('active'));
                    items[prevIndex].classList.add('active');
                    items[prevIndex].scrollIntoView({ block: 'nearest' });
                }
                break;
                
            case 'Enter':
                if (activeItem) {
                    e.preventDefault();
                    activeItem.click();
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                searchResults.style.display = 'none';
                searchInput.blur();
                break;
        }
    });
}

/**
 * Display search results
 */
function displaySearchResults(principles, searchTerm) {
    const searchResults = document.getElementById('search-results');
    
    if (principles.length === 0) {
        searchResults.innerHTML = '<div class="p-3 text-muted">No matching principles found</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    let resultsHTML = '';
    
    principles.forEach(principle => {
        // Highlight the matching text
        let name = principle.name;
        let principleId = principle.id.toString();
        
        if (name.toLowerCase().includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            name = name.replace(regex, '<strong>$1</strong>');
        }
        
        // Check exact match for ID search
        if (principleId === searchTerm || principleId.includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'g');
            principleId = principleId.replace(regex, '<strong>$1</strong>');
        }
        
        resultsHTML += `
            <div class="suggestion-item" data-principle-id="${principle.id}">
                <span class="fw-bold">${principleId}.</span> ${name}
            </div>
        `;
    });
    
    searchResults.innerHTML = resultsHTML;
    searchResults.style.display = 'block';
    
    // Add click event to search results
    searchResults.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const principleId = parseInt(item.getAttribute('data-principle-id'));
            principleSelect.value = principleId;
            selectPrincipleImproved(principleId);
            searchResults.style.display = 'none';
            document.getElementById('principle-search').value = '';
        });
    });
}

/**
 * Setup category filters
 */
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    
    // Add principle categories if not already in the data
    if (trizPrinciples.length > 0 && !trizPrinciples[0].category) {
        // These are approximate categorizations and could be refined
        const categories = {
            spatial: [1, 2, 3, 4, 7, 14, 17, 30, 38],
            material: [5, 6, 10, 27, 31, 32, 34, 35, 36, 37, 39, 40],
            timing: [9, 11, 15, 19, 20, 21, 33]
            // The rest could be classified as "system" or other categories
        };
        
        trizPrinciples.forEach(principle => {
            if (categories.spatial.includes(principle.id)) {
                principle.category = 'spatial';
            } else if (categories.material.includes(principle.id)) {
                principle.category = 'material';
            } else if (categories.timing.includes(principle.id)) {
                principle.category = 'timing';
            } else {
                principle.category = 'system';
            }
        });
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter the principles dropdown
            filterPrinciplesByCategory(category);
        });
    });
}

/**
 * Filter principles by category
 */
function filterPrinciplesByCategory(category) {
    // Clear current options except the default one
    while (principleSelect.options.length > 1) {
        principleSelect.remove(1);
    }
    
    // Filter principles
    let filteredPrinciples = [...trizPrinciples];
    
    if (category !== 'all') {
        filteredPrinciples = trizPrinciples.filter(p => p.category === category);
    }
    
    // Sort by ID
    filteredPrinciples.sort((a, b) => a.id - b.id);
    
    // Add filtered principles to dropdown
    filteredPrinciples.forEach(principle => {
        const option = document.createElement('option');
        option.value = principle.id;
        option.textContent = `${principle.id}. ${principle.name}`;
        principleSelect.appendChild(option);
    });
    
    // Show message if no principles in category
    if (filteredPrinciples.length === 0) {
        principleSelect.innerHTML = '<option value="" disabled selected>No principles in this category</option>';
    }
}

/**
 * Set up comparison functionality
 */
function setupComparisonFunctionality() {
    const compareButton = document.getElementById('compare-button');
    
    // Add compare checkbox to principle container
    const principleHeader = document.querySelector('.card-header.bg-primary');
    if (principleHeader) {
        const compareCheckbox = document.createElement('div');
        compareCheckbox.className = 'form-check position-absolute';
        compareCheckbox.style.right = '1rem';
        compareCheckbox.style.top = '1rem';
        compareCheckbox.innerHTML = `
            <input class="form-check-input" type="checkbox" id="compare-checkbox">
            <label class="form-check-label text-light small" for="compare-checkbox">
                Compare
            </label>
        `;
        principleHeader.appendChild(compareCheckbox);
        
        // Add event listener to checkbox
        document.getElementById('compare-checkbox').addEventListener('change', (e) => {
            if (!selectedPrinciple) return;
            
            if (e.target.checked) {
                // Add to comparison
                if (!comparisonPrinciples.includes(selectedPrinciple.id)) {
                    comparisonPrinciples.push(selectedPrinciple.id);
                }
            } else {
                // Remove from comparison
                comparisonPrinciples = comparisonPrinciples.filter(id => id !== selectedPrinciple.id);
            }
            
            // Update compare button state
            updateCompareButtonState();
        });
    }
}

/**
 * Update compare button state
 */
function updateCompareButtonState() {
    const compareCheckbox = document.getElementById('compare-checkbox');
    
    // Update checkbox state
    if (compareCheckbox && selectedPrinciple) {
        compareCheckbox.checked = comparisonPrinciples.includes(selectedPrinciple.id);
    }
}

/**
 * Implement error notification system
 */
function showErrorNotification(message) {
    const notificationContainer = document.getElementById('notification-container');
    
    // Create notification if container doesn't exist
    if (!notificationContainer) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = 'alert alert-danger alert-dismissible fade show';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.getElementById('notification-container').appendChild(notification);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Add service worker for offline capabilities
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.error('ServiceWorker registration failed:', error);
                });
        });
    }
}

/**
 * Implement URL-based navigation using history API
 */
function updateURL(principleId, industryId) {
    if (!principleId) return;
    
    const url = new URL(window.location);
    url.searchParams.set('principle', principleId);
    
    if (industryId && industryId !== 'general') {
        url.searchParams.set('industry', industryId);
    } else {
        url.searchParams.delete('industry');
    }
    
    window.history.pushState({}, '', url);
}

/**
 * Handle URL parameters on page load
 */
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const principleId = urlParams.get('principle');
    const industryId = urlParams.get('industry');
    
    if (principleId) {
        const principleIdInt = parseInt(principleId);
        
        // Allow time for principles to load
        setTimeout(() => {
            principleSelect.value = principleIdInt;
            selectPrincipleImproved(principleIdInt);
            
            if (industryId) {
                setTimeout(() => {
                    industrySelect.value = industryId;
                    changeIndustry(industryId);
                }, 300);
            }
        }, 300);
    }
}

/**
 * Improve accessibility with ARIA attributes
 */
function enhanceAccessibility() {
    // Add ARIA landmark roles
    document.querySelector('.container').setAttribute('role', 'main');
    
    // Add ARIA labels to dropdowns
    principleSelect.setAttribute('aria-label', 'Select TRIZ principle');
    industrySelect.setAttribute('aria-label', 'Select industry for examples');
    
    // Add ARIA live region for dynamic content
    principleContainer.setAttribute('aria-live', 'polite');
    
    // Make loading spinner accessible
    loadingSpinner.setAttribute('role', 'status');
    loadingSpinner.setAttribute('aria-live', 'assertive');
    
    // Add keyboard focus management
    document.querySelectorAll('button, select, a').forEach(el => {
        el.setAttribute('tabindex', '0');
    });
    
    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#principle-container';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #3498db;
        color: white;
        padding: 8px;
        z-index: 9999;
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Console logging to check initialization
console.log('TRIZ Principles Explorer script loaded');
/**
 * TRIZ Tool Application Logic
 * 
 * This file contains the main functionality for the TRIZ40 tool.
 * Data is loaded from separate JSON files for easier maintenance.
 */

// Global data variables
let trizFeatures = [];
let trizPrinciples = [];
let trizMatrix = [];
let industryPrinciples = {}; // Store industry-specific principles
let currentMatrixSize = 39; // Default matrix size
let currentIndustry = 'general'; // Default industry

// DOM Elements
const matrixSizeSelect = document.getElementById('matrix-size');
const industrySelect = document.getElementById('industry-select');
const featureToImproveSelect = document.getElementById('feature-to-improve');
const featureToPreserveSelect = document.getElementById('feature-to-preserve');
const browseMatrixBtn = document.getElementById('browse-matrix-btn');
const principlesContainer = document.getElementById('principles-container');
const loadingSpinner = document.getElementById('loading-spinner');
const introductionText = document.getElementById('introduction-text');
const examplesContainer = document.getElementById('examples-container');

// Available industries
const INDUSTRIES = [
    { id: 'general', name: 'General' },
    { id: 'software', name: 'Software Engineering' },
    { id: 'education', name: 'Education' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Bussiness' },
    { id: 'finance', name: 'Finance' },
    { id: 'chemical', name: 'Chemical Engineering' },
    { id: 'social', name: 'Social' },
    { id: 'human', name: 'Human Factors and Ergonomics' },
    { id: 'microelectronics', name: 'Microelectronics' },
    { id: 'customer', name: 'Customer Satisfaction Enhancement' }





    // Add more industries as they become available
    // { id: 'chemical', name: 'Chemical Engineering' },
];

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Populate industry select dropdown
    populateIndustrySelect();
    
    // Initialize with default matrix size and industry
    loadDataForMatrixSize(currentMatrixSize);
    
    // Setup event listeners
    setupEventListeners();
});

// Populate industry select dropdown
function populateIndustrySelect() {
    industrySelect.innerHTML = '';
    
    INDUSTRIES.forEach(industry => {
        const option = document.createElement('option');
        option.value = industry.id;
        option.textContent = industry.name;
        industrySelect.appendChild(option);
    });
    
    // Set default industry
    industrySelect.value = currentIndustry;
}

// Load data for specific matrix size
function loadDataForMatrixSize(size) {
    // Show loading spinner
    loadingSpinner.style.display = 'block';
    principlesContainer.style.opacity = '0';
    
    // Determine file paths based on size
    const featuresSuffix = size === 39 ? '' : `_${size}`;
    const matrixSuffix = size === 39 ? '' : `_${size}`;
    
    // Load data from JSON files
    Promise.all([
        fetch(`data/features${featuresSuffix}.json`).then(response => response.json()),
        fetch(`data/principles.json`).then(response => response.json()), // Base principles
        fetch(`data/matrix${matrixSuffix}.json`).then(response => response.json())
    ]).then(([features, principles, matrix]) => {
        trizFeatures = features;
        trizPrinciples = principles;
        trizMatrix = matrix;
        currentMatrixSize = size;
        
        // Initialize the dropdowns
        populateFeatureDropdowns();
        
        // Load industry-specific principles
        loadIndustryPrinciples();
        
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
        principlesContainer.style.opacity = '1';
        
        // Update UI
        resetTool();
        
    }).catch(error => {
        console.error('Error loading data:', error);
        alert(`Error loading ${size}×${size} matrix data. Please try a different size or refresh the page.`);
        loadingSpinner.style.display = 'none';
    });
}

// Load industry-specific principles
function loadIndustryPrinciples() {
    // Load principles for each industry
    const industryPromises = INDUSTRIES.filter(industry => industry.id !== 'general').map(industry => {
        return fetch(`data/principles_${industry.id}.json`)
            .then(response => response.json())
            .then(data => {
                industryPrinciples[industry.id] = data;
            })
            .catch(error => {
                console.error(`Error loading ${industry.id} principles:`, error);
                // If loading fails, set to empty to avoid errors later
                industryPrinciples[industry.id] = { principles: [] };
            });
    });
    
    // Wait for all industry principles to load
    Promise.all(industryPromises).then(() => {
        console.log('All industry principles loaded');
    });
}

// Change industry
function changeIndustry(industryId) {
    currentIndustry = industryId;
    
    // If principles are currently displayed, update them with new industry examples
    const improveId = parseInt(featureToImproveSelect.value);
    const preserveId = parseInt(featureToPreserveSelect.value);
    
    if (improveId > 0 && preserveId > 0 && improveId !== preserveId) {
        const principles = getMatrixPrinciples(improveId, preserveId);
        renderPrinciples(principles, improveId, preserveId);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Matrix size selection change
    matrixSizeSelect.addEventListener('change', function() {
        const newSize = parseInt(this.value);
        if (newSize !== currentMatrixSize) {
            loadDataForMatrixSize(newSize);
        }
    });
    
    // Industry selection change
    industrySelect.addEventListener('change', function() {
        changeIndustry(this.value);
    });
    
    // Browse Matrix button click
    browseMatrixBtn.addEventListener('click', browseMatrix);
    
    // Feature selection change events
    featureToImproveSelect.addEventListener('change', onFeatureSelectionChange);
    featureToPreserveSelect.addEventListener('change', onFeatureSelectionChange);
}

// Handle feature selection change
function onFeatureSelectionChange() {
    // Enable/disable the Browse Matrix button based on selection
    if (featureToImproveSelect.value !== '0' && featureToPreserveSelect.value !== '0' && 
        featureToImproveSelect.value !== featureToPreserveSelect.value) {
        browseMatrixBtn.disabled = false;
        browseMatrixBtn.classList.add('pulse-btn');
    } else {
        browseMatrixBtn.disabled = true;
        browseMatrixBtn.classList.remove('pulse-btn');
    }
}

// Populate feature dropdowns
function populateFeatureDropdowns() {
    // Clear current options except the first one
    featureToImproveSelect.innerHTML = '<option value="0" selected>Feature to improve</option>';
    featureToPreserveSelect.innerHTML = '<option value="0" selected>Feature to preserve</option>';
    
    // Add feature options
    trizFeatures.forEach((feature, index) => {
        const option1 = document.createElement('option');
        option1.value = index + 1; // 1-based indexing
        option1.textContent = feature;
        featureToImproveSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = index + 1; // 1-based indexing
        option2.textContent = feature;
        featureToPreserveSelect.appendChild(option2);
    });
    
    // Initially disable the browse button until selections are made
    browseMatrixBtn.disabled = true;
}

// Get matrix principles
function getMatrixPrinciples(improveId, preserveId) {
    // Convert 1-based to 0-based indexing
    const rowIndex = improveId - 1;
    const colIndex = preserveId - 1;
    
    // Check if the indices are valid
    if (rowIndex >= 0 && rowIndex < trizMatrix.length && 
        colIndex >= 0 && colIndex < trizMatrix[rowIndex].length) {
        // Get principles for this combination
        return trizMatrix[rowIndex][colIndex] || [];
    }
    
    return [];
}

// Find principle by ID from the general principles
function getPrincipleById(id) {
    return trizPrinciples.find(principle => principle.id === id);
}

// Get industry-specific examples for a principle if available
function getIndustryExamples(principleId) {
    // If current industry is 'general', return null to use general examples
    if (currentIndustry === 'general') {
        return null;
    }
    
    // Check if we have data for the selected industry
    if (!industryPrinciples[currentIndustry]) {
        return null;
    }
    
    // Find the principle in the industry data
    const industryPrinciple = industryPrinciples[currentIndustry].principles.find(p => p.id === principleId);
    
    // Return examples if found, otherwise null to fall back to general examples
    return industryPrinciple ? industryPrinciple.examples : null;
}

// Render principles
function renderPrinciples(principles, improveFeature, preserveFeature) {
    if (!principles || principles.length === 0) {
        principlesContainer.innerHTML = `
            <div class="alert alert-warning">
                <h4 class="alert-heading">No principles found</h4>
                <p>The TRIZ matrix (${currentMatrixSize}×${currentMatrixSize}) does not suggest any principles for this contradiction:
                <ul>
                    <li><strong>Improve:</strong> ${trizFeatures[improveFeature-1]}</li>
                    <li><strong>Preserve:</strong> ${trizFeatures[preserveFeature-1]}</li>
                </ul>
                Please try a different combination of features or a different matrix size.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="solution-card">
            <div class="solution-card-header">
                <h3>Suggested TRIZ Principles</h3>
                <p>For improving <strong>${trizFeatures[improveFeature-1]}</strong> while preserving <strong>${trizFeatures[preserveFeature-1]}</strong></p>
                <div class="small text-light">
                    Using ${currentMatrixSize}×${currentMatrixSize} matrix | 
                    Industry: ${INDUSTRIES.find(i => i.id === currentIndustry).name}
                </div>
            </div>
            <div class="solution-card-body">
    `;
    
    principles.forEach(principleId => {
        const principle = getPrincipleById(principleId);
        
        if (principle) {
            html += `
                <div class="solution-item">
                    <div class="solution-item-title">
                        Principle ${principle.id}: ${principle.name}
                    </div>
            `;
            
            // Get industry-specific examples if available
            const industryExamples = getIndustryExamples(principle.id);
            
            if (industryExamples) {
                // Use industry-specific examples
                html += `
                    <div class="industry-badge">
                        <span class="badge bg-primary">${INDUSTRIES.find(i => i.id === currentIndustry).name} Examples</span>
                    </div>
                `;
                
                // Add industry examples
                industryExamples.forEach(exampleGroup => {
                    html += `
                        <div class="principle-examples">
                            <ul>
                                ${exampleGroup.map(example => 
                                    `<li class="principle-example">${example}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                });
            } else {
                // Use general descriptions and examples
                principle.descriptions.forEach(description => {
                    html += `
                        <div class="principle-explanation">
                            ${description.text}
                        </div>
                    `;
                    
                    if (description.examples && description.examples.length > 0) {
                        html += `
                            <div class="principle-examples">
                                <strong>Examples:</strong>
                                <ul>
                                    ${description.examples.map(example => 
                                        `<li class="principle-example">${example}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    }
                });
            }
            
            html += `</div>`;
        } else {
            // Fallback if principle not found
            html += `
                <div class="solution-item">
                    <div class="solution-item-title">
                        Principle ${principleId}
                    </div>
                    <div class="principle-explanation">
                        No detailed information available.
                    </div>
                </div>
            `;
        }
    });
    
    html += `
            </div>
        </div>
    `;
    
    principlesContainer.innerHTML = html;
}

// Browse Matrix
function browseMatrix() {
    const improveId = parseInt(featureToImproveSelect.value);
    const preserveId = parseInt(featureToPreserveSelect.value);
    
    // Validate selection
    if (improveId === 0 || preserveId === 0) {
        alert('Please select both a feature to improve and a feature to preserve.');
        return;
    }
    
    if (improveId === preserveId) {
        alert('The feature to improve and the feature to preserve must be different.');
        return;
    }
    
    // Show loading spinner
    introductionText.style.display = 'none';
    principlesContainer.style.opacity = '0';
    loadingSpinner.style.display = 'block';
    
    // Simulate network delay (or do actual processing)
    setTimeout(() => {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
        principlesContainer.style.opacity = '1';
        
        // Get principles from matrix
        const principles = getMatrixPrinciples(improveId, preserveId);
        
        // Render principles
        renderPrinciples(principles, improveId, preserveId);
        
        // Scroll to results
        principlesContainer.scrollIntoView({ behavior: 'smooth' });
    }, 800);
}

// Show a specific principle's details
function showPrincipleDetails(principleId) {
    const principle = getPrincipleById(principleId);
    
    if (!principle) return;
    
    examplesContainer.style.display = 'block';
    const exampleText = document.getElementById('example-text');
    const exampleImage = document.getElementById('example-image');
    
    let html = `
        <h3>${principle.id}. ${principle.name}</h3>
        <div class="principle-full-details">
    `;
    
    // Get industry-specific examples if available
    const industryExamples = getIndustryExamples(principle.id);
    
    if (industryExamples) {
        // Use industry-specific examples
        html += `
            <div class="industry-badge mb-3">
                <span class="badge bg-primary">${INDUSTRIES.find(i => i.id === currentIndustry).name} Examples</span>
            </div>
        `;
        
        // Add industry examples
        industryExamples.forEach(exampleGroup => {
            html += `
                <div class="principle-examples">
                    <ul>
                        ${exampleGroup.map(example => 
                            `<li class="principle-example">${example}</li>`).join('')}
                    </ul>
                </div>
            `;
        });
    } else {
        // Use general descriptions and examples
        principle.descriptions.forEach(description => {
            html += `
                <div class="principle-explanation">
                    <p>${description.text}</p>
                </div>
            `;
            
            if (description.examples && description.examples.length > 0) {
                html += `
                    <div class="principle-examples">
                        <h4>Examples:</h4>
                        <ul>
                            ${description.examples.map(example => 
                                `<li class="principle-example">${example}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        });
    }
    
    html += `</div>`;
    exampleText.innerHTML = html;
    
    // Show a placeholder image
    exampleImage.innerHTML = `
        <div class="card">
            <div class="card-body text-center">
                <p>Illustration for Principle ${principle.id}</p>
                <div class="placeholder-image" style="background-color: #f5f5f5; height: 200px; display: flex; align-items: center; justify-content: center;">
                    <i class="fa-solid fa-image fa-3x text-muted"></i>
                </div>
            </div>
        </div>
    `;
    
    examplesContainer.scrollIntoView({ behavior: 'smooth' });
}

// Reset the tool to initial state
function resetTool() {
    featureToImproveSelect.value = "0";
    featureToPreserveSelect.value = "0";
    principlesContainer.innerHTML = "";
    examplesContainer.style.display = 'none';
    introductionText.style.display = 'block';
    browseMatrixBtn.disabled = true;
    browseMatrixBtn.classList.remove('pulse-btn');
}

// For debugging: Display the matrix data structure
function debugDisplayMatrix() {
    console.log(`Current Matrix Size: ${currentMatrixSize}×${currentMatrixSize}`);
    console.log(`Current Industry: ${currentIndustry}`);
    console.log('TRIZ Features:', trizFeatures);
    console.log('TRIZ Principles:', trizPrinciples);
    console.log('TRIZ Matrix:', trizMatrix);
    console.log('Industry Principles:', industryPrinciples);
}
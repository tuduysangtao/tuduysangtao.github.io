document.addEventListener("DOMContentLoaded", function () {
    // Template content by cell
    const templateContent = {
        super_past: "• Major industry trends in the past\n• Regulatory environment\n• Economic factors\n• Social/cultural context\n• Key external stakeholders\n• Related fields and industries",
        super_present: "• Current industry landscape\n• Present regulatory requirements\n• Economic situation today\n• Current social/cultural factors\n• Today's stakeholder ecosystem\n• Adjacent fields and technologies",
        super_future: "• Predicted industry evolution\n• Expected regulatory changes\n• Future economic trends\n• Evolving social attitudes\n• Stakeholder development\n• Convergence with other fields",
        system_past: "• Original purpose and goals\n• Previous iterations\n• Historical challenges\n• Key turning points\n• Previous capabilities\n• Earlier configurations",
        system_present: "• Current purpose and goals\n• Present functionality\n• Ongoing challenges\n• Key strengths/weaknesses\n• Current capabilities\n• Present configuration",
        system_future: "• Evolving purpose\n• Potential new functionality\n• Anticipated challenges\n• Future opportunities\n• Expanding capabilities\n• Potential configurations",
        subsystem_past: "• Original components\n• Previous technologies used\n• Former interfaces\n• Initial processes\n• Earlier resource requirements\n• Past internal relationships",
        subsystem_present: "• Current components\n• Technologies in use\n• Present interfaces\n• Active processes\n• Current resource usage\n• Internal relationships today",
        subsystem_future: "• Potential new components\n• Emerging technologies\n• Future interfaces\n• Evolving processes\n• Changing resource needs\n• Future internal dynamics"
    };

    // Cell element references
    const cells = {
        past_super: document.getElementById("past_super"),
        present_super: document.getElementById("present_super"),
        future_super: document.getElementById("future_super"),
        past_system: document.getElementById("past_system"),
        present_system: document.getElementById("present_system"),
        future_system: document.getElementById("future_system"),
        past_subsystem: document.getElementById("past_subsystem"),
        present_subsystem: document.getElementById("present_subsystem"),
        future_subsystem: document.getElementById("future_subsystem")
    };

    // Check if required libraries are available
    if (typeof html2canvas === 'undefined') {
        showError('<i class="fas fa-exclamation-triangle"></i> Error: Required libraries could not be loaded. Please check your internet connection.');
        return;
    }

    // Word counter functionality
    function updateWordCount(textarea) {
        const text = textarea.value.trim();
        const wordCount = text ? text.split(/\s+/).length : 0;

        // Find the associated word count element
        const wordCountElement = textarea.parentElement.querySelector('.word-count');
        if (wordCountElement) {
            wordCountElement.textContent = wordCount + ' words';
        }

        updateProgress();
    }

    // Attach word counter to all textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function () {
            updateWordCount(this);
        });

        // Initial word count
        updateWordCount(textarea);
    });

    // Update progress bar
    function updateProgress() {
        // Get all textareas
        const textareas = document.querySelectorAll('.grid-cell textarea');
        let filledCount = 0;
        
        // Count filled textareas
        textareas.forEach(textarea => {
            if (textarea.value.trim().length > 0) {
                filledCount++;
            }
        });
        
        // Count cells with images
        const imagePreviews = document.querySelectorAll('.image-preview');
        imagePreviews.forEach(preview => {
            if (preview.querySelector('img')) {
                // If this cell's textarea wasn't already counted
                const cellId = preview.id.replace('preview-', '');
                const textarea = document.getElementById(cellId.includes('_') ? 
                    cellId.split('_')[1] + '_' + cellId.split('_')[0] : 
                    cellId);
                
                if (textarea && textarea.value.trim().length === 0) {
                    filledCount++;
                }
            }
        });
        
        // Calculate percentage (9 cells total)
        const percentage = Math.min(Math.round((filledCount / 9) * 100), 100);
        
        // Update progress bar
        document.getElementById('completion-percentage').textContent = percentage + '%';
        document.getElementById('progress-bar').style.width = percentage + '%';
    }

    // Initial progress update
    updateProgress();

    // Template buttons
    document.querySelectorAll('.template-btn').forEach(button => {
        button.addEventListener('click', function () {
            const cellType = this.getAttribute('data-cell');
            const textarea = this.parentElement.querySelector('textarea');

            if (textarea && templateContent[cellType]) {
                if (textarea.value.trim() !== '') {
                    if (confirm("This will replace your current text. Continue?")) {
                        textarea.value = templateContent[cellType];
                        updateWordCount(textarea);
                    }
                } else {
                    textarea.value = templateContent[cellType];
                    updateWordCount(textarea);
                }
            }
        });
    });

    // Focus mode toggle
    document.getElementById('focus-view').addEventListener('click', function () {
        document.getElementById('standard-view').classList.remove('active');
        this.classList.add('active');
        document.getElementById('matrix').classList.add('focus-mode');
    });

    document.getElementById('standard-view').addEventListener('click', function () {
        document.getElementById('focus-view').classList.remove('active');
        this.classList.add('active');
        document.getElementById('matrix').classList.remove('focus-mode');
    });

    // Set focused class for focus mode
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.addEventListener('click', function () {
            document.querySelectorAll('.grid-cell').forEach(c => {
                c.classList.remove('focused');
            });
            this.classList.add('focused');
        });
    });

    // Dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            this.textContent = 'Light Mode';
        } else {
            this.textContent = 'Dark Mode';
        }
    });

    // Handle Clear All button
    document.getElementById("clear_btn").addEventListener("click", function () {
        if (confirm('Are you sure you want to clear all content? This cannot be undone.')) {
            // Clear all textareas
            document.querySelectorAll('.grid-cell textarea').forEach(textarea => {
                textarea.value = '';
            });
            
            // Clear all image previews
            document.querySelectorAll('.image-preview').forEach(preview => {
                preview.innerHTML = '';
            });
            
            // Reset all file inputs
            document.querySelectorAll('.image-upload').forEach(input => {
                input.value = '';
            });
            
            // Update word counts
            document.querySelectorAll('.word-count').forEach(counter => {
                counter.textContent = '0 words';
            });
            
            // Update progress
            updateProgress();
        }
    });

    // Export as PNG functionality
    document.getElementById("export_png_btn").addEventListener("click", function() {
        // Show loading indicator or message
        const errorContainer = document.getElementById('error-container');
        errorContainer.style.display = 'block';
        errorContainer.innerHTML = '<p>Generating image... Please wait.</p>';
        
        // Use setTimeout to allow the UI to update before heavy processing
        setTimeout(() => {
            // Get the matrix element
            const matrix = document.getElementById('matrix');
            
            // Use html2canvas with proper settings to include images
            html2canvas(matrix, {
                allowTaint: true,
                useCORS: true,
                scale: 2, // Higher quality
                logging: false,
                onclone: function(clonedDoc) {
                    // Make any adjustments to the cloned document if needed
                    const clonedMatrix = clonedDoc.getElementById('matrix');
                    clonedMatrix.style.padding = '20px';
                    clonedMatrix.style.backgroundColor = '#ffffff';
                }
            }).then(canvas => {
                // Create download link
                const link = document.createElement('a');
                link.download = 'system-analysis-matrix.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                // Hide loading indicator
                errorContainer.style.display = 'none';
            }).catch(err => {
                // Show error message
                errorContainer.innerHTML = '<p>Error generating image. Please try again.</p>';
                console.error('Error in html2canvas', err);
            });
        }, 100);
    });

    // Function to show error messages
    function showError(message) {
        const errorContainer = document.getElementById('error-container');
        errorContainer.innerHTML = message;
        errorContainer.style.display = 'block';

        // Hide the error message after 5 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }

    // Note: Auto-save functionality is disabled in this environment
    // Add temporary notification about this limitation
    const saveNote = document.createElement('div');
    saveNote.className = 'alert alert-info mt-3 text-center';
    saveNote.style.backgroundColor = '#edf2f4';
    saveNote.style.color = '#2b2d42';
    saveNote.style.border = '1px solid rgba(43, 45, 66, 0.1)';
    saveNote.style.borderRadius = '8px';
    saveNote.style.padding = '10px';
    saveNote.style.marginBottom = '20px';
    saveNote.innerHTML = '<i class="fas fa-info-circle"></i> Note: Changes are not saved between sessions in this environment.';

    // Insert after the download container
    const downloadContainer = document.getElementById('download-container');
    downloadContainer.parentNode.insertBefore(saveNote, downloadContainer.nextSibling);

    // Keyboard shortcuts are disabled in this environment to avoid conflicts with browser functions

    // Set up image upload functionality
    setupImageUploads();
});

function setupImageUploads() {
    // Get all image upload inputs
    const imageInputs = document.querySelectorAll('.image-upload');
    
    // Add event listeners to each input
    imageInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const cellId = this.getAttribute('data-cell');
            const previewDiv = document.getElementById(`preview-${cellId}`);
            
            if (file) {
                // Check if it's an image file
                if (!file.type.match('image.*')) {
                    alert('Please select an image file');
                    return;
                }
                
                // Size check (optional)
                if (file.size > 5000000) { // 5MB limit
                    alert('Image is too large. Please select an image under 5MB.');
                    return;
                }
                
                // Read and preview the image
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Clear previous preview
                    previewDiv.innerHTML = '';
                    
                    // Create image element
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-image';
                    
                    // Create remove button
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = 'Remove';
                    removeBtn.className = 'remove-image';
                    removeBtn.addEventListener('click', function() {
                        previewDiv.innerHTML = '';
                        // Clear the file input
                        document.getElementById(`image-${cellId}`).value = '';
                        // Update progress
                        updateProgress();
                    });
                    
                    // Create actions div
                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'image-actions';
                    actionsDiv.appendChild(removeBtn);
                    
                    // Add elements to preview
                    previewDiv.appendChild(img);
                    previewDiv.appendChild(actionsDiv);
                    
                    // Update progress
                    updateProgress();
                };
                
                reader.readAsDataURL(file);
            }
        });
    });
}
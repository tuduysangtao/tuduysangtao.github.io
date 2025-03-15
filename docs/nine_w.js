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

        updateProgressBar();
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
    function updateProgressBar() {
        const textareas = document.querySelectorAll('textarea');
        let filledCount = 0;

        textareas.forEach(textarea => {
            if (textarea.value.trim().length > 0) {
                filledCount++;
            }
        });

        const percentage = Math.round((filledCount / textareas.length) * 100);
        document.getElementById('progress-bar').style.width = percentage + '%';
        document.getElementById('completion-percentage').textContent = percentage + '%';
    }

    // Initial progress update
    updateProgressBar();

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
        if (confirm("Are you sure you want to clear all entries? This cannot be undone.")) {
            document.querySelectorAll('textarea').forEach(textarea => {
                textarea.value = "";
                updateWordCount(textarea);
            });
        }
    });

    // Export as PNG functionality
    document.getElementById("export_png_btn").addEventListener("click", function () {
        exportMatrix();
    });

    // PDF export functionality has been removed

    // Function to export the matrix as PNG
    function exportMatrix() {
        try {
            // Show loading indicator
            const downloadContainer = document.getElementById("download-container");
            downloadContainer.innerHTML = `
                        <div class="loading-indicator">
                            <div class="spinner"></div>
                            <span>Generating PNG...</span>
                        </div>
                    `;

            // Create a temporary div with professional styling for export
            const tempDiv = document.createElement('div');
            tempDiv.id = 'export-container';
            tempDiv.style.backgroundColor = 'white';
            tempDiv.style.padding = '40px';
            tempDiv.style.maxWidth = '1200px';
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '-9999px';
            document.body.appendChild(tempDiv);

            // Add title and description
            const header = document.createElement('div');
            header.innerHTML = `
                        <h1 style="text-align: center; color: #2b2d42; font-family: Arial, sans-serif; margin-bottom: 5px;">System Analysis Matrix</h1>
                        <p style="text-align: center; color: #8d99ae; font-family: Arial, sans-serif; margin-bottom: 30px;">Strategic analysis across dimensions and time</p>
                    `;
            tempDiv.appendChild(header);

            // Create a professionally styled table
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.fontFamily = 'Arial, sans-serif';
            table.style.marginBottom = '30px';

            // Create header row
            const headerRow = document.createElement('tr');

            // Empty cell for the corner
            const cornerCell = document.createElement('th');
            cornerCell.style.width = '150px';
            cornerCell.style.backgroundColor = '#f8f9fa';
            cornerCell.style.border = '1px solid #dee2e6';
            cornerCell.style.padding = '15px';
            headerRow.appendChild(cornerCell);

            // Add column headers (Past, Present, Future)
            ['Past', 'Present', 'Future'].forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                th.style.backgroundColor = '#2b2d42';
                th.style.color = 'white';
                th.style.padding = '15px';
                th.style.border = '1px solid #dee2e6';
                th.style.textAlign = 'center';
                th.style.fontWeight = 'bold';
                headerRow.appendChild(th);
            });

            table.appendChild(headerRow);

            // Add rows for each system level
            const rowLabels = ['Super System', 'System', 'Subsystem'];
            const cellIds = [
                ['past_super', 'present_super', 'future_super'],
                ['past_system', 'present_system', 'future_system'],
                ['past_subsystem', 'present_subsystem', 'future_subsystem']
            ];

            rowLabels.forEach((label, rowIndex) => {
                const tr = document.createElement('tr');

                // Row header
                const th = document.createElement('th');
                th.textContent = label;
                th.style.backgroundColor = '#f8f9fa';
                th.style.border = '1px solid #dee2e6';
                th.style.padding = '15px';
                th.style.textAlign = 'right';
                th.style.fontWeight = 'bold';
                th.style.color = '#2b2d42';
                tr.appendChild(th);

                // Data cells
                cellIds[rowIndex].forEach((id, colIndex) => {
                    const td = document.createElement('td');
                    td.style.border = '1px solid #dee2e6';
                    td.style.padding = '15px';
                    td.style.verticalAlign = 'top';
                    td.style.backgroundColor = 'white';

                    // Alternate row shading for better readability
                    if (rowIndex % 2 === 1) {
                        td.style.backgroundColor = '#f8f9fa';
                    }

                    // Add cell content with formatting
                    const content = document.getElementById(id).value || '';
                    const formattedContent = content.replace(/\n/g, '<br>');
                    td.innerHTML = formattedContent;

                    tr.appendChild(td);
                });

                table.appendChild(tr);
            });

            tempDiv.appendChild(table);

            // Add timestamp and footer
            const footer = document.createElement('div');
            footer.innerHTML = `
                        <p style="text-align: right; color: #8d99ae; font-family: Arial, sans-serif; font-size: 12px;">Generated on: ${new Date().toLocaleString()}</p>
                    `;
            tempDiv.appendChild(footer);

            // Use html2canvas to create image
            html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false
            }).then(canvas => {
                // Remove the temporary div
                document.body.removeChild(tempDiv);

                // Convert canvas to PNG
                const dataURL = canvas.toDataURL("image/png");
                const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

                // Create download link
                const downloadLink = document.createElement("a");
                downloadLink.href = dataURL;
                downloadLink.download = "system_analysis_" + timestamp + ".png";
                downloadLink.innerHTML = '<i class="fas fa-download"></i> Download PNG';
                downloadLink.className = "download-btn";

                // Clear loading and add download link
                downloadContainer.innerHTML = '';
                downloadContainer.appendChild(downloadLink);
            }).catch(error => {
                showError('<i class="fas fa-exclamation-triangle"></i> Error generating export: ' + error.message);
            });
        } catch (error) {
            showError('<i class="fas fa-exclamation-triangle"></i> Error: ' + error.message);
        }
    }

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
});
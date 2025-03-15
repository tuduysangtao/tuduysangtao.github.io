document.addEventListener("DOMContentLoaded", function () {
    // Variables
    const MAX_WHYS = 5;
    let whyCount = 0;

    // Template content for different why levels
    const templateContent = {
        problem: "Our product quality has declined significantly in the last quarter, with customer complaints increasing by 30%.",
        why1: "Production errors have increased due to recent changes in our manufacturing process.",
        why2: "New equipment was installed without proper calibration and testing.",
        why3: "The implementation timeline was shortened to meet quarterly production targets.",
        why4: "Management prioritized meeting production quotas over quality assurance protocols.",
        why5: "Our organization lacks a formal process for balancing production goals with quality standards."
    };

    // DOM Elements
    const problemInput = document.getElementById('problem');
    const whysContainer = document.getElementById('whys-container');
    const addWhyBtn = document.getElementById('add-why');
    const resetBtn = document.getElementById('reset');
    const exportPngBtn = document.getElementById('export-png');
    const diagramBox = document.getElementById('diagram-box');
    const downloadContainer = document.getElementById('download-container');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const timestampDisplay = document.getElementById('timestamp-display');

    // Set current timestamp
    updateTimestamp();

    // Initialize
    updateDiagram();
    updateProgress();

    // Event Listeners
    addWhyBtn.addEventListener('click', addWhy);
    resetBtn.addEventListener('click', resetForm);
    exportPngBtn.addEventListener('click', exportAsPng);
    problemInput.addEventListener('input', function () {
        updateDiagram();
        updateProgress();
    });

    // Template button listener for problem statement
    if (document.getElementById('problem-template')) {
        document.getElementById('problem-template').addEventListener('click', function () {
            if (problemInput.value.trim() !== '') {
                if (confirm("This will replace your current text. Continue?")) {
                    problemInput.value = templateContent.problem;
                    updateDiagram();
                    updateProgress();
                }
            } else {
                problemInput.value = templateContent.problem;
                updateDiagram();
                updateProgress();
            }
        });
    }

    // Functions
    function addWhy() {
        if (whyCount >= MAX_WHYS) {
            showNotification('Maximum of 5 "Why?" questions reached', 'warning');
            return;
        }

        whyCount++;

        const whyDiv = document.createElement('div');
        whyDiv.className = 'why-input';
        whyDiv.innerHTML = `
            <div class="why-number">${whyCount}</div>
            <div class="why-label">
                <i class="fas fa-question-circle label-icon"></i>
                Why? (Level ${whyCount})
            </div>
            <div class="text-field-container">
                <textarea id="why${whyCount}" class="form-control" placeholder="Why did this happen? Be specific about the cause..."></textarea>
                <button class="template-btn" id="why${whyCount}-template">
                    <i class="fas fa-magic"></i> Template
                </button>
            </div>
        `;

        whysContainer.appendChild(whyDiv);

        // Add event listener to the new textarea
        document.getElementById(`why${whyCount}`).addEventListener('input', function () {
            updateDiagram();
            updateProgress();
        });

        // Add template button listener for this why level
        document.getElementById(`why${whyCount}-template`).addEventListener('click', function () {
            const whyTextarea = document.getElementById(`why${whyCount}`);
            const templateKey = `why${whyCount}`;

            if (whyTextarea.value.trim() !== '') {
                if (confirm("This will replace your current text. Continue?")) {
                    whyTextarea.value = templateContent[templateKey];
                    updateDiagram();
                    updateProgress();
                }
            } else {
                whyTextarea.value = templateContent[templateKey];
                updateDiagram();
                updateProgress();
            }
        });

        // Update UI state
        updateButtonState();
        updateDiagram();
        updateProgress();

        // Scroll to the new input
        setTimeout(() => {
            whyDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.getElementById(`why${whyCount}`).focus();
        }, 100);
    }

    function resetForm() {
        if (confirm('Are you sure you want to reset the analysis? All entries will be cleared.')) {
            problemInput.value = '';
            whysContainer.innerHTML = '';
            whyCount = 0;
            updateButtonState();
            updateDiagram();
            updateProgress();
            updateTimestamp();
            problemInput.focus();
        }
    }

    function updateButtonState() {
        addWhyBtn.disabled = (whyCount >= MAX_WHYS);
        if (addWhyBtn.disabled) {
            addWhyBtn.classList.add('btn-light');
            addWhyBtn.classList.remove('btn-primary');
        } else {
            addWhyBtn.classList.add('btn-primary');
            addWhyBtn.classList.remove('btn-light');
        }
    }

    function updateProgress() {
        // Count filled inputs
        let filledInputs = 0;
        let totalInputs = 1 + whyCount; // Problem + why questions

        if (problemInput.value.trim()) filledInputs++;

        for (let i = 1; i <= whyCount; i++) {
            const whyInput = document.getElementById(`why${i}`);
            if (whyInput && whyInput.value.trim()) filledInputs++;
        }

        // Calculate percentage
        const percentage = Math.round((filledInputs / totalInputs) * 100);
        progressBar.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;

        // Change color based on progress
        if (percentage < 30) {
            progressBar.style.background = 'linear-gradient(135deg, #ff9999 0%, #ff6666 100%)';
        } else if (percentage < 70) {
            progressBar.style.background = 'linear-gradient(135deg, #ffcc66 0%, #ff9933 100%)';
        } else {
            progressBar.style.background = 'linear-gradient(135deg, #66cc99 0%, #33aa66 100%)';
        }
    }

    function updateDiagram() {
        diagramBox.innerHTML = '';

        // Create entries array
        const entries = [];

        // Add problem statement
        const problemText = problemInput.value.trim() || 'Problem Statement';
        entries.push({ text: problemText, type: 'problem' });

        // Add why entries
        for (let i = 1; i <= whyCount; i++) {
            const whyInput = document.getElementById(`why${i}`);
            if (whyInput) {
                const whyText = whyInput.value.trim() || `Cause ${i}`;
                entries.push({
                    text: whyText,
                    type: i === whyCount ? 'root' : 'cause',
                    level: i
                });
            }
        }

        // If no entries, show empty state
        if (entries.length === 1 && !problemInput.value.trim()) {
            showEmptyState();
            return;
        }

        // Build diagram
        entries.forEach((entry, index) => {
            const isLast = index === entries.length - 1;
            const isProblem = index === 0;
            const isRoot = entry.type === 'root';

            // Create box with appropriate classes
            const boxDiv = document.createElement('div');
            boxDiv.className = 'cause-box';

            if (isProblem) {
                boxDiv.classList.add('problem-box');
            } else if (isRoot) {
                boxDiv.style.borderColor = '#d90429';
                boxDiv.style.backgroundColor = '#fff8f8';
            }

            // Add label for non-problem boxes
            if (!isProblem) {
                boxDiv.style.setProperty('--label-content', `'Why ${entry.level}'`);
                boxDiv.setAttribute('data-level', entry.level);
                boxDiv.style.borderLeftWidth = '4px';
            }

            boxDiv.textContent = entry.text;

            diagramBox.appendChild(boxDiv);

            // Add arrow and "Why?" between boxes (except after the last one)
            if (!isLast) {
                const arrowDiv = document.createElement('div');
                arrowDiv.className = 'why-spacer';

                const arrow = document.createElement('div');
                arrow.className = 'arrow-down';

                const whyTextDiv = document.createElement('div');
                whyTextDiv.className = 'why-text';
                whyTextDiv.textContent = 'Why?';

                arrowDiv.appendChild(arrow);
                arrowDiv.appendChild(whyTextDiv);

                diagramBox.appendChild(arrowDiv);
            }
        });
    }

    function showEmptyState() {
        diagramBox.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-search"></i>
                </div>
                <div class="empty-state-text">Begin your root cause analysis</div>
                <div class="empty-state-subtext">
                    Start by defining your problem statement, then add "Why?" questions to dig deeper into the causes.
                </div>
            </div>
        `;
    }

    function exportAsPng() {
        // Validate if there's content to export
        if (!problemInput.value.trim() && whyCount === 0) {
            showNotification('Please add a problem statement before exporting', 'warning');
            problemInput.focus();
            return;
        }

        // Update timestamp before export
        updateTimestamp();

        // Show loading indicator
        downloadContainer.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <span>Generating diagram image...</span>
            </div>
        `;

        // Use html2canvas to capture the diagram
        html2canvas(document.getElementById('capture-area'), {
            scale: 2, // Higher quality
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            allowTaint: true
        }).then(function (canvas) {
            // Convert canvas to data URL
            const dataURL = canvas.toDataURL("image/png");

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const filename = "5whys_analysis_" + timestamp + ".png";

            // Create download link
            const downloadLink = document.createElement("a");
            downloadLink.href = dataURL;
            downloadLink.download = filename;
            downloadLink.innerHTML = '<i class="fas fa-download"></i> Download Diagram PNG';
            downloadLink.className = "download-btn";

            // Clear loading and add the download link
            downloadContainer.innerHTML = '';
            downloadContainer.appendChild(downloadLink);

            // For mobile devices, trigger download automatically
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                setTimeout(function () {
                    downloadLink.click();
                }, 100);
            }

            showNotification('Diagram generated successfully!', 'success');
        }).catch(function (error) {
            // Handle errors
            downloadContainer.innerHTML = '';
            showNotification('Error generating diagram. Please try again.', 'error');
            console.error("Error generating PNG:", error);
        });
    }

    function updateTimestamp() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        timestampDisplay.textContent = now.toLocaleDateString(undefined, options);
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.fontFamily = 'Poppins, sans-serif';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '9999';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '10px';
        notification.style.maxWidth = '350px';
        notification.style.animation = 'slideIn 0.3s ease forwards';

        // Set styles based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                notification.style.color = 'white';
                notification.innerHTML = '<i class="fas fa-check-circle"></i> ' + message;
                break;
            case 'warning':
                notification.style.backgroundColor = '#FF9800';
                notification.style.color = 'white';
                notification.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + message;
                break;
            case 'error':
                notification.style.backgroundColor = '#F44336';
                notification.style.color = 'white';
                notification.innerHTML = '<i class="fas fa-times-circle"></i> ' + message;
                break;
            default:
                notification.style.backgroundColor = '#2196F3';
                notification.style.color = 'white';
                notification.innerHTML = '<i class="fas fa-info-circle"></i> ' + message;
        }

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Add to document
        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 4000);
    }

    // Add initial Why input if problem is entered
    problemInput.addEventListener('blur', function () {
        if (problemInput.value.trim() && whyCount === 0) {
            addWhy();
        }
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + Shift + A to add Why
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            addWhy();
        }

        // Ctrl/Cmd + Shift + E to export
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            exportAsPng();
        }

        // Ctrl/Cmd + Shift + R to reset
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            resetForm();
        }
    });

    // Add jQuery support for older browsers if needed
    if (typeof jQuery !== 'undefined') {
        $(function () {
            // Store cursor positions
            var lastFocusedId = '';
            var cursorPositions = {};

            // Fix cursor position issues in all textareas
            function setupTextareas() {
                $('textarea').each(function () {
                    $(this).off('input.cursorFix').on('input.cursorFix', function () {
                        var id = $(this).attr('id');
                        var pos = this.selectionStart;
                        cursorPositions[id] = pos;
                        lastFocusedId = id;
                    });

                    $(this).off('focus.cursorFix').on('focus.cursorFix', function () {
                        lastFocusedId = $(this).attr('id');
                    });
                });
            }

            // Run initially
            setupTextareas();

            // Observe DOM changes to apply to new elements
            var observer = new MutationObserver(function (mutations) {
                setupTextareas();
            });

            observer.observe(document.getElementById('whys-container'), {
                childList: true,
                subtree: true
            });
        });
    }
});
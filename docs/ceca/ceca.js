document.addEventListener("DOMContentLoaded", function () {
    /**
     * Disadvantage Class - Core data structure for CECA
     */
    class Disadvantage {
        constructor(text = '', operator = null, causes = []) {
            this.text = text;           // Disadvantage text description
            this.operator = operator;   // 'AND', 'OR', or null for relationships between causes
            this.causes = causes;       // Array of child Disadvantage objects
            this.id = generateUniqueId(); // Unique identifier for this disadvantage
        }
        
        // Add a new cause to this disadvantage
        addCause() {
            const newCause = new Disadvantage();
            this.causes.push(newCause);
            
            // Default to AND operator when we have multiple causes
            if (this.causes.length === 2) {
                this.operator = 'AND';
            }
            
            return newCause;
        }
        
        // Get all Key Disadvantages in this chain
        getKeyDisadvantages() {
            if (this.causes.length === 0 && this.text.trim()) {
                return [{ text: this.text, id: this.id }];
            }
            return this.causes.flatMap(cause => cause.getKeyDisadvantages());
        }
    }

    // Helper function to generate unique IDs
    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Initialize root disadvantage
    let rootDisadvantage = new Disadvantage('Initial Disadvantage');

    // Keep track of currently active/selected disadvantage
    let activeDisadvantage = rootDisadvantage;
    let activeContainer = null;

    // DOM Elements
    const analysisDiv = document.getElementById('root-disadvantage');
    const exportPngBtn = document.getElementById('export-png');
    const resetBtn = document.getElementById('reset');
    const diagramBox = document.getElementById('diagram-box');
    const keyList = document.getElementById('key-list');
    const downloadContainer = document.getElementById('download-container');
    const timestampDisplay = document.getElementById('timestamp-display');

    // Initial Render
    renderDisadvantage(rootDisadvantage, analysisDiv);
    updateKeyDisadvantages();
    updateDiagram();
    updateTimestamp();
    
    // Add event listeners to global action buttons
    document.getElementById('global-and-btn').addEventListener('click', () => {
        handleAndAction(activeDisadvantage, activeContainer);
    });
    
    document.getElementById('global-or-btn').addEventListener('click', () => {
        handleOrAction(activeDisadvantage, activeContainer);
    });
    
    document.getElementById('global-why-btn').addEventListener('click', () => {
        handleWhyAction(activeDisadvantage, activeContainer);
    });

    // Event Listeners for export and reset
    exportPngBtn.addEventListener('click', exportAsPng);
    resetBtn.addEventListener('click', resetForm);
    
    /**
     * Handle the AND button action
     */
    function handleAndAction(disadvantage, container) {
        if (!disadvantage || !container) {
            showNotification('Please select a disadvantage first', 'info');
            return;
        }
        
        // Get the current text
        const currentText = disadvantage.text;
        
        // Clear existing causes
        disadvantage.causes = [];
        
        // Create two new causes - first with current text, second empty
        const cause1 = disadvantage.addCause();
        cause1.text = currentText; // First cause gets the current text
        disadvantage.addCause();   // Second cause is empty
        
        // Set operator to AND
        disadvantage.operator = 'AND';
        
        // Render the split interface
        renderSplitView(disadvantage, container);
        updateDiagram();
        updateKeyDisadvantages();
    }
    
    /**
     * Handle the OR button action
     */
    function handleOrAction(disadvantage, container) {
        if (!disadvantage || !container) {
            showNotification('Please select a disadvantage first', 'info');
            return;
        }
        
        // Get the current text
        const currentText = disadvantage.text;
        
        // Clear existing causes
        disadvantage.causes = [];
        
        // Create two new causes - first with current text, second empty
        const cause1 = disadvantage.addCause();
        cause1.text = currentText; // First cause gets the current text
        disadvantage.addCause();   // Second cause is empty
        
        // Set operator to OR
        disadvantage.operator = 'OR';
        
        // Render the split interface
        renderSplitView(disadvantage, container);
        updateDiagram();
        updateKeyDisadvantages();
    }
    
    /**
     * Handle the WHY button action
     */
    function handleWhyAction(disadvantage, container) {
        if (!disadvantage || !container) {
            showNotification('Please select a disadvantage first', 'info');
            return;
        }
        
        if (disadvantage.causes.length === 0) {
            // Add a single new cause
            const newCause = new Disadvantage();
            disadvantage.causes.push(newCause);
            
            // Create cause container if it doesn't exist
            let causesContainer = container.querySelector('.causes-container');
            if (!causesContainer) {
                causesContainer = document.createElement('div');
                causesContainer.className = 'causes-container';
                
                const causesList = document.createElement('div');
                causesList.className = 'causes-list';
                causesList.id = `causes-${disadvantage.id}`;
                
                causesContainer.appendChild(causesList);
                container.appendChild(causesContainer);
            }
            
            // Create and append the cause element
            const causesList = container.querySelector('.causes-list');
            const causeElement = document.createElement('div');
            causeElement.className = 'cause-item';
            causeElement.setAttribute('data-id', newCause.id);
            causesList.appendChild(causeElement);
            
            // Render the new cause
            renderDisadvantage(newCause, causeElement);
            
            // Focus on the new cause's textarea
            setTimeout(() => {
                const textarea = causeElement.querySelector('textarea');
                if (textarea) {
                    textarea.focus();
                    setActiveDisadvantage(newCause, causeElement);
                }
            }, 0);
            
            updateDiagram();
            updateKeyDisadvantages();
        } else {
            showNotification('This disadvantage already has causes. Please use AND or OR to replace them.', 'info');
        }
    }

    /**
     * Set the active disadvantage for button operations
     */
    function setActiveDisadvantage(disadvantage, container) {
        // Remove 'active' class from all disadvantage elements
        document.querySelectorAll('.disadvantage-text').forEach(elem => {
            elem.classList.remove('active-disadvantage');
        });
        
        // Set the new active disadvantage
        activeDisadvantage = disadvantage;
        activeContainer = container;
        
        // Add 'active' class to the active textarea
        const textarea = container.querySelector('.disadvantage-text');
        if (textarea) {
            textarea.classList.add('active-disadvantage');
        }
    }

    /**
     * Render a disadvantage in the analysis section
     */
    function renderDisadvantage(disadvantage, container) {
        // Clear the container
        container.innerHTML = '';
        
        // Create the label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'disadvantage-label';
        labelDiv.innerHTML = `
            <i class="fas ${disadvantage === rootDisadvantage ? 'fa-exclamation-triangle' : 'fa-arrow-right'}"></i>
            ${disadvantage === rootDisadvantage ? 'Initial Disadvantage' : 'Cause'}
            ${disadvantage.causes.length === 0 ? 
                `<span class="key-badge" title="This is a Key Disadvantage (no further causes)">
                    <i class="fas fa-key"></i> Key
                </span>` : ''}
        `;
        container.appendChild(labelDiv);
        
        // Create textarea
        const textarea = document.createElement('textarea');
        textarea.className = 'disadvantage-text';
        textarea.placeholder = 'Enter disadvantage...';
        textarea.value = disadvantage.text;
        container.appendChild(textarea);
        
        // Add event listener to update text
        textarea.addEventListener('input', () => {
            disadvantage.text = textarea.value;
            updateKeyDisadvantages();
            updateDiagram();
        });
        
        // Add focus event to set as active disadvantage
        textarea.addEventListener('focus', () => {
            setActiveDisadvantage(disadvantage, container);
        });
        
        // Add click event to set as active disadvantage
        container.addEventListener('click', (e) => {
            // Only set active if clicking on the container itself or its direct children
            // (prevents capturing clicks on nested elements)
            if (e.target === container || e.target.parentNode === container) {
                setActiveDisadvantage(disadvantage, container);
            }
        });
        
        // If this disadvantage has causes, render them
        if (disadvantage.causes.length > 0) {
            if (disadvantage.causes.length > 1) {
                // For multiple causes, use split view
                renderSplitView(disadvantage, container);
            } else {
                // For single cause, use normal view
                const causesContainer = document.createElement('div');
                causesContainer.className = 'causes-container';
                
                const causesList = document.createElement('div');
                causesList.className = 'causes-list';
                causesList.id = `causes-${disadvantage.id}`;
                
                causesContainer.appendChild(causesList);
                container.appendChild(causesContainer);
                
                // Render the single cause
                const causeDiv = document.createElement('div');
                causeDiv.className = 'cause-item';
                causeDiv.setAttribute('data-id', disadvantage.causes[0].id);
                causesList.appendChild(causeDiv);
                
                renderDisadvantage(disadvantage.causes[0], causeDiv);
            }
        }
        
        // If this is the root disadvantage, make it active by default
        if (disadvantage === rootDisadvantage) {
            setActiveDisadvantage(disadvantage, container);
        }
    }
    
    /**
     * Render a split view with multiple causes in a row
     */
    function renderSplitView(disadvantage, container) {
        // Create container for split view
        const splitContainer = document.createElement('div');
        splitContainer.className = 'split-container';
        splitContainer.style.position = 'relative';
        splitContainer.style.marginTop = '25px';
        
        // Create the operator badge
        const operatorBadge = document.createElement('div');
        operatorBadge.className = `split-operator-badge ${disadvantage.operator === 'OR' ? 'or-badge' : 'and-badge'}`;
        operatorBadge.textContent = disadvantage.operator;
        splitContainer.appendChild(operatorBadge);
        
        // Create the row for causes
        const splitRow = document.createElement('div');
        splitRow.className = 'split-row';
        splitContainer.appendChild(splitRow);
        
        // Add the split causes to the row
        disadvantage.causes.forEach((cause, index) => {
            const causeContainer = document.createElement('div');
            causeContainer.className = 'split-cause-container';
            causeContainer.setAttribute('data-id', cause.id);
            splitRow.appendChild(causeContainer);
            
            renderDisadvantage(cause, causeContainer);
        });
        
        container.appendChild(splitContainer);
    }

    /**
     * Update the list of Key Disadvantages
     */
    function updateKeyDisadvantages() {
        keyList.innerHTML = '';
        const keys = rootDisadvantage.getKeyDisadvantages();
        
        if (keys.length === 0) {
            keyList.innerHTML = '<div class="empty-state">No Key Disadvantages identified yet. Add causes that have no further causes.</div>';
            return;
        }
        
        keys.forEach(key => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.setAttribute('data-id', key.id);
            li.innerHTML = `
                <i class="fas fa-key"></i>
                <span>${key.text}</span>
            `;
            keyList.appendChild(li);
        });
    }

    /**
     * Update the diagram visualization
     */
    function updateDiagram() {
        diagramBox.innerHTML = '';
        renderDiagramNode(rootDisadvantage, diagramBox, true);
    }

    /**
     * Render a node in the diagram with improved visuals
     */
/**
 * Render a node in the diagram with improved visuals and shorter horizontal lines
 */

// Modified exportAsPng function that ensures the full diagram is captured
function exportAsPng() {
    if (!rootDisadvantage.text.trim() && rootDisadvantage.causes.length === 0) {
        showNotification('Please enter an Initial Disadvantage before exporting', 'warning');
        return;
    }

    updateTimestamp();
    downloadContainer.innerHTML = `
        <div class="loading-indicator">
            <div class="spinner"></div>
            <span>Generating diagram image...</span>
        </div>
    `;

    const captureArea = document.getElementById('capture-area');
    
    // Temporarily modify the capture area to ensure everything is visible
    const originalStyle = captureArea.style.cssText;
    captureArea.style.width = "100%";
    captureArea.style.overflow = "visible";
    captureArea.style.padding = "30px 20px";
    
    // Use html2canvas with better settings for full capture
    html2canvas(captureArea, { 
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: captureArea.scrollWidth + 40, // Add padding
        height: captureArea.scrollHeight + 40,
        x: -20, // Negative margin to capture everything
        y: -20
    }).then(canvas => {
        const dataURL = canvas.toDataURL('image/png');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = `ceca_analysis_${timestamp}.png`;
        downloadLink.className = 'download-btn';
        downloadLink.innerHTML = '<i class="fas fa-download"></i> Download Diagram PNG';
        downloadContainer.innerHTML = '';
        downloadContainer.appendChild(downloadLink);
        
        // Restore original style
        captureArea.style.cssText = originalStyle;
        
        showNotification('Diagram generated successfully!', 'success');
    }).catch(error => {
        downloadContainer.innerHTML = '';
        showNotification('Error generating diagram: ' + error.message, 'error');
        console.error(error);
        
        // Restore original style
        captureArea.style.cssText = originalStyle;
    });
}

// Updated renderDiagramNode function
function renderDiagramNode(disadvantage, parentElement, isRoot = false) {
    const isKey = disadvantage.causes.length === 0 && disadvantage.text.trim();
    
    // Create main container for this node
    const nodeContainer = document.createElement('div');
    nodeContainer.className = 'node-container';
    nodeContainer.setAttribute('data-id', disadvantage.id);
    
    // Create the box for the disadvantage
    const box = document.createElement('div');
    box.className = 'cause-box';
    if (isRoot) box.classList.add('initial-box');
    if (isKey) box.classList.add('key-box');
    
    // Add icon and text to the box
    const iconType = isRoot ? 'exclamation-triangle' : 
                    isKey ? 'key' : 'arrow-right';
                    
    const iconColor = isRoot ? 'var(--primary)' : 
                      isKey ? 'var(--accent)' : 'var(--secondary)';
                      
    box.innerHTML = `
        <i class="fas fa-${iconType}" style="margin-right: 8px; color: ${iconColor};"></i>
        <span>${disadvantage.text || 'Disadvantage'}</span>
    `;
    
    nodeContainer.appendChild(box);
    parentElement.appendChild(nodeContainer);

    // If there are causes, create connections and render them
    if (disadvantage.causes.length > 0) {
        // Container for all connections
        const connectionsContainer = document.createElement('div');
        connectionsContainer.className = 'connections-container';
        
        // Vertical line connecting down from this disadvantage
        const mainConnector = document.createElement('div');
        mainConnector.className = 'main-connector';
        
        // Arrow pointing down
        const arrow = document.createElement('div');
        arrow.className = 'connector-arrow';
        mainConnector.appendChild(arrow);
        
        connectionsContainer.appendChild(mainConnector);
        
        // If multiple causes, add AND/OR operator in the middle of connections
        if (disadvantage.causes.length > 1) {
            const operatorBadge = document.createElement('div');
            
            // Make OR red and AND blue for clear differentiation
            const isOr = disadvantage.operator === 'OR';
            operatorBadge.className = `operator-badge ${isOr ? 'or-badge' : 'and-badge'}`;
            operatorBadge.innerHTML = `${disadvantage.operator || 'AND'}`;
            
            mainConnector.appendChild(operatorBadge);
            
            // Horizontal connector for multiple causes - with controlled width
            const horizontalConnector = document.createElement('div');
            horizontalConnector.className = 'horizontal-connector';
            
            // Calculate reasonable width based on number of causes
            const causeCount = disadvantage.causes.length;
            // Set a reasonable width cap to prevent overflow
            horizontalConnector.style.width = `${Math.min(causeCount * 150, 95)}%`;
            
            connectionsContainer.appendChild(horizontalConnector);
            
            // Create container for causes in a row
            const causesRow = document.createElement('div');
            causesRow.className = 'causes-row';
            
            // Render each cause with vertical connectors
            disadvantage.causes.forEach((cause, index) => {
                const causeContainer = document.createElement('div');
                causeContainer.className = 'cause-container';
                
                // Small vertical line connecting to horizontal line
                const verticalConnector = document.createElement('div');
                verticalConnector.className = 'vertical-connector';
                causeContainer.appendChild(verticalConnector);
                
                // Render this cause
                renderDiagramNode(cause, causeContainer);
                causesRow.appendChild(causeContainer);
            });
            
            connectionsContainer.appendChild(causesRow);
        } else {
            // For a single cause, just render it directly underneath
            const singleCauseContainer = document.createElement('div');
            singleCauseContainer.className = 'single-cause';
            
            disadvantage.causes.forEach(cause => {
                renderDiagramNode(cause, singleCauseContainer);
            });
            
            connectionsContainer.appendChild(singleCauseContainer);
        }
        
        nodeContainer.appendChild(connectionsContainer);
    }
}

    /**
     * Reset the entire analysis
     */
    function resetForm() {
        if (confirm('Reset the analysis? All data will be cleared.')) {
            rootDisadvantage = new Disadvantage('Initial Disadvantage');
            renderDisadvantage(rootDisadvantage, analysisDiv);
            updateKeyDisadvantages();
            updateDiagram();
            updateTimestamp();
            showNotification('Analysis has been reset', 'info');
        }
    }

    /**
     * Update the timestamp display
     */
    function updateTimestamp() {
        timestampDisplay.textContent = new Date().toLocaleString();
    }

    /**
     * Show a notification to the user
     */
    function showNotification(message, type) {
        const notificationType = type || 'info';
        const bgColors = {
            'success': '#4CAF50',
            'warning': '#FF9800',
            'error': '#F44336',
            'info': '#2196F3'
        };
        
        const icons = {
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle',
            'info': 'info-circle'
        };
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'ceca-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 350px;
            animation: slideIn 0.3s ease forwards;
            background-color: ${bgColors[notificationType]};
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${icons[notificationType]}"></i>
            <div class="notification-content">${message}</div>
            <button class="close-notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-dismiss after delay
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'fadeOut 0.5s ease forwards';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 5000);

        // Add animation styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes fadeOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(20px); } }
                .close-notification { background: none; border: none; color: white; opacity: 0.7; cursor: pointer; padding: 5px; }
                .close-notification:hover { opacity: 1; }
                .notification-content { flex: 1; }
                .ceca-notification { transition: transform 0.3s ease, opacity 0.3s ease; }
            `;
            document.head.appendChild(style);
        }
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const canvas = document.getElementById('canvas');
    const addRectangleBtn = document.getElementById('add-rectangle');
    const addRoundedRectangleBtn = document.getElementById('add-rounded-rectangle');
    const addHexagonBtn = document.getElementById('add-hexagon');
    const addCircleBtn = document.getElementById('add-circle');
    const lineColorSelect = document.getElementById('line-color');
    const lineStyleSelect = document.getElementById('line-style');
    const arrowStyleSelect = document.getElementById('arrow-style');
    const shapeTextInput = document.getElementById('shape-text-input');
    const updateShapeTextBtn = document.getElementById('update-shape-text');
    const clearCanvasBtn = document.getElementById('clear-canvas');
    const downloadPngBtn = document.getElementById('download-png');
    const deleteSelectedBtn = document.getElementById('delete-selected');

    // State variables
    let shapes = [];
    let connectors = [];
    let currentConnector = null;
    let sourceShape = null;
    let selectedShape = null;
    let selectedConnector = null;
    let draggedShape = null;
    let dragOffset = { x: 0, y: 0 };
    let shapeIdCounter = 0;
    let connectorIdCounter = 0;
    let isDragging = false;

    // Event listeners for toolbar buttons
    addRectangleBtn.addEventListener('click', () => addShape('rectangle'));
    addRoundedRectangleBtn.addEventListener('click', () => addShape('rounded-rectangle'));
    addHexagonBtn.addEventListener('click', () => addShape('hexagon'));
    addCircleBtn.addEventListener('click', () => addShape('circle'));

    updateShapeTextBtn.addEventListener('click', updateShapeText);
    clearCanvasBtn.addEventListener('click', clearCanvas);
    downloadPngBtn.addEventListener('click', downloadCanvasAsPNG);
    deleteSelectedBtn.addEventListener('click', deleteSelected);

    // Canvas event listeners
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('click', handleCanvasClick);

    // Document-level event listeners for smooth dragging even outside canvas
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);

    // Keyboard shortcuts removed as requested

    function addShape(type) {
        const shapeId = `shape-${shapeIdCounter++}`;
        const shape = document.createElement('div');
        shape.className = `shape ${type}`;
        shape.id = shapeId;
        shape.dataset.type = type;

        // Position near the center of the visible canvas area
        const canvasContainer = canvas.parentElement;
        const viewportWidth = canvasContainer.clientWidth;
        const viewportHeight = canvasContainer.clientHeight;
        const scrollLeft = canvasContainer.scrollLeft;
        const scrollTop = canvasContainer.scrollTop;

        // Calculate center of the viewport
        const viewportCenterX = scrollLeft + (viewportWidth / 2);
        const viewportCenterY = scrollTop + (viewportHeight / 2);

        // Add some random variation (±100px) to avoid stacking
        const variationX = (Math.random() - 0.5) * 200;
        const variationY = (Math.random() - 0.5) * 200;

        // Set position
        const left = viewportCenterX - 60 + variationX; // 60 = half of typical shape width
        const top = viewportCenterY - 45 + variationY;  // 45 = half of typical shape height

        shape.style.left = `${left}px`;
        shape.style.top = `${top}px`;

        // Adjust dimensions based on shape type
        if (type === 'hexagon') {
            shape.style.width = '156px';  // 50% wider than previous 104px
            shape.style.height = '120px';

            // Create main hexagon container
            const hexContainer = document.createElement('div');
            hexContainer.className = 'hex-container';
            hexContainer.style.width = '100%';
            hexContainer.style.height = '100%';
            hexContainer.style.position = 'absolute';

            // Create outer hexagon (border)
            const outerHex = document.createElement('div');
            outerHex.className = 'hex-outer';
            outerHex.style.width = '100%';
            outerHex.style.height = '100%';
            outerHex.style.position = 'absolute';
            outerHex.style.backgroundColor = '#333'; // Border color
            outerHex.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

            // Create inner hexagon (fill)
            const innerHex = document.createElement('div');
            innerHex.className = 'hex-inner';
            innerHex.style.position = 'absolute';
            innerHex.style.top = '2px';
            innerHex.style.left = '2px';
            innerHex.style.right = '2px';
            innerHex.style.bottom = '2px';
            innerHex.style.backgroundColor = 'white'; // Fill color
            innerHex.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

            hexContainer.appendChild(outerHex);
            hexContainer.appendChild(innerHex);
            shape.appendChild(hexContainer);
        } else if (type === 'circle') {
            shape.style.width = '120px';
            shape.style.height = '120px';
        } else {
            shape.style.width = '120px';
            shape.style.height = '90px';
        }

        // Add editable text inside the shape
        const textArea = document.createElement('div');
        textArea.className = 'shape-text';
        textArea.contentEditable = 'true';
        textArea.textContent = formatShapeName(type);
        shape.appendChild(textArea);

        canvas.appendChild(shape);
        shapes.push({
            id: shapeId,
            element: shape
        });

        // Select the newly added shape
        selectShape(shape);
    }

    // Helper function to format shape name
    function formatShapeName(type) {
        switch (type) {
            case 'rectangle':
                return 'System';
            case 'rounded-rectangle':
                return 'Target';
            case 'hexagon':
                return 'Super';
            case 'circle':
                return 'Circle';
            default:
                return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
        }
    }

    // Handle canvas click for deselecting shapes or selecting connectors
    function handleCanvasClick(e) {
        if (e.target === canvas) {
            // Deselect shapes
            if (selectedShape) {
                selectedShape.classList.remove('selected');
                selectedShape = null;
                shapeTextInput.value = '';
            }

            // Deselect connectors
            if (selectedConnector) {
                const pathElement = selectedConnector.path;
                pathElement.classList.remove('selected');
                selectedConnector = null;
            }
        }

        // Check if a connector path was clicked
        if (e.target.tagName === 'path' && e.target.classList.contains('connector-path')) {
            const connectorId = e.target.closest('.connector').id;
            const connector = connectors.find(c => c.id === connectorId);
            if (connector) {
                selectConnector(connector);
            }
        }
    }

    // Function to select a connector
    function selectConnector(connector) {
        // Deselect previously selected connector
        if (selectedConnector && selectedConnector !== connector) {
            selectedConnector.path.classList.remove('selected-connector-line');
            selectedConnector.path.classList.remove('selected');
        }

        // Select the new connector
        selectedConnector = connector;
        connector.path.classList.add('selected');
        connector.path.classList.add('selected-connector-line');

        // Update the text input field with the connector's text
        if (connector.text) {
            shapeTextInput.value = connector.text.textContent || '';
        } else {
            shapeTextInput.value = '';
        }

        // Deselect any selected shape
        if (selectedShape) {
            selectedShape.classList.remove('selected');
            selectedShape = null;
        }
    }

    // Function to handle keyboard events removed as requested

    // Function to delete the selected element (shape or connector)
    function deleteSelected() {
        if (selectedShape) {
            deleteShape(selectedShape);
        } else if (selectedConnector) {
            deleteConnector(selectedConnector);
        }
    }

    // Function to delete a shape and its connected connectors
    function deleteShape(shape) {
        // Find the shape in the shapes array
        const shapeIndex = shapes.findIndex(s => s.id === shape.id);
        if (shapeIndex !== -1) {
            // Remove the shape from the array
            shapes.splice(shapeIndex, 1);

            // Remove all connectors connected to this shape
            const shapesToRemove = [];
            for (let i = connectors.length - 1; i >= 0; i--) {
                const conn = connectors[i];
                if (conn.source === shape.id || conn.target === shape.id) {
                    // Remove the connector element and text from the DOM
                    conn.element.remove();
                    if (conn.text) {
                        conn.text.remove();
                    }
                    // Remove from connectors array
                    connectors.splice(i, 1);
                }
            }

            // Remove the shape element from the DOM
            shape.remove();

            // Clear selection
            selectedShape = null;
            shapeTextInput.value = '';
        }
    }

    // Function to delete a connector
    function deleteConnector(connector) {
        // Find the connector in the connectors array
        const connIndex = connectors.findIndex(c => c.id === connector.id);
        if (connIndex !== -1) {
            // Remove the connector from the array
            connectors.splice(connIndex, 1);

            // Remove the connector element and text from the DOM
            connector.element.remove();
            if (connector.text) {
                connector.text.remove();
            }

            // Clear selection
            selectedConnector = null;
            shapeTextInput.value = '';
        }
    }

    // Handle mouse down on the canvas
    function handleCanvasMouseDown(e) {
        // Prevent default to avoid text selection
        e.preventDefault();

        // Check if the click is on a shape
        let shapeElement = null;
        if (e.target.classList.contains('shape')) {
            shapeElement = e.target;
        } else if (e.target.closest('.shape')) {
            shapeElement = e.target.closest('.shape');
        }

        // If it's a shape
        if (shapeElement) {
            // Determine if we're starting a connector or dragging
            if (e.altKey) {
                // Alt key is held - draw connector
                sourceShape = shapeElement;
                startDrawingConnector(sourceShape, e);
            } else {
                // Otherwise, drag the shape
                draggedShape = shapeElement;

                // Get the canvas container's scroll position
                const canvasContainer = canvas.parentElement;
                const canvasRect = canvas.getBoundingClientRect();

                // Calculate the click position relative to the shape
                const shapeRect = shapeElement.getBoundingClientRect();
                dragOffset = {
                    x: e.clientX - shapeRect.left,
                    y: e.clientY - shapeRect.top
                };

                // Store initial shape position for more stable dragging
                draggedShape._initialX = parseInt(shapeElement.style.left) || 0;
                draggedShape._initialY = parseInt(shapeElement.style.top) || 0;
                draggedShape._initialClientX = e.clientX;
                draggedShape._initialClientY = e.clientY;

                // Add a 'dragging' class to the shape
                draggedShape.classList.add('dragging');
                isDragging = true;

                // Select the shape for editing
                selectShape(shapeElement);
            }
        }
    }

    // Handle mouse move on the canvas
    function handleCanvasMouseMove(e) {
        if (currentConnector) {
            // Update the end point of the connector being drawn
            const canvasRect = canvas.getBoundingClientRect();
            const endX = e.clientX - canvasRect.left;
            const endY = e.clientY - canvasRect.top;

            // Update the SVG path of the connector
            updateConnectorPath(currentConnector, null, { x: endX, y: endY });
        }
        // Shape dragging is now handled by the document-level mousemove
    }

    // Handle mouse move on the entire document for smoother dragging
    function handleDocumentMouseMove(e) {
        if (draggedShape) {
            // Get the canvas container
            const canvasContainer = canvas.parentElement;
            const canvasRect = canvas.getBoundingClientRect();

            // Calculate the delta movement from the initial mouse position
            const deltaX = e.clientX - draggedShape._initialClientX;
            const deltaY = e.clientY - draggedShape._initialClientY;

            // Apply the delta to the initial shape position
            const newX = draggedShape._initialX + deltaX;
            const newY = draggedShape._initialY + deltaY;

            // Apply position update
            draggedShape.style.left = `${newX}px`;
            draggedShape.style.top = `${newY}px`;

            // Update connectors less frequently for better performance
            if (!draggedShape._lastUpdate || Date.now() - draggedShape._lastUpdate > 30) {
                updateConnectorsForShape(draggedShape);
                draggedShape._lastUpdate = Date.now();
            }
        }
    }

    // On mouse up within the canvas
    function handleCanvasMouseUp(e) {
        // If we were drawing a connector
        if (currentConnector && sourceShape) {
            // Check if the mouse is over a different shape
            let targetShape = null;
            const elements = document.elementsFromPoint(e.clientX, e.clientY);

            for (const el of elements) {
                if (el.classList.contains('shape') && el !== sourceShape) {
                    targetShape = el;
                    break;
                }
            }

            // If we have a valid target shape, complete the connector
            if (targetShape) {
                completeConnector(sourceShape, targetShape);
            } else {
                // If there's no target shape, remove the temporary connector
                currentConnector.element.remove();
                currentConnector = null;
            }

            sourceShape = null;
        }
        // Shape dragging is now handled by the document-level mouseup
    }

    // Handle mouse up on the entire document for smoother dragging
    function handleDocumentMouseUp(e) {
        // If we were dragging a shape
        if (draggedShape) {
            draggedShape.classList.remove('dragging');

            // Clear the border point cache for fresh calculations
            delete draggedShape._borderCache;

            // Force a final connector update
            updateConnectorsForShape(draggedShape);

            // Small delay to prevent click event from triggering immediately
            setTimeout(() => {
                isDragging = false;
            }, 10);

            draggedShape = null;
        }
    }

    // Function to select a shape for editing
    function selectShape(shape) {
        // Deselect the previously selected shape
        if (selectedShape && selectedShape !== shape) {
            selectedShape.classList.remove('selected');
        }

        // Select the new shape
        selectedShape = shape;
        shape.classList.add('selected');

        // Update the text input with the shape's text
        const textElement = shape.querySelector('.shape-text');
        if (textElement) {
            shapeTextInput.value = textElement.textContent;
        }

        // Deselect any selected connector
        if (selectedConnector) {
            selectedConnector.path.classList.remove('selected');
            selectedConnector = null;
        }
    }

    // Function to update the text of the selected shape
    function updateShapeText() {
        if (selectedShape) {
            const textElement = selectedShape.querySelector('.shape-text');
            if (textElement) {
                textElement.textContent = shapeTextInput.value;
            }
        } else if (selectedConnector) {
            // If a connector is selected, update its text
            selectedConnector.text.textContent = shapeTextInput.value;
            if (shapeTextInput.value && shapeTextInput.value.trim() !== '') {
                selectedConnector.text.style.display = 'block';
            } else {
                selectedConnector.text.style.display = 'none';
            }
        }
    }

    // Function to start drawing a connector
    function startDrawingConnector(sourceShape, e) {
        const connectorId = `connector-${connectorIdCounter++}`;
        const connector = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        connector.setAttribute('class', 'connector');
        connector.setAttribute('id', connectorId);
        connector.style.position = 'absolute';
        connector.style.top = '0';
        connector.style.left = '0';
        connector.style.width = '100%';
        connector.style.height = '100%';
        connector.style.pointerEvents = 'none';
        connector.style.zIndex = '0';

        // Create the hit area path (for selection)
        const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hitPath.setAttribute('class', 'connector-path');
        hitPath.style.pointerEvents = 'stroke';

        // Create the visible path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke', lineColorSelect.value);
        path.setAttribute('fill', 'none');
        path.classList.add(`${lineStyleSelect.value}-line`);
        path.style.pointerEvents = 'none';

        // Add arrowhead markers if needed
        if (arrowStyleSelect.value !== 'none') {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

            if (arrowStyleSelect.value === 'end' || arrowStyleSelect.value === 'both') {
                const endMarker = createArrowMarker(`arrowhead-end-${connectorId}`, lineColorSelect.value);
                defs.appendChild(endMarker);
                path.setAttribute('marker-end', `url(#arrowhead-end-${connectorId})`);
            }

            if (arrowStyleSelect.value === 'both') {
                const startMarker = createArrowMarker(`arrowhead-start-${connectorId}`, lineColorSelect.value);
                startMarker.setAttribute('orient', 'auto-start-reverse');
                defs.appendChild(startMarker);
                path.setAttribute('marker-start', `url(#arrowhead-start-${connectorId})`);
            }

            connector.appendChild(defs);
        }

        // Add paths to connector - visible path must be added AFTER hit path
        connector.appendChild(hitPath);
        connector.appendChild(path);
        canvas.appendChild(connector);

        // Create and add the connector's text element
        const textElement = document.createElement('div');
        textElement.className = 'connector-text';
        textElement.contentEditable = 'true';
        textElement.dataset.connectorId = connectorId;
        textElement.textContent = '';
        textElement.style.display = 'none';
        canvas.appendChild(textElement);

        // Create connector object
        currentConnector = {
            id: connectorId,
            element: connector,
            path: path,
            hitPath: hitPath,
            text: textElement,
            source: sourceShape.id,
            target: null,
            style: lineStyleSelect.value,
            color: lineColorSelect.value,
            arrowStyle: arrowStyleSelect.value
        };

        // Add click handler for the hit path
        hitPath.addEventListener('click', (e) => {
            e.stopPropagation();
            const connectorObj = connectors.find(c => c.id === connectorId);
            if (connectorObj) {
                selectConnector(connectorObj);
            }
        });

        // Get initial position from source shape
        const sourceRect = sourceShape.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const sourcePos = {
            x: sourceRect.left + sourceRect.width / 2 - canvasRect.left,
            y: sourceRect.top + sourceRect.height / 2 - canvasRect.top
        };

        // Get initial position for end of connector (mouse position)
        const endPos = {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top
        };

        // Update connector path
        updateConnectorPath(currentConnector, sourcePos, endPos);
    }

    // Function to create an arrow marker
    function createArrowMarker(id, color) {
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', id);
        marker.setAttribute('markerWidth', '12');  // Increased from 10
        marker.setAttribute('markerHeight', '8');  // Increased from 7
        marker.setAttribute('refX', '11');         // Increased from 9
        marker.setAttribute('refY', '4');          // Increased from 3.5
        marker.setAttribute('orient', 'auto');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 12 4, 0 8');  // Increased size
        polygon.setAttribute('fill', color);

        marker.appendChild(polygon);
        return marker;
    }

    // Function to complete a connector
    function completeConnector(sourceShape, targetShape) {
        // Update the connector with the target shape
        currentConnector.target = targetShape.id;

        // Position the text element at the middle of the connector
        const sourceRect = sourceShape.getBoundingClientRect();
        const targetRect = targetShape.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const midX = (sourceRect.left + sourceRect.width / 2 + targetRect.left + targetRect.width / 2) / 2 - canvasRect.left;
        const midY = (sourceRect.top + sourceRect.height / 2 + targetRect.top + targetRect.height / 2) / 2 - canvasRect.top;

        // Set position for the text element (initially hidden)
        currentConnector.text.style.left = `${midX}px`;
        currentConnector.text.style.top = `${midY}px`;

        // Add the completed connector to the connectors array
        connectors.push(currentConnector);

        // Reset the current connector
        currentConnector = null;
    }

 // Function to update the path of a connector
function updateConnectorPath(connector, sourcePos, targetPos) {
    let actualSourcePos = sourcePos;
    let actualTargetPos = targetPos;

    // If we have a source shape, calculate the position at its border
    if (!sourcePos && connector.source) {
        const sourceElement = document.getElementById(connector.source);
        if (sourceElement) {
            const targetElement = document.getElementById(connector.target);
            const targetCenter = targetElement ? getShapeCenter(targetElement) : targetPos;
            actualSourcePos = calculateShapeBorderPoint(sourceElement, targetCenter);
        }
    }

    // If we have a target shape, calculate the position at its border
    if (!targetPos && connector.target) {
        const targetElement = document.getElementById(connector.target);
        if (targetElement) {
            const sourceElement = document.getElementById(connector.source);
            const sourceCenter = sourceElement ? getShapeCenter(sourceElement) : sourcePos;
            actualTargetPos = calculateShapeBorderPoint(targetElement, sourceCenter);
        }
    }

    // Ensure we have both positions
    if (!actualSourcePos || !actualTargetPos) return;

    // Create a straight line path instead of a bezier curve
    const path = `M ${actualSourcePos.x} ${actualSourcePos.y} L ${actualTargetPos.x} ${actualTargetPos.y}`;

    connector.path.setAttribute('d', path);
    connector.hitPath.setAttribute('d', path);

    // Update the line style
    connector.path.setAttribute('class', `${connector.style}-line`);

    // Update the line color
    connector.path.setAttribute('stroke', connector.color);

    // Update the text position to the middle of the line
    if (connector.text) {
        const midX = (actualSourcePos.x + actualTargetPos.x) / 2;
        const midY = (actualSourcePos.y + actualTargetPos.y) / 2;

        connector.text.style.left = `${midX}px`;
        connector.text.style.top = `${midY}px`;

        // Show the text element if it has content, hide it otherwise
        if (connector.text.textContent && connector.text.textContent.trim() !== '') {
            connector.text.style.display = 'block';
        } else {
            connector.text.style.display = 'none';
        }
    }
}
    // Function to get the center point of a shape
    function getShapeCenter(shapeElement) {
        const rect = shapeElement.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        return {
            x: rect.left + rect.width / 2 - canvasRect.left,
            y: rect.top + rect.height / 2 - canvasRect.top
        };
    }

    // Function to update all connectors connected to a shape
    function updateConnectorsForShape(shape) {
        // Performance optimization: Batch updates
        window.requestAnimationFrame(() => {
            connectors.forEach(connector => {
                if (connector.source === shape.id || connector.target === shape.id) {
                    updateConnectorPath(connector);
                }
            });
        });
    }

    // Helper function to find the intersection point of two line segments
    function findLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        // Calculate the denominator
        const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        // If denominator is 0, lines are parallel
        if (denominator === 0) {
            return null;
        }

        // Calculate ua and ub
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

        // Return the intersection point if it's on both line segments
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            return {
                x: x1 + ua * (x2 - x1),
                y: y1 + ua * (y2 - y1)
            };
        }

        return null;
    }

    // Function to calculate the point on the border of a shape
    function calculateShapeBorderPoint(shapeElement, targetPos) {
        // Cache calculations for better performance
        if (shapeElement._borderCache &&
            shapeElement._borderCache.targetX === targetPos?.x &&
            shapeElement._borderCache.targetY === targetPos?.y) {
            return shapeElement._borderCache.result;
        }

        const rect = shapeElement.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const center = {
            x: rect.left + rect.width / 2 - canvasRect.left,
            y: rect.top + rect.height / 2 - canvasRect.top
        };

        if (!targetPos) return center;

        // Calculate the angle from the center to the target
        const angle = Math.atan2(targetPos.y - center.y, targetPos.x - center.x);

        let borderPoint = { x: 0, y: 0 };
        const shapeType = shapeElement.dataset.type;

        if (shapeType === 'circle') {
            // For circle, the intersection is along the radius
            const radius = rect.width / 2;
            borderPoint.x = center.x + radius * Math.cos(angle);
            borderPoint.y = center.y + radius * Math.sin(angle);
        } else if (shapeType === 'hexagon') {
            // Calculate hexagon border point for rotated hexagon
            const width = rect.width;
            const height = rect.height;

            // Define the six corners of the rotated hexagon
            const corners = [
                { x: center.x - width / 4, y: center.y - height / 2 },    // Top-left
                { x: center.x + width / 4, y: center.y - height / 2 },    // Top-right
                { x: center.x + width / 2, y: center.y },               // Right
                { x: center.x + width / 4, y: center.y + height / 2 },    // Bottom-right
                { x: center.x - width / 4, y: center.y + height / 2 },    // Bottom-left
                { x: center.x - width / 2, y: center.y }                // Left
            ];

            // Find which edge the line intersects
            let minDistance = Infinity;

            for (let i = 0; i < corners.length; i++) {
                const j = (i + 1) % corners.length;
                const edgeStart = corners[i];
                const edgeEnd = corners[j];

                const intersection = findLineIntersection(
                    center.x, center.y, targetPos.x, targetPos.y,
                    edgeStart.x, edgeStart.y, edgeEnd.x, edgeEnd.y
                );

                if (intersection) {
                    const dist = Math.sqrt(
                        Math.pow(intersection.x - center.x, 2) +
                        Math.pow(intersection.y - center.y, 2)
                    );

                    if (dist < minDistance) {
                        minDistance = dist;
                        borderPoint = intersection;
                    }
                }
            }

            // If no intersection found, fallback to simple calculation
            if (minDistance === Infinity) {
                const radius = Math.min(rect.width, rect.height) / 2;
                borderPoint.x = center.x + radius * Math.cos(angle);
                borderPoint.y = center.y + radius * Math.sin(angle);
            }
        } else {
            // For rectangles and rounded rectangles
            const halfWidth = rect.width / 2;
            const halfHeight = rect.height / 2;
            const tanTheta = Math.tan(angle);

            // Determine which edge of the rectangle the line intersects
            if (Math.abs(angle) < Math.PI / 2) { // Right edge
                if (Math.abs(tanTheta) < halfHeight / halfWidth) {
                    borderPoint.x = center.x + halfWidth;
                    borderPoint.y = center.y + halfWidth * tanTheta;
                } else { // Top or bottom edge
                    borderPoint.x = center.x + halfHeight / Math.abs(tanTheta) * Math.sign(Math.cos(angle));
                    borderPoint.y = center.y + halfHeight * Math.sign(Math.sin(angle));
                }
            } else { // Left edge
                if (Math.abs(tanTheta) < halfHeight / halfWidth) {
                    borderPoint.x = center.x - halfWidth;
                    borderPoint.y = center.y - halfWidth * tanTheta;
                } else { // Top or bottom edge
                    borderPoint.x = center.x - halfHeight / Math.abs(tanTheta) * Math.sign(-Math.cos(angle));
                    borderPoint.y = center.y + halfHeight * Math.sign(Math.sin(angle));
                }
            }
        }

        // Cache the result for performance
        shapeElement._borderCache = {
            targetX: targetPos.x,
            targetY: targetPos.y,
            result: borderPoint
        };

        return borderPoint;
    }

    // Function to clear the canvas
    function clearCanvas() {
        // Clear all shapes and connectors
        canvas.innerHTML = '';
        shapes = [];
        connectors = [];

        // Reset state variables
        sourceShape = null;
        selectedShape = null;
        selectedConnector = null;
        currentConnector = null;
        draggedShape = null;
        shapeIdCounter = 0;
        connectorIdCounter = 0;

        // Clear input fields
        shapeTextInput.value = '';
    }

    // Function to download the canvas as a PNG
    function downloadCanvasAsPNG() {
        // Calculate the bounds of all shapes and connectors
        const bounds = calculateDiagramBounds();

        // Create a canvas element with calculated dimensions
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = bounds.maxX - bounds.minX;
        exportCanvas.height = bounds.maxY - bounds.minY;
        const ctx = exportCanvas.getContext('2d');

        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        // Draw the grid pattern
        drawGridPattern(ctx, exportCanvas.width, exportCanvas.height);

        // Get canvas bounds for reference
        const canvasBounds = canvas.getBoundingClientRect();

        // Draw all connectors first so they appear behind shapes
        for (let i = 0; i < connectors.length; i++) {
            const connector = connectors[i];
            if (connector) {
                drawConnectorOnCanvas(ctx, connector, canvasBounds, bounds.minX, bounds.minY);
            }
        }

        // Then draw all shapes
        const shapeElements = canvas.querySelectorAll('.shape');
        shapeElements.forEach(shape => {
            drawShapeOnCanvas(ctx, shape, canvasBounds, bounds.minX, bounds.minY);
        });

        // Convert to image and trigger download
        const dataURL = exportCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'diagram.png';
        link.href = dataURL;
        link.click();
    }

    // Function to calculate the bounds of all shapes and connectors
    function calculateDiagramBounds() {
        const bounds = {
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity
        };

        const canvasBounds = canvas.getBoundingClientRect();

        // Check all shapes
        const shapeElements = canvas.querySelectorAll('.shape');
        shapeElements.forEach(shape => {
            const rect = shape.getBoundingClientRect();
            const left = rect.left - canvasBounds.left;
            const top = rect.top - canvasBounds.top;
            const right = left + rect.width;
            const bottom = top + rect.height;

            bounds.minX = Math.min(bounds.minX, left);
            bounds.minY = Math.min(bounds.minY, top);
            bounds.maxX = Math.max(bounds.maxX, right);
            bounds.maxY = Math.max(bounds.maxY, bottom);

            // Add text content to bounds calculation
            const textElement = shape.querySelector('.shape-text');
            if (textElement && textElement.textContent) {
                const textRect = textElement.getBoundingClientRect();
                // Add a bit of padding for text that might extend beyond shape
                bounds.minX = Math.min(bounds.minX, left - 5);
                bounds.minY = Math.min(bounds.minY, top - 5);
                bounds.maxX = Math.max(bounds.maxX, right + 5);
                bounds.maxY = Math.max(bounds.maxY, bottom + 5);
            }
        });

        // Check all connectors
        for (const connector of connectors) {
            if (!connector.source || !connector.target) continue;

            const sourceElement = document.getElementById(connector.source);
            const targetElement = document.getElementById(connector.target);

            if (!sourceElement || !targetElement) continue;

            const sourceCenter = getShapeCenter(sourceElement);
            const targetCenter = getShapeCenter(targetElement);

            // Check connector start and end points
            bounds.minX = Math.min(bounds.minX, sourceCenter.x, targetCenter.x);
            bounds.minY = Math.min(bounds.minY, sourceCenter.y, targetCenter.y);
            bounds.maxX = Math.max(bounds.maxX, sourceCenter.x, targetCenter.x);
            bounds.maxY = Math.max(bounds.maxY, sourceCenter.y, targetCenter.y);

            // Check the entire path of the connector
            const sourcePoint = calculateShapeBorderPoint(sourceElement, targetCenter);
            const targetPoint = calculateShapeBorderPoint(targetElement, sourceCenter);

            // Calculate control points for the bezier curve
            const dx = targetPoint.x - sourcePoint.x;
            const dy = targetPoint.y - sourcePoint.y;
            const cp1 = {
                x: sourcePoint.x + dx / 3,
                y: sourcePoint.y + dy / 3
            };
            const cp2 = {
                x: sourcePoint.x + 2 * dx / 3,
                y: sourcePoint.y + 2 * dy / 3
            };

            // Add control points to bounds
            bounds.minX = Math.min(bounds.minX, sourcePoint.x, targetPoint.x, cp1.x, cp2.x);
            bounds.minY = Math.min(bounds.minY, sourcePoint.y, targetPoint.y, cp1.y, cp2.y);
            bounds.maxX = Math.max(bounds.maxX, sourcePoint.x, targetPoint.x, cp1.x, cp2.x);
            bounds.maxY = Math.max(bounds.maxY, sourcePoint.y, targetPoint.y, cp1.y, cp2.y);

            // If text exists, check its bounds
            if (connector.text && connector.text.style.display !== 'none') {
                const textRect = connector.text.getBoundingClientRect();
                const textLeft = textRect.left - canvasBounds.left;
                const textTop = textRect.top - canvasBounds.top;
                const textRight = textLeft + textRect.width;
                const textBottom = textTop + textRect.height;

                bounds.minX = Math.min(bounds.minX, textLeft);
                bounds.minY = Math.min(bounds.minY, textTop);
                bounds.maxX = Math.max(bounds.maxX, textRight);
                bounds.maxY = Math.max(bounds.maxY, textBottom);
            }
        }

        // If no elements found, use default canvas size
        if (bounds.minX === Infinity) {
            bounds.minX = 0;
            bounds.minY = 0;
            bounds.maxX = canvasBounds.width;
            bounds.maxY = canvasBounds.height;
        }

        // Add extra padding to ensure everything is captured
        const padding = 50;
        bounds.minX -= padding;
        bounds.minY -= padding;
        bounds.maxX += padding;
        bounds.maxY += padding;

        return bounds;
    }

    // Function to draw a grid pattern on the canvas
    function drawGridPattern(ctx, width, height) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#e0e0e0';
        const gridSize = 20;
        const dotSize = 1;

        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Function to draw a shape on the canvas
    function drawShapeOnCanvas(ctx, shape, canvasBounds, offsetX = 0, offsetY = 0) {
        const bounds = shape.getBoundingClientRect();
        const canvasLeft = canvasBounds.left;
        const canvasTop = canvasBounds.top;

        // Draw shape
        ctx.save();

        // Set shape styles
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#ffffff';

        // Calculate position relative to canvas and apply offset
        const x = bounds.left - canvasLeft - offsetX;
        const y = bounds.top - canvasTop - offsetY;
        const width = bounds.width;
        const height = bounds.height;

        // Draw different shape types
        if (shape.classList.contains('circle')) {
            const radius = width / 2;
            ctx.beginPath();
            ctx.arc(x + radius, y + radius, radius - 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (shape.classList.contains('hexagon')) {
            ctx.save();

            // Use actual shape dimensions for accurate rendering
            const width = bounds.width;
            const height = bounds.height;

            // Draw rotated hexagon (outer border)
            ctx.beginPath();
            ctx.moveTo(x + width / 4, y);
            ctx.lineTo(x + width * 3 / 4, y);
            ctx.lineTo(x + width, y + height / 2);
            ctx.lineTo(x + width * 3 / 4, y + height);
            ctx.lineTo(x + width / 4, y + height);
            ctx.lineTo(x, y + height / 2);
            ctx.closePath();
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        } else if (shape.classList.contains('rounded-rectangle')) {
            const radius = 10;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arcTo(x + width, y, x + width, y + radius, radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
            ctx.lineTo(x + radius, y + height);
            ctx.arcTo(x, y + height, x, y + height - radius, radius);
            ctx.lineTo(x, y + radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            // Regular rectangle
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.fill();
            ctx.stroke();
        }

        // Add the text with word wrapping
        const textElement = shape.querySelector('.shape-text');
        if (textElement && textElement.textContent) {
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '12px Arial';

            const text = textElement.textContent;
            const maxWidth = width - 16; // Padding on each side

            // Word wrap algorithm
            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const testLine = currentLine + ' ' + word;
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > maxWidth) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);

            // Draw wrapped text
            const lineHeight = 18;
            const totalTextHeight = lines.length * lineHeight;
            const textY = y + (height / 2) - (totalTextHeight / 2) + (lineHeight / 2);

            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], x + (width / 2), textY + (i * lineHeight));
            }
        }

        ctx.restore();
    }

    // Function to draw a connector on the canvas
 // Function to draw a connector on the canvas
function drawConnectorOnCanvas(ctx, connector, canvasBounds, offsetX = 0, offsetY = 0) {
    if (!connector || !connector.source || !connector.target) return;

    const sourceElement = document.getElementById(connector.source);
    const targetElement = document.getElementById(connector.target);

    if (!sourceElement || !targetElement) return;

    const sourceCenter = getShapeCenter(sourceElement);
    const targetCenter = getShapeCenter(targetElement);

    // Calculate precise border intersections
    let sourcePoint = calculateShapeBorderPoint(sourceElement, targetCenter);
    let targetPoint = calculateShapeBorderPoint(targetElement, sourceCenter);

    // Apply a small margin to prevent overlap with shape edges
    const arrowMargin = 2;
    
    // Apply margin in the direction from border to center
    const applyMargin = (point, centerPoint) => {
        const dx = centerPoint.x - point.x;
        const dy = centerPoint.y - point.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return point; // avoid division by zero

        return {
            x: point.x + (dx / len) * arrowMargin,
            y: point.y + (dy / len) * arrowMargin
        };
    };

    sourcePoint = applyMargin(sourcePoint, sourceCenter);
    targetPoint = applyMargin(targetPoint, targetCenter);

    // Apply offset to points
    const adjustedSourcePoint = {
        x: sourcePoint.x - offsetX,
        y: sourcePoint.y - offsetY
    };

    const adjustedTargetPoint = {
        x: targetPoint.x - offsetX,
        y: targetPoint.y - offsetY
    };

    ctx.save();

    // Set connector styles
    ctx.strokeStyle = connector.color || 'black';
    ctx.lineWidth = connector.style === 'thick' ? 4 : 2;
    if (connector.style === 'dashed') {
        ctx.setLineDash([5, 3]);
    }

    // Draw the connector as a straight line
    ctx.beginPath();
    ctx.moveTo(adjustedSourcePoint.x, adjustedSourcePoint.y);
    ctx.lineTo(adjustedTargetPoint.x, adjustedTargetPoint.y);
    ctx.stroke();

    // Calculate the angle for arrowheads
    const dx = adjustedTargetPoint.x - adjustedSourcePoint.x;
    const dy = adjustedTargetPoint.y - adjustedSourcePoint.y;
    const angle = Math.atan2(dy, dx);

    // Draw arrows
    if (connector.arrowStyle !== 'none') {
        // Draw end arrow
        if (connector.arrowStyle === 'end' || connector.arrowStyle === 'both') {
            drawArrowhead(ctx, adjustedTargetPoint.x, adjustedTargetPoint.y, angle, connector.color || 'black');
        }

        // Draw start arrow
        if (connector.arrowStyle === 'both') {
            drawArrowhead(ctx, adjustedSourcePoint.x, adjustedSourcePoint.y, Math.PI + angle, connector.color || 'black');
        }
    }

    // Draw connector text
    if (connector.text && connector.text.textContent && connector.text.textContent.trim() !== '') {
        const midX = (adjustedSourcePoint.x + adjustedTargetPoint.x) / 2;
        const midY = (adjustedSourcePoint.y + adjustedTargetPoint.y) / 2;

        // Draw text background
        const padding = 4;
        ctx.font = '12px Arial';
        const textMetrics = ctx.measureText(connector.text.textContent);
        const textWidth = textMetrics.width + padding * 2;
        const textHeight = 16 + padding * 2;

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#cccccc';
        ctx.beginPath();
        ctx.rect(midX - textWidth / 2, midY - textHeight / 2, textWidth, textHeight);
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(connector.text.textContent, midX, midY);
    }

    ctx.restore();
}

    // Function to draw an arrowhead on the canvas
    function drawArrowhead(ctx, x, y, angle, color) {
        const arrowLength = 12;  // Increased from 10
        const arrowWidth = 8;    // Increased from 6

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowLength, arrowWidth / 2);
        ctx.lineTo(-arrowLength, -arrowWidth / 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        ctx.restore();
    }
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Force a redraw of any connectors after Bootstrap is initialized
    setTimeout(() => {
        connectors.forEach(connector => {
            updateConnectorPath(connector);
        });
    }, 100);


});
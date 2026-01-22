// Circle of Fifths and Chromatic Circle Visualizations - Interactive
class CircleVisualizer {
    constructor(scaleManager) {
        this.scaleManager = scaleManager;
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.circleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
        this.circleOfFourths = ['C', 'F', 'A#', 'D#', 'G#', 'C#', 'F#', 'B', 'E', 'A', 'D', 'G'];
        this.currentKey = 'C';
        this.currentScale = 'Major (Ionian)';
    }
    
    // Create circle of fifths visualization with interactivity
    createCircleOfFifths(container, radius = 150, centerX = 200, centerY = 200) {
        container.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', centerX * 2);
        svg.setAttribute('height', centerY * 2);
        svg.setAttribute('class', 'circle-svg interactive-circle');
        svg.setAttribute('data-circle-type', 'fifths');
        
        const center = { x: centerX, y: centerY };
        const noteRadius = 35;
        const angleStep = (2 * Math.PI) / 12;
        
        // Draw circle background
        const circleBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circleBg.setAttribute('cx', center.x);
        circleBg.setAttribute('cy', center.y);
        circleBg.setAttribute('r', radius);
        circleBg.setAttribute('fill', 'none');
        circleBg.setAttribute('stroke', '#667eea');
        circleBg.setAttribute('stroke-width', '2');
        svg.appendChild(circleBg);
        
        // Draw lines connecting notes
        for (let i = 0; i < 12; i++) {
            const angle1 = i * angleStep - Math.PI / 2;
            const angle2 = ((i + 1) % 12) * angleStep - Math.PI / 2;
            
            const x1 = center.x + radius * Math.cos(angle1);
            const y1 = center.y + radius * Math.sin(angle1);
            const x2 = center.x + radius * Math.cos(angle2);
            const y2 = center.y + radius * Math.sin(angle2);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#dee2e6');
            line.setAttribute('stroke-width', '1');
            svg.appendChild(line);
        }
        
        // Draw notes
        this.circleOfFifths.forEach((note, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            
            // Note circle group for click handling
            const noteGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            noteGroup.setAttribute('class', 'circle-note-group');
            noteGroup.setAttribute('data-note', note);
            noteGroup.style.cursor = 'pointer';
            
            // Note circle
            const noteCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            noteCircle.setAttribute('cx', x);
            noteCircle.setAttribute('cy', y);
            noteCircle.setAttribute('r', noteRadius);
            noteCircle.setAttribute('fill', '#fff');
            noteCircle.setAttribute('stroke', '#667eea');
            noteCircle.setAttribute('stroke-width', '2');
            noteCircle.setAttribute('class', 'circle-note');
            noteCircle.setAttribute('data-note', note);
            noteGroup.appendChild(noteCircle);
            
            // Note text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y - 8);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '16');
            text.setAttribute('font-weight', '700');
            text.setAttribute('fill', '#333');
            text.setAttribute('class', 'circle-note-name');
            text.textContent = note;
            noteGroup.appendChild(text);
            
            // Scale degree text (will be updated)
            const degreeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            degreeText.setAttribute('x', x);
            degreeText.setAttribute('y', y + 12);
            degreeText.setAttribute('text-anchor', 'middle');
            degreeText.setAttribute('dominant-baseline', 'middle');
            degreeText.setAttribute('font-size', '11');
            degreeText.setAttribute('font-weight', '500');
            degreeText.setAttribute('fill', '#666');
            degreeText.setAttribute('class', 'circle-degree');
            degreeText.textContent = '';
            noteGroup.appendChild(degreeText);
            
            svg.appendChild(noteGroup);
        });
        
        // Center label
        const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        centerText.setAttribute('x', center.x);
        centerText.setAttribute('y', center.y);
        centerText.setAttribute('text-anchor', 'middle');
        centerText.setAttribute('dominant-baseline', 'middle');
        centerText.setAttribute('font-size', '12');
        centerText.setAttribute('font-weight', '600');
        centerText.setAttribute('fill', '#667eea');
        centerText.textContent = 'Circle of Fifths';
        svg.appendChild(centerText);
        
        container.appendChild(svg);
        
        // Setup click handlers
        this.setupCircleClicks(container, 'fifths');
        
        // Update with current scale
        this.updateCircleHighlights(container, 'fifths');
    }
    
    // Create chromatic circle visualization with interactivity
    createChromaticCircle(container, radius = 150, centerX = 200, centerY = 200) {
        container.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', centerX * 2);
        svg.setAttribute('height', centerY * 2);
        svg.setAttribute('class', 'circle-svg interactive-circle');
        svg.setAttribute('data-circle-type', 'chromatic');
        
        const center = { x: centerX, y: centerY };
        const noteRadius = 35;
        const angleStep = (2 * Math.PI) / 12;
        
        // Draw circle background
        const circleBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circleBg.setAttribute('cx', center.x);
        circleBg.setAttribute('cy', center.y);
        circleBg.setAttribute('r', radius);
        circleBg.setAttribute('fill', 'none');
        circleBg.setAttribute('stroke', '#764ba2');
        circleBg.setAttribute('stroke-width', '2');
        svg.appendChild(circleBg);
        
        // Draw lines connecting adjacent notes
        for (let i = 0; i < 12; i++) {
            const angle1 = i * angleStep - Math.PI / 2;
            const angle2 = ((i + 1) % 12) * angleStep - Math.PI / 2;
            
            const x1 = center.x + radius * Math.cos(angle1);
            const y1 = center.y + radius * Math.sin(angle1);
            const x2 = center.x + radius * Math.cos(angle2);
            const y2 = center.y + radius * Math.sin(angle2);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#dee2e6');
            line.setAttribute('stroke-width', '1');
            svg.appendChild(line);
        }
        
        // Draw notes in chromatic order
        this.allNotes.forEach((note, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            
            const isNatural = !note.includes('#');
            
            // Note circle group for click handling
            const noteGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            noteGroup.setAttribute('class', 'circle-note-group');
            noteGroup.setAttribute('data-note', note);
            noteGroup.style.cursor = 'pointer';
            
            // Note circle
            const noteCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            noteCircle.setAttribute('cx', x);
            noteCircle.setAttribute('cy', y);
            noteCircle.setAttribute('r', noteRadius);
            noteCircle.setAttribute('fill', isNatural ? '#fff' : '#f0f0f0');
            noteCircle.setAttribute('stroke', isNatural ? '#764ba2' : '#999');
            noteCircle.setAttribute('stroke-width', '2');
            noteCircle.setAttribute('class', 'circle-note');
            noteCircle.setAttribute('data-note', note);
            noteGroup.appendChild(noteCircle);
            
            // Note text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y - 8);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '16');
            text.setAttribute('font-weight', '700');
            text.setAttribute('fill', isNatural ? '#333' : '#666');
            text.setAttribute('class', 'circle-note-name');
            text.textContent = note;
            noteGroup.appendChild(text);
            
            // Scale degree text (will be updated)
            const degreeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            degreeText.setAttribute('x', x);
            degreeText.setAttribute('y', y + 12);
            degreeText.setAttribute('text-anchor', 'middle');
            degreeText.setAttribute('dominant-baseline', 'middle');
            degreeText.setAttribute('font-size', '11');
            degreeText.setAttribute('font-weight', '500');
            degreeText.setAttribute('fill', '#666');
            degreeText.setAttribute('class', 'circle-degree');
            degreeText.textContent = '';
            noteGroup.appendChild(degreeText);
            
            svg.appendChild(noteGroup);
        });
        
        // Center label
        const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        centerText.setAttribute('x', center.x);
        centerText.setAttribute('y', center.y);
        centerText.setAttribute('text-anchor', 'middle');
        centerText.setAttribute('dominant-baseline', 'middle');
        centerText.setAttribute('font-size', '12');
        centerText.setAttribute('font-weight', '600');
        centerText.setAttribute('fill', '#764ba2');
        centerText.textContent = 'Chromatic Circle';
        svg.appendChild(centerText);
        
        container.appendChild(svg);
        
        // Setup click handlers
        this.setupCircleClicks(container, 'chromatic');
        
        // Update with current scale
        this.updateCircleHighlights(container, 'chromatic');
    }
    
    // Setup click handlers for circles
    setupCircleClicks(container, circleType) {
        const noteGroups = container.querySelectorAll('.circle-note-group');
        noteGroups.forEach(group => {
            group.addEventListener('click', (e) => {
                const note = group.getAttribute('data-note');
                if (note && window.fretboardVisualizer) {
                    // Update key selector
                    const keySelect = document.getElementById('key-select');
                    if (keySelect) {
                        keySelect.value = note;
                        // Trigger change event
                        keySelect.dispatchEvent(new Event('change'));
                    }
                }
            });
            
            // Add hover effect
            group.addEventListener('mouseenter', () => {
                const circle = group.querySelector('.circle-note');
                circle.setAttribute('stroke-width', '3');
            });
            
            group.addEventListener('mouseleave', () => {
                const circle = group.querySelector('.circle-note');
                circle.setAttribute('stroke-width', '2');
            });
        });
    }
    
    // Update circle highlights and scale degrees
    updateCircleHighlights(container, circleType, key = null, scale = null) {
        if (!container || container.style.display === 'none') return;
        
        const currentKey = key || this.currentKey;
        const currentScale = scale || this.currentScale;
        
        const scaleNotes = this.scaleManager.getScaleNotes(currentKey, currentScale);
        const noteGroups = container.querySelectorAll('.circle-note-group');
        
        noteGroups.forEach(group => {
            const note = group.getAttribute('data-note');
            const circle = group.querySelector('.circle-note');
            const degreeText = group.querySelector('.circle-degree');
            
            if (!note || !circle) return;
            
            // Reset styling
            circle.classList.remove('highlighted', 'root-highlighted');
            circle.setAttribute('fill', circle.getAttribute('data-original-fill') || '#fff');
            circle.setAttribute('stroke', circle.getAttribute('data-original-stroke') || '#667eea');
            
            const isInScale = scaleNotes.includes(note);
            const isRoot = note === currentKey;
            const scaleDegree = isInScale ? scaleNotes.indexOf(note) + 1 : 0;
            
            // Update scale degree display
            if (degreeText) {
                if (scaleDegree > 0) {
                    degreeText.textContent = scaleDegree;
                    degreeText.setAttribute('fill', isRoot ? '#ffc107' : '#28a745');
                } else {
                    degreeText.textContent = '';
                }
            }
            
            // Highlight based on scale membership
            if (isInScale) {
                if (isRoot) {
                    circle.classList.add('root-highlighted');
                    circle.setAttribute('fill', '#fff3cd');
                    circle.setAttribute('stroke', '#ffc107');
                    circle.setAttribute('stroke-width', '3');
                } else {
                    circle.classList.add('highlighted');
                    circle.setAttribute('fill', '#d4edda');
                    circle.setAttribute('stroke', '#28a745');
                }
            } else {
                circle.setAttribute('fill', '#f8f9fa');
                circle.setAttribute('stroke', '#dee2e6');
                circle.setAttribute('opacity', '0.5');
            }
        });
    }
    
    // Highlight note on circle (legacy method for compatibility)
    highlightNote(container, note, isRoot = false) {
        const circles = container.querySelectorAll('.circle-note');
        circles.forEach(circle => {
            circle.classList.remove('highlighted', 'root-highlighted');
            if (circle.getAttribute('data-note') === note) {
                circle.classList.add(isRoot ? 'root-highlighted' : 'highlighted');
            }
        });
    }
    
    // Clear highlights
    clearHighlights(container) {
        const circles = container.querySelectorAll('.circle-note');
        circles.forEach(circle => {
            circle.classList.remove('highlighted', 'root-highlighted');
        });
    }
    
    // Set current key and scale for updates
    setCurrentKeyScale(key, scale) {
        this.currentKey = key;
        this.currentScale = scale;
    }
}

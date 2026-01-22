// Circle of Fifths and Chromatic Circle Visualizations
class CircleVisualizer {
    constructor() {
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.circleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
        this.circleOfFourths = ['C', 'F', 'A#', 'D#', 'G#', 'C#', 'F#', 'B', 'E', 'A', 'D', 'G'];
    }
    
    // Create circle of fifths visualization
    createCircleOfFifths(container, radius = 150, centerX = 200, centerY = 200) {
        container.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', centerX * 2);
        svg.setAttribute('height', centerY * 2);
        svg.setAttribute('class', 'circle-svg');
        
        const center = { x: centerX, y: centerY };
        const noteRadius = 30;
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
            svg.appendChild(noteCircle);
            
            // Note text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', '600');
            text.setAttribute('fill', '#333');
            text.textContent = note;
            svg.appendChild(text);
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
    }
    
    // Create chromatic circle visualization
    createChromaticCircle(container, radius = 150, centerX = 200, centerY = 200) {
        container.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', centerX * 2);
        svg.setAttribute('height', centerY * 2);
        svg.setAttribute('class', 'circle-svg');
        
        const center = { x: centerX, y: centerY };
        const noteRadius = 30;
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
            svg.appendChild(noteCircle);
            
            // Note text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', '600');
            text.setAttribute('fill', isNatural ? '#333' : '#666');
            text.textContent = note;
            svg.appendChild(text);
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
    }
    
    // Highlight note on circle
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
}

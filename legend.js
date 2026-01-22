// Dynamic Legend System
class LegendManager {
    constructor() {
        this.legendContainer = null;
        this.activeItems = new Set();
        this.legendItems = {
            'scale-note': {
                label: 'Scale Note',
                color: '#d4edda',
                borderColor: '#28a745',
                description: 'A note that belongs to the selected scale. These are the notes you can use to play melodies and solos in this key and scale.'
            },
            'scale-root': {
                label: 'Root Note',
                color: '#fff3cd',
                borderColor: '#ffc107',
                description: 'The root note of the current key. This is the tonal center of the scale and the note the scale is built from.'
            },
            'scale-out': {
                label: 'Out of Scale',
                color: '#f8f9fa',
                borderColor: '#dee2e6',
                description: 'Notes that are not part of the selected scale. These can create tension or dissonance when played.'
            },
            'chord-note': {
                label: 'Chord Note',
                color: '#cfe2ff',
                borderColor: '#007bff',
                description: 'A note that belongs to the selected chord. These notes form the harmonic foundation.'
            },
            'chord-root': {
                label: 'Chord Root',
                color: '#002d5c',
                borderColor: '#0056b3',
                description: 'The root note of the selected chord. This is the fundamental note that gives the chord its name.'
            },
            'interval-2nd': {
                label: '2nd Interval',
                color: '#17a2b8',
                description: 'A second interval from the root (major or minor second). Creates stepwise motion.'
            },
            'interval-3rd': {
                label: '3rd Interval',
                color: '#28a745',
                description: 'A third interval from the root (major or minor third). Defines chord quality (major/minor).'
            },
            'interval-4th': {
                label: '4th Interval',
                color: '#ffc107',
                description: 'A perfect fourth interval from the root. Creates a stable, consonant sound.'
            },
            'interval-5th': {
                label: '5th Interval',
                color: '#007bff',
                description: 'A perfect fifth interval from the root. The most consonant interval after the octave.'
            },
            'interval-6th': {
                label: '6th Interval',
                color: '#6f42c1',
                description: 'A sixth interval from the root (major or minor sixth). Adds color to melodies.'
            },
            'interval-7th': {
                label: '7th Interval',
                color: '#fd7e14',
                description: 'A seventh interval from the root (major or minor seventh). Creates tension and resolution.'
            },
            'interval-tritone': {
                label: 'Tritone',
                color: '#dc3545',
                description: 'The tritone (diminished fifth/augmented fourth). The most dissonant interval, creates strong tension.'
            },
            'pattern-note': {
                label: 'Pattern Note',
                color: 'rgba(111, 66, 193, 0.2)',
                borderColor: '#6f42c1',
                description: 'A note that is part of a scale pattern (like CAGED system). These patterns help navigate the fretboard.'
            },
            'pattern-root': {
                label: 'Pattern Root',
                color: 'rgba(90, 50, 163, 0.3)',
                borderColor: '#5a32a3',
                description: 'The root note of a scale pattern. Patterns typically start from root positions.'
            },
            'note-selected': {
                label: 'Selected Note',
                color: 'rgba(0, 123, 255, 0.2)',
                borderColor: '#007bff',
                description: 'A note that has been clicked and selected. All positions of this note are highlighted.'
            },
            'triad-root': {
                label: 'Triad Root',
                color: '#e74c3c',
                borderColor: '#c0392b',
                description: 'The root note of a triad (three-note chord). Triads are the foundation of harmony.'
            },
            'triad-third': {
                label: 'Triad Third',
                color: '#3498db',
                borderColor: '#2980b9',
                description: 'The third of a triad. Determines if the chord is major (4 semitones) or minor (3 semitones).'
            },
            'triad-fifth': {
                label: 'Triad Fifth',
                color: '#2ecc71',
                borderColor: '#27ae60',
                description: 'The fifth of a triad. Usually a perfect fifth (7 semitones), creates stability.'
            },
            'triad-connection': {
                label: 'Triad Connection',
                color: '#f39c12',
                borderColor: '#d68910',
                description: 'Visual connection between triad notes. Shows how the notes relate spatially on the fretboard.'
            },
            'freq-high': {
                label: 'High Frequency',
                color: '#28a745',
                description: 'Notes that appear frequently across the fretboard in this scale. Many positions available.'
            },
            'freq-medium': {
                label: 'Medium Frequency',
                color: '#ffc107',
                description: 'Notes that appear moderately across the fretboard. Several positions available.'
            },
            'freq-low': {
                label: 'Low Frequency',
                color: '#fd7e14',
                description: 'Notes that appear less frequently. Fewer positions available on the fretboard.'
            }
        };
    }
    
    // Initialize legend
    init() {
        this.createLegendContainer();
    }
    
    // Create legend container
    createLegendContainer() {
        this.legendContainer = document.createElement('div');
        this.legendContainer.id = 'legend-container';
        this.legendContainer.className = 'legend-container';
        document.body.appendChild(this.legendContainer);
    }
    
    // Update legend based on active visualizations
    updateLegend(activeClasses) {
        if (!this.legendContainer) return;
        
        this.activeItems = new Set(activeClasses);
        this.renderLegend();
    }
    
    // Render legend items
    renderLegend() {
        if (!this.legendContainer) return;
        
        const activeItems = Array.from(this.activeItems).filter(item => 
            this.legendItems[item]
        );
        
        if (activeItems.length === 0) {
            this.legendContainer.style.display = 'none';
            return;
        }
        
        this.legendContainer.style.display = 'block';
        this.legendContainer.innerHTML = `
            <div class="legend-header">
                <h4>Legend</h4>
                <button class="legend-toggle" id="legend-toggle">−</button>
            </div>
            <div class="legend-content" id="legend-content">
                ${activeItems.map(item => this.createLegendItem(item)).join('')}
            </div>
        `;
        
        // Setup toggle
        const toggle = document.getElementById('legend-toggle');
        const content = document.getElementById('legend-content');
        if (toggle && content) {
            toggle.addEventListener('click', () => {
                const isCollapsed = content.style.display === 'none';
                content.style.display = isCollapsed ? 'block' : 'none';
                toggle.textContent = isCollapsed ? '−' : '+';
            });
        }
        
        // Setup tooltips
        this.setupTooltips();
    }
    
    // Create a legend item
    createLegendItem(itemKey) {
        const item = this.legendItems[itemKey];
        if (!item) return '';
        
        return `
            <div class="legend-item" data-item="${itemKey}">
                <div class="legend-color-box" 
                     style="background: ${item.color || '#fff'}; border-color: ${item.borderColor || item.color || '#333'};">
                </div>
                <span class="legend-label">${item.label}</span>
                <div class="legend-tooltip">
                    <div class="tooltip-content">
                        <strong>${item.label}</strong>
                        <p>${item.description}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Setup tooltips for legend items
    setupTooltips() {
        const items = this.legendContainer.querySelectorAll('.legend-item');
        items.forEach(item => {
            const tooltip = item.querySelector('.legend-tooltip');
            
            item.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
            });
            
            item.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
            
            item.addEventListener('click', () => {
                const isVisible = tooltip.style.display === 'block';
                tooltip.style.display = isVisible ? 'none' : 'block';
            });
        });
    }
    
    // Get active classes from fretboard
    getActiveClasses(fretboardElement) {
        const activeClasses = new Set();
        const allFrets = fretboardElement.querySelectorAll('.fret');
        
        allFrets.forEach(fret => {
            Array.from(fret.classList).forEach(className => {
                if (this.legendItems[className]) {
                    activeClasses.add(className);
                }
            });
        });
        
        return Array.from(activeClasses);
    }
}

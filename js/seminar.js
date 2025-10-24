// Babytop Seminar JavaScript Renderer

class SeminarRenderer {
    constructor() {
        this.talksContainer = document.getElementById('talks-container');
        this.semesterInfo = document.getElementById('semester-info');
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
    }

    async loadSeminarData(dataPath) {
        try {
            this.showLoading();
            const response = await fetch(dataPath);
            
            if (!response.ok) {
                throw new Error(`Failed to load seminar data: ${response.status}`);
            }
            
            const data = await response.json();
            this.renderSeminar(data);
            this.hideLoading();
        } catch (error) {
            console.error('Error loading seminar data:', error);
            this.showError(`Failed to load seminar data: ${error.message}`);
            this.hideLoading();
        }
    }

    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
        if (this.talksContainer) {
            this.talksContainer.style.display = 'none';
        }
        if (this.errorElement) {
            this.errorElement.style.display = 'none';
        }
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
        if (this.talksContainer) {
            this.talksContainer.style.display = 'block';
        }
    }

    showError(message) {
        if (this.errorElement) {
            this.errorElement.textContent = message;
            this.errorElement.style.display = 'block';
        }
        if (this.talksContainer) {
            this.talksContainer.style.display = 'none';
        }
    }

    renderSeminar(data) {
        this.renderSemesterInfo(data);
        this.renderTalks(data.talks);
        this.renderOrganizers(data);
    }

    renderSemesterInfo(data) {
        if (!this.semesterInfo) return;

        const semesterTitle = document.getElementById('semester-title');
        const organizerInfo = document.getElementById('organizer-info');
        const semesterDescription = document.getElementById('semester-description');
        const meetingInfo = document.getElementById('meeting-info');
        const calendarLink = document.getElementById('calendar-link');

        if (semesterTitle) {
            semesterTitle.textContent = data.semester;
        }

        if (organizerInfo) {
            const organizers = data.organizers || [];
            if (organizers.length === 1) {
                organizerInfo.textContent = `Organizer: ${organizers[0]}`;
            } else if (organizers.length === 2) {
                organizerInfo.textContent = `Organizers: ${organizers[0]} and ${organizers[1]}`;
            } else if (organizers.length > 2) {
                const lastOrganizer = organizers[organizers.length - 1];
                const otherOrganizers = organizers.slice(0, -1).join(', ');
                organizerInfo.textContent = `Organizers: ${otherOrganizers}, and ${lastOrganizer}`;
            } else {
                organizerInfo.textContent = '';
            }
        }

        if (semesterDescription) {
            semesterDescription.textContent = data.topic;
        }

        if (meetingInfo) {
            meetingInfo.textContent = `We meet at ${data.meeting}.`;
        }

        if (calendarLink && data.calendarLink) {
            calendarLink.href = data.calendarLink;
            calendarLink.textContent = 'Click here to add the seminar to your Google calendar.';
        }
    }

    renderOrganizers(data) {
        const organizerElement = document.getElementById('organizer');
        if (!organizerElement) return;

        const organizers = data.organizers || ['Unknown'];
        organizerElement.textContent = this.formatOrganizers(organizers);
    }

    formatOrganizers(organizers) {
        if (organizers.length === 1) {
            return organizers[0];
        } else if (organizers.length === 2) {
            return `${organizers[0]} and ${organizers[1]}`;
        } else {
            const lastOrganizer = organizers[organizers.length - 1];
            const otherOrganizers = organizers.slice(0, -1);
            return `${otherOrganizers.join(', ')}, and ${lastOrganizer}`;
        }
    }

    renderTalks(talks) {
        if (!this.talksContainer) return;

        this.talksContainer.innerHTML = '';

        talks.forEach((talk, index) => {
            const talkElement = this.createTalkElement(talk, index);
            this.talksContainer.appendChild(talkElement);
        });
    }

    createTalkElement(talk, index) {
        const talkDiv = document.createElement('div');
        talkDiv.className = 'talk';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'talk-header';
        headerDiv.addEventListener('click', () => this.toggleAbstract(index));

        // Create date element
        const dateDiv = document.createElement('div');
        dateDiv.className = 'talk-date';
        dateDiv.textContent = `${talk.date} ${talk.year}`;

        // Create title element
        const titleDiv = document.createElement('div');
        titleDiv.className = 'talk-title';
        titleDiv.textContent = talk.title;

        // Create speaker element
        const speakerDiv = document.createElement('div');
        speakerDiv.className = 'talk-speaker';
        speakerDiv.innerHTML = `${talk.speaker} <span class="talk-affiliation">(${talk.affiliation})</span>`;

        // Create expand indicator
        const expandIndicator = document.createElement('div');
        expandIndicator.className = 'talk-expand-indicator';
        expandIndicator.textContent = '▼';

        headerDiv.appendChild(dateDiv);
        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(speakerDiv);
        headerDiv.appendChild(expandIndicator);

        const abstractDiv = document.createElement('div');
        abstractDiv.className = 'talk-abstract';
        abstractDiv.id = `abstract-${index}`;

        const abstractContent = document.createElement('div');
        abstractContent.className = 'talk-abstract-content';
        abstractContent.textContent = talk.abstract;

        abstractDiv.appendChild(abstractContent);

        talkDiv.appendChild(headerDiv);
        talkDiv.appendChild(abstractDiv);

        return talkDiv;
    }

    toggleAbstract(index) {
        const abstract = document.getElementById(`abstract-${index}`);
        const talkElement = abstract?.closest('.talk');
        const expandIndicator = talkElement?.querySelector('.talk-expand-indicator');
        
        if (abstract) {
            const isExpanded = abstract.classList.contains('expanded');
            abstract.classList.toggle('expanded');
            
            // Animate the expand indicator
            if (expandIndicator) {
                if (isExpanded) {
                    expandIndicator.textContent = '▼';
                    expandIndicator.style.transform = 'translateY(-50%) rotate(0deg)';
                } else {
                    expandIndicator.textContent = '▲';
                    expandIndicator.style.transform = 'translateY(-50%) rotate(0deg)';
                }
            }
        }
    }
}

// Initialize the seminar renderer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const renderer = new SeminarRenderer();
    
    // Determine which data file to load based on the page
    const currentPath = window.location.pathname;
    let dataPath = './data/current.json'; // default for index.html
    
    if (currentPath.includes('semesters/')) {
        // Extract semester from URL path
        const semesterMatch = currentPath.match(/semesters\/([^\/]+)\.html/);
        if (semesterMatch) {
            dataPath = `../data/${semesterMatch[1]}.json`;
        }
    }
    
    renderer.loadSeminarData(dataPath);
});

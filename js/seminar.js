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
    }

    renderSemesterInfo(data) {
        if (!this.semesterInfo) return;

        const semesterTitle = document.getElementById('semester-title');
        const semesterDescription = document.getElementById('semester-description');
        const meetingInfo = document.getElementById('meeting-info');
        const calendarLink = document.getElementById('calendar-link');

        if (semesterTitle) {
            semesterTitle.textContent = data.semester;
        }

        if (semesterDescription) {
            semesterDescription.textContent = `This semester, Babytop will focus on ${data.topic}.`;
        }

        if (meetingInfo) {
            meetingInfo.textContent = `We meet at ${data.meeting}.`;
        }

        if (calendarLink && data.calendarLink) {
            calendarLink.href = data.calendarLink;
            calendarLink.textContent = 'Click here to add the seminar to your Google calendar.';
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

        const dateDiv = document.createElement('div');
        dateDiv.className = 'talk-date';
        dateDiv.textContent = `**${talk.date}** ${talk.year}`;

        const titleDiv = document.createElement('div');
        titleDiv.className = 'talk-title';
        titleDiv.textContent = talk.title;

        const speakerDiv = document.createElement('div');
        speakerDiv.className = 'talk-speaker';
        speakerDiv.textContent = `### ${talk.speaker} (${talk.affiliation})`;

        headerDiv.appendChild(dateDiv);
        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(speakerDiv);

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
        if (abstract) {
            abstract.classList.toggle('expanded');
        }
    }
}

// Initialize the seminar renderer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const renderer = new SeminarRenderer();
    
    // Determine which data file to load based on the page
    const currentPath = window.location.pathname;
    let dataPath = '/data/current.json'; // default for index.html
    
    if (currentPath.includes('semesters/')) {
        // Extract semester from URL path
        const semesterMatch = currentPath.match(/semesters\/([^\/]+)\.html/);
        if (semesterMatch) {
            dataPath = `/data/${semesterMatch[1]}.json`;
        }
    }
    
    renderer.loadSeminarData(dataPath);
});

# Babytop Seminar Website

A static website for the Babytop Seminar, built with plain HTML, CSS, and JavaScript. This site displays seminar talks with collapsible abstracts and supports multiple semester iterations.

## Site Structure

```
/
├── index.html                    # Current semester page
├── past-seminars.html           # Past semesters archive
├── semesters/                   # Individual past semester pages
│   └── spring2025.html
├── data/                        # JSON data files
│   ├── current.json            # Current semester data
│   └── spring2025.json         # Past semester data
├── js/
│   └── seminar.js              # JavaScript renderer
├── css/
│   └── styles.css              # Site styling
└── .github/workflows/
    └── static.yml              # GitHub Pages deployment
```

## Quick Start

1. **Clone this repository**
2. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"
3. **Push to main branch** - the site will auto-deploy

## Managing Seminar Data

### Adding a New Talk

Edit `/data/current.json` and add a new talk object:

```json
{
  "date": "Mar 18",
  "year": "2025", 
  "title": "Your Talk Title",
  "speaker": "Speaker Name",
  "affiliation": "MIT",
  "abstract": "Abstract text here..."
}
```

### Updating Semester Information

Edit the top-level fields in `/data/current.json`:

```json
{
  "semester": "Fall 2025",
  "topic": "your new topic",
  "meeting": "4:15pm on Tuesdays in Harvard SC 309",
  "calendarLink": "https://calendar.google.com/calendar",
  "organizer": "Your Name"
}
```

## Starting a New Semester

When a semester ends, follow these steps to archive it and start fresh:

### 1. Archive Current Semester

```bash
# Copy current data to archive
cp data/current.json data/spring2025.json

# Create archive page
cp semesters/spring2025.html semesters/spring2025.html
```

### 2. Update Past Semesters Page

Edit `past-seminars.html` and add a new entry:

```html
<div class="past-semester">
    <h3>Spring 2025</h3>
    <p><strong>Topic:</strong> Chromatic homotopy theory</p>
    <p><strong>Organizer:</strong> Matthew Niemiro</p>
    <a href="semesters/spring2025.html">View Spring 2025 talks →</a>
</div>
```

### 3. Start New Semester

Replace `/data/current.json` with new semester data:

```json
{
  "semester": "Fall 2025",
  "topic": "New Topic",
  "meeting": "4:15pm on Tuesdays in Harvard SC 309",
  "calendarLink": "https://calendar.google.com/calendar", 
  "organizer": "Your Name",
  "talks": []
}
```

### 4. Deploy Changes

```bash
git add .
git commit -m "Archive Spring 2025, start Fall 2025"
git push origin main
```

## File Descriptions

### HTML Files
- **`index.html`**: Main page showing current semester talks
- **`past-seminars.html`**: Lists all previous semester iterations
- **`semesters/*.html`**: Individual archived semester pages

### Data Files (`/data/`)
- **`current.json`**: Active semester data (always used by index.html)
- **`{semester}.json`**: Archived semester data files

### JavaScript (`/js/seminar.js`)
- Fetches JSON data and renders talks dynamically
- Handles collapsible abstract functionality
- Works across current and archived semester pages

### CSS (`/css/styles.css`)
- Clean, academic styling matching MIT site design
- Responsive design for mobile devices
- Smooth animations for abstract expansion

## Customization

### Styling
Edit `/css/styles.css` to modify:
- Colors and fonts
- Layout and spacing
- Responsive breakpoints
- Animation effects

### Functionality
Edit `/js/seminar.js` to modify:
- Data loading behavior
- Talk rendering format
- Interactive features

## Deployment

The site uses GitHub Actions for automatic deployment:

1. **Push to main branch** triggers deployment
2. **GitHub Pages** serves the static files
3. **No build step required** - pure HTML/CSS/JS

## Troubleshooting

### Talks Not Loading
- Check browser console for JavaScript errors
- Verify JSON syntax in data files
- Ensure file paths are correct

### Styling Issues
- Clear browser cache
- Check CSS file path in HTML
- Verify responsive design on mobile

### GitHub Pages Not Updating
- Check Actions tab for deployment status
- Verify Pages settings use "GitHub Actions" source
- Wait 5-10 minutes for changes to propagate

## For Future Organizers

This site is designed to be easily maintainable by non-technical users:

1. **Adding talks**: Just edit the JSON file
2. **New semesters**: Follow the archive process above
3. **No coding required**: Everything is data-driven
4. **Version controlled**: All changes are tracked in Git

The site will continue working as long as GitHub Pages is available and the repository is maintained.

## Support

For technical issues or questions about the site structure, refer to this README or check the GitHub repository issues.

---

**Current Organizer**: Matthew Niemiro  
**Site Design**: Based on [MIT Babytop Seminar](https://math.mit.edu/topology/babytop/)

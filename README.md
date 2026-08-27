# Darshan Books - Landing Page

A beautiful, responsive landing page for Darshan Books featuring a thoughtful collection of ebooks about the human mind, karma, parenting, mystery, and meaningful stories.

## Features

- ✨ Elegant, responsive design
- 📚 Featured book collection with Amazon links
- 📧 MailerLite newsletter integration
- 🎨 Professional color scheme with gold accents
- 📱 Mobile-friendly layout
- ♿ Accessible and semantic HTML
- 🚀 Ready for deployment

## Local Development

Start a local development server:

```bash
npm start
```

Or using Python:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Deployment to Netlify

### Option 1: Connect GitHub Repository
1. Push your code to a GitHub repository
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your GitHub repository
5. Netlify will automatically detect the `netlify.toml` configuration
6. Click "Deploy site"

### Option 2: Manual Deployment (Drag & Drop)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the entire project folder
3. Your site will be deployed instantly

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.
```

## Project Structure

```
g:\landingpage/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── images/             # Book cover images
├── netlify.toml        # Netlify configuration
├── package.json        # Project metadata
└── .gitignore          # Git ignore rules
```

## Configuration

The `netlify.toml` file includes:
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- Cache control for static assets (1 year expiration for optimized performance)
- SPA routing configuration

## MailerLite Integration

The newsletter form is connected to MailerLite with form ID: `44861973`

Form submissions are sent to:
```
https://assets.mailerlite.com/jsonp/2577026/forms/195872957627631453/subscribe
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

MIT

## Contact

For inquiries about Darshan Books, visit the website or subscribe to the newsletter.

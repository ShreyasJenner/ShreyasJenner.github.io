# My Portfolio — Jekyll + GitHub Pages

A clean, minimal portfolio with a built-in blog, powered by Jekyll and hosted on GitHub Pages.

## Quick start

### 1. Install dependencies

You need Ruby installed. Then:

```bash
gem install bundler
bundle install
```

### 2. Run locally

```bash
bundle exec jekyll serve
```

Open [http://localhost:4000](http://localhost:4000) — it live-reloads as it is edited.

### 3. Deploy

Push to GitHub. GitHub Pages automatically builds and deploys Jekyll sites from the `main` branch.

---

## Structure

```
portfolio/
├── _config.yml          # Site settings
├── _layouts/
│   ├── default.html     # Base page shell
│   └── post.html        # Blog post template
├── _includes/
│   ├── nav.html         # Navigation
│   └── footer.html      # Footer
├── _posts/              # Blog posts (Markdown)
├── assets/
│   ├── css/main.css     # All styles
│   └── js/main.js       # Minimal JS
├── blog/
│   └── index.html       # Blog listing page
└── index.html           # Homepage
```

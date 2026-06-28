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

Open [http://localhost:4000](http://localhost:4000) — it live-reloads as you edit.

### 3. Deploy

Push to GitHub. GitHub Pages automatically builds and deploys Jekyll sites from the `main` branch.

---

## Customizing

### Personal info
Edit `_config.yml` — update `title`, `author`, social links, and your site URL.

### Projects
Edit `index.html` — find the `#projects` section and replace the placeholder cards with your real projects.

### Skills
Edit `index.html` — find the `#skills` section.

### Blog posts
Add a new Markdown file to `_posts/` named:
```
YYYY-MM-DD-your-post-title.md
```

With this front matter at the top:
```yaml
---
layout: post
title: "Your Post Title"
date: 2026-01-01
tags: [tag1, tag2]
excerpt: "A short summary shown in previews."
---

Your post content here in Markdown.
```

### Contact form
The form uses [Formspree](https://formspree.io) — sign up for a free account, create a form, and replace `YOUR_FORM_ID` in `index.html` with your real ID.

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

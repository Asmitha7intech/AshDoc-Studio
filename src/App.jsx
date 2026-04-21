import React, { useMemo, useState } from "react";
import "./index.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const templates = {
  executive: { label: "Executive Brief", className: "template-executive" },
  minimal: { label: "Minimal Writer", className: "template-minimal" },
  modern: { label: "Modern Report", className: "template-modern" },
};

function parseContent(text) {
  const lines = text.split("\n");
  const blocks = [];
  let bullets = [];

  const flushBullets = () => {
    if (bullets.length) {
      blocks.push({ type: "ul", items: [...bullets] });
      bullets = [];
    }
  };

  for (let rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushBullets();
      continue;
    }

    if (line.startsWith("# ")) {
      flushBullets();
      blocks.push({ type: "h1", text: line.replace("# ", "") });
      continue;
    }

    if (line.startsWith("## ")) {
      flushBullets();
      blocks.push({ type: "h2", text: line.replace("## ", "") });
      continue;
    }

    if (line.startsWith("- ")) {
      bullets.push(line.replace("- ", ""));
      continue;
    }

    flushBullets();
    blocks.push({ type: "p", text: line });
  }

  flushBullets();
  return blocks;
}

export default function App() {
  const [title, setTitle] = useState("My Beautiful PDF");
  const [author, setAuthor] = useState("Asmitha");
  const [showTitle, setShowTitle] = useState(true);
  const [showAuthor, setShowAuthor] = useState(true);
  const [template, setTemplate] = useState("executive");
  const [fontSize, setFontSize] = useState(16);
  const [coverPage, setCoverPage] = useState(true);
  const [text, setText] = useState(`# Introduction

Welcome to AshDoc Studio.

This is your premium document creation space.

## Features

- Live editor
- Premium templates
- Clean PDF export

## Conclusion

Let's build something amazing.`);

  const blocks = useMemo(() => parseContent(text), [text]);

  const handleDownload = async () => {
    const elements = document.querySelectorAll(".pdf-export-page");

    if (!elements.length) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    for (let i = 0; i < elements.length; i++) {
      const canvas = await html2canvas(elements[i], {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    }

    pdf.save(`${title?.trim() || "AshDoc"}.pdf`);
  };

  const renderDocumentContent = () => {
    if (!blocks.length) {
      return <p>Start typing to generate your PDF preview...</p>;
    }

    return blocks.map((block, index) => {
      if (block.type === "h1") {
        return (
          <h2 key={index} className="content-h1">
            {block.text}
          </h2>
        );
      }

      if (block.type === "h2") {
        return (
          <h3 key={index} className="content-h2">
            {block.text}
          </h3>
        );
      }

      if (block.type === "ul") {
        return (
          <ul key={index} className="content-list">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }

      return <p key={index}>{block.text}</p>;
    });
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-1"></div>
      <div className="ambient ambient-2"></div>

      <header className="topbar no-print">
        <div className="brand-wrap">
          <div className="logo-box">A</div>
          <div>
            <h1>AshDoc Studio</h1>
            <p>Write beautifully. Export professionally.</p>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className="ghost-btn"
            onClick={() => setText("")}
            type="button"
          >
            Clear
          </button>
          <button
            className="primary-btn"
            onClick={handleDownload}
            type="button"
          >
            Download PDF
          </button>
        </div>
      </header>

      <main className="workspace">
        <section className="editor-card no-print">
          <div className="card-header">
            <div>
              <h2>Editor Studio</h2>
              <p>Create premium-looking documents with live preview</p>
            </div>
          </div>

          <div className="controls-grid">
            <div className="field">
              <label>Document Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="field">
              <label>Author</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
              />
            </div>

            <div className="field">
              <label>Template</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                {Object.entries(templates).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Font Size: {fontSize}px</label>
              <input
                type="range"
                min="13"
                max="22"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="toggle-row">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showTitle}
                onChange={(e) => setShowTitle(e.target.checked)}
              />
              <span>Show Title</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showAuthor}
                onChange={(e) => setShowAuthor(e.target.checked)}
              />
              <span>Show Author</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={coverPage}
                onChange={(e) => setCoverPage(e.target.checked)}
              />
              <span>Add Cover Page</span>
            </label>
          </div>

          <div className="field full">
            <label>Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your content here..."
            />
          </div>
        </section>

        <section className="preview-wrap">
          <div className="preview-top no-print">
            <div>
              <h2>Live PDF Preview</h2>
              <p>Premium document styling with clean visual hierarchy</p>
            </div>
          </div>

          <div className="preview-frame">
            <div className="preview-stack">
              {coverPage && (
                <article className="pdf-page pdf-export-page cover-page">
                  <div className="cover-inner">
                    <div className="cover-badge">ASHDOC STUDIO</div>

                    {showTitle && (
                      <h1 className="cover-title">
                        {title?.trim() || "Untitled Document"}
                      </h1>
                    )}

                    {showAuthor && (
                      <p className="cover-author">
                        By {author?.trim() || "Unknown Author"}
                      </p>
                    )}

                    <div className="cover-line"></div>
                    <p className="cover-subtitle">
                      Beautiful writing. Professional export.
                    </p>
                  </div>
                </article>
              )}

              <article
                className={`pdf-page pdf-export-page ${templates[template].className}`}
                style={{ fontSize: `${fontSize}px` }}
              >
                <div className="pdf-content-wrapper">
                  <div className="pdf-meta-top">
                    <span>{templates[template].label}</span>
                    {showAuthor && <span>{author?.trim() || "Author"}</span>}
                  </div>

                  {showTitle && (
                    <h1 className="pdf-title">
                      {title?.trim() || "Untitled Document"}
                    </h1>
                  )}

                  {showAuthor && (
                    <p className="pdf-author">
                      By {author?.trim() || "Unknown Author"}
                    </p>
                  )}

                  {(showTitle || showAuthor) && <div className="pdf-divider"></div>}

                  <div className="pdf-content">{renderDocumentContent()}</div>

                  <footer className="pdf-footer">
                    <span>AshDoc Studio</span>
                    <span>Page {coverPage ? 2 : 1}</span>
                  </footer>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

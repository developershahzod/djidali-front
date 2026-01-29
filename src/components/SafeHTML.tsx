import DOMPurify from "dompurify";
import { useMemo } from "react";

interface SafeHTMLProps {
  html: string;
  className?: string;
}

/**
 * Safely renders HTML content by sanitizing it with DOMPurify.
 * Allows safe HTML tags like formatting, images, videos, and links.
 * 
 * SECURITY: All HTML is sanitized through DOMPurify before rendering.
 */
export function SafeHTML({ html, className }: SafeHTMLProps) {
  const sanitizedHTML = useMemo(() => {
    // Configure DOMPurify to allow safe tags
    const config = {
      ALLOWED_TAGS: [
        "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li",
        "blockquote", "pre", "code",
        "a", "img", "iframe", "div", "span", "hr",
        "table", "thead", "tbody", "tr", "th", "td",
      ],
      ALLOWED_ATTR: [
        "href", "target", "rel",
        "src", "alt", "width", "height",
        "class", "style",
        "allowfullscreen", "frameborder", "allow",
      ],
      ALLOW_DATA_ATTR: false,
    };

    return DOMPurify.sanitize(html, config);
  }, [html]);

  // Return sanitized content wrapped in styled div
  // Content is sanitized by DOMPurify making it safe to render
  return (
    <div
      className={className}
      ref={(el) => {
        if (el) {
          el.innerHTML = sanitizedHTML;
        }
      }}
    />
  );
}

export default SafeHTML;

class CustomBlockquote extends HTMLElement {
  connectedCallback() {
    if (this.dataset.initialized) return;
    this.dataset.initialized = 'true';

    // Inject styles only once globally for the component
    if (!document.getElementById('custom-blockquote-styles')) {
      const style = document.createElement('style');
      style.id = 'custom-blockquote-styles';
      style.textContent = `
        custom-blockquote:not([data-initialized="true"]) {
          opacity: 0;
          visibility: hidden;
        }
        custom-blockquote[data-initialized="true"] {
          opacity: 1;
          visibility: visible;
        }
        custom-blockquote .char-wrap {
          display: inline-block;
          opacity: 0;
          transform: translateY(.5em);
          transition: opacity 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        custom-blockquote.animate .char-wrap {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }

    this.charIndex = 0;
    this.wrapTextNodes(this);

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.classList.add('animate');
          this.observer.unobserve(this);
        }
      });
    }, {
      rootMargin: '0px',
      threshold: 0.1
    });

    this.observer.observe(this);
  }

  wrapTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim()) return null;

      const fragment = document.createDocumentFragment();
      const words = text.split(/(\s+)/);

      words.forEach(word => {
        if (word.trim() === '') {
          fragment.appendChild(document.createTextNode(word));
        } else {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          wordSpan.setAttribute('aria-hidden', 'true');

          for (let i = 0; i < word.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.className = 'char-wrap';
            charSpan.textContent = word[i];

            charSpan.style.transitionDelay = (this.charIndex * 0.015) + 's';
            this.charIndex++;
            wordSpan.appendChild(charSpan);
          }
          fragment.appendChild(wordSpan);
        }
      });
      return fragment;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Skip affecting the cite tag entirely
      if (node.tagName.toLowerCase() === 'cite') {
        return null;
      }

      const children = Array.from(node.childNodes);
      for (const child of children) {
        const replacement = this.wrapTextNodes(child);
        if (replacement) {
          node.replaceChild(replacement, child);
        }
      }
    }
    return null;
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

if (!customElements.get('custom-blockquote')) {
  customElements.define('custom-blockquote', CustomBlockquote);
}

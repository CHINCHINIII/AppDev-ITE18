import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonCompactProps {
  url?: string;
  title?: string;
  description?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function ShareButtonCompact({ 
  url = window.location.href, 
  title = 'CarSUcart',
  description = 'Check this out on CarSUcart!',
  onClick
}: ShareButtonCompactProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      // Clipboard API failed, use fallback
    }

    // Fallback method using textarea
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  const handleShare = async (e: React.MouseEvent, platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    e.stopPropagation();
    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(title);

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'copy':
        const success = await copyToClipboard(url);
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
    }
    setIsOpen(false);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    onClick?.(e);
  };

  return (
    <div className="share-compact-container" onMouseLeave={() => setIsOpen(false)}>
      <button
        onClick={handleButtonClick}
        className="share-compact-button"
        aria-label="Share product"
      >
        <Share2 className="share-compact-icon" size={16} />
      </button>
      
      {isOpen && (
        <div className="share-compact-tooltip">
          <div className="share-compact-icons">
            <button
              onClick={(e) => handleShare(e, 'facebook')}
              className="share-compact-social facebook"
              aria-label="Share on Facebook"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            
            <button
              onClick={(e) => handleShare(e, 'twitter')}
              className="share-compact-social twitter"
              aria-label="Share on Twitter"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            
            <button
              onClick={(e) => handleShare(e, 'linkedin')}
              className="share-compact-social linkedin"
              aria-label="Share on LinkedIn"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            
            <button
              onClick={(e) => handleShare(e, 'copy')}
              className="share-compact-social copy-link"
              aria-label="Copy link"
              title={copied ? 'Copied!' : 'Copy link'}
            >
              {copied ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .share-compact-container {
          position: relative;
          display: inline-block;
        }

        .share-compact-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00D084, #00966A);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 4px 12px rgba(0, 208, 132, 0.2);
          position: relative;
          overflow: hidden;
        }

        .share-compact-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
          transform: scale(0);
          transition: transform 0.4s ease-out;
        }

        .share-compact-button:hover::before {
          transform: scale(1);
        }

        .share-compact-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 208, 132, 0.3);
        }

        .share-compact-button:active {
          transform: scale(1.05);
        }

        .share-compact-icon {
          transition: transform 0.3s ease;
        }

        .share-compact-tooltip {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          animation: tooltipSlideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border: 1px solid rgba(0, 208, 132, 0.1);
        }

        .share-compact-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 6px 6px 0 6px;
          border-style: solid;
          border-color: rgba(255, 255, 255, 0.98) transparent transparent transparent;
        }

        @keyframes tooltipSlideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .share-compact-icons {
          display: flex;
          gap: 8px;
        }

        .share-compact-social {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #F8F8F8;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .share-compact-social::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .share-compact-social:hover::before {
          opacity: 1;
        }

        .share-compact-social svg {
          width: 18px;
          height: 18px;
          fill: #333;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          z-index: 1;
        }

        .share-compact-social:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
        }

        .share-compact-social:hover svg {
          transform: scale(1.15);
          fill: white;
        }

        .share-compact-social.twitter:hover {
          background: linear-gradient(135deg, #1da1f2, #1a91da);
        }

        .share-compact-social.facebook:hover {
          background: linear-gradient(135deg, #1877f2, #165ed0);
        }

        .share-compact-social.linkedin:hover {
          background: linear-gradient(135deg, #0077b5, #005e94);
        }

        .share-compact-social.copy-link:hover {
          background: linear-gradient(135deg, #00D084, #00966A);
        }

        @media (max-width: 640px) {
          .share-compact-button {
            width: 32px;
            height: 32px;
          }

          .share-compact-social {
            width: 32px;
            height: 32px;
          }

          .share-compact-social svg {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
}
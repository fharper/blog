let captionVisible = false;

function openLightbox(index) {
  if (typeof photosData === 'undefined') return;

  const photo = photosData[index];
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (!lightbox || !img || !caption) return;

  lightbox.classList.add('active');
  img.src = photo.src;
  img.alt = photo.alt;
  caption.innerHTML = `<strong>${photo.title}</strong><br><em>${photo.date}</em>`;

  document.body.style.overflow = 'hidden';
  captionVisible = false;

  // Update URL with photo filename instead of index
  const filename = photo.src.split('/').pop().split('.')[0];
  const newUrl = window.location.pathname + '#' + filename;
  history.pushState({ photoFilename: filename }, '', newUrl);

  // Toggle caption on image click
  img.addEventListener('click', toggleCaption);

  if (event) event.stopPropagation();
}

function toggleCaption(e) {
  e.stopPropagation();
  const caption = document.getElementById('lightbox-caption');
  if (!caption) return;

  captionVisible = !captionVisible;
  
  if (captionVisible) {
    caption.classList.add('visible');
  } else {
    caption.classList.remove('visible');
  }
}

function closeLightbox(event) {
  if (event && event.target.id !== 'lightbox' && event.target.className !== 'close') {
    return;
  }

  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (!lightbox) return;

  // Remove click listener
  if (img) {
    img.removeEventListener('click', toggleCaption);
  }

  // Reset caption state
  captionVisible = false;
  if (caption) {
    caption.classList.remove('visible');
  }

  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';

  // Remove hash from URL
  history.pushState('', document.title, window.location.pathname + window.location.search);
}

// Open photo from URL hash on page load
function checkUrlHash() {
  const hash = window.location.hash;
  if (hash && hash.length > 1) {
    const filename = hash.substring(1);

    // First check if photo is on current page
    if (typeof photosData !== 'undefined') {
      const index = photosData.findIndex(photo => {
        const photoFilename = photo.src.split('/').pop().split('.')[0];
        return photoFilename === filename;
      });

      if (index !== -1) {
        // Photo is on this page, open it
        openLightbox(index);
        return;
      }
    }

    // Photo not on this page, check if it exists in all photos and redirect
    if (typeof allPhotos !== 'undefined') {
      const globalIndex = allPhotos.findIndex(photo => {
        const photoFilename = photo.src.split('/').pop().split('.')[0];
        return photoFilename === filename;
      });

      if (globalIndex !== -1) {
        // Calculate which page the photo is on
        const pageNumber = Math.floor(globalIndex / 12);

        // Redirect to correct page with hash
        let correctUrl = '/photos/';
        if (pageNumber > 0) {
          correctUrl += (pageNumber + 1) + '/';
        }
        correctUrl += '#' + filename;

        window.location.href = correctUrl;
      }
    }
  }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
  const lightbox = document.getElementById('lightbox');
  if (lightbox && lightbox.classList.contains('active')) {
    closeLightbox({ target: lightbox });
  } else {
    checkUrlHash();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  checkUrlHash();

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('lightbox');
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox({ target: lightbox });
      }
    }
  });
});

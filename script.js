
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Default min date for date inputs (today)
    const todayStr = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('preferredDate');
    const mDateInput = document.getElementById('mDate');
    if (dateInput) dateInput.min = todayStr;
    if (mDateInput) mDateInput.min = todayStr;

    const siteHeader = document.getElementById('siteHeader');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      if (scrollPos > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }

      if (scrollPos > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function toggleMobileDrawer(open) {
      if (open) {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    mobileMenuBtn.addEventListener('click', () => toggleMobileDrawer(true));
    drawerCloseBtn.addEventListener('click', () => toggleMobileDrawer(false));
    drawerOverlay.addEventListener('click', () => toggleMobileDrawer(false));
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileDrawer(false));
    });

    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.slider-dot');
    const heroPrevBtn = document.getElementById('heroPrevBtn');
    const heroNextBtn = document.getElementById('heroNextBtn');
    let currentHeroSlide = 0;
    let heroSliderTimer = null;

    function showHeroSlide(index) {
      heroSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      heroDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentHeroSlide = index;
    }

    function nextHeroSlide() {
      let nextIndex = (currentHeroSlide + 1) % heroSlides.length;
      showHeroSlide(nextIndex);
    }

    function prevHeroSlide() {
      let prevIndex = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
      showHeroSlide(prevIndex);
    }

    function startHeroAutoplay() {
      stopHeroAutoplay();
      heroSliderTimer = setInterval(nextHeroSlide, 6500);
    }

    function stopHeroAutoplay() {
      if (heroSliderTimer) clearInterval(heroSliderTimer);
    }

    heroNextBtn.addEventListener('click', () => {
      nextHeroSlide();
      startHeroAutoplay();
    });

    heroPrevBtn.addEventListener('click', () => {
      prevHeroSlide();
      startHeroAutoplay();
    });

    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showHeroSlide(idx);
        startHeroAutoplay();
      });
    });

    const heroSection = document.getElementById('home');
    heroSection.addEventListener('mouseenter', stopHeroAutoplay);
    heroSection.addEventListener('mouseleave', startHeroAutoplay);
    startHeroAutoplay();

    const statCards = document.querySelectorAll('.stat-num');
    let statsCounted = false;

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statCards.forEach(card => {
            const target = parseFloat(card.getAttribute('data-target'));
            const isDecimal = card.getAttribute('data-decimals') === '1';
            let current = 0;
            const duration = 2000;
            const stepTime = 25;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              if (isDecimal) {
                card.textContent = current.toFixed(1);
              } else {
                card.textContent = Math.floor(current).toLocaleString();
              }
            }, stepTime);
          });
        }
      });
    }, { threshold: 0.3 });

    const aboutSectionEl = document.getElementById('about');
    if (aboutSectionEl) statsObserver.observe(aboutSectionEl);

    const productsTrack = document.getElementById('productsTrack');
    const prodPrevBtn = document.getElementById('prodPrevBtn');
    const prodNextBtn = document.getElementById('prodNextBtn');
    const prodDotsContainer = document.getElementById('prodDotsContainer');
    const productCards = document.querySelectorAll('.product-card');

    let currentProdIndex = 0;
    let maxProdIndex = 0;
    let prodAutoplayTimer = null;

    function calculateMaxProdIndex() {
      const wrapperWidth = productsTrack.parentElement.clientWidth;
      const cardWidth = productCards[0].offsetWidth + 24; // width + gap
      const visibleCount = Math.floor(wrapperWidth / cardWidth) || 1;
      maxProdIndex = Math.max(0, productCards.length - visibleCount);
      renderProdDots();
    }

    function renderProdDots() {
      prodDotsContainer.innerHTML = '';
      const dotCount = maxProdIndex + 1;
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = `p-dot ${i === currentProdIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          goToProdIndex(i);
          startProdAutoplay();
        });
        prodDotsContainer.appendChild(dot);
      }
    }

    function updateProdCarousel() {
      const cardWidth = productCards[0].offsetWidth + 24;
      productsTrack.style.transform = `translateX(-${currentProdIndex * cardWidth}px)`;
      const dots = prodDotsContainer.querySelectorAll('.p-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentProdIndex);
      });
    }

    function goToProdIndex(index) {
      currentProdIndex = Math.max(0, Math.min(index, maxProdIndex));
      updateProdCarousel();
    }

    function nextProdSlide() {
      if (currentProdIndex >= maxProdIndex) {
        currentProdIndex = 0;
      } else {
        currentProdIndex++;
      }
      updateProdCarousel();
    }

    function prevProdSlide() {
      if (currentProdIndex <= 0) {
        currentProdIndex = maxProdIndex;
      } else {
        currentProdIndex--;
      }
      updateProdCarousel();
    }

    function startProdAutoplay() {
      stopProdAutoplay();
      prodAutoplayTimer = setInterval(nextProdSlide, 4500);
    }

    function stopProdAutoplay() {
      if (prodAutoplayTimer) clearInterval(prodAutoplayTimer);
    }

    prodNextBtn.addEventListener('click', () => {
      nextProdSlide();
      startProdAutoplay();
    });

    prodPrevBtn.addEventListener('click', () => {
      prevProdSlide();
      startProdAutoplay();
    });

    productsTrack.parentElement.addEventListener('mouseenter', stopProdAutoplay);
    productsTrack.parentElement.addEventListener('mouseleave', startProdAutoplay);

    window.addEventListener('resize', () => {
      calculateMaxProdIndex();
      goToProdIndex(Math.min(currentProdIndex, maxProdIndex));
    });

    calculateMaxProdIndex();
    startProdAutoplay();

    const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    galleryTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        galleryCards.forEach(card => {
          const cardCat = card.getAttribute('data-cat');
          if (filter === 'all' || cardCat === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    const faqItems = document.querySelectorAll('.faq-accordion-item');

    faqItems.forEach(item => {
      const headerBtn = item.querySelector('.faq-header-btn');
      const bodyContent = item.querySelector('.faq-body-content');

      headerBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other open accordions
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBody = otherItem.querySelector('.faq-body-content');
            if (otherBody) otherBody.style.maxHeight = null;
          }
        });

        // Toggle clicked accordion
        if (isActive) {
          item.classList.remove('active');
          bodyContent.style.maxHeight = null;
        } else {
          item.classList.add('active');
          bodyContent.style.maxHeight = bodyContent.scrollHeight + 30 + 'px';
        }
      });
    });

    function openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    // Service Booking Modal
    function openBookingModal(serviceName) {
      const nameElem = document.getElementById('selectedServiceName');
      if (nameElem) nameElem.textContent = serviceName;
      
      const selectElem = document.getElementById('serviceSelect');
      if (selectElem) {
        for (let i = 0; i < selectElem.options.length; i++) {
          if (selectElem.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || 
              selectElem.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
            selectElem.selectedIndex = i;
            break;
          }
        }
      }
      openModal('bookingModalOverlay');
    }

    // Product Quick View Modal
    let activeInquiryProduct = '';
    function openProductQuickView(title, price, desc, specs) {
      activeInquiryProduct = title;
      document.getElementById('modalProdTitle').textContent = title;
      document.getElementById('modalProdPrice').textContent = price;
      document.getElementById('modalProdDesc').textContent = desc;
      document.getElementById('modalProdSpecs').textContent = specs;
      openModal('productModalOverlay');
    }

    function inquireProduct() {
      closeModal('productModalOverlay');
      openBookingModal(`Parts Inquiry: ${activeInquiryProduct}`);
    }

    // Lightbox modal
    function openLightbox(imgSrc, caption, tag) {
      const imgElem = document.getElementById('lightboxImg');
      const capElem = document.getElementById('lightboxCaption');
      const tagElem = document.getElementById('lightboxTag');

      imgElem.src = imgSrc;
      capElem.textContent = caption;
      tagElem.textContent = tag;
      openModal('lightboxModalOverlay');
    }

    function handleLightboxBackdropClick(e) {
      if (e.target.id === 'lightboxModalOverlay') {
        closeModal('lightboxModalOverlay');
      }
    }

    // Legal modal
    function openLegalModal(type) {
      document.getElementById('legalModalTitle').textContent = type;
      openModal('legalModalOverlay');
    }

    // Close modals on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(modal => {
          modal.classList.remove('open');
        });
        document.body.style.overflow = '';
        toggleMobileDrawer(false);
      }
    });

    function showToast(message, icon = 'fa-circle-check') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      toast.className = 'toast-msg';
      toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-30px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
      }, 4500);
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('clientName').value;
      const car = document.getElementById('carModel').value;
      const service = document.getElementById('serviceSelect').value;

      showToast(`Diagnostic Bay Booked for ${name} (${car})!`, 'fa-circle-check');
      e.target.reset();

      setTimeout(() => {
        showToast('Chandigarh Dispatch will reach out via WhatsApp & Call shortly.', 'fa-headset');
      }, 800);
    }

    function handleModalBookingSubmit(e) {
      e.preventDefault();
      const mName = document.getElementById('mName').value;
      const mCar = document.getElementById('mCar').value;
      closeModal('bookingModalOverlay');

      showToast(`VIP Bay Reservation Confirmed for ${mName}!`, 'fa-circle-check');
      e.target.reset();
    }
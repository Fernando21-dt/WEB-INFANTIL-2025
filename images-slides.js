      // Galería: abrir imagen en modal al hacer clic en miniatura
      document.querySelectorAll('.carousel-thumb img').forEach(img => {
        img.addEventListener('click', function() {
          const modal = document.getElementById('galleryModal');
          const modalImg = document.getElementById('galleryModalImg');
          modalImg.src = this.getAttribute('data-full');
          modal.style.display = 'block';
        });
      });
      // Cerrar modal de galería
      document.getElementById('galleryClose').onclick = function() {
        document.getElementById('galleryModal').style.display = 'none';
        document.getElementById('galleryModalImg').src = '';
      };
      // Cerrar modal al hacer clic fuera de la imagen
      document.getElementById('galleryModal').onclick = function(e) {
        if (e.target === this) {
          this.style.display = 'none';
          document.getElementById('galleryModalImg').src = '';
        }
      };

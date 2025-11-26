// Este script permite descargar un archivo PDF después de que el usuario marque un checkbox
document.addEventListener('DOMContentLoaded', function() {
  const checkbox = document.getElementById('downloadCheckbox');
  checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
      // Espera a que termine la animación (3.9 segundos)
      setTimeout(function() {
        const link = document.createElement('a');
        link.href = 'Educar-es-prevenir.zip'; // Cambia la ruta si tu archivo está en otra carpeta
        link.download = 'Educar-es-prevenir.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Opcional: desmarca el checkbox para poder descargar de nuevo
        setTimeout(() => { checkbox.checked = false; }, 1000);
      }, 3900); // 3.9 segundos (ajusta si tu animación dura más o menos)
    }
  });
});

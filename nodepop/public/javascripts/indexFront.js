// Checkbox formulario: almenos uno marcado
const form = document.querySelector('form');
const validador_cb = document.getElementById('checkbox_validador');

form.addEventListener('submit', e => {
  const cb = document.querySelectorAll('.form__campo__tags input:checked');
  if (cb.length === 0) {
    validador_cb.innerHTML = 'Tienes que marcar al menos una categoría.'
    e.preventDefault();
  }
  

})
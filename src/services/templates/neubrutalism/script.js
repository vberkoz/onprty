document.addEventListener('DOMContentLoaded', () => {
  const ctaButtons = document.querySelectorAll('.cta-button');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      if (button.getAttribute('href') === '#') {
        event.preventDefault();
        alert('This is a demo button!');
      }
    });
  });
});
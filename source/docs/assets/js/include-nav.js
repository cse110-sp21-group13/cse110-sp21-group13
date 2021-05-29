const navFrame = document.getElementById('nav-frame');
navFrame.addEventListener('load', () => {
  navFrame.style.height = navFrame.contentDocument.body.scrollHeight + 'px';
  const ham = navFrame.contentDocument.body.children[0].children[0];
  ham.addEventListener('click', () => {
    if (ham.control.checked) {
      navFrame.style.height = navFrame.contentDocument.body.scrollHeight + 'px';
    } else {
      navFrame.style.height = '100%';
    }
  });
});

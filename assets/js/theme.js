/* Applies a saved theme before first paint (loaded synchronously in <head>). */
(function () {
  var KEY = 'dt-theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (err) { saved = null; }
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  }
  document.documentElement.classList.add('js');
})();

/*
 * Claudio - Assistente de Impressão 3D (Central 3D)
 * Coloca o robozinho de chat no canto da tela.
 * Para trocar o agente, mude apenas o AGENT_ID abaixo.
 */
(function () {
  if (window.__claudioCarregado) return;
  window.__claudioCarregado = true;

  var AGENT_ID = 'agent_6001m865cjjqed68a60vf1jkw51w';
  var WIDGET_SRC = 'https://unpkg.com/@elevenlabs/convai-widget-embed';

  function montar() {
    if (document.querySelector('elevenlabs-convai')) return;

    var claudio = document.createElement('elevenlabs-convai');
    claudio.setAttribute('agent-id', AGENT_ID);
    claudio.setAttribute('avatar-image-url', window.location.origin + '/claudio/claudio-robo.png');
    document.body.appendChild(claudio);

    var script = document.createElement('script');
    script.src = WIDGET_SRC;
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();

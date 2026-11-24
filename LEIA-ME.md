# Claudio – Assistente de Impressão 3D

Robozinho de chat que fica no canto inferior direito da área de membros e tira dúvidas sobre impressão 3D.

## Como instalar (2 passos)

### 1. Suba a pasta `public` para o GitHub
Envie a pasta `public` deste pacote para a **raiz** do repositório (o mesmo lugar onde está o `index.html`).
Ela contém:

```
public/
└── claudio/
    ├── claudio.js         ← código que coloca o robô na tela
    └── claudio-robo.png   ← imagem do Claudio
```

### 2. Adicione 1 linha no `index.html`
Abra o `index.html` na raiz do repositório e cole esta linha logo **antes** de `</body>`:

```html
<script src="/claudio/claudio.js" defer></script>
```

Fica assim:

```html
  <body ...>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
    <script src="/claudio/claudio.js" defer></script>
  </body>
```

Pronto. Na próxima publicação o Claudio aparece no site.

## Para mudar o comportamento do Claudio
Instruções, nome, cores e textos ficam no painel do ElevenLabs (Agents → "Claudio - Central 3D").
Mudanças feitas lá valem na hora, sem precisar subir código de novo.

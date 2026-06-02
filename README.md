# 🐾 Bicho Solto

> *Animais que mentem, fogem e embaralham. Você consegue pegá-los?*

Jogo da memória caótico com 8 pares de animais 3D low-poly. O tabuleiro vira, os bichos fogem, as cartas ficam em branco — tudo isso enquanto o cronômetro corre.

🌐 **[JOGAR](https://bicho-solto.vercel.app/)**

<br>

## 🚀 Funcionalidades

- ✅ 8 animais 3D low-poly renderizados com Three.js
- ✅ Sistema de caos progressivo com 6 tipos de eventos aleatórios
- ✅ Mesa que vira, cartas que somem, bichos que fogem e trocam de lugar
- ✅ Preview inicial das cartas antes do jogo começar
- ✅ HUD responsivo com pares, jogadas, tempo e nível de caos
- ✅ Toasts animados de eventos caóticos em tempo real
- ✅ Compatível com mobile e desktop

<br>

## 🛠️ Tecnologias e Ferramentas

- **React** + **TypeScript** — interface e lógica do jogo
- **Three.js** + **@react-three/fiber** — renderização 3D
- **Tailwind CSS** — estilização utilitária
- **shadcn/ui** — componentes de interface
- **Vite** — bundler e ambiente de desenvolvimento
- **Vercel** — deploy em produção

<br>

## 📁 Estrutura do Projeto

```
src/
├── game/
│   ├── scene/          # Cena 3D (cartas, animais, cenário)
│   │   ├── Card3D.tsx
│   │   ├── CardSymbol3D.tsx
│   │   ├── Forest.tsx
│   │   └── GameScene.tsx
│   ├── ui/             # Interface do jogo
│   │   ├── ChaosFeed.tsx
│   │   ├── HUD.tsx
│   │   ├── MainMenu.tsx
│   │   └── EndScreen.tsx
│   ├── deck.ts         # Operações puras do baralho
│   ├── types.ts        # Tipos e constantes
│   └── useMemoryGame.ts # Hook principal de estado
├── hooks/              # Hooks utilitários
├── pages/              # Página principal
└── components/         # Componentes shadcn/ui
```

<br>

## ⚙️ Como rodar localmente

### Pré-requisitos
- Node.js 20+

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/aamandabraun/bicho-solto.git
cd bicho-solto

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

<br>

## 🎮 Eventos de Caos

| Evento | Descrição |
|--------|-----------|
| 🙃 Mesa virou | O tabuleiro inteiro fica de cabeça pra baixo |
| 🌀 Reembaralhou | As cartas trocam de posição |
| 🏃 Bichos fugiram | Um par some do tabuleiro |
| 👻 Carta vazia | Cartas ficam em branco temporariamente |
| 🔁 Bichos trocaram | Dois animais trocam de carta |
| 🔀 Dedo errado | O próximo clique vai para uma carta aleatória |

<br>

## 🎬 Demonstração

![Demo do projeto](./public/demo.gif)

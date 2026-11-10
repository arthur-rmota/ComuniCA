# 🗣️ ComuniCA

### Comunicação acessível, autonomia e inclusão.

O **ComuniCA** é uma aplicação web responsiva de **Comunicação Aumentativa e Alternativa (CAA)**, desenvolvida para facilitar a expressão de necessidades, sentimentos e desejos de pessoas que enfrentam dificuldades na comunicação oral.

Por meio de cartões visuais, frases rápidas e reprodução de voz, o projeto busca proporcionar uma experiência de comunicação mais simples, intuitiva e acessível.

> **Status:** 🚧 Em desenvolvimento

## 🎯 Objetivo

O ComuniCA tem como objetivo oferecer uma ferramenta de apoio à comunicação, promovendo maior autonomia e participação nas atividades do cotidiano.

A aplicação é pensada para pessoas com necessidades complexas de comunicação, além de familiares, cuidadores e profissionais que acompanham seu desenvolvimento.

O projeto prioriza:

- **Acessibilidade:** interfaces visuais claras e de fácil compreensão.
- **Autonomia:** possibilidade de expressar necessidades e preferências.
- **Personalização:** adaptação das frases e dos elementos visuais.
- **Usabilidade:** navegação simples, com foco em dispositivos móveis.
- **Inclusão:** apoio à interação e à participação social.

## ✨ Funcionalidades

### 🗣️ Frases rápidas

- Visualização de frases essenciais para situações cotidianas.
- Reprodução das frases por voz.
- Criação de frases personalizadas.
- Edição e exclusão de frases criadas pelo usuário.
- Confirmação antes da exclusão.
- Organização visual por ícones e cores.

### ⭐ Favoritos

- Adição e remoção de frases dos favoritos.
- Tela dedicada às frases favoritas.
- Reprodução de voz diretamente pelos cartões favoritos.
- Sincronização dos favoritos com os dados da aplicação.

### 🎨 Personalização

- Biblioteca compartilhada com mais de 50 ícones.
- Pesquisa de ícones por nome.
- Filtros por categoria.
- Seleção de cores para os cartões.
- Interface adaptada para dispositivos móveis.

### 🔊 Reprodução de voz

A aplicação utiliza a **Web Speech API**, permitindo transformar frases escritas em fala por meio dos recursos de síntese de voz disponíveis no navegador.

A disponibilidade e a qualidade das vozes podem variar conforme o navegador e o dispositivo.

## 🛠️ Tecnologias utilizadas

| Tecnologia     | Utilização                          |
| -------------- | ----------------------------------- |
| React          | Construção da interface             |
| TypeScript     | Tipagem estática                    |
| Vite           | Ambiente de desenvolvimento e build |
| Tailwind CSS   | Estilização responsiva              |
| React Router   | Navegação entre páginas             |
| Lucide React   | Biblioteca de ícones                |
| JSON Server    | Simulação de API REST               |
| Web Speech API | Síntese de voz                      |

## 📁 Estrutura do projeto

```text
ComuniCA/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── home/
│   │   ├── layout/
│   │   └── quickPhrases/
│   ├── constants/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── App.tsx
├── db.json
├── package.json
└── README.md
```

A estrutura busca separar as responsabilidades da aplicação:

- **components:** componentes reutilizáveis da interface.
- **constants:** configurações e catálogos compartilhados.
- **pages:** páginas da aplicação.
- **services:** comunicação com a API.
- **types:** interfaces e tipos TypeScript.
- **utils:** funções auxiliares.

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- npm.
- Git.

### 1. Clonar o repositório

```bash
git clone https://github.com/arthur-rmota/ComuniCA.git
```

### 2. Acessar a pasta

```bash
cd ComuniCA
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o servidor de dados

Em um terminal:

```bash
npm run server
```

A API simulada estará disponível em:

```text
http://localhost:3000
```

### 5. Iniciar a aplicação

Em outro terminal:

```bash
npm run dev
```

Acesse:

```text
http://localhost:5173
```

> O servidor de dados e a aplicação precisam estar em execução simultaneamente para utilizar as funcionalidades que dependem da API.

## 🗄️ Armazenamento de dados

Atualmente, o ComuniCA utiliza o **JSON Server** como backend simulado.

Os dados são armazenados no arquivo `db.json`, permitindo desenvolver e testar operações como:

- Consulta de frases e categorias.
- Criação de frases personalizadas.
- Atualização e exclusão de frases.
- Gerenciamento de favoritos.

Essa abordagem é utilizada durante o desenvolvimento e não representa a arquitetura definitiva de produção.

## 📱 Interface

O ComuniCA segue uma abordagem **mobile-first**, priorizando a experiência em smartphones.

A interface utiliza cartões coloridos, ícones representativos, botões de interação e navegação simplificada.

A proposta é reduzir barreiras de uso e facilitar a identificação de opções de comunicação.

## 🗺️ Próximas etapas

O projeto continuará evoluindo. Entre as melhorias planejadas estão:

- [ ] Aprimorar a acessibilidade e a navegação por teclado.
- [ ] Proteger alterações não salvas nos formulários.
- [ ] Expandir a personalização dos cartões.
- [ ] Evoluir as funcionalidades das demais telas.
- [ ] Implementar autenticação e gerenciamento de usuários.
- [ ] Substituir o backend simulado por uma API persistente.
- [ ] Integrar um banco de dados relacional.
- [ ] Realizar testes de usabilidade e acessibilidade.

As funcionalidades planejadas poderão ser ajustadas conforme a evolução do projeto.

## ♿ Acessibilidade

A acessibilidade é um dos princípios centrais do ComuniCA.

O desenvolvimento busca incorporar boas práticas como:

- Elementos visuais acompanhados de texto.
- Identificação acessível de botões e controles.
- Feedback visual durante interações.
- Áreas de toque adequadas para dispositivos móveis.
- Organização consistente das interfaces.
- Reprodução de mensagens por voz.

O projeto ainda está em evolução e não possui, neste momento, uma certificação de conformidade com padrões de acessibilidade.

## 🤝 Contribuições

Sugestões, relatos de problemas e propostas de melhoria são bem-vindos.

Para contribuir, você pode abrir uma *issue* no repositório ou propor alterações por meio de um *pull request*.

## 📌 Sobre o projeto

O **ComuniCA** é um projeto de software em desenvolvimento, com foco na aplicação de tecnologias web para apoiar a comunicação acessível.

A proposta é unir desenvolvimento de software, experiência do usuário e inclusão digital em uma ferramenta que possa evoluir de acordo com necessidades reais de comunicação.

---

**ComuniCA — Toda pessoa merece ser ouvida.** 💙

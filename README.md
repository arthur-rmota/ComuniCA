# 🗣️ ComuniCA

### Comunicação acessível, autonomia e inclusão.

O **ComuniCA** é uma aplicação web de **Comunicação Aumentativa e Alternativa (CAA)**, desenvolvida para facilitar a expressão de necessidades, sentimentos e desejos de pessoas com dificuldades na comunicação oral.

Por meio de pictogramas, cartões visuais, frases rápidas e reprodução de voz, o aplicativo busca proporcionar uma experiência de comunicação simples, intuitiva, acessível e personalizável.

## 🌐 Conheça o ComuniCA

- **🖥️ Landing page:** [Conheça o projeto](https://arthur-rmota.github.io/ComuniCA-landing-page/)
- **🔗 Aplicação web:** [Acessar o ComuniCA](https://comunica-28g.pages.dev/)

> 🚧 **Status:** projeto em desenvolvimento, sujeito a atualizações e melhorias.

## 🎯 Objetivo

Promover maior autonomia na comunicação e nas atividades cotidianas de pessoas com necessidades complexas de comunicação, especialmente crianças com dificuldades na fala.

O projeto também busca auxiliar familiares, cuidadores e profissionais, priorizando:

- **Acessibilidade:** interfaces visuais claras e intuitivas.
- **Autonomia:** expressão de necessidades, sentimentos e preferências.
- **Personalização:** adaptação dos recursos de comunicação.
- **Usabilidade:** experiência simplificada em dispositivos móveis.
- **Inclusão:** apoio à comunicação e à participação social.

## ✨ Funcionalidades

### 🧩 Categorias e cartões

- Organização de cartões de comunicação por categorias.
- Reprodução de voz ao selecionar um cartão.
- Cadastro, edição e exclusão de categorias e cartões.
- Personalização de pictogramas, cores e textos.

### 💬 Construtor de mensagens

- Construção de frases utilizando palavras e pictogramas.
- Sugestão de palavras e regras de composição gramatical.
- Remoção e reorganização de palavras por arrastar e soltar.
- Reprodução de mensagens completas por voz.
- Utilização de cartões personalizados.

### 🗣️ Frases rápidas

- Acesso rápido a mensagens de uso cotidiano.
- Frases essenciais predefinidas.
- Cadastro, edição e exclusão de frases personalizadas.
- Identificação das frases mais utilizadas.

### 📅 Rotina e agenda

- Organização visual das atividades cotidianas.
- Divisão das atividades por seções e períodos do dia.
- Cadastro e personalização de seções e atividades.
- Associação de cartões e frases às atividades.

### 🚨 Comunicação de emergência

- Acesso rápido a mensagens de ajuda e desconforto.
- Reprodução de mensagens por voz.
- Gerenciamento de frases de emergência personalizadas.

### 🕒 Histórico de mensagens

- Registro das mensagens reproduzidas.
- Consulta e reprodução de mensagens anteriores.
- Identificação das mensagens mais utilizadas.
- Exclusão do histórico mediante confirmação.

### 👤 Perfil e segurança

- Configuração e edição do perfil.
- Proteção das funcionalidades de gerenciamento por PIN.
- Recuperação de PIN.

## 🎨 Pictogramas

O ComuniCA possui uma biblioteca de **188 pictogramas ilustrados**, com identidade visual consistente, cores suaves e fundo transparente.

As imagens representam pessoas, ações, objetos, alimentos, sentimentos, necessidades, atividades e expressões sociais.

A aplicação utiliza um manifesto centralizado e um componente reutilizável para padronizar a exibição dos pictogramas, além de permitir sua pesquisa e seleção durante a personalização.

Os ícones funcionais de navegação e gerenciamento utilizam o Lucide React.

## 🛠️ Tecnologias utilizadas

| Tecnologia       | Utilização                   |
| ---------------- | ---------------------------- |
| React            | Construção da interface      |
| TypeScript       | Tipagem estática             |
| Vite             | Desenvolvimento e build      |
| Tailwind CSS     | Estilização responsiva       |
| React Router     | Navegação entre páginas      |
| Lucide React     | Ícones funcionais            |
| Dnd Kit          | Reorganização de elementos   |
| Dexie.js         | Gerenciamento do banco local |
| IndexedDB        | Persistência de dados        |
| Web Speech API   | Reprodução de voz            |
| Cloudflare Pages | Hospedagem                   |

## 🗄️ Armazenamento de dados

O ComuniCA utiliza **IndexedDB**, com auxílio do **Dexie.js**, para armazenar perfis, categorias, cartões, frases, atividades e histórico diretamente no navegador.

A aplicação adota uma abordagem **local-first**, sem depender de um servidor de banco de dados para suas principais funcionalidades.

Os dados não são automaticamente sincronizados entre dispositivos. O armazenamento local também não garante o funcionamento integral da aplicação sem internet.

> **Atenção:** limpar os dados do navegador pode resultar na perda das personalizações armazenadas.

## 📁 Estrutura do projeto

```text
ComuniCA/
├── public/
│   └── aac-icons/
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── contexts/
│   ├── database/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js compatível com a versão do Vite utilizada.
- npm.
- Git.

### Instalação e execução

```bash
git clone https://github.com/arthur-rmota/ComuniCA.git
cd ComuniCA
npm install
npm run dev
```

Acesse o endereço informado pelo Vite, normalmente `http://localhost:5173`.

### Comandos disponíveis

| Comando            | Descrição                            |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Inicia o ambiente de desenvolvimento |
| `npm run build`    | Gera a versão de produção            |
| `npm run lint`     | Executa a análise estática do código |
| `npm run preview`  | Visualiza a versão de produção       |
| `npx tsc --noEmit` | Verifica a tipagem TypeScript        |

## 📱 Experiência mobile e acessibilidade

O ComuniCA adota uma abordagem **mobile-first**, priorizando interações por toque, cartões visuais, navegação simplificada e controles intuitivos.

O desenvolvimento busca incorporar boas práticas de acessibilidade, como identificação de controles, indicadores de foco, associação de imagens a textos e reprodução de mensagens por voz.

A disponibilidade das vozes depende do navegador e do dispositivo utilizado.

O projeto ainda está em evolução e não possui certificação formal de conformidade com padrões de acessibilidade.

## 🗺️ Roadmap

- [ ] Ampliação contínua do vocabulário e dos pictogramas.
- [ ] Aprimoramento do construtor de mensagens.
- [ ] Evolução dos recursos de rotina e agenda.
- [ ] Aprimoramento da acessibilidade e da experiência mobile.
- [ ] Revisão da segurança e recuperação de PIN.
- [ ] Refatoração e organização do código.
- [ ] Implementação de testes automatizados.
- [ ] Testes de usabilidade com usuários.
- [ ] Exportação e backup dos dados.
- [ ] Implementação de recursos PWA e funcionamento offline.

## 🤝 Contribuições

Sugestões, relatos de problemas e propostas de melhoria são bem-vindos por meio de issues e pull requests.

## 👨‍💻 Desenvolvimento

**Arthur Mota**
**Filipe Hannisch**
**Paulo César**
**Rebeca Alencar**
**Rebeca Macedo**
**Vitória Merlino**

- **Aplicação:** [ComuniCA](https://comunica-28g.pages.dev/)
- **GitHub:** [arthur-rmota](https://github.com/arthur-rmota)
- **Repositório:** [ComuniCA](https://github.com/arthur-rmota/ComuniCA)

---

**ComuniCA — Toda pessoa merece ser ouvida.** 🧡

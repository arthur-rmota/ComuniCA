# 🗣️ ComuniCA

### Comunicação acessível, autonomia e inclusão.

O **ComuniCA** é uma aplicação web de **Comunicação Aumentativa e Alternativa (CAA)**, desenvolvida para facilitar a expressão de necessidades, sentimentos e desejos de pessoas com dificuldades na comunicação oral.

Por meio de cartões visuais, símbolos, frases rápidas e reprodução de voz, o aplicativo busca proporcionar uma experiência de comunicação simples, intuitiva, acessível e personalizável.

## 🌐 Acesse o ComuniCA

O ComuniCA está disponível online e pode ser acessado diretamente pelo navegador, tanto no computador quanto no celular.

**🔗 Aplicação publicada:** [Acessar o ComuniCA](https://comunica-28g.pages.dev/)

> 🚧 **Status:** A aplicação está em desenvolvimento e pode receber atualizações e melhorias.

## 🎯 Objetivo

O ComuniCA tem como objetivo apoiar a comunicação e promover maior autonomia nas atividades cotidianas.

A aplicação é voltada a pessoas com necessidades complexas de comunicação, familiares, cuidadores e profissionais que acompanham seu desenvolvimento.

O projeto prioriza:

- **Acessibilidade:** interfaces visuais claras e controles intuitivos.
- **Autonomia:** expressão de necessidades, sentimentos e preferências.
- **Personalização:** adaptação de categorias, cartões e frases.
- **Usabilidade:** navegação simples, especialmente em dispositivos móveis.
- **Inclusão:** apoio à comunicação e à participação social.

## ✨ Funcionalidades

### 🏠 Página inicial

- Visualização de categorias de comunicação.
- Categorias identificadas por cores, ícones e nomes.
- Navegação por meio de cartões totalmente clicáveis.
- Acesso aos símbolos e palavras associados a cada categoria.

### 🧩 Categorias e cartões de comunicação

- Visualização de cartões organizados por categoria.
- Reprodução de voz ao selecionar um cartão.
- Cadastro, edição e exclusão de categorias.
- Cadastro, edição e exclusão de cartões.
- Associação de cartões às categorias.
- Seleção de ícones para representar palavras e expressões.
- Gerenciamento protegido por PIN, quando configurado.

### 🗣️ Frases rápidas

- Acesso rápido a frases de uso cotidiano.
- Reprodução das frases por voz.
- Frases predefinidas essenciais.
- Cadastro de frases personalizadas.
- Edição e exclusão de frases personalizadas.
- Seleção de ícones e cores.
- Confirmação antes da exclusão.

As frases essenciais predefinidas são:

- Sim
- Não
- Obrigado
- Banheiro

As demais frases podem ser personalizadas de acordo com as necessidades do usuário.

### ⭐ Favoritos

- Adição e remoção de frases rápidas dos favoritos.
- Página dedicada às frases favoritas.
- Reprodução de voz diretamente pelos cartões favoritos.
- Armazenamento local dos favoritos.

### 👤 Perfil e segurança

- Configuração e edição do perfil.
- Definição de PIN de acesso.
- Verificação de PIN para funcionalidades de gerenciamento.
- Recuperação de PIN conforme os recursos implementados.
- Personalização de elementos utilizados na comunicação.

### 🎨 Personalização

- Biblioteca ampliada de ícones.
- Pesquisa de ícones por nome.
- Filtros de ícones por categoria.
- Seleção de cores para frases rápidas e categorias.
- Criação e organização de cartões de comunicação.
- Interface responsiva com foco em dispositivos móveis.

### 🔊 Reprodução de voz

O ComuniCA utiliza a **Web Speech API** para transformar textos em fala.

A disponibilidade e a qualidade das vozes dependem do navegador e do dispositivo utilizado.

## 🛠️ Tecnologias utilizadas

| Tecnologia     | Utilização                            |
| -------------- | ------------------------------------- |
| React          | Construção da interface               |
| TypeScript     | Tipagem estática                      |
| Vite           | Desenvolvimento e build               |
| Tailwind CSS   | Estilização responsiva                |
| React Router   | Navegação entre páginas               |
| Lucide React   | Biblioteca de ícones                  |
| Dexie.js       | Gerenciamento do banco local          |
| IndexedDB      | Persistência dos dados no dispositivo |
| Web Speech API | Reprodução de voz                     |

## 🗄️ Armazenamento de dados

O ComuniCA utiliza **IndexedDB**, com auxílio da biblioteca **Dexie.js**, para armazenar os dados diretamente no navegador.

Entre os dados armazenados estão:

- Perfis.
- Categorias.
- Cartões de comunicação.
- Frases rápidas personalizadas.
- Frases favoritas.
- Informações de inicialização e migração dos dados.

A aplicação segue uma abordagem **offline-first** para os dados de comunicação armazenados localmente.

Os dados não são automaticamente sincronizados entre diferentes navegadores ou dispositivos.

> **Atenção:** limpar os dados do site ou utilizar outro navegador pode resultar na perda das personalizações armazenadas localmente.

## 📁 Estrutura do projeto

```text
ComuniCA/
├── public/
├── src/
│   ├── components/
│   │   ├── cards/
│   │   ├── common/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── profile/
│   │   └── quickPhrases/
│   ├── constants/
│   ├── contexts/
│   ├── database/
│   │   ├── seeds/
│   │   ├── db.ts
│   │   └── seed.ts
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

A estrutura foi organizada para separar as responsabilidades:

- **components:** componentes reutilizáveis da interface.
- **constants:** bibliotecas e configurações compartilhadas.
- **contexts:** compartilhamento de estados entre componentes.
- **database:** banco de dados local e dados iniciais.
- **hooks:** lógica reutilizável do React.
- **pages:** páginas do aplicativo.
- **services:** operações de acesso e manipulação dos dados.
- **types:** interfaces e tipos TypeScript.
- **utils:** funções auxiliares.

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js compatível com a versão do Vite utilizada.
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

### 4. Iniciar o ambiente de desenvolvimento

```bash
npm run dev
```

Abra no navegador o endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

Não é necessário iniciar o JSON Server para utilizar o armazenamento local da aplicação.

### 5. Validar o projeto

```bash
npm run build
npm run lint
```

### 6. Visualizar a versão de produção localmente

```bash
npm run preview
```

## 📱 Experiência mobile

O ComuniCA adota uma abordagem **mobile-first**, sendo projetado prioritariamente para smartphones.

A interface foi desenvolvida considerando interações por toque, cartões visuais, navegação simplificada e acessibilidade em telas menores.

Embora o aplicativo também possa ser acessado em computadores, **a utilização em desktop não é recomendada como experiência principal**, pois o design e as interações foram otimizados para dispositivos móveis.

## ♿ Acessibilidade

A acessibilidade é um dos princípios centrais do ComuniCA.

O desenvolvimento busca incorporar boas práticas como:

- Associação de elementos visuais a textos.
- Identificação acessível de botões e controles.
- Organização visual consistente.
- Feedback durante as interações.
- Reprodução de mensagens por voz.
- Interfaces adaptadas ao uso por toque.

O projeto ainda está em evolução e não possui certificação formal de conformidade com padrões de acessibilidade.

## 🗺️ Próximas etapas

Entre as funcionalidades e melhorias planejadas estão:

- [ ] Construção de mensagens com múltiplos símbolos e palavras.
- [ ] Remoção e reorganização dos elementos de uma mensagem.
- [ ] Reprodução de mensagens completas.
- [ ] Ampliação dos recursos de personalização e acessibilidade.
- [ ] Aprimoramento da navegação e da experiência mobile.
- [ ] Testes de usabilidade com usuários.
- [ ] Evolução das funcionalidades de rotina e agenda.
- [ ] Avaliação de estratégias de exportação e backup dos dados.

As próximas etapas podem ser ajustadas conforme os requisitos e a evolução do projeto.

## 🤝 Contribuições

Sugestões, relatos de problemas e propostas de melhoria são bem-vindos.

Você pode contribuir por meio de:

- Abertura de issues.
- Sugestões de melhorias de acessibilidade.
- Relatos de problemas.
- Pull requests.

## 👨‍💻 Desenvolvimento

**Arthur Mota**

- **Aplicação:** https://comunica-28g.pages.dev/
- **GitHub:** https://github.com/arthur-rmota
- **Repositório:** https://github.com/arthur-rmota/ComuniCA

## 📌 Sobre o projeto

O ComuniCA é um projeto de software em desenvolvimento que busca utilizar tecnologias web para apoiar a comunicação acessível.

A proposta é unir desenvolvimento de software, experiência do usuário e inclusão digital em uma ferramenta flexível, capaz de evoluir conforme as necessidades reais de comunicação.

---

**ComuniCA — Toda pessoa merece ser ouvida.** 🧡

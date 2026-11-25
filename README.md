# Portfólio — L. H. Lobato

Página estática de portfólio desenvolvida com **React**, **TypeScript** e **Vite** para divulgação de experiências, projetos pessoais/acadêmicos e artigos científicos.

## Funcionalidades

- **Sobre Mim & Redes Sociais**: Apresentação pessoal com foto de perfil (`/assets/perfil.jpg`) e links diretos para GitHub (`@LHLobato`), LinkedIn (`/in/lhs-lobato`) e Instagram (`@lhslobato`).
- **Experiências**: Histórico de atuação técnica e pesquisa acadêmica.
- **Projetos**: Cards com descrição, tecnologias utilizadas e redirecionamento para o projeto em deploy e código-fonte.
- **Artigos Científicos**: Lista estruturada com o título do artigo, evento de publicação e ano.
- **Modo Claro e Noturno**: Alternância de tema com persistência em `localStorage` e detecção automática da preferência do sistema.
- **Easter Eggs (*Doctor Who* & *Resident Evil*)**:
  - **Resident Evil**: Monitor de vitalidade ECG (`FINE` / `CAUTION` / `DANGER`) no topo da página, contador de *Ink Ribbons* (*Save Room*) no rodapé e atalho secreto digitando `stars` ou `herb` no teclado.
  - **Doctor Who**: Paleta com *TARDIS Blue*, botão *Police Public Call Box* com efeito de materialização da TARDIS e atalho secreto digitando `tardis` no teclado.

## Como testar localmente

Execute o script `run_local.sh` na raiz do repositório:

```bash
./run_local.sh
```

O script garante que a imagem em `/assets/perfil.jpg` esteja disponível, instala as dependências (caso `node_modules` ainda não exista) e inicia o servidor local do Vite.

## Como atualizar Projetos e Artigos Científicos

Edite o arquivo [`src/data/portfolioData.ts`](./src/data/portfolioData.ts):

- `PROJECTS`: Atualize os títulos, descrições, tags e `deployUrl` dos seus projetos.
- `SCIENTIFIC_ARTICLES`: Atualize o `title` (título do artigo) e `event` (evento onde foi publicado).

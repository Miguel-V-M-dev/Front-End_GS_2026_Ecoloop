# Ecoloop | Desperdício Zero

**GLOBAL SOLUTION 2026/2 - CitizenTech**
**Disciplina:** Front-End Design Engineering
**Projeto:** Ecoloop | Desperdício Zero
**Grupo:** Ecoloop

| RM | Nome completo | Turma |
| --- | --- | --- |
| 571978 | Miguel Vieira Martins | 1-TDSPI |
| 572722 | Gustavo Neri Andrade | 1-TDSPI |
| 572942 | Thiago Vendrami Luca | 1-TDSPI |
| 571250 | Carlos Americo Machado Brambilla | 1-TDSPI |
| 573959 | Murilo da Silva Lourenço | 1-TDSPI |

---

## Sobre o projeto

Front-end da **Global Solution 2026/2 (CitizenTech), ideia 04**: reduzir o desperdício de **água, energia e alimentos** em casas, comunidades e pequenos negócios.

O usuário cadastra locais, registra cada desperdício (recurso, quantidade, causa e data), compara o total do mês com uma meta mensal em réguas simples, vê o custo e o CO₂ estimados e recebe dicas de redução.

## Links

| Item | Link |
| --- | --- |
| Deploy (Vercel) | <https://front-end-gs-2026-ecoloop.vercel.app> |
| Repositório (GitHub) | <https://github.com/Miguel-V-M-dev/Front-End_GS_2026_Ecoloop> |
| API Java (Render) | <https://api-java-global-solution-fiap.onrender.com> |
| Vídeo de apresentação (até 3 min) | _(preencher)_ |

## Tecnologias

- React 19, Vite e TypeScript
- Tailwind CSS 4 (sem biblioteca de gráfico: as réguas são feitas só com Tailwind)
- React Router (`createBrowserRouter`, `Outlet`, `useParams`)
- React Hook Form + Yup (`@hookform/resolvers`) nos formulários
- Context API (`useContext`) para os dados de referência
- React Icons
- Integração com a API Java (Spring Boot) publicada no Render, via `fetch` (sem Axios)
- Vercel para o deploy (`vercel.json` reescreve as rotas para a SPA)

> `@hookform/resolvers` está **fixado em 5.2.2** de propósito. A partir da 5.8 ele declara `ajv` como dependência de pares opcional, o que conflita com o `ajv` do ESLint e faz o `npm ci` falhar. Não atualize essa versão sem testar o `npm ci`.

## Páginas e rotas

| Rota | Página | O que faz |
| --- | --- | --- |
| `/` | Início | Apresentação, exemplo ao vivo com dados da API, recursos e passos |
| `/locais` | **Locais** | Lista (GET) com busca e filtro por tipo, e janela (modal) de cadastro (POST) |
| `/locais/:id` | **Painel do local** | Rota com parâmetro: conta do mês com réguas contra a meta, custo e CO₂, registros (editar PUT, excluir DELETE), metas (POST, PUT, DELETE), causas mais frequentes e dicas |
| `/registrar` | **Registrar desperdício** | Formulário (POST) com local, recurso, causa, quantidade, data e observação |
| `/sobre` | Sobre | Problema, solução, cálculos e ODS (6, 7, 11 e 12) |
| `/integrantes` | Integrantes | Equipe |
| `/faq` | FAQ | Perguntas frequentes |
| `/contato` | Contato | Formulário de contato (POST `/contatos`) com validação |
| `*` | 404 | Página não encontrada |

## O que o projeto cobre

- **GET, POST, PUT e DELETE** de local, registro e meta.
- **Rota com parâmetro** (`/locais/:id`) e estado "não encontrado" quando a API devolve 404.
- **Formulários com validação** (Yup): campos obrigatórios, quantidade maior que 0 com até 2 casas decimais, data não futura, causa que pertença ao recurso, limites iguais aos das colunas do banco.
- **Retorno da API ao usuário**: avisos de sucesso, janelas de confirmação e mensagens de erro (400, 404, 409 e falha de conexão) vindas da API.
- **Estados de tela**: carregando, erro e lista vazia.
- **Nomes do domínio** (Local, Registro, Meta, Recurso, Causa, Dica), sem CRUD genérico.
- **Acessibilidade e responsividade**: menu móvel, foco visível, `role="progressbar"` nas réguas, rótulos e mensagens ligados aos campos, janelas que fecham com Esc. Testado em 390×844, 768×1024 e 1440×900.

## Banco de dados e front

Os dados vêm da API Java, que lê o banco Oracle criado a partir do script SQL do grupo (7 tabelas). Cada tabela aparece no front assim:

| Tabela | Rota da API | Onde aparece no front |
| --- | --- | --- |
| `tb_local` | `/locais` | `/locais`, painel, seletor em `/registrar` |
| `tb_recurso` | `/recursos` | unidades, custo e CO₂ em toda a conta do mês |
| `tb_causa` | `/causas` | select de causa (filtrado pelo recurso), causas mais frequentes |
| `tb_dica` | `/dicas?recurso=` | dicas do painel |
| `tb_registro` | `/locais/{id}/registros` | `/registrar`, histórico e totais do painel |
| `tb_meta` | `/locais/{id}/metas` | réguas do painel (associativa N:N local x recurso) |
| `tb_contato` | `/contatos` | página `/contato` |

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org) **22.22 ou superior** (exigência do React Router 8). Confira com `node -v`.

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/Miguel-V-M-dev/Front-End_GS_2026_Ecoloop.git
cd Front-End_GS_2026_Ecoloop

# 2. Instale as dependências
npm install

# 3. Rode em modo desenvolvimento
npm run dev        # http://localhost:5173
```

Sem nenhuma configuração o front fala com a **API Java publicada**: <https://api-java-global-solution-fiap.onrender.com>.

- No plano gratuito do Render a API "dorme" sem uso. A **primeira chamada pode levar cerca de um minuto**; o front avisa na tela enquanto espera.
- A API só aceita requisições dos domínios listados em `APP_CORS_ORIGENS` (no Render). Para rodar em `http://localhost:5173` e na Vercel, os dois precisam estar nessa lista, sem `/` no final.
- Para usar outra API (por exemplo, uma rodando em `http://localhost:8080`), crie um arquivo `.env` na raiz com:

  ```
  VITE_API_URL=http://localhost:8080
  ```

  Na Vercel, configure a mesma variável em **Settings → Environment Variables**.

### Outros comandos

```bash
npm run build     # verifica os tipos e gera a pasta dist/
npm run lint      # roda o ESLint
npm run preview   # serve a versão de produção localmente
```

## Camada de API

Toda chamada à API passa por dois arquivos, e nenhuma página chama `fetch` diretamente:

- `src/services/api.ts`: cliente HTTP, mensagens de erro da API e conversão de ids (a API devolve números, o front usa texto).
- `src/services/ecoloopService.ts`: uma função por operação, com a rota da API em comentário.

As regras de negócio (meta duplicada 409, excluir local com registros 409, datas e quantidades, causa do recurso) são da API: o front só mostra a mensagem que ela devolve.

| Recurso | Endpoints |
| --- | --- |
| Locais | `GET /locais`, `GET /locais/{id}`, `POST /locais`, `PUT /locais/{id}`, `DELETE /locais/{id}` |
| Registros | `GET` e `POST /locais/{id}/registros`, `PUT` e `DELETE /registros/{id}` |
| Metas | `GET` e `POST /locais/{id}/metas`, `PUT` e `DELETE /metas/{id}` |
| Referência | `GET /recursos`, `GET /causas`, `GET /dicas?recurso={id}` |
| Contato | `POST /contatos` |

## Estrutura de pastas

```
src/
├── assets/img/            fotos da equipe
├── components/
│   ├── contato/           FormContato
│   ├── layout/            Header e Footer
│   ├── locais/            LocalCard, FormLocal, ContaDoMes
│   ├── registros/         FormRegistro, ListaRegistros
│   ├── metas/             FormMeta
│   └── ui/                Button, Card, Modal, Regua, Campos, Aviso...
├── context/               ReferenciaProvider (recursos, causas e dicas)
├── data/                  rótulos, ícones, FAQ, contato e equipe
├── hooks/                 useApi
├── pages/                 uma página por rota
├── services/              api e ecoloopService (chamadas à API Java)
├── types/                 interfaces TypeScript (contrato JSON)
├── utils/                 formatação, cálculos, ordenação e estilos dos campos
├── App.tsx                layout com Outlet
├── routes.tsx             mapa de rotas
└── main.tsx
```

## Como o painel calcula

- **Total do mês** de um recurso: soma das quantidades dos registros daquele mês.
- **Meta mensal** é um teto. Acima de 100% a meta estourou; a partir de 80% o painel mostra "Perto do limite".
- **Custo** = total x `custoUnitario` do recurso. **CO₂** = total x `fatorCo2` do recurso. Os valores de referência são didáticos, não tarifas reais.
- **Alimento por pessoa** = kg de alimento do mês divididos por `qtPessoas`.
- **Dicas**: dos recursos em que o local já registrou desperdício, da maior para a menor economia estimada.
- O mês exibido é o atual; se ele não tem registros, o painel abre no mês do registro mais recente.

## Roteiro do vídeo

1. **Início**: o exemplo ao vivo mostra a Padaria Pão Quente com a meta de alimento estourada.
2. **Locais**: busque "pao", filtre por Negócios e cadastre um local novo (mostre as mensagens de validação antes).
3. **Painel** do novo local: sem registros, com dicas gerais. Abra a Padaria: réguas, custo, CO₂ e troca de mês.
4. **Registrar**: tente quantidade 0 e data futura, depois salve um registro e abra o painel.
5. **Painel**: edite e exclua um registro, ajuste uma meta.
6. **Regras da API**: tente excluir um local com registros (409) e exclua o "Casa do João e Lúcia", que não tem.
7. **Sobre**, **FAQ** e **Integrantes**.

## Fluxo de trabalho (Git Flow)

- `main`: versão entregue e publicada (recebe só por Pull Request ou release, com tag).
- `develop`: integração das funcionalidades.
- `feature/*`: uma branch por funcionalidade, sempre a partir da `develop`.
- Os commits seguem o padrão `feat:`, `fix:`, `docs:`, `chore:` e `refactor:`.

Features do projeto: `setup-projeto`, `tipos-e-utilitarios`, `componentes-ui`, `layout-e-rotas`, `paginas-institucionais`, `integracao-api`, `pagina-locais`, `pagina-registrar`, `painel-do-local`, `home-e-contato`, `responsividade-acessibilidade` e `deploy-e-documentacao`.

```bash
git flow init -d
git flow feature start nome-da-tarefa
git add . && git commit -m "feat: descreve o que foi feito"
git flow feature finish nome-da-tarefa
git push origin develop
```

## Uso de IA generativa

Em conformidade com as regras da Global Solution 2026/2, declaramos o uso de IA generativa neste projeto.

| Ferramenta | Para que foi usada |
| --- | --- |
| Claude (Anthropic) | Apoio na estruturação do projeto React + Vite + TypeScript, na revisão de código e de textos, na explicação de erros, na organização do Git Flow e na conferência dos requisitos da entrega |

- Todo o código e todo o texto gerados com apoio de IA foram lidos, testados e revisados pelo grupo, que entende e consegue explicar o que foi entregue.
- As decisões do projeto (tema, telas, regras de negócio e integração com a API Java) foram tomadas pela equipe.

## Equipe Ecoloop

| Foto | Nome | RM | Turma | GitHub | LinkedIn |
| --- | --- | --- | --- | --- | --- |
| <img src="src/assets/img/Miguel.jpeg" width="64" height="64" alt="Foto de Miguel"> | Miguel Vieira Martins | 571978 | 1-TDSPI | [Miguel-V-M-dev](https://github.com/Miguel-V-M-dev) | [perfil](https://www.linkedin.com/in/miguel-vieira-martins-598964406) |
| <img src="src/assets/img/Gustavo.jpeg" width="64" height="64" alt="Foto de Gustavo"> | Gustavo Neri Andrade | 572722 | 1-TDSPI | [GustavoNeriAndrade](https://github.com/GustavoNeriAndrade) | [perfil](https://www.linkedin.com/in/gustavo-neri-andrade-163795337) |
| <img src="src/assets/img/Thiago.jpeg" width="64" height="64" alt="Foto de Thiago"> | Thiago Vendrami Luca | 572942 | 1-TDSPI | [Thiagovluca](https://github.com/Thiagovluca) | [perfil](https://br.linkedin.com/in/thiago-vendrami-luca-4892a6409) |
| <img src="src/assets/img/Carlos.jpeg" width="64" height="64" alt="Foto de Carlos"> | Carlos Americo Machado Brambilla | 571250 | 1-TDSPI | [CarlosAmericoMachado](https://github.com/CarlosAmericoMachado) | [perfil](https://www.linkedin.com/in/carlos-brambilla-b5b971407) |
| <img src="src/assets/img/Murilo.jpeg" width="64" height="64" alt="Foto de Murilo"> | Murilo da Silva Lourenço | 573959 | 1-TDSPI | [murilojosh](https://github.com/murilojosh) | [perfil](https://www.linkedin.com/in/murilo-lourenço-35250b411) |

---

<p align="center">© Ecoloop | Desperdício Zero, Global Solution 2026/2, FIAP</p>
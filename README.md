# Ecoloop | Desperdício Zero

Front-end da **Global Solution 2026/2 (CitizenTech), ideia 04**: reduzir o desperdício de água, energia e alimentos em casas, comunidades e pequenos negócios.

O usuário cadastra locais, registra cada desperdício (recurso, quantidade, causa e data), compara o total do mês com uma meta mensal em réguas simples, vê o custo e o CO₂ estimados e recebe dicas de redução.

## Links

| Item | Link |
| --- | --- |
| Deploy (Vercel) | _(preencher)_ |
| Repositório | _(preencher)_ |
| API Java (Render) | <https://api-java-global-solution-fiap.onrender.com> |
| Vídeo de apresentação | _(preencher)_ |

## Tecnologias

- React 19, Vite e TypeScript
- Tailwind CSS 4 (sem biblioteca de gráfico: as réguas são feitas só com Tailwind)
- React Router (`createBrowserRouter`, `Outlet`, `useParams`)
- React Hook Form + Yup (`@hookform/resolvers`) nos formulários
- Context API (`useContext`) para os dados de referência
- Integração com a API Java (Spring Boot) publicada no Render, via `fetch`

> `@hookform/resolvers` está **fixado em 5.2.2** de propósito. A partir da 5.8 ele declara `ajv` como dependência de pares opcional, o que conflita com o `ajv` do ESLint e faz o `npm ci` falhar. Não atualize essa versão sem testar o `npm ci`.

## Páginas e rotas

| Rota | Página | O que faz |
| --- | --- | --- |
| `/` | Início | Apresentação, exemplo ao vivo com dados da API, recursos e passos |
| `/locais` | **Locais** | Lista (GET) com busca e filtro por tipo, e janela (modal) de cadastro (POST) |
| `/locais/:id` | **Painel do local** | Rota com parâmetro: conta do mês com réguas contra a meta, custo e CO₂, registros (editar PUT, excluir DELETE), metas (POST, PUT, DELETE), causas mais frequentes e dicas |
| `/registrar` | **Registrar desperdício** | Formulário (POST) com local, recurso, causa, quantidade, data e observação |
| `/sobre` | Sobre | Problema, solução, cálculos e ODS |
| `/integrantes` | Integrantes | Equipe |
| `/faq` | FAQ | Perguntas frequentes |
| `/contato` | Contato | Formulário de contato (POST `/contatos`) com validação |
| `*` | 404 | Página não encontrada |

## O que o projeto cobre

- **GET, POST, PUT e DELETE** de local, registro e meta.
- **Rota com parâmetro** (`/locais/:id`) e estado "não encontrado" quando a API devolve 404.
- **Formulários com validação** (Yup): campos obrigatórios, quantidade maior que 0 com até 2 casas decimais, data não futura, causa que pertença ao recurso, limites iguais aos das colunas do banco.
- **Retorno da API ao usuário**: avisos de sucesso, janelas de confirmação e mensagens de erro (400, 404, 409 e falha de conexão) vindas da API.
- **Nomes do domínio** (Local, Registro, Meta, Recurso, Causa, Dica), sem CRUD genérico.
- **Acessibilidade e responsividade**: menu móvel, foco visível, `role="progressbar"` nas réguas, rótulos e mensagens ligados aos campos, janelas que fecham com Esc.

## Banco de dados e front

Os dados vêm da API Java, que lê o banco Oracle criado pelo script final `docs/gs_database_desperdicio_zero.sql` (7 tabelas, com acentos nos textos). Cada tabela aparece no front assim:

| Tabela | Rota da API | Onde aparece no front |
| --- | --- | --- |
| `tb_local` | `/locais` | `/locais`, painel, seletor em `/registrar` |
| `tb_recurso` | `/recursos` | unidades, custo e CO₂ em toda a conta do mês |
| `tb_causa` | `/causas` | select de causa (filtrado pelo recurso), causas mais frequentes |
| `tb_dica` | `/dicas?recurso=` | dicas do painel |
| `tb_registro` | `/locais/{id}/registros` | `/registrar`, histórico e totais do painel |
| `tb_meta` | `/locais/{id}/metas` | réguas do painel (associativa N:N local x recurso) |
| `tb_contato` | `/contatos` | página `/contato` |

O contrato completo de campos e endpoints, para o pessoal de Java conferir, está em [`docs/contrato-api.md`](docs/contrato-api.md).

## Como rodar

```bash
npm install
npm run dev        # front em http://localhost:5173, usando a API Java publicada no Render
```

Sem nenhuma configuração o front fala com a **API Java publicada**: <https://api-java-global-solution-fiap.onrender.com>.

- No plano gratuito do Render a API "dorme" sem uso. A **primeira chamada pode levar cerca de um minuto**; o front avisa na tela enquanto espera.
- A API só aceita requisições dos domínios listados em `APP_CORS_ORIGENS` (no Render). Para rodar em `http://localhost:5173` e na Vercel, os dois precisam estar nessa lista, sem `/` no final.
- Para usar outra API (por exemplo, a API rodando em `http://localhost:8080`), copie `.env.example` para `.env` e troque `VITE_API_URL`. Na Vercel, configure a mesma variável.

Outros comandos: `npm run build` (gera a pasta `dist`), `npm run lint` e `npm run preview`.

## Camada de API

O plano da solução exige a integração com a API Java no Render, sem mock no front. Toda chamada passa por dois arquivos:

- `src/services/api.ts`: cliente HTTP, mensagens de erro da API e conversão de ids (a API devolve números, o front usa texto).
- `src/services/ecoloopService.ts`: uma função por operação, com a rota da API em comentário. As regras de negócio (meta duplicada 409, excluir local com registros 409, datas e quantidades, causa do recurso) são da API: o front só mostra a mensagem que ela devolve.

## Estrutura de pastas

```
docs/contrato-api.md       contrato JSON e endpoints para o time de Java
src/
├── assets/img/            fotos da equipe
├── components/
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
- **Meta mensal** é um teto. Acima de 100% a meta estourou (mesmo critério da consulta 04 do SQL); a partir de 80% o painel mostra "Perto do limite".
- **Custo** = total x `custoUnitario` do recurso. **CO₂** = total x `fatorCo2` do recurso. Os valores de referência são didáticos, não tarifas reais.
- **Alimento por pessoa** = kg de alimento do mês divididos por `qtPessoas` (consulta 09).
- **Dicas**: dos recursos em que o local já registrou desperdício, da maior para a menor economia estimada (consulta 10).
- O mês exibido é o atual; se ele não tem registros, o painel abre no mês do registro mais recente.

## Roteiro para o vídeo

1. **Início**: o exemplo ao vivo mostra a Padaria Pão Quente com a meta de alimento estourada.
2. **Locais**: busque "pao", filtre por Negócios e cadastre um local novo (mostre as mensagens de validação antes).
3. **Painel** do novo local: sem registros, com dicas gerais. Abra a Padaria: réguas, custo, CO₂ e troca de mês.
4. **Registrar**: tente quantidade 0 e data futura, depois salve um registro e abra o painel.
5. **Painel**: edite e exclua um registro, ajuste uma meta.
6. **Regras da API**: tente excluir um local com registros (409) e exclua o "Casa do João e Lúcia", que não tem.
7. **Sobre**, **FAQ** e **Integrantes**.

## Git Flow

```bash
git checkout -b develop
git checkout -b feature/nome-da-tarefa
git add . && git commit -m "feat: descreve o que foi feito"
git push -u origin feature/nome-da-tarefa   # abre o Pull Request para develop
```

## Equipe Ecoloop

| Nome | RM | Turma |
| --- | --- | --- |
| Miguel Vieira Martins | 571978 | 1-TDSPI |
| Gustavo Neri Andrade | 572722 | 1-TDSPI |
| Thiago Vendrami Luca | 572942 | 1-TDSPI |
| Carlos Americo Machado Brambilla | 571250 | 1-TDSPI |
| Murilo da Silva Lourenço | 573959 | 1-TDSPI |

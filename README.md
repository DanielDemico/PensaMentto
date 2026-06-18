# PENSAMENTTO: Sistema de anotações de pensamentos e análises de sentimentos

**Feito por:** Andreas, Daniel, Eduardo e Victor

O Pensamentto é um diário inteligente onde você pode registrar seus pensamentos, ideias e emoções. O sistema utiliza Inteligência Artificial (via API do Groq) para analisar o sentimento dos seus textos e gerar insights em um Dashboard interativo com gráficos de humor, dias em ofensiva (streak) e nuvem de tags baseada nas palavras-chave mais recorrentes.

## Funcionalidades

- **Diário (Journal)**: Criação de notas textuais que registram o momento do pensamento.
- **Análise de Sentimentos (IA)**: Processa o texto usando IA para determinar a pontuação do humor, polaridade do sentimento e extrair palavras-chave (tags) automaticamente.
- **Dashboard Interativo**:
  - **Gráfico de Variação de Humor**: Visualiza a média diária do seu sentimento ao longo do tempo.
  - **Ofensiva Atual (Streak)**: Contador de dias seguidos que você fez registros.
    - *Como é calculada?* A ofensiva é agora salva de forma independente em uma collection própria (`Streak`) no MongoDB. Sempre que um novo diário é criado, o serviço de ofensiva verifica se a data do novo registro dá continuidade à ofensiva (1 dia de diferença) ou se a quebra. Ao abrir o Dashboard, o backend verifica se o último post foi há mais de um dia, e se for o caso, a ofensiva atual é exibida como zero. Esse modelo foi otimizado para evitar lentidão e consultas pesadas à medida que a quantidade de diários cresce.
  - **Nuvem de Tags**: Uma nuvem interativa gerada a partir das tags e palavras-chave de um determinado período de tempo (7, 15, 30 dias etc).
- **Busca Global e Edição**: Pesquisa de palavras, listagem cronológica, edição em tempo real e deleção de qualquer registro criado com feedback visual integrado na interface.

## Árvore de Telas (UI Tree)

```text
app/
 ├── / (Root/Introduction)
 │    └── IntroductionPage (Apresentação inicial do sistema)
 │
 ├── /dashboard (Dashboard de Emoções)
 │    ├── DailyEmotionsChart (Gráfico de Variação de Humor)
 │    ├── DailyStreakCard (Cartão de Ofensiva Atual)
 │    └── EmotionsTimelineKeywordsCloud (Nuvem de Tags dos sentimentos)
 │
 └── /journal (Tela Principal do Diário)
      ├── Formulário de Novo Registro (Criação)
      ├── /findAll (Listagem de Registros via botão "Buscar Diários")
      │    └── Edição / Deleção dos cards (Ações com UI feedback)
      └── /findByText (Pesquisa de Textos Específicos)
           └── Edição / Deleção dos cards encontrados
```

## Banco de Dados e Queries (MongoDB / Mongoose)

O sistema utiliza MongoDB com a biblioteca Mongoose. As consultas (*queries*) e operações principais estão estruturadas no arquivo `frontend/src/repository/journal.repository.ts`:

- `createJournal(data)`: Cria e salva um novo registro (`Journal.create(data)`).
- `getJournalById(id)`: Busca um registro de diário específico por ObjectID (`Journal.findById(new Types.ObjectId(id))`).
- `getAllJournals(limit, skip)`: Retorna os registros paginados e ordenados pelos mais recentes (`Journal.find().limit(limit).skip(skip).sort({ createdAt: -1 })`).
- `updateJournal(id, data)`: Atualiza os dados de um diário existente (`Journal.findByIdAndUpdate(..., { new: true })`).
- `deleteJournal(id)`: Remove um registro do banco de dados por ID (`Journal.findByIdAndDelete(...)`).
- `searchJournalsByText(query, limit, skip)`: Pesquisa diários onde o corpo de texto corresponda à busca, utilizando RegEx `case-insensitive` para maior flexibilidade (`Journal.find({ text: { $regex: query, $options: "i" } })`).

---

## Como rodar o projeto localmente (Docker Compose)

### 1. Configurando as Variáveis de Ambiente (.env)

O projeto depende de uma chave de API para rodar a funcionalidade de IA (geração das palavras-chave e emoção do texto).

Na raiz principal do projeto, **crie um arquivo chamado `.env`** e adicione a sua chave de API `GROQ` conforme o modelo:

```env
GROQ_API_KEY=sua_chave_da_groq_aqui
```

> **Aviso:** Se o arquivo `.env` não for criado ou a chave for inválida, as avaliações de emoções na criação do diário irão falhar!

### 2. Rodando a Aplicação com Docker

O projeto já possui um orquestrador com as imagens necessárias (MongoDB, Mongo-Express, e a Aplicação Next.js).
Para rodar todo o sistema de uma só vez, abra o terminal na raiz do projeto e execute:

```bash
docker compose up -d --build
```

O contêiner fará os seguintes processos sozinho:
- Baixar as dependências do Frontend (`npm install`).
- Executar os `seeds` de banco de dados (`mongo_seeds.ts`).
- Subir os servidores web e de banco de dados em plano de fundo (`-d`).

### 3. Links de Acesso

- **Frontend / Aplicação PENSAMENTTO**: Acesse [http://localhost:3000](http://localhost:3000)
- **Visualizador do MongoDB (Mongo Express)**: Acesse [http://localhost:8081](http://localhost:8081)
  - **Login:** `mongoexpressuser`
  - **Senha:** `mongoexpresspass`
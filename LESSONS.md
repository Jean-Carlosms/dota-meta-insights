# Lessons Learned

## Consumo de API publica

O backend centraliza a chamada para a OpenDota API em um servico dedicado. Isso facilita tratar timeout, falhas de rede e mudancas futuras no endpoint.

## Cache local

O cache em JSON reduz chamadas repetidas para a API externa e melhora a experiencia local. A validade de 6 horas equilibra atualizacao e simplicidade.

## Normalizacao de dados

Win rate, pick rate e volume usam escalas diferentes. A normalizacao coloca esses valores na mesma base antes de combinar tudo em um score unico.

## Criacao de score analitico

O Meta Score transforma dados brutos em uma leitura mais direta do meta. A formula da mais peso ao win rate, mas tambem considera popularidade e volume para evitar conclusoes isoladas.

## Dashboard em React

O frontend separa filtros, cards, tabela e badges em componentes pequenos. Isso deixa a tela principal mais facil de manter e evoluir.

## Separacao backend/frontend

A API Express fica responsavel por dados, cache e calculos. O React fica responsavel por visualizacao, filtros e experiencia de uso.

## Roles de heroi vs posicao real

As `roles` da OpenDota descrevem caracteristicas gerais do heroi, como Carry, Support ou Disabler. Elas nao dizem em qual posicao o heroi foi jogado em uma partida especifica.

## Heuristica inicial de classificacao

O filtro por posicao usa uma heuristica simples baseada em roles. Isso e util para um MVP de portfolio, mas nao deve ser tratado como precisao estatistica de posicao real.

## Limitacoes de dados publicos

Dados publicos permitem criar uma boa leitura inicial de meta, mas nem sempre incluem contexto de patch, rank, lane, funcao, draft ou build. Essas limitacoes devem aparecer no produto e na documentacao.

## Preparacao para APIs avancadas

A estrutura `stratz.service.js` foi criada para uma futura integracao com STRATZ GraphQL API. Essa etapa podera enriquecer o projeto com posicoes reais por partida, trends, filtros mais granulares e historico.

## Graficos em dashboard React

Recharts permite transformar o payload ja carregado pelo Dashboard em graficos responsivos sem criar chamadas extras de API por componente.

## Endpoints derivados

Rankings, distribuicao por tier e melhores por posicao podem ser calculados a partir do mesmo payload processado. Isso reduz duplicacao e evita chamadas desnecessarias para a OpenDota.

## Confiabilidade de amostra

Win rate e Meta Score ficam mais faceis de interpretar quando acompanhados por volume. `confidenceScore` e `sampleSizeLabel` ajudam a separar sinais fortes de amostras pequenas.

## Score analitico vs dado bruto

Meta Score e uma leitura criada pelo projeto. Matches, wins, win rate e roles sao derivados dos dados publicos da OpenDota. Manter essa separacao clara evita fingir precisao que a fonte ainda nao entrega.

## Limitacao de API publica

APIs publicas sao otimas para MVP e portfolio, mas nem sempre trazem contexto suficiente para patch, rank, lane, posicao real, counters e builds. Esses pontos ficam preparados para integracoes futuras.

## Auditoria de dependencias

O backend auditou sem vulnerabilidades. O frontend apresentou 2 vulnerabilidades moderadas no caminho `vite -> esbuild`. A correcao automatica exige `npm audit fix --force`, que instalaria uma versao maior e potencialmente quebravel do Vite, entao a recomendacao atual e planejar upgrade controlado.

## Referencia de produto vs copia visual

Uma referencia como Dota2ProTracker pode inspirar densidade de informacao, metric tabs, ranking compacto e leitura competitiva. Isso e diferente de copiar layout, CSS, HTML, assets ou coletar dados por scraping.

## Risco de inventar metrica

Quando a API publica nao entrega pick/ban, lane advantage ou posicao real, o projeto precisa evitar nomes que parecam dados oficiais. Indicadores derivados devem ter nomes proprios e documentacao clara.

## Metricas derivadas documentadas

`DotaMeta Rating` combina Meta Score e confidenceScore. `contestRateApprox` usa pickRate como aproximacao inicial. `lanePresenceApprox` permanece `null` ate existir fonte confiavel. Essa transparencia torna o dashboard mais honesto.

## Dashboards densos para analise competitiva

Dashboards competitivos precisam equilibrar densidade e legibilidade: filtros compactos, ranking principal, tabela com grupos de colunas e notas de dados ajudam o usuario a entender o que e medido, derivado ou planejado.

## Dashboard administrativo vs competitivo

Um dashboard administrativo privilegia respiro e leitura ampla. Um dashboard competitivo precisa mostrar mais sinais por tela: colunas agrupadas, linhas compactas, metric bars e filtros densos ajudam a comparar herois rapidamente.

## Mini barras e densidade de tabela

Mini barras em celulas numericas permitem comparar volume e score sem adicionar graficos pesados. A densidade ajustavel deixa o usuario escolher entre leitura confortavel e analise compacta.

## Cuidado para nao copiar outro produto

Usar Dota2ProTracker como referencia significa observar padroes de produto, como densidade e agrupamento de metricas. Nao significa copiar CSS, HTML, assets, layout exato ou dados.

## Dados corretos importam mais do que visual

Um dashboard pode parecer competitivo, mas se a fonte for geral, o resultado continua sendo general meta. High MMR, periodo recente, patch e posicao real mudam completamente a leitura.

## Dashboard bonito vs representativo

Visual denso ajuda a comparar herois, mas representatividade estatistica vem da segmentacao correta. OpenDota `heroStats` e bom para analise publica geral; dados competitivos exigem fonte adequada.

## Segmentacao muda rankings

Filtrar por MMR, periodo e posicao pode inverter rankings. Por isso o projeto separa `General Meta` de `Competitive Meta Preview` e evita chamar dados gerais de meta pro real.

## Assets externos com fallback

Os icones e imagens dos herois usam caminhos publicos retornados pela OpenDota. O frontend precisa lidar com falha de imagem e ausencia de URL usando fallback textual para manter a interface estavel.

## Por que nao salvar imagens no repositorio

Manter imagens externas fora do repositorio evita aumentar o tamanho do projeto e reduz risco de versionar assets que podem mudar de origem/licenca. O projeto guarda apenas URLs derivadas dos dados publicos.

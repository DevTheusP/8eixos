# Quiz de filosofia de vida — design

**Data:** 2026-10-31
**Status:** rascunho para aprovação (revisado após o builder check)
**Nome do produto:** a definir (placeholder: "quiz-filosofia")

## 1. Intenção

Um quiz anônimo, em português, que diz **qual escola filosófica de vida** a pessoa segue e **quais pensadores pensam como ela**. O modelo é o do [12axes](https://github.com/RomanCypherpunk/12axes) (eixos independentes, catálogo comparado por vetor, card compartilhável, relatório pago), mas com código, perguntas e catálogo próprios: a licença do 12axes proíbe reaproveitar qualquer parte dele.

**Por quê:** renda extra autônoma, sem atendimento a pessoas. O quiz se alimenta da audiência do canal Reflexos da Vida (psicologia/reflexão) e devolve conteúdo pro canal (cada escola e cada pensador vira pauta de vídeo).

**Como ganha dinheiro, em ordem de importância:**
1. Relatório completo pago por resultado (Pix).
2. Links de afiliado da Amazon nos livros recomendados (o 12axes faz isso com `tag=12axes-20`).

**Sucesso:** o quiz se paga e gera receita recorrente sem trabalho contínuo além de adicionar perfis ao catálogo de vez em quando.

## 2. Metas, não-metas, anti-metas

**Metas**
- Resultado que a pessoa queira postar no story ("sou 91% estoico, 93% Marco Aurélio").
- Resultado honesto: o match vem de um cálculo reproduzível, não de texto genérico de horóscopo.
- Rodar quase de graça (Vercel + JSON, sem servidor dedicado).

**Não-metas (v1)**
- Inglês / outros idiomas.
- Seções "países/épocas", "mapa filosófico 2D", "partidos", "áreas".
- Contas de usuário, login, histórico.
- Instrumento psicométrico validado cientificamente.

**Anti-metas (falhou mesmo se funcionar)**
- Prometer precisão que não existe (o 12axes diz "100% de precisão" na versão extrema; aqui não).
- Parecer diagnóstico psicológico ou terapia. É um quiz de autoconhecimento filosófico.
- Tomar lado religioso. Escolas religiosas e seculares entram no catálogo com o mesmo tratamento (mesma linha do Ponto Bíblico: honestidade, sem proselitismo).
- Copiar perguntas, textos, vetores ou layout literal do 12axes.

## 3. O modelo: 8 eixos

### Por que 8 (decisão tomada com base em pesquisa)
- A análise fatorial do PhilPapers Survey (Bourget & Chalmers) indica que as opiniões de filósofos variam em ~7 dimensões. Mais que isso gera eixos redundantes.
- No 12axes, eixos como "Tecnologia" ficam no centro pra usuário e catálogo, sem distinguir ninguém.
- 4 itens por traço dão consistência aceitável (Mini-IPIP, α ≈ 0,8), então o formato curto com 4 por eixo é defensável.
- 8 cabe num card 9:16 em grade 2×4.

### Os eixos e de onde vêm

| # | Eixo | Polo A | Polo B | Base |
|---|------|--------|--------|------|
| 1 | Controle | Aceitar (desapego) | Transformar (desejo, luta) | Dicotomia do controle (escala SABS de estoicismo); locus de controle |
| 2 | Bem viver | Virtude / sentido | Prazer / bem-estar | Hedonia vs. eudaimonia; Orientations to Happiness (Peterson) |
| 3 | Sentido | Dado (Deus, cosmos, natureza) | Criado por mim | Primal "Alive vs. Mechanistic" (Clifton) |
| 4 | Mundo | Bom / confiável | Hostil / trágico | Primal "Good" (Clifton), o mais preditivo dos primals |
| 5 | Eu | Indivíduo | Comunidade | Autopromoção vs. autotranscendência (Schwartz) |
| 6 | Rotina | Disciplina / tradição | Liberdade / espontaneidade | Conservação vs. abertura à mudança (Schwartz) |
| 7 | Guia | Razão | Emoção / intuição | Racionalistas vs. românticos |
| 8 | Verdade | Certeza | Dúvida | Dogmatismo vs. ceticismo; humildade intelectual |

**Cuidado conhecido:** medidas de hedonia e eudaimonia correlacionam (~0,8) em pesquisas de bem-estar. Por isso o eixo 2, e qualquer eixo em que os dois polos "são bons", usa itens de **escolha forçada** em vez de concordância simples.

**Como funciona a escolha forçada (minha decisão):** o item mostra duas frases, uma de cada polo, e a pessoa responde numa escala de 5 pontos entre elas ("muito mais A" … "muito mais B"). A pontuação usa os mesmos valores 0,00–1,00 da escala normal, então o cálculo não muda. Esses itens contam dentro dos 15 do eixo. A ordem de qual frase aparece à esquerda alterna, pra cumprir a regra de "metade pra cada polo". Uso mínimo: 1/3 dos itens dos eixos 2 (Bem viver) e 5 (Eu); nos outros eixos, só se o teste de correlação acusar problema.

**Validação obrigatória antes do lançamento:** com o catálogo pronto, calcular a correlação entre eixos nos vetores do catálogo. Qualquer par acima de 0,7 é sinal de eixo redundante e deve ser revisto (fundir ou reescrever itens).

**Revisão de 2026-11-03 (catálogo com 30 escolas):** bem viver × sentido chegou a 0,73 (0,79 só nas escolas). A correlação aparece em todos os itens de bem viver, inclusive nos que não falam de sentido, então a causa é a composição do catálogo, não a redação: as tradições religiosas são quase todas éticas da virtude e as filosofias do prazer quase todas sem Deus. Os eixos seguem separados (uma pessoa pode ser virtuosa sem Deus ou buscar prazer com fé) e esse par passa a ter limite 0,8 (`limiteDoPar` em src/lib/catalog-checks.ts). A calibração continua acima de 96% no top 3 com ruído.

## 4. Perguntas e formatos

- Banco de **120 afirmações**: 15 por eixo, metade puxando pra cada polo, pra que concordar com tudo não enviese.
- Escala de 5 pontos (Concordo totalmente = 1,00 … Discordo totalmente = 0,00), exceto itens de escolha forçada.
- Resultado por eixo = média das respostas do eixo, em % entre os polos. Rótulos: equilibrado / tende / forte / muito forte.

| Formato | Perguntas | Por eixo | Tempo | Observação |
|---|---:|---:|---:|---|
| Curta | 32 | 4 | ~5 min | |
| Completa | 64 | 8 | ~10 min | Destacada como "Recomendada" |
| Profunda | 120 | 15 | ~20 min | "A leitura mais detalhada", sem promessa de 100% |

Curta e completa sorteiam um subconjunto equilibrado (mesma quantidade por eixo e por polo). Todos os formatos são grátis; o paywall é só o relatório.

Pesquisa: quizzes têm ~90% de conclusão depois de iniciados. A desistência acontece antes de começar, então a tela de escolha de formato e a promessa do resultado importam mais que o número exato de perguntas.

## 5. Catálogo

Cada perfil do catálogo **responde as 120 perguntas no papel** (gerado com IA, revisado manualmente), e o vetor sai da mesma fórmula do usuário. Nada é posicionado à mão. As respostas ficam arquivadas pra auditoria.

**Escolas (v1, ~22):** Estoicismo, Epicurismo, Cinismo, Ceticismo pirrônico, Hedonismo cirenaico, Platonismo, Aristotelismo, Budismo, Taoísmo, Confucionismo, Cristianismo agostiniano, Tomismo, Existencialismo cristão, Existencialismo ateu, Absurdismo, Niilismo, Utilitarismo, Pragmatismo, Humanismo secular, Romantismo, Logoterapia, Transcendentalismo. Cada uma pertence a uma **família** (ex.: Filosofias da virtude, Caminhos orientais, Filosofias do sentido, Filosofias do prazer, Filosofias da dúvida, Tradições cristãs).

**Pensadores (v1, ~50):** de cada escola, 2–3 nomes reconhecíveis (Marco Aurélio, Sêneca, Epicteto, Epicuro, Diógenes, Buda, Lao-Tsé, Confúcio, Agostinho, Tomás de Aquino, Pascal, Kierkegaard, C. S. Lewis, Sartre, Camus, Nietzsche, Schopenhauer, Mill, William James, Viktor Frankl, Montaigne, Thoreau…). Retratos de domínio público (Wikimedia Commons), com fonte registrada.

**Prioridade:** estoicismo é a escola com mais demanda no Brasil (livros de Ryan Holiday passam de 320 mil cópias vendidas no país), então ela e seus pensadores recebem o conteúdo mais caprichado.

**Validação do catálogo:** recusar perfil quase duplicado de outro existente; recusar perfil com respostas neutras demais.

**Quem escreve o conteúdo (minha decisão):** todo o texto (descrições, frases, "como você lida com…", práticas, pontos cegos, livros, páginas de SEO) é rascunhado com IA a partir de fontes primárias e revisado pelo usuário. O plano de implementação deve incluir a produção desse conteúdo como tarefas próprias, com um script que gera o rascunho por perfil e um checklist de revisão. Pra encurtar o caminho até o lançamento, a v1 pode sair com **12 escolas e ~30 pensadores** (prioridade: estoicismo, epicurismo, cinismo, ceticismo, budismo, taoísmo, cristianismo agostiniano, existencialismo cristão, existencialismo ateu, absurdismo, niilismo, logoterapia) e crescer até a lista completa depois.

## 6. Cálculo do match

Compara o vetor de 8 valores (0–100) do usuário com cada perfil. Seguir a ideia do 12axes, com implementação própria:
- distância por eixo, com penalidade extra quando estão em lados opostos do centro;
- similaridade de direção (cosseno em torno do centro);
- compatibilidade de intensidade (moderado não deve casar com extremo só porque a direção bate);
- penalidade pra um único eixo muito distante.

Pesos e fórmula exata ficam com o construtor, mas devem passar num **teste de calibração**: respostas geradas a partir de um perfil, com ruído, precisam encontrar esse perfil entre os primeiros.

Escolas e pensadores são ranqueados separadamente.

## 7. Página de resultado

Mockup de referência: [`2026-10-31-resultado-mockup.html`](2026-10-31-resultado-mockup.html), na mesma pasta deste documento (visual inspirado no 12axes: fundo bege, azul-marinho, anel de %, índice lateral fixo no desktop). Ordem:

1. **Topo:** escola principal, família (selo), % de match, frase em primeira pessoa e **botão de compartilhar ali mesmo**, no pico de emoção.
2. **Seus 8 eixos:** grade 2×4 com barra, polo dominante e intensidade.
3. **O que te distingue:** posição mais incomum (vs. mediana do catálogo) e mais comum.
4. **Pensadores mais próximos:** destaque com retrato e %, "também próximos por dimensão" (3) e "mais distantes" (3).
5. **Outras escolas e o seu oposto:** 3 escolas próximas + a mais distante, apresentada como "seu oposto filosófico".
6. **Como você lida com…:** sofrimento (grátis); morte, felicidade e relações borrados, liberados no relatório.
7. **Para ler:** 3 livros (um por pensador próximo) com link de afiliado Amazon.
8. **Compare:** com um amigo (cola o link do resultado dele) e com um pensador ("você vs. Nietzsche").
9. **Relatório completo:** chamada de compra.

**Card de compartilhamento:** PNG 9:16 com escola, %, pensador principal e os 8 eixos.
**Link do resultado:** a URL reconstrói o resultado a partir dos 8 valores (ex.: `?c=72&b=22&…`), sem banco.

## 8. Relatório pago

- **Preço:** R$ 9,90 por resultado, via Pix (decisão do usuário em 2026-11-02, abaixo dos R$ 14,99 do 12axes, pra facilitar a compra por impulso). Revisar depois de ter dados de conversão.
- **Conteúdo:** cada eixo explicado pra aquele resultado; pontos cegos (onde a escola principal discordaria da pessoa); como lida com morte, felicidade e relações; 7 práticas da escola pro dia a dia; PDF pra baixar.
- **Segurança:** o conteúdo do relatório é gerado **no servidor** e só entregue com um token de pagamento válido pra aquele vetor de resultado. Nada do relatório pode estar no bundle do front.
- **Reembolso:** 7 dias, com página de política (como o 12axes).
- **Lançar com paywall desligado** (flag) e ligar quando houver tráfego.

**Como o relatório é escrito (minha decisão):** texto **pré-escrito em blocos**, sem IA na hora da compra. Pra cada eixo há um texto por faixa (muito forte A, forte A, tende A, equilibrado, tende B, forte B, muito forte B); pra cada escola há os textos de pontos cegos, "como lida com…" e práticas. O servidor monta o relatório juntando os blocos do resultado. Custo por venda zero, sem latência, sem chave de API em produção, e revisável antes de publicar.

**Com o paywall desligado (minha decisão):** a seção 9 da página de resultado fica escondida, e os itens borrados de "Como você lida com…" mostram só "sofrimento". Assim o conteúdo do relatório pode ficar pronto depois do lançamento do quiz.

**Token e escopo (minha decisão):**
- O token é ligado ao hash do vetor de 8 valores. Refazer o quiz e obter outro vetor = outro relatório, outra compra.
- O link de compartilhar resultado **não** carrega o token: o amigo que abre o link vê o resultado grátis, não o relatório.
- Depois do pagamento, o comprador recebe por e-mail um link de acesso ao relatório (resultado + token) e o token também fica salvo no navegador. Esse e-mail é o único jeito de recuperar o relatório depois.
- O registro do pagamento (Supabase) guarda: id da cobrança, hash do vetor, e-mail, status, data. Serve pra reembolso e pra reenviar o link.

**Dados do comprador:** e-mail é obrigatório (entrega). Os demais campos são os que o gateway exigir pra emitir a cobrança Pix; não guardar no Supabase nada além do listado acima.

## 9. Stack e infraestrutura (minha decisão)

- **Next.js (App Router) + TypeScript na Vercel.** O usuário já usa no Perschain. Sem backend separado: o 12axes precisou de Spring Boot no Render, aqui as rotas de API do Next resolvem.
- **Dados em JSON versionado** no repositório (eixos, perguntas, escolas, pensadores, livros, vetores), validados no build: o build falha se algum perfil não tiver exatamente os 8 eixos.
- **Cálculo do resultado gratuito** pode rodar no cliente. **Relatório pago** só no servidor.
- **Pagamento:** o vendedor começa como **pessoa física (CPF)**, com opção de abrir MEI depois. Relatos da comunidade indicam que a AbacatePay não atende pessoa física, então a v1 usa **Mercado Pago (Pix, conta no CPF)**. A integração fica atrás de uma interface de gateway (criar cobrança, receber webhook, consultar/reembolsar), pra trocar por AbacatePay ou outro quando houver CNPJ sem mexer no resto. O webhook confirma o pagamento e emite um token assinado (HMAC) ligado ao hash do vetor.
- **Fiscal (fora do código, responsabilidade do usuário):** recebendo no CPF, a renda entra na declaração de pessoa física (carnê-leão). Quando as vendas ficarem constantes, abrir MEI (teto de R$ 81 mil/ano) com um CNAE permitido ao MEI pra conteúdo digital, a confirmar com contador.
- **Supabase** só pra registrar pagamentos/tokens (o usuário já conhece). Sem dados pessoais além do necessário pro pagamento.
- **Páginas estáticas indexáveis** pra cada escola e cada pensador (SEO programático: "estoicismo o que é", "filosofia de Marco Aurélio").
- **Testes:** validação do catálogo, teste de calibração do match, testes das rotas de pagamento.

## 10. Distribuição

- Vídeos no Reflexos da Vida com CTA pro quiz. Cada escola e cada pensador do catálogo é pauta pronta, com gancho de atualidade (regra do canal).
- O card de story é o motor viral.
- As páginas de escolas e pensadores trazem tráfego orgânico de busca.

## 11. Fora do escopo da v1 / ideias pra depois

- Seção "onde você se encaixaria" (época/lugar histórico).
- Mapa filosófico 2D.
- Versão em inglês.
- Comparação de casal/grupo.

## 12. Deixado para o construtor

- Pesos exatos e fórmula do match (desde que passe no teste de calibração).
- Texto final das 120 perguntas (seguindo as regras da seção 4).
- Paleta e tipografia finais (o mockup é referência, não especificação).
- Nome do produto e domínio.
- Estrutura de pastas e bibliotecas (PDF, geração do card PNG).

## Fontes da pesquisa

- Bourget & Chalmers, *What do philosophers believe?* — https://philarchive.org/rec/BOUWDP
- Mini-IPIP e BFI-10 (itens por traço e confiabilidade) — https://mda.gesis.org/index.php/mda/article/view/2013.013
- Benchmarks de conclusão de quiz — https://outgrow.co/blog/?p=62795 ; https://help.tryinteract.com/en/articles/10752954-how-many-questions-should-my-quiz-have-to-maximize-conversions
- Por que quizzes de personalidade viralizam — https://www.fyrebox.com/blog/how-to-build-personality-quiz
- Primal world beliefs (Clifton) — https://en.wikipedia.org/wiki/Primal_world_beliefs
- Orientations to Happiness (Peterson) — https://m3ewb.research.uconn.edu/measure/orientation-to-happiness-scale-oth
- Valores de Schwartz, dimensões de ordem superior — https://cris.huji.ac.il/en/publications/measuring-the-four-higher-order-values-in-schwartzs-theory-valida-2/
- Correlação hedonia/eudaimonia — https://internationaljournalofwellbeing.org/index.php/ijow/article/view/1575
- Escala de atitudes estoicas (SABS) — https://mijn.bsl.nl/the-development-and-validation-of-the-stoic-attitudes-and-behavi/51399836
- Estoicismo no mercado brasileiro — https://investnews.com.br/carreira/o-estoicismo-e-pop-mas-sera-que-as-pessoas-entendem-mesmo-essa-filosofia/amp/

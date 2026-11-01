# 8eixos

Quiz anônimo que mede você em 8 eixos e mostra qual escola filosófica de vida e quais pensadores mais se parecem com você.

- **Spec:** `docs/superpowers/specs/2026-10-31-quiz-filosofia-design.md`
- **Plano:** `docs/superpowers/plans/2026-10-31-quiz-gratis.md`

## Rodar localmente

Precisa de Node 22.12 ou mais novo.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # testes (Vitest)
npm run build      # build de produção
```

## Como o resultado é calculado

1. Cada resposta vale de 0 a 1 e puxa um eixo para um dos polos.
2. A média por eixo vira um número de 0 a 100 (0 = polo A, 100 = polo B).
3. O vetor de 8 números é comparado com cada escola e pensador em `src/lib/matching.ts`.

Os dados ficam em `data/` (JSON validado com Zod). O resultado vive só na URL (`/resultado?c=…&b=…`).

## Adicionar ou refazer um perfil do catálogo

No Claude Code, dentro deste projeto:

```
/novo-perfil school <nome da escola>
/novo-perfil thinker <nome do pensador>
```

O comando responde as 120 perguntas no papel do perfil, grava `data/answers/<kind>/<id>.json` e preenche os textos. Depois:

```bash
npm run validate -- thinker <id>   # completo, não neutro demais, não duplicado
npm run vectors                     # recalcula data/generated/vectors.json
npm run check:axes                  # nenhum par de eixos com |r| > 0,7
npm test
```

## Variáveis de ambiente

Veja `.env.example`.

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública (sitemap, card, metadata) |
| `NEXT_PUBLIC_AMAZON_TAG` | tag de afiliado da Amazon Associados |
| `NEXT_PUBLIC_PAYWALL_ENABLED` | `true` liga as seções do relatório pago (plano 2) |

## Licença

Todos os direitos reservados. Este código é visível, mas não pode ser copiado, modificado nem usado sem autorização por escrito. Veja [LICENSE](LICENSE).

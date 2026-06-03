# Heavy Crown Money Landing Page

Landing page responsiva criada para vender o **Cofre Império Digital** da marca Heavy Crown Money.

## Estrutura

- `index.html`: conteúdo completo da página, seções comerciais, oferta, FAQ e avisos legais.
- `styles.css`: identidade visual, responsividade, mockups, cards, animações e layout.
- `script.js`: links editáveis, animações de entrada e comportamento do FAQ.

## Como rodar localmente

Instale as dependências do Node se necessário e rode:

```bash
npm run dev
```

Depois acesse `http://localhost:3000`.

Como o projeto é estático, você também pode abrir o arquivo `index.html` diretamente no navegador.

## Build

```bash
npm run build
```

O build gera a pasta `dist/`, pronta para publicação.

## Deploy na Vercel

O projeto já inclui `vercel.json` configurado com:

- Build command: `npm run build`
- Output directory: `dist`

Na Vercel, importe o repositório do GitHub e mantenha essas configurações.

## Onde editar links

No arquivo `script.js`, altere:

```js
const CONFIG = {
  checkoutUrl: "https://pay.hotmart.com/R106118031H?checkoutMode=10",
  whatsappUrl: "https://wa.me/message/32R7UJIK7H4HB1",
  supportUrl: "https://wa.me/message/32R7UJIK7H4HB1",
};
```

## Onde editar preço

No arquivo `index.html`, procure a seção `price-box`:

```html
<span class="from-price">De R$ [VALOR ORIGINAL] por</span>
<strong class="price">R$ [VALOR PROMOCIONAL]</strong>
<span class="installment">12x de R$ [PARCELA] ou R$ [VALOR À VISTA]</span>
```

## Onde editar garantia e bônus

O `index.html` possui comentários próximos da área de garantia, preço e checkout. Os bônus estão na seção com `id="bonus"`.

## Como publicar

Esta landing page é estática. Você pode publicar em:

- Hostinger, cPanel ou qualquer hospedagem tradicional: envie `index.html`, `styles.css` e `script.js` para a pasta pública.
- Netlify: arraste a pasta do projeto para o painel de deploy.
- Vercel: importe a pasta como projeto estático.
- GitHub Pages: envie os arquivos para um repositório e ative Pages na branch principal.

## Observação legal

A seção de conversas é ilustrativa e fictícia, conforme sinalizado na própria página. A copy evita promessas exageradas e reforça que resultados dependem de consistência, nicho, oferta, estratégia e execução.

# Ficha de Aventura

Aplicação estática para criar contas locais e organizar várias fichas de personagens.

## Abrir no computador

1. Instale Node.js, se ainda não estiver disponível.
2. Na pasta `site-ficha-dnd`, execute `node serve.mjs`.
3. Abra `http://127.0.0.1:4173` no navegador.
4. Crie um perfil local e adicione suas fichas.

## Dados e backups

As contas e fichas são guardadas no IndexedDB deste navegador e nesta origem local. Elas não sincronizam com outros computadores ou navegadores. A senha é usada somente para abrir o perfil local; ela não criptografa as fichas e não existe recuperação de conta. Use **Backup** para baixar um arquivo JSON com as fichas e avatares, e **Importar backup** para restaurá-las em outro perfil.

As imagens de avatar aceitas são PNG, JPG e WebP de até 8 MB. A página reduz a imagem antes de guardá-la na ficha.

## Na mesa e no celular

Ao criar uma ficha, você pode seguir um guia opcional por etapas ou pular direto para as abas. É possível deixar campos em branco e completá-los depois. Em telas pequenas, abra o resumo fixo no rodapé para consultar PV, nível, classe de armadura, iniciativa e deslocamento.

Use **Exportar PDF** dentro da ficha para abrir a impressão do navegador. Escolha **Salvar como PDF** para guardar ou compartilhar uma cópia imprimível. O PDF reúne as seis seções da ficha; campos que ainda estão vazios são omitidos.

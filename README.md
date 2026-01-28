# Invitares

Aplicação web para criacao e gerenciamento de convites, convidados e lista de presentes.
Backend em Laravel com Inertia + React no frontend.

---

## Visao geral

- Criar convites com titulo, subtitulo, data, horario, local, mensagem e detalhes
- Upload de capa e galeria de imagens do convite
- Gerar link de convite para convidados
- Confirmacao de presenca por link publico
- Lista de presentes com links externos

## Stack e dependencias

- PHP 8.2+ / Laravel 12
- Inertia.js (Laravel + React)
- React 19 + Vite 7
- Tailwind CSS v4
- Banco: SQLite por padrao (pode usar MySQL/PostgreSQL)

## Requisitos

- PHP 8.2+
- Composer
- Node.js LTS + npm
- SQLite (ou outro banco configurado no .env)

## Configuracao local

1) Instale dependencias

```bash
composer install
npm install
```

2) Configure o ambiente

```bash
copy .env.example .env
php artisan key:generate
```

3) Crie o banco e rode as migracoes

SQLite (padrao):

```bash
New-Item -ItemType File -Path database\database.sqlite -Force
php artisan migrate
```

4) Habilite uploads (capa/galeria)

```bash
php artisan storage:link
```

5) Rode o app em desenvolvimento

```bash
composer run dev
```

Esse comando sobe:
- servidor Laravel
- fila (queue:listen)
- Vite dev server

## Comandos uteis

```bash
composer run setup      # instala tudo, cria .env, gera key, migra e build
composer test           # roda testes
npm run dev             # frontend apenas
npm run build           # build de producao
npm run types           # checagem de tipos
npm run lint            # lint (eslint)
npm run format          # formatacao (prettier)
```

## Rotas principais

- /login
- /dashboard
- /convites/novo
- /convites/{invitation}/preview
- /convites/{invitation}/editar
- /invite/{guest}
- /confirmar-presenca/{guest}
- /gifts

## Estrutura de pastas

- app/Http/Controllers: regras de negocio e endpoints
- app/Models: modelos Eloquent (Invitation, Guest, Gift)
- resources/js/pages: telas React (Inertia)
- routes/web.php: rotas da aplicacao
- database/migrations: estrutura do banco
- storage/app/public: uploads (capa/galeria)

## Observacoes

- O armazenamento de imagens usa o disco public. Garanta o link com `php artisan storage:link`.
- A fila usa driver database. Para processar em dev, use o `composer run dev` ou rode `php artisan queue:listen`.

## Licenca

MIT

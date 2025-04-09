# Variables
PROJECT := aitaurireactshadcn

# To pass extra arguments, call with: make install ARGS="arg1 arg2 ..."
install:
	@echo "Installing client dependencies"
	@pnpm install 
	@echo "Installing server dependencies"
	@cd server && yarn install

client-dev:
	@echo "Running dev client"
	@pnpm dev

server-dev:
	@echo "Running dev server"
	@chcp 65001
	@pnpm -C server dev

server-install:
	@echo "Installing server dependencies"
	@cd server && yarn install

db-check:
	@echo "Checking database"
	@pnpm -C server db:check

db-generate:
	@echo "Generating database"
	@pnpm -C server db:generate

db-migrate:
	@echo "Running database migration"
	@pnpm -C server db:migrate

db-pull:
	@echo "Pulling database"
	@pnpm -C server db:pull

db-push:
	@echo "Pushing database"
	@pnpm -C server db:push

db-studio:
	@echo "Running database studio"
	@pnpm -C server db:studio

db-up:
	@echo "Running database up"
	@pnpm -C server db:up

app-dev:
	@echo "Running dev app"
	@pnpm app:dev

app-build:
	@echo "Building build app"
	@pnpm app:build

git-hooks:
	@echo "Initializing git hooks"
	@pnpm husky init
	@npm pkg set scripts.commitlint="commitlint --edit"
	@echo npm run commitlint > .husky/commit-msg
	@echo lint-staged > .husky/pre-commit

git-commit:
	@pnpm format
	@pnpm check
	@git add .
	@git commit -am "$(ARGS)"
	@git push -u origin main

git-init:
	@git init
	@git add .
	@git commit -m "feat: init"
	@git branch -M main
	@git remote add origin https://github.com/fantienan/ai-tauri-react-shadcn.git
	@git push -u origin main

lint:
	@echo "Running lint"
	@pnpm lint-staged

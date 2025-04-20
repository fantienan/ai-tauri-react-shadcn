# Variables
NODE_SERVER_PATH := packages/ai-server

# To pass extra arguments, call with: make install ARGS="arg1 arg2 ..."
install:
	@echo "Installing client dependencies"
	@pnpm install 
	@echo "Installing ai-server dependencies"
	@cd packages/ai-server && yarn install

client-dev:
	@echo "Running dev client"
	@pnpm dev

ai-server-dev:
	@echo "Running dev ai server"
	@chcp 65001
	@cd packages/ai-server && yarn dev

ai-server-install:
	@echo "Installing ai server dependencies"
	@cd packages/ai-server && yarn install

ai-server-add:
	@echo "Adding ai server dependencies"
	@cd packages/ai-server && yarn add $(ARGS)

db-check:
	@echo "Checking database"
	@cd packages/ai-server && yarn db:check

db-generate:
	@echo "Generating database"
	@cd packages/ai-server && yarn db:generate

db-migrate:
	@echo "Running database migration"
	@cd packages/ai-server && yarn db:migrate

db-pull:
	@echo "Pulling database"
	@cd packages/ai-server && yarn db:pull

db-push:
	@echo "Pushing database"
	@cd packages/ai-server && yarn db:push

db-studio:
	@echo "Running database studio"
	@cd packages/ai-server && yarn db:studio

db-up:
	@echo "Running database up"
	@cd packages/ai-server && yarn db:up

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
	@cargo fmt --all -- --check

rust-fmt:
	@cargo fmt --all -- --check

web-server-dev:
	@echo "Running dev web server"
	@cargo run --bin web_server
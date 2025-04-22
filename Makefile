# Variables
# DATABASE_URL= sqlite:///${BIZ_WORKSPACE}\\db\\databaseseaorm.db

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

drizzle-check:
	@echo "Checking drizzle database"
	@cd packages/ai-server && yarn db:check

drizzle-generate:
	@echo "Generating drizzle database"
	@cd packages/ai-server && yarn db:generate

drizzle-migrate:
	@echo "Running drizzle database migration"
	@cd packages/ai-server && yarn db:migrate

drizzle-pull:
	@echo "Pulling drizzle database"
	@cd packages/ai-server && yarn db:pull

drizzle-push:
	@echo "Pushing drizzle database"
	@cd packages/ai-server && yarn db:push

drizzle-studio:
	@echo "Running drizzle database studio"
	@cd packages/ai-server && yarn db:studio

drizzle-up:
	@echo "Running drizzle database up"
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
	@cargo fmt --all 

rust-fmt:
	@cargo fmt --all 

web-server-dev:
	@echo "Running dev web server"
	@cargo run --bin web_server

# https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example/migration
sea-db-migrate:
	@echo "Running sea database migration"
	@cargo install sea-orm-cli
	@sea-orm-cli migrate init -d crates/web_server_migration

# sea-db-generate-entity:
# 	@echo "Generating sea database entity"
# 	@cargo install sea-orm-cli
# 	@sea-orm-cli generate entity -o crates/web_server/src/entity -u sqlite:///C:\workspace\codes\@ai\ai-tauri-react-shadcn\workspace\db\databaseseaorm.db
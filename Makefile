# Variables
PROJECT := aitaurireactshadcn

# To pass extra arguments, call with: make install ARGS="arg1 arg2 ..."
install:
	@echo "Installing dependencies"
	@pnpm install 

init:
	@echo "Initializing project"
	@pnpm husky init
	@npm pkg set scripts.commitlint="commitlint --edit"
	@echo npm run commitlint > .husky/commit-msg
	@echo lint-staged > .husky/pre-commit

client-dev:
	@echo "Running dev client"
	@pnpm dev

server-add:
	@echo "Adding package to server"
	@pnpm --filter server add $(ARGS)

server-dev:
	@echo "Running dev server"
	@pnpm --filter server dev

app-dev:
	@echo "Running dev app"
	@pnpm app:dev

app-build:
	@echo "Building build app"
	@pnpm app:build

git-push:
	git add .
	git commit -am "$(ARGS)"
	git push -u origin main

git-init:
	git init
	git add .
	git commit -m "feat: init"
	git branch -M main
	git remote add origin https://github.com/fantienan/ai-tauri-react-shadcn.git
	git push -u origin main


lint:
	@echo "Running lint"
	@pnpm lint-staged

use sea_orm_migration::prelude::*;

#[async_std::main]
async fn start() {
  cli::run_cli(migration::Migrator).await;
}

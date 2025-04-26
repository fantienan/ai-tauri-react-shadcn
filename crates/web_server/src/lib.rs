use sea_orm::{ConnectOptions, Database};
use std::time::Duration;
use tracing::{error, info};
use web_server_migration::{Migrator, MigratorTrait};
mod controller;
mod service;
mod utils;

#[tokio::main]
async fn start() {
  info!("初始化环境变量和配置...");
  let config = utils::config::Config::from_env();
  info!("初始化环境变量和配置成功");
  info!("数据库地址: {}", config.db_url);
  info!("初始化日志系统...");
  utils::tracing::init_tracing();
  info!("初始化日志系统成功");
  info!("初始化数据库链接...");
  let mut options = ConnectOptions::new(&config.db_url);
  options
    .max_connections(config.max_connections)
    .min_connections(config.min_connections)
    .connect_timeout(Duration::from_secs(config.connect_timeout_secs))
    .idle_timeout(Duration::from_secs(config.idle_timeout_secs))
    .max_lifetime(Duration::from_secs(config.max_lifetime_secs))
    .sqlx_logging(config.sqlx_logging);
  let db = Database::connect(options).await.expect("数据库连接失败");
  if let Err(err) = db.ping().await {
    error!("数据库连接失败: {}", err);
    std::process::exit(1);
  }
  info!("数据库连接成功");
  info!("数据库迁移...");
  if let Err(err) = Migrator::up(&db, None).await {
    error!("数据库迁移失败: {}", err);
    std::process::exit(1);
  }
  info!("数据库迁移成功");

  info!("初始化Web服务...");

  let app = utils::app::create_app(utils::common::AppState { db });

  let listener = match tokio::net::TcpListener::bind(format!("0.0.0.0:{}", config.port)).await {
    Ok(listener) => listener,
    Err(err) => {
      error!("服务启动失败: {}", err);
      std::process::exit(1);
    }
  };
  info!("服务启动成功");

  utils::common::list_afinet_netifas(&config.port);
  if let Err(err) = axum::serve(listener, app).await {
    error!("服务运行时错误: {}", err);
  }
}

pub fn main() {
  start();
}

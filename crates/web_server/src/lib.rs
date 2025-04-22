use axum::{
  Router,
  routing::{get, post},
};
use local_ip_address::list_afinet_netifas;
use sea_orm::{ConnectOptions, Database, DatabaseConnection, DbErr};
use std::env;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::{self, TraceLayer};
use tracing::{Level, error, info};
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};
use web_server_migration::{Migrator, MigratorTrait};
// use web_server_entity
mod routes;

#[derive(Clone)]
struct AppState {
  connection: DatabaseConnection,
}

#[tokio::main]
async fn start() {
  common::env::dotenv();
  // 初始化日志系统，使用更完善的配置
  tracing_subscriber::registry()
    .with(
      EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| "web_server=debug,tower_http=debug".into()),
    )
    .with(tracing_subscriber::fmt::layer())
    .init();

  info!("初始化数据库链接...");

  let db_url = env::var("DATABASE_URL").expect(".env 文件中未设置 DATABASE_URL");

  info!("数据库链接: {}", db_url);

  let opt = ConnectOptions::new(&db_url);
  let connection = Database::connect(opt).await.expect("数据库连接失败");

  // 检查连接是否有效
  match connection.ping().await {
    Ok(_) => info!("数据库连接成功"),
    Err(err) => {
      error!("数据库连接失败: {}", err);
      std::process::exit(1);
    }
  }
  // 应用所有迁移
  match Migrator::up(&connection, None).await {
    Ok(_) => info!("数据库迁移成功"),
    Err(err) => {
      error!("数据库迁移失败: {}", err);
      std::process::exit(1);
    }
  }
  let state = AppState { connection };

  info!("初始化 Web 服务...");

  let app = Router::new()
    .route("/", get(routes::root))
    .route("/download/code", post(routes::download_code))
    // 添加请求响应跟踪层
    .layer(
      TraceLayer::new_for_http()
        .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
        .on_response(trace::DefaultOnResponse::new().level(Level::INFO))
        .on_request(trace::DefaultOnRequest::new().level(Level::INFO)),
    )
    .layer(
      CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any),
    )
    .with_state(state);

  let port = env::var("BIZ_RUST_WEB_SERVER_PORT").unwrap_or_else(|_| "3001".to_string());
  let listener = match tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await {
    Ok(listener) => {
      info!("服务启动成功");
      listener
    }
    Err(err) => {
      error!("服务启动失败: {}", err);
      std::process::exit(1);
    }
  };

  // 获取并显示所有网络接口的IP地址
  match list_afinet_netifas() {
    Ok(network_interfaces) => {
      for (_, ip) in network_interfaces.iter() {
        if ip.is_ipv4() {
          info!("服务地址: http://{:?}:{}", ip, port);
        }
      }
    }
    Err(e) => error!("无法获取网络接口信息: {}", e),
  }

  if let Err(err) = axum::serve(listener, app).await {
    error!("服务运行时错误: {}", err);
  }
}

pub fn main() {
  start();
}

use axum::{
  Router,
  routing::{get, post},
};
use local_ip_address::list_afinet_netifas;
use std::env;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::{self, TraceLayer};
use tracing::{Level, error, info};
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};
mod routes;

#[tokio::main]
async fn main() {
  common::env::dotenv();
  // 初始化日志系统，使用更完善的配置
  tracing_subscriber::registry()
    .with(
      EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| "web_server=debug,tower_http=debug".into()),
    )
    .with(tracing_subscriber::fmt::layer())
    .init();

  info!("初始化 Web 服务器...");
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
    .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any));

  let port = env::var("BIZ_RUST_WEB_SERVER_PORT").unwrap_or_else(|_| "3001".to_string());
  let listener = match tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await {
    Ok(listener) => listener,
    Err(err) => {
      error!("服务器启动失败: {}", err);
      std::process::exit(1);
    }
  };

  info!("服务器启动成功");
  // 获取并显示所有网络接口的IP地址
  match list_afinet_netifas() {
    Ok(network_interfaces) => {
      for (_, ip) in network_interfaces.iter() {
        if ip.is_ipv4() {
          info!("服务器地址: http://{:?}:{}", ip, port);
        }
      }
    }
    Err(e) => error!("无法获取网络接口信息: {}", e),
  }

  if let Err(err) = axum::serve(listener, app).await {
    error!("服务器运行时错误: {}", err);
  }
}

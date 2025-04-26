use super::common::*;
use crate::controller;
use axum::{
  Router,
  routing::{get, post},
};
use tower_http::{
  cors::{Any, CorsLayer},
  trace::{self, TraceLayer},
};
use tracing::Level;

pub fn create_app(state: AppState) -> Router {
  Router::new()
    .route("/", get(controller::root::main))
    .route("/download/code", post(controller::download::download_code))
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
    .with_state(state)
}

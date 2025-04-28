use super::{common::*, error::*};
use crate::controller;
use axum::{
  Router,
  body::Body,
  http::StatusCode,
  response::{IntoResponse, Response},
  routing::{get, post},
};
use tower_http::{
  cors::{Any, CorsLayer},
  trace::{self, TraceLayer},
};
use tracing::Level;

impl IntoResponse for AppError {
  fn into_response(self) -> Response<Body> {
    let (status, message) = match &self {
      AppError::ChatQueryError(_) => (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()),
      AppError::MessageQueryError(_) => (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()),
      AppError::Render(_) => (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()),
      AppError::DownloadFailed(_) => (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()),
      AppError::ChatNotFound(_) => (StatusCode::NOT_FOUND, self.to_string()),
      AppError::MessageNotFound(_) => (StatusCode::NOT_FOUND, self.to_string()),
      AppError::MessageParseError(_) => (StatusCode::BAD_REQUEST, self.to_string()),
      AppError::NotFound => (StatusCode::NOT_FOUND, self.to_string()),
    };
    (status, message).into_response()
  }
}

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

use crate::service::chat;
use crate::service::message;
use crate::utils::{common::AppState, error::DownloadError};
use axum::{
  Json,
  body::Body,
  extract::State,
  http::{StatusCode, header},
  response::{IntoResponse, Response},
};
use serde::Deserialize;
use std::path;

pub async fn download_code(
  state: State<AppState>,
  Json(payload): Json<DownloadCode>,
) -> Result<Response, DownloadError> {
  let file_type = payload.file_type.as_deref().unwrap_or("zip");
  log::info!("正在下载代码...");
  log::info!(
    "参数 chart_id: {}, message_id: {}, template_src_dir: {}, file_type: {}",
    payload.chat_id,
    payload.message_id,
    payload.template_src_dir,
    file_type
  );
  let chat = chat::find_by_id(&state.db, &payload.chat_id)
    .await
    .map_err(|e| DownloadError::ChatQueryError(e.to_string()))?
    .ok_or_else(|| DownloadError::ChatNotFound(payload.chat_id.clone()))?;

  let message = message::find_by_id(&state.db, &payload.message_id)
    .await
    .map_err(|e| DownloadError::MessageQueryError(e.to_string()))?
    .ok_or_else(|| DownloadError::MessageNotFound(payload.message_id.clone()))?;

  let path = path::PathBuf::from(&payload.template_src_dir);
  let file_bytes = common::download::code(&path)
    .await
    .map_err(|e| DownloadError::DownloadFailed(e.to_string()))?;

  let filename = format!("{}.{}", chat.title, file_type);
  // 使用 UTF-8 编码和 RFC 8187 格式处理文件名
  // 同时提供普通 filename 和 RFC 6266 编码的 filename* 以增强兼容性
  let content_disposition = common::response::gen_content_disposition(&filename);
  let response = Response::builder()
    .status(StatusCode::OK)
    .header(header::CONTENT_TYPE, "application/octet-stream")
    .header(header::CONTENT_DISPOSITION, content_disposition)
    .header(header::ACCESS_CONTROL_EXPOSE_HEADERS, "*")
    .body(Body::from_stream(file_bytes))
    .unwrap();
  Ok(response)
}

// the input to our `create_user` handler
#[derive(Deserialize)]
pub struct DownloadCode {
  chat_id: String,
  message_id: String,
  template_src_dir: String,
  file_type: Option<String>,
}

impl IntoResponse for DownloadError {
  fn into_response(self) -> Response<Body> {
    let (status, message) = match &self {
      DownloadError::ChatQueryError(_)
      | DownloadError::MessageQueryError(_)
      | DownloadError::DownloadFailed(_) => (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()),
      DownloadError::ChatNotFound(_) | DownloadError::MessageNotFound(_) => {
        (StatusCode::NOT_FOUND, self.to_string())
      }
    };
    (status, message).into_response()
  }
}

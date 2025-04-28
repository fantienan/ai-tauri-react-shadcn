use crate::service::chat;
use crate::service::message;
use crate::utils::{common::AppState, error::*};

use axum::{
  Json,
  body::Body,
  extract::State,
  http::{StatusCode, header},
  response::Response,
};
use serde::Deserialize;
use std::path;
use tracing::info;
use web_server_entity::message::{InvocationResult, MessagePart, Model};

pub async fn download_code(
  state: State<AppState>,
  Json(payload): Json<DownloadCode>,
) -> Result<Response, AppError> {
  let file_type = payload
    .file_type
    .as_deref()
    .unwrap_or_else(|| state.config.download_code_file_type.as_str());
  let template_src_dir = payload
    .template_src_dir
    .as_deref()
    .unwrap_or(&state.config.template_src_dir);
  info!("正在下载代码...");
  info!(
    "参数 chart_id: {}, message_id: {}, template_src_dir: {}, file_type: {}",
    payload.chat_id, payload.message_id, template_src_dir, file_type
  );

  let chat = chat::find_by_id(&state.db, &payload.chat_id)
    .await
    .map_err(|e| AppError::ChatQueryError(e.to_string()))?
    .ok_or_else(|| AppError::ChatNotFound(payload.chat_id.clone()))?;

  let message = message::find_by_id(&state.db, &payload.message_id)
    .await
    .map_err(|e| AppError::MessageQueryError(e.to_string()))?
    .ok_or_else(|| AppError::MessageNotFound(payload.message_id.clone()))?;

  let data = extract_analyze_result(&message);

  let path = path::PathBuf::from(&template_src_dir);
  let file_bytes = common::download::code(&path)
    .await
    .map_err(|e| AppError::DownloadFailed(e.to_string()))?;

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
  template_src_dir: Option<String>,
  file_type: Option<String>,
}

fn extract_analyze_result(message: &Model) -> Option<InvocationResult> {
  if let Ok(parts) = message.parse_parts() {
    for part in parts {
      if let MessagePart::ToolInvocation { data } = part {
        if data.tool_name == "sqliteAnalyze" && data.state == "result" {
          return Some(data.result);
        }
      }
    }
  }
  None
}

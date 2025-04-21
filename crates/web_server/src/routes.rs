use axum::{Json, body::Body, http::StatusCode, http::header, response::IntoResponse};
use percent_encoding::{CONTROLS, percent_encode};
use serde::Deserialize;
use std::path;

// basic handler that responds with a static string
pub async fn root() -> &'static str {
  "Hello, World!"
}

pub async fn download_code(Json(payload): Json<DownloadCode>) -> impl IntoResponse {
  log::info!(
    "正在下载代码，chart_id: {}, message_id: {}, template_src_dir: {}",
    payload.chat_id,
    payload.message_id,
    payload.template_src_dir
  );
  let path = path::PathBuf::from(&payload.template_src_dir);

  // 获取代码内容
  match common::download::code(&path).await {
    Ok(file_bytes) => {
      // 设置合适的响应头
      let mut headers = header::HeaderMap::new();
      headers.insert(
        header::CONTENT_TYPE,
        "application/octet-stream".parse().unwrap(),
      );
      let filename = format!(
        "{}-{}.{:?}",
        payload.chat_id,
        payload.message_id,
        path.extension()
      );
      // 使用 UTF-8 编码和 RFC 8187 格式处理文件名
      // 同时提供普通 filename 和 RFC 6266 编码的 filename* 以增强兼容性
      let content_disposition = format!(
        "attachment; filename=\"{}\"; filename*=UTF-8''{}",
        filename,
        percent_encode(filename.as_bytes(), CONTROLS)
      );

      headers.insert(
        header::CONTENT_DISPOSITION,
        content_disposition.parse().unwrap(),
      );
      // 返回文件内容作为响应
      (StatusCode::OK, headers, Body::from_stream(file_bytes)).into_response()
    }
    Err(err) => {
      log::error!("下载代码失败: {}", err);
      (
        StatusCode::INTERNAL_SERVER_ERROR,
        format!("下载代码失败: {}", err),
      )
        .into_response()
    }
  }
}

// the input to our `create_user` handler
#[derive(Deserialize)]
pub struct DownloadCode {
  chat_id: String,
  message_id: String,
  template_src_dir: String,
}

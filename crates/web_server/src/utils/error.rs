use axum::{
  body::Body,
  http::{Response, StatusCode},
  response::IntoResponse,
};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DownloadError {
  #[error("查询聊天记录错误: {0}")]
  ChatQueryError(String),
  #[error("查询消息错误: {0}")]
  MessageQueryError(String),
  #[error("未找到聊天记录: {0}")]
  ChatNotFound(String),
  #[error("未找到消息: {0}")]
  MessageNotFound(String),
  #[error("下载代码失败: {0}")]
  DownloadFailed(String),
}

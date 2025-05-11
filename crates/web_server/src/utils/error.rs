use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
  #[error("Resource not found")]
  NotFound,
  #[error("Template rendering error: {0}")]
  Render(#[from] askama::Error),
  #[error("数据库错误: {0}")]
  DbError(#[from] sea_orm::DbErr),
  #[error("查询聊天记录错误: {0}")]
  ChatQueryError(String),
  #[error("查询消息错误: {0}")]
  MessageQueryError(String),
  #[error("解析消息错误: {0}")]
  MessageParseError(String),
  #[error("未找到聊天记录: {0}")]
  ChatNotFound(String),
  #[error("未找到消息: {0}")]
  MessageNotFound(String),
  #[error("下载代码失败: {0}")]
  DownloadFailed(String),
  #[error("查询仪表盘错误: {0}")]
  DashboardQueryError(String),
  #[error("未找到仪表盘")]
  DashboardNotFound,
  #[error("仪表盘解析错误: {0}")]
  DashboardParseError(String),
}

use std::{env, path};

#[derive(Debug, Clone)]
pub struct Config {
  pub db_url: String,
  pub port: u16,
  pub max_connections: u32,
  pub min_connections: u32,
  pub connect_timeout_secs: u64,
  pub idle_timeout_secs: u64,
  pub max_lifetime_secs: u64,
  pub sqlx_logging: bool,
  pub template_src_dir: String,
  pub download_code_file_type: DownloadCodeFileType,
}

#[derive(Debug, Clone)]
pub enum DownloadCodeFileType {
  Zip,
  Tar,
}

impl DownloadCodeFileType {
  pub fn as_str(&self) -> &'static str {
    match self {
      DownloadCodeFileType::Zip => "zip",
      DownloadCodeFileType::Tar => "tar",
    }
  }
}

impl Config {
  pub fn from_env() -> Self {
    common::env::dotenv();
    Self {
      template_src_dir: env::var("TEMPLATE_SRC_DIR").unwrap_or_else(|_| {
        path::PathBuf::from(file!())
          .parent()
          .expect("获取当前文件路径失败")
          .join("templates/analyze")
          .to_string_lossy()
          .to_string()
      }),
      download_code_file_type: env::var("DOWNLOAD_CODE_FILE_TYPE")
        .map(|val| {
          if val.eq_ignore_ascii_case("tar") {
            DownloadCodeFileType::Tar
          } else {
            DownloadCodeFileType::Zip
          }
        })
        .unwrap_or(DownloadCodeFileType::Zip),
      db_url: format!(
        "sqlite:///{}",
        env::var("SQLITE_DATABASE_URL").expect(".env 文件中未设置 SQLITE_DATABASE_URL")
      ),
      port: env::var("BIZ_RUST_WEB_SERVER_PORT")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(3001),
      max_connections: env::var("DB_MAX_CONNECTIONS")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(10),
      min_connections: env::var("DB_MIN_CONNECTIONS")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(1),
      connect_timeout_secs: env::var("DB_CONNECT_TIMEOUT_SECS")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(8),
      idle_timeout_secs: env::var("DB_IDLE_TIMEOUT_SECS")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(300),
      max_lifetime_secs: env::var("DB_MAX_LIFETIME_SECS")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(1800),
      sqlx_logging: env::var("DB_SQLX_LOGGING")
        .ok()
        .map(|v| v == "true")
        .unwrap_or(false),
    }
  }
}

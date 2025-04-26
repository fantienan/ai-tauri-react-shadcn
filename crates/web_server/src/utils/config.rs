use std::env;

pub struct Config {
  pub db_url: String,
  pub port: String,
  pub max_connections: u32,
  pub min_connections: u32,
  pub connect_timeout_secs: u64,
  pub idle_timeout_secs: u64,
  pub max_lifetime_secs: u64,
  pub sqlx_logging: bool,
}

impl Config {
  pub fn from_env() -> Self {
    common::env::dotenv();
    Self {
      db_url: format!(
        "sqlite:///{}",
        env::var("SQLITE_DATABASE_URL").expect(".env 文件中未设置 SQLITE_DATABASE_URL")
      ),
      port: env::var("BIZ_RUST_WEB_SERVER_PORT").unwrap_or_else(|_| "3001".to_string()),
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

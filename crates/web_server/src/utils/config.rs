use std::env;

pub struct Config {
  pub db_url: String,
  pub port: String,
}

impl Config {
  pub fn from_env() -> Self {
    common::env::dotenv();

    let db_url = format!(
      "sqlite:///{}",
      env::var("SQLITE_DATABASE_URL").expect(".env 文件中未设置 SQLITE_DATABASE_URL")
    );
    let port = env::var("BIZ_RUST_WEB_SERVER_PORT").unwrap_or_else(|_| "3001".to_string());
    Self { db_url, port }
  }
}

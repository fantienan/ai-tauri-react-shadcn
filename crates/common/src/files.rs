use crate::env;
use std::{fs, path};

pub fn get_workspace_path() -> path::PathBuf {
  env::dotenv();
  std::env::var("BIZ_WORKSPACE")
    .map(path::PathBuf::from)
    .unwrap_or_else(|_| std::env::current_dir().unwrap())
}

pub fn get_vector_path() -> path::PathBuf {
  let workspace_path = get_workspace_path();
  workspace_path.join("vector")
}

pub fn get_mbtiles_path() -> path::PathBuf {
  let vector_path = get_vector_path();
  vector_path.join("mbtiles")
}

pub fn get_log_path() -> path::PathBuf {
  let workspace_path = get_workspace_path();
  workspace_path.join(".logs")
}

pub fn get_template_path() -> path::PathBuf {
  let workspace_path = get_workspace_path();
  workspace_path.join("template")
}

pub fn create_workspace() -> std::io::Result<String> {
  let workspace_path = path::Path::new("workspace");
  if !workspace_path.exists() {
    fs::create_dir(workspace_path)?;
  }

  let vector_path = workspace_path.join("vector");
  if !vector_path.exists() {
    fs::create_dir(&vector_path)?;
  }

  let mbtiles_path = vector_path.join("mbtiles");
  if !mbtiles_path.exists() {
    fs::create_dir(mbtiles_path)?
  }

  // 创建config.yaml 文件 并写入内容
  let config_path = vector_path.join("config.yaml");
  if !config_path.exists() {
    let content = format!(
      r#"
      mbtiles:
        paths: mbtiles
    "#
    );
    fs::write(config_path, content)?;
  }

  let log_path = workspace_path.join(".logs");
  if !log_path.exists() {
    fs::create_dir(log_path)?;
  }

  Ok("Workspace created successfully".to_string())
}

pub fn init_workspace() {
  match create_workspace() {
    Ok(msg) => {
      log::info!("{}", msg);
    }
    Err(e) => {
      log::error!("Failed to initialize workspace: {}", e);
    }
  }
}

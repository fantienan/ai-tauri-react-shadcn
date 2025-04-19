use std::{fs, path};

// 获取当前路径
pub fn get_current_path() -> path::PathBuf {
  let current_dir = std::env::current_dir().unwrap();
  current_dir
}

pub fn get_workspace_path() -> path::PathBuf {
  let current_dir = get_current_path();
  current_dir.join("workspace")
}

pub fn get_vector_path() -> path::PathBuf {
  let workspace_path = get_workspace_path();
  workspace_path.join("vector")
}

pub fn get_mbtiles_path() -> path::PathBuf {
  let vector_path = get_vector_path();
  vector_path.join("mbtiles")
}

pub fn create_workspace() -> std::io::Result<()> {
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
    let content = format!(r#"
      mbtiles:
        paths: mbtiles
    "#);
    fs::write(config_path, content)?;
  }

  Ok(())
}

pub fn init_workspace() {
  match create_workspace() {
    Ok(_) => {
      log::info!("Workspace initialized successfully");
    }
    Err(e) => {
      log::error!("Failed to initialize workspace: {}", e);
    }
  }
}

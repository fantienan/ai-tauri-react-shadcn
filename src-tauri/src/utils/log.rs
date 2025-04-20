use tauri_plugin_log::{Target, TargetKind};
use crate::utils;

// 初始化日志
pub fn init() -> impl tauri::plugin::Plugin<tauri::Wry> {
  let log_file_path = utils::files::get_resources_path()
    .join("app")
    .to_string_lossy()
    .to_string();
  tauri_plugin_log::Builder::new()
    .targets([
      Target::new(TargetKind::Stdout),
      Target::new(TargetKind::LogDir {
        file_name: Some(log_file_path),
      }),
      Target::new(TargetKind::Webview),
    ])
    .build()
}
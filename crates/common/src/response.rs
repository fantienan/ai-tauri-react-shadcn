use percent_encoding::{CONTROLS, percent_encode};

pub fn gen_content_disposition(filename: &str) -> String {
  // 使用 UTF-8 编码和 RFC 8187 格式处理文件名
  // 同时提供普通 filename 和 RFC 6266 编码的 filename* 以增强兼容性
  format!(
    "attachment; filename=\"{}\"; filename*=UTF-8''{}",
    filename,
    percent_encode(filename.as_bytes(), CONTROLS)
  )
}

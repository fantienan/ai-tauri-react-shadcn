use crate::utils::error::AppError;
use askama::Template;
use askama_web::WebTemplate;
use axum::response::Html;
use axum::response::IntoResponse;

// #[derive(Template)] 会在编译期生成渲染代码，模板路径相对于项目根目录
#[derive(Template, WebTemplate)]
#[template(path = "root.html")]
struct HelloTemplate {
  name: String,
}
// basic handler that responds with a static string
pub async fn main() -> Result<impl IntoResponse, AppError> {
  let template = HelloTemplate {
    name: "Hello, world!".to_string(),
  };
  Ok(Html(template.render()?))
}

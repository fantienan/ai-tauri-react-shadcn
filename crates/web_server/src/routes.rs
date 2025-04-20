use axum::{ http::StatusCode, Json };
use serde::{Deserialize, Serialize};


// basic handler that responds with a static string
pub async fn root() -> &'static str {
    "Hello, World!"
}

pub async fn download_code(Json(payload): Json<DownloadCode>) -> (StatusCode, Json<User>) {
    log::info!("正在下载代码，chart_id: {}, message_id: {}, template_src_dir: {}",  payload.chart_id, payload.message_id, payload.template_src_dir);
    let user  = User {
        id: 1,
        username: "martin".to_string(),
    };
    // common::download::code()
    // this will be converted into a JSON response
    // with a status code of `201 Created`
    (StatusCode::CREATED, Json(user))
}

// the input to our `create_user` handler
#[derive(Deserialize)]
pub struct DownloadCode {
   chart_id: String,
   message_id: String,
   template_src_dir: String,
}

// the output to our `create_user` handler
#[derive(Serialize)]
pub struct User {
    id: u64,
    username: String,
}
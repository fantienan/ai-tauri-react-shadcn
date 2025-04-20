use axum::{
    routing::{get, post},
    http::StatusCode,
    Json, Router,
};
use std::env;
use serde::{Deserialize, Serialize};

#[tokio::main]
async fn main()  {
    common::env::dotenv();
    tracing_subscriber::fmt::init();
    let app = Router::new()
        .route("/", get(root))
        .route("/download/code", post(download_code));

    let port = env::var("BIZ_RUST_WEB_SERVER_PORT").unwrap_or_else(|_| "3001".to_string());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Hello, World!"
}

async fn download_code(
    // this argument tells axum to parse the request body
    // as JSON into a `CreateUser` type
    Json(payload): Json<DownloadCode>,
) -> (StatusCode, Json<User>) {

    log::info!("正在下载代码，chart_id: {}, message_id: {}", payload.chart_id, payload.message_id);
    let user  = User {
        id: 1,
        username: "martin".to_string(),
    };
    // this will be converted into a JSON response
    // with a status code of `201 Created`
    (StatusCode::CREATED, Json(user))
}

// the input to our `create_user` handler
#[derive(Deserialize)]
struct DownloadCode {
   chart_id: String,
   message_id: String,
}

// the output to our `create_user` handler
#[derive(Serialize)]
struct User {
    id: u64,
    username: String,
}
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

pub fn init_tracing() {
  tracing_subscriber::registry()
    .with(
      EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| "web_server=debug,tower_http=debug".into()),
    )
    .with(tracing_subscriber::fmt::layer())
    .init();
}

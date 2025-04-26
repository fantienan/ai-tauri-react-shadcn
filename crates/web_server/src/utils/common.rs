use local_ip_address;
use tracing::{error, info};

#[derive(Clone)]
pub struct AppState {
  pub db: sea_orm::DatabaseConnection,
}

pub fn list_afinet_netifas(port: &String) {
  // 获取并显示所有网络接口的IP地址
  match local_ip_address::list_afinet_netifas() {
    Ok(network_interfaces) => {
      for (_, ip) in network_interfaces.iter() {
        if ip.is_ipv4() && !ip.is_loopback() {
          info!("服务地址: http://{:?}:{}", ip, port);
        }
      }
    }
    Err(e) => error!("无法获取网络接口信息: {}", e),
  }
}

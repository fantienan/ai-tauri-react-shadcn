use sea_orm::*;
use web_server_entity::metadata_info::{Entity, Model};

pub async fn find_all(db: &DbConn) -> Result<Vec<Model>, DbErr> {
  let models = Entity::find().all(db).await?;
  Ok(models)
}

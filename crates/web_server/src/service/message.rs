use sea_orm::*;
use web_server_entity::message::{Entity, Model};

pub async fn find_by_id(db: &DbConn, id: &String) -> Result<Option<Model>, DbErr> {
  Entity::find_by_id(id).one(db).await
}

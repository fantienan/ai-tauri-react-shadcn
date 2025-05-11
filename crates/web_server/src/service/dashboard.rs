use common::types::dashboard::DashboardConfig;
use sea_orm::*;
use web_server_entity::dashboard::{Column, Entity, Model};

use crate::utils::error::AppError;

pub async fn find_by_primary_key(
  db: &DbConn,
  chat_id: &String,
  message_id: &String,
) -> Result<Option<Model>, DbErr> {
  Entity::find()
    .filter(Column::ChatId.eq(chat_id))
    .filter(Column::MessageId.eq(message_id))
    .one(db)
    .await
}

pub async fn find_dashboard_config(
  db: &DbConn,
  chat_id: &String,
  message_id: &String,
) -> Result<Option<DashboardConfig>, AppError> {
  find_by_primary_key(&db, &chat_id, &message_id)
    .await
    .map_err(|e| AppError::DashboardQueryError(e.to_string()))?
    .ok_or_else(|| AppError::DashboardNotFound)?
    .parse_data()
    .map(Some)
    .map_err(|e| AppError::DashboardParseError(e.to_string()))
}

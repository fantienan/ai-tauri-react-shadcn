//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.11

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "user")]
pub struct Model {
  #[sea_orm(primary_key, auto_increment = false, column_type = "Text")]
  pub id: String,
  #[sea_orm(column_type = "Text")]
  pub email: String,
  #[sea_orm(column_type = "Text", nullable)]
  pub password: Option<String>,
  #[sea_orm(column_type = "Text")]
  pub created_at: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
  #[sea_orm(has_many = "super::chat::Entity")]
  Chat,
  #[sea_orm(has_many = "super::dashboard::Entity")]
  Dashboard,
}

impl Related<super::chat::Entity> for Entity {
  fn to() -> RelationDef {
    Relation::Chat.def()
  }
}

impl Related<super::dashboard::Entity> for Entity {
  fn to() -> RelationDef {
    Relation::Dashboard.def()
  }
}

impl ActiveModelBehavior for ActiveModel {}

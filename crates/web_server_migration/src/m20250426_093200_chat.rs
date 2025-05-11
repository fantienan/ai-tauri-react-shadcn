use super::m20250426_112536_user::User;
use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Chat::Table)
          .if_not_exists()
          .col(pk_uuid(Chat::Id).primary_key())
          .col(text(Chat::CreatedAt).default(SimpleExpr::Custom("CURRENT_TIMESTAMP".to_string())))
          .col(text(Chat::Title))
          .col(text(Chat::UserId))
          .col(text(Chat::Visibility))
          .foreign_key(
            ForeignKey::create()
              .name("fk_chat_user_id")
              .from(Chat::Table, Chat::UserId)
              .to(User::Table, User::Id)
              .on_delete(ForeignKeyAction::Cascade)
              .on_update(ForeignKeyAction::Cascade),
          )
          .to_owned(),
      )
      .await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Chat::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
pub enum Chat {
  Table,
  Id,
  CreatedAt,
  Title,
  UserId,
  Visibility,
}

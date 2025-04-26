use sea_orm_migration::{prelude::*, schema::*};
use super::m20250426_093200_chat::Chat;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Message::Table)
                    .if_not_exists()
                    .col(pk_uuid(Message::Id))
                    .col(text(Message::ChatId))
                    .col(text(Message::Role))
                    .col(text(Message::Parts))
                    .col(text(Message::Attachments))
                    .col(text(Message::CreatedAt))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_message_chat_id")
                            .from(Message::Table, Message::ChatId)
                            .to(Chat::Table, Chat::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Message::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Message {
    Table,
    Id, 
    ChatId,
    Role,
    Parts,
    Attachments,
    CreatedAt,
}

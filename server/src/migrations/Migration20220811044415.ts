import { Migration } from '@mikro-orm/migrations';

export class Migration20220811044415 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" text not null, "password" text not null, "first_name" text not null, "last_name" text not null);');
    this.addSql('alter table "user" add constraint "user_user_id_unique" unique ("user_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}

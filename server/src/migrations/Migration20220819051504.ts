import { Migration } from '@mikro-orm/migrations';

export class Migration20220819051504 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "poster_id" int not null;');
    this.addSql('alter table "post" drop column "poster";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" add column "poster" varchar(255) not null;');
    this.addSql('alter table "post" drop column "poster_id";');
  }

}

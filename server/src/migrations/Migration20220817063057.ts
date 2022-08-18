import { Migration } from '@mikro-orm/migrations';

export class Migration20220817063057 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "poster" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop column "poster";');
  }

}

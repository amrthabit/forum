import { Migration } from '@mikro-orm/migrations';

export class Migration20220928001544 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "post_type" varchar(255) not null default \'text\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop column "post_type";');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20221007054606 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "clique" rename column "describtion" to "description";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "clique" rename column "description" to "describtion";');
  }

}

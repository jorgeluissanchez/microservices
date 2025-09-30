import { Repository, FindOptionsWhere } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }

  async find(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.find({ where });
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    data: Partial<T>,
  ): Promise<T | null> {
    await this.repository.update(where, data);
    return this.findOne(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>): Promise<T | null> {
    const entity = await this.findOne(where);
    if (entity) {
      await this.repository.remove(entity);
    }
    return entity;
  }
}
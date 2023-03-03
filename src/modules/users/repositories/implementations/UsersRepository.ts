import { getRepository, Repository } from 'typeorm';

import { IFindUserByFullNameDTO, IFindUserWithGamesDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    // Complete usando ORM
    const userWithGames = await this.repository.findOneOrFail({
      relations: ["games"],
      where: {
        id: user_id
      }
    });

    return userWithGames;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    // Complete usando raw query
    const query = "SELECT * FROM users ORDER BY first_name ASC";
    const users = await this.repository.query(query);
    return users;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    // Complete usando raw query
    // Retornar usuário que possua first_name e last_name
    // Ignorar caixa alta

    const query = "SELECT * FROM users WHERE LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2)";
    const users = await this.repository.query(query, [first_name, last_name])
    return users; 
  }
}

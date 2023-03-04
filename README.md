# Modelagem do banco de dados

Para executar esse desafio é necessário clonar o desafio anterior: https://github.com/MyIgnite/database-query

Desafio: A aplicação deve ter uma tabela de gêneros (`genres`) para que cada jogo possa ter um ou mais gênero e, além disso, uma tabela `orders` deve existir para que um usuário consiga comprar um ou mais jogos na mesma compra.

Um extra seria colocar as cardinalidades entre as entidades mas não tome isso como obrigatório. </br>
Anexar a imagem da modelagem do banco em um documento Notion, torná-lo publico.

[Ver modelagem no Notion](https://renanmms.notion.site/Desafio-02-Modelagem-do-banco-de-dados-a7e2677a0b2c42dda1dcd813da4c04c1)
![Modelagem](./Chapter%20III%20-%20Desafio%20-%20Modelagem%20do%20banco%20de%20dados.png "Modelagem")

[Saiba mais sobre o teste](https://renanmms.notion.site/Desafio-02-Modelagem-do-banco-de-dados-a7e2677a0b2c42dda1dcd813da4c04c1)


# database-query (desafio anterior)
Desafio: Realizará consultas no banco de dados com o TypeORM de três maneiras.
[Veja mais sobre o teste](https://renanmms.notion.site/Desafio-01-Database-Queries-46f62b51020742ddbbb18945e6f7a6c4)

- Usando o ORM
- Usando Query Builder
- Usando Raw Query

Abrir projeto com VSCode Online:

https://github1s.com/MyIgnite/database-query

<br/>

Para que os testes funcionem, você precisa criar uma database no Postgres chamada "queries_challenge" e atualizar as informações de autenticação no arquivo "ormconfig.json" para se conectarem corretamente ao banco de dados.

![ormconfig.json](/image.png "ormconfig.json")

<br/>

> Observações: Caso queira testar o projeto em um ambiente Windows, consulte a documentação do Docker, pois o projeto foi originalmente criado em um ambiente WSL Linux Ubuntu. Você pode encontrar mais informações sobre como executar o projeto em um ambiente Windows utilizando o Docker na documentação correspondente. [Documentação docker](https://docs.docker.com/) 

<br/>

Caso não tenha um container do Docker rodando o Postgres, é possível criá-lo com seguinte comando:

`docker run --name ignite-challenge-database-queries -e POSTGRES_DB=queries_challenge -e POSTGRES_PASSWORD=docker -p 5000:5432 -d postgres`

O resultado é a construção de um container de nome "ignite-challenge-database-queries" usando uma imagem "postgres".

![ormconfig.json](/terminal.png "ormconfig.json")

Com o projeto clonado, navegue até a raiz do projeto e execute:</br>

`yarn` </br>

Execute o comando para testar a aplicação </br>
`yarn test` </br> </br>


## UsersRepository.ts

O método busca um usuário com seus jogos relacionados a partir de um ID de usuário `user id`. A buscar é realizada usando o ORM que retorna os usuários com os jogos relacionados. 

```js
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
```

O método busca todos os usuários com ordem crecente.
A consulta é do tipo puro, ou seja, através de uma string sem utilizar métodos ou sintaxes espefíficas de um ORM ou biblioteca de bando de dados.

```js
async findAllUsersOrderedByFirstName(): Promise<User[]> {
  // Complete usando raw query
  const query = "SELECT * FROM users ORDER BY first_name ASC";
  const users = await this.repository.query(query);
  return users;
  }
```

O método retorna todos os usuários, independente da capitalização de sues nomes.
Por exemplo, nomes como "JoSé", "Maria", "JoÃo" serão incluídos nos resultados.

```js
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
```

## GamesRepository.ts

O métodos busca títulos de jogos que contêm parte de uma seguência de letras.
A busca é realizada com funcionalidade do TypeORM para construir a consulta.

```js
async findByTitleContaining(param: string): Promise<Game[]> {
  // Complete usando query builder
  // Buscar um game que contêm parte de uma seguência de letras
  return this.repository
    .createQueryBuilder()
    .where("title ILIKE :title", {title: `%${param}%`})
    .getMany()
}
```

O método conta todos os jogos da tabela `games`.
A busca é realizada com a funcionalidade `query` do TypeORM, em outras palavras, a consulta é feita de forma bruta diretamente no banco de dados.

```js
async countAllGames(): Promise<[{ count: string }]> {
  // Complete usando raw query
  return this.repository.query('SELECT COUNT(id) FROM games'); 
}
```

O métodos retornar todos os usuários associados a um jogo específico por meio de um parâmetro `id`.
A busca é realizaza cin funcionalidades do TypeORM. A relação entre as entidades `Game` e `User` é definida pelo método `relation` e `of` é usado para especificar o `id` do jogo.

```js
async findUsersByGameId(id: string): Promise<User[]> {
  // Complete usando query builder
  return this.repository
    .createQueryBuilder()
    .relation(Game, "users")
    .of(id)
    .loadMany();
}
```

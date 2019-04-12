exports.up = async knex => {
  await knex.schema.createTable('words', table => {
    table.increments('id')
    table.string('word').notNullable()
  })
}

exports.down = async knex => {
  await knex.schema.dropTable('words')
}

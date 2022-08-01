import Pool from 'pg-pool';

const pgdb = new Pool();
//     {
//   user: '',
//   password: '',
//   host: '',
//   post: ,
//   database: '',
// }
// вся конфигурация по умолчанию в .env

export default pgdb;

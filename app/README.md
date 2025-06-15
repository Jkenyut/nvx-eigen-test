### Install Library

```
npm install 
```

### Generate Prisma

```
npx prisma init # schema prisma
npx prisma migrate dev # migration database
npx prisma generate # generate prisma client
```

### Run Project

```
npm run dev  # start the application
npm run test  # run tests (21 tests passing)
```

### Rest API

```
GET /:Endpoint api
GET /data : Generate mocks data
GET /api-docs :Documentation Swagger UI 
GET /buku : Check all books
GET /member :Check all member
POST /pinjam : Borrow a book
POST /pengembalian : Return a book
```

### Gambar skema database

![](database.jpg)
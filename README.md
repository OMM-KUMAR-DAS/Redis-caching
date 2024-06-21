
# Introduction to Redis

- Redis is an in-memory data structure store.

- In-Memory means it stores data in RAM instead of disks, due to which it allows faster data access.

- https://redis.io/


## Use Case

Suppose you have created a blog website and you wish to see all the blogs of a particular user or everyone. So when you hit the route e.g (/allblogs) it will fetch the data from the database and show you the result. If you refresh the page again you will hit that  route and data will be fetched from the database again. So everytime you refresh the page, data will be fetched from the database which overwhelmed the backend system,and the response time to fetch from the database is more. But if we use Redis then for the first time  data will be fetched from database and this data will be stored in Redis in key value form with expiry time. So whenever you refresh the page, data will be fetched from Redis instead of database with less response time,decreasing the load on the Backend system.Data will be stored in redis datastore till the expiry time after which redis will automatically delete the key.



## Installation

Clone the Repository:

```bash
https://github.com/OMM-KUMAR-DAS/Redis-caching.git

```

Command to Run

```
   npm i
   node index.js
```

Run Redis Locally using this Docker commands(Ensure Docker is Installed in your Desktop)

```
     docker run --name my-redis -d -p 6379:6379 redis

     docker exec -it {Container-id} /bin/bash

     redis-cli
```
    
## 🛠 Skills
- Express
- Mongoose.js
- MongoDB
- Redis


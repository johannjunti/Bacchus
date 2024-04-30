# Frontend

    npm install
    npm run dev

## Backend

    npm install
    npm start


## Database changes

We are using Prisma ORM. You can find prisma docs here https://www.prisma.io/docs/orm/overview/introduction 
If you want to make changes in database update `prisma/schema.prisma` file then run 

    npx prisma format
    npx prisma migrate dev

In production instead of `migrate dev` use 

    npx prisma migrate deploy

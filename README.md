# flash-royale
## To install postgresql  
```bash
# Setup postgres database and user
# A database cluster should have already been created at /var/lib/postgres/data on installation of Postgres.

# A superuser 'postgres' is automatically created on every installation of Postgres. 
# This is used to manage the installation.

# Change to user 'postgres'
sudo su - postgres
# Your prompt should now begin with postgres@...

# Start the postgres daemon in background (OS dependent, below is for Linux)
postgres -k /tmp -D /var/lib/postgres/data >logfile 2>&1 &

# Create a database with name flashroyale
createdb -h localhost flashroyale

# Create a user with name flash
# This is the account used by our application to access the database
createuser -h localhost flash

# Enter the postgres client (psql) as user 'postgres'
psql -h localhost
# Your prompt should now begin with postgres=#...

# Give flash password, grant privileges
ALTER USER flash WITH ENCRYPTED PASSWORD '<password>';
GRANT ALL PRIVILEGES ON DATABASE flashroyale To flash;

# We're done. Exit psql and postgres user.
# Ctrl-D to exit psql
# Ctrl-D once more to exit user 'postgres'
# Your prompt should now begin with <yourusername>@...

# To test our new user flash, enter the postgres client (psql) as user 'flash'
psql -h localhost -U flash flashroyale
# Your prompt should now begin with flashroyale=>...
# If so, success~

# Refer to below to restore database from the dump file (because yours is currently empty)

```

## Database

The database is not kept under version control, instead, its dump files are.
A dump file is a sequence of SQL commands that recreate the database in the
exact same state as it was at the time of the dump.
 
```bash
# From bash
# To write the current state of your database to a text dump file
pg_dump -h localhost -U flash --clean flashroyale > dumpfile.dump

# To restore a dump file to your database 
# Caution: *overwrites* the current state of your database with the dump!
psql -h localhost -U flash -d flashroyale -f dumpfile.dump
```
## To run api
`cd` into the /api  
Run `npm install`  
Then to run the server, `npm run start`

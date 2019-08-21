CREATE DATABASE IF NOT EXISTS vcc CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Using this commandline to avoid the error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication
-- protocol requested by server; consider upgrading MySQL client
ALTER USER root IDENTIFIED WITH mysql_native_password BY 'aaAA11!!';
flush privileges;

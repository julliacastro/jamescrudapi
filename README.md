# Configuração do Ambiente com Docker Compose, Nginx, MongoDB e Swagger

## Descrição do Projeto

Este projeto configura um serviço web de alta disponibilidade que realiza operações CRUD (Create, Read, Update, Delete) em um banco de dados MongoDB. Utilizando Docker Compose, definimos e gerenciamos múltiplas instâncias do serviço, configuramos o Nginx para balancear a carga entre essas instâncias e documentamos as chamadas de API utilizando Swagger.

## Estrutura do Projeto

project/
├── app/
│ ├── Dockerfile
│ ├── server.js
│ ├── package.json
├── nginx/
│ ├── Dockerfile
│ ├── nginx.conf
├── docker-compose.yml
├── swagger/
│ ├── swagger.yaml
└── README.md


## Configuração e Implementação

### Pré-requisitos

- Docker
- Docker Compose

### Instruções para Iniciar o Ambiente

1. Clone este repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd project



2. Construa e inicie os serviços:
docker-compose up --build

Acessando o Serviço Web e a Documentação da API

    Serviço Web: O serviço web estará disponível em http://localhost
    Swagger: A documentação da API estará disponível em http://localhost/swagger

Escalando o Número de Instâncias

Para escalar o número de instâncias do serviço web, utilize o comando abaixo, substituindo NUM_INSTANCIAS pelo número desejado de instâncias:

### docker-compose up --scale web=NUM_INSTANCIAS

Acessando o MongoDB

O MongoDB está configurado como um serviço no Docker Compose e utiliza um volume chamado mongo-data para garantir a persistência dos dados armazenados. A porta 27017 está exposta para acesso local. Você pode acessar o MongoDB usando o seguinte URL de conexão:

### mongodb://localhost:27017/mydatabase

### Comandos Docker Úteis

    Parar e remover todos os contêineres:
####    docker-compose down

    Construir e iniciar os serviços:
####    docker-compose up --build

    Verificar o status dos contêineres:
####    docker-compose ps

    Verificar os logs dos contêineres:
####    docker-compose logs


## Explicação da Configuração de Balanceamento de Carga do Nginx
### Configuração do Nginx

O Nginx está configurado para distribuir o tráfego de maneira uniforme entre as instâncias do serviço web. A configuração nginx.conf define um upstream chamado web_backend que lista as instâncias do serviço web. O Nginx então usa o proxy_pass para encaminhar as requisições para o upstream, balanceando a carga entre as instâncias listadas.

Arquivo nginx.conf:
events {}

http {
    upstream web_backend {
        server web:5000;
        server web:5001;
        server web:5002;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://web_backend;
        }

        location /swagger {
            proxy_pass http://web_backend/swagger;
        }
    }
}

### Persistência de Dados com MongoDB

O MongoDB está configurado como um serviço no Docker Compose e utiliza um volume chamado mongo-data para garantir a persistência dos dados armazenados. Este volume mantém os dados mesmo que o contêiner MongoDB seja removido e recriado.

### Configuração do Volume no Docker Compose

No arquivo docker-compose.yml, o volume é definido da seguinte forma:

services:
  mongo:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo-data:


### Descrição do Volume

    mongo-data: Este volume é utilizado pelo serviço MongoDB para armazenar os dados. Ele é montado no caminho /data/db dentro do contêiner MongoDB, que é o diretório padrão onde o MongoDB armazena seus dados.

### Garantia de Persistência

Ao utilizar volumes, garantimos que os dados do MongoDB sejam persistentes, mesmo que o contêiner seja removido ou recriado. Os dados são armazenados no sistema de arquivos do host e montados no contêiner, garantindo que qualquer alteração no banco de dados seja preservada entre reinicializações do contêiner.

### Como Verificar a Persistência

    Execute o ambiente com Docker Compose:

#### docker-compose up --build

    Adicione alguns dados ao MongoDB através das operações CRUD fornecidas pela API.

    Pare e remova os contêineres:

#### docker-compose down

    Reinicie os contêineres:

#### docker-compose up

## Comando para o numeros de instâncias desejadas caso queira escalar
#### docker-compose up --scale web=NUM_INSTANCIAS

Verifique se os dados adicionados ainda estão presentes, realizando operações de leitura através da API no endpoint /itens GetAllItens.
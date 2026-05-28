CREATE DATABASE IF NOT EXISTS loja_kids;
USE loja_kids;


CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(14),
    data_nascimento DATE,
    telefone VARCHAR(20),
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE,
    telefone VARCHAR(20),
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    tamanho VARCHAR(50) NOT NULL,
    cor VARCHAR(50),
    quantidade_estoque INT DEFAULT 0 NOT NULL,
    imagem VARCHAR(255), 
    imagem_corpo VARCHAR(255),
    id_categoria INT,
    id_vendedor INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id),
    FOREIGN KEY (id_vendedor) REFERENCES vendedores(id)
);

CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_produto INT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_produto INT,
    quantidade INT DEFAULT 1,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);



-- POPULACIONANDO AS TABELAS -- 

-- tabela categorias
INSERT INTO categoria (nome) VALUES 
('Meninas'),
('Meninos'),
('Bebês'),
('Fantasias'),
('Pijamas');


-- tabela produtos

-- bebes
INSERT INTO produtos (
    nome, 
    descricao, 
    preco, 
    tamanho, 
    cor, 
    quantidade_estoque, 
    imagem, 
    imagem_corpo, 
    id_categoria, 
    id_vendedor
) VALUES 
(
    'Conjunto Camisa Ursinhos e Bermuda Marrom', 
    'Conjunto infantil com camisa de manga curta texturizada branca estampada com ursinhos e bermuda marrom.', 
    59.90, 
    'P', 
    'Branco e Marrom', 
    10, 
    'b-brancomarrom-peça.webp', 
    'b-brancomarrom-corpo.webp', 
    3, 
    1
),
(
    'Jardineira Dinossauro Verde com Camiseta', 
    'Conjunto de jardineira curta verde oliva com estampa de dinossauros acompanhada de camiseta branca lisa.', 
    59.90, 
    'P', 
    'Verde e Branco', 
    10, 
    'b-macacaoverde-peça.webp', 
    'b-macacaoverde-corpo.webp', 
    3, 
    1
),
(
    'Jardineira Jeans Coelhinho com Camiseta', 
    'Jardineira curta em tecido estilo jeans azul com detalhe de orelhinhas no bolso frontal e barra listrada, acompanha camiseta branca.', 
    59.90, 
    'P', 
    'Azul e Branco', 
    10, 
    'b-macacaoazul-peça.webp', 
    'b-macacaoazul-corpo.webp', 
    3, 
    1
),
(
    'Conjunto Camisa Polo Cavalo e Bermuda Azul', 
    'Conjunto elegante com camisa gola polo branca, detalhes em azul e bordado de cavalo, acompanhada de bermuda azul texturizada.', 
    59.90, 
    'P', 
    'Branco e Azul', 
    10, 
    'b-brancoazul-peça.webp', 
    'b-brancoazul-corpo.webp', 
    3, 
    1
),
(
    'Conjunto Blusa Alfabeto e Shorts Roxo', 
    'Conjunto fofo para bebê composto por blusa creme com mangas bufantes e estampa de letras coloridas, acompanhada de um shorts roxo texturizado.', 
    59.90, 
    'P', 
    'Creme e Roxo', 
    10, 
    'b-conjroxo-peca.webp', 
    'b-conjroxo-corpo.webp', 
    3, 
    1
),
(
    'Vestido Infantil Estampa de Moranguinhos', 
    'Vestido delicado para bebê com padrão quadriculado suave, estampa de pequenos morangos e acabamento com babados nas alças.', 
    59.90, 
    'P', 
    'Branco e Vermelho', 
    10, 
    'b-vestidomorango-peca.webp', 
    'b-vestidomorango-corpo.webp', 
    3, 
    1
),
(
    'Conjunto Infantil Azul Jeans com Alças de Flores', 
    'Conjunto leve para bebê com blusa cropped azul estilo jeans, alças decoradas com flores brancas e shorts bufante combinando.', 
    59.90, 
    'P', 
    'Azul', 
    10, 
    'b-conjazul-peca.webp', 
    'b-conjazul-corpo.webp', 
    3, 
    1
),
(
    'Conjunto Blusa de Flores e Shorts Verde Salvia', 
    'Conjunto charmoso de verão para bebê composto por blusa branca com estampa floral delicada e shorts verde salvia com amarração.', 
    59.90, 
    'P', 
    'Branco e Verde', 
    10, 
    'b-conjverde-peca.webp', 
    'b-conjverde-corpo.webp', 
    3, 
    1
);

-- meninos
INSERT INTO produtos (
    nome, 
    descricao, 
    preco, 
    tamanho, 
    cor, 
    quantidade_estoque, 
    imagem, 
    imagem_corpo, 
    id_categoria, 
    id_vendedor
) VALUES 
(
    'Conjunto Camisa Coqueiros e Bermuda Bege', 
    'Conjunto casual de verão com camisa de manga curta branca estampada com coqueiros e calção bege com cordão.', 
    59.90, 
    'P', 
    'Branco e Bege', 
    10, 
    'm-conjpraia-peca.webp', 
    'm-conjpraia-corpo.webp', 
    2, 
    1
),
(
    'Conjunto Camiseta Jurassic World Dinossauro', 
    'Conjunto temático composto por uma camiseta bege de manga curta com estampa de dinossauro do Jurassic World e calção castanho.', 
    59.90, 
    'P', 
    'Bege e Castanho', 
    10, 
    'm-conjdino-peca.webp', 
    'm-conjdino-corpo.webp', 
    2, 
    1
),
(
    'Conjunto Camisa Polo Azul-Escuro e Calção Claro', 
    'Conjunto refinado composto por uma camisa polo azul-escuro de manga curta com botões e calção de tom bege claro.', 
    59.90, 
    'P', 
    'Azul e Bege', 
    10, 
    'm-conjazul-peca.webp', 
    'm-conjazul-corpo.webp', 
    2, 
    1
),
(
    'Fato de Treino Coolest Urbano em Moletom', 
    'Conjunto de frio confortável composto por camisola de moletom branca com grafite urbano escrito Coolest e calças cargo verde tropa.', 
    59.90, 
    'P', 
    'Branco e Verde', 
    10, 
    'm-conjfriocolest-peca.webp', 
    'm-conjfriocolest-corpo.webp', 
    2, 
    1
),
(
    'Fato de Treino Moletom Cinza com Listras Laterais', 
    'Conjunto de inverno em moletom cinza claro, contendo camisola e calças desportivas com listras vermelhas nas laterais e bordado de cavalo.', 
    59.90, 
    'P', 
    'Cinza e Vermelho', 
    10, 
    'm-conjuntofrio-peca.webp', 
    'm-conjfriovermelho-corpo.webp', 
    2, 
    1
),
(
    'Conjunto Camiseta Marvel Avengers com Bermuda', 
    'Conjunto infantil temático com camiseta cinza de manga curta estampada com os heróis da Marvel (Avengers) e bermuda cinza combinando.', 
    59.90, 
    'P', 
    'Cinza', 
    10, 
    'm-camisamarvel-peca.webp', 
    'm-camisamarvel-corpo.webp', 
    2, 
    1
),
(
    'Conjunto de Frio Moletom Dinossauro', 
    'Conjunto infantil de inverno em moletom confortável, composto por blusa azul-escura com estampa divertida de dinossauro e calça de moletom cinza mescla.', 
    59.90, 
    'P', 
    'Azul e Cinza', 
    10, 
    'm-conjfrio-dino-peca.jpeg', 
    'm-conjfrio-dino-corpo.jpeg', 
    2, 
    1
),
(
    'Conjunto de Frio Moletom Urso Marrom', 
    'Fato de treino infantil em moletom aconchegante, composto por casaco marrom com estampa frontal de ursinho e calça de moletom preta.', 
    59.90, 
    'P', 
    'Marrom e Preto', 
    10, 
    'm-conjfrio-marrom-peca.jpeg', 
    'm-conjfrio-marrom-corpo.jpeg', 
    2, 
    1
);

-- fantasias
INSERT INTO produtos (
    nome, 
    descricao, 
    preco, 
    tamanho, 
    cor, 
    quantidade_estoque, 
    imagem, 
    imagem_corpo, 
    id_categoria, 
    id_vendedor
) VALUES 
(
    'Fantasia Princesa Jasmine', 
    'Fantasia infantil inspirada na Princesa Jasmine, composta por top cropped azul-turquesa com detalhes dourados e calça estilo bufante combinando.', 
    59.90, 
    'P', 
    'Azul-Turquesa', 
    10, 
    'fantasia-jasmine-peca.webp', 
    'fantasia-jasmine-corpo.webp', 
    4, 
    1
),
(
    'Fantasia Alice no País das Maravilhas', 
    'Fantasia infantil clássica da Alice, composta por um vestido azul claro com mangas bufantes, avental branco integrado e detalhes em renda.', 
    59.90, 
    'P', 
    'Azul e Branco', 
    10, 
    'fantasia-alice-peca.webp', 
    'fantasia-alice-corpo.webp', 
    4, 
    1
),
(
    'Fantasia Piloto de Corrida', 
    'Macacão de piloto de corrida infantil na cor vermelha com estampas temáticas de marcas de corrida, bandeira axadrezada e fecho frontal.', 
    59.90, 
    'P', 
    'Vermelho', 
    10, 
    'fantasia-corrida-peca.webp', 
    'fantasia-corrida-corpo.webp', 
    4, 
    1
),
(
    'Fantasia Princesa Tiana', 
    'Vestido de fantasia infantil inspirado na Princesa Tiana, com camadas em tons de verde e amarelo imitando pétalas de flor e detalhes brilhantes.', 
    59.90, 
    'P', 
    'Verde e Amarelo', 
    10, 
    'fantasia-tiana-peca.webp', 
    'fantasia-tiana-corpo.webp', 
    4, 
    1
),
(
    'Fantasia Mulher-Maravilha', 
    'Fantasia infantil inspirada na Mulher-Maravilha, composta por um vestido com topo vermelho e símbolo dourado, saia azul com estrelas brilhantes e cinto decorativo.', 
    59.90, 
    'P', 
    'Vermelho e Azul', 
    10, 
    'fantasia-mulhermaravilha-peca.webp', 
    'fantasia-mulhermaravilha-corpo.webp', 
    4, 
    1
),
(
    'Fantasia Batman com Capa', 
    'Fantasia infantil do Batman na cor preta com o clássico emblema do morcego amarelo no peito, detalhes de cinto utilitário impresso e capa acoplada.', 
    59.90, 
    'P', 
    'Preto e Amarelo', 
    10, 
    'fantasia-batman-peca.webp', 
    'fantasia-batman-corpo.webp', 
    4, 
    1
),
(
    'Fantasia Woody Toy Story', 
    'Fantasia infantil inspirada no Cowboy Woody de Toy Story, composta por uma camisa amarela axadrezada com colete de estampa de vaca integrado, lenço vermelho e bermuda azul.', 
    59.90, 
    'P', 
    'Amarelo e Azul', 
    10, 
    'fantasia-woody-peca.webp', 
    'fantasia-woody-corpo.webp', 
    4, 
    1
),
(
    'Fantasia Capitão América', 
    'Macacão de fantasia infantil do Capitão América em tons de azul, vermelho e branco, exibindo a icônica estrela no peito e detalhes texturizados do uniforme.', 
    59.90, 
    'P', 
    'Azul e Vermelho', 
    10, 
    'fantasia-capitaoamerica-peca.webp', 
    'fantasia-capitaoamerica-corpo.webp', 
    4, 
    1
);

-- pijamas
INSERT INTO produtos (
    nome, 
    descricao, 
    preco, 
    tamanho, 
    cor, 
    quantidade_estoque, 
    imagem, 
    imagem_corpo, 
    id_categoria, 
    id_vendedor
) VALUES 
(
    'Pijama Gatinha Marie', 
    'Pijama infantil confortável composto por camiseta de manga curta rosa claro com estampa da Gatinha Marie e calção estampado combinando.', 
    59.90, 
    'P', 
    'Rosa', 
    10, 
    'pijama-marrie-peca.webp', 
    'pijama-marrie-corpo.webp', 
    5, 
    1
),
(
    'Pijama Skye Patrulha Canina', 
    'Pijama infantil composto por camiseta de manga curta rosa com estampa da personagem Skye de Patrulha Canina e calção combinando.', 
    59.90, 
    'P', 
    'Rosa', 
    10, 
    'pijama-skye-peca.webp', 
    'pijama-skye-corpo.webp', 
    5, 
    1
),
(
    'Pijama Homem-Aranha', 
    'Pijama infantil temático do Homem-Aranha composto por camiseta de manga curta azul e vermelha com estampa de teia e calção combinando.', 
    59.90, 
    'P', 
    'Azul e Vermelho', 
    10, 
    'pijama-homemaranha-peca.webp', 
    'pijama-homemaranha-corpo.webp', 
    5, 
    1
),
(
    'Pijama Buzz Lightyear Toy Story', 
    'Pijama infantil inspirado no patrulheiro espacial Buzz Lightyear, imitando os detalhes clássicos do seu traje espacial em verde, roxo e branco.', 
    59.90, 
    'P', 
    'Branco e Verde', 
    10, 
    'pijama-buzz-peca.webp', 
    'pijama-buzz-corpo.webp', 
    5, 
    1
),
(
    'Pijama Fúria da Noite Como Treinar o Seu Dragão', 
    'Pijama infantil temático na cor preta inspirado no dragão Fúria da Noite (Banguela), com olhos verdes estampados no peito e detalhes característicos.', 
    59.90, 
    'P', 
    'Preto', 
    10, 
    'pijama-furiadanoite-peca.webp', 
    'pijama-furiadanoite-corpo.webp', 
    5, 
    1
),
(
    'Pijama Hello Kitty', 
    'Pijama infantil confortável composto por camiseta de manga curta branca com estampa frontal da Hello Kitty e calção rosa estampado.', 
    59.90, 
    'P', 
    'Branco e Rosa', 
    10, 
    'pijama-hellokitty-peca.webp', 
    'pijama-hellokity-corpo.webp', 
    5, 
    1
),
(
    'Pijama Unicórnio Mágico', 
    'Pijama infantil composto por camiseta de manga curta lilás com uma estampa fofa de unicórnio e calção estampado combinando.', 
    59.90, 
    'P', 
    'Lilás', 
    10, 
    'pijama-unicornio-peca.webp', 
    'pijama-unicornio-corpo.webp', 
    5, 
    1
),
(
    'Pijama Capitão América', 
    'Pijama infantil confortável de manga curta inspirado no herói Capitão América, com estampa do uniforme azul e o icônico escudo no peito, acompanhado de calção combinando.', 
    59.90, 
    'P', 
    'Azul e Vermelho', 
    10, 
    'pijama-capitaoamerica-peca.webp', 
    'pijama-capitaoamerica-corpo.jpeg', 
    5, 
    1
);

-- meninas 
INSERT INTO produtos (
    nome, 
    descricao, 
    preco, 
    tamanho, 
    cor, 
    quantidade_estoque, 
    imagem, 
    imagem_corpo, 
    id_categoria, 
    id_vendedor
) VALUES 
(
    'Conjunto Blusa Gatinha Marie e Shorts Saia', 
    'Conjunto infantil feminino com blusa branca de manga curta estampada com a Gatinha Marie e shorts saia rosa com amarração frontal.', 
    59.90, 
    'P', 
    'Branco e Rosa', 
    10, 
    'g-conj-gatamarrie-peca.webp', 
    'g-conj-gatamarrie-corpo.webp', 
    1, 
    1
),
(
    'Conjunto Camiseta Hello Kitty e Shorts Listrado', 
    'Conjunto charmoso composto por camiseta branca com estampa frontal da Hello Kitty e shorts com padrão de listras verticais em rosa e branco.', 
    59.90, 
    'P', 
    'Branco e Rosa', 
    10, 
    'g-conj-hellokitty-peca.webp', 
    'g-conj-hellokitty-corpo.webp', 
    1, 
    1
),
(
    'Conjunto Blusa Minnie Mouse com Babados e Shorts', 
    'Conjunto infantil com blusa branca de alças e detalhe em babado estampado com a Minnie Mouse, acompanhado de shorts vermelho liso.', 
    59.90, 
    'P', 
    'Branco e Vermelho', 
    10, 
    'g-conj-minnie-peca.webp', 
    'g-conj-minnie-corpo.webp', 
    1, 
    1
),
(
    'Conjunto Camiseta Amarela e Saia Jeans Azul', 
    'Conjunto casual composto por camiseta de manga curta amarela com estampa delicada e saia jeans azul claro com botões frontais.', 
    59.90, 
    'P', 
    'Amarelo e Azul', 
    10, 
    'g-conj-saiaazul-peca.webp', 
    'g-conj-saiaazul-corpo.webp', 
    1, 
    1
),
(
    'Conjunto de Frio Moletom Bambi Disney', 
    'Fato de treino confortável em moletom composto por casaco rosa de gola redonda com estampa do personagem Bambi e calça de moletom cinza mescla.', 
    59.90, 
    'P', 
    'Rosa e Cinza', 
    10, 
    'g-conjfrio-bambi-peca.webp', 
    'g-conjfrio-bambi-corpo.webp', 
    1, 
    1
),
(
    'Conjunto de Frio Moletom Moranguinho', 
    'Conjunto infantil de inverno em moletom confortável, composto por blusa rosa com capuz e estampa de morango, acompanhada de calça de moletom cinza.', 
    59.90, 
    'P', 
    'Rosa e Cinza', 
    10, 
    'g-conjfrio-morango-peca.webp', 
    'g-conjfrio-morango-corpo.webp', 
    1, 
    1
),
(
    'Macacão Pantacourt Colorido Listrado', 
    'Macacão infantil estilo pantacourt, leve e fresco, com padrão de listras verticais coloridas em tons pastéis e amarração nas alças.', 
    59.90, 
    'P', 
    'Colorido', 
    10, 
    'g-macolorido-peca.webp', 
    'g-macolorido-corpo.webp', 
    1, 
    1
),
(
    'Vestido Infantil Floral Azul e Branco', 
    'Vestido rodado super delicado na cor branca com estampa floral em tons de azul, alças finas e caimento leve.', 
    59.90, 
    'P', 
    'Branco e Azul', 
    10, 
    'g-vestidoazul-peca.webp', 
    'g-vestido-brancoazul-corpo.webp', 
    1, 
    1
);